// Khun Ton: a real factory case (identifiers removed) checked line by line against แบบสอบถามลูกค้าคุณต้น.xlsx.
// Every input value, the note behind it, the sensitivity ranges and the Excel results the platform must reproduce.
import { derive, defaultRaw } from './inputs.js';
import { computeScenario } from './model.js';

export const SAMPLE_ID = 'khun-ton';
export const SAMPLE_NAME = 'คุณต้น · โรงงานสิ่งทอ (ข้อมูลจริง)';

// Shared inputs (percentages as fractions). Values from the Excel sheet "ค่าที่ใช้คำนวณ".
const COMMON = {
  wkd: 261, hol: 11, wdays: 365, peak: 4.1839, off: 2.6037, ft: 0.1623, dT: 132.93,
  rate: 0.08, esc: 0.005, inf: 0.02, othG: 0.01, enzy: 0, tax: 0, debt: 0,
};
const SOLAR = { useman: 0.923, kwp: 150, cost: 25, yld: 1400, after9: 0.89, deg: 0.007, om: 0.02, invY: 12, invC: 3000, disc: 0.15, term: 15, othS: 0 };
const BATTERY = { pdem: 182, relT: 0.42, bkwh: 200, bkw: 100, dod: 0.8, rte: 0.85, bpack: 10000, bpcs: 0, binst: 0, blump: 0, bdeg: 0.025, bom: 0.015, share: 0.85, othB: 0 };
// Solar + Battery: battery swapped in year 10 at 60% of today's price plus PCS 3,000 baht/kW; the new pack is worth half at year 15
export const swapTerms = v => { const cap = v.bpack * v.bkwh, sw = 0.6 * cap + 3000 * v.bkw; return { bswapPct: sw / cap, xfer: 0.5 * sw }; };
const SEL = {
  solar: { meter: 1, um: 2, volt: 2 },
  hybrid: { meter: 1, um: 2, volt: 2, bt: 1 },
  battery: { meter: 1, src: 1, volt: 2, bt: 1 },
};
function values(product) {
  if (product === 'solar') return { ...COMMON, ...SOLAR, xfer: 0 };
  if (product === 'battery') return { ...COMMON, ...BATTERY, blife: 10, bsalv: 0.1 };
  const v = { ...COMMON, ...SOLAR, ...BATTERY, bswap: 10, hlife: 15, mon: 0 };
  return { ...v, ...swapTerms(v) };
}
export const sampleRaw = product => ({ sel: { ...defaultRaw().sel, ...SEL[product] }, values: values(product) });

// Results of the Excel workbook (sheet "อธิบายตัวเลข", section 6) — the platform must match these.
export const EXCEL = {
  solar: { npv: 551334.53, irr: 0.104630562847553 },
  hybrid: { npv: -1479248.39, irr: 0.0326760517312976 },
  battery: { npv: -1575193.89, irr: -0.137711293138763 },
};

