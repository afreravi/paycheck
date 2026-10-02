# PRD — US Paycheck Calculator (Phase 1, National MVP)

| Field | Value |
|---|---|
| Product | US Paycheck Calculator — Phase 1 |
| Host | afreetools.com, under `/finance/` |
| Status | Draft for review |
| Owner | Rajshree (afreetools.com) |
| Version | 1.0 |
| Last updated | 2026-10-02 |

---

## 1. Overview

### 1.1 Problem
US workers want a fast, trustworthy answer to "what will my take-home pay actually be?" Existing options are either gated and ad-heavy (SmartAsset), dated and calculator-only (PaycheckCity), generic and inaccurate at the state level (calculator.net / OmniCalculator), or built as funnels into paid payroll software (ADP, Gusto). There is no clear "free, no-signup, transparent, US state-aware" paycheck calculator.

### 1.2 Solution
A single national paycheck calculator living at `afreetools.com/finance/paycheck-calculator` that:
- supports salary and hourly pay, all 50 states + DC,
- computes federal tax, FICA, state income tax, and user deductions,
- shows the full math behind the result ("show the math"),
- works instantly on mobile with no signup and no data storage.

This is a **consumer-grade estimate**, explicitly disclosed as such — not payroll-grade software.

### 1.3 Why now
- Large, high-intent, high-CPC finance search demand.
- afreetools.com already ships client-side tools and has an existing finance beachhead (PPP Salary Converter).
- Phase 1 establishes the topical authority and the in-house tax-data foundation that Phase 2 (state pages, satellites, monetization) will scale.

### 1.4 Phase 1 scope boundary
**In scope:** one national calculator, in-house 2025/2026 tax data for federal + simplified state income tax, supporting trust/content pages, display ads (AdSense-class), analytics.

**Out of scope (Phase 2+):** state-specific SEO landing pages, city/local taxes, SDI/paid-leave taxes, satellite calculators beyond the two named below, affiliate/lead-gen, public API, user accounts, saved scenarios, employer/multi-employee mode.

### 1.5 Locked decisions
| Decision | Choice |
|---|---|
| Accuracy tier | Consumer estimate (disclosed) |
| Placement | `afreetools.com/finance/` |
| Monetization | Display-first (AdSense-class), ad-light |
| Scope | National-only MVP |
| Data sourcing | Build in-house, versioned |

---

## 2. Goals & success metrics

### 2.1 Business goals
- Establish a credible finance/payroll presence on afreetools.com.
- Rank for realistic long-tail paycheck intent within 3–6 months.
- Build the data foundation Phase 2 needs, without rework.
- Begin display monetization at finance RPMs.

### 2.2 Product goals
- A visitor can get a clear take-home estimate in under 30 seconds on mobile.
- The result is explainable line by line.
- The tool is accurate enough for planning, and honest about its limits.

### 2.3 Success metrics (Phase 1, first 90 days post-launch)
| Metric | Target | Notes |
|---|---|---|
| Calculator completion rate (inputs → results) | ≥ 55% of sessions that start input | Core engagement signal |
| Mobile completion rate | Within 10 pts of desktop | Mobile-first requirement |
| Sessions to `/finance/paycheck-calculator` | Growth trend, no fixed target | New page, no baseline |
| Long-tail keyword positions | Top 50 for ≥ 5 target terms by day 90 | Realistic ramp |
| Accuracy feedback | < 2% "report an issue" rate | Trust guardrail |
| Page RPM | At or above finance vertical floor (~$8) | Once network is live |
| Page load (LCP, mobile) | < 2.5s | UX requirement |

### 2.4 Non-goals
- Matching an employer payroll system to the cent.
- Handling local/municipal taxes or paid-leave in Phase 1.
- Personalized tax advice.

---

## 3. Users & personas

| Persona | Need | How the MVP serves them |
|---|---|---|
| **W-2 employee checking a paycheck** | "Why is my net lower than I expected?" | Quick estimate with line-by-line math |
| **Job seeker / offer evaluator** | "What's the take-home on this salary?" | Salary + state + filing status in seconds |
| **Hourly worker** | "What do I net per pay period with overtime?" | Hourly mode, single rate, basic OT |
| **Relocating worker** | "How does take-home differ by state?" | State selector, no-tax states handled |
| **Budget planner** | "What if I contribute more to 401(k)?" | Pre-tax deduction inputs |

**Primary user:** W-2 employee or job seeker on a mobile device, who wants a fast, honest estimate without signing up.

---

## 4. Information architecture

```
/finance/                              Section hub: intro, links to tools + content
/finance/paycheck-calculator           THE MVP tool (national, all states)
/finance/methodology                   How we calculate, sources, last-updated dates
/finance/tax-data                      Current brackets/rates reference (static)
/finance/disclaimer                    Estimates, not tax advice
/finance/about                         Author/reviewer, why trust us (E-E-A-T)
```

