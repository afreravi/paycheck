# Tax-Data Schema & Golden-Fixture Spec — US Paycheck Calculator

Companion to `docs/PRD-paycheck-calculator-phase1.md` and `docs/KEYWORD-CONTENT-MAP-paycheck-calculator.md`.

| Field | Value |
|---|---|
| Product | US Paycheck Calculator |
| Scope | Phase 1 (consumer-estimate, national) with Phase 2 extension points |
| Status | Draft for review |
| Audience | Implementer (engine + data) |
| Last updated | 2026-10-02 |

> **Tax values in this document are illustrative placeholders.** Every rate, bracket, and threshold must be verified against the cited primary source (IRS Publication 15-T, state DOR) before use. This spec defines *structure and process*, not authoritative tax law.

---

## 1. Purpose

Define:
1. the **data model** for federal and state tax parameters,
2. the **engine interface** that consumes it,
3. the **golden-fixture format** that proves correctness,
4. the **CI gate** and **annual update runbook** that keep it correct over time.

The core principle: **rates live in data, logic lives in code.** An annual tax change must be a data-only edit that never touches the engine.

---

## 2. Design principles

| # | Principle | Consequence |
|---|---|---|
| P1 | Data-driven | Engine has zero hardcoded rates |
| P2 | Versioned by tax year | 2025 and 2026 coexist; never overwrite history |
| P3 | Source-traceable | Every record carries `source_url` + `last_verified` |
| P4 | Testable | Golden fixtures gate every data or engine change |
| P5 | Extensible | SDI/PFL and local taxes are reserved in-schema now, populated in Phase 2 |
| P6 | Deterministic | Same inputs + same tax year → identical output, always |

---

## 3. Repository layout

```
/finance-engine/
  data/
    federal/
      us-fed-2025.json
      us-fed-2026.json
    states/
      us-ca-2025.json
      us-ca-2026.json
      us-tx-2026.json
      ...
    index.json              # registry: which jurisdiction-years exist
  engine/
    index.*                 # public calculate() entry point
    federal.*               # federal income tax + FICA
    state.*                 # state income tax
    deductions.*            # pre/post-tax deduction handling
    annualize.*             # per-period <-> annual helpers
  fixtures/
    federal/
    states/
    scenarios/              # cross-cutting integration fixtures
  schema/
    federal.schema.json
    state.schema.json
    fixture.schema.json
```

---

## 4. Data model — federal record

One file per tax year. Example structure (values illustrative):

```json
{
  "jurisdiction": "US-FED",
  "tax_year": 2026,
  "version": "2026.1",
  "effective_from": "2026-01-01",
  "effective_to": null,
  "source_url": "https://www.irs.gov/publications/p15t",
  "last_verified": "2026-01-15",
  "verified_by": "data-owner",

  "fica": {
    "social_security_rate": 0.062,
    "social_security_wage_base": 184500,
    "medicare_rate": 0.0145,
    "additional_medicare_rate": 0.009,
    "additional_medicare_thresholds": {
      "single": 200000,
      "mfj": 250000,
      "mfs": 125000,
      "hoh": 200000
    }
  },

  "income_tax": {
    "method": "pub15t_percentage",
    "standard_deduction": {
      "single": 16100,
      "mfj": 32200,
      "mfs": 16100,
      "hoh": 24150
    },
    "brackets": {
      "single": [
        { "min": 0,      "max": 12400,  "rate": 0.10 },
        { "min": 12400,  "max": 50400,  "rate": 0.12 },
        { "min": 50400,  "max": 105700, "rate": 0.22 },
        { "min": 105700, "max": 201775, "rate": 0.24 },
        { "min": 201775, "max": 256225, "rate": 0.32 },
        { "min": 256225, "max": 640600, "rate": 0.35 },
        { "min": 640600, "max": null,   "rate": 0.37 }
      ],
      "mfj": [ "..." ],
      "mfs": [ "..." ],
      "hoh": [ "..." ]
    },
    "supplemental": {
      "flat_rate": 0.22,
      "high_earner_threshold": 1000000,
      "high_earner_rate": 0.37
    }
  }
}
```

**Field notes**
- `version` — bumped on any mid-year correction (e.g. `2026.2`). Engine selects latest `effective_from` ≤ check date.
- `brackets[].max = null` denotes the top bracket.
- `supplemental` is **reserved** — Phase 1 has no bonus mode (per PRD §5.3).

