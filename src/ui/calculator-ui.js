/**
 * Paycheck calculator UI. Framework-free, mobile-first, accessible.
 *
 * mount(root, deps) where deps = { calculate, getStateList, getFederal, getState }
 * Keeps calculation in the engine and rendering here.
 */

const fmt = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const FREQUENCIES = [
  ["weekly", "Weekly"],
  ["biweekly", "Bi-weekly"],
  ["semimonthly", "Semi-monthly"],
  ["monthly", "Monthly"],
];

const FILING = [
  ["single", "Single"],
  ["mfj", "Married filing jointly"],
  ["mfs", "Married filing separately"],
  ["hoh", "Head of household"],
];

const DEDUCTION_PRESETS = [
  { id: "d401k", label: "401(k) / 403(b)", reduces_income_tax: true, reduces_fica: true, type: "traditional_401k" },
  { id: "hsa", label: "HSA", reduces_income_tax: true, reduces_fica: true, type: "hsa" },
  { id: "fsa", label: "FSA", reduces_income_tax: true, reduces_fica: true, type: "fsa" },
  { id: "health", label: "Health premium", reduces_income_tax: true, reduces_fica: true, type: "health_premium" },
  { id: "post", label: "Other post-tax deduction", reduces_income_tax: false, reduces_fica: false, type: "post_tax" },
];

