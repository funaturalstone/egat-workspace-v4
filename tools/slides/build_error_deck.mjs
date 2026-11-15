// Standalone slide deck of the data-accuracy study (Monte Carlo), same theme as build_pitch_deck.mjs.
// Output: reports/สไลด์_ความคลาดเคลื่อน_บิลและคำถาม.html → print to PDF with headless Chrome.
import fs from 'node:fs';
import * as S from './slide_numbers.mjs';
const MC = JSON.parse(fs.readFileSync(new URL('../reports/data_value_mc.json', import.meta.url)));
const OUT = new URL('../../reports/สไลด์_ความคลาดเคลื่อน_บิลและคำถาม.html', import.meta.url);

// ---------- number helpers ----------
const th = (x, d = 0) => Number(x).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const ir = x => x == null ? '—' : (x * 100).toFixed(1) + '%';
const mb = x => (x >= 0 ? '+' : '−') + Math.abs(x / 1e6).toFixed(2);
const pc = (x, d = 1) => (x * 100).toFixed(d) + '%';
const r50 = x => th(Math.round(x / 50) * 50);
const cls = x => x >= 0 ? 'pos' : 'neg';
const C = S.cases, T = S.tornado, B = S.breakeven, BS = S.batterySens, EM = S.egatMethod, EZ = S.enzy;
const base = C['1 Solar A 15y'].mid;
const sc = (pk, id) => MC.scen[pk].find(s => s.id === id).r;
const half = r => ((r.irr90 - r.irr10) / 2 * 100).toFixed(1);
// self-use where Solar A stops paying
let lo = 0.5, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; S.run('solar', { um: 2 }, { hol: 11, wdays: 313, rate: 0.08, enzy: 0, xfer: 0, kwp: 500, cost: 25, yld: 1400, after9: 0.89, deg: 0.007, om: 0.02, inf: 0.02, invY: 12, invC: 3000, disc: 0.15, othS: 0, term: 15, esc: 0.005, useman: m }).npv >= 0 ? hi = m : lo = m; }
const useBE = Math.round(hi * 100);

// ---------- layout helpers ----------
let n = 0;
const SECTIONS = ['พื้นฐาน', 'Monte Carlo', 'ผลลัพธ์', 'น้ำหนักของข้อมูล', 'ข้อจำกัดและข้อเสนอ'];
const slide = (sec, title, body, extra = '') => { n++; const tag = typeof sec === 'number' ? `${String(sec).padStart(2, '0')} · ${SECTIONS[sec - 1]}` : sec;
  return `<section class="slide ${extra}"><header class="hd"><div><div class="sec">${tag}</div><h2>${title}</h2></div><div class="no">${String(n).padStart(2, '0')}</div></header><div class="body">${body}</div></section>`; };
const say = t => `<div class="say"><b>พูด</b>${t}</div>`;
const guard = (q, a) => `<div class="guard"><b>กันคำถาม</b><span>${q}</span><em>${a}</em></div>`;
const src = t => `<div class="src">ที่มา: ${t}</div>`;
const card = (inner, c = '') => `<div class="card ${c}">${inner}</div>`;
const tbl = (head, rows, c = '') => `<table class="${c}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr${r.hl ? ' class="hl"' : ''}>${(r.cells ?? r).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const ok = '<span class="ok">✓</span>', no = '<span class="no-x">✕</span>', warn = '<span class="wn">!</span>';

// horizontal bars (values ≥ 0)
const hbars = (rows, { max, fmt = v => v, w = 520, color = 'var(--mint)' } = {}) => {
  max ??= Math.max(...rows.map(r => r[1]));
  return `<div class="hbars">${rows.map(([l, v, c, note]) => `<div class="hb"><span class="hl-l">${l}</span><span class="hb-track"><i style="width:${Math.max(0.6, v / max * 100).toFixed(1)}%;background:${c ?? color}"></i></span><b>${fmt(v)}</b>${note ? `<small>${note}</small>` : ''}</div>`).join('')}</div>`;
};
// tornado: deltas around 0
const tornado = rows => { const max = Math.max(...rows.map(r => Math.abs(r[1]))), W = 250;
  return `<div class="torn">${rows.map(([l, d, after]) => { const w = Math.abs(d) / max * W;
    return `<div class="tr"><span class="tl">${l}</span><span class="tz">${d < 0 ? `<i class="tn" style="width:${w}px"></i>` : ''}</span><span class="tz r">${d >= 0 ? `<i class="tp" style="width:${w}px"></i>` : ''}</span><b class="${cls(d)}">${mb(d)}</b><small>NPV หลังเปลี่ยน ${mb(after)}</small></div>`; }).join('')}<div class="tr axis"><span class="tl"></span><span class="tz">← ลดลง</span><span class="tz r">เพิ่มขึ้น →</span></div></div>`; };
// NPV range chart (mid with min–max whisker)
const rangeChart = (items, { lo = -10, hi = 12, h = 270, w = 400 } = {}) => {
  const y = v => 10 + (hi - v / 1e6) / (hi - lo) * (h - 40), step = (w - 110) / items.length;
  const grid = [];
  for (let v = lo; v <= hi; v += 2) if (v % 4 === 0 || v === lo) grid.push(`<line x1="44" x2="${w}" y1="${y(v * 1e6)}" y2="${y(v * 1e6)}" stroke="${v === 0 ? '#ffffff55' : '#ffffff12'}"/><text x="38" y="${y(v * 1e6) + 4}" text-anchor="end">${v}</text>`);
  const bars = items.map(([l, mid, mn, mx], i) => { const x = 60 + step * i + step / 2, c = mid >= 0 ? 'var(--mint)' : 'var(--orange)';
    return `<line x1="${x}" x2="${x}" y1="${y(mx)}" y2="${y(mn)}" stroke="#c9d6e6" stroke-width="2"/><line x1="${x - 9}" x2="${x + 9}" y1="${y(mx)}" y2="${y(mx)}" stroke="#c9d6e6" stroke-width="2"/><line x1="${x - 9}" x2="${x + 9}" y1="${y(mn)}" y2="${y(mn)}" stroke="#c9d6e6" stroke-width="2"/>
<rect x="${x - 22}" y="${Math.min(y(mid), y(0))}" width="44" height="${Math.abs(y(mid) - y(0))}" rx="4" fill="${c}" opacity=".85"/><text x="${x + 26}" y="${y(mid) + (mid >= 0 ? 4 : 12)}" class="v">${mb(mid)}</text><text x="${x}" y="${h - 8}" text-anchor="middle">${l}</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">${grid.join('')}${bars}</svg>`;
};
// vertical bars around zero (IRR %)
const vbars = (items, { lo = -10, hi = 10, h = 220, w = 420 } = {}) => {
  const y = v => 14 + (hi - v) / (hi - lo) * (h - 50), step = (w - 50) / items.length;
  const grid = []; for (let v = lo; v <= hi; v += 5) grid.push(`<line x1="40" x2="${w}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 0 ? '#ffffff55' : '#ffffff12'}"/><text x="34" y="${y(v) + 4}" text-anchor="end">${v}%</text>`);
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">${grid.join('')}${items.map(([l, v, sub], i) => { const x = 50 + step * i + step / 2, c = v >= 0 ? 'var(--mint)' : 'var(--orange)';
    return `<rect x="${x - 34}" y="${Math.min(y(v), y(0))}" width="68" height="${Math.abs(y(v) - y(0))}" rx="5" fill="${c}"/><text x="${x}" y="${v >= 0 ? y(v) - 7 : y(v) + 17}" text-anchor="middle" class="v">${v.toFixed(1)}%</text><text x="${x}" y="${h - 22}" text-anchor="middle">${l}</text><text x="${x}" y="${h - 8}" text-anchor="middle" class="m">${sub}</text>`; }).join('')}</svg>`;
};

// ---------- slides ----------
const slides = [];
const P4 = [['☀ Solar PPA', 'solar500'], ['◈ Solar + Battery', 'hybrid'], ['ϟ Battery', 'battery']];
const S1 = k => sc(k, 'S1');
const PLAIN = { S1: 'บิล TOU + ตอบคำถามครบ', S2: 'บิลธรรมดา (พิมพ์หน่วยแยกช่วงเวลา) + คำถาม', S3: 'บิลธรรมดา (ไม่แยกหน่วย) + คำถาม', S4: 'บิล TOU อย่างเดียว ไม่ได้ถาม', S5: 'บิลธรรมดา (ไม่แยกหน่วย) อย่างเดียว', S6: 'บิลไม่ครบ ไม่เห็นประเภทมิเตอร์ + คำถาม', S7: 'บิล TOU + คำถาม + ใบเสนอราคา', S8: 'บิล TOU + คำถาม + ใบเสนอราคา + ไฟล์ 15 นาที', S9: 'บิลธรรมดา + คำถาม + ใบเสนอราคา + ไฟล์ 15 นาที' };
const nm = { B1: 'ประเภทมิเตอร์ในบิล', B2: 'หน่วย On/Off-Peak ในบิล', B3: 'ที่อยู่ในบิล → PVGIS', Q47: 'คำถามข้อ 4, 7 (เวลาทำงาน, วันหยุด)', Q56: 'คำถามข้อ 5, 6 (ช่วงพีค, สาเหตุ)', Q910: 'คำถามข้อ 9, 10 (มีโซลาร์อยู่แล้วไหม)', QS: 'ใบเสนอราคาโซลาร์', QB: 'ใบเสนอราคาแบต', F15: 'ไฟล์การใช้ไฟ 15 นาที' };
const col = id => id.startsWith('B') ? 'var(--blue)' : (id === 'QS' || id === 'QB' || id === 'F15') ? 'var(--orange)' : 'var(--mint)';
const legendW = '<div class="legend"><span><i style="background:var(--blue)"></i>ได้จากบิล</span><span><i style="background:var(--mint)"></i>ได้จากคำถาม</span><span><i style="background:var(--orange)"></i>ต้องขอเพิ่ม</span></div>';
const term = (t, d, ex = '') => `<div class="term"><b>${t}</b><p>${d}</p>${ex ? `<em>${ex}</em>` : ''}</div>`;
const pct1 = x => (x * 100).toFixed(1) + '%';

// number line of IRR ranges with the 8% threshold
const irrLine = (rows, { lo, hi, w = 820, rowH = 64 } = {}) => {
  const x = v => 200 + (v - lo) / (hi - lo) * (w - 220), h = rows.length * rowH + 46;
  const st = hi - lo > 20 ? 4 : 2, ticks = []; for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) ticks.push(`<line x1="${x(v)}" x2="${x(v)}" y1="14" y2="${h - 30}" stroke="#ffffff10"/><text x="${x(v)}" y="${h - 12}" text-anchor="middle">${v}%</text>`);
  const body = rows.map(([l, est, p10, p90, c, note], i) => { const y = 34 + i * rowH;
    return `<text x="0" y="${y + 5}" class="v">${l}</text><rect x="${x(p10)}" y="${y - 9}" width="${x(p90) - x(p10)}" height="18" rx="9" fill="${c}" opacity=".45"/><circle cx="${x(est)}" cy="${y}" r="8" fill="${c}" stroke="#0c1321" stroke-width="2"/><text x="${x(p10)}" y="${y + 27}" class="m2">${note}</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">${ticks.join('')}<line x1="${x(8)}" x2="${x(8)}" y1="8" y2="${h - 28}" stroke="var(--orange)" stroke-width="2.5" stroke-dasharray="7 5"/><text x="${x(8) + 6}" y="14" class="v pk">เกณฑ์ 8%</text>${body}</svg>`;
};

