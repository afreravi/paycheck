import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { STATE_PAGES, money } from "../tools/state-pages.mjs";
import { calculate } from "../src/engine/calculator.js";
import { getFederal, getState } from "../src/engine/data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const STATE = join(ROOT, "dist", "wp", "state");

const hasPhp = (() => {
  for (const c of [process.env.PHP_BIN, "php"].filter(Boolean)) {
    const r = spawnSync(c, ["-v"], { encoding: "utf8" });
    if (r.status === 0) return c;
  }
  return null;
})();

const baseName = (cfg) => `${cfg.abbr}-${cfg.slug}-paycheck-calculator`;
const readState = (cfg, suffix) => readFileSync(join(STATE, `${baseName(cfg)}-${suffix}`), "utf8");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const built = STATE_PAGES.every((cfg) => existsSync(join(STATE, `${baseName(cfg)}-page.html`)));

const HOOKS = [
  "tax_year",
  "pay_type",
  "pay_frequency",
  "filing_status",
  "state",
  "annual_salary",
  "hourly_rate",
  "hours_per_week",
  "overtime_hours",
  "w4_step3",
  "w4_step4c",
];

test("each state is generated as its own crawlable WordPress Page", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const page = readState(cfg, "page.html");
    assert.ok(page.length > 2000, `${cfg.slug}: page looks empty`);
    assert.ok(page.includes('id="paycheck-calculator"'), `${cfg.slug}: missing mount target`);
    assert.ok(
      page.includes(`value="${cfg.code}" selected`),
      `${cfg.slug}: state select is not pre-set to ${cfg.code}`
    );
    assert.ok(
      page.includes(`/finance/paycheck-calculator/${cfg.slug}`),
      `${cfg.slug}: page does not reference its own URL`
    );
    // Fragments are pasted into a WordPress Page; a full document would be wrong.
    assert.ok(!/<html[\s>]/i.test(page), `${cfg.slug}: must be a fragment, found <html>`);
    assert.ok(!/<!doctype/i.test(page), `${cfg.slug}: must be a fragment, found a doctype`);
    // The engine is loaded by the page-scoped snippet; an inline <script> would
    // both duplicate the mount and risk wpautop mangling it.
    assert.ok(!/<script/i.test(page), `${cfg.slug}: must not embed a <script> in the page body`);
  }
});

test("state page worked example matches the engine", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const page = readState(cfg, "page.html");
    const r = calculate(
      {
        pay_type: "salary",
        annual_salary: cfg.example.salary,
        pay_frequency: cfg.example.pay_frequency,
        filing_status: cfg.example.filing_status,
        state: cfg.code,
      },
      { federal: getFederal(cfg.example.tax_year), state: getState(cfg.code, cfg.example.tax_year) }
    );
    for (const [label, value] of [
      ["gross", r.gross_per_period],
      ["federal", r.federal_income_tax],
      ["social security", r.social_security],
      ["medicare", r.medicare],
      ["state", r.state_income_tax],
      ["net", r.net_per_period],
    ]) {
      assert.ok(
        page.includes(money(value)),
        `${cfg.slug}: worked example is missing the ${label} figure ${money(value)}`
      );
    }
  }
});

test("state FAQ markup matches its FAQPage schema word for word", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const page = readState(cfg, "page.html");
    const schema = JSON.parse(readState(cfg, "schema-faq.jsonld"));
    assert.equal(schema["@type"], "FAQPage");

    const visible = [
      ...page.matchAll(
        /<h4 class="rank-math-question\s*">([\s\S]*?)<\/h4>\s*<div class="rank-math-answer\s*">\s*<p>([\s\S]*?)<\/p>/g
      ),
    ].map((m) => ({ q: m[1].trim(), a: m[2].trim() }));
    assert.ok(visible.length >= 3, `${cfg.slug}: expected a visible FAQ section`);

    const markup = schema.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));
    assert.deepEqual(markup, visible, `${cfg.slug}: schema FAQ does not match the on-page FAQ`);
  }
});

test("state structured data is one type per file and points at the state URL", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const webapp = JSON.parse(readState(cfg, "schema-webapplication.jsonld"));
    const faq = JSON.parse(readState(cfg, "schema-faq.jsonld"));
    assert.equal(webapp["@type"], "WebApplication");
    assert.equal(faq["@type"], "FAQPage");
    assert.ok(!("@graph" in webapp) && !("@graph" in faq), `${cfg.slug}: must not use @graph`);

    const url = `https://afreetools.com/finance/paycheck-calculator/${cfg.slug}`;
    assert.equal(webapp.url, url, `${cfg.slug}: WebApplication url is wrong`);
    assert.notEqual(webapp.name, "Paycheck Calculator", `${cfg.slug}: must not reuse the national name`);
  }
});

