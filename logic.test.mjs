// Logic check for the whole calculation chain: every cash-flow row, NPV, IRR, both paybacks,
// the decision rule, LCOE, the table's payback rows and the negative-year explanation.
// Runs on the sample projects, both Excel BESS cases and 300 random scenarios.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCashflows, computeScenario } from './domain/model.js';
import { npv } from './domain/finance.js';
import { bessScenario } from './domain/bess.js';
import { DEMO_SCENARIOS } from './domain/demoData.js';
import { explainYear } from './domain/explain.js';

const close = (a, b, tol, label) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${label}: ${a} vs ${b}`);
const baht = (a, b, label) => assert.ok(Math.abs(a - b) <= 1e-4, `${label}: ${a} vs ${b} (more than 0.0001 baht apart)`);

// small deterministic random generator so failures are reproducible
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function randomScenario(r) {
  const life = 5 + Math.floor(r() * 26);
  const replace = r() < 0.4;
  return {
    initial_investment: 1e6 + r() * 2e7, project_life: life, discount_rate: 0.02 + r() * 0.12,
    revenue_y1: 2e5 + r() * 3e6, revenue_growth: r() * 0.05,
    om_y1: r() * 3e5, om_growth: r() * 0.04, other_y1: r() * 2e5, other_growth: r() * 0.04,
    salvage_value: r() * 1e6, replacement_year: replace ? 1 + Math.floor(r() * life) : 0, replacement_cost: replace ? r() * 5e6 : 0,
    energy_y1_kwh: 5e4 + r() * 5e5, decision_override: 'auto',
  };
}
const r = rng(20261109);
const CASES = [
  ...DEMO_SCENARIOS.map(s => [s.name, s]),
  ['Excel BESS min', bessScenario('min')], ['Excel BESS max', bessScenario('max')],
  ...Array.from({ length: 300 }, (_, i) => [`random #${i}`, randomScenario(r)]),
];
const signChanges = cfs => cfs.slice(1).reduce((n, v, i) => n + (Math.sign(v) && Math.sign(cfs[i]) && Math.sign(v) !== Math.sign(cfs[i]) ? 1 : 0), 0);

test('every cash-flow row follows the formulas', () => {
  for (const [name, s] of CASES) {
    const rows = buildCashflows(s);
    assert.equal(rows.length, s.project_life + 1, name + ' row count');
    assert.equal(rows[0].net_cf, -s.initial_investment, name + ' year 0 = −investment');
    let cum = 0, dcum = 0;
    for (const row of rows) {
      const t = row.year;
      if (t > 0) {
        close(row.revenue, s.revenue_y1 * (1 + s.revenue_growth) ** (t - 1), 1e-12, `${name} y${t} revenue`);
        close(row.om_cost, s.om_y1 * (1 + s.om_growth) ** (t - 1), 1e-12, `${name} y${t} O&M`);
        close(row.other_cost, s.other_y1 * (1 + s.other_growth) ** (t - 1), 1e-12, `${name} y${t} other`);
        assert.equal(row.replacement, s.replacement_year > 0 && t === s.replacement_year ? s.replacement_cost : 0, `${name} y${t} replacement only in its year`);
        assert.equal(row.salvage, t === s.project_life ? s.salvage_value : 0, `${name} y${t} salvage only in the last year`);
        close(row.net_cf, row.revenue - row.om_cost - row.other_cost - row.replacement + row.salvage, 1e-12, `${name} y${t} net`);
      }
      cum += row.net_cf; dcum += row.net_cf / (1 + s.discount_rate) ** t;
      baht(row.cumulative, cum, `${name} y${t} cumulative`);
      baht(row.discounted_cumulative, dcum, `${name} y${t} discounted cumulative`);
    }
  }
});