// 1 cover
n++;
slides.push(`<section class="slide cover"><div class="orb o1"></div><div class="orb o2"></div>
<div class="cv"><div class="eyebrow">ENERGY WORKSPACE · MONTE CARLO STUDY</div>
<h1>ข้อมูลแค่ไหนถึงพอ<br><span>ความคลาดเคลื่อนของ IRR / NPV</span></h1>
<p class="cvsub" style="font-size:21px;color:#dbe5f0;margin-top:0">เมื่อ กฟผ. มีแค่บิลค่าไฟ + คำตอบจากคำถามลูกค้า 16 ข้อ</p>
<div class="pills" style="margin-top:26px"><span><i>☀</i>Solar PPA</span><span><i>◈</i>Solar + Battery</span><span><i>ϟ</i>Battery</span></div></div>
<div class="cvfoot">พฤศจิกายน 2569</div><div class="no">01</div></section>`);

// 2 one-page summary
slides.push(slide(1, 'สรุปใน 1 หน้า', `<div class="g3 tall">
${card(`<div class="ic">?</div><h3>คำถาม</h3><p class="lg">ถ้ามีแค่บิลค่าไฟกับคำตอบ 16 ข้อ ผล IRR / NPV จะผิดจากความจริงได้แค่ไหน และควรขอข้อมูลอะไรเพิ่ม</p>`)}
${card(`<div class="ic">✓</div><h3>คำตอบ</h3><ul class="li lg"><li><b class="pos">Battery, Solar + Battery:</b> ตัดสินได้ทันที โอกาสผิด 0%</li><li><b class="neg">Solar PPA:</b> โอกาสผิด ${pc(S1('solar500').wrong, 0)} ยังตัดสินไม่ได้</li></ul>`)}
${card(`<div class="ic">→</div><h3>ทำอะไรต่อ</h3><ul class="li lg"><li>ขอ<b class="pk">ใบเสนอราคา</b> โอกาสผิดลดเหลือ ${pc(sc('solar500', 'S7').wrong)}</li><li>ถ้ายังใกล้เส้น ขอ<b class="pk">ไฟล์ 15 นาที</b> เหลือ ${pc(sc('solar500', 'S8').wrong)}</li></ul>`)}</div>
<p class="fn">ตัวเลขของ Solar PPA · วัดด้วยการจำลอง Monte Carlo 2,000 รอบ ผ่านสูตรเดียวกับแพลตฟอร์ม (อธิบายในช่วงที่ 02)</p>`));

// 3 glossary: metrics
slides.push(slide(1, 'คำศัพท์ (1): ตัวชี้วัดที่ใช้ในเด็คนี้', `<div class="g2 terms">
${term('NPV (มูลค่าปัจจุบันสุทธิ)', 'กำไรตลอดอายุโครงการ แปลงเป็นเงินวันนี้ โดยลดค่าเงินในอนาคตปีละ 8%', 'NPV มากกว่า 0 = คุ้ม')}
${term('IRR (อัตราผลตอบแทนภายใน)', 'ผลตอบแทนเฉลี่ยต่อปีของโครงการ', 'IRR มากกว่า 8% = คุ้ม (เกณฑ์เดียวกับ NPV มากกว่า 0)')}
${term('เกณฑ์ 8%', 'อัตราผลตอบแทนขั้นต่ำที่ไฟล์ BESS ของ กฟผ. ใช้ ต่ำกว่านี้ถือว่าไม่คุ้ม')}
${term('จุด (จุดเปอร์เซ็นต์)', 'ผลต่างระหว่างตัวเลข % สองตัว ใช้บอกว่า IRR คลาดไปเท่าไร', 'IRR 9.6% → 8.6% = คลาด 1 จุด (ไม่ใช่ 1% ของ 9.6)')}
${term('ช่วง P10–P90', 'เรียงผล 2,000 รอบจากน้อยไปมาก ตัดหัวและท้ายข้างละ 10% ช่วงที่เหลือคือที่ผลจริงน่าจะอยู่ 80% ของโอกาส', 'คลาดเคลื่อน ± = ครึ่งหนึ่งของช่วงนี้')}
${term('โอกาสตัดสินใจผิด', '% ของรอบจำลองที่ผลจริงอยู่คนละฝั่งกับผลที่ประเมิน', 'ประเมินว่าคุ้ม แต่จริงไม่คุ้ม หรือกลับกัน')}
</div>`));

// 4 glossary: electricity data
slides.push(slide(1, 'คำศัพท์ (2): ข้อมูลค่าไฟและข้อมูลที่ขอเพิ่ม', `<div class="g2 terms">
${term('มิเตอร์ TOU', 'คิดค่าไฟต่างกันตามช่วงเวลา ช่วง On-Peak (จ.–ศ. 09:00–22:00) แพงกว่า ช่วง Off-Peak (กลางคืนและวันหยุด) ถูกกว่า')}
${term('มิเตอร์ธรรมดา (อัตราปกติ)', 'คิดค่าไฟอัตราเดียวทั้งวัน บิลส่วนใหญ่จึงไม่บอกว่าใช้ไฟช่วงไหนเท่าไร')}
${term('หน่วย On-Peak / Off-Peak', 'จำนวน kWh ที่ใช้ในแต่ละช่วงเวลา พิมพ์อยู่ในบิล TOU ใช้ประมาณว่าโรงงานใช้ไฟกลางวันเท่าไร')}
${term('สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', '% ของไฟโซลาร์ที่โรงงานใช้ทันที ส่วนที่เหลือขายคืนไม่ได้ จึงไม่มีรายได้', 'ค่าที่สำคัญที่สุดของ Solar PPA')}
${term('ไฟล์ 15 นาที', 'ข้อมูลการใช้ไฟทุก 15 นาทีจากมิเตอร์ ขอจากการไฟฟ้าด้วยหมายเลขผู้ใช้ไฟในบิล เห็นรูปทรงการใช้ไฟรายชั่วโมงจริง')}
${term('ใบเสนอราคา / PVGIS', 'ใบเสนอราคา = ราคาติดตั้งจริงจากผู้รับเหมา · PVGIS = เครื่องมือฟรีของคณะกรรมาธิการยุโรป คำนวณไฟที่แผงผลิตได้จากพิกัดที่ตั้ง')}
</div>`));

// 5 sample customers
slides.push(slide(1, 'ลูกค้าตัวอย่างของแต่ละผลิตภัณฑ์มาจากไหน', `<div class="g2 terms">
${term('☀ Solar PPA: "ลูกค้า A" โซลาร์ 500 kWp', 'โรงงานตัวอย่างจากงานวิจัยรอบที่ 3 ของทีม (Research 3) ทำงาน จ.–ส. 313 วัน/ปี ใช้ไฟกลางวันมากกว่าที่โซลาร์ผลิต จึงใช้ไฟโซลาร์ได้ 85%', `ผลที่ประเมิน: IRR ${ir(S1('solar500').est.irr)} · NPV ${mb(S1('solar500').est.npv)} ล้านบาท · เป็นกรณีมาตรฐานของเด็คหลัก`)}
${term('ทำไมใช้ลูกค้า A เป็นหลัก', 'ทั้ง 3 ผลิตภัณฑ์ใช้โรงงานเดียวกัน จึงเทียบกันได้ตรง ๆ และตรงกับกรณีศึกษาในเด็คหลัก', 'ขนาดระบบไม่ได้เปลี่ยนข้อสรุป: สิ่งที่กำหนดโอกาสผิดคือ IRR อยู่ห่างเกณฑ์ 8% แค่ไหน')}
${term('◈ Solar + Battery: ลูกค้า A + แบต', 'ลูกค้า A ติดโซลาร์ 500 kWp และแบต 500 kWh / 250 kW ราคาแบต 13,500 บาท/kWh', `ผลที่ประเมิน: IRR ${ir(S1('hybrid').est.irr)} · NPV ${mb(S1('hybrid').est.npv)} ล้านบาท`)}
${term('ϟ Battery: โรงงานที่ไม่มีโซลาร์', 'แบต 500 kWh / 250 kW ให้โรงงานที่ไม่มีโซลาร์ ต้องชาร์จไฟจากกริดช่วงกลางคืน', `ผลที่ประเมิน: IRR ${ir(S1('battery').est.irr)} · NPV ${mb(S1('battery').est.npv)} ล้านบาท`)}
</div><p class="fn">ค่าอื่นทั้งหมด (ราคาติดตั้ง 25 บาท/W, ไฟที่ผลิตได้ 1,400 kWh/kWp/ปี, ค่าบำรุงรักษา 2%, สัญญา 15 ปี) ใช้ค่ากลางจากงานวิจัยเดียวกับเด็คหลัก</p>`));

// 6 bill data
slides.push(slide(1, 'บิลค่าไฟให้ข้อมูลอะไรบ้าง', `${tbl(['ข้อมูลในบิล', 'ใช้ทำอะไรในการคำนวณ'], [
  ['<b>ประเภทอัตรา / ชนิดมิเตอร์</b> (เช่น 3.2.2 TOU, 3.1.2 ปกติ)', 'เลือกตารางค่าไฟที่ถูกต้อง เป็นตัวกำหนดว่าไฟโซลาร์ 1 หน่วยช่วยลูกค้าประหยัดได้เท่าไร'],
  ['<b>หน่วย On-Peak / Off-Peak</b> (มีในบิล TOU)', 'ประมาณว่าโรงงานใช้ไฟกลางวันเท่าไร → สัดส่วนไฟโซลาร์ที่ใช้ได้'],
  ['<b>Peak demand (kW)</b>', 'กำลังไฟสูงสุดในเดือน ใช้กำหนดขนาดแบต และค่า Demand ที่ลดได้'],
  ['<b>ที่อยู่สถานที่ใช้ไฟ</b>', 'ใส่ใน PVGIS เพื่อหาไฟที่แผงผลิตได้ในพื้นที่นั้น'],
  ['<b>ค่า Ft และรอบเดือน</b>', 'ค่าไฟผันแปรที่บวกเพิ่มทุกหน่วย'],
  ['<b>หมายเลขผู้ใช้ไฟ / รหัสเครื่องวัด</b>', 'ใช้ขอไฟล์การใช้ไฟ 15 นาทีจากการไฟฟ้า'],
], 'big3')}
${say('บิลอย่างเดียวยังไม่บอกว่าโรงงานทำงานกี่โมง หยุดวันไหน และมีโซลาร์อยู่แล้วหรือไม่ จึงต้องมีคำถามลูกค้า')}`));

