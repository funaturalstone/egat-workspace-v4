// Every number in the pitch deck, computed with the platform engine (domain/inputs.js → domain/model.js).
// Assumptions follow "Research 3 ผลิตภัณฑ์" (customers A/B, min/mid/max table). Run: node tools/slides/slide_numbers.mjs
const root = new URL('../../', import.meta.url).pathname;
const { derive } = await import(root + 'domain/inputs.js');
const { computeScenario } = await import(root + 'domain/model.js');
const { bessScenario } = await import(root + 'domain/bess.js');

export function run(product, sel, values) {
  const d = derive(product, { sel: { volt: 2, ...sel }, values });
  if (!d.complete) throw Error(`${product} missing ${d.missing}`);
  const r = computeScenario({ ...d.fields, decision_override: 'auto' });
  return { irr: r.irr, npv: r.npv, pb: r.payback, dpb: r.discounted_payback, inv: d.fields.initial_investment, d, r };
}
const C = { hol: 11, wdays: 313, rate: 0.08, enzy: 0, xfer: 0 };
const LEVEL = {   // research min (worst) / mid / max (best)
  min: { cost: 32, yld: 1250, useA: 0.75, use2: 0.78, om: 0.025, esc: 0.002, bprice: 15000, rel: 0.3, bdeg: 0.03, bom: 0.02, blife: 10 },
  mid: { cost: 25, yld: 1400, useA: 0.85, use2: 0.88, om: 0.02, esc: 0.005, bprice: 13500, rel: 0.5, bdeg: 0.025, bom: 0.015, blife: 10 },
  max: { cost: 18, yld: 1475, useA: 0.90, use2: 0.93, om: 0.015, esc: 0.006, bprice: 8630, rel: 0.8, bdeg: 0.02, bom: 0.01, blife: 15 },
};
const B_LOAD = 1400, B_SURPLUS_FREE = 1;   // customer B: 1,400 kWh daytime load per working day
const onpkFor = dayload => dayload * (250 / 12) * 13 / 9;   // On-Peak units that give this daytime load in the platform's bill method
const solar = (L, x = {}) => ({ ...C, kwp: 500, cost: L.cost, yld: L.yld, after9: 0.89, deg: 0.007, om: L.om, inf: 0.02, invY: 12, invC: 3000, disc: 0.15, othS: 0, term: 15, esc: L.esc, ...x });
const bat = (L, x = {}) => ({ bkwh: 500, bkw: 250, dod: 0.8, rte: 0.85, bpack: L.bprice, bpcs: 0, binst: 0, blump: 0, bdeg: L.bdeg, bom: L.bom, share: 0.85, othB: 0, pdem: 1000, relT: L.rel, relN: L.rel, ...x });
// Solar + Battery: battery swap in year 10 = 60% of battery cost + PCS 3,000 baht/kW; year-15 salvage = 50% of the swap
const sbSwap = L => { const capB = L.bprice * 500, swap = 0.6 * capB + 3000 * 250; return { bswap: 10, bswapPct: swap / capB, xfer: 0.5 * swap, hlife: 15, mon: 50 }; };

export const cases = {};
const put = (k, f) => { cases[k] = Object.fromEntries(['min', 'mid', 'max'].map(l => [l, f(LEVEL[l])])); };
put('1 Solar A 15y', L => run('solar', { um: 2 }, solar(L, { useman: L.useA })));
put('1-20 Solar A 20y', L => run('solar', { um: 2 }, solar(L, { useman: L.useA, term: 20 })));
put('1B Solar B', L => run('solar', { um: 1 }, solar(L, { onpk: onpkFor(B_LOAD) })));
put('2 A has battery + solar', L => run('solar', { um: 2 }, solar(L, { useman: L.use2 })));
put('3A Solar+Battery A', L => run('hybrid', { um: 2 }, { ...solar(L, { useman: L.useA }), ...bat(L), ...sbSwap(L) }));
put('3B Solar+Battery B', L => run('hybrid', { um: 1 }, { ...solar(L, { onpk: onpkFor(B_LOAD) }), ...bat(L), ...sbSwap(L) }));
const surplusB = L => 500 * L.yld / 365 - B_LOAD;
put('4 Battery free charge', L => run('battery', { src: 2 }, { ...C, esc: L.esc, inf: 0.02, ...bat(L), blife: L.blife, bsalv: 0.1, custsur: surplusB(L), chgh: 4 }));
put('5 Battery grid', L => run('battery', { src: 1 }, { ...C, esc: L.esc, inf: 0.02, ...bat(L), blife: L.blife, bsalv: 0.1 }));
// normal meter
const N = { meter: 2 };
put('N1 Solar A 15y normal', L => run('solar', { um: 2, ...N }, solar(L, { useman: L.useA })));
put('N1-20 Solar A 20y normal', L => run('solar', { um: 2, ...N }, solar(L, { useman: L.useA, term: 20 })));
put('N1B Solar B normal', L => run('solar', { um: 1, ...N }, solar(L, { onpk: onpkFor(B_LOAD) })));
put('N2 A battery + solar normal', L => run('solar', { um: 2, ...N }, solar(L, { useman: L.use2 })));
put('N3B Solar+Battery B normal', L => run('hybrid', { um: 1, ...N }, { ...solar(L, { onpk: onpkFor(B_LOAD) }), ...bat(L), ...sbSwap(L) }));
put('N4 Battery free normal', L => run('battery', { src: 2, ...N }, { ...C, esc: L.esc, inf: 0.02, ...bat(L), blife: L.blife, bsalv: 0.1, custsur: surplusB(L), chgh: 4 }));
put('N5 Battery grid normal', L => run('battery', { src: 1, ...N }, { ...C, esc: L.esc, inf: 0.02, ...bat(L), blife: L.blife, bsalv: 0.1, ndays: 250 }));