export function template(states, options = {}) {
  const selectedState = options.selectedState ?? "US-CA";
  const field = (col, inner) => `      <div class="${col} pc-field mb-3">
        <div class="form-group mb-0">
${inner}
        </div>
      </div>`;

  const input = (id, name, label, opts = {}) => `          <label for="${id}">${label}</label>
          <div class="input-group">
            ${opts.prepend ? `<div class="input-group-prepend"><span class="input-group-text">${opts.prepend}</span></div>` : ""}
            <input class="form-control" id="${id}" name="${name}" type="number"
              min="${opts.min ?? 0}" step="${opts.step ?? "any"}" value="${opts.value}"
              inputmode="decimal"${opts.describedby ? ` aria-describedby="${opts.describedby}"` : ""} />
            ${opts.append ? `<div class="input-group-append"><span class="input-group-text">${opts.append}</span></div>` : ""}
          </div>
          ${opts.help ? `<small class="form-text text-muted"${opts.describedby ? ` id="${opts.describedby}"` : ""}>${opts.help}</small>` : ""}`;

  const select = (id, name, label, options) => `          <label for="${id}">${label}</label>
          <select class="custom-select" id="${id}" name="${name}">
            ${options}
          </select>`;

  return `
  <form class="pc" novalidate>
    <div class="row">
${field("col-12 col-md-4", select("pc-tax-year", "tax_year", "Tax year", `
            <option value="2026" selected>2026</option>
            <option value="2025">2025</option>`))}
${field("col-12 col-md-4", select("pc-pay-type", "pay_type", "Pay type", `
            <option value="salary" selected>Salary (annual)</option>
            <option value="hourly">Hourly</option>`))}
${field("col-12 col-md-4", select("pc-pay-frequency", "pay_frequency", "Pay frequency",
  FREQUENCIES.map(([v, l]) => `<option value="${v}"${v === "biweekly" ? " selected" : ""}>${l}</option>`).join("\n            ")))}
    </div>

    <div class="row" data-when="salary">
${field("col-12 col-md-6", input("pc-annual-salary", "annual_salary", "Annual salary", { value: "75000", step: "100", prepend: "$", describedby: "pc-salary-help", help: "Gross pay before any deductions." }))}
    </div>

    <div class="row" data-when="hourly" hidden>
${field("col-12 col-md-4", input("pc-hourly-rate", "hourly_rate", "Hourly rate", { value: "25", step: "0.01", prepend: "$" }))}
${field("col-12 col-md-4", input("pc-hours-week", "hours_per_week", "Hours / week", { value: "40", step: "1", append: "hrs" }))}
${field("col-12 col-md-4", input("pc-overtime-hours", "overtime_hours", "Overtime hours / week", { value: "0", step: "1", append: "hrs", help: "Paid at 1.5&times; your hourly rate." }))}
    </div>

    <div class="row">
${field("col-12 col-md-6", select("pc-filing-status", "filing_status", "Filing status",
  FILING.map(([v, l]) => `<option value="${v}">${l}</option>`).join("\n            ")))}
${field("col-12 col-md-6", select("pc-state", "state", "State",
  states.map((s) => `<option value="${s.code}"${s.code === selectedState ? " selected" : ""}>${s.name}</option>`).join("\n            ")))}
    </div>

    <p class="pc-intro-state pc-disclaimer small text-muted mt-2 mb-3" data-state-note hidden></p>

    <details class="pc-advanced mb-3">
      <summary>Deductions &amp; W-4 (optional)</summary>
      <div class="row mt-2">
${DEDUCTION_PRESETS.map((d) =>
  field("col-12 col-md-4", input(`pc-ded-${d.id}`, `ded_${d.id}`, `${d.label} <small class="text-muted">per period</small>`, { value: "0", step: "1", prepend: "$" }))
).join("\n")}
      </div>
      <div class="row">
${field("col-12 col-md-6", input("pc-w4-step3", "w4_step3", "W-4 Step 3 credits <small class=\"text-muted\">annual</small>", { value: "0", step: "1", prepend: "$" }))}
${field("col-12 col-md-6", input("pc-w4-step4c", "w4_step4c", "W-4 extra withholding <small class=\"text-muted\">per period</small>", { value: "0", step: "1", prepend: "$" }))}
      </div>
    </details>

    <button type="submit" class="btn btn-brand btn-lg btn-block">Calculate take-home pay</button>
  </form>

  <section class="pc-result mt-4" hidden aria-live="polite">
    <div class="pc-net stat-tile mb-4">
      <span class="pc-net-label stat-label">Net take-home pay <small>per period</small></span>
      <strong class="pc-net-value stat-value" data-out="net_per_period">&mdash;</strong>
      <span class="pc-net-annual stat-note" data-out="net_annual">&mdash;</span>
    </div>

    <h3 class="h6 font-weight-bold text-uppercase section-kicker mb-3">Where your pay goes</h3>
    <div class="table-responsive">
      <table class="pc-breakdown table table-sm table-striped mb-0">
        <tbody>
          <tr><th>Gross pay</th><td class="text-right" data-out="gross_per_period"></td></tr>
          <tr><th>Federal income tax</th><td class="text-right" data-out="federal_income_tax"></td></tr>
          <tr><th>Social Security</th><td class="text-right" data-out="social_security"></td></tr>
          <tr><th>Medicare</th><td class="text-right" data-out="medicare"></td></tr>
          <tr data-out-row="additional_medicare" hidden><th>Additional Medicare</th><td class="text-right" data-out="additional_medicare"></td></tr>
          <tr><th>State income tax</th><td class="text-right" data-out="state_income_tax"></td></tr>
          <tr><th>Pre-tax deductions</th><td class="text-right" data-out="pre_tax_deductions"></td></tr>
          <tr><th>Post-tax deductions</th><td class="text-right" data-out="post_tax_deductions"></td></tr>
          <tr class="pc-total"><th>Net pay</th><td class="text-right" data-out="net_per_period_total"></td></tr>
        </tbody>
      </table>
    </div>

    <p class="pc-rates small text-muted mt-3 mb-0">
      Effective tax rate <strong data-out="effective_rate"></strong> &middot;
      Marginal rate <strong data-out="marginal_rate"></strong>
    </p>

    <details class="pc-math mt-3">
      <summary>Show the math</summary>
      <ol data-out="trace"></ol>
    </details>

    <p class="pc-disclaimer small text-muted mt-3 mb-2">
      This is an estimate for planning. It covers federal income tax, FICA, and simplified state income tax.
      It does not include local or paid-leave taxes. Your employer's payroll system may calculate a different amount.
    </p>
    <p class="pc-updated small text-muted mb-0" data-out="updated"></p>
  </section>`;
}