// 7 the 16 questions
const QL = [[1, 'ธุรกิจของบริษัทคืออะไร มีโรงงาน/สาขากี่แห่ง', 'ld'], [2, 'โรงงานใช้ไฟประมาณกี่หน่วยต่อเดือน/ปี', 'cf'], [3, 'ค่าไฟเฉลี่ยต่อเดือนประมาณเท่าไร', 'cf'], [4, 'เปิดทำการกี่วันต่อสัปดาห์ ทำงานช่วงเวลาใด', 'in'], [5, 'ช่วงเวลาใดที่ใช้ไฟสูงที่สุด', 'in'], [6, 'ช่วงที่ใช้ไฟสูง เกิดจากเครื่องจักรหรือกระบวนการใด', 'in'], [7, 'วันหยุดยังใช้ไฟอยู่ไหม มากน้อยแค่ไหน', 'in'], [8, 'การใช้ไฟในอนาคตมีแนวโน้มอย่างไร', 'fl'], [9, 'ปัจจุบันมี Solar Rooftop หรือระบบผลิตไฟอื่นอยู่แล้วไหม', 'in'], [10, 'ถ้ามี Solar อยู่แล้ว ขนาดเท่าไร ใช้ไฟที่ผลิตได้หมดไหม', 'in'], [11, 'เคยพิจารณา Solar PPA หรือไม่', 'ld'], [12, 'เคยมีปัญหาค่าไฟช่วง Peak / Demand Charge สูงไหม', 'ld'], [13, 'ถ้ามีระบบลดค่าไฟช่วง Peak โดยไม่ต้องลงทุนเอง สนใจไหม', 'ld'], [14, 'เป้าหมายหลักในการจัดการพลังงานคืออะไร', 'ld'], [15, 'มีแผนขยายโรงงานหรือเพิ่มเครื่องจักรใน 1–3 ปีไหม', 'fl'], [16, 'มีข้อจำกัดในการติดตั้งระบบพลังงานไหม', 'fl']];
const QT = { in: ['เข้าสูตร', 'm'], cf: ['ตรวจกับบิล', 'b'], fl: ['ธงเตือน', 'o'], ld: ['จัดลำดับลูกค้า', 'g'] };
slides.push(slide(1, 'คำถามลูกค้า 16 ข้อ', `<div class="qlist">${QL.map(([i, t, k]) => `<div class="ql ${k}"><b>${i}</b><span>${t}</span><i class="tag ${QT[k][1]}">${QT[k][0]}</i></div>`).join('')}</div>
<p class="fn"><b class="pos">เข้าสูตร</b> = คำตอบถูกใช้คำนวณ IRR / NPV จริง (6 ข้อ) · <b>ตรวจกับบิล</b> = ซ้ำกับบิล ใช้ตรวจว่าตรงกัน · <b class="pk">ธงเตือน</b> = ไม่เข้าสูตร แต่บอกความเสี่ยง · <b>จัดลำดับลูกค้า</b> = ใช้เลือกว่าจะคุยกับใครก่อน</p>`));

// ---------- 02 Monte Carlo ----------
const tb = (k) => T[k];
slides.push(slide(2, 'ปัญหา: ตัวเลขเดียวไม่บอกว่าเสี่ยงแค่ไหน', `<div class="g2 w55">${card(`<div class="ct">Solar PPA ลูกค้า A คำนวณจากค่าที่ประเมิน</div><div class="huge pos">IRR ${ir(base.irr)}</div><p class="lg">ดูเหมือนคุ้ม เพราะเกินเกณฑ์ 8%</p><div class="ct mt">แต่ถ้าค่าจริงต่างจากที่ประเมินเพียงตัวเดียว</div>${tbl(['ถ้า…', 'IRR', 'คุ้มไหม'], [
  ['ใช้ไฟได้ 75% แทน 85%', `<b class="neg">${ir(tb('use 85→75').irr)}</b>`, `${no} ไม่คุ้ม`],
  ['ราคาติดตั้ง 28 แทน 25 บาท/W', `<b class="neg">${ir(tb('cost 25→28').irr)}</b>`, `${no} ไม่คุ้ม`],
  ['ไฟที่ผลิตได้ 1,300 แทน 1,400', `<b class="neg">${ir(tb('yld 1400→1300').irr)}</b>`, `${no} ไม่คุ้ม`],
], 'num')}`)}
<div class="stack">${card(`<div class="ct">ค่าเหล่านี้เรายังไม่รู้แน่</div><p class="lg">เพราะได้จากบิลกับคำถามเท่านั้น ยังไม่มีใบเสนอราคา และยังไม่เห็นการใช้ไฟรายชั่วโมง</p>`)}
${card(`<div class="ct">สิ่งที่ผู้บริหารต้องการรู้</div><p class="lg">ไม่ใช่แค่ "IRR เท่าไร" แต่คือ <b class="pk">"มีโอกาสแค่ไหนที่เราตัดสินใจผิด"</b> และ <b class="pk">"ควรขอข้อมูลอะไรเพิ่มก่อนตัดสินใจ"</b></p>`)}</div></div>`));

slides.push(slide(2, 'Monte Carlo คืออะไร', `<div class="lead lg">การจำลองแบบสุ่มซ้ำหลายพันครั้ง: สร้าง <b class="pk">"อนาคตที่เป็นไปได้"</b> หลาย ๆ แบบจากค่าที่ยังไม่แน่นอน คำนวณผลทุกแบบ แล้วนับว่าผลออกมาแบบไหนบ่อยแค่ไหน</div>
<div class="g3">${card(`<div class="ic">⚄</div><h3>เปรียบเทียบง่าย ๆ</h3><p class="lg">ถ้าอยากรู้ว่าทอยลูกเต๋า 2 ลูกแล้วได้ผลรวม 7 บ่อยแค่ไหน ทอยจริง 2,000 ครั้งแล้วนับ จะได้คำตอบใกล้ความจริงโดยไม่ต้องคิดสูตรความน่าจะเป็นเอง</p>`)}
${card(`<div class="ic">฿</div><h3>ในงานนี้</h3><p class="lg">"ลูกเต๋า" คือค่าที่ยังไม่รู้แน่ เช่น สัดส่วนไฟที่ใช้ได้ ราคาติดตั้ง "การทอย" คือสุ่มค่าเหล่านี้แล้วคำนวณ IRR / NPV ด้วยสูตรเดียวกับแพลตฟอร์ม</p>`)}
${card(`<div class="ic">◎</div><h3>ใช้กันทั่วไป</h3><p class="lg">ใช้ประเมินความเสี่ยงในงานการเงินและพลังงาน เช่น โปรแกรม SAM ของ NREL (สหรัฐฯ) ที่ใช้ประเมินโครงการโซลาร์ก็มีโหมดวิเคราะห์แบบสุ่ม</p>`)}</div>
${say('ชื่อ Monte Carlo มาจากคาสิโนในโมนาโก เพราะหลักการคือการสุ่ม แต่ใช้ตอบคำถามเชิงวิศวกรรมและการเงินอย่างเป็นระบบ')}`));

slides.push(slide(2, 'ทำไมต้องใช้ Monte Carlo ไม่ใช้วิธีอื่น', `${tbl(['วิธี', 'ทำอย่างไร', 'ตอบได้ไหมว่า "โอกาสผิดกี่ %"', 'ข้อจำกัด'], [
  ['<b>ค่ากลางตัวเดียว</b>', 'ใส่ค่าที่ประเมินแล้วคำนวณครั้งเดียว', `${no} ไม่ได้`, 'ไม่บอกความเสี่ยงเลย'],
  ['<b>min / max</b>', 'ให้ทุกค่าแย่หรือดีที่สุดพร้อมกัน', `${no} ไม่ได้`, `ช่วงกว้างเกินจริง (NPV ${mb(C['1 Solar A 15y'].min.npv)} ถึง ${mb(C['1 Solar A 15y'].max.npv)} ล้าน) เพราะทุกค่าแย่พร้อมกันเกิดได้ยากมาก`],
  ['<b>Tornado (เปลี่ยนทีละตัว)</b>', 'เปลี่ยนค่าทีละตัว ค่าอื่นคงที่', `${no} ไม่ได้`, 'ไม่เห็นผลเมื่อหลายค่าคลาดพร้อมกัน'],
  { cells: ['<b>Monte Carlo</b>', 'สุ่มทุกค่าพร้อมกันตามช่วงที่สมเหตุสมผล 2,000 ครั้ง', `${ok} <b class="pos">ได้</b>`, 'ช่วง ± ต้องตั้งให้สมเหตุสมผล (ทีมกำหนดจากแหล่งข้อมูล)'], hl: true },
], 'big3')}
<div class="g2">${card('<p class="lg"><b class="pk">เหตุผลหลัก:</b> คำถามของงานนี้คือ "มีโอกาสตัดสินใจผิดกี่ %" ซึ่งเป็นคำถามเรื่องความน่าจะเป็น มีแค่ Monte Carlo ที่ตอบได้ตรง ๆ</p>')}
${card('<p class="lg"><b class="pk">ใช้ร่วมกัน ไม่ได้แทนกัน:</b> min/max กับ Tornado ยังอยู่ในเด็คหลัก ใช้บอกขอบเขตและตัวแปรสำคัญ ส่วน Monte Carlo ใช้วัดว่าข้อมูลที่มีพอหรือยัง</p>')}</div>`));

