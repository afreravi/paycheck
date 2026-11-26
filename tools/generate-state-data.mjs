#!/usr/bin/env node
/**
 * Generates state tax data files for 2025 and 2026.
 *
 * ESTIMATE TIER: state records use a single progressive band structure
 * approximating each state's lowest and top marginal rates. This is
 * intentionally simplified per the Phase 1 decision (consumer estimate).
 * Brackets must be replaced with verified state DOR figures before any
 * payroll-grade use.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "data", "states");
mkdirSync(OUT, { recursive: true });

// [code, name, noIncomeTax, lowRate, topRate, standardDeduction(single)]
const STATES = [
  ["AL", "Alabama", false, 0.02, 0.05, 3000],
  ["AK", "Alaska", true, 0, 0, 0],
  ["AZ", "Arizona", false, 0.025, 0.025, 14600],
  ["AR", "Arkansas", false, 0.02, 0.039, 2340],
  ["CA", "California", false, 0.01, 0.133, 5540],
  ["CO", "Colorado", false, 0.044, 0.044, 14600],
  ["CT", "Connecticut", false, 0.02, 0.0699, 15000],
  ["DE", "Delaware", false, 0.022, 0.066, 3250],
  ["DC", "District of Columbia", false, 0.04, 0.1075, 14600],
  ["FL", "Florida", true, 0, 0, 0],
  ["GA", "Georgia", false, 0.0519, 0.0519, 12000],
  ["HI", "Hawaii", false, 0.014, 0.11, 2200],
  ["ID", "Idaho", false, 0.0525, 0.05695, 14600],
  ["IL", "Illinois", false, 0.0495, 0.0495, 2625],
  ["IN", "Indiana", false, 0.03, 0.0315, 1000],
  ["IA", "Iowa", false, 0.038, 0.038, 2210],
  ["KS", "Kansas", false, 0.031, 0.0558, 3500],
  ["KY", "Kentucky", false, 0.04, 0.04, 3160],
  ["LA", "Louisiana", false, 0.0185, 0.0425, 12500],
  ["ME", "Maine", false, 0.058, 0.0715, 14600],
  ["MD", "Maryland", false, 0.02, 0.0575, 2400],
  ["MA", "Massachusetts", false, 0.05, 0.09, 4400],
  ["MI", "Michigan", false, 0.0425, 0.0425, 5600],
  ["MN", "Minnesota", false, 0.0535, 0.0985, 14575],
  ["MS", "Mississippi", false, 0.04, 0.044, 2300],
  ["MO", "Missouri", false, 0.02, 0.047, 14600],
  ["MT", "Montana", false, 0.047, 0.059, 14600],
  ["NE", "Nebraska", false, 0.0246, 0.052, 7600],
  ["NV", "Nevada", true, 0, 0, 0],
  ["NH", "New Hampshire", true, 0, 0, 0],
  ["NJ", "New Jersey", false, 0.014, 0.1075, 1000],
  ["NM", "New Mexico", false, 0.015, 0.059, 14600],
  ["NY", "New York", false, 0.04, 0.109, 8000],
  ["NC", "North Carolina", false, 0.0425, 0.0425, 12750],
  ["ND", "North Dakota", false, 0.0195, 0.025, 14600],
  ["OH", "Ohio", false, 0.0275, 0.035, 0],
  ["OK", "Oklahoma", false, 0.0025, 0.0475, 6350],
  ["OR", "Oregon", false, 0.0475, 0.099, 2745],
  ["PA", "Pennsylvania", false, 0.0307, 0.0307, 0],
  ["RI", "Rhode Island", false, 0.0375, 0.0599, 10550],
  ["SC", "South Carolina", false, 0.0, 0.062, 14600],
  ["SD", "South Dakota", true, 0, 0, 0],
  ["TN", "Tennessee", true, 0, 0, 0],
  ["TX", "Texas", true, 0, 0, 0],
  ["UT", "Utah", false, 0.045, 0.045, 0],
  ["VT", "Vermont", false, 0.0335, 0.0875, 6500],
  ["VA", "Virginia", false, 0.02, 0.0575, 8500],
  ["WA", "Washington", true, 0, 0, 0],
  ["WV", "West Virginia", false, 0.0216, 0.0482, 0],
  ["WI", "Wisconsin", false, 0.035, 0.0765, 12760],
  ["WY", "Wyoming", true, 0, 0, 0],
];

// Approximate single-taxpayer band thresholds for the simplified two-band model.
const BAND_1 = 15000; // income below this uses lowRate
const BAND_2 = 100000; // income between BAND_1 and BAND_2 uses midRate (avg), above uses topRate

function pct(low, top) {
  return Number(((low + top) / 2).toFixed(5));
}

/**
 * Verified state data.
 *
 * Each entry replaces the simplified approximation with the state's actual
 * statutory rate schedule and standard deduction, read from a primary source
 * (state DOR publication or the statute itself). States not listed here stay
 * on the estimate tier.
 *
 * Add a state only after reading the bracket table at `source_url` for the
 * tax year in question — not from an aggregator.
 */
