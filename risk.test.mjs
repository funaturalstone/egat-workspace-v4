import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { simulate, riskVars } from './domain/risk.js';
import { derive } from './domain/inputs.js';
import { computeScenario } from './domain/model.js';
import { DEMO_SCENARIOS } from './domain/demoData.js';

const FX = JSON.parse(fs.readFileSync(new URL('./inputs.fixture.json', import.meta.url), 'utf8'));

test('zero ranges reproduce the single result exactly', () => {
  const c = FX.find(x => x.product === 'solar');
  const s = { input_mode: 'raw', raw: c.raw, decision_override: 'auto', ...derive('solar', c.raw).fields };
  const base = computeScenario(s).npv;
  const out = simulate('solar', s, riskVars('solar', s).map(v => ({ ...v, range: 0 })), 50);
  assert.equal(out.npv.min, base); assert.equal(out.npv.max, base); assert.equal(out.pPositive, base > 0 ? 1 : 0);
});

test('same seed gives the same answer; wider ranges spread NPV wider', () => {
  const s = { ...DEMO_SCENARIOS[3] };
  const vars = riskVars('solar', s);
  const a = simulate('solar', s, vars, 400), b = simulate('solar', s, vars, 400);
  assert.deepEqual(a, b);
  const wide = simulate('solar', s, vars.map(v => ({ ...v, range: v.range * 2 })), 400);
  assert.ok(wide.npv.p90 - wide.npv.p10 > a.npv.p90 - a.npv.p10);
  assert.equal(a.hist.reduce((t, h) => t + h.count, 0), 400);
  assert.ok(a.npv.p10 <= a.npv.p50 && a.npv.p50 <= a.npv.p90);
});