slides.push(slide(2, 'ใช้กับโปรเจคนี้อย่างไร', `<div class="flow tall">${[
  ['1', 'ดูว่ามีข้อมูลอะไร', 'เช่น บิล TOU + คำตอบ 16 ข้อ'],
  ['2', 'กำหนดช่วง ±', 'ค่าที่ยังไม่รู้แน่คลาดได้เท่าไร เช่น ใช้ไฟได้ 85% ±8%'],
  ['3', 'สุ่ม 2,000 รอบ', 'แต่ละรอบสุ่มทุกค่าพร้อมกันภายในช่วง'],
  ['4', 'คำนวณทุกรอบ', 'ใช้สูตรเดียวกับแพลตฟอร์ม (ตรงกับ Excel)'],
  ['5', 'นับผล', 'ช่วงที่ IRR น่าจะอยู่ และ % รอบที่คำตอบพลิก']].map(([i, h, p], k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl"><div class="st">${i}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
<div class="g2">${card('<div class="ct">ทำซ้ำกับข้อมูลหลายระดับ</div><p class="lg">บิลอย่างเดียว · บิล + คำถาม · + ใบเสนอราคา · + ไฟล์ 15 นาที แล้วเทียบกันว่าข้อมูลแต่ละชิ้นทำให้โอกาสผิดลดลงเท่าไร</p>')}
${card('<div class="ct">ใช้ชุดเลขสุ่มเดียวกันทุกครั้ง</div><p class="lg">ผลต่างระหว่างกรณีจึงมาจากข้อมูลที่ต่างกันจริง ไม่ใช่โชคจากการสุ่ม และรันซ้ำได้ผลเดิมทุกครั้ง</p>')}</div>`));

// ranges + triangle
const triSvg = `<svg class="chart" viewBox="0 0 420 200"><polygon points="40,160 210,30 380,160" fill="#bdddd433" stroke="var(--mint)" stroke-width="2"/><line x1="210" y1="30" x2="210" y2="160" stroke="var(--orange)" stroke-dasharray="5 4"/><line x1="20" y1="160" x2="400" y2="160" stroke="#ffffff40"/>
<text x="40" y="182" text-anchor="middle">78.2%</text><text x="210" y="182" text-anchor="middle" class="v pk">85% (ค่าที่ประเมิน)</text><text x="380" y="182" text-anchor="middle">91.8%</text><text x="222" y="60" class="v">โอกาสมากที่สุด</text><text x="60" y="140">โอกาสน้อย</text><text x="300" y="140">โอกาสน้อย</text></svg>`;
slides.push(slide(2, 'ช่วง ± มาจากไหน และสุ่มอย่างไร', `<div class="g2 w60">${tbl(['ค่าที่ยังไม่รู้แน่', 'ช่วงเมื่อมีบิล TOU + คำถาม', 'เหตุผล'], [
  ['สัดส่วนไฟที่ใช้ได้', '<b>±8%</b> (บิลธรรมดา ±15%)', 'หน่วย On-Peak บอกไฟกลางวันรวม แต่ไม่บอกรายชั่วโมง · บิลธรรมดาไม่มีหน่วยกลางวันเลย ต้องเดาจากเวลาทำงาน'],
  ['ราคาติดตั้งโซลาร์', '<b>±15%</b>', 'ราคาตลาดไทย 18–32 บาท/W ค่ากลาง 25 · มีใบเสนอราคาแล้วเหลือ ±5%'],
  ['ไฟที่ผลิตได้', '<b>±5%</b>', 'PVGIS ให้ค่าเฉลี่ย แต่แดดแต่ละปีและเงาหน้างานต่างกัน'],
  ['ค่าบำรุงรักษา', '<b>±20%</b>', 'ยังไม่มีสัญญา O&amp;M'],
  ['ราคาแบต', '<b>±15%</b>', 'ราคาตลาดไทย 12,000–15,000 บาท/kWh'],
  ['% Demand ที่แบตลดได้', '<b>±40%</b>', 'ไม่รู้รูปทรงช่วงพีคจนกว่าจะได้ไฟล์ 15 นาที'],
], 'sm')}
<div class="stack">${card(`<div class="ct">สุ่มแบบ "สามเหลี่ยม" · ตัวอย่างสัดส่วนไฟที่ใช้ได้ 85% ±8%</div>${triSvg}<p>ค่าที่ประเมินมีโอกาสออกมากที่สุด ยิ่งห่างยิ่งออกน้อย ใช้แค่ 3 ตัวเลข (ต่ำสุด ค่ากลาง สูงสุด) เหมาะเมื่อยังไม่มีข้อมูลในอดีตพอจะรู้รูปทรงการกระจายจริง</p>`)}
${card('<p class="fn">ช่วง ± เป็นสมมติฐานของทีมที่อิงช่วงของแหล่งข้อมูล ไม่ได้วัดจากโรงงานจริง ควรปรับเมื่อมีข้อมูลโรงงาน 10–20 แห่ง</p>')}</div></div>`));

// sample rounds
const SR = MC.samples.solar500_S1, neg = SR.findIndex(r => r.npv < 0);
const show = [0, 1, 2, 3, 4, neg].map(i => [i, SR[i]]);
slides.push(slide(2, 'ตัวอย่าง: 6 รอบจาก 2,000 รอบ', `<div class="kpis"><span>Solar PPA ลูกค้า A · มีบิล TOU + คำถามครบ</span><span>ค่าที่ประเมิน: ใช้ไฟได้ 85% · ราคา 25 บาท/W · ไฟผลิต 1,400 · O&amp;M 2% → IRR <b class="pos">${ir(base.irr)}</b></span></div>
${tbl(['รอบที่', 'ใช้ไฟได้', 'ราคาติดตั้ง (บาท/W)', 'ไฟที่ผลิตได้', 'O&amp;M', 'IRR', 'NPV (ล้าน)', 'ผล'], show.map(([i, r]) => ({ cells: [th(i + 1), pc(r.u), r.c.toFixed(1), th(r.y), (r.o * 100).toFixed(2) + '%', `<b class="${cls(r.npv)}">${ir(r.irr)}</b>`, `<b class="${cls(r.npv)}">${mb(r.npv)}</b>`, r.npv >= 0 ? `${ok} คุ้ม` : `${no} <b class="neg">ไม่คุ้ม (คำตอบพลิก)</b>`], hl: r.npv < 0 })), 'num big3')}
${say(`ทำแบบนี้ 2,000 รอบ แล้วนับว่ามีกี่รอบที่คำตอบพลิกจาก "คุ้ม" เป็น "ไม่คุ้ม" รอบที่ ${neg + 1} เป็นรอบแรกที่ราคาติดตั้งสูงและใช้ไฟได้น้อยพร้อมกัน จนไม่คุ้ม`)}`));

