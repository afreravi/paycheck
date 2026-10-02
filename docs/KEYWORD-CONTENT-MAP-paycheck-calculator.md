# Keyword & Content Map — US Paycheck Calculator

Companion to `docs/PRD-paycheck-calculator-phase1.md`.

| Field | Value |
|---|---|
| Product | US Paycheck Calculator |
| Scope | Phase 1 (national MVP) + Phase 2 (state & satellite) planning |
| Status | Draft for review |
| Last updated | 2026-10-02 |

---

## 0. How to read this document

**Volume figures are labeled:**

- **[G] Grounded** — figure appears in a cited public source (Ahrefs free-tools study, published calculator traffic data). Reliable as an order of magnitude.
- **[E] Estimated** — directional band based on comparable terms, state population/labor-force, and search-intent logic. **Verify in Ahrefs/Semrush before committing budget.**

I do not have live API access to Ahrefs/Semrush, so I have not fabricated precise volumes for every term. Treat [E] rows as prioritization signals, not forecasts. The *relative* ordering is the deliverable; the absolute numbers need a tool pass.

**Grounded reference points used throughout:**

| Term | Volume | KD | Traffic potential | Source |
|---|---|---|---|---|
| paycheck calculator | 378,000 | 72 | 991,000 | [G] Ahrefs free-tools study |
| salary to hourly calculator | 42,000 | — | 45,940 | [G] Ahrefs |
| wage calculator | 17,000 | — | 17,776 | [G] Ahrefs (Gusto page) |
| annual income | 81,000 | — | 50,825 | [G] Ahrefs |
| Gusto hourly paycheck calculator page | — | — | ~17,800 visits/mo | [G] Ahrefs Site Explorer |
| Gusto salary paycheck calculator page | — | — | ~8,000 visits/mo | [G] Ahrefs Site Explorer |

**Key strategic read:** the head term is KD 72 — hard, not impossible, but not a Phase 1 target. Gusto, a non-calculator site, pulls ~26k visits/mo from two calculator pages. That is the model to copy: build the cluster, harvest long tail, approach the head term later.

---

## 1. Term tiers

| Tier | Definition | Phase | Strategy |
|---|---|---|---|
| **T0 — Head** | "paycheck calculator" (KD 72) | Phase 3 | Do not target directly yet |
| **T1 — Core intent** | Same intent, different phrasing; KD likely 40–65 | Phase 1 | **This is the MVP target set** |
| **T2 — Satellite tools** | Adjacent calculators with own pages | Phase 2 | Own pages, internally linked |
| **T3 — State/local** | "[State] paycheck calculator" | Phase 2 | Highest-volume long tail |
| **T4 — Informational** | "how much tax is taken out…" | Phase 1–2 | Blog content, feeds authority |
| **T5 — Long tail / questions** | FAQ-style, very low KD | Phase 1+ | FAQ blocks + content |

---

## 2. Phase 1 — MVP keyword map (single national page)

All T1 terms map to **one** page: `/finance/paycheck-calculator`. Do not build separate pages per synonym in Phase 1 — that creates cannibalization and thin content.

### 2.1 Primary target (T1)

| Keyword | Volume | Est. KD | Intent | Maps to |
|---|---|---|---|---|
| take home pay calculator | 60,000–90,000 [E] | 45–60 [E] | Tool | H1 + page |
| net pay calculator | 30,000–50,000 [E] | 40–55 [E] | Tool | H2 + copy |
| salary paycheck calculator | 20,000–35,000 [E] | 45–60 [E] | Tool | H2 + copy |
| hourly paycheck calculator | 15,000–25,000 [E] | 40–55 [E] | Tool | H2 + hourly mode |
| paycheck tax calculator | 8,000–15,000 [E] | 35–50 [E] | Tool | H2 + copy |
| gross to net calculator | 5,000–10,000 [E] | 30–45 [E] | Tool | H2 + copy |
| take home salary calculator | 5,000–10,000 [E] | 35–50 [E] | Tool | Copy variant |
| salary take home calculator | 3,000–6,000 [E] | 30–45 [E] | Tool | Copy variant |

**Target:** page ranks top 50 for ≥5 of these by day 90; top 20 for 2–3 by day 180.