// Ranges tested in the sensitivity analysis (low, high) and where each range comes from.
export const RANGES = {
  useman: [0.898, 0.954, 'ข้อมูลค่าไฟ 6 เดือน: 89.8% (ใช้ไฟลดลง) ถึง 95.4% (ไม่หักวันเทศกาล)'],
  cost: [20, 34, 'ราคาผู้ติดตั้งไทยสำหรับโรงงาน 18–20 บาท/W ถึงราคาระบบเล็ก 100 kW ≈ 33.5 บาท/W (Krungsri)'],
  yld: [1250, 1526, 'วัดจริงบนหลังคาในไทย 1,250 ถึงผลจำลอง PVsyst โรงงาน 1,526'],
  om: [0.012, 0.0207, 'ช่วงแนะนำ 1.2% ถึงระบบเล็กที่แพงกว่า 2.07%'],
  deg: [0.003, 0.019, 'วัดจริงในไทย 0.3–1.9%/ปี'],
  disc: [0.10, 0.30, 'ตลาด Private PPA ไทย 10–30%'],
  esc: [0, 0.006, 'ร่าง PDP2026 ค่าไฟขึ้น 0–0.6%/ปี'],
  ft: [0.1623, 0.4127, 'Ft ในบิลจริง 0.1623 ถึง Ft ตามต้นทุนจริง 0.4127'],
  invC: [3000, 5000, 'ราคาอินเวอร์เตอร์ในไทย 3,000–5,000 บาท/kW'],
  bpack: [8000, 15000, 'ระบบใหญ่ 8,000 · ทีมยืนยัน 10,000 · ตลาดไทยระบบเล็ก 15,000 บาท/kWh'],
  rte: [0.82, 0.92, 'ข้อมูลวัดจริงและสเปก 82–92%'],
  relT: [0.34, 0.50, '34% (ไฟสูงคงที่ 4 ชม. ตามคำตอบข้อ 7) ถึง 50% (ค่าที่ทีมตั้งไว้)'],
  bdeg: [0.02, 0.03, 'ผู้ขายแบตในไทย 2–3%/ปี'],
  bom: [0.01, 0.025, 'ตลาดไทย 1–2% ถึง NREL 2.5%'],
  share: [0.70, 0.85, 'สัญญาแบ่งผลประหยัด 70:30 ถึง 85:15'],
  bsalv: [0.067, 0.10, 'ไฟล์ตัวอย่าง กฟผ. ≈ 6.7% ถึงค่าฐาน 10%'],
  rate: [0.06, 0.10, 'ช่วงที่ควรทดสอบ 6–10% (บทวิเคราะห์ไฟล์ BESS ของ กฟผ.)'],
};
const LABEL = {
  useman: 'สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', cost: 'ต้นทุนติดตั้งโซลาร์', yld: 'ไฟที่ผลิตได้ต่อ kWp', om: 'O&M โซลาร์', deg: 'แผงเสื่อมต่อปี',
  disc: 'ส่วนลด PPA ให้ลูกค้า', esc: 'ค่าไฟขึ้นต่อปี', ft: 'ค่า Ft', invC: 'ค่าเปลี่ยนอินเวอร์เตอร์', bpack: 'ราคาแบต (รวมติดตั้ง)',
  rte: 'ประสิทธิภาพชาร์จ-จ่ายทั้งระบบ', relT: 'Demand ที่แบตลดได้', bdeg: 'แบตเสื่อมต่อปี', bom: 'O&M แบต', share: 'ส่วนแบ่งผลประหยัดที่ กฟผ. ได้',
  bsalv: 'มูลค่าซากแบตปีที่ 10', rate: 'อัตราคิดลด',
};
const PCT = new Set(['useman', 'om', 'deg', 'disc', 'esc', 'rte', 'relT', 'bdeg', 'bom', 'share', 'bsalv', 'rate']);
const UNIT = { cost: 'บาท/W', yld: 'kWh/kWp', ft: 'บาท/kWh', invC: 'บาท/kW', bpack: 'บาท/kWh' };
const FOR = {
  solar: ['useman', 'cost', 'yld', 'om', 'deg', 'disc', 'esc', 'ft', 'invC'],
  hybrid: ['useman', 'cost', 'yld', 'om', 'deg', 'disc', 'esc', 'ft', 'invC', 'bpack', 'rte', 'relT', 'bdeg', 'bom', 'share'],
  battery: ['esc', 'ft', 'bpack', 'rte', 'relT', 'bdeg', 'bom', 'share', 'bsalv'],
};
export const isSample = s => s?.sample === SAMPLE_ID;

// NPV and IRR of a raw-input project after changing some inputs.
function run(product, raw, change, linked) {
  const values = { ...raw.values, ...change };
  if (linked && product === 'hybrid' && 'bpack' in change) Object.assign(values, swapTerms(values));
  const d = derive(product, { sel: raw.sel, values });
  if (!d.complete) return null;
  const r = computeScenario({ ...d.fields, decision_override: 'auto' });
  return { npv: r.npv, irr: r.irr };
}