**Content pages (Phase 1 supporting content, 2–4 pieces):**
```
/finance/blog/how-much-tax-is-taken-out-of-my-paycheck
/finance/blog/federal-tax-brackets-2026-explained
/finance/blog/fica-social-security-medicare-explained
/finance/blog/w4-basics
```

**Navigation:** add a `Finance` item to the main nav linking to `/finance/`. Update sitemap. Ensure canonical URLs and no duplicate content.

---

## 5. Functional requirements

### 5.1 Inputs

| ID | Input | Type | Required | Default | Notes |
|---|---|---|---|---|---|
| IN-1 | Pay type | Radio | Yes | Salary | Salary \| Hourly |
| IN-2 | Annual salary | Currency | If salary | — | Positive number |
| IN-3 | Hourly rate | Currency + hours/week | If hourly | 40 hrs | Single rate in Phase 1; multi-rate deferred to Phase 2 |
| IN-4 | Overtime hours | Number + multiplier | No | 0 / 1.5× | Basic; non-exempt assumption |
| IN-5 | Pay frequency | Select | Yes | Biweekly | Weekly, Biweekly, Semimonthly, Monthly |
| IN-6 | Filing status | Select | Yes | Single | Single, MFJ, MFS, HoH |
| IN-7 | State | Select | Yes | — | All 50 + DC |
| IN-8 | Dependents / credits amount | Currency | No | 0 | W-4 Step 3 style |
| IN-9 | Other income (annual) | Currency | No | 0 | W-4 Step 4(a) style |
| IN-10 | Deductions (annual) | Currency | No | 0 | W-4 Step 4(b) style |
| IN-11 | Extra withholding per period | Currency | No | 0 | W-4 Step 4(c) style |
| IN-12 | Pre-tax 401(k) | % or currency | No | 0 | Reduces federal + state taxable wages |
| IN-13 | Pre-tax HSA / FSA | Currency | No | 0 | Reduces taxable wages |
| IN-14 | Pre-tax health premium | Currency | No | 0 | Reduces taxable wages |
| IN-15 | Post-tax deductions | Currency | No | 0 | Reduces net only |
| IN-16 | Tax year | Select | Yes | 2026 | 2025 \| 2026 |

**Validation:** reject negatives; cap 401(k) % at plan-legal max with a soft warning; handle $0 and empty states gracefully; no required field beyond pay amount, frequency, filing status, and state.

### 5.2 Outputs

| ID | Output | Description |
|---|---|---|
| OUT-1 | Gross pay per period | From salary/hourly inputs |
| OUT-2 | Federal income tax | Per IRS Pub 15-T percentage method |
| OUT-3 | Social Security | 6.2% up to annual wage base |
| OUT-4 | Medicare | 1.45% + 0.9% additional over threshold |
| OUT-5 | State income tax | Simplified state brackets/standard deduction |
| OUT-6 | Total pre-tax deductions | Sum of IN-12…IN-14 |
| OUT-7 | Total post-tax deductions | IN-15 |
| OUT-8 | **Net take-home (per period + annual)** | Primary result |
| OUT-9 | Effective tax rate | Total tax ÷ gross |
| OUT-10 | Marginal rate | Top bracket reached |
| OUT-11 | "Show the math" breakdown | Expandable per-line explanation with formulas |
| OUT-12 | Last-updated date + sources | Visible near results |
| OUT-13 | Print / share | Printable result, copyable summary |

### 5.3 Calculation requirements (consumer-estimate tier)

**Included:**
- Federal income tax using the IRS Publication 15-T percentage method (annualized), 2025 and 2026 tables.
- FICA: Social Security 6.2% up to the annual wage base (**$176,100 for 2025; $184,500 for 2026**); Medicare 1.45% with 0.9% Additional Medicare Tax above $200,000 (single/HoH/MFS) and $250,000 (MFJ).
- State income tax via simplified brackets and standard deduction approximations for all taxing states; zero for no-income-tax states.
- Pre-tax deductions reduce federal/state taxable wages; FICA treatment of specific benefits handled per standard rules (e.g., 401(k) exempt from FICA; health premiums typically exempt).
- Supplemental-style flat treatment is **not** required in Phase 1 (no bonus mode).

**Explicitly excluded (must be disclosed in UI):**
- Local / municipal income taxes (NYC, Yonkers, Ohio munis, PA EIT, IN/MD counties, etc.).
- State disability and paid-leave taxes (CA SDI, NJ TDI/FLI, NY PFL, WA PFML, MA/CT PFML, CO FAMLI, OR Paid Leave, MD).
- Non-standard credits, itemized deductions, AMT, and multi-state allocation.
- Mid-year rate changes after the data freeze date.

