# AGENTS.md

US paycheck calculator for afreetools.com. Engine is plain ES modules, no runtime
dependencies. WordPress serves the tool as a **Page** (not a Post).

## Commands

```bash
node tools/build.mjs        # regenerate everything in dist/
npm test                    # all tests (test/*.test.js)
node tools/generate-state-data.mjs   # regenerate src/data/states
```

`npm test` needs `dist/` to exist, so run the build first. Two tests lint and
execute the WordPress PHP snippet; they skip when PHP is absent locally. CI always
has PHP, so a broken snippet fails there.

## Layout

| Path | What it is |
|---|---|
| `src/engine/` | Tax math. `calculator.js`, `data.js`, `states/` |
| `src/ui/` | Form template + CSS |
| `tools/build.mjs` | Emits every deployable artifact |
| `dist/paycheck-engine.js` | External ES module uploaded to WordPress |
| `dist/paycheck-calculator.html` | **Standalone page. Never paste into WordPress.** |
| `dist/wp/*.html` | Page-body fragments to paste into WordPress |
| `dist/wp/3a-*.jsonld`, `3b-*.jsonld` | Schema, deliberately one type per file |
| `dist/wp/4-enqueue-snippet.php` | Enqueues the engine + prints schema |
| `docs/WORDPRESS-INTEGRATION.md` | The deployment runbook |

## Things that will bite you

**PHP inside a JS template literal loses its backslashes.** `tools/build.mjs` emits
the PHP snippet from a template literal. `\"` in the source becomes `"` in the
output, so a double-quoted PHP string ends up with bare quotes inside it and PHP
refuses to parse it. Build PHP format strings from single-quoted segments. This
shipped once and would have white-screened the site; the `php -l` test exists
because of it.

**`dist/paycheck-calculator.html` is not the WordPress artifact.** It is a full
document with `<head>` and inlined CSS. Pasting it into a Page injects a duplicate
`<head>`. Use `dist/wp/1-paycheck-calculator-page.html`, which is a fragment.

**The SEO plugin is Rank Math free.** Its Custom Schema tab exists but is not
operational (PRO only), and free allows one schema type per page. Rank Math already
emits `BreadcrumbList` and `Article`. `WebApplication` and `FAQPage` must come from
the PHP snippet. Do not tell users to paste JSON-LD into the Page body — `wpautop`
and `wptexturize` corrupt it silently.

**FAQPage markup must match visible text.** Google ignores FAQ rich results when
the markup does not correspond to on-page content. `tools/build.mjs` defines the
FAQ once and emits both copies; the PHP snippet holds a third. `deploy-artifacts.test.js`
asserts all three agree. Edit the list, never the outputs.

**State tax data is generated.** Run `tools/generate-state-data.mjs` after changing
rates. CI fails if `src/data/states` is stale.

## Conventions

- Accuracy target is consumer estimate, not payroll-system exactness. Say so in UI
  copy rather than implying precision.
- No external CDNs in build output; CI greps for them.
- Everything runs client-side. No user input leaves the browser.
- Rebuilt `dist/` artifacts are committed, since WordPress pulls them by raw URL.