export function mount(root, deps) {
  const { calculate, getStateList, getFederal, getState } = deps;

  // If the form is already server-rendered (WordPress), bind to it as-is.
  // Otherwise inject it (standalone build).
  if (!root.querySelector("form.pc")) {
    root.innerHTML = template(getStateList());
  }

  const form = root.querySelector("form");
  const result = root.querySelector(".pc-result");

  // State pages pre-select a state and warn when the visitor switches away, so
  // the on-page numbers stop matching the page they are reading.
  const stateNote = root.querySelector("[data-state-note]");
  if (stateNote) {
    const initial = form.elements.state.value;
    const updateNote = () => {
      if (form.elements.state.value === initial) {
        stateNote.hidden = true;
      } else {
        stateNote.hidden = false;
        stateNote.textContent =
          `You switched to ${form.elements.state.options[form.elements.state.selectedIndex].text}. ` +
          `This calculator works for every state.`;
      }
    };
    form.elements.state.addEventListener("change", updateNote);
    updateNote();
  }

  const togglePayType = () => {
    const pt = form.elements.pay_type.value;
    root.querySelectorAll("[data-when]").forEach((el) => {
      el.hidden = el.dataset.when !== pt;
    });
  };
  form.elements.pay_type.addEventListener("change", togglePayType);
  togglePayType();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    const taxYear = Number(f.tax_year.value);
    const payType = f.pay_type.value;

    const deductions = [];
    for (const d of DEDUCTION_PRESETS) {
      const amt = Number(f[`ded_${d.id}`]?.value || 0);
      if (amt > 0) {
        deductions.push({
          type: d.type,
          amount: amt,
          frequency: "per_period",
          reduces_income_tax: d.reduces_income_tax,
          reduces_fica: d.reduces_fica,
        });
      }
    }

    const inputs = {
      pay_type: payType,
      annual_salary: Number(f.annual_salary.value || 0),
      hourly_rate: Number(f.hourly_rate.value || 0),
      hours_per_week: Number(f.hours_per_week.value || 40),
      overtime_hours: Number(f.overtime_hours.value || 0),
      overtime_multiplier: 1.5,
      pay_frequency: f.pay_frequency.value,
      filing_status: f.filing_status.value,
      state: f.state.value,
      deductions,
      w4: {
        step3_credits: Number(f.w4_step3.value || 0),
        step4a_other_income: 0,
        step4b_deductions: 0,
        step4c_extra_withholding: Number(f.w4_step4c.value || 0),
      },
    };

    let res;
    try {
      res = calculate(inputs, {
        federal: getFederal(taxYear),
        state: getState(f.state.value, taxYear),
      });
    } catch (err) {
      result.hidden = false;
      result.querySelector(".pc-net-value").textContent = "Check your inputs";
      return;
    }

    const set = (k, v) => {
      const el = result.querySelector(`[data-out="${k}"]`);
      if (el) el.textContent = v;
    };
    set("net_per_period", fmt(res.net_per_period));
    set("net_annual", `${fmt(res.net_annual)} / year`);
    for (const k of [
      "gross_per_period",
      "federal_income_tax",
      "social_security",
      "medicare",
      "additional_medicare",
      "state_income_tax",
      "pre_tax_deductions",
      "post_tax_deductions",
    ]) {
      set(k, fmt(res[k]));
    }
    set("net_per_period_total", fmt(res.net_per_period));
    set("effective_rate", `${(res.effective_rate * 100).toFixed(1)}%`);
    set("marginal_rate", `${(res.marginal_rate * 100).toFixed(0)}%`);

    result.querySelector('[data-out-row="additional_medicare"]').hidden = res.additional_medicare <= 0;

    const ol = result.querySelector('[data-out="trace"]');
    ol.innerHTML = res.trace
      .map((t) => `<li><span class="pc-trace-label">${t.label}</span> <code>${t.formula}</code> = <strong>${fmt(t.result)}</strong></li>`)
      .join("");

    const fed = getFederal(taxYear);
    set("updated", `Tax data: ${fed.tax_year} (v${fed.version}), last verified ${fed.last_verified}.`);

    result.hidden = false;
  });

  return {
    setState(code) {
      form.elements.state.value = code;
    },
  };
}