**Accuracy framing (mandatory copy, near results):**
> "This is an estimate for planning. It covers federal tax, FICA, and simplified state income tax. It does not include local or paid-leave taxes. Your employer's payroll system may calculate a different amount."

### 5.4 "Show the math" requirement
Each result line must be expandable to reveal the formula and inputs used, e.g.:
- Federal: "Annualized taxable wages $X → Pub 15-T percentage method → $Y per period."
- FICA: "SS = min(wages, $184,500) × 6.2%; Medicare = wages × 1.45% (+0.9% over threshold)."
- State: "State taxable wages $X → [State] brackets → $Y."

This is the primary differentiator versus incumbents.

---

## 6. In-house tax-data requirements

### 6.1 Data model
One record per jurisdiction per tax year:

| Field | Description |
|---|---|
| `jurisdiction` | `US-FED`, `US-AL` … `US-DC` |
| `tax_year` | 2025, 2026 |
| `effective_date` | Date params take effect |
| `brackets` | Array of {threshold, rate} |
| `standard_deduction` | Amount (per filing status where applicable) |
| `allowances` / `exemptions` | Where applicable |
| `fica_params` | SS rate, wage base, Medicare rate, additional thresholds |
| `supplemental_rules` | Reserved (Phase 2) |
| `no_income_tax` | Boolean for the 9 no-tax states |
| `source_url` | IRS Pub 15-T / state DOR link |
| `last_verified` | Date last checked against source |

### 6.2 Layers
- `federal` — brackets, standard deduction, FICA, additional Medicare.
- `state` — brackets, standard deduction, no-tax flag.
- `engine` — pure calculation logic consuming data; no hardcoded rates.
- `fixtures` — golden test cases with expected outputs.

### 6.3 Governance & annual update process
- Annual calendar: IRS Pub 15-T and federal params (Oct–Dec); state tables (Dec–Jan).
- Monitor for mid-year legislative changes; document policy for post-freeze changes.
- Each year: add records → run golden tests → publish updated `last_updated` and source list on `/finance/methodology`.
- Keep prior year available (freeze old records; do not overwrite).
- Assign a named owner for the annual refresh.

### 6.4 Testing
- Golden fixtures for representative scenarios across income levels and states (e.g., $40k / $75k / $150k, single & MFJ, in CA, TX, NY, FL, IL).
- Cross-check a sample against a public calculator; document acceptable variance for the estimate tier.
- CI gate: a data update cannot merge if golden fixtures fail.

---

## 7. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-1 | Mobile-first, responsive; usable at 320px width |
| NFR-2 | LCP < 2.5s on mobile; calculator interactive fast |
| NFR-3 | Client-side calculation where practical; no account, no PII storage |
| NFR-4 | Accessible: keyboard operable, labeled inputs, WCAG 2.1 AA target |
| NFR-5 | Results persist on page reload within session (optional, non-blocking) |
| NFR-6 | Printable result and copyable/shareable summary |
| NFR-7 | No dark patterns; no forced signup; ads must not block the calculator |
| NFR-8 | Works without JavaScript for core explanatory content (progressive enhancement) |
| NFR-9 | Visible `last updated` date and source links |
| NFR-10 | Analytics events for completion, state selection, and feedback |

---

## 8. SEO & content requirements

- **Target long-tail intent first:** "take home pay calculator," "net pay calculator," "salary paycheck calculator," "hourly paycheck calculator," "how much tax is taken out of my paycheck," "gross to net calculator."
- **Do not over-invest in the head term** ("paycheck calculator," KD ~72) in Phase 1; this page builds the cluster foundation.
- **On-page:** intent-aligned H1; calculator above the fold; FAQ block with FAQPage schema; methodology link; internal links to supporting content.
- **Structured data:** FAQPage (and HowTo where appropriate). Validate.
- **E-E-A-T (YMYL critical):** author/reviewer byline with finance credentials; cited IRS/state sources with dates; methodology page; disclaimer; "we don't store your data" statement.
- **Technical:** clean canonical, sitemap submission, no duplicate/thin pages, fast mobile.

---

## 9. Monetization requirements (display-first)

- Launch with AdSense (or an existing qualified network).
- **Ad-light:** at most 2 ad units on the calculator page (e.g., below results and mid-content); never above the calculator or blocking inputs/results.
- Target finance vertical RPMs (~$8–$25/1,000 pageviews).
- Leave a reserved layout slot for a future "compare payroll tools" module — **do not build affiliate/lead-gen in Phase 1**.
- Monitor RPM and engagement together; if ads hurt completion rate, reduce density.

---

## 10. Analytics & instrumentation

