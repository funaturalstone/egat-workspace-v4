import test from 'node:test';
import assert from 'node:assert/strict';
import { derive } from './domain/inputs.js';
import { computeScenario } from './domain/model.js';
import { sampleRaw, EXCEL, sensitivity } from './domain/khunTon.js';
import { NOTES } from './domain/khunTonData.js';
import { freshWorkspace, sampleProjects, validWorkspace } from './projects.js';
import { toRows, fromRows } from './workspace-sync.js';

const run = p => { const d = derive(p, sampleRaw(p)); return { d, r: computeScenario({ ...d.fields, decision_override: 'auto' }) }; };

test('Khun Ton sample reproduces the Excel results for all three products', () => {
  for (const p of ['solar', 'hybrid', 'battery']) {
    const { d, r } = run(p);
    assert.ok(d.complete, p + ' complete');
    assert.ok(Math.abs(r.npv - EXCEL[p].npv) < 1, `${p} NPV ${r.npv}`);
    assert.ok(Math.abs(r.irr - EXCEL[p].irr) < 1e-9, `${p} IRR ${r.irr}`);
  }
});

test('every input used by the sample has a 5-part note', () => {
  for (const p of ['solar', 'hybrid', 'battery']) {
    for (const row of run(p).d.status.rows.filter(x => x.used)) {
      assert.ok(NOTES[row.input.key]?.length === 5, `${p}: note for ${row.input.key}`);
    }
  }
});

test('sensitivity matches the Excel sheet "วิเคราะห์ความไว"', () => {
  const s = sensitivity('solar', sampleRaw('solar'), true);
  assert.equal(s.rows[0].key, 'cost');
  assert.ok(Math.abs(s.rows[0].wIrr - 0.684) < 0.001);
  assert.ok(Math.abs(s.irrMin - 0.0422) < 0.0001 && Math.abs(s.irrMax - 0.1565) < 0.0001);
  assert.ok(Math.abs(s.top[0].breakEven - 28.08) < 0.01);
  const b = sensitivity('battery', sampleRaw('battery'), true);
  assert.equal(b.rows[0].key, 'bpack');
  assert.ok(Math.abs(b.top[0].breakEven - 2587.5) < 1);
  assert.ok(Math.abs(sensitivity('hybrid', sampleRaw('hybrid'), true).rows.find(o => o.key === 'bpack').wIrr - 0.218) < 0.001);
});

test('a new workspace has no Khun Ton project; his stored rows load back as a valid workspace', () => {
  assert.ok(!freshWorkspace().projects.some(p => p.scenario.sample));
  const s = freshWorkspace(), rows = sampleProjects();
  s.projects.unshift(...rows);
  assert.equal(rows.length, 3);
  assert.ok(validWorkspace(s));
  const back = fromRows(toRows(s, 'owner'), null).state;
  assert.equal(back.projects.filter(p => p.scenario.sample === 'khun-ton').length, 3);
});