test('NPV, IRR and the accept/reject rule agree with the cash flows', () => {
  for (const [name, s] of CASES) {
    const res = computeScenario(s), cfs = res.cashflows.map(c => c.net_cf);
    close(res.npv, res.cashflows.at(-1).discounted_cumulative, 1e-9, name + ' NPV = last discounted cumulative');
    if (res.irr != null) assert.ok(Math.abs(npv(res.irr, cfs)) < 1e-3, `${name} NPV at IRR ≈ 0`);
    if (signChanges(cfs) === 1 && res.irr != null) {
      // conventional project: NPV > 0 exactly when IRR > discount rate
      assert.equal(res.npv > 0, res.irr > s.discount_rate, name + ' NPV sign matches IRR vs hurdle');
    }
    assert.equal(res.recommendation, res.irr != null && res.irr > s.discount_rate ? 'accept' : 'reject', name + ' recommendation');
    assert.equal(res.decisionFinal, res.recommendation, name + ' auto decision follows recommendation');
  }
});

test('payback is the first time the cumulative total reaches zero, interpolated inside that year', () => {
  for (const [name, s] of CASES) {
    const res = computeScenario(s);
    for (const [value, key] of [[res.payback, 'cumulative'], [res.discounted_payback, 'discounted_cumulative']]) {
      const rows = res.cashflows, first = rows.findIndex(row => row.year > 0 && row[key] >= 0);
      if (first < 0) { assert.equal(value, null, `${name} ${key}: never reaches zero → null`); continue; }
      assert.ok(value > first - 1 && value <= first, `${name} ${key}: payback ${value} inside year ${first}`);
      // the interpolated fraction lands exactly on zero
      const before = rows[first - 1][key], inYear = rows[first][key] - before;
      baht(before + (value - (first - 1)) * inYear, 0, `${name} ${key} interpolation`);
      // the table marks this same year
      assert.equal(Math.ceil(value), first, `${name} ${key}: badge row = year ${first}`);
    }
    if (signChanges(res.cashflows.map(c => c.net_cf)) === 1 && res.payback != null && res.discounted_payback != null) {
      assert.ok(res.discounted_payback >= res.payback - 1e-9, name + ' discounted payback is never sooner');
    }
  }
});

test('LCOE = PV of all costs ÷ PV of energy', () => {
  for (const [name, s] of CASES) {
    const res = computeScenario(s);
    const pv = (v, t) => v / (1 + s.discount_rate) ** t;
    const cost = res.cashflows.reduce((a, row) => a + pv(row.year === 0 ? s.initial_investment : row.om_cost + row.other_cost + row.replacement, row.year), 0);
    const energy = res.cashflows.reduce((a, row) => a + (row.year === 0 ? 0 : pv(s.energy_y1_kwh, row.year)), 0);
    close(res.lcoe, cost / energy, 1e-12, name + ' LCOE');
  }
});

test('Solar + Battery sample: year 10 is negative because of the battery replacement', () => {
  const s = DEMO_SCENARIOS.find(d => d.id === 'demo-hybrid');
  const rows = buildCashflows(s), y10 = rows[10];
  close(y10.revenue, 1673129.596, 1e-9, 'year 10 revenue = 1,400,000 × 1.02^9');
  assert.equal(y10.replacement, 1800000);
  close(y10.net_cf, -334670.606, 1e-9, 'year 10 net');
  assert.ok(y10.cumulative > 0, 'cumulative stays positive, so the year-8 payback still holds');
  const why = explainYear(y10, rows[9]);
  assert.equal(why.cause, 'replacement');
  assert.ok(why.negative && why.cumulativeDips);
  assert.match(why.text, /เปลี่ยนอุปกรณ์ 1,800,000 บาท/);
  assert.match(why.text, /1,465,329 บาท/); // operating cash that year (1,465,329.39)
  close(why.operating, 1465329.394, 1e-9, 'operating cash');
  assert.equal(explainYear(rows[11], y10).negative, false, 'year 11 is positive again');
});

test('explanation covers every negative year in every case', () => {
  for (const [name, s] of CASES) {
    const rows = buildCashflows(s);
    rows.forEach((row, i) => {
      const why = explainYear(row, rows[i - 1] ?? null);
      assert.equal(why.negative, row.net_cf < 0, `${name} y${row.year} negative flag`);
      if (row.net_cf < 0) assert.ok(why.cause && why.text, `${name} y${row.year} negative year has a reason`);
      if (row.year === 0) assert.equal(why.cause, 'investment');
    });
  }
});
