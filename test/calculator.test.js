import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { calculate, PERIODS, FILING_STATUSES } from "../src/engine/calculator.js";
import { getFederal, getState, getStateList } from "../src/engine/data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDoc = JSON.parse(readFileSync(join(__dirname, "fixtures", "examples.json"), "utf8"));

const TOL = 0.011; // rounding tolerance per spec (absolute $0.01)

function runFixture(fx) {
  return calculate(fx.inputs, {
    federal: getFederal(fx.tax_year),
    state: getState(fx.inputs.state, fx.tax_year),
  });
}

test("golden fixtures produce expected values", () => {
  for (const fx of fixtureDoc.fixtures) {
    const result = runFixture(fx);
    for (const [key, expected] of Object.entries(fx.expected)) {
      assert.ok(
        Math.abs(result[key] - expected) <= TOL,
        `${fx.id}: ${key} expected ${expected}, got ${result[key]}`
      );
    }
  }
});

test("engine invariants hold on every fixture", () => {
  for (const fx of fixtureDoc.fixtures) {
    const r = runFixture(fx);

    // I1: net = gross - taxes - deductions
    const taxes =
      r.federal_income_tax + r.social_security + r.medicare + r.additional_medicare + r.state_income_tax;
    const ded = r.pre_tax_deductions + r.post_tax_deductions;
    assert.ok(
      Math.abs(r.net_per_period - (r.gross_per_period - taxes - ded)) <= TOL,
      `${fx.id}: I1 net identity failed`
    );

    // I2: net <= gross
    assert.ok(r.net_per_period <= r.gross_per_period + TOL, `${fx.id}: I2 net>gross`);

    // I3: 0 <= effective rate <= 1
    assert.ok(r.effective_rate >= 0 && r.effective_rate <= 1, `${fx.id}: I3 effective rate`);

    // I4: no negative taxes
    for (const k of [
      "federal_income_tax",
      "social_security",
      "medicare",
      "additional_medicare",
      "state_income_tax",
    ]) {
      assert.ok(r[k] >= 0, `${fx.id}: I4 ${k} negative`);
    }

    // I5: SS capped by wage base
    const fed = getFederal(fx.tax_year);
    const ssMax = fed.fica.social_security_wage_base * fed.fica.social_security_rate;
    assert.ok(r.social_security * PERIODS[fx.inputs.pay_frequency] <= ssMax + TOL, `${fx.id}: I5 SS cap`);

    // I7: determinism
    const again = runFixture(fx);
    assert.deepEqual(again, r, `${fx.id}: I7 not deterministic`);

    // I8: gross annual = gross per period * periods.
    // Tolerance accounts for per-period rounding: each period contributes up
    // to half a cent of drift when a cent-rounded per-period figure is scaled.
    const periods = PERIODS[fx.inputs.pay_frequency];
    assert.ok(
      Math.abs(r.gross_annual - r.gross_per_period * periods) <= 0.005 * periods + TOL,
      `${fx.id}: I8 gross identity`
    );
  }
});

test("I6: no-income-tax states yield zero state tax", () => {
  const list = getStateList();
  const noTax = list.filter((s) => s.no_income_tax);
  assert.ok(noTax.length === 9, `expected 9 no-tax states, got ${noTax.length}`);
  for (const s of noTax) {
    const r = calculate(
      {
        pay_type: "salary",
        annual_salary: 100000,
        pay_frequency: "biweekly",
        filing_status: "single",
        state: s.code,
      },
      { federal: getFederal(2026), state: getState(s.code, 2026) }
    );
    assert.equal(r.state_income_tax, 0, `${s.code}: I6 expected 0 state tax`);
  }
});

test("all 51 jurisdictions load and calculate for both years", () => {
  const list = getStateList();
  assert.equal(list.length, 51, `expected 51 jurisdictions, got ${list.length}`);
  for (const year of [2025, 2026]) {
    for (const s of list) {
      const r = calculate(
        {
          pay_type: "salary",
          annual_salary: 60000,
          pay_frequency: "biweekly",
          filing_status: "single",
          state: s.code,
        },
        { federal: getFederal(year), state: getState(s.code, year) }
      );
      assert.ok(Number.isFinite(r.net_per_period), `${s.code} ${year}: non-finite net`);
      assert.ok(r.net_per_period > 0, `${s.code} ${year}: net not positive`);
    }
  }
});

test("federal bracket math straddles boundaries correctly", () => {
  const fed = getFederal(2026);
  const sd = fed.income_tax.standard_deduction.single;
  const base = {
    pay_type: "salary",
    pay_frequency: "annual",
    filing_status: "single",
    state: "US-TX",
  };
  const data = { federal: fed, state: getState("US-TX", 2026) };

  // taxable income exactly at top of 10% bracket (12,400) → all at 10%
  const atTop = calculate({ ...base, annual_salary: sd + 12400 }, data);
  const tAtTop = atTop.federal_income_tax;
  // one dollar into the 12% bracket adds exactly 12 cents
  const oneOver = calculate({ ...base, annual_salary: sd + 12401 }, data);
  assert.ok(
    Math.abs((oneOver.federal_income_tax - tAtTop) - 0.12) <= TOL,
    `expected +$0.12 crossing into 12% bracket, got ${oneOver.federal_income_tax - tAtTop}`
  );
  // marginal rate reports 12% just above the boundary, 10% just below
  assert.equal(atTop.marginal_rate, 0.1);
  assert.equal(oneOver.marginal_rate, 0.12);
});


test("supplemental and reserved Phase 2 fields present in schema", () => {
  const fed = getFederal(2026);
  assert.ok(fed.income_tax.supplemental, "supplemental rules reserved");
  const st = getState("US-CA", 2026);
  assert.ok("sdi" in st && "paid_leave" in st && "local" in st, "Phase 2 fields reserved");
});

test("invalid inputs throw", () => {
  const data = { federal: getFederal(2026), state: getState("US-TX", 2026) };
  assert.throws(
    () =>
      calculate(
        { pay_type: "salary", annual_salary: 1, pay_frequency: "biweekly", filing_status: "bogus", state: "US-TX" },
        data
      )
  );
  assert.throws(
    () =>
      calculate(
        { pay_type: "salary", annual_salary: 1, pay_frequency: "hourly", filing_status: "single", state: "US-TX" },
        data
      )
  );
});
