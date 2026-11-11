// The raw-input formulas (domain/inputs.js) against the Excel file, case by case.
// inputs.fixture.json = results Microsoft Excel calculated from EGAT_Platform_Input_แยกตามผลิตภัณฑ์.xlsx
// (tools/excel/run_excel_cases.py): 39 cases incl. every option combination, battery swaps, 70% demand rule, two-phase tariff growth, tax and loans.
// inputs.fixture.blank.json = how many inputs the blank Excel file says are missing per product.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { derive, inputStatus, defaultRaw, TARIFFS } from './domain/inputs.js';
import { computeScenario } from './domain/model.js';
import { customerSavings } from './charts.js';

const CASES = JSON.parse(fs.readFileSync(new URL('./inputs.fixture.json', import.meta.url), 'utf8'));
const BLANK_COUNTS = JSON.parse(fs.readFileSync(new URL('./inputs.fixture.blank.json', import.meta.url), 'utf8'));
const near = (a, b, label) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${label}: ${a} vs ${b}`);

test('every model field matches the Excel file', () => {
  for (const c of CASES) {
    const res = derive(c.product, c.raw);
    assert.ok(res.complete, `${c.case}/${c.product} complete (missing ${res.missing})`);
    assert.equal(c.status, '✅ ครบ', `${c.case}/${c.product} Excel status`);
    for (const [k, v] of Object.entries(c.fields)) near(res.fields[k], v, `${c.case}/${c.product} ${k}`);
  }
});

test('NPV, IRR, payback, equity and customer saving equal Excel (both its platform check and its full model)', () => {
  const num = x => typeof x === 'number';
  for (const c of CASES) {
    const res = derive(c.product, c.raw), r = computeScenario({ ...res.fields, decision_override: 'auto' }), label = `${c.case}/${c.product}`;
    for (const side of ['platform', 'full']) {
      const x = k => c.excel[k][side];
      near(r.npv, x('NPV (บาท)'), `${label} ${side} NPV`);
      if (num(x('IRR'))) near(r.irr, x('IRR'), `${label} ${side} IRR`); else assert.equal(r.irr, null, `${label} ${side}: Excel finds no IRR, so must the platform`);
      if (num(x('คืนทุน (ปี)'))) near(r.payback, x('คืนทุน (ปี)'), `${label} ${side} payback`); else assert.equal(r.payback, null, `${label} never pays back`);
      if (num(x('NPV ส่วนทุน (บาท)'))) {
        near(r.equity.npv, x('NPV ส่วนทุน (บาท)'), `${label} ${side} equity NPV`);
        if (num(x('IRR ส่วนทุน'))) near(r.equity.irr, x('IRR ส่วนทุน'), `${label} ${side} equity IRR`);
      } else assert.equal(r.equity, null, `${label} no loan → no equity view`);
    }
    near(customerSavings(r, c.product === 'solar').saving, c.excel['ผลประหยัดของลูกค้าปีแรก'].full, `${label} customer saving`);
  }
});

test('a blank form lists the same missing inputs as the blank Excel file', () => {
  const counts = Object.fromEntries(['solar', 'hybrid', 'battery'].map(p => [p, derive(p, defaultRaw()).missing.length]));
  assert.deepEqual(counts, BLANK_COUNTS);
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

test('raw inputs survive the trip to the database and back', async () => {
  const { toRows, fromRows } = await import('./workspace-sync.js');
  const { validWorkspace } = await import('./projects.js');
  const c = CASES.find(x => x.product === 'hybrid');
  const scenario = { ...derive('hybrid', c.raw).fields, raw: c.raw, input_mode: 'raw', decision_override: 'auto', note: 'test' };
  const state = { version: 1, selected: 'hybrid', projects: [{ id: 'p1', product: 'hybrid', name: 'โรงงานทดสอบ', scenario }], active: { solar: null, hybrid: 'p1', battery: null } };
  assert.ok(validWorkspace(state));
  const rows = JSON.parse(JSON.stringify(toRows(state, 'user-1'))); // jsonb round trip
  const back = fromRows(rows, { selected: 'hybrid', active: { hybrid: 'p1' } });
  assert.equal(back.dropped, 0);
  assert.deepEqual(back.state.projects[0].scenario, scenario);
  assert.equal(derive('hybrid', back.state.projects[0].scenario.raw).complete, true);
});
