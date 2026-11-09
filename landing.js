// Landing page: live example numbers from the same engine as the workspace, plus the 3D hero.
import { bessScenario } from './domain/bess.js';
import { computeScenario } from './domain/model.js';
import { mountProductScene } from './product-scene.js';
import { template } from './projects.js';

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
  const tick = t => { const k = Math.min(1, (t - start) / 1200), e = 1 - Math.pow(1 - k, 3); el.textContent = text.replace(m[0], (target * e).toFixed(dec)); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  if (e.target.classList.contains('preview-metrics')) e.target.querySelectorAll('strong').forEach(countUp);
}), { threshold: 0.2 }) : null;
document.querySelectorAll('[data-reveal]').forEach(el => (io ? io.observe(el) : el.classList.add('in')));

// Framed 3D stage: product tabs, drag to rotate, pause and reset (same layout as the main site's landing).
const STAGE = {
  solar: { icon: '☀', category: 'SOLAR GENERATION', title: 'Solar<span>-PPA</span>', desc: 'ผลิตไฟจากแสงอาทิตย์บนพื้นที่ของลูกค้า<br>ขายไฟตามสัญญา PPA ในราคาต่ำกว่าค่าไฟกริด<br>ลูกค้าเริ่มประหยัดได้โดยไม่ต้องลงทุนเอง', detail: 'ผลิตเอง · จ่ายน้อยลง', note: 'พลังงานสะอาด<br><strong>จากหลังคาคุณ</strong>' },
  hybrid: { icon: '◈', category: 'GENERATION + STORAGE', title: 'Solar<span>+BESS</span>', desc: 'ผลิตไฟจากแสงอาทิตย์ในตอนกลางวัน<br>เก็บส่วนที่เหลือไว้ใช้ช่วง peak<br>ใช้พลังงานสะอาดได้นานขึ้นในทุกวัน', detail: 'ผลิต · เก็บ · ใช้', note: 'แดดวันนี้<br><strong>ใช้ได้ถึงค่ำ</strong>' },
  battery: { icon: 'ϟ', category: 'BATTERY ENERGY STORAGE', title: 'BESS<span>-500</span>', desc: 'เก็บพลังงานในช่วง off-peak<br>พร้อมใช้ในช่วง peak ช่วยลดต้นทุนค่าไฟ<br>ให้ทุกหน่วยพลังงานคุ้มค่ายิ่งขึ้น', detail: 'เก็บให้พร้อม · ใช้ให้คุ้ม', note: 'พลังงานดี ๆ<br><strong>ที่เก็บไว้ได้</strong>' },
};
const stage = document.getElementById('hero-stage'), view = document.getElementById('stage-view');
const $s = id => document.getElementById(id);
let current = null, product = 'battery', moving = !reduce;
function showProduct(next) {
  product = next;
  const c = STAGE[next], res = computeScenario(template(next));
  $s('stage-icon').textContent = c.icon; $s('stage-note-icon').textContent = c.icon;
  $s('stage-category').textContent = c.category;
  $s('stage-title').innerHTML = c.title + '<b>.</b>';
  $s('stage-desc').innerHTML = c.desc;
  $s('stage-detail').textContent = c.detail;
  $s('stage-note').innerHTML = c.note;
  $s('stage-stats').innerHTML = `<div><dt>IRR</dt><dd>${pct(res.irr)}</dd></div><div><dt>คืนทุน</dt><dd>${years(res.payback)}</dd></div><div><dt>เงินลงทุน</dt><dd>${(res.scenario.initial_investment / 1e6).toFixed(2)} ลบ.</dd></div>`;
  stage.querySelectorAll('[data-stage]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.stage === next)));
  stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
  current?.setFocus(FOCUS[next]);
}
// One scene with all three products (like the main site's landing); the tabs light up the matching parts.
const FOCUS = { solar: ['solar'], hybrid: ['solar', 'battery'], battery: ['battery'] };
try {
  const wide = matchMedia('(min-width: 901px)').matches;
  // the canvas fills the whole frame (nothing is clipped); the model keeps its framing against #stage-frame
  current = mountProductScene(view, 'all', { sway: true, lookY: wide ? 1.4 : 1.1, zoomHeight: wide ? 6.9 : 6.4, shiftX: wide ? .27 : 0, refEl: wide ? document.getElementById('stage-frame') : null });
  current.setMotion(moving);
} catch { stage.classList.add('no-webgl'); }
stage.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => { if (b.dataset.stage !== product) showProduct(b.dataset.stage); }));
$s('stage-reset').addEventListener('click', () => current?.reset());
$s('stage-motion').addEventListener('click', e => {
  moving = !moving; current?.setMotion(moving);
  e.currentTarget.textContent = moving ? 'Ⅱ' : '▷';
  e.currentTarget.setAttribute('aria-pressed', String(!moving));
  e.currentTarget.setAttribute('aria-label', moving ? 'หยุดภาพเคลื่อนไหว' : 'เล่นภาพเคลื่อนไหว');
  stage.classList.toggle('paused', !moving);
});
if (reduce) { $s('stage-motion').textContent = '▷'; stage.classList.add('paused'); }
showProduct('battery');
