import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WP = join(__dirname, "..", "dist", "wp");

const read = (f) => readFileSync(join(WP, f), "utf8");

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
