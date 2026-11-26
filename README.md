# Paycheck Calculator

A US-only paycheck / take-home pay calculator for [afreetools.com](https://afreetools.com), served under `/finance/`.

**Estimate tier.** This tool produces a consumer-grade estimate for planning. It is not payroll-grade and is labelled as an estimate in the UI.

**Live:** [afreetools.com/finance/paycheck-calculator](https://afreetools.com/finance/paycheck-calculator) — national calculator plus **34 state pages** published (`/finance/paycheck-calculator/{state}`). 14 further state pages are built but unpublished.

> **Data status, in one line:** federal records use real IRS Rev. Proc. figures. State records are now three-tier: **3 verified** against primary law (VA, NC, FL), **48 transcribed** from the Tax Foundation's 2026 bracket table, and none left on the old three-band approximation. See [Accuracy and data verification](#accuracy-and-data-verification) for what the secondary tier does and does not model.

## Status

Phase 1 MVP implementation. See `docs/` for the full specification set.

| Doc | Contents |
|---|---|
| `docs/PRD-paycheck-calculator-phase1.md` | Scope, personas, acceptance criteria |
| `docs/KEYWORD-CONTENT-MAP-paycheck-calculator.md` | SEO terms, state waves, internal linking |
| `docs/TAX-DATA-SCHEMA-AND-FIXTURE-SPEC.md` | Data schema, engine contract, fixture spec, update runbook |

## Scope (Phase 1)

- One national calculator at `/finance/paycheck-calculator`
- Salary or hourly gross pay
- Federal income tax, Social Security, Medicare, Additional Medicare
- State income tax for all 50 states + DC
- Pre-tax and post-tax deductions, W-4 credits/adjustments
- Tax years 2025 and 2026
- "Show the math" transparency panel
- Display-first monetization (max 2 ad slots; not part of this repo)

## Not in Phase 1

State landing pages, local/municipal taxes, state disability and paid-leave programs,
multi-rate hourly input, W-4 multiple-jobs/multiple-earners worksheets, 1099/self-employment,
YTD accumulation, save/share results, accounts, PDF export. See the PRD's deferred section.

## Architecture

```
src/
  data/
    federal/us-fed-{2025,2026}.json   Federal brackets, FICA, standard deduction
    states/us-{xx}-{year}.json        Per-state records (50 + DC)
    states/index.json                 Ordered jurisdiction list for the UI
  engine/
    calculator.js                     Pure calculation functions. No rate data.
    data.js                           Node-side data loader
  ui/
    calculator-ui.js                  mount(root, deps) — framework-free
    calculator.css                    Mobile-first styles
test/
  calculator.test.js                  Golden fixtures + invariants
  fixtures/examples.json              Reviewed expected values
tools/
  build.mjs                           Bundles a standalone embeddable HTML file
  generate-state-data.mjs             Regenerates state JSON from the rate table
dist/
  paycheck-calculator.html            Self-contained, no external requests
```

Two principles drive the layout, per the tax-data spec:

1. **Rates live in data, logic lives in code.** The engine holds no tax numbers; every rate is injected.
2. **Rates are versioned by tax year.** Each record carries `source_url`, `last_verified`, and `version`.

## Usage

```js
import { calculate } from "./src/engine/calculator.js";
import { getFederal, getState } from "./src/engine/data.js";

const result = calculate(
  {
    pay_type: "salary",
    annual_salary: 75000,
    pay_frequency: "biweekly",
    filing_status: "single",
    state: "US-CA",
  },
  { federal: getFederal(2026), state: getState("US-CA", 2026) }
);

result.net_per_period; // 2213.41
result.trace;          // step-by-step math for the "show the math" panel
```

### Calculation order

Load-bearing. Do not reorder. See spec §7.2.

1. Gross pay per period
2. Pre-tax deductions (income-tax-reducing)
3. Pre-tax deductions (FICA-reducing)
4. Pre-tax deductions (post-tax)
5. Federal income tax
6. Social Security (wage-base capped)
7. Medicare
8. Additional Medicare (threshold-based)
9. State income tax
10. Net pay

## Continuous integration

`.github/workflows/ci.yml` gates every push and PR:

| Check | Catches |
|---|---|
| `node tools/build.mjs` + artifact existence | A build that silently produces nothing |
| No CDN references in `dist/` | The standalone file depending on a third party |
| `node --test test/*.test.js` | Golden fixture drift and calculation invariants |
| `php -l dist/wp/4-enqueue-snippet.php` | A PHP syntax error that would white-screen the site |
| Engine module loads and exports every symbol | A broken bundle reaching WordPress |
| `generate-state-data.mjs` produces no diff | Stale committed state data |

## Development

```bash
npm test              # golden fixtures + invariants
node tools/build.mjs  # rebuild dist/paycheck-calculator.html
node tools/generate-state-data.mjs
```

No dependencies. Node 20+ (uses `node:test`).

## Accuracy and data verification

Every tax record carries:

```json
{
  "source_url": "https://www.irs.gov/publications/p15t",
  "last_verified": "2026-10-02",
  "verified_by": "data-owner"
}
```

**Current state of the data — read before relying on it:**

- **Federal records** carry real IRS Rev. Proc. thresholds for 2025 and 2026.

State records for 2026 sit in one of three tiers, recorded in `verification`:

| Tier | Count | Meaning |
|---|---|---|
| `verified` | 3 | Read from the statute or the state DOR (VA, NC, FL). |
| `secondary` | 48 | Transcribed from the Tax Foundation's *2026 State Individual Income Tax Rates and Brackets*, which cites state statutes, forms and instructions. `verified_by` is `null` — nobody has yet checked these against the state's own publication. |
| `estimate` | 0 (2026) | The old three-band approximation. Still used for 2025 records outside VA, NC and FL. |

The transcription lives in `src/data/tax-foundation-2026.json` and is regenerated by
`tools/import-tax-foundation.mjs`, so the source can be re-fetched and diffed each year.

**What the secondary tier does not model**, and what the record notes say:

- Local and city income taxes — Maryland counties, Indiana counties, Ohio and
  Pennsylvania municipalities, New York City and Yonkers.
- State credits — Utah's taxpayer tax credit, Pennsylvania's tax forgiveness.
- Phase-outs on personal exemptions — Connecticut's $15,000 and Ohio's $2,400
  exemptions are applied at full value, so those two read low at higher incomes.
- Alabama's deduction for federal income tax paid.
- Married-filing-separately uses half the jointly-filed thresholds and
  head-of-household reuses the single schedule; both are conventions, not read
  from statute.

Promoting a state from `secondary` to `verified` means reading its DOR bracket table
and standard deduction and adding an entry to the `VERIFIED` map in
`tools/generate-state-data.mjs`. The schema is designed so this is a data-only change
with no engine edits.

## Deployment

Two targets.

**Standalone** — `dist/paycheck-calculator.html` is one self-contained file (data, engine,
UI inlined, no external requests). Host it anywhere.

**WordPress** (afreetools.com) — see **[docs/WORDPRESS-INTEGRATION.md](docs/WORDPRESS-INTEGRATION.md)**
for the full step-by-step. Summary:

| Artifact | Destination |
|---|---|
| `dist/paycheck-engine.js` | `/wp-content/uploads/tools/` |
| `dist/wp/1-paycheck-calculator-page.html` | Calculator Page body |
| `dist/wp/2-finance-hub-page.html` | `/finance` parent Page body |
| `dist/wp/3a-schema-webapplication.jsonld`, `3b-schema-faq.jsonld` | Rank Math schema field (one type per file) |
| `dist/wp/4-enqueue-snippet.php` | Child theme / snippet plugin |
| `dist/wp/state/*-page.html` | each state Page body (Phase 2) |
| `dist/wp/state/state-paycheck-enqueue-snippet.php` | snippet plugin — one snippet, all state pages |

The engine is an **external module**, not inlined, because WordPress's `wpautop` mangles
inline `<script type="module">` blocks. External loading also lets the engine stay cached
in visitors' browsers across UI edits.

Pages use **hierarchical URLs** (`/finance/paycheck-calculator`) rather than categories,
because WordPress categories apply only to Posts and these tools are Pages.