// One-at-a-time sensitivity: each input set to the low then the high end of its range, everything else unchanged.
// Weight = (swing)² ÷ Σ(swing)² — each factor's share of the total uncertainty.
// Khun Ton uses the documented ranges above; any other project uses ±spread (default 20%) around its own value.
// policy: inputs EGAT sets itself (discount rate) — shown, but left out of the weights, which measure data uncertainty.
export function sensitivity(product, raw, sample = false, policy = [], spread = 0.2) {
  const vals = derive(product, raw).status.rows.reduce((o, r) => (o[r.input.key] = r.value, o), {});
  const base = run(product, raw, {}, sample);
  if (!base) return null;
  const rows = [...FOR[product], ...policy].filter(k => Number.isFinite(vals[k])).map(k => {
    const [lo, hi, src] = sample ? RANGES[k] : [vals[k] * (1 - spread), vals[k] * (1 + spread), `±${Math.round(spread * 100)}% จากค่าที่ใส่`];
    const L = run(product, raw, { [k]: lo }, sample), H = run(product, raw, { [k]: hi }, sample);
    return L && H ? { key: k, label: LABEL[k], unit: PCT.has(k) ? '%' : UNIT[k], lo, hi, src, L, H, policy: policy.includes(k) } : null;
  }).filter(Boolean);
  const ok = x => Number.isFinite(x);
  const sq = f => rows.reduce((s, o) => s + (!o.policy && ok(f(o.H)) && ok(f(o.L)) ? (f(o.H) - f(o.L)) ** 2 : 0), 0);
  const totI = sq(x => x.irr), totN = sq(x => x.npv);
  for (const o of rows) {
    o.swingIrr = ok(o.H.irr) && ok(o.L.irr) ? Math.abs(o.H.irr - o.L.irr) : 0;
    o.wIrr = !o.policy && totI ? o.swingIrr ** 2 / totI : 0;
    o.wNpv = !o.policy && totN ? (o.H.npv - o.L.npv) ** 2 / totN : 0;
  }
  rows.sort((a, b) => b.wIrr - a.wIrr);
  const data = rows.filter(o => !o.policy), irrs = data.flatMap(o => [o.L.irr, o.H.irr]).filter(ok), npvs = data.flatMap(o => [o.L.npv, o.H.npv]);
  // value of each top factor at which IRR reaches the hurdle (8%), found by bisection inside a wide band
  const hurdle = raw.values.rate ?? 0.08;
  const breakEven = k => {
    const f = x => (run(product, raw, { [k]: x }, sample)?.irr ?? NaN) - hurdle;
    // scan 0.1×…3× of today's value for the sign change nearest today's value, then bisect it
    const pts = Array.from({ length: 30 }, (_, i) => vals[k] * (0.1 + i * 0.1)).filter(x => !PCT.has(k) || x <= 1);
    const fs = pts.map(f);
    let best = null;
    for (let i = 0; i + 1 < pts.length; i++) {
      if (!ok(fs[i]) || !ok(fs[i + 1]) || fs[i] * fs[i + 1] > 0) continue;
      if (!best || Math.abs(pts[i] - vals[k]) < Math.abs(best[0] - vals[k])) best = [pts[i], pts[i + 1], fs[i]];
    }
    if (!best) return null;
    let [a, b, fa] = best;
    for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
    return (a + b) / 2;
  };
  const top = data.slice(0, 3).map(o => ({ ...o, base: vals[o.key], breakEven: breakEven(o.key) }));
  return { base, rows, totI, totN, irrMin: Math.min(...irrs), irrMax: Math.max(...irrs), npvMin: Math.min(...npvs), npvMax: Math.max(...npvs), top, hurdle };
}