const VA_BRACKETS = [
  { min: 0, max: 3000, rate: 0.02 },
  { min: 3000, max: 5000, rate: 0.03 },
  { min: 5000, max: 17000, rate: 0.05 },
  { min: 17000, max: null, rate: 0.0575 },
];

const VERIFIED = {
  // Va. Code § 58.1-320 (rates) and § 58.1-322.03 (standard deduction).
  VA: () => ({
    source_url: "https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-320/",
    sources: [
      "https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-320/",
      "https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-322.03/",
    ],
    note:
      "Verified: 2% to $3,000, 3% to $5,000, 5% to $17,000, 5.75% above " +
      "(Va. Code § 58.1-320). Standard deduction $8,750 single / $17,500 " +
      "married for tax years beginning on or after 2025-01-01 and before " +
      "2027-01-01 (§ 58.1-322.03). Virginia applies one rate schedule to all " +
      "filing statuses; head of household is treated as single. The age " +
      "deduction is not modelled.",
    standard_deduction: { single: 8750, mfj: 17500, mfs: 4375, hoh: 8750 },
    brackets: { single: VA_BRACKETS, mfj: VA_BRACKETS, mfs: VA_BRACKETS, hoh: VA_BRACKETS },
  }),

  // NCDOR tax rate schedules + N.C.G.S. § 105-153.5 (standard deduction).
  NC: (year) => {
    const rate = year >= 2026 ? 0.0399 : 0.0425;
    const flat = [{ min: 0, max: null, rate }];
    return {
      source_url: "https://www.ncdor.gov/taxes-forms/tax-rate-schedules",
      sources: [
        "https://www.ncdor.gov/taxes-forms/tax-rate-schedules",
        "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-153.5.html",
      ],
      note:
        `Verified: flat ${(rate * 100).toFixed(2)}% rate for tax year ${year} ` +
        "(NCDOR: 4.25% for 2025, 3.99% for tax years after 2025). Standard " +
        "deduction per N.C.G.S. § 105-153.5: $12,750 single / $25,500 married " +
        "filing jointly / $19,125 head of household / $12,750 married filing " +
        "separately. Local income taxes do not exist in North Carolina.",
      standard_deduction: { single: 12750, mfj: 25500, mfs: 12750, hoh: 19125 },
      brackets: { single: flat, mfj: flat, mfs: flat, hoh: flat },
    };
  },

  // Fla. Const. Art. VII, § 5(a): no tax on the income of natural persons.
  FL: () => ({
    source_url: "https://www.flsenate.gov/Laws/Constitution",
    sources: ["https://www.flsenate.gov/Laws/Constitution"],
    note:
      "Verified: Florida levies no personal income tax. Article VII, section 5(a) " +
      "of the Florida Constitution prohibits a tax on the income of natural persons.",
  }),
};

const TF_SOURCE = JSON.parse(
  readFileSync(join(__dirname, "..", "src", "data", "tax-foundation-2026.json"), "utf8"),
);
const TF = TF_SOURCE.states;

/**
 * Brackets from the Tax Foundation table. The table lists only positive rates,
 * so a state whose first threshold is above zero (Idaho, Mississippi, Ohio)
 * starts with a 0% band rather than taxing the first dollars at its entry rate.
 */
function tfBrackets(pairs, scale = 1) {
  const out = [];
  if (pairs[0][0] > 0) out.push({ min: 0, max: Math.round(pairs[0][0] * scale), rate: 0 });
  for (let i = 0; i < pairs.length; i += 1) {
    const [min, rate] = pairs[i];
    const next = i + 1 < pairs.length ? Math.round(pairs[i + 1][0] * scale) : null;
    out.push({ min: Math.round(min * scale), max: next, rate });
  }
  return out;
}

const TF_MODEL_NOTE =
  "Rate schedule and deduction transcribed from the Tax Foundation's 2026 " +
  "table, which cites state statutes, forms and instructions; not yet checked " +
  "against the state DOR. Excludes local and city income taxes and state " +
  "credits, and applies personal exemptions at full value.";

// States whose divergence from this model is large enough to name in the record.
const TF_CAVEAT = {
  UT: "Utah replaced its deduction with a taxpayer tax credit, which this model does not apply; the state figure reads high.",
  PA: "Pennsylvania has no standard deduction or personal exemption, and the tax forgiveness credit for low incomes is not modelled.",
  CT: "Connecticut's $15,000 personal exemption phases out at higher incomes and is applied here at full value.",
  OH: "Ohio's personal exemption phases out above roughly $40,000 of income and is applied here at full value; municipal income taxes are excluded.",
  MD: "Maryland's county income tax (about 2.25% to 3.2%) is excluded, so the state figure reads low for most filers.",
  IN: "Indiana's county Local Income Tax is excluded, so the state figure reads low.",
  NY: "New York City and Yonkers resident taxes are excluded.",
  AL: "Alabama allows a deduction for federal income tax paid, which this model does not apply.",
};