---

## 5. Data model — state record

```json
{
  "jurisdiction": "US-CA",
  "tax_year": 2026,
  "version": "2026.1",
  "effective_from": "2026-01-01",
  "effective_to": null,
  "source_url": "https://www.ftb.ca.gov/...",
  "last_verified": "2026-01-20",
  "verified_by": "data-owner",

  "no_income_tax": false,

  "income_tax": {
    "method": "annualized_brackets",
    "standard_deduction": { "single": 5540, "mfj": 11080, "mfs": 5540, "hoh": 11080 },
    "exemptions": { "personal_credit": 149, "dependent_credit": 461 },
    "brackets": {
      "single": [ { "min": 0, "max": 10756, "rate": 0.01 }, "..." ],
      "mfj":    [ "..." ],
      "mfs":    [ "..." ],
      "hoh":    [ "..." ]
    }
  },

  "sdi": null,
  "paid_leave": null,
  "local": []
}
```

**For a no-income-tax state** (e.g. TX, FL):

```json
{
  "jurisdiction": "US-TX",
  "tax_year": 2026,
  "no_income_tax": true,
  "income_tax": null,
  "sdi": null,
  "paid_leave": null,
  "local": []
}
```

**Reserved for Phase 2** (schema present, unpopulated in Phase 1):

```json
"sdi": {
  "rate": 0.012,
  "wage_base": null,
  "source_url": "..."
},
"paid_leave": {
  "employee_rate": 0.0035,
  "wage_base": null
},
"local": [
  {
    "name": "New York City",
    "type": "resident",
    "brackets": { "single": [ "..." ] }
  }
]
```

> The engine must treat `null`/absent `sdi`, `paid_leave`, and `local` as "not applicable", never as zero-rate-with-error. This is what makes Phase 2 additive rather than a rewrite.

---

## 6. Deduction model

Deductions are **not** tax data — they are user inputs with two behavioral flags:

| Deduction | `reduces_income_tax` | `reduces_fica` |
|---|---|---|
| Traditional 401(k) | true | true |
| HSA | true | true |
| Health FSA | true | true |
| Employer health premium (Section 125) | true | true |
| Roth 401(k) | false | false |
| Post-tax deduction | false | false |

```json
{
  "type": "traditional_401k",
  "amount": 500,
  "frequency": "per_period",
  "reduces_income_tax": true,
  "reduces_fica": true
}
```

**Engine rule:** maintain two separate wage bases — `income_tax_wages` and `fica_wages` — because the deduction flags differ. Do not compute one "taxable wages" number.

---

## 7. Engine interface

### 7.1 Public entry point

```
calculate(inputs, taxYear) -> Result
```

**Inputs** (mirrors PRD §5.1):

```json
{
  "pay_type": "salary",
  "annual_salary": 75000,
  "hourly_rate": null,
  "hours_per_week": 40,
  "overtime_hours": 0,
  "overtime_multiplier": 1.5,
  "pay_frequency": "biweekly",
  "filing_status": "single",
  "state": "US-CA",
  "w4": {
    "step3_credits": 0,
    "step4a_other_income": 0,
    "step4b_deductions": 0,
    "step4c_extra_withholding": 0
  },
  "deductions": [ "..." ]
}
```

**Result:**

```json
{
  "gross_per_period": 2884.62,
  "gross_annual": 75000,
  "federal_income_tax": 0,
  "social_security": 0,
  "medicare": 0,
  "additional_medicare": 0,
  "state_income_tax": 0,
  "pre_tax_deductions": 0,
  "post_tax_deductions": 0,
  "net_per_period": 0,
  "net_annual": 0,
  "effective_rate": 0,
  "marginal_rate": 0,
  "trace": [ "..." ]
}
```

`trace` powers the PRD's "show the math" requirement — an ordered list of steps with the formula, inputs, and result for each line.

### 7.2 Calculation order (fixed)