const M = LEVEL.mid;
const A = x => run('solar', { um: 2 }, solar(M, { useman: M.useA, ...x }));
export const tornado = {
  'meter TOU→normal': run('solar', { um: 2, meter: 2 }, solar(M, { useman: M.useA })),
  'use 85→75': A({ useman: 0.75 }), 'use 85→95': A({ useman: 0.95 }),
  'cost 25→22': A({ cost: 22 }), 'cost 25→28': A({ cost: 28 }),
  'yld 1400→1300': A({ yld: 1300 }), 'yld 1400→1475': A({ yld: 1475 }),
  'om 2→1.5': A({ om: 0.015 }), 'om 2→2.5': A({ om: 0.025 }),
  'rate 8→6': A({ rate: 0.06 }), 'rate 8→10': A({ rate: 0.10 }),
  'disc 15→10': A({ disc: 0.10 }), 'disc 15→20': A({ disc: 0.20 }),
  'esc 0.5→0.2': A({ esc: 0.002 }), 'esc 0.5→0.6': A({ esc: 0.006 }),
  'peak share 0.71→0.68': A({ after9: 0.68 * 313 / 250 }), 'peak share 0.71→0.80': A({ after9: 0.80 * 313 / 250 }),
  'term 15→20': A({ term: 20 }),
  'hol 11→19 (2570)': A({ hol: 19 }),
};
const B4 = x => run('battery', { src: 2 }, { ...C, esc: M.esc, inf: 0.02, ...bat(M), blife: 10, bsalv: 0.1, custsur: surplusB(M), chgh: 4, ...x });
export const batterySens = {
  'Demand 80%': B4({ relT: 0.8 }), 'Demand 30%': B4({ relT: 0.3 }), 'EGAT share 100%': B4({ share: 1 }),
  'life 15': B4({ blife: 15 }), 'O&M 1%': B4({ bom: 0.01 }), 'degradation 2%': B4({ bdeg: 0.02 }),
  'team: 10,000 baht/kWh + O&M 1%': B4({ bpack: 10000, bom: 0.01 }),
};
// break-even: highest price that still gives NPV ≥ 0 (or ≥ the solar-only NPV for the added battery)
const solve = (f, lo, hi) => { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; f(m) >= 0 ? lo = m : hi = m; } return lo; };
export const breakeven = {
  'Solar A TOU 15y (baht/W)': solve(c => A({ cost: c }).npv, 5, 60),
  'Solar A TOU 20y': solve(c => A({ cost: c, term: 20 }).npv, 5, 60),
  'Solar A normal 15y': solve(c => run('solar', { um: 2, meter: 2 }, solar(M, { useman: M.useA, cost: c })).npv, 5, 60),
  'Solar B TOU 15y': solve(c => run('solar', { um: 1 }, solar(M, { onpk: onpkFor(B_LOAD), cost: c })).npv, 5, 60),
  'Battery free TOU (baht/kWh)': solve(p => B4({ bpack: p }).npv, 100, 30000),
  'Battery free normal': solve(p => run('battery', { src: 2, meter: 2 }, { ...C, esc: M.esc, inf: 0.02, ...bat(M, { bpack: p }), blife: 10, bsalv: 0.1, custsur: surplusB(M), chgh: 4 }).npv, 100, 30000),
  'Battery grid TOU': solve(p => run('battery', { src: 1 }, { ...C, esc: M.esc, inf: 0.02, ...bat(M, { bpack: p }), blife: 10, bsalv: 0.1 }).npv, 100, 30000),
  'Battery grid normal': solve(p => run('battery', { src: 1, meter: 2 }, { ...C, esc: M.esc, inf: 0.02, ...bat(M, { bpack: p }), blife: 10, bsalv: 0.1, ndays: 250 }).npv, 100, 30000),
  'SB battery A (no worse than solar only)': solve(p => run('hybrid', { um: 2 }, { ...solar(M, { useman: M.useA }), ...bat({ ...M, bprice: p }), ...sbSwap({ ...M, bprice: p }) }).npv - cases['1 Solar A 15y'].mid.npv, 100, 30000),
  'SB battery B': solve(p => run('hybrid', { um: 1 }, { ...solar(M, { onpk: onpkFor(B_LOAD) }), ...bat({ ...M, bprice: p }), ...sbSwap({ ...M, bprice: p }) }).npv - cases['1B Solar B'].mid.npv, 100, 30000),
};
// EGAT BESS-file method with the team's figures (10,000 baht/kWh, O&M 1%, tariff management not counted twice)
export const egatMethod = {
  'file as is (min)': computeScenario(bessScenario('min')),
  'file as is (max)': computeScenario(bessScenario('max')),
  'team figures, no double count': computeScenario(bessScenario('min', { systemCostPerKwh: 10000, installCostPerKwh: 0, offpeakRate: 0 }, { om_y1: 0.01 * 5e6, other_y1: 0 })),
  'team figures, double count': computeScenario(bessScenario('min', { systemCostPerKwh: 10000, installCostPerKwh: 0 }, { om_y1: 0.01 * 5e6, other_y1: 0 })),
};

