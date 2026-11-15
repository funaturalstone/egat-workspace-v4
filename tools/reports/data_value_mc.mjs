// Data value study: how much each piece of customer data (bill fields, the 16 questions, quotes, 15-minute file)
// narrows the error of IRR / NPV, using the platform engine and Monte Carlo. Writes data_value_mc.json.
// Error ranges are team assumptions (documented in the report), not measured data.
import fs from 'node:fs';
const { run } = await import('../slides/slide_numbers.mjs');

const rng = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const tri = (u, r) => u < 0.5 ? 1 - r + Math.sqrt(u * 2 * r * r) : 1 + r - Math.sqrt((1 - u) * 2 * r * r);
const pct = (a, p) => a[Math.round(p * (a.length - 1))];

// ---- customers (Research 3 mid values) --------------------------------------------------------------
const C = { hol: 11, wdays: 313, rate: 0.08, enzy: 0, xfer: 0, esc: 0.005, inf: 0.02 };
const solarV = x => ({ ...C, kwp: 500, cost: 25, yld: 1400, after9: 0.89, deg: 0.007, om: 0.02, disc: 0.15, othS: 0, term: 15, invY: 12, invC: 3000, useman: 0.85, ...x });
const batV = x => ({ bkwh: 500, bkw: 250, dod: 0.8, rte: 0.85, bpack: 13500, bpcs: 0, binst: 0, blump: 0, bdeg: 0.025, bom: 0.015, share: 0.85, othB: 0, pdem: 1000, relT: 0.5, relN: 0.5, ...x });
const swap = { bswap: 10, bswapPct: (0.6 * 13500 * 500 + 3000 * 250) / (13500 * 500), xfer: 0.5 * (0.6 * 13500 * 500 + 3000 * 250), hlife: 15, mon: 50 };
export const PRODUCTS = {
  solar500: { label: 'Solar PPA 500 kWp (ลูกค้า A ใน Research 3)', prod: 'solar', sel: { um: 2 }, v: solarV(), items: ['B1', 'B2', 'B3', 'Q47', 'Q910', 'QS', 'F15'] },
  solar150: { label: 'Solar PPA 150 kWp (โรงงานคุณต้น 2 กะ 6 วัน)', prod: 'solar', sel: { um: 2 }, v: solarV({ kwp: 150, wdays: 312, useman: 0.83 }), items: ['B1', 'B2', 'B3', 'Q47', 'Q910', 'QS', 'F15'] },
  hybrid: { label: 'Solar + Battery (ลูกค้า A)', prod: 'hybrid', sel: { um: 2 }, v: { ...solarV(), ...batV(), ...swap }, items: ['B1', 'B2', 'B3', 'Q47', 'Q56', 'Q910', 'QS', 'QB', 'F15'] },
  battery: { label: 'Battery 500 kWh / 250 kW ชาร์จจากกริด', prod: 'battery', sel: { src: 1 }, v: { ...C, ...batV(), blife: 10, bsalv: 0.1, ndays: 250 }, items: ['B1', 'Q56', 'QB', 'F15'] },
};

// ---- data items and the ± error each one leaves --------------------------------------------------------
export const ITEMS = {
  B1: 'บิล: ประเภทอัตรา / ชนิดมิเตอร์', B2: 'บิล: หน่วย On-Peak / Off-Peak', B3: 'บิล: ที่อยู่ → PVGIS',
  Q47: 'คำถามข้อ 4, 7: วัน-เวลาทำงาน, วันหยุด', Q56: 'คำถามข้อ 5, 6: ช่วงพีคและสาเหตุ', Q910: 'คำถามข้อ 9, 10: มีโซลาร์อยู่แล้วไหม',
  QS: 'ใบเสนอราคาโซลาร์ + สำรวจหน้างาน', QB: 'ใบเสนอราคาแบต', F15: 'ไฟล์การใช้ไฟ 15 นาที',
};
let P_HIDDEN_SOLAR = 0.10, HIDDEN_SOLAR_CUT = 0.6;
export const setHiddenSolar = (p, cut = 0.6) => { P_HIDDEN_SOLAR = p; HIDDEN_SOLAR_CUT = cut; };   // if Q9/10 not asked: 10% chance existing solar already takes 40% of the daytime load
export function ranges(has) {
  const useman = has.F15 ? 3 : has.B2 && has.Q47 ? 8 : has.B2 ? 12 : has.Q47 ? 15 : 25;
  return {
    useman, yld: has.QS ? 3 : has.B3 ? 5 : 10, cost: has.QS ? 5 : 15, om: has.QS ? 10 : 20,
    rel: has.F15 ? 10 : has.Q56 ? 40 : 50, bpack: has.QB ? 5 : 15, rte: has.QB ? 3 : 5, bom: has.QB ? 10 : 20,
  };
}
const KEYS = ['useman', 'yld', 'cost', 'om', 'rel', 'bpack', 'rte', 'bom'];

