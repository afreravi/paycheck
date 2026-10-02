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

export function mount(root, deps) {
  const { calculate, getStateList, getFederal, getState } = deps;
  const states = getStateList();

  root.innerHTML = `
  <form class="pc" novalidate>
    <div class="pc-row">
      <label class="pc-field">
        <span>Tax year</span>
        <select name="tax_year">
          <option value="2026" selected>2026</option>
          <option value="2025">2025</option>
        </select>
      </label>
      <label class="pc-field">
        <span>Pay type</span>
        <select name="pay_type">
          <option value="salary" selected>Salary (annual)</option>
          <option value="hourly">Hourly</option>
        </select>
      </label>
    </div>

    <div class="pc-row" data-when="salary">
      <label class="pc-field">
        <span>Annual salary</span>
        <input name="annual_salary" type="number" min="0" step="100" value="75000" inputmode="decimal" />
      </label>
    </div>

    <div class="pc-row" data-when="hourly" hidden>
      <label class="pc-field">
        <span>Hourly rate</span>
        <input name="hourly_rate" type="number" min="0" step="0.01" value="25" inputmode="decimal" />
      </label>
      <label class="pc-field">
        <span>Hours / week</span>
        <input name="hours_per_week" type="number" min="0" step="1" value="40" inputmode="decimal" />
      </label>
      <label class="pc-field">
        <span>Overtime hours / week</span>
        <input name="overtime_hours" type="number" min="0" step="1" value="0" inputmode="decimal" />
      </label>
    </div>

    <div class="pc-row">
      <label class="pc-field">
        <span>Pay frequency</span>
        <select name="pay_frequency">
          ${FREQUENCIES.map(([v, l]) => `<option value="${v}"${v === "biweekly" ? " selected" : ""}>${l}</option>`).join("")}
        </select>
      </label>
      <label class="pc-field">
        <span>Filing status</span>
        <select name="filing_status">
          ${FILING.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}
        </select>
      </label>
      <label class="pc-field">
        <span>State</span>
        <select name="state">
          ${states.map((s) => `<option value="${s.code}"${s.abbr === "CA" ? " selected" : ""}>${s.name}</option>`).join("")}
        </select>
      </label>
    </div>

    <details class="pc-advanced">
      <summary>Deductions &amp; W-4</summary>
      <div class="pc-row">
        ${DEDUCTION_PRESETS.map(
          (d) => `
          <label class="pc-field">
            <span>${d.label} <small>(per period)</small></span>
            <input name="ded_${d.id}" type="number" min="0" step="1" value="0" inputmode="decimal" />
          </label>`
        ).join("")}
      </div>
      <div class="pc-row">
        <label class="pc-field">
          <span>W-4 Step 3 credits <small>(annual)</small></span>
          <input name="w4_step3" type="number" min="0" step="1" value="0" inputmode="decimal" />
        </label>
        <label class="pc-field">
          <span>W-4 extra withholding <small>(per period)</small></span>
          <input name="w4_step4c" type="number" min="0" step="1" value="0" inputmode="decimal" />
        </label>
      </div>
    </details>

    <button type="submit" class="pc-submit">Calculate take-home pay</button>
  </form>

  <section class="pc-result" hidden aria-live="polite">
    <div class="pc-net">
      <span class="pc-net-label">Net take-home pay <small>per period</small></span>
      <strong class="pc-net-value" data-out="net_per_period">—</strong>
      <span class="pc-net-annual" data-out="net_annual">—</span>
    </div>
    <table class="pc-breakdown">
      <tbody>
        <tr><th>Gross pay</th><td data-out="gross_per_period"></td></tr>
        <tr><th>Federal income tax</th><td data-out="federal_income_tax"></td></tr>
        <tr><th>Social Security</th><td data-out="social_security"></td></tr>
        <tr><th>Medicare</th><td data-out="medicare"></td></tr>
        <tr data-out-row="additional_medicare" hidden><th>Additional Medicare</th><td data-out="additional_medicare"></td></tr>
        <tr><th>State income tax</th><td data-out="state_income_tax"></td></tr>
        <tr><th>Pre-tax deductions</th><td data-out="pre_tax_deductions"></td></tr>
        <tr><th>Post-tax deductions</th><td data-out="post_tax_deductions"></td></tr>
        <tr class="pc-total"><th>Net pay</th><td data-out="net_per_period_total"></td></tr>
      </tbody>
    </table>
    <p class="pc-rates">
      Effective tax rate <strong data-out="effective_rate"></strong> ·
      Marginal rate <strong data-out="marginal_rate"></strong>
    </p>
    <details class="pc-math">
      <summary>Show the math</summary>
      <ol data-out="trace"></ol>
    </details>
    <p class="pc-disclaimer">
      This is an estimate for planning. It covers federal tax, FICA, and simplified state income tax.
      It does not include local or paid-leave taxes. Your employer's payroll system may calculate a different amount.
    </p>
    <p class="pc-updated" data-out="updated"></p>
  </section>`;

  const form = root.querySelector("form");
  const result = root.querySelector(".pc-result");

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