| Event | Purpose |
|---|---|
| `calc_start` | First input interaction |
| `calc_complete` | Result rendered |
| `state_selected` | Informs Phase 2 state-page priority |
| `show_math_open` | Differentiator engagement |
| `print_share` | Utility usage |
| `report_issue` | Accuracy feedback |
| Pageview + scroll depth | Content engagement |

Also: Google Search Console setup, sitemap submission, rank tracking for target terms.

---

## 11. Content & copy requirements

| Page | Required elements |
|---|---|
| `/finance/paycheck-calculator` | H1, intro (2–3 sentences), calculator, accuracy disclaimer, FAQ (5–8 Qs), methodology link, last-updated |
| `/finance/methodology` | Data sources (IRS Pub 15-T, state DORs), calculation approach, excluded items, update cadence, last-updated per year |
| `/finance/disclaimer` | Estimates not advice; consult a professional |
| `/finance/about` | Author/reviewer bio + credentials; privacy stance |
| `/finance/tax-data` | 2025/2026 brackets, standard deductions, FICA rates, SS wage base, no-tax state list |
| Supporting blog (2–4) | One target intent each; link to calculator |

---

## 12. Dependencies & assumptions

- afreetools.com WordPress platform supports custom pages/templates and client-side JS (confirmed via current site).
- In-house data author can source and verify IRS Pub 15-T and state DOR tables for 2025 and 2026.
- AdSense (or equivalent) account is available/qualifiable.
- No dependency on paid tax APIs (per locked decision).

**Assumptions:** simplified state brackets are acceptable for an estimate tier; users accept the disclosed exclusions; traffic ramps gradually from long-tail.

---

## 13. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| "Estimate" users expect payroll-grade accuracy | Med | High | Loud disclosure, methodology page, avoid precision claims |
| In-house data goes stale / drifts | Med | High | Versioned data, golden tests, annual owner, visible last-updated |
| National-only = slow SEO start | High | Med | Target long-tail intent; use state-selection data for Phase 2 |
| Weak finance authority (YMYL) | High | High | E-E-A-T signals, cited sources, supporting content, backlinks later |
| Display revenue low at low traffic | High | Low | Treat Phase 1 as authority-building; monetization scales later |
| Ads degrade UX/completion | Med | Med | Ad-light cap; monitor completion rate |
| Accuracy bug erodes trust | Low | High | CI golden fixtures; cross-check vs public calculators |

---

## 14. Release plan & milestones

| # | Milestone | Output |
|---|---|---|
| M1 | Data foundation | 2025/2026 federal + state datasets with sources; schema defined |
| M2 | Golden fixtures | Test cases + expected outputs |
| M3 | Engine | Pure calculation logic consuming data |
| M4 | Calculator UI | Mobile-first, show-the-math, all inputs/outputs |
| M5 | Trust pages | Methodology, disclaimer, about, tax-data |
| M6 | SEO & analytics | FAQ schema, sitemap, Search Console, events |
| M7 | QA | Golden fixtures pass; spot-check vs public calculators |
| M8 | Launch | Live at `/finance/paycheck-calculator` |
| M9 | Supporting content | 2–4 blog pieces published; monitoring begins |

Indicative duration: ~8–10 weeks (per prior plan).

---

## 15. Acceptance criteria

Phase 1 is complete when:
1. `/finance/paycheck-calculator` is live, mobile-first, and usable with no signup.
2. A user can input salary or hourly pay, frequency, filing status, state, and deductions, and receive per-period and annual net pay.
3. Outputs break down federal, FICA, state, pre-tax and post-tax deductions.
4. "Show the math" explains each line.
5. All 50 states + DC are selectable; no-tax states correctly show zero state tax.
6. Accuracy disclaimer and last-updated date are visible on the results.
7. Methodology, disclaimer, about, and tax-data pages are live and linked.
8. Golden fixtures pass in CI; a documented spot-check against a public calculator is recorded.
9. At most 2 ad units, none blocking the calculator.
10. Analytics events fire; Search Console and sitemap are configured.
11. At least 2 supporting content pieces are published and internally linked.

---

## 16. Phase 2 preview (build-for-extension notes)

- **State landing pages**, priority: CA, TX, NY, FL, IL, PA, OH, WA, GA, NJ, NC, VA, MA, AZ, MI — then remaining + DC.
- **Satellite calculators:** bonus tax, net-to-gross, W-4 withholding, salary-to-hourly, hourly-to-salary, overtime, 401(k).
- **Multi-rate hourly input** (deferred from Phase 1, see IN-3).
- **Local taxes + SDI/paid-leave** states.
- **Embeddable widget** for backlinks/brand.
- **Affiliate / lead-gen** monetization layer.

Phase 1 must keep the engine data-driven and the IA extensible so these are additive, not a rewrite.