// One study = draw N "true worlds" around the analyst's estimate. Common random numbers: every input always
// consumes its own uniform draw in the same order, so subsets differ only through their ranges.
export function study(pk, has, trueMeter = 1, N = 2000, seed = 20261116, keep = false) {
  const P = PRODUCTS[pk], R = ranges(has);
  const estMeter = has.B1 ? trueMeter : 1;                       // without the tariff line the analyst assumes TOU
  const est = run(P.prod, { ...P.sel, meter: estMeter }, P.v);
  const r = rng(seed), npv = [], irr = [], dIrr = [], rows = [];
  for (let i = 0; i < N; i++) {
    const u = KEYS.map(() => r()), uMeter = r(), uSolar = r();
    let v = { ...P.v };
    KEYS.forEach((k, j) => {
      const f = tri(u[j], R[k] / 100);
      if (k === 'rel') { v.relT *= f; v.relN *= f; } else if (k in v) v[k] *= f;
    });
    if (!has.Q910 && uSolar < P_HIDDEN_SOLAR && 'useman' in v) v.useman *= HIDDEN_SOLAR_CUT;
    v.useman = Math.min(v.useman ?? 0, 0.98) || v.useman;
    const meter = has.B1 ? trueMeter : (uMeter < 0.5 ? 1 : 2);
    const t = run(P.prod, { ...P.sel, meter }, v);
    npv.push(t.npv); irr.push(t.irr ?? -0.99); dIrr.push(Math.abs((t.irr ?? -0.99) - (est.irr ?? -0.99)));
    if (keep) rows.push({ useman: v.useman, cost: v.cost, yld: v.yld, om: v.om, meter, irr: t.irr, npv: t.npv });
  }
  const mean = npv.reduce((a, b) => a + b, 0) / N, varN = npv.reduce((a, b) => a + (b - mean) ** 2, 0) / N;
  const wrong = npv.filter(x => (x > 0) !== (est.npv > 0)).length / N;
  const off1 = dIrr.filter(x => x > 0.01).length / N, off2 = dIrr.filter(x => x > 0.02).length / N;
  const offNpv = npv.filter(x => Math.abs(x - est.npv) > 0.1 * est.inv).length / N;
  const s = [...npv].sort((a, b) => a - b), si = [...irr].sort((a, b) => a - b);
  return { est: { irr: est.irr, npv: est.npv, inv: est.inv }, var: varN, npv10: pct(s, .1), npv50: pct(s, .5), npv90: pct(s, .9),
    irr10: pct(si, .1), irr50: pct(si, .5), irr90: pct(si, .9), wrong, off1, off2, offNpv, pPos: npv.filter(x => x > 0).length / N, ...(keep ? { rows } : {}) };
}

// ---- 1. bill-type scenarios --------------------------------------------------------------------------
const Q = { Q47: 1, Q56: 1, Q910: 1 };
export const SCEN = [
  { id: 'S1', label: 'บิล TOU + คำถาม 16 ข้อ', meter: 1, has: { B1: 1, B2: 1, B3: 1, ...Q } },
  { id: 'S2', label: 'บิลธรรมดาที่แยกหน่วย P/OP + คำถาม 16 ข้อ', meter: 2, has: { B1: 1, B2: 1, B3: 1, ...Q } },
  { id: 'S3', label: 'บิลธรรมดาไม่แยกหน่วย + คำถาม 16 ข้อ', meter: 2, has: { B1: 1, B3: 1, ...Q } },
  { id: 'S4', label: 'บิล TOU อย่างเดียว (ไม่ได้ถาม)', meter: 1, has: { B1: 1, B2: 1, B3: 1 } },
  { id: 'S5', label: 'บิลธรรมดาไม่แยกหน่วย อย่างเดียว', meter: 2, has: { B1: 1, B3: 1 } },
  { id: 'S6', label: 'บิลไม่ครบ (ไม่เห็นประเภทอัตรา) + คำถาม 16 ข้อ', meter: 1, has: { B3: 1, ...Q } },
  { id: 'S7', label: 'บิล TOU + คำถาม + ใบเสนอราคา', meter: 1, has: { B1: 1, B2: 1, B3: 1, ...Q, QS: 1, QB: 1 } },
  { id: 'S8', label: 'บิล TOU + คำถาม + ใบเสนอราคา + ไฟล์ 15 นาที (ครบ)', meter: 1, has: { B1: 1, B2: 1, B3: 1, ...Q, QS: 1, QB: 1, F15: 1 } },
  { id: 'S9', label: 'บิลธรรมดา + คำถาม + ใบเสนอราคา + ไฟล์ 15 นาที (ครบ)', meter: 2, has: { B1: 1, B3: 1, ...Q, QS: 1, QB: 1, F15: 1 } },
];

