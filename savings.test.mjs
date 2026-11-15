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

// Projects filled from raw data: the savings chart must use the same yearly cash flows as every other chart.
test('raw-input projects: customer saving equals Excel in year 1 and follows the cash flows every year', async () => {
  const { sampleScenario } = await import('./projects.js');
  // ผลประหยัดของลูกค้าปีแรก in the Khun Ton workbook (sheet อธิบายตัวเลข / ขั้นตอนคำนวณ: 15% × 104,128)
  const excel = { solar: 108426.73628835614, hybrid: 124045.86428835616, battery: 15619.128000000004 };
  for (const p of ['solar', 'hybrid', 'battery']) {
    const s = sampleScenario(p), r = computeScenario(s), c = customerSavings(r, p), v = s.raw.values;
    assert.equal(c.kind, 'raw');
    assert.ok(Math.abs(c.saving - excel[p]) < 1e-6, `${p} year-1 saving ${c.saving}`);
    assert.ok(Math.abs(c.after - r.cashflows[1].revenue) < 1e-6, `${p}: after = what EGAT earns in year 1`);
    assert.equal(c.cumulative.length, s.project_life);
    for (const row of c.cumulative) {
      const cf = r.cashflows[row.year];
      const keep = p === 'battery' ? cf.revenue1 * (1 - v.share) / v.share
        : cf.revenue1 * v.disc / (1 - v.disc) + (p === 'hybrid' ? cf.revenue2 * (1 - v.share) / v.share : 0);
      assert.ok(Math.abs(row.saving - keep) < 1e-6, `${p} year ${row.year}`);
    }
    assert.ok(Math.abs(c.cumulative.at(-1).before - c.cumulative.at(-1).after - c.cumulative.at(-1).cumulative) < 1e-6);
  }
});

test('typed customer saving: the detail panel shows the typed saving, not an Off-peak rate it did not use', () => {
  const s = { ...bessScenario('min'), customer_saving_y1: 50000 }, c = customerSavings(computeScenario(s), 'battery');
  assert.equal(c.saving, 50000);
  assert.ok(!c.factsAfter.some(([k]) => k.includes('Off-peak')));
});

test('chart axes: every gridline sits on a round number and the data fits inside', async () => {
  const { axis } = await import('./charts.js');
  for (const [lo, hi, parts] of [[0, 0.582, 3], [-3.75, 3.59, 4], [-0.95, 0.66, 3], [0, 24.2, 3], [-1.6, 4.4, 3], [0, 0.0731, 3]]) {
    const a = axis(lo, hi, parts);
    assert.ok(a.lo <= lo && a.hi >= hi, `${lo}..${hi} fits`);
    for (const t of a.ticks) assert.ok(Math.abs(t / a.step - Math.round(t / a.step)) < 1e-9, `${t} is a multiple of ${a.step}`);
    assert.ok([1, 2, 2.5, 5].some(m => Math.abs(a.step / 10 ** Math.floor(Math.log10(a.step)) - m) < 1e-9), `step ${a.step} is 1/2/2.5/5 × 10ⁿ`);
  }
});
