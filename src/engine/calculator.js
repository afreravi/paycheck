/**
 * Pure paycheck calculation engine.
 *
 * The engine holds NO tax rates. All rate data is injected, per the
 * tax-data spec principle: "rates live in data, logic lives in code."
 *
 * Calculation order is load-bearing (see TAX-DATA-SCHEMA spec §7.2).
 * Do not reorder the steps.
 */

const PERIODS = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

const FILING_STATUSES = ["single", "mfj", "mfs", "hoh"];

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Marginal tax on a wage amount. Applies each bracket's rate only to the
 * income falling inside that bracket. This is the most error-prone
 * function in the engine and has dedicated fixtures.
 */
export function bracketTax(wages, brackets) {
  if (!brackets) return 0;
  let tax = 0;
  for (const b of brackets) {
    if (wages <= b.min) break;
    const top = b.max === null || b.max === undefined ? wages : b.max;
    const taxable = Math.min(wages, top) - b.min;
    if (taxable > 0) tax += taxable * b.rate;
  }
  return tax;
}

export function marginalRate(wages, brackets) {
  if (!brackets) return 0;
  let rate = 0;
  for (const b of brackets) {
    if (wages > b.min && (b.max === null || b.max === undefined || wages <= b.max)) {
      rate = b.rate;
    }
  }
  return rate;
}

function grossPerPeriod(inputs) {
  const periods = PERIODS[inputs.pay_frequency];
  if (inputs.pay_type === "salary") {
    return inputs.annual_salary / periods;
  }
  if (inputs.pay_type === "hourly") {
    const hours = inputs.hours_per_week ?? 40;
    const base = inputs.hourly_rate * hours;
    const ot = (inputs.overtime_hours ?? 0) * inputs.hourly_rate * (inputs.overtime_multiplier ?? 1.5);
    return base + ot;
  }
  throw new Error(`Unknown pay_type: ${inputs.pay_type}`);
}

function deductionAmount(d, periods) {
  const amt = d.frequency === "per_period" ? d.amount : d.amount / periods;
  return amt;
}

/**
 * @param {object} inputs
 * @param {object} data  { federal, state } — resolved records for the tax year
 * @returns {object} result with per-line amounts and a `trace` for "show the math"
 */
