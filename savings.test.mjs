// Customer electricity savings shown in the savings chart and the KPI card.
import test from 'node:test';
import assert from 'node:assert/strict';
import { customerSavings } from './charts.js';
import { computeScenario } from './domain/model.js';
import { bessScenario } from './domain/bess.js';
import { DEMO_SCENARIOS } from './domain/demoData.js';

test('Solar PPA saving = solar energy × (grid Peak rate − PPA price)', () => {
  const s = DEMO_SCENARIOS.find(d => d.id === 'demo-solar');
  const c = customerSavings(computeScenario(s), true);
  const ppa = s.revenue_y1 / s.energy_y1_kwh;
  assert.equal(c.kind, 'ppa');
  assert.ok(Math.abs(c.saving - s.energy_y1_kwh * (4.1839 - ppa)) < 1e-6);
  assert.ok(Math.abs(c.cumulative.at(-1).cumulative - c.saving * s.project_life) < 1e-6);
});

test('Battery saving matches the model peak-shifting saving', () => {
  const r = computeScenario(bessScenario('min'));
  const c = customerSavings(r, false);
  assert.equal(c.kind, 'shift');
  assert.equal(c.saving, r.customer.savingYear);
  assert.ok(Math.abs(c.saving - 230709.2) < 1);
});
