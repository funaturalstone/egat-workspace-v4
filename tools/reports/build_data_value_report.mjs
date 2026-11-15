// Builds reports/รายงานความคลาดเคลื่อน_บิลและคำถาม.html from data_value_mc.json (run data_value_mc.mjs first).
import fs from 'node:fs';
import { ranges, ITEMS } from './data_value_mc.mjs';
const R = JSON.parse(fs.readFileSync(new URL('./data_value_mc.json', import.meta.url)));
const OUT = new URL('../../reports/รายงานความคลาดเคลื่อน_บิลและคำถาม.html', import.meta.url);
const p0 = x => (x * 100).toFixed(0) + '%', p1 = x => (x * 100).toFixed(1) + '%', m = x => (x / 1e6).toFixed(2);
const irr = x => x == null || x <= -0.98 ? '—' : (x * 100).toFixed(1) + '%';
const pm = r => '±' + ((r.irr90 - r.irr10) / 2 * 100).toFixed(1);
const S = (pk, id) => R.scen[pk].find(s => s.id === id);
const PN = { solar500: 'Solar PPA', hybrid: 'Solar + Battery', battery: 'Battery' };
const sh = R.shapley, s1 = pk => S(pk, 'S1').r;
const bar = (v, max, cls = '') => `<span class="bar ${cls}"><i style="width:${Math.max(1, v / max * 100).toFixed(1)}%"></i></span>`;
const c = R.conv, c2000 = c.find(x => x.N === 2000), c1000 = c.find(x => x.N === 1000), c5000 = c.find(x => x.N === 5000);

// error ladders shown in the method section
const L = (has) => ranges(has);
const ladder = [
  ['สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', [['ไม่มีข้อมูล', L({}).useman], ['คำถามข้อ 4, 7 เท่านั้น (บิลไม่แยกหน่วย)', L({ Q47: 1 }).useman], ['บิลแยกหน่วย On/Off-Peak เท่านั้น', L({ B2: 1 }).useman], ['บิลแยกหน่วย + คำถามข้อ 4, 7', L({ B2: 1, Q47: 1 }).useman], ['ไฟล์ 15 นาที', L({ F15: 1 }).useman]]],
  ['ไฟที่ผลิตได้ (kWh/kWp)', [['รู้แค่จังหวัด', L({}).yld], ['ที่อยู่ในบิล → PVGIS', L({ B3: 1 }).yld], ['สำรวจหน้างาน (มากับใบเสนอราคา)', L({ QS: 1 }).yld]]],
  ['ราคาติดตั้งโซลาร์ / O&M โซลาร์', [['ราคาตลาดเฉลี่ย', `${L({}).cost} / ${L({}).om}`], ['ใบเสนอราคา', `${L({ QS: 1 }).cost} / ${L({ QS: 1 }).om}`]]],
  ['ราคาแบต / ประสิทธิภาพชาร์จ-จ่าย / O&M แบต', [['ราคาตลาดเฉลี่ย', `${L({}).bpack} / ${L({}).rte} / ${L({}).bom}`], ['ใบเสนอราคา + สเปก', `${L({ QB: 1 }).bpack} / ${L({ QB: 1 }).rte} / ${L({ QB: 1 }).bom}`]]],
  ['% Demand ที่แบตลดได้', [['ไม่มีข้อมูล', L({}).rel], ['คำถามข้อ 5, 6', L({ Q56: 1 }).rel], ['ไฟล์ 15 นาที', L({ F15: 1 }).rel]]],
];

const scenRows = pk => R.scen[pk].map(s => { const r = s.r; return `<tr${s.id === 'S1' ? ' class="hl"' : ''}><td>${s.id}</td><td>${s.label}</td><td>${irr(r.est.irr)}</td><td>${irr(r.irr10)} – ${irr(r.irr90)}</td><td>${pm(r)}</td><td>${m(r.npv10)} – ${m(r.npv90)}</td><td><b>${p1(r.wrong)}</b></td><td>${p0(r.off1)}</td><td>${p0(r.off2)}</td></tr>`; }).join('');
const scenTable = pk => `<table class="num"><thead><tr><th></th><th>ข้อมูลที่มี</th><th>IRR ที่ประเมิน</th><th>IRR จริง P10–P90</th><th>คลาด<br>(จุด)</th><th>NPV จริง P10–P90<br>(ล้านบาท)</th><th>ตัดสินใจผิด</th><th>IRR คลาด<br>&gt;1 จุด</th><th>IRR คลาด<br>&gt;2 จุด</th></tr></thead><tbody>${scenRows(pk)}</tbody></table>`;