// ---- 2. Shapley weights of each item on NPV variance (TOU customer) ---------------------------------------
export function shapley(pk, N = 2000) {
  const items = PRODUCTS[pk].items, n = items.length, cache = new Map();
  const V = mask => { if (!cache.has(mask)) { const has = {}; items.forEach((it, i) => { if (mask & (1 << i)) has[it] = 1; }); cache.set(mask, study(pk, has, 1, N).var); } return cache.get(mask); };
  const fact = k => k <= 1 ? 1 : k * fact(k - 1), phi = Object.fromEntries(items.map(i => [i, 0]));
  for (let mask = 0; mask < 1 << n; mask++) {
    const size = mask.toString(2).split('').filter(c => c === '1').length;
    items.forEach((it, i) => { if (mask & (1 << i)) return; const w = fact(size) * fact(n - size - 1) / fact(n); phi[it] += w * (V(mask) - V(mask | (1 << i))); });
  }
  const none = V(0), all = V((1 << n) - 1), tot = none - all;
  return { none, all, items: items.map(it => ({ id: it, label: ITEMS[it], phi: phi[it], share: phi[it] / tot })).sort((a, b) => b.phi - a.phi) };
}

// ---- 3. add / remove one item from S1 -------------------------------------------------------------------
export function marginal(pk) {
  const base = SCEN[0].has, items = PRODUCTS[pk].items, out = [];
  for (const it of items) {
    const has = { ...base }; const added = !has[it];
    if (added) has[it] = 1; else delete has[it];
    out.push({ id: it, label: ITEMS[it], change: added ? 'เพิ่ม' : 'ตัดออก', r: study(pk, has, 1) });
  }
  return out;
}

// ---- 4. convergence: how many runs are enough ----------------------------------------------------------
export function convergence(pk = 'solar500') {
  const out = [];
  for (const N of [100, 250, 500, 1000, 2000, 5000, 10000]) {
    const w = [], p10 = [];
    for (let s = 1; s <= 30; s++) { const o = study(pk, SCEN[0].has, 1, N, 1000 + s * 7919); w.push(o.wrong); p10.push(o.npv10); }
    const m = w.reduce((a, b) => a + b, 0) / w.length, sd = Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / (w.length - 1));
    const m2 = p10.reduce((a, b) => a + b, 0) / p10.length, sd2 = Math.sqrt(p10.reduce((a, b) => a + (b - m2) ** 2, 0) / (p10.length - 1));
    out.push({ N, meanWrong: m, sdWrong: sd, theory: Math.sqrt(m * (1 - m) / N), sdP10: sd2, vals: w });
  }
  return out;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const t0 = Date.now(), res = { scen: {}, shapley: {}, marginal: {}, conv: null, assumptions: { P_HIDDEN_SOLAR, HIDDEN_SOLAR_CUT } };
  for (const pk of Object.keys(PRODUCTS)) res.scen[pk] = SCEN.map(s => ({ ...s, r: study(pk, s.has, s.meter) }));
  console.log('scenarios', (Date.now() - t0) / 1000, 's');
  for (const pk of Object.keys(PRODUCTS)) { res.shapley[pk] = shapley(pk); res.marginal[pk] = marginal(pk); console.log('shapley', pk, (Date.now() - t0) / 1000, 's'); }
  res.q910 = [0.05, 0.10, 0.20].map(p => { setHiddenSolar(p); const sh = shapley('solar500'); return { p, items: sh.items.map(i => ({ id: i.id, share: i.share })) }; });
  setHiddenSolar(0.10);
  res.conv = convergence(); console.log('convergence', (Date.now() - t0) / 1000, 's');
  fs.writeFileSync(new URL('./data_value_mc.json', import.meta.url), JSON.stringify(res, null, 1));
}
