// What-if IRRs for the beverage-factory test file (same engine that matches Excel). Prints JSON rows: [label, solar, hybrid, battery].
const root = new URL('../../', import.meta.url).pathname;
const { derive } = await import(root + 'domain/inputs.js');
const { computeScenario } = await import(root + 'domain/model.js');
const base = JSON.parse(process.argv[2]);
const irr = (p, values, sel = {}) => { const d = derive(p, { sel: { volt: 2, ...sel }, values }); return d.complete ? computeScenario({ ...d.fields, decision_override: 'auto' }).irr : null; };
const rows = [['ค่าตั้งต้น', {}], ['ต้นทุนโซลาร์ 20 บาท/W', { cost: 20 }], ['ส่วนลด PPA 10%', { disc: 0.10 }], ['ไม่มี ENZY และค่าใช้จ่ายอื่นแบต', { enzy: 0, othB: 0 }],
  ['ใช้แบตมือสอง', {}, { bt: 2 }], ['โรงงานทำงาน 7 วัน (355 วัน)', { wdays: 355, mon: 0 }], ['แบตชุดใหม่ตอนเปลี่ยนราคา 40% (แทน 60%)', { bswapPct: 0.4 }]];
console.log(JSON.stringify(rows.map(([label, v, sel]) => [label, ...['solar', 'hybrid', 'battery'].map(p => irr(p, { ...base, ...v }, sel))])));