const shapTable = pk => { const it = sh[pk].items, max = it[0].share; return `<table><thead><tr><th>ข้อมูล</th><th class="r">น้ำหนัก</th><th style="width:40%"></th></tr></thead><tbody>${it.map(i => `<tr><td>${i.label}</td><td class="r"><b>${p1(i.share)}</b></td><td>${bar(i.share, max)}</td></tr>`).join('')}</tbody></table>
<p class="note">ความแปรปรวนของ NPV เมื่อไม่มีข้อมูลเลย: ส่วนเบี่ยงเบนมาตรฐาน ${m(Math.sqrt(sh[pk].none))} ล้านบาท → เมื่อมีข้อมูลครบ ${m(Math.sqrt(sh[pk].all))} ล้านบาท · น้ำหนักรวม 100% = ส่วนที่ลดลงทั้งหมด</p>`; };

const marg = pk => { const base = s1(pk); return `<table class="num"><thead><tr><th>เปลี่ยนจากกรณี S1 (บิล TOU + 16 ข้อ)</th><th>IRR คลาด (จุด)</th><th>ตัดสินใจผิด</th><th>IRR คลาด &gt;1 จุด</th></tr></thead><tbody>
<tr class="hl"><td>S1 ตามเดิม</td><td>${pm(base)}</td><td>${p1(base.wrong)}</td><td>${p0(base.off1)}</td></tr>
${R.marginal[pk].map(x => `<tr><td>${x.change === 'เพิ่ม' ? '➕ เพิ่ม' : '➖ ไม่มี'} ${x.label}</td><td>${pm(x.r)}</td><td>${p1(x.r.wrong)}</td><td>${p0(x.r.off1)}</td></tr>`).join('')}</tbody></table>`; };

const qMap = [
  ['1', 'ประเภทธุรกิจ / จำนวนโรงงาน', '0%', 'ไม่เข้าสูตร ใช้แยกโครงการ'],
  ['2, 3', 'หน่วยไฟและค่าไฟต่อเดือน', '0%', 'ซ้ำกับบิล ใช้ตรวจว่าตัวเลขตรงกัน'],
  ['4, 7', 'วัน-เวลาทำงาน, การใช้ไฟวันหยุด', p1(sh.solar500.items.find(i => i.id === 'Q47').share), 'ทำให้ช่วงสัดส่วนไฟที่ใช้ได้แคบลง'],
  ['5, 6', 'ช่วงพีคและสาเหตุ', p1(sh.hybrid.items.find(i => i.id === 'Q56').share) + ' (S+B) / ' + p1(sh.battery.items.find(i => i.id === 'Q56').share) + ' (Battery)', 'บอกได้แค่คร่าวๆ ว่าแบตตัดยอดได้แค่ไหน'],
  ['8, 15', 'แนวโน้มการใช้ไฟ / แผนขยาย', 'ไม่ได้วัด', 'แพลตฟอร์มยังไม่มีช่องการใช้ไฟเปลี่ยนรายปี ใช้เป็นธงเตือน'],
  ['9, 10', 'มีโซลาร์อยู่แล้วไหม', p1(sh.solar500.items.find(i => i.id === 'Q910').share), 'คำถามคัดกรอง ถ้าไม่ถามอาจประเมินไฟที่ใช้ได้สูงเกินจริงมาก'],
  ['11–14', 'ความสนใจ / เป้าหมายพลังงาน', '0%', 'ไม่เข้าสูตร ใช้จัดลำดับลูกค้า'],
  ['16', 'ข้อจำกัดการติดตั้ง', 'ไม่ได้วัด', 'กระทบขนาดระบบ (kWp) มากกว่า IRR ต้องยืนยันด้วยสำรวจหน้างาน'],
];

const bills = [
  ['กฟภ. ประเภท 3.2 / กฟน. ประเภท 3.2 (TOU)', 'ประเภทอัตรา, หน่วย On/Off-Peak, Demand ช่วง Peak, Ft, ที่อยู่, CA/มิเตอร์', '✅ รองรับเต็ม', 'S1, S4, S7, S8'],
  ['กฟภ. / กฟน. ประเภท 3.1 (ปกติ) มิเตอร์ CT ที่พิมพ์หน่วยแยกช่วง', 'เหมือนข้างบน แต่คิดเงินอัตราเดียว', '✅ รองรับ', 'S2'],
  ['ประเภท 3.1 (ปกติ) ที่ไม่แยกหน่วย', 'หน่วยรวม, Demand ทุกช่วงเวลา, Ft, ที่อยู่', '✅ รองรับ (ต้องใส่สัดส่วนไฟที่ใช้ได้เอง)', 'S3, S5, S9'],
  ['บิลไม่ครบ (ภาพเฉพาะยอดเงิน / หน้าแรก)', 'หน่วยรวม, ยอดเงิน, ที่อยู่', '⚠️ ต้องเดาประเภทอัตรา', 'S6'],
  ['ประเภท 4 กิจการขนาดใหญ่: TOD (4.1)', 'Demand แยก 3 ช่วงเวลา, พลังงานอัตราเดียว', '❌ ยังไม่รองรับ TOD', '—'],
  ['ประเภท 4 กิจการขนาดใหญ่: TOU (4.2)', 'เหมือน TOU ประเภท 3 แต่อัตราต่างกัน', '⚠️ ใช้ได้ถ้าใส่อัตราเอง', 'คล้าย S1'],
  ['ประเภท 2 กิจการขนาดเล็ก (&lt; 30 kW)', 'หน่วยรวม (บางใบแยกช่วง), ไม่มีค่า Demand', '⚪ นอกกลุ่มเป้าหมาย', '—'],
];

