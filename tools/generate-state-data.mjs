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
import { writeFileSync, mkdirSync } from "node:fs";
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
  ["UT", "Utah", false, 0.0455, 0.0455, 0],
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

function buildRecord(code, name, noTax, low, top, stdDed, year) {
  const jurisdiction = `US-${code}`;
  const base = {
    jurisdiction,
    tax_year: year,
    version: `${year}.1`,
    effective_from: `${year}-01-01`,
    effective_to: year === 2025 ? "2025-12-31" : null,
    source_url: "https://www.taxadmin.org/state-tax-rates",
    last_verified: "2026-10-02",
    verified_by: "data-owner",
    note: "ESTIMATE TIER: simplified progressive bands approximating state marginal rates. Verify against state DOR tables before production payroll use.",
  };

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
      standard_deduction: {
        single: stdDed,
        mfj: stdDed * 2,
        mfs: stdDed,
        hoh: Math.round(stdDed * 1.5),
      },
      exemptions: null,
      brackets,
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
