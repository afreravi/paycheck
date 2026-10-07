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
| `dist/wp/state/` | Phase 2 state pages (Texas first): fragment, schema, snippet |
| `tools/state-pages.mjs` | `STATE_PAGES` config + state-page renderer |
| `docs/STATE-PAGES-PLAN.md` | Why state pages are real Pages, and how to add one |
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
emits `BreadcrumbList`, `Article`, and `FAQPage` for the on-page FAQ block. Only
`WebApplication` must come from the PHP snippet. Do not tell users to paste JSON-LD
into the Page body — `wpautop` and `wptexturize` corrupt it silently.

**FAQPage markup must match visible text.** Google ignores FAQ rich results when
the markup does not correspond to on-page content. The live page's FAQ is a Rank Math
FAQ block, and Rank Math emits the matching `FAQPage`, so the PHP snippet deliberately
adds only `WebApplication` and no `FAQPage` of its own. `tools/build.mjs` holds the
canonical FAQ list for the page fragment and `3b-schema-faq.jsonld`;
`deploy-artifacts.test.js` asserts those two agree. The live FAQ is currently 11
questions and the list mirrors it — re-pasting the page fragment overwrites the live
FAQ, so update the list first if the live FAQ changes.

**State tax data is generated.** Run `tools/generate-state-data.mjs` after changing
rates. CI fails if `src/data/states` is stale.

**State pages are real Pages, never a JS route.** One template cloned across many
URLs is scaled content abuse and can devalue the whole `/finance/` section. Each state
is a WordPress Page with its own copy, and `tools/state-pages.mjs` renders it at build
time. The worked example is computed by the engine, so page copy cannot drift from the
calculator. `state-pages.test.js` fails the build if two state pages exceed 60% bigram
similarity (the doorway tripwire) or if a configured `hasIncomeTax` disagrees with the
tax data. A JS-swapped single page (`?state=tx`) is also wrong: it yields one
indexable URL. See `docs/STATE-PAGES-PLAN.md`.

**The WP page carries its own `<style>` block.** The theme loads Bootstrap 4.6.2,
which supplies the grid and utilities, but nothing styles `.pc-app` — a page that
only pastes the form markup renders as raw browser defaults. `tools/build.mjs`
inlines `src/ui/calculator.css` (the purple brand palette, shared with the other
calculators) into the page body. Keep markup Bootstrap-native so the theme does the
heavy lifting; the CSS file should only hold brand components.

**The standalone build has no Bootstrap.** `tools/build.mjs` prepends a small shim
covering just the classes the markup uses. If you add a Bootstrap class to
`calculator-ui.js`, add it to the shim too or the standalone page loses the style.

**`calculator-ui.js` is the single source of markup.** It is inlined into both the
standalone page and the engine, and called at build time to server-render the WP
fragment. The engine binds by `name`, `data-when`, and `data-out`; `mount()` finds
the form with `root.querySelector("form.pc")`. Renaming any of those breaks the
calculator silently. `deploy-artifacts.test.js` now asserts every hook exists in the
built page, so a rename fails the build rather than the browser.

## Conventions

- Accuracy target is consumer estimate, not payroll-system exactness. Say so in UI
  copy rather than implying precision.
- No external CDNs in build output; CI greps for them.
- Everything runs client-side. No user input leaves the browser.
- Rebuilt `dist/` artifacts are committed, since WordPress pulls them by raw URL.
