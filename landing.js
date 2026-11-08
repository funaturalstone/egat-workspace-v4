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

// Reveal sections as they scroll in, staggering siblings; count the example numbers up once visible.
document.querySelectorAll('.feature-grid [data-reveal]').forEach((el, i) => el.style.setProperty('--d', i + 1));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const countUp = el => {
  const text = el.textContent, m = text.match(/-?[\d.]+/);
  if (!m || reduce) return;
  const target = Number(m[0]), dec = (m[0].split('.')[1] || '').length, start = performance.now();
  const tick = t => { const k = Math.min(1, (t - start) / 1000), e = 1 - Math.pow(1 - k, 3); el.textContent = text.replace(m[0], (target * e).toFixed(dec)); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  if (e.target.classList.contains('preview-metrics')) e.target.querySelectorAll('strong').forEach(countUp);
}), { threshold: 0.2 }) : null;
document.querySelectorAll('[data-reveal]').forEach(el => (io ? io.observe(el) : el.classList.add('in')));

try { mountEnergyScene(document.getElementById('hero-3d'), 'hybrid'); } catch { /* 3D is decoration only */ }
