import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WP = join(__dirname, "..", "dist", "wp");

const read = (f) => readFileSync(join(WP, f), "utf8");

// PHP is used to lint and execute the WordPress snippet. Local dev may not have
// it, so those tests skip; CI always does.
const hasPhp = (() => {
  for (const c of [process.env.PHP_BIN, "php"].filter(Boolean)) {
    const r = spawnSync(c, ["-v"], { encoding: "utf8" });
    if (r.status === 0) return c;
  }
  return null;
})();

// Both are emitted by tools/build.mjs; run `npm run build` (or node tools/build.mjs)
// before the suite if these are missing.
const built = existsSync(join(WP, "1-paycheck-calculator-page.html"));

test("schema is split into one type per file", { skip: !built }, () => {
  // Rank Math free accepts a single schema type per page, so combining them
  // into one @graph would silently drop all but the first.
  for (const [file, type] of [
    ["3a-schema-webapplication.jsonld", "WebApplication"],
    ["3b-schema-faq.jsonld", "FAQPage"],
  ]) {
    const doc = JSON.parse(read(file));
    assert.equal(doc["@type"], type, `${file} should be a bare ${type}`);
    assert.equal(doc["@context"], "https://schema.org");
    assert.ok(!("@graph" in doc), `${file} must not wrap types in @graph`);
  }
});

test("FAQPage markup matches the visible FAQ word for word", { skip: !built }, () => {
  // Google ignores FAQ rich results when the markup does not correspond to
  // text on the page, so the two copies must not drift.
  const page = read("1-paycheck-calculator-page.html");
  const php = read("4-enqueue-snippet.php");
  const schema = JSON.parse(read("3b-schema-faq.jsonld"));

  const visible = [...page.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map(
    (m) => ({ q: m[1].trim(), a: m[2].trim() })
  );
  assert.ok(visible.length >= 2, "expected a visible FAQ section on the page");

  const markup = schema.mainEntity.map((e) => ({
    q: e.name,
    a: e.acceptedAnswer.text,
  }));
  assert.deepEqual(markup, visible, "schema FAQ does not match the on-page FAQ");

  // The PHP snippet embeds its own copy; it must agree as well.
  for (const { q, a } of visible) {
    assert.ok(php.includes(q), `PHP snippet is missing question: ${q}`);
    assert.ok(php.includes(a), `PHP snippet is missing answer: ${q}`);
  }
});

test("no stale schema artifact is left behind", { skip: !built }, () => {
  assert.ok(
    !existsSync(join(WP, "3-schema.jsonld")),
    "3-schema.jsonld was replaced by 3a/3b and must not linger"
  );
});

test("page body is a fragment, not a full document", { skip: !built }, () => {
  const page = read("1-paycheck-calculator-page.html");
  assert.ok(!/<html[\s>]/i.test(page), "page snippet must not contain <html>");
  assert.ok(!/<head[\s>]/i.test(page), "page snippet must not contain <head>");
  assert.ok(!/<!doctype/i.test(page), "page snippet must not contain a doctype");
  assert.ok(page.includes('id="paycheck-calculator"'), "mount target is missing");
});

test("standalone build is a full document and is not the WP fragment", { skip: !built }, () => {
  const standalone = readFileSync(join(__dirname, "..", "dist", "paycheck-calculator.html"), "utf8");
  assert.match(standalone, /<!doctype html>/i);
  assert.match(standalone, /<html[\s>]/i);
});

test("PHP snippet is syntactically valid and emits the schema", { skip: !built || !hasPhp }, () => {
  const snippet = join(WP, "4-enqueue-snippet.php");
  const harness = join(__dirname, "fixtures", "wp-snippet-harness.php");

  const lint = spawnSync(hasPhp, ["-l", snippet], { encoding: "utf8" });
  assert.equal(lint.status, 0, `php -l failed:\n${lint.stdout}${lint.stderr}`);

  const run = spawnSync(hasPhp, [harness, snippet], { encoding: "utf8" });
  assert.equal(run.status, 0, `harness failed:\n${run.stderr}`);
  const report = JSON.parse(run.stdout);

  assert.equal(report.invalid, 0, "emitted invalid JSON-LD");
  assert.equal(report.jsonldCount, 2, "expected WebApplication + FAQPage");
  assert.deepEqual(
    report.blocks.map((b) => b.type).sort(),
    ["FAQPage", "WebApplication"]
  );
  assert.equal(report.blocks.find((b) => b.type === "FAQPage").questions.length, 4);
});

test("PHP snippet prints nothing on an unrelated page", { skip: !built || !hasPhp }, () => {
  // The is_page guard matters: emitting calculator schema site-wide would be wrong.
  const harness = join(__dirname, "fixtures", "wp-snippet-harness.php");
  const run = spawnSync(hasPhp, [harness, join(WP, "4-enqueue-snippet.php"), "about"], {
    encoding: "utf8",
  });
  const report = JSON.parse(run.stdout);
  assert.equal(report.jsonldCount, 0, "schema leaked onto a non-calculator page");
  assert.equal(report.enqueued, 0, "engine leaked onto a non-calculator page");
});