// histogram
const npvs = SR.map(r => r.npv).sort((a, b) => a - b), hLo = -2.5e6, hHi = 4.5e6, bins = 28, bw = (hHi - hLo) / bins;
const hist = Array.from({ length: bins }, (_, i) => npvs.filter(v => v >= hLo + i * bw && v < hLo + (i + 1) * bw).length);
const negN = npvs.filter(v => v < 0).length;
const histSvg = (() => { const W = 600, H = 380, max = Math.max(...hist), x = v => 40 + (v - hLo) / (hHi - hLo) * (W - 60), y = c => H - 40 - c / max * (H - 80);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${hist.map((c, i) => { const a = hLo + i * bw; return `<rect x="${x(a) + 1}" y="${y(c)}" width="${x(a + bw) - x(a) - 2}" height="${H - 40 - y(c)}" rx="2" fill="${a + bw <= 0 ? 'var(--orange)' : 'var(--mint)'}"/>`; }).join('')}
<line x1="${x(0)}" x2="${x(0)}" y1="20" y2="${H - 36}" stroke="#fff" stroke-width="2"/><text x="${x(0) - 8}" y="30" text-anchor="end" class="v pk">← ขาดทุน ${negN} รอบ</text><text x="${W - 12}" y="30" text-anchor="end" class="v pos">คุ้ม ${2000 - negN} รอบ →</text>
<line x1="${x(base.npv)}" x2="${x(base.npv)}" y1="40" y2="${H - 36}" stroke="#0c1321" stroke-width="3" stroke-dasharray="7 5"/>
${[-2, -1, 0, 1, 2, 3, 4].map(v => `<text x="${x(v * 1e6)}" y="${H - 16}" text-anchor="middle">${v}</text>`).join('')}<text x="${W - 10}" y="${H - 2}" text-anchor="end">NPV (ล้านบาท)</text></svg>`; })();
slides.push(slide(2, 'ผลของ 2,000 รอบ: อ่านอย่างไร', `<div class="g2 w60">${card(`<div class="ct">จำนวนรอบในแต่ละช่วง NPV · Solar PPA ลูกค้า A · บิล TOU + คำถามครบ</div>${histSvg}<p class="fn">เส้นประ = NPV ที่ประเมินจากค่ากลาง (${mb(base.npv)} ล้านบาท) · สีส้ม = รอบที่ขาดทุน</p>`)}
<div class="stack">${card(`<p class="lg"><b class="neg">${pct1(negN / 2000)}</b> ของรอบขาดทุน = <b>โอกาสตัดสินใจผิด</b> ถ้าตัดสินว่า "ลงทุน"</p>`)}${card(`<p class="lg">80% ของรอบ IRR อยู่ระหว่าง <b>${ir(S1('solar500').irr10)} – ${ir(S1('solar500').irr90)}</b> = คลาดได้ <b class="pk">±${half(S1('solar500'))} จุด</b></p>`)}${card('<p class="lg">ส่วนใหญ่ยังคุ้ม แต่ปลายด้านซ้ายข้ามเส้น 0 ไปพอสมควร จึง<b class="pk">ยังไม่ควรเซ็นสัญญา</b>จากข้อมูลแค่นี้</p>')}</div></div>`));

// why 2000
const cv = MC.conv, logx = N => Math.log10(N);
const convSvg = (() => { const W = 560, H = 380, x = N => 60 + (logx(N) - 2) / (4 - 2) * (W - 100), y = v => 20 + (0.27 - v) / (0.27 - 0.05) * (H - 70), truth = cv.at(-1).meanWrong;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}"><rect x="40" y="${y(truth + 0.01)}" width="${W - 50}" height="${y(truth - 0.01) - y(truth + 0.01)}" fill="#bdddd41f"/>
${[0.05, 0.10, 0.15, 0.20, 0.25].map(v => `<line x1="40" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff10"/><text x="34" y="${y(v) + 4}" text-anchor="end">${(v * 100).toFixed(0)}%</text>`).join('')}
${cv.map(c => c.vals.map((v, j) => `<circle cx="${x(c.N) + (j % 6 - 2.5) * 4}" cy="${y(v)}" r="4.5" fill="${c.N === 2000 ? 'var(--orange)' : '#9fb3cb'}" opacity="${c.N === 2000 ? 0.95 : 0.6}"/>`).join('')).join('')}
${cv.map(c => `<text x="${x(c.N)}" y="${H - 26}" text-anchor="middle" class="${c.N === 2000 ? 'v pk' : ''}">${th(c.N)}</text>`).join('')}<text x="${W - 10}" y="${H - 6}" text-anchor="end">จำนวนรอบที่จำลอง</text>
<text x="48" y="14" class="v pos">แถบเขียว = ค่าจริง ±1 จุด</text></svg>`; })();
const c500 = cv.find(c => c.N === 500), c2k = cv.find(c => c.N === 2000), c10k = cv.find(c => c.N === 10000);
const rangeOf = c => `${pc(Math.min(...c.vals))}–${pc(Math.max(...c.vals))}`;
slides.push(slide(2, 'ทำไมต้อง 2,000 รอบ', `<div class="g2 w60">${card(`<div class="ct">รันซ้ำ 30 ครั้งที่แต่ละจำนวนรอบ (เปลี่ยนชุดเลขสุ่มทุกครั้ง) · จุดแต่ละจุด = "โอกาสผิด" ที่วัดได้หนึ่งครั้ง</div>${convSvg}`)}
<div class="stack">${card(`<ul class="li lg"><li><b>รอบน้อย ผลกระโดด:</b> 500 รอบ วัดได้ตั้งแต่ ${rangeOf(c500)} แล้วแต่ดวง</li><li><b class="pk">2,000 รอบ:</b> ส่วนใหญ่อยู่ในแถบ ±1 จุดของค่าจริง (${rangeOf(c2k)})</li><li><b>10,000 รอบ:</b> แคบลงอีกนิด (${rangeOf(c10k)}) แต่ใช้เวลา 5 เท่า และคำตอบไม่เปลี่ยน</li></ul>`)}
${card(`<div class="ct">ทำไมเกณฑ์คือ ±1 จุด</div><p>ต้องแยกกรณีที่ต่างกันจริงให้ออก เช่น 15.9% (บิล TOU + คำถาม) กับ 10.7% (บิลธรรมดาแยกหน่วย) ซึ่งห่างกัน 5 จุด ถ้าผลแกว่ง ±1 จุด สองกรณีนี้ไม่ซ้อนกัน</p>`)}
${card(`<p class="fn">ตามทฤษฎี ความแกว่ง = √(p(1−p)/N) ลดลงตาม √N ต้องรันเพิ่ม 4 เท่าถึงจะแม่นขึ้น 2 เท่า · 2,000 รอบใช้ประมาณ 0.2 วินาทีต่อกรณี ทั้งการศึกษา (รวมการหาน้ำหนักข้อมูล 512 ชุด) ใช้ราว 3 นาที</p>`)}</div></div>`));

// ---------- 03 results ----------
slides.push(slide(3, 'ผลกรณีหลัก: มีบิล TOU + ตอบคำถามครบ', `${tbl(['ผลิตภัณฑ์', 'IRR ที่ประเมิน', 'IRR จริงน่าจะอยู่ (80%)', 'คลาดเคลื่อน', 'โอกาสตัดสินใจผิด', 'IRR คลาดเกิน 1 จุด'], P4.map(([l, k]) => { const r = S1(k); return [`<b>${l}</b>`, `<b class="${cls(r.est.npv)}">${ir(r.est.irr)}</b>`, `${ir(r.irr10)} ถึง ${ir(r.irr90)}`, `±${half(r)} จุด`, `<b class="${r.wrong > 0.1 ? 'neg' : 'pos'} xl">${pc(r.wrong)}</b>`, pc(r.off1, 0)]; }), 'num big3')}
<div class="g2">${card('<div class="ct">"จุด" คืออะไร</div><p class="lg">จุดเปอร์เซ็นต์ = ผลต่างของ % สองตัว เช่น ประเมินได้ 9.6% แต่จริง 8.6% = <b class="pk">คลาด 1 จุด</b> · "±2.1 จุด" แปลว่า IRR จริงน่าจะต่างจากที่ประเมินไม่เกินประมาณ 2.1 จุด (80% ของโอกาส)</p>')}
${card(`<div class="ct">"IRR คลาดเกิน 1 จุด" คืออะไร</div><p class="lg">% ของรอบที่ IRR จริงต่างจากที่ประเมินมากกว่า 1 จุด เช่น Solar PPA = ${pc(S1('solar500').off1, 0)} ของรอบ จึง<b class="pk">ควรรายงาน IRR เป็นช่วง</b> ไม่ใช่ทศนิยมตัวเดียว</p>`)}</div>`));

slides.push(slide(3, 'ทำไม Solar ผิดได้ แต่ Battery ไม่ผิด', `${card(`<div class="ct">IRR ที่ประเมิน (จุด) และช่วงที่ IRR จริงน่าจะอยู่ (แถบ) เทียบกับเกณฑ์ 8%</div>${irrLine(P4.map(([l, k]) => { const r = S1(k); return [l, r.est.irr * 100, r.irr10 * 100, r.irr90 * 100, r.est.npv >= 0 ? 'var(--mint)' : 'var(--orange)', `ผิด ${pc(r.wrong)}`]; }), { lo: -20, hi: 14 })}`)}
<div class="g2">${card('<p class="lg"><b class="neg">Solar:</b> แถบคร่อมเส้น 8% เพราะค่าที่ประเมิน (9.6%) อยู่ห่างเกณฑ์แค่ 1.6 จุด แต่คลาดได้ ±2 จุด บางรอบจึงตกไปฝั่งไม่คุ้ม</p>')}${card('<p class="lg"><b class="pos">Battery, Solar + Battery:</b> แถบอยู่ฝั่งซ้ายของเส้นทั้งหมด แม้คลาดสุดทางก็ยังไม่ถึง 8% คำตอบ "ไม่คุ้ม" จึงไม่เปลี่ยน</p>')}</div>`));

// bills + support reasons
slides.push(slide(3, 'บิลค่าไฟทุกแบบที่เป็นไปได้ และแพลตฟอร์มรองรับไหม', tbl(['ประเภทบิล', 'แพลตฟอร์ม', 'เหตุผล'], [
  ['<b>ประเภท 3.2 TOU</b><br><small>กิจการขนาดกลาง</small>', `${ok} รองรับเต็ม`, 'สูตรและตารางค่าไฟตั้งต้นในแพลตฟอร์มสร้างจากอัตรานี้'],
  ['<b>ประเภท 3.1 ปกติ</b><br><small>พิมพ์หน่วยแยกช่วงเวลา</small>', `${ok} รองรับ`, 'บางบิลอัตราปกติ (มิเตอร์ที่มีตัวคูณ) ยังพิมพ์หน่วยแยกช่วง ใช้วิธีเดียวกับบิล TOU ได้'],
  ['<b>ประเภท 3.1 ปกติ</b><br><small>ไม่แยกหน่วย</small>', `${ok} รองรับ`, 'คิดเงินได้ แต่ต้องใส่สัดส่วนไฟที่ใช้ได้เอง เพราะบิลไม่บอกไฟกลางวัน'],
  ['<b>บิลไม่ครบ</b><br><small>เห็นแค่ยอดเงิน / หน่วยรวม</small>', `${warn} ใช้ได้ แต่เสี่ยง`, 'ต้องเลือกชนิดมิเตอร์เองโดยไม่รู้ ถ้าเดาผิด คำตอบพลิกได้ (โอกาสผิดถึง 54%)'],
  ['<b>ประเภท 4.2 TOU</b><br><small>กิจการขนาดใหญ่</small>', `${warn} ใช้ได้ถ้าใส่อัตราเอง`, 'สูตรเหมือน TOU ประเภท 3 แต่อัตราต่างกัน แพลตฟอร์มยังไม่มีตารางอัตราประเภท 4 ให้เลือก'],
  ['<b>ประเภท 4.1 TOD</b><br><small>กิจการขนาดใหญ่</small>', `${no} ยังไม่รองรับ`, 'ค่า Demand คิดแยก 3 ช่วงเวลาในวัน แต่สูตรมีค่า Demand ช่องเดียว การคิดว่าแบตลดค่า Demand ช่วงไหนได้เท่าไรต้องใช้ไฟล์ 15 นาทีแยกตามช่วง และอยู่นอกขอบเขตงานวิจัย'],
  ['<b>ประเภท 2</b><br><small>กิจการขนาดเล็ก (&lt; 30 kW)</small>', '⚪ นอกกลุ่มเป้าหมาย', 'คำนวณได้ แต่ไม่มีค่า Demand ให้แบตลด และระบบเล็กจนค่าใช้จ่ายคงที่กินผลตอบแทน (บิลจริงที่ตรวจ: โซลาร์ 5 kWp ได้ IRR 5.5%)'],
], 'sm')));

// ladder
const lad = ['S6', 'S4', 'S5', 'S1', 'S3', 'S2', 'S7', 'S8'];
slides.push(slide(3, 'บิลแต่ละแบบ และข้อมูลที่เพิ่ม ลดโอกาสผิดได้เท่าไร', `<div class="g2 w60">${card(`<div class="ct">โอกาสตัดสินใจผิด · Solar PPA ลูกค้า A</div>${hbars(lad.map(id => { const r = sc('solar500', id); return [PLAIN[id], r.wrong, r.wrong > 0.2 ? 'var(--orange)' : r.wrong > 0.05 ? '#e9c39a' : 'var(--mint)', `IRR คลาด ±${half(r)} จุด`]; }), { max: 0.6, fmt: v => pc(v) })}`)}
<div class="stack">${card(`<ul class="li lg"><li><b class="neg">บิลไม่เห็นประเภทมิเตอร์</b> แย่ที่สุด เพราะ TOU กับอัตราปกติให้ผลต่างกันจนพลิกคำตอบ</li><li><b>ถามคำถาม</b> ลดโอกาสผิดจาก ${pc(sc('solar500', 'S4').wrong, 0)} เหลือ ${pc(S1('solar500').wrong, 0)}</li><li><b class="pos">ใบเสนอราคา</b> ลดเหลือ ${pc(sc('solar500', 'S7').wrong)} โดยไม่ต้องรบกวนลูกค้า</li><li><b class="pos">ไฟล์ 15 นาที</b> ลดเหลือ ${pc(sc('solar500', 'S8').wrong)}</li></ul>`)}</div></div>`));

// TOU vs normal
const t1 = S1('solar500'), n3 = sc('solar500', 'S3'), n2 = sc('solar500', 'S2');
slides.push(slide(3, 'ทำไมบิล TOU คลาดน้อยกว่า แต่โอกาสผิดไม่ได้น้อยกว่าบิลธรรมดา', `${card(`<div class="ct">IRR ที่ประเมิน (จุด) และช่วงที่ IRR จริงน่าจะอยู่ (แถบ) · Solar PPA ลูกค้า A · ตอบคำถามครบทุกกรณี</div>${irrLine([['บิล TOU', t1.est.irr * 100, t1.irr10 * 100, t1.irr90 * 100, 'var(--mint)', `±${half(t1)} จุด · ผิด ${pc(t1.wrong)}`], ['บิลธรรมดา (แยกหน่วย)', n2.est.irr * 100, n2.irr10 * 100, n2.irr90 * 100, 'var(--orange)', `±${half(n2)} จุด · ผิด ${pc(n2.wrong)}`], ['บิลธรรมดา (ไม่แยกหน่วย)', n3.est.irr * 100, n3.irr10 * 100, n3.irr90 * 100, 'var(--orange)', `±${half(n3)} จุด · ผิด ${pc(n3.wrong)}`]], { lo: 2, hi: 14 })}`)}
<div class="g3">${card(`<div class="ct">1. ทำไม TOU คลาดน้อยกว่า</div><p class="lg">บิล TOU มีหน่วย On-Peak บอกว่าใช้ไฟกลางวันเท่าไร สัดส่วนไฟที่ใช้ได้จึงคลาดแค่ ±8% บิลธรรมดาไม่มี ต้องเดาจากเวลาทำงาน คลาด ±15%</p>`)}
${card(`<div class="ct">2. ทำไมโอกาสผิดพอ ๆ กัน</div><p class="lg">โอกาสผิดขึ้นกับ<b class="pk">ระยะห่างจากเกณฑ์ 8%</b> ด้วย บิลธรรมดาประเมินได้ ${ir(n3.est.irr)} อยู่ห่างเกณฑ์ ${(8 - n3.est.irr * 100).toFixed(1)} จุด ส่วน TOU ได้ ${ir(t1.est.irr)} ห่าง ${(t1.est.irr * 100 - 8).toFixed(1)} จุด</p>`)}
${card('<div class="ct">3. ไม่ได้แปลว่าบิลธรรมดาดีกว่า</div><p class="lg">บิลธรรมดาผิดน้อยเพราะผลออกมา "ไม่คุ้ม" ชัดกว่า ไม่ใช่เพราะข้อมูลดีกว่า IRR ต่ำกว่าเพราะลูกค้าประหยัดต่อหน่วยได้น้อยกว่า</p>')}</div>`));

// all products all bills
const SCN = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
slides.push(slide(3, 'โอกาสตัดสินใจผิด: ทุกแบบบิล ทุกผลิตภัณฑ์', tbl(['ข้อมูลที่มี', '☀ Solar PPA', '◈ Solar + Battery', 'ϟ Battery'], SCN.map(id => ({ cells: [PLAIN[id], ...['solar500', 'hybrid', 'battery'].map(k => { const r = sc(k, id); return `<b class="${r.wrong > 0.1 ? 'neg' : 'pos'}">${pc(r.wrong)}</b> <small>±${half(r)}</small>`; })], hl: id === 'S1' })), 'num') + '<p class="fn">ตัวเลขใหญ่ = โอกาสตัดสินใจผิด · ตัวเลขเล็ก = IRR คลาดเคลื่อน (จุด) · Solar + Battery และ Battery ไม่มีโอกาสผิดในทุกแบบบิล เพราะผลอยู่ห่างเกณฑ์มาก</p>'));

// ---------- 04 weights ----------
const sw = MC.shapley.solar500.items;
slides.push(slide(4, 'ข้อมูลชิ้นไหนสำคัญที่สุด: Solar PPA', `<div class="g2 w60">${card(`<div class="ct">ส่วนที่ข้อมูลแต่ละชิ้นช่วยลดความคลาดเคลื่อน (รวม 100%)</div>${hbars(sw.map(i => [nm[i.id], i.share, col(i.id)]), { max: 0.45, fmt: v => pc(v) })}${legendW}`)}
<div class="stack">${card('<div class="ct">คิดน้ำหนักอย่างไร</div><p class="lg">เหมือนแบ่งเครดิตงานกลุ่มอย่างยุติธรรม: จำลองทุกลำดับที่อาจได้ข้อมูลมา (128 แบบ) ดูว่าแต่ละชิ้นทำให้ผลแม่นขึ้นเท่าไรตอนที่มันเข้ามา แล้วเฉลี่ย</p><p class="fn">วิธีนี้เรียกว่า Shapley value ใช้เพราะข้อมูลบางชิ้นช่วยเรื่องเดียวกัน เช่น หน่วย On-Peak กับคำถามข้อ 4, 7 ถ้าวัดทีละชิ้นจะนับซ้ำ</p>')}
${card('<p class="lg"><b class="pk">3 อันดับแรก</b>: ถามว่ามีโซลาร์อยู่แล้วไหม · ดูประเภทมิเตอร์ในบิล · ขอไฟล์ 15 นาที</p>')}</div></div>`));

slides.push(slide(4, 'ข้อมูลชิ้นไหนสำคัญที่สุด: Solar + Battery และ Battery', `<div class="g2">${card(`<div class="ct">◈ Solar + Battery</div>${hbars(MC.shapley.hybrid.items.map(i => [nm[i.id], i.share, col(i.id)]), { max: 0.45, fmt: v => pc(v) })}`)}
<div class="stack">${card(`<div class="ct">ϟ Battery</div>${hbars(MC.shapley.battery.items.map(i => [nm[i.id], i.share, col(i.id)]), { max: 0.7, fmt: v => pc(v) })}`)}${legendW}
${card('<p class="lg"><b>Battery ขึ้นกับราคาแบตเป็นหลัก</b> ใบเสนอราคาแบตจึงสำคัญที่สุด · Solar + Battery คล้าย Solar PPA เพราะรายได้ส่วนใหญ่มาจากไฟโซลาร์</p>')}</div></div>`));

slides.push(slide(4, 'ทำไมคำถามข้อ 9–10 สำคัญที่สุด และบิลบอกแทนไม่ได้', `<div class="g2">${card(`<div class="ct">คำถาม</div><div class="ql in big"><b>9</b><span>ปัจจุบันมี Solar Rooftop หรือระบบผลิตไฟอื่นอยู่แล้วไหม</span></div><div class="ql in big"><b>10</b><span>ถ้ามี Solar อยู่แล้ว ขนาดเท่าไร ใช้ไฟที่ผลิตได้หมดไหม</span></div>
<div class="ct mt">ทำไมบิลบอกแทนไม่ได้</div><p class="lg">โซลาร์เดิมกินไฟช่วงเที่ยงไปแล้ว แต่บิลรวมหน่วย On-Peak ทั้งช่วง 09:00–22:00 เป็นตัวเลขเดียว จึงมองไม่เห็นว่าช่วงเที่ยงเหลือให้โซลาร์ใหม่น้อย ถ้าไม่ถาม เราจะประเมินไฟที่ใช้ได้สูงเกินจริงมาก</p>`)}
<div class="stack">${card(`<div class="ct">น้ำหนักขึ้นกับว่ามีกี่ % ของโรงงานที่มีโซลาร์อยู่แล้วโดยเราไม่รู้</div>${tbl(['สมมติ', 'น้ำหนักข้อ 9–10', 'อันดับ'], MC.q910.map(q => ({ cells: [`${pc(q.p, 0)} ของโรงงาน`, `<b class="pk">${pc(q.items.find(i => i.id === 'Q910').share)}</b>`, 'อันดับ 1'], hl: q.p === 0.1 })), 'num')}`)}
${card(`<p class="lg">ในการจำลองสมมติว่า ถ้ามีโซลาร์เดิม ไฟที่ใช้ได้จะเหลือ ${pc(MC.assumptions.HIDDEN_SOLAR_CUT, 0)} ของที่ประเมิน · ไม่ว่าสมมติเท่าไร <b class="pk">ข้อ 9–10 ยังสำคัญที่สุด</b> จึงต้องถามทุกราย</p>`)}</div></div>`));

const marg = pk => { const b = S1(pk); return tbl(['เริ่มจาก บิล TOU + คำถามครบ แล้ว…', 'IRR คลาด', 'โอกาสผิด'], [{ cells: ['ไม่เปลี่ยนอะไร', `±${half(b)} จุด`, `<b>${pc(b.wrong)}</b>`], hl: true }, ...MC.marginal[pk].map(x => [`${x.change === 'เพิ่ม' ? '<b class="pos">เพิ่ม</b>' : '<b class="neg">ขาด</b>'} ${nm[x.id]}`, `±${half(x.r)} จุด`, `<b class="${x.r.wrong < b.wrong ? 'pos' : 'neg'}">${pc(x.r.wrong)}</b>`])], 'num big3'); };
slides.push(slide(4, 'ถ้าเพิ่มหรือขาดข้อมูลทีละชิ้น (Solar PPA ลูกค้า A)', `${marg('solar500')}<p class="fn">Solar + Battery และ Battery ไม่มีโอกาสผิดในทุกแถว เพราะผลอยู่ห่างเกณฑ์มาก</p>`));

const sQ = id => pc(MC.shapley.solar500.items.find(i => i.id === id).share);
slides.push(slide(4, 'สรุปน้ำหนักของคำถาม 16 ข้อ', `${tbl(['ข้อ', 'คำถาม', 'น้ำหนัก', 'บทบาท'], [
  { cells: ['9, 10', 'มีโซลาร์อยู่แล้วไหม / ขนาดเท่าไร ใช้หมดไหม', `<b class="pk">${sQ('Q910')}</b>`, '<span class="tag m">เข้าสูตร</span> สำคัญที่สุด ต้องถามทุกราย'], hl: true },
  { cells: ['4, 7', 'ทำงานกี่วัน ช่วงไหน / วันหยุดใช้ไฟไหม', `<b class="pk">${sQ('Q47')}</b>`, '<span class="tag m">เข้าสูตร</span> ทำให้ประมาณไฟที่ใช้ได้แม่นขึ้น'], hl: true },
  ['5, 6', 'ช่วงไหนใช้ไฟสูงสุด / เกิดจากอะไร', `<b>${pc(MC.shapley.battery.items.find(i => i.id === 'Q56').share)}</b> (Battery)`, '<span class="tag m">เข้าสูตร</span> บอกคร่าว ๆ ว่าแบตลดค่า Demand ได้แค่ไหน'],
  ['2, 3', 'ใช้ไฟกี่หน่วย / ค่าไฟเท่าไร', '0%', '<span class="tag b">ตรวจกับบิล</span> ซ้ำกับบิล ใช้ตรวจว่าตัวเลขตรงกัน'],
  ['8, 15, 16', 'แนวโน้มการใช้ไฟ / แผนขยาย / ข้อจำกัดการติดตั้ง', 'ไม่ได้วัด', '<span class="tag o">ธงเตือน</span> แพลตฟอร์มยังไม่มีช่องให้ใส่ ใช้เตือนความเสี่ยง'],
  ['1, 11–14', 'ธุรกิจ / ความสนใจ / เป้าหมาย', '0%', '<span class="tag g">จัดลำดับลูกค้า</span> ไม่เข้าสูตร'],
], 'big3')}
${say('ถ้าต้องตัดคำถามให้สั้นลง ห้ามตัดข้อ 9–10 และข้อ 4, 7')}`));

// ---------- 05 ----------
slides.push(slide(5, 'ข้อจำกัดและสมมติฐาน', tbl(['ข้อจำกัด', 'ผลกระทบ'], [
  ['ช่วง ± เป็นสมมติฐานของทีม ไม่ได้วัดจากโรงงานจริง', 'ถ้าช่วงจริงกว้างกว่านี้ ความคลาดเคลื่อนจริงก็มากกว่านี้ ควรปรับเมื่อมีข้อมูลโรงงาน 10–20 แห่ง'],
  ['สุ่มแต่ละค่าแยกกัน', 'ความจริงบางค่าสัมพันธ์กัน เช่น ระบบใหญ่อาจได้ราคาต่อวัตต์ถูกลง'],
  ['สมมติว่าลูกค้าตอบตรงความจริงโดยเฉลี่ย', 'ถ้าลูกค้าตอบเกินจริงเป็นระบบ วิธีนี้จับไม่ได้'],
  [`สมมติ ${pc(MC.assumptions.P_HIDDEN_SOLAR, 0)} ของโรงงานมีโซลาร์อยู่แล้ว`, 'น้ำหนักข้อ 9–10 เปลี่ยนได้ 25–59% แต่ยังเป็นอันดับ 1'],
  ['ไม่รวมความเสี่ยงตลาด', 'Ft, การปรับค่าไฟ, อัตราคิดลด ไม่ได้ลดลงเพราะได้ข้อมูลลูกค้าเพิ่ม จึงวัดแยก'],
  ['ใช้ลูกค้าตัวอย่าง 4 กรณี', 'โรงงานที่ IRR ใกล้ 8% มากกว่านี้จะมีโอกาสผิดสูงกว่า ห่างกว่านี้จะต่ำกว่า'],
], 'big3')));

slides.push(slide(5, 'ข้อเสนอ: ลำดับการเก็บข้อมูลลูกค้า', `<div class="flow tall">${[
  ['1', 'บิลฉบับเต็ม', 'ต้องเห็นประเภทมิเตอร์ หน่วยแยกช่วง และ Demand'],
  ['2', 'ถามข้อ 9–10 และ 4, 7', 'มีโซลาร์อยู่แล้วไหม · ทำงานกี่วัน ช่วงไหน'],
  ['3', 'คัดกรอง', 'Battery และ Solar + Battery ที่ห่างเกณฑ์ ตัดสินได้เลย'],
  ['4', 'ใบเสนอราคา', `Solar ที่ IRR อยู่ใน 8% ± 2 จุด · ผิด ${pc(S1('solar500').wrong, 0)} → ${pc(sc('solar500', 'S7').wrong, 0)}`],
  ['5', 'ไฟล์ 15 นาที', `ถ้ายังใกล้เส้น ก่อนเซ็นสัญญา · ผิดเหลือ ${pc(sc('solar500', 'S8').wrong)}`]].map(([i, h, p], k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl"><div class="st">${i}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
${card('<div class="ct">ในแพลตฟอร์ม</div><p class="lg">การ์ดความเสี่ยงมีปุ่ม <b class="pk">"บิล + คำถาม" · "+ ใบเสนอราคา" · "+ ไฟล์ 15 นาที"</b> กดแล้วตั้งช่วง ± ให้เอง แสดงโอกาสตัดสินใจผิด และบอกว่าควรขอข้อมูลอะไรต่อ</p>')}
${say('บิลกับคำถามพอจะคัดลูกค้าออกได้ทันที แต่ถ้าจะยืนยันว่า Solar คุ้ม ต้องขอใบเสนอราคาก่อนอย่างน้อย')}`));

// ---------- document ----------
const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
@page{size:1280px 720px;margin:0}
:root{--bg:#0c1321;--card:#1b2b43;--line:#ffffff14;--text:#eef2f8;--muted:#95a7c0;--orange:#ffb28b;--mint:#bdddd4;--blue:#82a7d4}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;background:#060a12}
body{font-family:'IBM Plex Sans Thai','Manrope',sans-serif;color:var(--text);-webkit-font-smoothing:antialiased}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;break-after:page;padding:30px 52px 26px;display:flex;flex-direction:column;
 background:radial-gradient(ellipse at 78% -12%,#22324ccc,transparent 55%),radial-gradient(ellipse at 112% 112%,#d28a6130,transparent 48%),var(--bg)}
.slide.bk{background:radial-gradient(ellipse at 78% -12%,#1d2b42cc,transparent 55%),#0a101c}
.hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--line)}
.sec{font:600 11px Manrope,'IBM Plex Sans Thai';letter-spacing:2px;color:var(--orange)}
h2{margin:5px 0 0;font-size:28px;font-weight:600;letter-spacing:-.4px;line-height:1.3}
.no{font:700 13px Manrope;color:#6d87a2;border:1px solid #ffffff1c;border-radius:9px;padding:5px 10px}
.body{display:flex;flex-direction:column;gap:12px}
h3{margin:4px 0 4px;font-size:16px;font-weight:600}
p{margin:0;color:#c3d0df;font-size:14px;line-height:1.6}
.card{background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:16px;padding:14px 18px;min-width:0}
.card.new,.box.new{border-color:#ffb28b80;box-shadow:0 0 0 1px #ffb28b33 inset}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.g7{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
.g2.w55{grid-template-columns:1.2fr 1fr}.g2.w60{grid-template-columns:1.45fr 1fr}.g2.w65{grid-template-columns:1.8fr 1fr}.g2.w40{grid-template-columns:.8fr 1.2fr}.g2.w35{grid-template-columns:.7fr 1.3fr}.g2.w30{grid-template-columns:.62fr 1.38fr}.g2.w50{grid-template-columns:1fr 1fr}
.stack{display:flex;flex-direction:column;gap:12px;min-width:0}.mt{margin-top:2px}
small{color:var(--muted);font-size:12px}
.big{font:700 38px Manrope;letter-spacing:-1px;line-height:1.15}.big u{font-size:16px;text-decoration:none;color:var(--muted);font-weight:500}
.mid{font:700 21px Manrope,'IBM Plex Sans Thai';letter-spacing:-.3px;margin:2px 0;color:var(--text)}
.pos{color:var(--mint)}.neg{color:var(--orange)}.pk{color:var(--orange)}
.ct{font-size:13px;font-weight:600;color:#cfdbe8;margin-bottom:8px;letter-spacing:.2px}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:14px;background:#111c2e;border:1px solid #ffffff12;border-radius:14px;overflow:hidden}
th{background:#182740;color:#9fb3cb;font-weight:600;font-size:12.5px;text-align:left;padding:9px 12px;border-bottom:1px solid #ffffff1a}
td{padding:8px 12px;border-bottom:1px solid #ffffff0d;vertical-align:top;color:#dbe4ee;line-height:1.5}
tr:last-child td{border-bottom:0}
tr.hl td{background:#ffb28b12}
table.num td:not(:first-child){font-variant-numeric:tabular-nums}
table.sm{font-size:12.5px}table.sm td{padding:6px 10px}table.sm th{padding:7px 10px}
table.big3 td{font-size:15px;padding:10px 14px}
table.kv{background:none;border:0}table.kv th{display:none}table.kv td{padding:4px 0;font-size:13px;border-bottom:1px solid #ffffff0d}table.kv td:first-child{color:var(--muted);width:34%}
.xl{font-size:18px}
.tag{display:inline-block;font-style:normal;font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:8px;white-space:nowrap}
.tag.o{background:#ffb28b1f;color:var(--orange)}.tag.b{background:#82a7d424;color:#b9d0ee}.tag.m{background:#bdddd424;color:var(--mint)}.tag.g{background:#ffffff12;color:#b4c2d3}
.ok{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#bdddd42e;color:var(--mint);font-size:12px;font-weight:700;margin-right:6px}
.no-x{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#ffb28b2a;color:var(--orange);font-size:12px;font-weight:700;margin-right:6px}
.wn{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#e9c39a2e;color:#f0cfa6;font-size:12px;font-weight:800;margin-right:6px}
ul.chk,ul.li,ol.ol{margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:6px}
ul.chk li,ul.li li,ol.ol li{font-size:14px;color:#d3dde9;line-height:1.55;position:relative;padding-left:22px}
ul.chk li:before{content:'✓';position:absolute;left:0;color:var(--mint);font-weight:700}
ul.li li:before{content:'';position:absolute;left:4px;top:10px;width:6px;height:6px;border-radius:50%;background:var(--orange)}
ul.li.x li:before{background:var(--orange)}
ul.li li.nw{color:var(--orange)}
ol.ol{counter-reset:o}ol.ol li{counter-increment:o;padding-left:28px}ol.ol li:before{content:counter(o);position:absolute;left:0;top:2px;width:20px;height:20px;border-radius:6px;background:#ffb28b26;color:var(--orange);font:700 12px Manrope;display:grid;place-items:center}
.say{margin-top:auto;display:flex;gap:12px;align-items:flex-start;background:#bdddd40c;border:1px solid #bdddd424;border-radius:12px;padding:10px 14px;font-size:13.5px;color:#c9d8e2;line-height:1.55}
.say b{flex:none;font-size:11px;letter-spacing:1px;color:#10201d;background:var(--mint);border-radius:6px;padding:2px 8px;margin-top:2px}
.guard{display:flex;flex-direction:column;gap:3px;background:#ffb28b0d;border:1px solid #ffb28b33;border-left:4px solid var(--orange);border-radius:12px;padding:10px 14px}
.guard b{font-size:11px;letter-spacing:1px;color:var(--orange)}.guard span{font-weight:600;font-size:14px}.guard em{font-style:normal;color:#c9d6e3;font-size:13.5px;line-height:1.55}
.src{margin-top:auto;font-size:11px;color:#7f95ae}
.lead{font-size:17px;line-height:1.65;color:#dfe8f2;background:linear-gradient(110deg,#ffb28b14,#bdddd40a);border:1px solid #ffffff14;border-radius:16px;padding:16px 20px}
.lead b{color:var(--text)}.lead b.pk{color:var(--orange)}
.ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:20px;color:#262f3f;background:linear-gradient(135deg,#ffd2a7,#f3a387);margin-bottom:8px;font-weight:700}
.ic.sm{width:34px;height:34px;font-size:16px}
.pain{padding:20px}.pain p{font-size:14.5px}
.box{text-align:center;padding:16px 10px}.box .ic{margin:0 auto 8px}.box h3{font-size:14.5px}.box p{font-size:12px;color:var(--muted)}
.flow{display:flex;align-items:stretch;gap:8px}.flow .fl{flex:1;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:14px;padding:14px 16px}
.flow .arr{align-self:center;color:var(--orange);font-size:22px;font-weight:700}
.flow.sm .fl{text-align:center;font-size:14px;padding:12px 10px;color:#dbe5f0}
.agenda{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:6px}
.ag{display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:16px;padding:20px 22px;position:relative}
.ag b{font:800 30px Manrope;color:var(--orange);opacity:.9}.ag span{font-size:19px;font-weight:600}
.ag.new{border-color:#ffb28b80}.ag em,.q em,.fd.new:after{position:absolute;top:10px;right:12px;font-style:normal;font-size:11px;font-weight:700;color:#3a2418;background:var(--orange);border-radius:7px;padding:1px 8px}
.qs{display:flex;flex-direction:column;gap:12px;margin-top:4px}
.q{display:flex;align-items:center;gap:18px;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:16px;padding:16px 22px;position:relative}
.q b{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font:800 19px Manrope;color:#262f3f;background:linear-gradient(135deg,#ffd2a7,#f3a387)}
.q span{font-size:19px}.q.new{border-color:#ffb28b80;background:linear-gradient(110deg,#3a2a2a,#1b2b43)}
.rules{display:flex;flex-direction:column;gap:10px}
.rule{display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:14px;padding:14px 16px}
.rule b{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font:800 15px Manrope;background:#bdddd426;color:var(--mint)}.rule span{font-size:15px}
.formula{font-size:18px;font-weight:600;line-height:1.6;text-align:center;padding:14px 18px;border-radius:16px;background:linear-gradient(110deg,#ffb28b1c,#bdddd414);border:1px solid #ffb28b40}
.formula.sm{font-size:15.5px}
.st{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:800 14px Manrope;background:linear-gradient(135deg,#ffd2a7,#f3a387);color:#262f3f;margin-bottom:4px}
.eq{font-size:16px;color:#dbe5f0;line-height:1.7;margin:4px 0 8px}
.res{font:700 22px Manrope,'IBM Plex Sans Thai';color:var(--mint);background:#bdddd414;border-radius:10px;padding:6px 12px;display:inline-block}.res.pk{color:var(--orange);background:#ffb28b1a}
.steps{display:flex;flex-direction:column;gap:9px}
.stp{display:flex;gap:14px;align-items:flex-start;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:14px;padding:10px 14px}
.stp>b{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:800 14px Manrope;background:linear-gradient(135deg,#ffd2a7,#f3a387);color:#262f3f}
.stp h3{margin:0}.stp p{font-size:13.5px}
.crit{font-size:18px;font-weight:600;text-align:center;padding:14px;border-radius:14px;background:linear-gradient(110deg,#2b4a45,#1e3550);border:1px solid #bdddd433}.crit b{color:var(--mint)}
.banner{text-align:center;font-size:20px;font-weight:700;padding:12px;border-radius:14px;background:linear-gradient(110deg,#ffd2a7,#f3a387);color:#2a2f3a}
.fn{font-size:12.5px;color:var(--muted)}
.kpis{display:flex;gap:10px;flex-wrap:wrap}.kpis span{background:#ffffff0a;border:1px solid #ffffff17;border-radius:10px;padding:7px 14px;font-size:14px;color:#d7e1ec}
.kp{display:flex;gap:16px;align-items:center}.kp .big{flex:none;font-size:34px}
.chart{width:100%;height:auto;display:block}
.chart text{font:13px 'IBM Plex Sans Thai',Manrope;fill:#a3b6cc}.chart text.v{fill:#eef2f8;font-weight:700;font-size:14.5px}.chart text.m{font-size:11px;fill:#7a90aa}.chart text.in{fill:#13222b;font-weight:600;font-size:12px}.chart text.pk{fill:var(--orange);font-size:16px}
.chart .nd{fill:#22354f;stroke:#aec0db40}.chart .nd.dim{fill:#162238}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--muted);margin-top:6px}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:12px;height:12px;border-radius:3px;display:inline-block}
.legend.col{flex-direction:column;gap:6px}.legend.col i{width:auto;height:auto}
.hbars{display:flex;flex-direction:column;gap:9px}
.hb{display:grid;grid-template-columns:minmax(150px,240px) 1fr 62px;align-items:center;gap:10px;font-size:13px}
.hb .hl-l{color:#d5dfea}.hb b{text-align:right;font:700 14px Manrope}.hb small{grid-column:2/4;margin-top:-6px;font-size:11px}
.hb-track{height:14px;background:#ffffff0d;border-radius:7px;overflow:hidden}.hb-track i{display:block;height:100%;border-radius:7px}
.torn{display:flex;flex-direction:column;gap:12px;padding:6px 0}
.tr{display:grid;grid-template-columns:260px 260px 260px 80px 1fr;align-items:center;gap:0;font-size:14px}
.tr .tl{color:#dbe4ee;padding-right:14px}.tz{height:26px;display:flex;justify-content:flex-end;border-right:2px solid #ffffff40}.tz.r{justify-content:flex-start;border-right:0}
.tz i{display:block;height:100%;border-radius:5px 0 0 5px}.tz.r i{border-radius:0 5px 5px 0}
.tn{background:linear-gradient(90deg,#f3a387,#ffb28b)}.tp{background:linear-gradient(90deg,#bdddd4,#9cc9bd)}
.tr b{font:700 15px Manrope;padding-left:12px}.tr small{font-size:12px}
.tr.axis .tz{height:auto;border:0;font-size:11px;color:var(--muted);padding:0 8px}
.qgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.qq{background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1a;border-radius:12px;padding:9px 11px;display:flex;flex-direction:column;gap:4px;position:relative}
.qq b{font:800 13px Manrope;color:var(--muted)}.qq span{font-size:13px;line-height:1.4;color:#dbe4ee;min-height:36px}.qq .tag{align-self:flex-start}
.qq.in{border-color:#bdddd466;background:linear-gradient(135deg,#21403f,#18283c)}.qq.in b{color:var(--mint)}
.persona .card{display:flex;flex-direction:column;gap:6px}
.avatar{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:700;background:linear-gradient(135deg,#ffd2a7,#f3a387);color:#262f3f}
blockquote{margin:2px 0 6px;font-size:15px;font-style:italic;color:#e4ecf5;border-left:3px solid var(--orange);padding-left:10px}
.res2{background:#ffffff08;border:1px solid #ffffff12;border-radius:10px;padding:8px 12px;display:flex;flex-direction:column}.res2 b{font-size:15px}
.method{font-size:12px;color:#8ea4bd;border-top:1px dashed #ffffff1f;padding-top:8px;margin-top:auto;line-height:1.55}
.finds{display:flex;flex-direction:column;gap:10px}
.fd{display:flex;gap:16px;align-items:center;background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:14px;padding:11px 18px;position:relative}
.fd>b{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font:800 16px Manrope;background:linear-gradient(135deg,#ffd2a7,#f3a387);color:#262f3f}
.fd h3{margin:0}.fd p{font-size:13.5px}.fd.new{border-color:#ffb28b80}.fd.new:after{content:'ใหม่'}
.rd{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#bdddd426;color:var(--mint);font:800 13px Manrope}
.card.row{display:flex;flex-direction:column}
.cover{justify-content:center;padding:60px 80px}
.cover .orb{position:absolute;border-radius:50%;filter:blur(2px)}
.cover .o1{width:520px;height:520px;right:-120px;top:-140px;background:radial-gradient(circle at 35% 30%,#ffd2a755,#f3a38722 45%,transparent 70%)}
.cover .o2{width:420px;height:420px;right:120px;bottom:-220px;border:1px solid #f6c4a630}
.cv{position:relative;z-index:1;max-width:900px}
.eyebrow{font:600 12px Manrope;letter-spacing:3px;color:#9fb3cb}
.cover h1{font-size:50px;line-height:1.25;margin:18px 0 22px;letter-spacing:-1px;font-weight:700}.cover h1 span{color:var(--orange)}
.pills{display:flex;gap:12px}.pills span{display:flex;align-items:center;gap:10px;background:#ffffff0b;border:1px solid #ffffff22;border-radius:999px;padding:10px 20px;font:600 17px Manrope}
.pills i{font-style:normal;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#ffd2a7,#f3a387);color:#262f3f;font-size:15px}
.cvsub{margin-top:24px;font-size:16px;color:#a9bbd0}
.cvfoot{position:absolute;left:80px;bottom:40px;font-size:14px;color:#8ea4bd}
.cover .no{position:absolute;right:52px;bottom:30px}
`;
const css2 = `
/* readability overrides for this deck */
.slide{padding:34px 60px 28px}
.body{gap:16px}
p.lg,ul.lg li,.lg{font-size:16px;line-height:1.7}
.card{padding:18px 22px}
.huge{font:800 54px Manrope;letter-spacing:-1px;margin:4px 0}
.g3.tall .card{padding:24px}
.terms .term{background:linear-gradient(135deg,#1e2e47,#17243b);border:1px solid #aec0db1f;border-radius:16px;padding:16px 20px;display:flex;flex-direction:column;gap:5px}
.term b{font-size:17px;color:var(--orange)}.term p{font-size:15px;line-height:1.65}.term em{font-style:normal;font-size:14px;color:var(--mint)}
.qlist{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px}
.ql{display:flex;align-items:center;gap:12px;background:#ffffff07;border:1px solid #ffffff12;border-radius:12px;padding:8px 12px}
.ql b{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font:800 13px Manrope;background:#ffffff14;color:#c9d6e5}
.ql span{flex:1;font-size:14.5px;color:#dbe4ee}.ql.in{border-color:#bdddd466;background:#bdddd414}.ql.in b{background:var(--mint);color:#10201d}
.ql.big{margin-bottom:10px;padding:12px 14px;align-items:flex-start}.ql.big span{font-size:16px;line-height:1.55}
.chart text.m2{font-size:12.5px;fill:#b9c7d6}
.flow.tall .fl{padding:18px 16px}.flow.tall .fl p{font-size:14.5px}
`;
const fit = `<script>
// Scale each slide's content (CSS zoom) so it fills the frame without overflowing; keeps the 'พูด' strip at the bottom.
document.fonts.ready.then(() => {
  for (const sl of document.querySelectorAll('.slide:not(.cover)')) {
    const b = sl.querySelector('.body'); if (!b) continue;
    const avail = sl.getBoundingClientRect().bottom - 24 - b.getBoundingClientRect().top;
    let best = 0.6;
    for (let z = 0.6; z <= 1.42; z += 0.02) { b.style.zoom = z; if (b.getBoundingClientRect().height <= avail && b.scrollWidth <= b.clientWidth + 2) best = z; }
    b.style.zoom = best; b.style.minHeight = (avail / best) + 'px'; sl.dataset.z = best.toFixed(2);
  }
  document.body.dataset.ready = '1';
});
</script>`;
fs.writeFileSync(OUT, `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>ความคลาดเคลื่อนของ Feasibility</title><style>${css}${css2}</style></head><body>${slides.join('\n')}${fit}</body></html>`);
console.log('slides', n, '→', decodeURIComponent(OUT.pathname));
