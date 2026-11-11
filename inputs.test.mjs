// The raw-input formulas (domain/inputs.js) against the Excel file, case by case.
// inputs.fixture.json = values computed by EGAT_Platform_Input_แยกตามผลิตภัณฑ์.xlsx for 9 option sets × 3 products.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { derive, inputStatus, defaultRaw, TARIFFS } from './domain/inputs.js';
import { computeScenario } from './domain/model.js';
import { customerSavings } from './charts.js';

const CASES = JSON.parse(fs.readFileSync(new URL('./inputs.fixture.json', import.meta.url), 'utf8'));
const near = (a, b, label) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${label}: ${a} vs ${b}`);

test('every model field matches the Excel file', () => {
  for (const c of CASES) {
    const res = derive(c.product, c.raw);
    assert.ok(res.complete, `${c.case}/${c.product} complete (missing ${res.missing})`);
    for (const [k, v] of Object.entries(c.fields)) if (k !== 'decision_override') near(res.fields[k], v, `${c.case}/${c.product} ${k}`);
  }
});

test('NPV, IRR, payback and customer saving equal the full model in the Excel file', () => {
  for (const c of CASES) {
    const res = derive(c.product, c.raw), r = computeScenario({ ...res.fields, decision_override: 'auto' }), label = `${c.case}/${c.product}`;
    near(r.npv, c.full['NPV (บาท)'], label + ' NPV');
    near(r.irr, c.full['IRR'], label + ' IRR');
    if (typeof c.full['คืนทุน (ปี)'] === 'number') near(r.payback, c.full['คืนทุน (ปี)'], label + ' payback'); else assert.equal(r.payback, null, label + ' never pays back');
    near(customerSavings(r, c.product === 'solar').saving, c.full['ผลประหยัดของลูกค้าปีแรก'], label + ' customer saving');
  }
});

test('a blank form lists the same missing inputs as the blank Excel file', () => {
  const counts = Object.fromEntries(['solar', 'hybrid', 'battery'].map(p => [p, derive(p, defaultRaw()).missing.length]));
  assert.deepEqual(counts, { solar: 16, hybrid: 29, battery: 14 });
  assert.equal(derive('solar', defaultRaw()).complete, false);
});

test('tariffs follow the voltage level unless typed over', () => {
  for (const t of TARIFFS) {
    const st = inputStatus('battery', { sel: { volt: t.volt }, values: {} });
    assert.equal(st.rows.find(r => r.input.key === 'peak').value, t.peak);
  }
  const typed = inputStatus('battery', { sel: { volt: 1 }, values: { peak: 5 } });
  assert.equal(typed.rows.find(r => r.input.key === 'peak').value, 5);
});
