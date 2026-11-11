// risk.js — Monte Carlo check: vary chosen inputs at random within ± ranges and recompute NPV / IRR.
// Each input gets a factor drawn from a triangular distribution on [1 − r, 1 + r] with the most likely value 1
// (the number entered). The ranges are starting points for the user to adjust, not data.
import { computeScenario } from './model.js';
import { derive, inputStatus } from './inputs.js';

export const RISK_VARS = {
  raw: {
    solar: [['onpk', 'การใช้ไฟของลูกค้า (หน่วย On-Peak)', 15], ['yld', 'ไฟที่ผลิตได้', 7], ['cost', 'ต้นทุนติดตั้งโซลาร์', 10], ['om', 'O&M โซลาร์', 20], ['ft', 'ค่า Ft', 30]],
    hybrid: [['onpk', 'การใช้ไฟของลูกค้า (หน่วย On-Peak)', 15], ['yld', 'ไฟที่ผลิตได้', 7], ['cost', 'ต้นทุนติดตั้งโซลาร์', 10], ['bpack', 'ราคาแบต (เซลล์ + BMS + ตู้)', 15],
      ['slsys', 'ราคาแบตมือสอง', 15], ['rte', 'ประสิทธิภาพชาร์จ-จ่าย', 5], ['relT', 'Demand ที่แบตลดได้ (TOU)', 30], ['relN', 'Demand ที่แบตลดได้ (ธรรมดา)', 30], ['ft', 'ค่า Ft', 30]],
    battery: [['bpack', 'ราคาแบต (เซลล์ + BMS + ตู้)', 15], ['slsys', 'ราคาแบตมือสอง', 15], ['rte', 'ประสิทธิภาพชาร์จ-จ่าย', 5], ['relT', 'Demand ที่แบตลดได้ (TOU)', 30],
      ['relN', 'Demand ที่แบตลดได้ (ธรรมดา)', 30], ['custsur', 'ไฟโซลาร์เหลือของลูกค้า', 20], ['bom', 'O&M แบต', 20], ['ft', 'ค่า Ft', 30]],
  },
  direct: [['revenue_y1', 'รายได้ปีแรก', 15], ['revenue2_y1', 'รายได้ส่วนที่ 2', 20], ['initial_investment', 'เงินลงทุนเริ่มต้น', 10], ['om_y1', 'ค่า O&M ปีแรก', 20], ['other_y1', 'ค่าใช้จ่ายอื่นปีแรก', 20]],
};

function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function triangular(u, r) { return u < 0.5 ? 1 - r + Math.sqrt(u * 2 * r * r) : 1 + r - Math.sqrt((1 - u) * 2 * r * r); }
const pct = (sorted, p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))] : null;

// Variables that matter for this project: used by the selected options and not zero.
export function riskVars(product, scenario) {
  if (scenario.input_mode === 'raw') {
    const st = inputStatus(product, scenario.raw);
    return RISK_VARS.raw[product].filter(([k]) => { const row = st.rows.find(x => x.input.key === k); return row && row.used && row.value; })
      .map(([key, label, range]) => ({ key, label, range }));
  }
  return RISK_VARS.direct.filter(([k]) => scenario[k]).map(([key, label, range]) => ({ key, label, range }));
}

// vars: [{ key, range (in %) }] · returns NPV / IRR percentiles, chance NPV > 0 and a histogram of NPV
export function simulate(product, scenario, vars, n = 1000, seed = 20261116) {
  const r = rng(seed), npvs = [], irrs = [];
  const raw = scenario.input_mode === 'raw', st = raw ? inputStatus(product, scenario.raw) : null;
  for (let i = 0; i < n; i++) {
    let s;
    if (raw) {
      const values = { ...scenario.raw.values };
      for (const v of vars) { const base = st.rows.find(x => x.input.key === v.key).value; values[v.key] = base * triangular(r(), v.range / 100); }
      const d = derive(product, { ...scenario.raw, values });
      s = { ...scenario, ...d.fields };
    } else {
      s = { ...scenario };
      for (const v of vars) s[v.key] = scenario[v.key] * triangular(r(), v.range / 100);
    }
    const res = computeScenario(s);
    npvs.push(res.npv); if (res.irr != null) irrs.push(res.irr);
  }
  npvs.sort((a, b) => a - b); irrs.sort((a, b) => a - b);
  const lo = npvs[0], hi = npvs.at(-1), bins = 20, width = (hi - lo) / bins || 1;
  const hist = Array.from({ length: bins }, (_, i) => ({ from: lo + i * width, to: lo + (i + 1) * width, count: 0 }));
  for (const v of npvs) hist[Math.min(bins - 1, Math.floor((v - lo) / width))].count++;
  return {
    n, pPositive: npvs.filter(v => v > 0).length / n,
    npv: { p10: pct(npvs, 0.1), p50: pct(npvs, 0.5), p90: pct(npvs, 0.9), min: lo, max: hi },
    irr: { p10: pct(irrs, 0.1), p50: pct(irrs, 0.5), p90: pct(irrs, 0.9), found: irrs.length },
    hist,
  };
}
