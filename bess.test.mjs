// Reproduces "BESS Feasibility Model_rev01.xlsx" (sheets BESS, Inputs_*, Cash Flow_*, Summary_*).
import test from 'node:test';
import assert from 'node:assert/strict';
import { bessBreakdown, bessScenario } from './domain/bess.js';
import { computeScenario, buildCashflows } from './domain/model.js';

const near = (actual, expected, tol, label) => assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} vs ${expected}`);

test('BESS sheet build-up (min column)', () => {
  const b = bessBreakdown('min');
  assert.equal(b.systemCost, 1815000);        // B14
  assert.equal(b.installCost, 2500000);       // B15
  assert.equal(b.capex, 4315000);             // B16
  assert.equal(b.investment, 4435000);        // Inputs_min!B4
  near(b.peakShaving, 602481.6, 1e-6, 'B25');
  near(b.tariffManagement, 374932.8, 1e-6, 'C27');
  near(b.demandCharge, 78504, 1e-6, 'B28');
  near(b.annualSaving, 1055918.4, 1e-6, 'B29');
  near(b.salvage, 443500, 1e-6, 'Inputs_min!B12');
  near(b.simplePaybackCapex, 4.0865, 1e-4, 'B32');
});

test('BESS sheet build-up (max column)', () => {
  const b = bessBreakdown('max');
  assert.equal(b.capex, 6970000);             // C16
  assert.equal(b.investment, 7090000);        // Inputs_max!B4
  near(b.salvage, 709000, 1e-6, 'Inputs_max!B12');
  near(b.simplePaybackCapex, 6.6009, 1e-4, 'C32');
});

test('full chain reproduces Summary_min: NPV, IRR and cash flow', () => {
  const s = bessScenario('min'), r = computeScenario(s), cf = buildCashflows(s);
  near(r.npv, 3133435.5502, 0.01, 'Summary_min!B8 NPV');
  near(r.irr, 0.2101, 0.0001, 'Summary_min!B6 IRR');
  near(cf[10].net_cf, 1658773.9637, 0.001, 'Cash Flow_min!F14');
  near(cf[10].cumulative, 7122510.2283, 0.001, 'Summary_min!E14');
  assert.equal(r.decisionFinal, 'accept');    // Summary_min!A13: IRR above the 8% hurdle
});

test('full chain reproduces Summary_max: NPV, IRR and cash flow', () => {
  const s = bessScenario('max'), r = computeScenario(s), cf = buildCashflows(s);
  near(r.npv, 601413.4213, 0.01, 'Summary_max!B8 NPV');
  near(r.irr, 0.0971, 0.0001, 'Summary_max!B6 IRR');
  near(cf[10].net_cf, 1924273.9637, 0.001, 'Cash Flow_max!F14');
  near(cf[10].cumulative, 4733010.2283, 0.001, 'Summary_max!E14');
  assert.equal(r.decisionFinal, 'accept');
});

test('payback follows the cumulative cash flow (workbook B9 cells are typed-in numbers)', () => {
  // Summary_min!B9 = 4+(580836/1013402) and Summary_max!B9 = 7+(132945/1076933) do not match
  // the workbook's own cumulative column; interpolating that column gives these values.
  near(computeScenario(bessScenario('min')).payback, 4.2342, 1e-4, 'min payback');
  near(computeScenario(bessScenario('max')).payback, 6.6060, 1e-4, 'max payback');
});

test('installation cost scales with BESS size (workbook B16 hard-codes 500 kWh)', () => {
  const b = bessBreakdown('min', { sizeKwh: 1000 });
  assert.equal(b.systemCost, 3630000);
  assert.equal(b.installCost, 5000000);
});
