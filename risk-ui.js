// Risk card on the input page: ± ranges per input, run 1,000 random cases, show the spread of NPV / IRR.
import { riskVars, simulate } from './domain/risk.js';
import { fmt } from './charts.js';

const ranges = {}; // per product + mode, kept while the page is open
const keyOf = (product, s) => product + ':' + (s.input_mode === 'raw' ? 'raw' : 'direct');
const varsFor = (product, s) => riskVars(product, s).map(v => ({ ...v, range: ranges[keyOf(product, s)]?.[v.key] ?? v.range }));
const pctTxt = v => v == null ? '—' : fmt(v * 100, 1) + '%';
const mb = v => fmt(v / 1e6, 2);

export function riskCardHtml(product, s) {
  const vars = varsFor(product, s);
  if (!vars.length) return '';
  return `<section class="card risk-card"><h3>ความเสี่ยง · จำลอง 1,000 รอบ</h3>
<p class="risk-intro">สุ่มค่าแต่ละตัวในช่วง ± ที่กำหนด (ค่าที่กรอกเป็นค่าที่น่าจะเกิดที่สุด) แล้วคำนวณ NPV ใหม่ทุกรอบ · ช่วงข้างล่างเป็นค่าตั้งต้น ให้ปรับตามความมั่นใจของข้อมูล เช่น ได้ใบเสนอราคาแล้วให้ลดช่วงต้นทุนลง</p>
<div class="risk-vars">${vars.map(v => `<label class="field">${v.label}<span class="input-wrap"><input data-risk="${v.key}" type="number" min="0" max="90" step="1" value="${v.range}" aria-label="ช่วงความไม่แน่นอน ${v.label}"><span>± %</span></span></label>`).join('')}</div>
<div class="form-actions"><button class="button primary" id="risk-run">จำลอง</button></div><div id="risk-out"></div></section>`;
}

function histogram(h) {
  const w = 420, ht = 120, max = Math.max(...h.map(b => b.count)), bw = w / h.length;
  const bars = h.map((b, i) => { const y = ht - (b.count / max) * (ht - 14); const neg = b.to <= 0;
    return `<rect x="${(i * bw + 1).toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(ht - y).toFixed(1)}" rx="2" fill="${neg ? 'var(--orange)' : 'var(--mint)'}"><title>${mb(b.from)} ถึง ${mb(b.to)} ล้านบาท: ${b.count} รอบ</title></rect>`; }).join('');
  return `<svg class="risk-hist" viewBox="0 0 ${w} ${ht + 16}" role="img" aria-label="การกระจายของ NPV">${bars}<text x="0" y="${ht + 13}" font-size="9" fill="var(--muted)">${mb(h[0].from)}</text><text x="${w}" y="${ht + 13}" font-size="9" fill="var(--muted)" text-anchor="end">${mb(h.at(-1).to)} ล้านบาท</text></svg>`;
}

export function bindRisk(root, { product, get }) {
  const btn = root.querySelector('#risk-run'); if (!btn) return;
  root.querySelectorAll('[data-risk]').forEach(el => el.oninput = () => {
    const k = keyOf(product, get()); ranges[k] ??= {}; const n = Number(el.value);
    if (el.value !== '' && Number.isFinite(n) && n >= 0 && n <= 90) ranges[k][el.dataset.risk] = n;
  });
  btn.onclick = () => {
    const s = get(), out = simulate(product, s, varsFor(product, s));
    root.querySelector('#risk-out').innerHTML = `<div class="risk-grid">
<div><small>โอกาสที่ NPV เป็นบวก</small><strong class="${out.pPositive >= 0.5 ? 'positive' : 'negative'}">${fmt(out.pPositive * 100, 0)}%</strong></div>
<div><small>NPV (ล้านบาท) P10 / P50 / P90</small><strong>${mb(out.npv.p10)} / ${mb(out.npv.p50)} / ${mb(out.npv.p90)}</strong></div>
<div><small>IRR P10 / P50 / P90</small><strong>${pctTxt(out.irr.p10)} / ${pctTxt(out.irr.p50)} / ${pctTxt(out.irr.p90)}</strong></div></div>
${histogram(out.hist)}<p class="risk-intro">P10 = 10% ของรอบที่จำลองได้ค่าต่ำกว่านี้ · แท่งสีส้ม = รอบที่ NPV ติดลบ · ใช้ค่าสุ่มชุดเดิมทุกครั้งเพื่อให้เทียบกันได้</p>`;
  };
}
