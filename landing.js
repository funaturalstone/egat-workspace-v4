// Landing page: live example numbers from the same engine as the workspace, plus the 3D hero.
import { bessScenario } from './domain/bess.js';
import { computeScenario } from './domain/model.js';
import { mountEnergyScene } from './scene.js';

const r = computeScenario(bessScenario('min'));
const pct = v => (v == null ? '—' : (v * 100).toFixed(1) + '%');
const years = v => (v == null ? 'ยังไม่คืนทุน' : v.toFixed(1) + ' ปี');
document.getElementById('ex-irr').textContent = pct(r.irr);
document.getElementById('ex-payback').textContent = years(r.payback);
document.getElementById('ex-dpayback').textContent = years(r.discounted_payback);
document.getElementById('example-caption').textContent =
  `ตัวอย่างจาก Battery 500 kWh เงินลงทุน ${(r.scenario.initial_investment / 1e6).toFixed(2)} ล้านบาท อายุโครงการ ${r.scenario.project_life} ปี`;

try { mountEnergyScene(document.getElementById('hero-3d'), 'hybrid'); } catch { /* 3D is decoration only */ }