```
1. gross_per_period   = salary / periods, or (rate × hours) + OT
2. gross_annual       = gross_per_period × periods
3. income_tax_wages   = gross_annual − Σ(pre-tax deductions where reduces_income_tax)
4. fica_wages         = gross_annual − Σ(pre-tax deductions where reduces_fica)
5. federal_income_tax = pub15t(income_tax_wages, filing_status, w4)
6. social_security    = min(fica_wages, wage_base) × 0.062
7. medicare           = fica_wages × 0.0145
   additional_medicare = max(0, fica_wages − threshold) × 0.009
8. state_income_tax   = state(income_tax_wages, filing_status, state)
9. net_per_period     = gross_per_period
                        − (taxes_per_period)
                        − pre_tax_deductions_per_period
                        − post_tax_deductions_per_period
```

**Order is load-bearing.** FICA is computed on `fica_wages` (pre-tax income-tax deductions may still reduce it), and state tax uses the same income-tax wage base as federal. Do not reorder.

### 7.3 Federal method (Pub 15-T percentage method, annualized)

```
a. annual_wages = income_tax_wages + step4a_other_income − step4b_deductions
b. tentative    = bracket_tax(annual_wages, filing_status)     # marginal, not flat
c. credits      = step3_credits
d. annual_tax   = max(0, tentative − credits)
e. per_period   = annual_tax / periods + step4c_extra_withholding
```

`bracket_tax` applies each bracket's rate only to the income within that bracket. This is the single most error-prone function — it gets dedicated fixtures.

---

## 8. Golden-fixture format

```json
{
  "id": "fed-single-75000-ca-2026",
  "description": "Single filer, $75k salary, biweekly, California, no deductions",
  "tax_year": 2026,
  "inputs": { "...": "as in §7.1" },
  "expected": {
    "gross_per_period": 2884.62,
    "federal_income_tax": 0,
    "social_security": 0,
    "medicare": 0,
    "state_income_tax": 0,
    "net_per_period": 0,
    "effective_rate": 0
  },
  "tolerance": { "absolute": 0.01 },
  "verified": {
    "by": "data-owner",
    "date": "2026-02-01",
    "method": "manual Pub 15-T worksheet",
    "cross_check": "matches <public calculator> within $0.01"
  }
}
```

**Rules**
- `expected` values must be produced by a **named method** — manual worksheet, cross-check against a public calculator, or hand calculation — never by running the engine itself. Self-generated expectations prove nothing.
- `tolerance.absolute` is $0.01 (rounding).
- Every fixture documents how it was verified in `verified.method`.

---

## 9. Fixture coverage matrix

Minimum set for Phase 1 sign-off. **Filing status × income × state** — at least one fixture per cell, more where behavior differs.

**Income levels:** $30k, $40k, $75k, $150k, $250k, $700k
**Filing status:** single, mfj, mfs, hoh
**States:** CA, TX (no tax), NY, FL (no tax), IL (flat), PA (flat + local-reserved)

### 9.1 Required scenario classes

| Class | Why it matters | Example |
|---|---|---|
| Bracket boundaries | Off-by-one in marginal math | $12,400 / $12,401 single 2026 |
| Social Security cap | Wage base crossover | $184,499 / $184,500 / $184,501 |
| Additional Medicare | Threshold crossover | $199,999 / $200,000 / $200,001 single |
| MFJ threshold difference | $250k vs $200k | $249,999 / $250,000 MFJ |
| No-tax state | State must be exactly 0 | TX, FL |
| Flat-tax state | Single-rate path | IL, PA |
| Pre-tax 401(k) | Reduces income tax **and** FICA | $75k − $500/period |
| Roth 401(k) | Reduces neither | Contrast fixture |
| HSA | Reduces both | $75k + HSA |
| Post-tax deduction | Reduces net only | Garnishment-style |
| W-4 Step 3 credits | Credit floor at 0 | Credits > tentative tax |
| W-4 Step 4a/4b | Wage adjustments | Other income / deductions |
| W-4 Step 4c | Extra withholding | $25/period |
| Pay frequencies | Weekly/biweekly/semimonthly/monthly | Same salary, 4 fixtures |
| Hourly + overtime | Gross-pay path | $25/hr, 45 hrs @ 1.5× |
| Zero/edge inputs | Robustness | $0 salary, empty deductions |

### 9.2 Hand-computed reference examples

These should be implemented as fixtures and hand-verified:

**A. Federal bracket math — single, $75,000, 2026**
- Annual wages $75,000
- 10% on first $12,400 = $1,240
- 12% on $12,400→$50,400 = $38,000 × 0.12 = $4,560
- 22% on $50,400→$75,000 = $24,600 × 0.22 = $5,412
- Tentative annual = **$11,212** → biweekly = $11,212 / 26 = **$431.23**