test("state pages are not near-duplicates of one another", { skip: !built }, () => {
  // Google's scaled-content-abuse policy targets template clones. If two state
  // pages share most of their text, they are clones, and the whole section risks
  // being devalued. Keep genuinely distinct copy: this ceiling guards that.
  const words = (html) =>
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      // The review footer (Reviewed by / Last updated / Freshness / Disclaimer) is
      // identical on every state page by design, so it carries no doorway signal.
      // Exclude it, or it would inflate similarity as states are added.
      .replace(/<div class="gb-container gb-container-b53f53f1">[\s\S]*$/i, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  const bigrams = (ws) => {
    const s = new Set();
    for (let i = 0; i < ws.length - 1; i++) s.add(`${ws[i]} ${ws[i + 1]}`);
    return s;
  };
  const jaccard = (a, b) => {
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    return inter / (a.size + b.size - inter);
  };

  const docs = STATE_PAGES.map((cfg) => ({ slug: cfg.slug, bg: bigrams(words(readState(cfg, "page.html"))) }));
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const sim = jaccard(docs[i].bg, docs[j].bg);
      assert.ok(
        sim <= 0.6,
        `${docs[i].slug} and ${docs[j].slug} are ${(sim * 100).toFixed(0)}% identical — likely a doorway pair`
      );
    }
  }
});

test("state page form keeps every hook the engine binds to", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const page = readState(cfg, "page.html");
    for (const name of HOOKS) {
      assert.match(page, new RegExp(`name="${name}"`), `${cfg.slug}: form field "${name}" missing`);
    }
    assert.match(page, /<form class="pc"/, `${cfg.slug}: form.pc missing`);
  }
});

test("state PHP snippet is valid, page-scoped, and emits one WebApplication per state", { skip: !built || !hasPhp }, () => {
  const harness = join(__dirname, "fixtures", "wp-snippet-harness.php");
  const snippet = join(STATE, "state-paycheck-enqueue-snippet.php");

  const lint = spawnSync(hasPhp, ["-l", snippet], { encoding: "utf8" });
  assert.equal(lint.status, 0, `php -l failed:\n${lint.stdout}${lint.stderr}`);

  for (const cfg of STATE_PAGES) {
    const run = spawnSync(hasPhp, [harness, snippet, cfg.slug], { encoding: "utf8" });
    assert.equal(run.status, 0, `${cfg.slug}: harness failed:\n${run.stderr}`);
    const report = JSON.parse(run.stdout);
    assert.equal(report.invalid, 0, `${cfg.slug}: emitted invalid JSON-LD`);
    assert.equal(report.jsonldCount, 1, `${cfg.slug}: expected exactly one schema block`);
    assert.deepEqual(report.blocks.map((b) => b.type), ["WebApplication"], `${cfg.slug}: wrong schema type`);
    assert.equal(report.enqueued, 1, `${cfg.slug}: expected the engine to be enqueued once`);

    // The guard must keep the snippet off the national page and off Pages that
    // are not registered state pages, or the schema would be emitted site-wide.
    for (const other of ["paycheck-calculator", "about", "not-a-state-page"]) {
      const off = JSON.parse(spawnSync(hasPhp, [harness, snippet, other], { encoding: "utf8" }).stdout);
      assert.equal(off.jsonldCount, 0, `${cfg.slug} snippet leaked schema onto "${other}"`);
      assert.equal(off.enqueued, 0, `${cfg.slug} snippet leaked the engine onto "${other}"`);
    }
  }
});

test("one combined snippet replaces the per-state snippets", { skip: !built }, () => {
  const dir = STATE;
  const snippets = readdirSync(dir).filter((f) => f.endsWith("-enqueue-snippet.php"));
  assert.deepEqual(
    snippets,
    ["state-paycheck-enqueue-snippet.php"],
    "expected exactly one combined snippet and no per-state snippets"
  );
});

test("every state page carries the reviewed / updated / freshness / disclaimer footer", { skip: !built }, () => {
  for (const cfg of STATE_PAGES) {
    const page = readState(cfg, "page.html");
    assert.match(page, /<strong>Reviewed by:<\/strong>/, `${cfg.slug}: missing "Reviewed by"`);
    assert.match(page, /<strong>Last updated:<\/strong>/, `${cfg.slug}: missing "Last updated"`);
    assert.match(page, /<strong>Freshness:<\/strong>/, `${cfg.slug}: missing "Freshness"`);
    assert.match(page, /<strong>Disclaimer:<\/strong>/, `${cfg.slug}: missing "Disclaimer"`);

    // The dates must come from the state's tax data, not a hand-typed literal.
    const data = getState(cfg.code, cfg.example.tax_year);
    const [y, m, d] = data.last_verified.split("-");
    const formatted = `${MONTHS[Number(m) - 1]} ${d}, ${y}`;
    assert.ok(
      page.includes(`<strong>Last updated:</strong> ${formatted}`),
      `${cfg.slug}: Last updated is not the data's last_verified (${formatted})`
    );
    assert.ok(
      page.includes(`last reviewed ${formatted}`),
      `${cfg.slug}: Freshness does not cite last_verified (${formatted})`
    );

    // The footer must sit above the disclaimer, both after the last content heading.
    assert.ok(
      page.indexOf("Reviewed by:") < page.indexOf("Disclaimer:"),
      `${cfg.slug}: disclaimer should follow the review footer`
    );
  }
});

