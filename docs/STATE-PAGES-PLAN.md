# Phase 2 — State Calculator Pages

How the state pages are built and why. Read this before adding a state.

Companion to `KEYWORD-CONTENT-MAP-paycheck-calculator.md` (§4 state priority list)
and `WORDPRESS-INTEGRATION.md` (deployment runbook).

---

## 1. Why the architecture is not "one JS page per state"

A single page whose content is swapped by JavaScript, or a URL parameter
(`?state=tx`), produces **one indexable URL** and thin, post-load HTML. Google
either never indexes the variants or ignores the content. That is what caused the
earlier problem on this site.

A second trap is worse: generating 51 pages from one template with only the state
name changed. That is **scaled content abuse / doorway pages**, and it can demote or
deindex the whole `/finance/` section — not just the state pages.

So each state is a **real WordPress Page**:

| Requirement | How it is met here |
|---|---|
| Unique URL | `/finance/paycheck-calculator/<state>`, a child Page of the calculator Page |
| Server-rendered HTML | WordPress Pages are PHP → static HTML. No content depends on JS to appear |
| Unique content | Per-state tax rules, worked example, FAQ, comparisons, citations (not the state name swapped in) |
| Self-canonical + own meta | Per-Page Rank Math SEO fields |
| Discoverable | WordPress sitemap picks up Pages automatically; state pages link up to the national calculator |
| Gradual rollout | Waves (10 → 10 → rest), not 51 at once |

The calculator **widget** stays JavaScript. That is fine: a tool is not content.
Google needs the *page content* (H1, tax explainer, worked example, FAQ, sources) in
the HTML, and it is.

---

## 2. How a state page is generated

`tools/state-pages.mjs` holds the `STATE_PAGES` config (one entry per state) and the
renderer. `tools/build.mjs` calls it and writes, per state, into `dist/wp/state/`:

```
<abbr>-<slug>-paycheck-calculator-page.html                  paste into the Page body
<abbr>-<slug>-paycheck-calculator-schema-webapplication.jsonld
<abbr>-<slug>-paycheck-calculator-schema-faq.jsonld

state-paycheck-enqueue-snippet.php                           ONE snippet for every state page
```

The **worked example is computed by the engine at build time**, using the same
`calculate()` the browser runs. The numbers on the page therefore cannot disagree
with the calculator. If the tax data changes, rebuild and the page updates.

There is **one** PHP snippet for all state pages, not one per state. It holds a
generated slug → {name, url, description} registry and guards on
`is_page( array( … ) )`, so adding a state means editing `STATE_PAGES` and
rebuilding — no new snippet, no plugin change. `build.mjs` deletes any leftover
per-state `*-enqueue-snippet.php` so an old page-scoped snippet cannot be deployed
by mistake.

The config also declares `hasIncomeTax`, and the renderer **fails the build** if it
disagrees with the state's tax data. Copy cannot silently claim the wrong thing.

---

## 3. What every state page carries

1. State-specific H1: "[State] Paycheck Calculator"
2. State income tax explainer — brackets table, or a "no state income tax" section
3. Local tax / SDI / paid-leave section where the state has them
4. A **worked example** at a common salary, computed from the engine
5. "How [State] compares" context
6. The calculator, pre-set to the state, with a notice if the visitor switches away
7. State-specific FAQ (the visible block and its `FAQPage` schema stay in sync)
8. Cited state revenue-authority source + last-verified date

---

## 4. Adding a state — the rules

1. Add an entry to `STATE_PAGES` in `tools/state-pages.mjs`.
2. **Write state-specific copy.** Never reuse another state's paragraphs. The
   `state-pages.test.js` uniqueness guard fails the build if two state pages exceed
   60% bigram similarity — that is the doorway-page tripwire.
3. Set `hasIncomeTax` from the state's actual law; the build cross-checks it against
   `src/data/states`.
4. Cite the state revenue authority (and the constitution/statute where relevant).
5. `node tools/build.mjs && npm test`, then commit the regenerated `dist/wp/state/`.
6. Deploy the Page + snippet (see `WORDPRESS-INTEGRATION.md`).

### Wave order (from the keyword map)

Wave 1: CA, **TX**, NY, FL, PA, IL, OH, GA, NC, NJ. Then Wave 2, then Wave 3.

---

## 5. Texas — the pilot

Chosen first because it is the **lowest-risk, most accurate** page: Texas has no
state income tax, no local income tax, and no SDI/paid-leave payroll tax, so the
only withholding is federal. The page's whole angle — "Texas does not tax wage
income" — is substantively different from every income-tax state, which is exactly
what keeps it from being a template clone.

- Live URL: `https://afreetools.com/finance/paycheck-calculator/texas`
- Worked example: $60,000, single, biweekly, 2026 → net **$1,938.08** per paycheck
- Sources: Texas Comptroller (`comptroller.texas.gov/taxes`), Texas Constitution
  Art. 8 §24-a, IRS Publication 15

Texas proves the pattern end-to-end before we scale to the complex states (NY
NYC/Yonkers, PA EIT, OH municipal), which are where the differentiation actually is.