### 2.2 Supporting informational content (T4) — Phase 1 blog

Each piece targets one intent, links to the calculator, and builds topical authority.

| # | URL slug | Primary keyword | Volume | Est. KD | Purpose |
|---|---|---|---|---|---|
| 1 | `how-much-tax-is-taken-out-of-my-paycheck` | how much tax is taken out of my paycheck | 3,000–8,000 [E] | 25–40 [E] | Highest-intent informational; direct calc funnel |
| 2 | `federal-tax-brackets-2026-explained` | federal tax brackets 2026 | 15,000–30,000 [E] | 40–60 [E] | Seasonal authority (Jan–Apr); brackets table |
| 3 | `fica-social-security-medicare-explained` | what is fica | 10,000–20,000 [E] | 30–45 [E] | Explains the biggest deduction |
| 4 | `w4-basics` | how to fill out a w4 | 20,000–40,000 [E] | 35–55 [E] | High volume; links to IN-8…IN-11 fields |
| 5 | `gross-pay-vs-net-pay` | gross pay vs net pay | 8,000–15,000 [E] | 25–40 [E] | Foundational; strong internal link hub |

**Phase 1 minimum:** publish #1 and #2. Target all 5 by end of Phase 1 + 30 days.

### 2.3 FAQ block targets (T5) — on the calculator page

On-page FAQ (FAQPage schema), 5–8 questions:

- How much tax is taken out of my paycheck?
- How do I calculate my take-home pay?
- What percentage of my paycheck goes to taxes?
- Why is my paycheck lower than my salary divided by 26?
- How does filing status affect my paycheck?
- Are 401(k) contributions tax deductible from my paycheck?
- What is FICA?
- Does this calculator include state taxes?

---

## 3. Phase 2 — Satellite calculator keyword map (T2)

Each becomes its own page under `/finance/`. Sequenced by volume-to-effort ratio.

| Priority | Proposed URL | Primary keyword | Volume | Est. KD | Build effort | Notes |
|---|---|---|---|---|---|---|
| 1 | `/finance/bonus-tax-calculator` | bonus tax calculator | 25,000–40,000 [E] | 30–45 [E] | Low | Supplemental wage rules; high seasonal (Dec–Feb) |
| 2 | `/finance/salary-to-hourly-calculator` | salary to hourly calculator | **42,000 [G]** | 30–45 [E] | Low | Grounded high volume; OmniCalculator gets ~46k TP |
| 3 | `/finance/hourly-to-salary-calculator` | hourly to salary calculator | 20,000–35,000 [E] | 30–45 [E] | Low | Inverse of #2; shared engine |
| 4 | `/finance/w4-withholding-calculator` | w4 withholding calculator | 20,000–40,000 [E] | 40–55 [E] | Medium | High intent; IRS estimator competes |
| 5 | `/finance/net-to-gross-calculator` | net to gross calculator / gross up calculator | 15,000–25,000 [E] | 30–45 [E] | Medium | PaycheckCity strength; worth contesting |
| 6 | `/finance/overtime-calculator` | overtime calculator | 20,000–40,000 [E] | 30–45 [E] | Low | Extends hourly mode |
| 7 | `/finance/401k-calculator` | 401k calculator | 40,000–70,000 [E] | 55–70 [E] | Medium | High volume but harder; retirement calculators crowded |
| 8 | `/finance/pay-raise-calculator` | pay raise calculator | 10,000–20,000 [E] | 25–40 [E] | Low | Simple; good internal linking |
| 9 | `/finance/1099-tax-calculator` | self employment tax calculator | 30,000–50,000 [E] | 45–60 [E] | High | Different audience (SE tax 15.3%); Phase 3 candidate |
| 10 | `/finance/relocation-salary-calculator` | cost of living salary calculator | 10,000–20,000 [E] | 35–50 [E] | Medium | Extends existing PPP Salary Converter asset |

**Recommendation:** build #1–#3 and #8 first — highest volume-to-effort, all reuse the core engine.

---

## 4. Phase 2 — State priority list (T3)

### 4.1 Scoring model

Each state scored on four factors:

| Factor | Weight | Rationale |
|---|---|---|
| **Demand** | 40% | Population / labor force → search volume proxy |
| **Tax complexity** | 30% | Local taxes / SDI / PFL → differentiation vs generic tools |
| **Strategic value** | 20% | Competitive gap, remote-work relevance, relocation traffic |
| **Build cost** | 10% (inverse) | Simpler state tax = cheaper to ship accurately |

### 4.2 Priority tiers

**Wave 1 — launch first (top 10)**

| # | State | Pop (M) | State income tax | Local tax | SDI/PFL | Why now |
|---|---|---|---|---|---|---|
| 1 | California | 39.0 | Yes (high) | No | SDI + PFL | Largest labor force; highest demand |
| 2 | Texas | 30.5 | **None** | No | No | Huge demand; zero state tax = easy, accurate page |
| 3 | New York | 19.6 | Yes | **NYC + Yonkers** | PFL | Highest complexity = biggest differentiation win |
| 4 | Florida | 22.6 | **None** | No | No | Large + simple + relocation magnet |
| 5 | Pennsylvania | 13.0 | Yes (flat) | **EIT/local** | No | Local tax depth; flat rate = easy engine |
| 6 | Illinois | 12.5 | Yes (flat) | No | No | Large, simple flat tax |
| 7 | Ohio | 11.8 | Yes | **Municipal** | No | Municipal tax = differentiation |
| 8 | Georgia | 11.0 | Yes | No | No | Large; flat-ish structure |
| 9 | North Carolina | 10.8 | Yes (flat) | No | No | Growing; simple flat tax |
| 10 | New Jersey | 9.3 | Yes | No | TDI + FLI | High complexity; dense population |

**Wave 2 — next 10**

| # | State | Pop (M) | Notable |
|---|---|---|---|
| 11 | Michigan | 10.0 | Flat tax; MI city taxes |
| 12 | Virginia | 8.7 | Large; straightforward |
| 13 | Washington | 7.8 | No income tax, but **PFML** (capital gains nuance) |
| 14 | Arizona | 7.4 | Flat tax; growth state |
| 15 | Massachusetts | 7.0 | **PFML**; 4% millionaire surtax |
| 16 | Tennessee | 7.0 | **No income tax** (Hall income tax repealed) |
| 17 | Indiana | 6.9 | **County income tax** — differentiation |
| 18 | Maryland | 6.2 | **County tax + PFL** — high complexity |
| 19 | Missouri | 6.2 | Straightforward |
| 20 | Wisconsin | 5.9 | Straightforward |

**Wave 3 — remaining high-value**

Colorado (**FAMLI**), Minnesota, South Carolina, Alabama, Louisiana, Kentucky, Oregon (**Paid Leave**), Oklahoma, Connecticut (**PFML**), Utah, Iowa, Nevada (no tax), Arkansas, Mississippi, Kansas, New Mexico, Nebraska, Idaho, West Virginia, Hawaii, New Hampshire (no wage tax), Maine, Montana, Rhode Island (**TDI**), Delaware, South Dakota (no tax), North Dakota, Alaska (no tax), Vermont, Wyoming (no tax), DC.

### 4.3 The complexity-first insight