**B. Social Security cap — $200,000, 2026**
- SS = min($200,000, $184,500) × 0.062 = **$11,439.00** (annual)
- Medicare = $200,000 × 0.0145 = $2,900.00
- Additional Medicare = ($200,000 − $200,000) × 0.009 = **$0.00** (single)
- At $200,001 single: additional = $0.009 × $1 = $0.009 → **$0.01** per year

**C. No-tax state — $75,000, TX**
- State income tax = **$0.00**, regardless of filing status

These numbers are derived from the illustrative brackets in §4 — **re-derive against verified Pub 15-T data before committing fixtures.**

---

## 10. Engine invariants

Assert these on every calculation in test mode:

| # | Invariant |
|---|---|
| I1 | `net_per_period = gross_per_period − taxes − pre_tax − post_tax` (± $0.01) |
| I2 | `net_per_period ≤ gross_per_period` |
| I3 | `0 ≤ effective_rate ≤ 1` |
| I4 | All tax outputs `≥ 0` |
| I5 | `social_security ≤ wage_base × 0.062` |
| I6 | `state_income_tax = 0` when `no_income_tax = true` |
| I7 | Same inputs + same tax year → byte-identical output (determinism) |
| I8 | `gross_annual = gross_per_period × periods` (± rounding) |
| I9 | Marginal rate matches the bracket containing `annual_wages` |

I1 and I6 catch the majority of real regressions.

---

## 11. CI gate

```
on: pull_request (data/**, engine/**, fixtures/**)

steps:
  1. validate  — every data file conforms to schema/*.schema.json
  2. validate  — every record has source_url + last_verified
  3. validate  — brackets are contiguous (max[n] == min[n+1]), no gaps/overlaps
  4. validate  — top bracket has max = null
  5. run       — all golden fixtures
  6. assert    — engine invariants (I1–I9) on every fixture
  7. fail      — if any fixture or invariant fails
```

**No data or engine change merges if the gate fails.** This is the mechanism that prevents a well-meaning annual update from silently breaking accuracy.

---

## 12. Annual update runbook

| Step | Action | Owner | Timing |
|---|---|---|---|
| 1 | Watch for IRS Pub 15-T release | Data owner | Oct–Dec |
| 2 | Watch for state DOR table releases | Data owner | Dec–Jan |
| 3 | Add new `*-YYYY.json` records | Data owner | On release |
| 4 | Update `index.json` registry | Data owner | On release |
| 5 | Re-derive reference examples (§9.2) | Data owner | On release |
| 6 | Add/adjust golden fixtures for new year | Data owner | On release |
| 7 | Run CI gate | Automated | On PR |
| 8 | Publish `last_updated` + sources on `/finance/methodology` | Content owner | On merge |
| 9 | Freeze prior year (set `effective_to`) | Data owner | On merge |
| 10 | Monitor for mid-year changes; version-bump if needed | Data owner | Ongoing |

**Freeze policy:** prior-year files are never edited after freeze except to correct a verified error — in which case bump `version` and document the correction.

---

## 13. Open questions

| # | Question | Impact | Recommendation |
|---|---|---|---|
| Q1 | Rounding policy — round per line or at the end? | Can shift net by cents | Round each tax line to cents, then sum |
| Q2 | Mid-period rate change — support proration in Phase 1? | Complexity | No; use rate effective on check date |
| Q3 | Local tax for remote/multi-state workers | Phase 2 | Defer; use work state |
| Q4 | Bonus/supplemental handling | Phase 2 | Schema reserved, engine not built |
| Q5 | State standard deduction vs. exemption credit | Accuracy | Model both where the state uses both |
| Q6 | Which public calculator to cross-check against | Verification | Pick 2, document variance |

---

## 14. Phase 2 extension points (build-for-extension)

The schema already reserves:
- `sdi`, `paid_leave` (state disability / family leave)
- `local[]` (municipal/county income tax)
- `income_tax.supplemental` (bonus withholding)

Adding these in Phase 2 means: populate data, extend the engine's step list, add fixtures. **No schema migration and no rewrite** — provided Phase 1 respects the `null`-means-not-applicable rule in §5.
