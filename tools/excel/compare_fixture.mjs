// Compares Excel results (from run_excel_cases.py) with the platform: domain/inputs.js → domain/model.js
import fs from 'node:fs';
const root = new URL('../../', import.meta.url).pathname;
const { derive } = await import(root + 'domain/inputs.js');
const { computeScenario } = await import(root + 'domain/model.js');
const { customerSavings } = await import(root + 'charts.js');
const C = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const agg = {}; const bad = [];
const num = x => typeof x === 'number' && Number.isFinite(x);
const track = (k, a, b, label) => { const e = Math.abs(a - b); agg[k] ??= { n: 0, max: 0 }; agg[k].n++; if (e > agg[k].max) agg[k].max = e; if (e > 1e-6 * Math.max(1, Math.abs(b))) bad.push(`${label} ${k}: platform ${a} vs Excel ${b}`); };
for (const c of C) {
  const label = `${c.case}/${c.product}`;
  if (c.status !== '✅ ครบ') { bad.push(`${label} Excel status ${c.status}`); continue; }
  const d = derive(c.product, c.raw);
  if (!d.complete) { bad.push(`${label} platform missing ${d.missing}`); continue; }
  for (const [k, v] of Object.entries(c.fields)) track('field:' + k, d.fields[k], v, label);
  const r = computeScenario({ ...d.fields, decision_override: 'auto' }), x = c.excel;
  for (const side of ['platform', 'full']) {
    track(side + ':NPV', r.npv, x['NPV (บาท)'][side], label);
    if (num(x['IRR'][side])) track(side + ':IRR', r.irr, x['IRR'][side], label); else bad.push(`${label} Excel IRR ${x['IRR'][side]}`);
    const pb = x['คืนทุน (ปี)'][side];
    if (num(pb)) track(side + ':payback', r.payback, pb, label); else { agg[side + ':never pays back'] ??= { n: 0, max: 0 }; agg[side + ':never pays back'].n++; if (r.payback != null) bad.push(`${label} payback ${r.payback} vs ${pb}`); }
    const en = x['NPV ส่วนทุน (บาท)'][side];
    if (num(en)) { track(side + ':equity NPV', r.equity.npv, en, label); const ei = x['IRR ส่วนทุน'][side]; if (num(ei)) track(side + ':equity IRR', r.equity.irr, ei, label); }
    else if (r.equity) bad.push(`${label} platform has equity, Excel says ${en}`);
  }
  track('customer saving', customerSavings(r, c.product === 'solar').saving, x['ผลประหยัดของลูกค้าปีแรก'].full, label);
}
for (const [k, v] of Object.entries(agg)) console.log(k.padEnd(34), 'n', String(v.n).padStart(4), ' max abs diff', v.max.toExponential(2));
console.log('cases', C.length, '· problems', bad.length); bad.slice(0, 15).forEach(b => console.log('  ' + b));