function tfRecord(code) {
  const s = TF[code];
  if (!s || s.single.length === 0) return null;
  const single = s.deduction.single ?? s.personal_exemption.single ?? 0;
  const couple =
    s.deduction.couple ?? s.personal_exemption.couple ?? s.personal_exemption.single * 2 ?? single * 2;
  return {
    standard_deduction: {
      single,
      mfj: couple,
      mfs: Math.round(couple / 2),
      hoh: single,
    },
    brackets: {
      single: tfBrackets(s.single),
      mfj: tfBrackets(s.mfj),
      // Half of the jointly-filed thresholds is the usual convention for
      // married-filing-separately; headed-of-household reuses the single
      // schedule. Both are modelled rather than read, and are flagged as such.
      mfs: tfBrackets(s.mfj, 0.5),
      hoh: tfBrackets(s.single),
    },
  };
}

function buildRecord(code, name, noTax, low, top, stdDed, year) {
  const jurisdiction = `US-${code}`;
  const verified = VERIFIED[code]?.(year);
  const tfState = year === 2026 ? TF[code] : null;
  const tfNoTax = !!tfState && tfState.single.length === 0;
  const tf = !verified && year === 2026 && !noTax ? tfRecord(code) : null;
  const tier = verified ? "verified" : tf || (noTax && tfNoTax) ? "secondary" : "estimate";
  const base = {
    jurisdiction,
    tax_year: year,
    version: `${year}.1`,
    effective_from: `${year}-01-01`,
    effective_to: year === 2025 ? "2025-12-31" : null,
    source_url: verified?.source_url ?? (tf ? TF_SOURCE.source_url : "https://www.taxadmin.org/state-tax-rates"),
    last_verified: verified ? "2026-11-24" : tf ? TF_SOURCE.retrieved : "2026-10-02",
    // No record may claim a reviewer who has not read it.
    verified_by: verified ? "data-owner" : null,
    verification: tier,
    note: verified
      ? verified.note
      : noTax && tfNoTax
        ? `SECONDARY TIER: no wage income tax on wages, per the ${TF_SOURCE.source}.`
      : tf
        ? `SECONDARY TIER: ${TF_MODEL_NOTE}${TF_CAVEAT[code] ? ` ${TF_CAVEAT[code]}` : ""}`
        : "ESTIMATE TIER: simplified progressive bands approximating state marginal rates. Verify against state DOR tables before production payroll use.",
  };
  if (verified?.sources) base.sources = verified.sources;
  if (tf || (noTax && tfNoTax)) base.sources = [TF_SOURCE.source_url];

  if (noTax) {
    return {
      ...base,
      no_income_tax: true,
      income_tax: null,
      sdi: null,
      paid_leave: null,
      local: [],
    };
  }

  const mid = pct(low, top);
  const brackets = {
    single: [
      { min: 0, max: BAND_1, rate: low },
      { min: BAND_1, max: BAND_2, rate: mid },
      { min: BAND_2, max: null, rate: top },
    ],
    mfj: [
      { min: 0, max: BAND_1 * 2, rate: low },
      { min: BAND_1 * 2, max: BAND_2 * 2, rate: mid },
      { min: BAND_2 * 2, max: null, rate: top },
    ],
    mfs: [
      { min: 0, max: BAND_1, rate: low },
      { min: BAND_1, max: BAND_2, rate: mid },
      { min: BAND_2, max: null, rate: top },
    ],
    hoh: [
      { min: 0, max: BAND_1 * 1.5, rate: low },
      { min: BAND_1 * 1.5, max: BAND_2 * 1.5, rate: mid },
      { min: BAND_2 * 1.5, max: null, rate: top },
    ],
  };

  return {
    ...base,
    no_income_tax: false,
    income_tax: {
      method: "annualized_brackets",
      standard_deduction: verified?.standard_deduction ?? tf?.standard_deduction ?? {
        single: stdDed,
        mfj: stdDed * 2,
        mfs: stdDed,
        hoh: Math.round(stdDed * 1.5),
      },
      exemptions: null,
      brackets: verified?.brackets ?? tf?.brackets ?? brackets,
    },
    sdi: null,
    paid_leave: null,
    local: [],
  };
}

for (const year of [2025, 2026]) {
  for (const [code, name, noTax, low, top, stdDed] of STATES) {
    const rec = buildRecord(code, name, noTax, low, top, stdDed, year);
    const file = join(OUT, `us-${code.toLowerCase()}-${year}.json`);
    writeFileSync(file, JSON.stringify(rec, null, 2) + "\n");
  }
}

const index = {
  generated: "2026-10-02",
  states: STATES.map(([code, name, noTax]) => ({
    code: `US-${code}`,
    abbr: code,
    name,
    no_income_tax: noTax,
  })).sort((a, b) => a.name.localeCompare(b.name)),
};
writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`Generated ${STATES.length * 2} state data files + index.json in ${OUT}`);