Wave 1 is deliberately **not** ordered by population alone. New York (#3), Pennsylvania (#5), and Ohio (#7) rank above larger states in some cases because **their local/municipal taxes are where generic competitors fail.**

This is the strategic core of the state play: a state page that correctly handles NYC + Yonkers, PA EIT, or Ohio municipal tax is *defensibly better* than calculator.net, which does not. That is a ranking and trust advantage, not just a feature.

**No-tax states are the cheap wins** — TX, FL, TN, NV, WA, SD, WY, AK, NH. High demand, trivially accurate. Ship these early to build topical mass fast.

### 4.4 Per-state page template (all 51)

Each state page must carry:
- State-specific H1: "[State] Paycheck Calculator"
- State income tax brackets table (or "no state income tax" explainer)
- Local tax section where applicable
- SDI/PFL section where applicable
- Worked example at a common salary (e.g., $60,000)
- "How [State] compares" context
- Embedded/linked national calculator, pre-set to the state
- State-specific FAQ
- Cited state DOR source + last-updated

---

## 5. Phase 3 — Local / city pages (T3 extension)

Only after state pages mature. Highest-value candidates:

| Jurisdiction | Parent | Why |
|---|---|---|
| New York City | NY | 3.078–3.876% local tax; huge search demand |
| Yonkers | NY | Distinct local surtax |
| Philadelphia | PA | City wage tax |
| Columbus / Cleveland / Cincinnati | OH | Municipal income tax |
| Indianapolis | IN | County tax variation |
| Baltimore | MD | County/city tax |
| Portland | OR | Local + paid leave |
| Denver | CO | Occupational privilege tax |

---

## 6. Sequencing & content calendar

| Phase | Timeframe | Keyword work | Content work |
|---|---|---|---|
| Phase 1 | Weeks 0–10 | Target T1 set on one page; FAQ schema | 2 blog pieces (#1, #2); methodology page |
| Phase 1+ | Weeks 10–16 | T5 expansion | Blog #3–#5; begin link building |
| Phase 2a | Months 4–6 | Wave 1 states (10 pages) | State template + 10 pages |
| Phase 2b | Months 6–9 | Wave 2 states + satellites #1–#3, #8 | 10 more state pages + 4 tool pages |
| Phase 2c | Months 9–12 | Wave 3 states; satellites #4–#7 | Remaining state pages |
| Phase 3 | Months 12+ | Local pages; head-term push | City pages; PR/backlink campaign |

**Seasonal note:** federal tax bracket and W-4 content peaks Jan–Apr. Time blog #2 and #4 to publish by **early January** to catch the seasonal wave.

---

## 7. Internal linking map

```
/finance/ (hub)
   ├── /finance/paycheck-calculator (T1 core)
   │      ├── blog #1 how-much-tax...
   │      ├── blog #2 federal-tax-brackets-2026
   │      ├── blog #5 gross-pay-vs-net-pay
   │      ├── /finance/methodology
   │      └── [Phase 2] all 51 state pages + satellites
   ├── /finance/methodology
   ├── /finance/tax-data
   └── [Phase 2] satellite calculators ← cross-link each other
```

**Rules:**
- Every state page links up to the national calculator and sideways to 2–3 neighbor states.
- Every satellite tool links to the core calculator and to 2 related satellites.
- Every blog piece links to the calculator within the first 2 paragraphs.
- Methodology page linked from every calculator footer (E-E-A-T signal).

---

## 8. Quick wins vs. long-term bets

**Quick wins (rank fast, low KD, ship early):**
- No-tax state pages (TX, FL, TN, NV, WA, SD, WY, AK, NH)
- salary-to-hourly / hourly-to-salary (grounded 42k volume, low difficulty)
- pay raise calculator
- overtime calculator
- "gross pay vs net pay" content
- FAQ questions

**Long-term bets (high value, slow ramp):**
- "paycheck calculator" head term (KD 72)
- "take home pay calculator" (core but competitive)
- 401(k) calculator (crowded)
- NYC / complex local pages (high differentiation, slower trust build)

**Trap to avoid:** publishing 51 thin state pages at once before the national page has authority. Sequence matters — state pages inherit authority from the cluster, so the cluster must exist first.

---

## 9. Measurement plan

| Metric | Tool | Cadence |
|---|---|---|
| Rank for T1 terms | Rank tracker / GSC | Weekly |
| Rank for state terms | Rank tracker | Weekly after Phase 2a |
| Impressions by query | Google Search Console | Weekly |
| Calculator completion rate | Analytics | Weekly |
| State selection distribution | Analytics (`state_selected`) | Monthly → drives Wave 2 ordering |
| Topical authority growth | Referring domains, KD of ranking terms | Monthly |

**Feedback loop:** the `state_selected` analytics event from the PRD directly informs which state pages to build next. Real demand beats my population-based estimate — let the data reorder Wave 2 and 3.

---

## 10. Assumptions & caveats

1. **All [E] volumes require a tool verification pass** before budget commitments. I do not have live Ahrefs/Semrush API access.
2. KD estimates shift with SERP changes and competitor investment.
3. State volume roughly tracks labor force but is modulated by relocation/hiring activity and remote-work patterns.
4. Local-tax pages assume Phase 2 builds the local tax engine — currently out of Phase 1 scope per the PRD.
5. This map assumes the consumer-estimate accuracy tier; payroll-grade would change build-cost weights.