// same case with extra raw values (e.g. ENZY entry fee)
export function withExtra(key, level, product, extra) {
  const c = cases[key][level], v = Object.fromEntries(c.d.status.rows.map(r => [r.input.key, r.value]));
  return run(product, c.d.status.sel, { ...v, ...extra });
}
export const enzy = {
  'Solar A': withExtra('1 Solar A 15y', 'mid', 'solar', { enzy: 120000 }),
  'SB A': withExtra('3A Solar+Battery A', 'mid', 'hybrid', { enzy: 120000 }),
  'Battery free': withExtra('4 Battery free charge', 'mid', 'battery', { enzy: 120000 }),
  'Battery grid': withExtra('5 Battery grid', 'mid', 'battery', { enzy: 120000 }),
};

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const f = x => `${x.irr == null ? '—' : (x.irr * 100).toFixed(2) + '%'} ${(x.npv / 1e6).toFixed(3)}M pb ${x.pb == null ? 'none' : x.pb.toFixed(2)}/${x.dpb == null ? 'none' : x.dpb.toFixed(2)} inv ${(x.inv / 1e6).toFixed(3)}`;
  for (const [k, v] of Object.entries(cases)) console.log(k.padEnd(30), '| mid', f(v.mid), '| min', ((v.min.irr ?? NaN) * 100).toFixed(1) + '%', (v.min.npv / 1e6).toFixed(2), '| max', ((v.max.irr ?? NaN) * 100).toFixed(1) + '%', (v.max.npv / 1e6).toFixed(2));
  console.log('--- tornado'); for (const [k, v] of Object.entries(tornado)) console.log(k.padEnd(24), f(v));
  console.log('--- battery'); for (const [k, v] of Object.entries(batterySens)) console.log(k.padEnd(34), f(v));
  console.log('--- breakeven'); for (const [k, v] of Object.entries(breakeven)) console.log(k.padEnd(40), v.toFixed(1));
  console.log('--- EGAT method'); for (const [k, v] of Object.entries(egatMethod)) console.log(k.padEnd(34), (v.irr * 100).toFixed(2) + '%', (v.npv / 1e6).toFixed(3), v.payback?.toFixed(2));
  const s = 250 / 313 * 0.89, av = s * 4.1839 + (1 - s) * 2.6037 + 0.1623;
  console.log('--- peak share', s.toFixed(4), 'avoided', av.toFixed(4), 'PPA', (av * 0.85).toFixed(4), 'normal avoided', (3.1471 + 0.1623).toFixed(4), 'normal PPA', ((3.1471 + 0.1623) * 0.85).toFixed(4), 'solar/day', (500 * 1400 / 365).toFixed(1), 'B use', (1400 * 313 / 700000).toFixed(4), 'B surplus', (500 * 1400 / 365 - 1400).toFixed(1));
}