const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>ความคลาดเคลื่อนของ Feasibility</title>
<style>
@page{size:A4;margin:16mm 15mm}
:root{--ink:#1d2421;--muted:#5d6763;--line:#d6dedb;--g:#123d2e;--hl:#fff7d6;--o:#c2410c}
*{box-sizing:border-box}body{margin:0;font-family:"Sukhumvit Set","Thonburi","Noto Sans Thai",sans-serif;color:var(--ink);font-size:12.5px;line-height:1.6;background:#fff}
h1{font-size:23px;color:var(--g);margin:0 0 4px;line-height:1.3}h2{font-size:17px;color:var(--g);margin:26px 0 8px;border-bottom:2px solid var(--g);padding-bottom:3px}h3{font-size:14px;margin:16px 0 6px;break-after:avoid}h2{break-after:avoid}
.sub{color:var(--muted);margin:0 0 14px}p{margin:6px 0}
table{width:100%;border-collapse:collapse;margin:8px 0 6px;font-size:11.5px;break-inside:avoid}th,td{border-bottom:1px solid var(--line);padding:4px 6px;text-align:left;vertical-align:top}th{background:#eef3f1;font-weight:700;font-size:11px}
table.num td:nth-child(n+3),.r{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}tr.hl td{background:var(--hl)}
.box{border:1px solid var(--line);border-left:4px solid var(--g);border-radius:6px;padding:10px 14px;margin:10px 0;background:#f7faf9;break-inside:avoid}
.box.warn{border-left-color:var(--o);background:#fff8f3}
.kpi{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}.kpi div{border:1px solid var(--line);border-radius:6px;padding:8px 10px}.kpi small{display:block;color:var(--muted);font-size:10.5px}.kpi b{font-size:18px;color:var(--g)}
.bar{display:block;height:9px;background:#edf1ef;border-radius:5px;overflow:hidden}.bar i{display:block;height:100%;background:var(--g)}
.note{color:var(--muted);font-size:11px}ol,ul{margin:4px 0;padding-left:22px}li{margin:2px 0}code{font-size:11px;background:#f1f3f2;padding:0 4px;border-radius:3px}
.pb{break-before:page}
</style></head><body>
<h1>ข้อมูลแค่ไหนถึงพอ: ความคลาดเคลื่อนของ IRR / NPV<br>เมื่อมีบิลค่าไฟ + คำถามลูกค้า 16 ข้อ</h1>
<p class="sub">แพลตฟอร์มประเมินความคุ้มค่า Solar PPA · Solar + Battery · Battery · จำลอง Monte Carlo ด้วย engine เดียวกับแพลตฟอร์ม (ตรงกับ Excel ทุกกรณีที่ทดสอบ) · ${new Date().toISOString().slice(0, 10)}</p>

<h2>สรุป</h2>
<div class="kpi">
<div><small>Solar 500 kWp · บิล TOU + 16 ข้อ</small><b>IRR ${pm(s1('solar500'))} จุด</b><br><small>โอกาสตัดสินใจผิด ${p1(s1('solar500').wrong)}</small></div>
<div><small>Solar + Battery · บิล TOU + 16 ข้อ</small><b>IRR ${pm(s1('hybrid'))} จุด</b><br><small>โอกาสตัดสินใจผิด ${p1(s1('hybrid').wrong)}</small></div>
<div><small>Battery · บิล TOU + 16 ข้อ</small><b>IRR ${pm(s1('battery'))} จุด</b><br><small>โอกาสตัดสินใจผิด ${p1(s1('battery').wrong)}</small></div>
</div>
<ul>
<li><b>บิล TOU + คำถาม 16 ข้อ</b> ให้ IRR คลาดเคลื่อนประมาณ <b>±1.4–2.1 จุด</b> ทุกผลิตภัณฑ์ (ช่วง P10–P90)</li>
<li><b>Battery และ Solar + Battery ตัดสินได้ทันที (ผิด 0%)</b> เพราะผลอยู่ห่างจุดคุ้มทุนมาก แม้ข้อมูลคลาดเคลื่อนสุดทางก็ยังติดลบ</li>
<li><b>Solar ยังตัดสินไม่ได้</b> โอกาสผิด ${p1(s1('solar500').wrong)} เพราะ IRR อยู่ใกล้เกณฑ์ 8% ต้องขอข้อมูลเพิ่ม</li>
<li><b>ข้อมูลที่ควรขอต่อเป็นอันดับแรกคือใบเสนอราคา:</b> ลดโอกาสผิดของ Solar 500 kWp จาก ${p1(s1('solar500').wrong)} เหลือ ${p1(S('solar500', 'S7').r.wrong)} และเมื่อได้ไฟล์ 15 นาทีด้วย เหลือ ${p1(S('solar500', 'S8').r.wrong)}</li>
<li><b>ข้อมูลที่มีน้ำหนักมากที่สุด</b> (Solar): คำถามข้อ 9–10 "มีโซลาร์อยู่แล้วไหม" ${p1(sh.solar500.items[0].share)}, ประเภทอัตราในบิล ${p1(sh.solar500.items.find(i => i.id === 'B1').share)}, ไฟล์ 15 นาที ${p1(sh.solar500.items.find(i => i.id === 'F15').share)}, ใบเสนอราคา ${p1(sh.solar500.items.find(i => i.id === 'QS').share)} · สำหรับ Battery: ใบเสนอราคาแบต ${p1(sh.battery.items.find(i => i.id === 'QB').share)}</li>
<li><b>บิลที่ไม่เห็นประเภทอัตรา</b> อันตรายที่สุด: โอกาสผิดของ Solar ขึ้นเป็น ${p1(S('solar500', 'S6').r.wrong)} เพราะ TOU กับอัตราปกติให้ผลต่างกันถึงขั้นพลิกคำตอบ</li>
<li>จำลองกรณีละ <b>2,000 รอบ</b> ซึ่งทำให้ตัวเลข "โอกาสผิด" คลาดจากการสุ่มเองประมาณ ±1 จุด (ส่วนที่ 8)</li>
</ul>

<h2>1. คำถามของรายงาน และตัววัดที่ใช้</h2>
<p>ถ้า กฟผ. มีแค่ใบแจ้งค่าไฟของโรงงานกับคำตอบจากคำถาม 16 ข้อ (ไม่นับข้อมูลที่ กฟผ. รู้เองอยู่แล้ว เช่น อัตราคิดลด ส่วนแบ่ง หรือค่า ENZY) ผล IRR / NPV จะคลาดจากค่าจริงได้แค่ไหน ข้อมูลแต่ละชิ้นช่วยลดความคลาดเคลื่อนได้เท่าไร และควรขอข้อมูลอะไรต่อ</p>
<table><thead><tr><th>ตัววัด</th><th>ความหมาย</th></tr></thead><tbody>
<tr><td>IRR จริง P10–P90</td><td>ช่วงที่ IRR จริงน่าจะอยู่ 80% ของโอกาส (10% ต่ำกว่า P10, 10% สูงกว่า P90)</td></tr>
<tr><td>คลาด (จุด)</td><td>(P90 − P10) ÷ 2 เช่น 7.5–11.7% → ±2.1 จุดเปอร์เซ็นต์</td></tr>
<tr><td><b>โอกาสตัดสินใจผิด</b></td><td>% ของรอบที่ NPV จริงอยู่คนละฝั่งกับ NPV ที่ประเมิน (ประเมินว่าคุ้มแต่จริงไม่คุ้ม หรือกลับกัน)</td></tr>
<tr><td>IRR คลาด &gt;1 จุด / &gt;2 จุด</td><td>% ของรอบที่ IRR จริงต่างจาก IRR ที่ประเมินเกิน 1 หรือ 2 จุดเปอร์เซ็นต์</td></tr>
<tr><td>น้ำหนักของข้อมูล</td><td>ส่วนแบ่งของความแปรปรวน NPV ที่ลดลงเมื่อได้ข้อมูลชิ้นนั้น (Shapley value, ส่วนที่ 6)</td></tr>
</tbody></table>

<h2>2. วิธีการ</h2>
<h3>2.1 Monte Carlo คืออะไร</h3>
<p>ค่าที่ได้จากบิลและคำถามเป็นค่าประมาณ ค่าจริงอาจสูงหรือต่ำกว่านั้น การจำลองสุ่ม "โลกที่เป็นไปได้" 2,000 แบบรอบค่าที่ประเมิน คำนวณ IRR / NPV ทุกแบบผ่าน engine ของแพลตฟอร์ม แล้วดูว่าผลกระจายแค่ไหน</p>
<ol>
<li><b>แปลงค่าที่ไม่แน่นอนเป็นช่วง ±%</b> ตามข้อมูลที่มี (ตาราง 2.3) ข้อมูลยิ่งดี ช่วงยิ่งแคบ</li>
<li><b>สุ่มแบบสามเหลี่ยม:</b> ค่าที่ประเมินมีโอกาสมากที่สุด ขอบช่วงมีโอกาสน้อยที่สุด ใช้แค่ 3 ตัวเลข เหมาะกับกรณีที่ไม่มีข้อมูลในอดีต</li>
<li><b>สุ่มทุกค่าพร้อมกันในแต่ละรอบ</b> แล้วคำนวณ IRR / NPV หนึ่งครั้ง</li>
<li><b>ข้อมูลที่ขาดแบบ "ใช่ / ไม่ใช่":</b>
  <ul><li>ไม่เห็นประเภทอัตรา → สุ่มว่าเป็น TOU หรืออัตราปกติอย่างละ 50% (นักวิเคราะห์สมมติว่าเป็น TOU)</li>
  <li>ไม่ได้ถามข้อ 9–10 → สมมติว่า ${p0(R.assumptions.P_HIDDEN_SOLAR)} ของโรงงานมีโซลาร์อยู่แล้ว ทำให้ไฟที่ใช้ได้จริงเหลือ ${p0(R.assumptions.HIDDEN_SOLAR_CUT)} ของที่ประเมิน</li></ul></li>
<li><b>ทำซ้ำ 2,000 รอบ</b> แล้วเรียงผลเพื่ออ่าน P10 / P50 / P90 และนับรอบที่ตัดสินใจผิด</li>
<li><b>ใช้ชุดเลขสุ่มเดียวกันทุกกรณี</b> (seed 20261116) ผลต่างระหว่างกรณีจึงมาจากข้อมูลที่ต่างกันจริงๆ ไม่ใช่โชคจากการสุ่ม</li>
</ol>
<h3>2.2 ลูกค้าตัวอย่าง</h3>
<table><thead><tr><th>กรณี</th><th>ขนาด</th><th>ค่ากลาง</th></tr></thead><tbody>
<tr><td>Solar 500 kWp</td><td>ลูกค้า A ใน Research 3</td><td>ใช้ไฟได้ 85%, 25 บาท/W, 1,400 kWh/kWp, O&amp;M 2%, สัญญา 15 ปี</td></tr>
<tr><td>Solar + Battery</td><td>ลูกค้า A + แบต 500 kWh / 250 kW</td><td>แบต 13,500 บาท/kWh, ลด Demand ได้ 50%, เปลี่ยนแบตปีที่ 10</td></tr>
<tr><td>Battery</td><td>500 kWh / 250 kW ชาร์จจากกริด</td><td>เหมือนข้างบน</td></tr>
</tbody></table>
<h3>2.3 ช่วงความคลาดเคลื่อน (± %) ตามข้อมูลที่มี: สมมติฐานของทีม</h3>
<table><thead><tr><th>ค่าที่ใช้คำนวณ</th><th>ข้อมูลที่มี → ช่วง ± %</th></tr></thead><tbody>
${ladder.map(([k, rows]) => `<tr><td>${k}</td><td>${rows.map(([a, b]) => `${a}: <b>±${b}</b>`).join(' · ')}</td></tr>`).join('')}
</tbody></table>
<p class="note">ค่า Ft, อัตราคิดลด, การปรับค่าไฟในอนาคต เป็นความเสี่ยงตลาด ไม่ได้ลดลงเพราะได้ข้อมูลลูกค้าเพิ่ม จึงไม่รวมในรายงานนี้</p>

<h2 class="pb">3. บิลค่าไฟทุกแบบที่เป็นไปได้</h2>
<table><thead><tr><th>ประเภทบิล</th><th>ข้อมูลที่ได้</th><th>แพลตฟอร์ม</th><th>กรณีที่จำลอง</th></tr></thead><tbody>
${bills.map(b => `<tr>${b.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}
</tbody></table>
<p class="note">กฟน. (กรุงเทพ นนทบุรี สมุทรปราการ) ใช้อัตราเดียวกับ กฟภ. ต่างกันแค่ช่วงแรงดัน (12–24 kV ของ กฟน. เทียบกับ 22–33 kV ของ กฟภ.) จึงใช้ผลชุดเดียวกันได้ · ชื่อประเภทย่อยให้ตรวจกับประกาศอัตราค่าไฟล่าสุดของการไฟฟ้าอีกครั้ง</p>

<h2>4. กรณีหลัก: บิล TOU + คำถาม 16 ข้อ</h2>
<table class="num"><thead><tr><th>ผลิตภัณฑ์</th><th></th><th>IRR ที่ประเมิน</th><th>IRR จริง P10–P90</th><th>คลาด (จุด)</th><th>NPV จริง P10–P90</th><th>ตัดสินใจผิด</th><th>IRR คลาด &gt;1 จุด</th><th>IRR คลาด &gt;2 จุด</th></tr></thead><tbody>
${Object.keys(PN).map(pk => { const r = s1(pk); return `<tr><td>${PN[pk]}</td><td></td><td>${irr(r.est.irr)}</td><td>${irr(r.irr10)} – ${irr(r.irr90)}</td><td>${pm(r)}</td><td>${m(r.npv10)} – ${m(r.npv90)}</td><td><b>${p1(r.wrong)}</b></td><td>${p0(r.off1)}</td><td>${p0(r.off2)}</td></tr>`; }).join('')}
</tbody></table>
<h3>เพราะอะไร</h3>
<ul>
<li><b>Solar ผิดได้ ${p1(s1('solar500').wrong)}:</b> IRR ที่ประเมิน (9.6%) ห่างเกณฑ์ 8% แค่ 1.6 จุด แต่ข้อมูลคลาดได้ ±2.1 จุด ปลายด้านแย่จึงข้ามเส้น ค่าที่ยังขาดคือราคาติดตั้ง (ยังไม่มีใบเสนอราคา) กับสัดส่วนไฟที่ใช้ได้จริง (ยังไม่มีไฟล์ 15 นาที)</li>
<li><b>Solar + Battery และ Battery ผิด 0%:</b> คลาดได้ ±1.4–1.7 จุดพอๆ กัน แต่ IRR อยู่ที่ 2.5% และ −15.6% ห่างเกณฑ์ 5.5 และ 23.6 จุด ไม่มีรอบไหนข้ามเส้น ข้อมูลเพิ่มไม่เปลี่ยนคำตอบ</li>
<li><b>"IRR คลาดเกิน 1 จุด" สูงถึง ${p0(s1('battery').off1)}–${p0(s1('solar500').off1)}:</b> ตัวเลข IRR ยังไม่ควรรายงานเป็นทศนิยม ควรรายงานเป็นช่วง แต่คำตอบว่าคุ้ม / ไม่คุ้มเชื่อถือได้สำหรับ Battery</li>
</ul>

<h2 class="pb">5. ผลแยกตามประเภทบิลและข้อมูลที่มี</h2>
<h3>5.1 Solar PPA</h3>${scenTable('solar500')}
<h3>5.2 Solar + Battery</h3>${scenTable('hybrid')}
<h3>5.3 Battery</h3>${scenTable('battery')}
<div class="box"><b>อ่านอย่างไร</b>
<ul>
<li>บิลอัตราปกติ (S2, S3, S5, S9) ให้ IRR ต่ำกว่า TOU เพราะค่าไฟที่ลูกค้าประหยัดได้ต่อหน่วยต่ำกว่า ไม่ได้เกิดจากความคลาดเคลื่อน</li>
<li>บิลอัตราปกติที่แยกหน่วย P/OP (S2) แม่นกว่าบิลที่ไม่แยก (S3): ±1.9 เทียบ ±2.4 จุด ใกล้เคียงบิล TOU</li>
<li>ไม่ได้ถามคำถามเลย (S4, S5) ความคลาดเคลื่อนเพิ่มขึ้น 20–75% (Battery เพิ่มน้อยสุด, Solar บิลอัตราปกติเพิ่มมากสุด) และโอกาสผิดของ Solar ขึ้นเป็น ${p1(S('solar500', 'S4').r.wrong)}–${p1(S('solar150', 'S4').r.wrong)}</li>
<li>บิลไม่ครบ (S6) แย่ที่สุด เพราะไม่รู้ว่าเป็น TOU หรืออัตราปกติ</li>
</ul></div>

<h2 class="pb">6. น้ำหนักของข้อมูลแต่ละชิ้น</h2>
<p><b>วิธีคิด (Shapley value):</b> ข้อมูลบางชิ้นช่วยเรื่องเดียวกัน เช่น หน่วย On-Peak ในบิลกับคำถามข้อ 4, 7 ช่วยประมาณสัดส่วนไฟที่ใช้ได้ทั้งคู่ ถ้าวัดทีละชิ้นจะนับซ้ำ จึงจำลองทุกชุดข้อมูลที่เป็นไปได้ (2<sup>7</sup> = 128 ชุดสำหรับ Solar, 2<sup>9</sup> = 512 ชุดสำหรับ Solar + Battery) แล้วเฉลี่ยว่าการเพิ่มข้อมูลชิ้นนั้นเข้าไปในทุกลำดับ ลดความแปรปรวนของ NPV ได้เท่าไร น้ำหนักรวมกันได้ 100% พอดี</p>
<h3>6.1 Solar PPA</h3>${shapTable('solar500')}
<h3>6.2 Solar + Battery</h3>${shapTable('hybrid')}
<h3>6.3 Battery</h3>${shapTable('battery')}
<div class="box warn"><b>น้ำหนักของคำถามข้อ 9–10 ขึ้นกับสมมติฐาน</b> ว่ามีโรงงานกี่ % ที่มีโซลาร์อยู่แล้วโดยเราไม่รู้
<table class="num"><thead><tr><th>สัดส่วนโรงงานที่มีโซลาร์อยู่แล้ว</th>${R.q910[0].items.map(i => `<th>${i.id}</th>`).join('')}</tr></thead><tbody>
${R.q910.map(q => `<tr><td>${p0(q.p)}</td>${R.q910[0].items.map(h => `<td>${p1(q.items.find(i => i.id === h.id).share)}</td>`).join('')}</tr>`).join('')}
</tbody></table>
<p class="note">${R.q910[0].items.map(i => `${i.id} = ${ITEMS[i.id]}`).join(' · ')}</p>
<p>ไม่ว่าสมมติฐานเป็นเท่าไร ข้อ 9–10 ก็ติดอันดับ 1 เพราะถ้าลูกค้ามีโซลาร์อยู่แล้ว ไฟที่ใช้ได้ลดลงจนผลพลิก ส่วนข้อมูลอื่นเรียงลำดับเหมือนเดิม</p></div>

<h3>6.4 ถ้าเพิ่มหรือขาดข้อมูลทีละชิ้นจากกรณีหลัก</h3>
<p>เริ่มจากบิล TOU + 16 ข้อ แล้วตัดข้อมูลที่มีอยู่ออก หรือเพิ่มข้อมูลที่ยังไม่มี ทีละชิ้น</p>
<h3>Solar PPA</h3>${marg('solar500')}
<p class="note">Solar + Battery และ Battery ไม่มีการตัดสินใจผิดในทุกการเปลี่ยนแปลง (0%) จึงไม่แสดงตาราง</p>

<h2 class="pb">7. น้ำหนักของคำถาม 16 ข้อ</h2>
<table><thead><tr><th>ข้อ</th><th>เรื่อง</th><th class="r">น้ำหนัก (Solar)</th><th>บทบาท</th></tr></thead><tbody>
${qMap.map(q => `<tr><td>${q[0]}</td><td>${q[1]}</td><td class="r">${q[2]}</td><td>${q[3]}</td></tr>`).join('')}
</tbody></table>
<p><b>สรุป:</b> คำถามที่มีผลต่อตัวเลขจริงมีแค่ 6 ข้อ (4, 5, 6, 7, 9, 10) ข้อที่เหลือใช้ตรวจความถูกต้องหรือจัดลำดับลูกค้า ถ้าต้องตัดคำถามให้สั้นลง ห้ามตัดข้อ 9–10 และข้อ 4, 7</p>

<h2>8. ทดสอบกี่รอบ และทำไมต้อง 2,000 รอบ</h2>
<p>Monte Carlo มีความคลาดเคลื่อนจากการสุ่มเอง ยิ่งรอบมากยิ่งนิ่ง ทดสอบโดยรันกรณี Solar 500 kWp + บิล TOU + 16 ข้อ ที่จำนวนรอบต่างๆ ใช้ seed ต่างกัน 30 ชุด แล้วดูว่า "โอกาสตัดสินใจผิด" แกว่งแค่ไหน</p>
<table class="num"><thead><tr><th>จำนวนรอบ</th><th></th><th>โอกาสผิดเฉลี่ย</th><th>แกว่ง (SD) จากการทดลอง</th><th>แกว่งตามทฤษฎี √(p(1−p)/N)</th><th>NPV P10 แกว่ง (ล้านบาท)</th></tr></thead><tbody>
${c.map(x => `<tr${x.N === 2000 ? ' class="hl"' : ''}><td>${x.N.toLocaleString()}</td><td></td><td>${p1(x.meanWrong)}</td><td>±${(x.sdWrong * 100).toFixed(1)} จุด</td><td>±${(x.theory * 100).toFixed(1)} จุด</td><td>±${m(x.sdP10)}</td></tr>`).join('')}
</tbody></table>
<ul>
<li><b>เกณฑ์ที่ตั้ง:</b> ตัวเลข "โอกาสผิด" ต้องแกว่งจากการสุ่มไม่เกินประมาณ ±1 จุด เพื่อแยก 4% (มีใบเสนอราคา) ออกจาก 16% (ไม่มี) ได้ชัด</li>
<li><b>2,000 รอบ</b> ให้ประมาณ ±${(c2000.theory * 100).toFixed(1)}–${(c2000.sdWrong * 100).toFixed(1)} จุด ผ่านเกณฑ์ ส่วน 1,000 รอบ (±${(c1000.theory * 100).toFixed(1)}) เกือบผ่าน และ 500 รอบไม่ผ่าน</li>
<li><b>5,000 รอบขึ้นไปไม่จำเป็น:</b> แคบลงเหลือ ±${(c5000.theory * 100).toFixed(1)} จุด แต่ใช้เวลา 2.5 เท่า และคำตอบเรื่องคุ้ม / ไม่คุ้มไม่เปลี่ยน</li>
<li><b>เวลาคำนวณ:</b> 2,000 รอบใช้ประมาณ 0.2 วินาทีต่อกรณี การหาน้ำหนัก Shapley ต้องรัน 128–512 ชุด × 2,000 รอบ (ราว 250,000–1,000,000 ครั้ง) ทั้งรายงานใช้เวลาประมาณ 3 นาที</li>
<li><b>ในแพลตฟอร์ม</b> การ์ดความเสี่ยงใช้ 1,000 รอบเพื่อให้ตอบสนองทันที ความแม่นพอสำหรับการคัดกรอง</li>
</ul>

<h2>9. ข้อจำกัดและสมมติฐาน</h2>
<table><thead><tr><th>ข้อจำกัด</th><th>ผลกระทบ</th></tr></thead><tbody>
<tr><td>ช่วง ±% ในตาราง 2.3 เป็นการตัดสินใจของทีม ไม่ได้วัดจากโรงงานจริง</td><td>ถ้าช่วงจริงกว้างกว่านี้ ความคลาดเคลื่อนจริงก็มากกว่านี้ ควรปรับเมื่อมีข้อมูลโรงงานจริง 10–20 แห่ง</td></tr>
<tr><td>สุ่มแต่ละค่าแยกกัน (ไม่สัมพันธ์กัน)</td><td>ในความจริง เช่น ระบบใหญ่อาจได้ราคาต่อวัตต์ถูกลง</td></tr>
<tr><td>สมมติว่าค่าที่ประเมินอยู่ตรงกลาง ยกเว้นเรื่องโซลาร์เดิม</td><td>ถ้าลูกค้าตอบเกินจริงเป็นระบบ วิธีนี้จับไม่ได้</td></tr>
<tr><td>สมมติ ${p0(R.assumptions.P_HIDDEN_SOLAR)} ของโรงงานมีโซลาร์อยู่แล้ว</td><td>เปลี่ยนน้ำหนักของข้อ 9–10 ได้ 25–59% (ส่วนที่ 6)</td></tr>
<tr><td>ไม่รวมความเสี่ยงตลาด (Ft, ค่าไฟ, อัตราคิดลด)</td><td>วัดเฉพาะความคลาดเคลื่อนจากข้อมูลลูกค้าและหน้างาน</td></tr>
<tr><td>ไม่ได้วัดข้อ 8, 15, 16 และการเลือกขนาดระบบ</td><td>แพลตฟอร์มยังไม่มีช่องการใช้ไฟเปลี่ยนรายปี ขนาดระบบต้องยืนยันด้วยการสำรวจหน้างาน</td></tr>
<tr><td>ใช้ลูกค้าตัวอย่าง 4 กรณี</td><td>โรงงานที่ IRR อยู่ใกล้ 8% มากกว่านี้จะมีโอกาสผิดสูงกว่า ห่างกว่านี้จะต่ำกว่า</td></tr>
</tbody></table>

<h2>10. ข้อเสนอ: ลำดับการเก็บข้อมูล</h2>
<ol>
<li><b>บิลฉบับเต็ม</b> ที่เห็นประเภทอัตรา หน่วยแยกช่วง และ Demand (ถ้าเห็นแค่ยอดเงิน ห้ามประเมินต่อ)</li>
<li><b>คำถามข้อ 9–10 และ 4, 7</b> ถามทุกราย</li>
<li><b>คัดกรองทันที:</b> Battery และ Solar + Battery ที่ผลห่างเกณฑ์มาก ตัดสินได้จากขั้นนี้</li>
<li><b>Solar ที่ IRR อยู่ในช่วง 8% ± 2 จุด:</b> ขอใบเสนอราคาก่อน (ไม่ต้องรบกวนลูกค้า ลดโอกาสผิดจาก ${p1(s1('solar500').wrong)} เหลือ ${p1(S('solar500', 'S7').r.wrong)})</li>
<li><b>ถ้ายังอยู่ใกล้เส้น:</b> ขอไฟล์ 15 นาทีผ่านหมายเลขผู้ใช้ไฟในบิล ก่อนเซ็นสัญญา</li>
</ol>
<p class="note">คำนวณซ้ำได้ด้วย <code>node tools/reports/data_value_mc.mjs</code> แล้ว <code>node tools/reports/build_data_value_report.mjs</code> · ตัวเลขทั้งหมดมาจาก engine เดียวกับแพลตฟอร์ม</p>
</body></html>`;
fs.writeFileSync(OUT, html);
console.log('written', OUT.pathname);