export function calculate(inputs, data) {
  const { federal, state } = data;
  if (!federal) throw new Error("Federal data required");
  if (!state) throw new Error("State data required");
  if (!FILING_STATUSES.includes(inputs.filing_status)) {
    throw new Error(`Unknown filing_status: ${inputs.filing_status}`);
  }

  const periods = PERIODS[inputs.pay_frequency];
  if (!periods) throw new Error(`Unknown pay_frequency: ${inputs.pay_frequency}`);

  const trace = [];
  const push = (label, formula, result) => trace.push({ label, formula, result: round2(result) });

  // 1. gross
  const gross_per_period = grossPerPeriod(inputs);
  const gross_annual = gross_per_period * periods;
  push("Gross pay per period", `$${round2(gross_annual)} annual / ${periods} periods`, gross_per_period);

  // 2-3. wage bases (deductions have different flags for income tax vs FICA)
  const deductions = inputs.deductions ?? [];
  let preIncomeTax = 0;
  let preFica = 0;
  let postTax = 0;
  for (const d of deductions) {
    const amt = deductionAmount(d, periods);
    if (d.reduces_income_tax) preIncomeTax += amt;
    if (d.reduces_fica) preFica += amt;
    if (!d.reduces_income_tax && !d.reduces_fica) postTax += amt;
  }
  const pre_tax_deductions = preIncomeTax;

  const income_tax_wages = gross_annual - preIncomeTax * periods;
  const fica_wages = gross_annual - preFica * periods;

  // W-4 adjustments
  const w4 = inputs.w4 ?? {};
  const annualWagesForFed =
    income_tax_wages + (w4.step4a_other_income ?? 0) - (w4.step4b_deductions ?? 0);

  // 5. federal income tax
  const stdDed = federal.income_tax.standard_deduction[inputs.filing_status] ?? 0;
  const taxableAfterStd = Math.max(0, annualWagesForFed - stdDed);
  const tentative = bracketTax(taxableAfterStd, federal.income_tax.brackets[inputs.filing_status]);
  const annualFed = Math.max(0, tentative - (w4.step3_credits ?? 0));
  const federal_income_tax = annualFed / periods + (w4.step4c_extra_withholding ?? 0);
  push(
    "Federal income tax",
    `($${round2(taxableAfterStd)} after $${stdDed} std deduction → brackets = $${round2(tentative)}) − credits, ÷ ${periods}`,
    federal_income_tax
  );

  // 6. FICA
  const ssBase = Math.min(fica_wages, federal.fica.social_security_wage_base);
  const social_security = (ssBase * federal.fica.social_security_rate) / periods;
  push(
    "Social Security",
    `min($${round2(fica_wages)}, $${federal.fica.social_security_wage_base}) × ${federal.fica.social_security_rate} ÷ ${periods}`,
    social_security
  );

  const medicare = (fica_wages * federal.fica.medicare_rate) / periods;
  push("Medicare", `$${round2(fica_wages)} × ${federal.fica.medicare_rate} ÷ ${periods}`, medicare);

  const amThreshold = federal.fica.additional_medicare_thresholds[inputs.filing_status];
  const addMedAnnual = Math.max(0, fica_wages - amThreshold) * federal.fica.additional_medicare_rate;
  const additional_medicare = addMedAnnual / periods;
  if (additional_medicare > 0) {
    push(
      "Additional Medicare",
      `max(0, $${round2(fica_wages)} − $${amThreshold}) × ${federal.fica.additional_medicare_rate} ÷ ${periods}`,
      additional_medicare
    );
  }

  // 8. state income tax
  let state_income_tax = 0;
  if (state.no_income_tax || !state.income_tax) {
    push("State income tax", `${state.jurisdiction} has no state income tax`, 0);
  } else {
    const sStd = state.income_tax.standard_deduction?.[inputs.filing_status] ?? 0;
    const sTaxable = Math.max(0, income_tax_wages - sStd);
    const sAnnual = bracketTax(sTaxable, state.income_tax.brackets[inputs.filing_status]);
    state_income_tax = sAnnual / periods;
    push(
      "State income tax",
      `$${round2(sTaxable)} after $${sStd} std deduction → ${state.jurisdiction} brackets ÷ ${periods}`,
      state_income_tax
    );
  }

  // 9. net
  const totalTaxPerPeriod =
    federal_income_tax + social_security + medicare + additional_medicare + state_income_tax;
  const totalDeductionsPerPeriod = preIncomeTax + postTax;
  const net_per_period = gross_per_period - totalTaxPerPeriod - totalDeductionsPerPeriod;

  const totalTaxAnnual = totalTaxPerPeriod * periods;
  const effective_rate = gross_annual > 0 ? totalTaxAnnual / gross_annual : 0;
  const marginal =
    marginalRate(taxableAfterStd, federal.income_tax.brackets[inputs.filing_status]) || 0;

  return {
    gross_per_period: round2(gross_per_period),
    gross_annual: round2(gross_annual),
    federal_income_tax: round2(federal_income_tax),
    social_security: round2(social_security),
    medicare: round2(medicare),
    additional_medicare: round2(additional_medicare),
    state_income_tax: round2(state_income_tax),
    pre_tax_deductions: round2(preIncomeTax),
    post_tax_deductions: round2(postTax),
    net_per_period: round2(net_per_period),
    net_annual: round2(net_per_period * periods),
    effective_rate: Number(effective_rate.toFixed(4)),
    marginal_rate: marginal,
    trace,
  };
}

export { PERIODS, FILING_STATUSES };
