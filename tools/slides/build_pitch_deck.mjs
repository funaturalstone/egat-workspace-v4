// Builds the full pitch deck (16:9, platform dark theme) with every number taken from the engine.
// Output: reports/EGAT_สไลด์นำเสนอ_ฉบับสมบูรณ์.html → print to PDF with headless Chrome.
import fs from 'node:fs';
import * as S from './slide_numbers.mjs';
const MC = JSON.parse(fs.readFileSync(new URL('../reports/data_value_mc.json', import.meta.url)));
const OUT = new URL('../../reports/EGAT_สไลด์นำเสนอ_ฉบับสมบูรณ์.html', import.meta.url);

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
const SECTIONS = ['ตลาดและลูกค้า', 'Pain Point', 'คำถามวิจัย', 'วิธีวิจัย', 'สูตรคำนวณ', 'การตรวจสอบสูตร', 'กรณีศึกษา', 'ข้อมูลลูกค้าแม่นแค่ไหน', 'สรุปและขั้นต่อไป'];
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

// 1 cover
n++;
slides.push(`<section class="slide cover"><div class="orb o1"></div><div class="orb o2"></div>
<div class="cv"><div class="eyebrow">ENERGY WORKSPACE · EGAT × THAMMASAT</div>
<h1>แพลตฟอร์มประเมินความคุ้มค่า<br><span>การลงทุนพลังงานสะอาดของ กฟผ.</span></h1>
<div class="pills"><span><i>☀</i>Solar PPA</span><span><i>◈</i>Solar + Battery</span><span><i>ϟ</i>Battery</span></div>
<p class="cvsub">สูตรมาตรฐานเดียวกันทุกโครงการ · ตรวจกับ Excel 117 กรณี · บอกได้ว่าข้อมูลลูกค้าแม่นพอหรือยัง</p></div>
<div class="cvfoot">นำเสนอ 16 พฤศจิกายน 2569</div><div class="no">01</div></section>`);

// 2 agenda
slides.push(slide('สารบัญ', 'ลำดับการนำเสนอ', `<div class="agenda">${SECTIONS.map((s, i) => `<div class="ag${i === 7 ? ' new' : ''}"><b>${String(i + 1).padStart(2, '0')}</b><span>${s}</span>${i === 7 ? '<em>ใหม่</em>' : ''}</div>`).join('')}</div>`));

// 3 market
slides.push(slide(1, 'ตลาดโซลาร์ภาคธุรกิจในไทยกำลังโต', `<div class="g2 w55">
<div class="stack">
${card('<small>ผลิตไฟใช้เองวันนี้</small><div class="big">5,979 <u>MW</u></div><p>จาก 37,222 ราย · ในจำนวนนี้เป็นโซลาร์รูฟท็อป <b class="pos">3,932 MW</b> จาก 36,663 ราย (สนพ. และ กกพ., เม.ย. 2569)</p>')}
${card('<small>คาดการณ์ปี 2580</small><div class="big">9,894 <u>MW</u></div><p>กำลังผลิตไฟใช้เองรวมทุกประเภท (สนพ.) โตขึ้น <b class="pos">+65%</b> จากวันนี้</p>')}
<div class="g2">${card('<small>โครงการใหม่</small><div class="mid">386 โครงการ · 587 MW</div><p>โซลาร์รูฟท็อปที่ได้ใบอนุญาต กกพ. ปี 2567–พ.ค. 2569</p>')}
${card('<small>ราคาแบตไทย</small><div class="mid">12,000–15,000</div><p>บาท/kWh ปี 2026 ลดจาก 20,000–25,000 ในปี 2020</p>')}</div></div>
${card(`<div class="ct">กำลังผลิตไฟใช้เอง (MW)</div><svg class="chart" viewBox="0 0 470 300">
${[0, 2000, 4000, 6000, 8000, 10000].map(v => `<line x1="56" x2="460" y1="${260 - v / 10000 * 220}" y2="${260 - v / 10000 * 220}" stroke="#ffffff12"/><text x="50" y="${264 - v / 10000 * 220}" text-anchor="end">${th(v)}</text>`).join('')}
<rect x="110" y="${260 - 3932 / 10000 * 220}" width="110" height="${3932 / 10000 * 220}" fill="var(--mint)" rx="4"/><rect x="110" y="${260 - 5979 / 10000 * 220}" width="110" height="${2047 / 10000 * 220}" fill="var(--blue)" rx="4"/>
<text x="165" y="${260 - 3932 / 10000 * 220 / 2}" text-anchor="middle" class="in">3,932 รูฟท็อป</text><text x="165" y="${260 - 5979 / 10000 * 220 - 8}" text-anchor="middle" class="v">5,979</text>
<rect x="300" y="${260 - 9894 / 10000 * 220}" width="110" height="${9894 / 10000 * 220}" fill="#8ea6c4" opacity=".55" rx="4"/><text x="355" y="${260 - 9894 / 10000 * 220 - 8}" text-anchor="middle" class="v">9,894</text>
<text x="355" y="${260 - 9894 / 10000 * 220 / 2}" text-anchor="middle" class="v">รวมทุกประเภท</text>
<text x="165" y="282" text-anchor="middle">วันนี้ (เม.ย. 2569)</text><text x="355" y="282" text-anchor="middle">ปี 2580 (คาดการณ์)</text>
<path d="M230 120 Q 265 80 292 62" stroke="var(--orange)" stroke-width="2.5" fill="none" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="var(--orange)"/></marker></defs>
<text x="226" y="96" class="v pk" text-anchor="end">+65%</text></svg>
<div class="legend"><span><i style="background:var(--mint)"></i>โซลาร์รูฟท็อป</span><span><i style="background:var(--blue)"></i>อื่น ๆ</span><span><i style="background:#8ea6c4"></i>รวม (ไม่มีข้อมูลแยกประเภทในปี 2580)</span></div>`)}
</div>${src('ฐานเศรษฐกิจ (อ้างอิง สนพ. และ กกพ.), สนพ., กกพ. (เม.ย. 2569), ใบอนุญาต กกพ. (ปี 2567–พ.ค. 2569)')}`));

// 4 target customers
slides.push(slide(1, 'ลูกค้าเป้าหมายคือผู้ใช้ไฟขนาดกลางและใหญ่', `${tbl(['ประเภทผู้ใช้ไฟ', 'เหมาะไหม', 'เหตุผล'], [
  { cells: ['<b>3 กิจการขนาดกลาง</b> (30–999 kW)', `${ok} <b class="pos">เป้าหมายหลัก</b>`, 'มี Demand charge และเป็นลูกค้า Solar PPA อยู่แล้ว'], hl: true },
  ['<b>4 กิจการขนาดใหญ่</b> (≥ 1,000 kW)', `${ok} เหมาะ`, 'Demand charge สูง ระบบใหญ่ ต้นทุนต่อหน่วยถูก'],
  ['<b>5 โรงแรม และ 6 ราชการ</b>', `${ok} เหมาะ`, 'เลือกมิเตอร์ TOU ได้ และ กฟผ. ให้บริการกลุ่มนี้อยู่แล้ว'],
  ['1 บ้าน', `${no} ไม่เหมาะ`, 'มีโครงการรัฐรับซื้อไฟ 2.20 บาทอยู่แล้ว'],
  ['2 กิจการขนาดเล็ก', `${no} ไม่เหมาะ`, 'ไม่มี Demand charge ระบบเล็กแพง และหนี้เสีย SME ราว 9%'],
  ['7 สูบน้ำเกษตร', `${no} ไม่เหมาะ`, 'ใช้ได้เฉพาะหน่วยงานรัฐและกลุ่มเกษตรกร'],
])}
<div class="g2 mt">${card('<div class="kp"><span class="big pos">94%</span><p>ของกำลังผลิตโซลาร์รูฟท็อปเป็นภาคธุรกิจ (2,050 จาก 2,181 MW, มิ.ย. 2566, Krungsri Research)</p></div>')}
${card('<div class="kp"><span class="big">อันดับ 1</span><p>โรงงานชิ้นส่วนยานยนต์และอิเล็กทรอนิกส์ในนิคมฯ ตามด้วยค้าปลีกสมัยใหม่และคลังสินค้า</p></div>')}</div>`));

// 5 business models
slides.push(slide(1, 'สามรูปแบบธุรกิจที่ตลาดใช้อยู่', `${tbl(['', '☀ Solar PPA', '◈ Solar + Battery', 'ϟ Battery'], [
  ['<b>ลูกค้าได้อะไร</b>', 'ค่าไฟถูกลง 10–30% ไม่ต้องลงทุน', 'ใช้ไฟโซลาร์ได้ถึงตอนเย็น', 'Demand charge ลดลง'],
  ['<b>ผู้ลงทุนได้เงินจาก</b>', 'ขายไฟเป็นหน่วย', 'ขายไฟ + ส่วนแบ่งผลประหยัด', 'ส่วนแบ่งผลประหยัด'],
  ['<b>ตัวอย่างในไทย</b>', 'Gunkul, Banpu NEXT, ALT', 'Tokyo Gas, สยามโกลบอลเฮ้าส์ + Huawei', 'Banpu NEXT, CapSolar'],
  ['<b>สถานะ</b>', 'เจ้าตลาด สัญญา 15–20 ปี', 'ผู้เล่นใหญ่เพิ่งเริ่ม', 'ส่วนใหญ่ลูกค้าซื้อเอง'],
], 'big3')}
<div class="g2 mt">${card('<p><b class="pk">ตลาดยังกระจาย</b> เจ้าใหญ่สุด (Gunkul 94.6 MW) มีส่วนแบ่งราว <b class="pos">2.4%</b> ของโซลาร์รูฟท็อป 3,932 MW</p>')}
${card('<p><b class="pk">ช่องว่างของตลาด</b> ยังไม่มีผู้ลงทุนแบตให้โรงงานแล้วแบ่งผลประหยัด ซึ่งเป็นรูปแบบที่ กฟผ. จะทำ</p>')}</div>`));

// 6 pain point
slides.push(slide(2, 'ประเมินช้า ตัวเลขคลาดเคลื่อน ตัดสินใจยาก', `<div class="lead">กฟผ. ยังไม่มีวิธีประเมินมาตรฐานที่บอกได้เร็วและแม่นว่า <b class="pk">ลงทุนให้ลูกค้ารายนี้แล้วคุ้มไหม</b></div>
<div class="g4 mt">${[['⏱', '1. ช้า', 'ประเมินใน Excel ทีละโครงการ ลูกค้ารอผลนาน และส่งผลต่อการตัดสินใจซื้อ'], ['⚠', '2. คลาดเคลื่อน', 'ขาดรายละเอียดทางเทคนิค ทำให้ตัวเลขดีเกินจริง'], ['≋', '3. ไม่มีมาตรฐาน', 'สมมติฐานต่างกันทุกครั้ง เทียบโครงการกันไม่ได้ และผิดพลาดได้ง่าย'], ['?', '4. ไม่มีต้นแบบ', 'ยังไม่มีแบบจำลองสำหรับกรณี กฟผ. ลงทุนให้ลูกค้าแล้วแบ่งผลประหยัด']].map(([i, h, p]) => card(`<div class="ic">${i}</div><h3>${h}</h3><p>${p}</p>`, 'pain')).join('')}</div>`));

// 7 technical detail flips result
slides.push(slide(2, 'ขาดรายละเอียดทางเทคนิค ผลก็กลับด้าน', `<div class="g2 w55">
<div class="stack">${tbl(['IRR ของ Battery', 'วิธีของไฟล์ กฟผ.', 'คิดครบทั้งเทคนิคและสัญญา'], [
  ['ราคาแบต 10,000 บาท/kWh และ O&amp;M 1%', `<b class="pos">${ir(EM['team figures, no double count'].irr)}</b> ใกล้เกณฑ์`, `<b class="neg">${ir(BS['team: 10,000 baht/kWh + O&M 1%'].irr)}</b> ไม่คุ้ม`],
  ['ราคาแบตตลาด 13,500 บาท/kWh และ O&amp;M 1.5%', '—', `<b class="neg">${ir(C['4 Battery free charge'].mid.irr)}</b> ไม่คุ้มชัดเจน`],
])}
${card(`<div class="ct">สิ่งที่เพิ่มเข้าไป (ไฟล์เดิมไม่มี)</div><ul class="chk"><li>วัน Peak จริง 250 วัน</li><li>ไฟที่หายระหว่างชาร์จ-จ่าย 15%</li><li>แบตเสื่อม 2.5% ต่อปี</li><li>ลด Demand ได้จริง 50%</li><li>ส่วนแบ่งให้ลูกค้า 15%</li></ul>`)}</div>
<div class="stack">${card(`<div class="ct">IRR ของ Battery</div>${vbars([['แบบเดิม', EM['team figures, no double count'].irr * 100, 'ราคา 10,000'], ['คิดครบ', BS['team: 10,000 baht/kWh + O&M 1%'].irr * 100, 'ราคา 10,000'], ['คิดครบ', C['4 Battery free charge'].mid.irr * 100, 'ราคา 13,500']])}`)}
${card(`<p><b class="pk">ตัวแปรเดียวเปลี่ยนคำตอบได้</b> Solar PPA ลูกค้ารายเดียวกัน มิเตอร์ TOU ได้ NPV <b class="pos">${mb(base.npv)} ล้าน</b> มิเตอร์ธรรมดาได้ <b class="neg">${mb(C['N1 Solar A 15y normal'].mid.npv)} ล้าน</b></p>`)}
${card('<p><b class="pk">จุดที่ต้องปรับในไฟล์ตัวอย่าง</b> ใช้ Demand charge ของมิเตอร์ธรรมดาคู่กับค่าไฟของมิเตอร์ TOU และนับผลประหยัดของไฟชุดเดียวกัน 2 ครั้ง</p>')}</div></div>`));

// 8 solution
slides.push(slide(2, 'แนวทางแก้คือแพลตฟอร์มที่ใช้สูตรมาตรฐานเดียวกัน', `<div class="flow">${[['▤', 'ข้อมูลลูกค้า', 'บิลค่าไฟ + คำถาม 16 ข้อ'], ['▦', 'สูตรประเมิน', 'มาตรฐานเดียวกันทุกโครงการ'], ['▲', 'ผลลัพธ์', 'NPV · IRR · ระยะคืนทุน · ความเสี่ยง'], ['◎', 'ตัดสินใจ', 'ลงทุนได้เร็วและแม่นยำ']].map(([i, h, p], k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl"><div class="ic">${i}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
<div class="g3 mt">${card(`${ok}<h3>ได้คำตอบทันที</h3><p>ใส่ข้อมูลลูกค้า ได้ NPV, IRR และระยะคืนทุนทันที</p>`)}${card(`${ok}<h3>ตรวจย้อนได้ทุกตัวเลข</h3><p>ทุกโครงการใช้สูตรเดียวกัน เทียบกันได้</p>`)}${card(`${ok}<h3>หัวใจคือสูตร</h3><p>รีเสิร์ชนี้จึงออกแบบสูตร พิสูจน์ความถูกต้อง และหาตัวแปรที่ชี้ขาด</p>`)}</div>
${say('รีเสิร์ชไม่ได้ตัดสินแทนว่าผลิตภัณฑ์ไหนคุ้มสำหรับทุกลูกค้า แต่ทำให้แพลตฟอร์มตอบได้ถูกต้องเป็นรายลูกค้า')}`));

// 9 research questions (+Q5)
slides.push(slide(3, 'คำถามวิจัย', `<div class="qs">${[
  'ทั้ง 3 ผลิตภัณฑ์ต่างกันอย่างไร และเทียบกับไฟล์ BESS ของ กฟผ. แล้วเป็นอย่างไร',
  'ต้นทุนและปัจจัยอะไรบ้างที่ต้องอยู่ในสูตร',
  'ถ้า กฟผ. ลงทุนแบตเอง ต้องมีเงื่อนไขแบบไหนถึงจะคุ้ม',
  'ลูกค้ากลุ่มไหนเหมาะกับผลิตภัณฑ์ไหน',
  'ต้องใช้ข้อมูลลูกค้าแค่ไหน ถึงตัดสินใจได้ถูก'].map((q, i) => `<div class="q${i === 4 ? ' new' : ''}"><b>${i + 1}</b><span>${q}</span>${i === 4 ? '<em>ใหม่</em>' : ''}</div>`).join('')}</div>`));

// 10 research design
slides.push(slide(4, 'รูปแบบการวิจัย', `<div class="lead"><b>งานวิจัยเชิงปริมาณ</b> ใช้การวิเคราะห์ความเป็นไปได้ทางเทคนิคและการเงิน (Techno-Economic Feasibility Analysis) ด้วยกระแสเงินสดคิดลด (DCF) ผ่านแบบจำลองเชิงกำหนด วิเคราะห์ <b class="pk">3 สถานการณ์ (min / ค่ากลาง / max)</b> วัดความคลาดเคลื่อนจากข้อมูลลูกค้าด้วย <b class="pk">Monte Carlo</b> และพัฒนาแบบวนซ้ำ</div>
<div class="g7 mt">${[['▮▮▮', 'เชิงปริมาณ', ''], ['⚙', 'Techno-Economic', 'เทคนิค + การเงิน'], ['฿', 'DCF', 'กระแสเงินสดคิดลด'], ['⌥', 'เชิงกำหนด', 'Deterministic'], ['⇅', 'min / กลาง / max', '3 สถานการณ์'], ['⁂', 'Monte Carlo', '2,000 รอบ · ข้อมูลลูกค้า'], ['↻', 'วนซ้ำ', 'สร้าง → ตรวจ → ปรับ']].map(([i, h, p], k) => card(`<div class="ic">${i}</div><h3>${h}</h3><p>${p}</p>`, k === 5 ? 'box new' : 'box')).join('')}</div>
<div class="g3">${card('<div class="ct">ผลหลัก: min / ค่ากลาง / max</div><p>ตอบว่าแต่ละผลิตภัณฑ์คุ้มไหม และขอบเขตของผลเมื่อทุกตัวแปรอยู่ฝั่งแย่หรือฝั่งดีพร้อมกัน</p>')}${card('<div class="ct">Monte Carlo: ข้อมูลลูกค้า</div><p>ตอบว่ามีแค่บิล + คำถาม ผลคลาดได้แค่ไหน มีโอกาสตัดสินใจผิดเท่าไร และควรขอข้อมูลอะไรต่อ</p>', 'new')}${card('<div class="ct">วนซ้ำกับผู้เชี่ยวชาญ</div><p>ทุกรอบตรวจกับทีม กฟผ. และ Excel จริง สูตรจึงสมเหตุสมผลขึ้นทุกรอบ</p>')}</div>`));

// 11 method vs pain point
slides.push(slide(4, 'วิธีวิจัยแต่ละส่วนแก้ Pain Point อย่างไร', `${tbl(['องค์ประกอบ', 'แก้ปัญหา', 'เหตุผล'], [
  ['<b>เชิงปริมาณ</b>', '<span class="tag b">ไม่มีมาตรฐาน</span>', 'ตอบ "คุ้มไหม" ด้วยตัวชี้วัดชุดเดียวกันทุกโครงการ'],
  ['<b>Techno-Economic</b>', '<span class="tag o">คลาดเคลื่อน</span>', 'คิดทั้งเทคนิค (ไฟที่ผลิตได้ ความเสื่อม ไฟที่หาย) และการเงิน เหมือนหลักของ NREL SAM'],
  ['<b>DCF</b>', '<span class="tag o">คลาดเคลื่อน</span>', 'โครงการยาว 10–20 ปี มีค่าเปลี่ยนอุปกรณ์กลางทาง ต้องคิดมูลค่าเงินตามเวลา'],
  ['<b>เชิงกำหนด</b>', '<span class="tag b">ไม่มีมาตรฐาน</span>', 'ตรวจย้อนได้ทุกตัวเลข'],
  ['<b>min / ค่ากลาง / max</b>', '<span class="tag o">คลาดเคลื่อน</span>', 'ค่าจากแหล่งอ้างอิงเป็นช่วง จึงต้องดูกรณีดีที่สุดและแย่ที่สุด'],
  { cells: ['<b>Monte Carlo</b>', '<span class="tag o">คลาดเคลื่อน</span>', 'วัดว่าข้อมูลลูกค้าที่มี (บิล + คำถาม) ทำให้ผลคลาดได้แค่ไหน และควรขอข้อมูลอะไรเพิ่ม'], hl: true },
  ['<b>วนซ้ำ</b>', '<span class="tag m">ไม่มีต้นแบบ</span>', 'สร้างแล้วให้ผู้เชี่ยวชาญตรวจ แล้วปรับ'],
])}
${guard('ทำไมใช้ทั้ง min/max และ Monte Carlo', 'min/max ใช้กับค่าจากแหล่งอ้างอิง เพราะในไทยยังไม่มีข้อมูลพอสร้างการกระจายความน่าจะเป็น ส่วน Monte Carlo 2,000 รอบใช้วัดความคลาดเคลื่อนจากข้อมูลลูกค้า และแพลตฟอร์มมีการ์ดจำลองให้ทีม กฟผ. เลือกระดับข้อมูลที่มีได้เอง')}`));

// 12 scope
slides.push(slide(4, 'ขอบเขตการวิจัย', `<div class="g2">${card(`<div class="ct pos">✓ ศึกษา</div><ul class="li">
<li>3 ผลิตภัณฑ์ ในมุมที่ กฟผ. เป็นผู้ลงทุน</li><li>ผู้ใช้ไฟประเภท 3–6 อัตรา กฟภ. 22–33 kV</li><li>มิเตอร์ TOU และแบบธรรมดา</li><li>คิดก่อนภาษี ไม่รวมเงินกู้ (เหมือนไฟล์ กฟผ.)</li><li>รายได้จากค่าไฟและการลด Demand</li><li>อายุโครงการ 10–20 ปี · ค่าเฉลี่ยรายวัน</li><li class="nw">ความคลาดเคลื่อนจากข้อมูลลูกค้า (บิล + คำถาม 16 ข้อ)</li></ul>`)}
${card(`<div class="ct neg">✕ ไม่ได้ศึกษา</div><ul class="li">
<li>มุมที่ลูกค้าซื้อเอง (ใช้เป็นข้อมูลเทียบ)</li><li>บ้าน, กิจการขนาดเล็ก, สูบน้ำเกษตร</li><li>อัตรา TOD (ประเภท 4.1)</li><li>ผลเมื่อมีภาษีและเงินกู้ (แพลตฟอร์มรองรับแล้ว)</li><li>รายได้จาก I-REC, ขายไฟคืนกริด, ตลาดซื้อขายไฟ</li><li>ความเสี่ยงลูกค้าผิดนัดชำระ</li><li class="nw">ความเสี่ยงตลาด (Ft, การปรับค่าไฟ, อัตราคิดลด) ใน Monte Carlo</li></ul>`)}</div>
${say('ขอบเขตบอกว่าผลใช้ได้กับกรณีไหน ส่วนที่ไม่ได้ศึกษาเพิ่มในแพลตฟอร์มภายหลังได้ และบางส่วนเพิ่มแล้ว')}`));

// 13 iterative
slides.push(slide(4, 'ขั้นตอนการวิจัยแบบวนซ้ำ', `${tbl(['รอบ', 'สิ่งที่ทำ', 'สิ่งที่ปรับ'], [
  ['<span class="rd">1</span>', 'สร้างสูตรจากไฟล์ BESS ของ กฟผ.', `${ok} คำนวณซ้ำได้ตรงกับไฟล์ Excel`],
  ['<span class="rd">2</span>', 'ทีม กฟผ. ให้ความเห็นต่อผลรอบแรก แล้วค้นแหล่งอ้างอิงเพิ่ม', `${ok} วัน Peak 250 วัน, ไฟที่หาย 15%, Demand charge รายเดือน, ไม่นับผลประหยัดซ้ำ, แยกประเภทมิเตอร์`],
  ['<span class="rd">3</span>', 'ทีมตรวจทานสูตรซ้ำ (cross-check) และใส่สูตรในแพลตฟอร์ม', `${ok} สมดุลพลังงานรายวัน, ลด Demand 50%, แบ่งผลประหยัดสุทธิ, แยกความเสื่อม, min/max ทุกตัวแปร · ตรวจแพลตฟอร์มกับ Excel 117 กรณี`],
  { cells: ['<span class="rd">4</span>', 'วัดความแม่นยำเมื่อใช้ข้อมูลลูกค้าจริง', `${ok} Monte Carlo 2,000 รอบ · บิลทุกแบบ + คำถาม 16 ข้อ · น้ำหนักของข้อมูลแต่ละชิ้น`], hl: true },
  ['<span class="rd">5</span>', 'ทีม กฟผ. ตรวจสูตรรอบ 3', '(ถัดไป)'],
])}
<div class="flow sm mt">${['ศึกษาข้อมูล', 'สร้างสูตร', 'คำนวณ', 'ตรวจสอบ', 'ปรับแก้', 'สรุปผล'].map((s, k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl">${s}</div>`).join('')}</div>
${say('แต่ละรอบสูตรสมเหตุสมผลขึ้น และทุกการแก้มีเหตุผลที่ตรวจสอบได้')}`));

// 14 data sources
slides.push(slide(4, 'แหล่งข้อมูลที่ใช้', tbl(['ประเภท', 'แหล่ง', 'ใช้ทำอะไร'], [
  ['<b>ปฐมภูมิ</b>', 'ไฟล์ BESS ของ กฟผ., ความเห็นทีม กฟผ., บิลค่าไฟและคำตอบจากโรงงาน', 'โครงสร้างสูตรแบต, ตรวจความสมเหตุสมผล, ทดสอบกับข้อมูลจริง'],
  ['<b>ทางการ</b>', 'กฟภ., กฟน., กกพ., สนพ., ร่าง PDP2026', 'ค่าไฟ ข้อมูลตลาด ค่าไฟในอนาคต'],
  ['<b>งานวิจัย</b>', 'จุฬาฯ, KMUTT, RMUTL, IJSIT, NREL', 'ไฟที่ผลิตได้ ความเสื่อม วิธีวิเคราะห์'],
  ['<b>ราคาตลาด</b>', 'CapSolar, Saimai Solar, BNEF, Lazard', 'ราคาโซลาร์และแบต'],
  ['<b>รูปแบบธุรกิจ</b>', 'Tokyo Gas, Banpu NEXT, ALT, Hawaii State Energy Office', 'รูปแบบธุรกิจและการแบ่งผลประหยัด'],
], 'big3')));

// 15 choosing values
slides.push(slide(4, 'หลักการเลือกค่าเมื่อแหล่งข้อมูลไม่ตรงกัน', `<div class="g2 w40"><div class="rules">${['ข้อมูลไทยมาก่อนข้อมูลต่างประเทศ', 'ใช้ข้อมูลล่าสุด', 'ใช้ค่ากลางเป็นค่าหลัก และใช้ช่วงของทุกแหล่งเป็น min/max', 'ถ้าไม่แน่ใจ เลือกค่าที่ไม่ทำให้ผลดีเกินจริง'].map((r, i) => `<div class="rule"><b>${i + 1}</b><span>${r}</span></div>`).join('')}</div>
${tbl(['ตัวอย่าง', 'แหล่งต่าง ๆ', 'ค่าที่เลือก (min / กลาง / max)'], [
  ['ต้นทุนโซลาร์', '18–22 (Saimai), 25–30 (กกพ.), 25–32 (CapSolar)', '<b>32 / <span class="pk">25</span> / 18 บาท/W</b>'],
  ['ไฟที่ผลิตได้', '1,250–1,315 (KMUTT), 1,450 (CapSolar), 1,475 (IJSIT)', '<b>1,250 / <span class="pk">1,400</span> / 1,475 kWh/kWp/ปี</b>'],
  ['ราคาแบต', '12,000–15,000 (ไทย), 3,390–9,230 (BNEF)', '<b>15,000 / <span class="pk">13,500</span> / 8,630 บาท/kWh</b>'],
])}</div>`));

// 16 model structure
slides.push(slide(5, 'โครงสร้างแบบจำลองและลูกค้าตัวอย่าง', `<div class="flow sm">${['ข้อมูลลูกค้าและต้นทุน', 'คำนวณไฟที่ผลิตและจ่าย', 'รายได้และค่าใช้จ่าย', 'กระแสเงินสดรายปี', 'NPV / IRR / ระยะคืนทุน'].map((s, k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl">${s}</div>`).join('')}</div>
<div class="g2 w40 mt">${card(`<ul class="chk"><li>มองจากฝั่ง กฟผ. แยกมุมผู้ลงทุนกับมุมลูกค้าแบบ NREL SAM</li><li>กระแสเงินสดปีที่ t = รายได้ − ค่าบำรุงรักษา − ค่าใช้จ่ายอื่น − ค่าเปลี่ยนอุปกรณ์ (+ มูลค่าซากในปีสุดท้าย)</li><li>ปีที่ 0 = − เงินลงทุน</li></ul><div class="kp mt"><span class="mid">ลูกค้าตัวอย่าง</span><p>โรงงาน จ.–ส. 313 วัน · โซลาร์ 500 kWp</p></div>`)}
${tbl(['รายการ', 'ลูกค้า A', 'ลูกค้า B'], [
  ['ไฟที่ใช้กลางวัน', 'มากกว่าไฟโซลาร์ (≥ 1,918 kWh/วัน)', '1,400 kWh/วัน'],
  ['ใช้ไฟโซลาร์ได้', '<b class="pos">85%</b>', '<b>63%</b> (1,400 × 313 ÷ 700,000)'],
  ['ไฟเหลือในวันทำงาน', 'ไม่มี', '~518 kWh/วัน'],
])}</div>
${say('ลูกค้าตัวอย่างสร้างขึ้นเพื่อทดสอบสูตรตามที่พี่เลี้ยงแนะนำ และใช้ชุดเดียวกันทุกผลิตภัณฑ์เพื่อให้เทียบกันได้')}`));

// 17 solar formula
slides.push(slide(5, 'สูตร Solar PPA', `<div class="formula">รายได้ กฟผ. ปีที่ t = kWp × ไฟที่ผลิตได้ × (1 − 0.7%)<sup>t−1</sup> × สัดส่วนที่ลูกค้าใช้ × ราคา PPA × (1 + 0.5%)<sup>t−1</sup></div>
${tbl(['ตัวแปร', 'ค่า', 'ที่มา'], [
  ['ไฟที่ผลิตได้', '1,400 kWh/kWp/ปี', 'งานวิจัยไทยและตลาด'],
  ['สัดส่วนที่ลูกค้าใช้', 'ตามการใช้ไฟจริง', 'ไฟส่วนเกินขายคืนไม่ได้ มูลค่าเป็น 0'],
  ['ราคา PPA', '<b class="pk">3.31 บาท/kWh</b>', 'สไลด์ถัดไป'],
  ['แผงเสื่อม', '0.7%/ปี', 'NREL และช่วงที่วัดได้ในไทย 0.3–1.9%'],
  ['ค่าไฟขึ้น', '0.5%/ปี', 'ร่าง PDP2026'],
  ['ค่าบำรุงรักษา', '2% ของเงินลงทุน ขึ้นปีละ 2%', 'ต่ำกว่าระดับสหรัฐฯ ของ NREL (~2.6%)'],
  ['เปลี่ยนอินเวอร์เตอร์', 'ปีที่ 12, 3,000 บาท/kW', 'อายุอินเวอร์เตอร์ 10–15 ปี'],
  ['อายุสัญญา', '15 ปี (ทางเลือก 20 ปี)', 'ตลาดใช้ 15–20 ปี (กกพ.)'],
])}`));

// 18 PPA price
const tz = T['hol 11→19 (2570)'];
slides.push(slide(5, 'ที่มาของราคา PPA 3.31 บาท', `<div class="g3">${card('<div class="st">1</div><h3>มูลค่าไฟโซลาร์</h3><p class="eq">0.71 × Peak 4.1839<br>+ 0.29 × Off-peak 2.6037<br>+ Ft 0.1623</p><div class="res">= 3.89 บาท/kWh</div>')}
${card('<div class="st">2</div><h3>ที่มาของ 0.71</h3><p class="eq">วัน Peak 250 ÷ 313 วันทำงาน (80%)<br>× ไฟที่ผลิตหลัง 09:00 (89%)</p><div class="res">= 0.7109</div>')}
${card('<div class="st">3</div><h3>ราคา PPA</h3><p class="eq">3.8893 × (1 − ส่วนลด 15%)</p><div class="res pk">= 3.31 บาท/kWh</div>')}</div>
<div class="g2 mt">${card(`<ul class="chk"><li>ตรงกับราคาตลาด 3.20–3.60 บาท (CapSolar)</li><li>ส่วนลดตลาด 10–30% (กกพ.)</li><li>Ft 0.1623 บาท = ค่า Ft งวด ก.ย.–ธ.ค. 2569 ที่ กกพ. เห็นชอบ</li></ul>`)}
${guard('0.71 มาจากไหน และทำไมลด 15% · ปี 2570 วันหยุดเปลี่ยนไหม', `250 วันคิดจากวันหยุดราชการที่ตรงวันธรรมดา 11 วัน ปฏิทิน 2570 ที่เผยแพร่มี 19 วัน (ครม. ยังไม่อนุมัติ ณ 11 พ.ย. 2569) ถ้าใช้ 19 วัน Solar PPA ลูกค้า A ได้ NPV ${mb(tz.npv)} ล้านบาท (IRR ${ir(tz.irr)}) ยังคุ้ม`)}</div>`));

// 19 S+B step 1
slides.push(slide(5, 'สูตร Solar + Battery ขั้นที่ 1: สมดุลพลังงานรายวัน', `<div class="g2 w50"><div class="steps">${[
  ['ไฟโซลาร์ต่อวัน', 'kWp × ไฟที่ผลิตได้ ÷ 365 (= 1,918 kWh)'],
  ['ลูกค้าใช้ไฟโซลาร์ตรงก่อน', 'ใช้ทันที = min(ไฟใช้กลางวัน, ไฟโซลาร์)'],
  ['ส่วนเกินเข้าแบต', 'ไฟเข้าแบต = min(ส่วนเกิน, 400 kWh)'],
  ['ถ้าไม่พอ', 'วันจันทร์เติมจากไฟวันอาทิตย์ (~50 ครั้ง/ปี) วันอื่นชาร์จจากกริดช่วง Off-peak'],
  ['แบตจ่ายไฟช่วง Peak', 'ไฟเข้าแบต × 85%']].map(([h, p], i) => `<div class="stp"><b>${i + 1}</b><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
${card(`<div class="ct">การไหลของไฟ (รายวัน)</div><svg class="chart" viewBox="0 0 440 300">
<defs><marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="var(--mint)"/></marker></defs>
<rect x="20" y="20" width="150" height="62" rx="12" class="nd"/><text x="95" y="47" text-anchor="middle" class="v">☀ โซลาร์</text><text x="95" y="67" text-anchor="middle">1,918 kWh/วัน</text>
<rect x="270" y="20" width="150" height="62" rx="12" class="nd"/><text x="345" y="47" text-anchor="middle" class="v">โหลดลูกค้า</text><text x="345" y="67" text-anchor="middle">ใช้ทันที</text>
<rect x="20" y="160" width="150" height="62" rx="12" class="nd"/><text x="95" y="187" text-anchor="middle" class="v">ϟ แบตเตอรี่</text><text x="95" y="207" text-anchor="middle">ชาร์จ / เก็บ</text>
<rect x="270" y="160" width="150" height="62" rx="12" class="nd"/><text x="345" y="187" text-anchor="middle" class="v">จ่ายไฟช่วง Peak</text><text x="345" y="207" text-anchor="middle">85%</text>
<rect x="20" y="248" width="150" height="44" rx="12" class="nd dim"/><text x="95" y="275" text-anchor="middle">กริด (Off-peak)</text>
<line x1="172" y1="51" x2="266" y2="51" stroke="var(--mint)" stroke-width="2.5" marker-end="url(#a2)"/>
<line x1="95" y1="84" x2="95" y2="155" stroke="var(--mint)" stroke-width="2.5" marker-end="url(#a2)"/><text x="104" y="124">ส่วนเกิน ≤ 400 kWh</text>
<line x1="172" y1="191" x2="266" y2="191" stroke="var(--mint)" stroke-width="2.5" marker-end="url(#a2)"/>
<line x1="95" y1="246" x2="95" y2="226" stroke="#8ea6c4" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#a2)"/><text x="104" y="240">วันอื่น</text></svg>`)}</div>
${say('ทำแบบนี้เพื่อไม่ให้แบตชาร์จฟรีทั้งที่ไม่มีไฟเหลือจริง หลักการเดียวกับ Tokyo Gas และเพราะธุรกิจขายไฟส่วนเกินคืนไม่ได้')}`));

// 20 S+B step 2
slides.push(slide(5, 'สูตร Solar + Battery ขั้นที่ 2: รายได้และเหตุผลของแต่ละส่วน', `<div class="formula">รายได้ กฟผ. = ไฟใช้ทันที × ราคา PPA + 85% × [ไฟที่แบตจ่าย × (Peak + Ft) + Demand ที่ลดได้ − ค่าไฟชาร์จ]</div>
${tbl(['ส่วนของสูตร', 'ค่า', 'เหตุผล'], [
  ['ขนาดแบต', '500 kWh / 250 kW', 'แบต 2 ชั่วโมงเป็นขนาดมาตรฐาน (Lazard, NREL)'],
  ['ราคาแบต', '13,500 บาท/kWh = 6.75 ล้านบาท', 'ราคาตลาดไทยปัจจุบัน (CapSolar)'],
  ['ใช้ได้ต่อรอบ · ไฟที่หาย', '80% · 15%', 'ตามไฟล์ กฟผ. · NREL ATB 2025'],
  ['Demand ที่ลดได้', 'อัตรา × 250 kW × 50% × 12 เดือน', 'ต้องคุม Peak 13 ชั่วโมง และกฎค่าไฟขั้นต่ำ 70% ของ กฟภ.'],
  ['ส่วนแบ่ง', '85 : 15 จากผลประหยัดสุทธิ', 'สัญญาแบ่งผลประหยัดวัดจากบิลจริง (Hawaii)'],
  ['แบตเสื่อม · ค่าบำรุงรักษาแบต', '2.5%/ปี · 1.5% ของเงินลงทุน ขึ้นปีละ 2%', 'ผู้ขายไทยระบุ 2–3% · ค่ากลางของไทย (1–2%)'],
  ['เปลี่ยนแบต', 'ปีที่ 10: 60% ของค่าแบต + PCS 3,000 บาท/kW = 4.80 ล้านบาท', 'รับประกัน 10 ปี และราคาลดเร็ว (BNEF −40% ในปีเดียว)'],
  ['มูลค่าซาก', '50% ของค่าเปลี่ยนแบต = 2.40 ล้านบาท (ปีที่ 15)', 'แบตที่เปลี่ยนยังเหลืออายุ 5 ใน 10 ปี (คิดเส้นตรง)'],
])}`));

// 21 battery formula
slides.push(slide(5, 'สูตร Battery และสิ่งที่ปรับจากไฟล์ กฟผ.', `<div class="g2 w40"><div class="stack"><div class="formula sm">รายได้ กฟผ. = 85% × [ไฟที่แบตจ่าย × (Peak + Ft) + Demand ที่ลดได้ − ค่าไฟชาร์จ]</div>
${card(`<ul class="chk"><li><b>คงไว้ตามไฟล์ กฟผ.:</b> ใช้ได้ต่อรอบ 80%, อายุ 10 ปี, มูลค่าซาก 10%, อัตราคิดลด 8%</li><li><b>ต้นทุนใช้ราคาตลาด:</b> แบตใหม่ 13,500 บาท/kWh แทนแบตมือสอง 8,630–13,940 ในไฟล์ และค่าบำรุงรักษา 1.5% ของเงินลงทุน/ปี แทน 8,000 + 35,000 บาท/ปี</li><li><b>ไม่รวมค่าแรกเข้า ENZY 120,000 บาท</b> (ยังไม่ทราบว่าใช้กับทุกโครงการ) ถ้ารวม: Solar PPA ลูกค้า A ได้ IRR ${ir(base.irr)} → ${ir(EZ['Solar A'].irr)} (NPV ${mb(EZ['Solar A'].npv)} ล้าน) และ Battery ชาร์จฟรี ${ir(C['4 Battery free charge'].mid.irr)} → ${ir(EZ['Battery free'].irr)} ข้อสรุปไม่เปลี่ยน</li></ul>`)}</div>
${tbl(['จุด', 'ไฟล์ กฟผ.', 'สูตรเรา', 'เหตุผล'], [
  ['วันใช้งาน', '360', '<b class="pk">250</b>', 'Peak มีแค่วันธรรมดา'],
  ['ไฟที่หาย', 'ไม่คิด', '<b class="pk">15%</b>', 'NREL'],
  ['Demand charge', '196.26 × 400 kW ปีละครั้ง', '<b class="pk">ตามมิเตอร์ × 250 kW × 50% × 12 เดือน</b>', 'เก็บรายเดือน อัตราตรงกับมิเตอร์'],
  ['ผลประหยัดซ้ำ', 'นับ 2 ครั้ง', '<b class="pk">นับครั้งเดียว</b>', 'ไฟ 1 หน่วยประหยัดได้ครั้งเดียว'],
  ['ค่าไฟชาร์จ', 'ไม่คิด', '<b class="pk">คิดถ้าชาร์จจากกริด</b>', 'ลูกค้าที่ไม่มีโซลาร์ต้องชาร์จจากกริด'],
  ['แบตเสื่อม', 'ไม่คิด', '<b class="pk">2.5%/ปี</b>', 'ผู้ขายไทย'],
  ['ส่วนแบ่งลูกค้า', 'ไม่มี', '<b class="pk">15%</b>', 'ลูกค้าต้องได้ประโยชน์'],
])}</div>
${say('สไลด์นี้ตอบคำถามวิจัยข้อ 1 คือใช้ไฟล์ กฟผ. เป็นฐาน แล้วปรับ 7 จุดด้านเทคนิคและเงื่อนไขสัญญาที่มีแหล่งอ้างอิงรองรับ และใช้ราคาตลาดแทนต้นทุนในไฟล์')}`));

// 22 metrics
slides.push(slide(5, 'ตัวชี้วัดและเกณฑ์ตัดสินใจ', `<div class="g2">${tbl(['ตัวชี้วัด', 'ความหมาย'], [
  ['<b>NPV</b>', 'กำไรตลอดโครงการ คิดเป็นมูลค่าวันนี้ที่อัตราคิดลด 8%'], ['<b>IRR</b>', 'ผลตอบแทนต่อปีของโครงการ'], ['<b>ระยะคืนทุน</b>', 'กี่ปีถึงได้เงินลงทุนคืน'], ['<b>ระยะคืนทุนแบบคิดลด</b>', 'กี่ปีถึงได้เงินคืน เมื่อคิดมูลค่าเงินตามเวลา'],
  ['<b>โอกาสตัดสินใจผิด</b> <span class="tag o">ใหม่</span>', '% ของการจำลองที่ผลจริงอยู่คนละฝั่งกับผลที่ประเมิน'],
])}
<div class="stack"><div class="crit">เกณฑ์ตัดสิน: คุ้มเมื่อ <b>NPV &gt; 0</b> (หรือ <b>IRR &gt; 8%</b>)</div>
${card('<ul class="chk"><li><b>อัตราคิดลด 8%:</b> ตามไฟล์ กฟผ. และงานวิจัย RMUTL</li><li><b>คิดก่อนภาษีและไม่รวมเงินกู้:</b> เหมือนไฟล์ กฟผ. เพื่อวัดความคุ้มของตัวโครงการ</li><li><b>แพลตฟอร์ม:</b> ใส่อัตราภาษีและเงินกู้ได้ หากกู้จะแสดง NPV และ IRR ส่วนทุนเพิ่ม</li></ul>')}
${guard('ทำไม 8% · ทำไมไม่คิดภาษี', 'กฟผ. ไม่เสียภาษีเงินได้นิติบุคคล (นำส่งรายได้แผ่นดินแทน) จึงใช้ 0 หากต้องการเทียบกับเอกชน ใส่ 20% ในแพลตฟอร์มได้')}</div></div>`));

// 23 scenarios
const L = { min: { cost: 32, yld: 1250, use: '75%', om: '2.5%', esc: '0.2%', bp: 15000, rel: '30%', bd: '3%', bom: '2%', bl: 10 }, mid: { cost: 25, yld: 1400, use: '85%', om: '2%', esc: '0.5%', bp: 13500, rel: '50%', bd: '2.5%', bom: '1.5%', bl: 10 }, max: { cost: 18, yld: 1475, use: '90%', om: '1.5%', esc: '0.6%', bp: 8630, rel: '80%', bd: '2%', bom: '1%', bl: 15 } };
const row = (lab, k, f = x => x) => [lab, `<b class="neg">${f(L.min[k])}</b>`, `<b>${f(L.mid[k])}</b>`, `<b class="pos">${f(L.max[k])}</b>`];
slides.push(slide(5, 'ออกแบบสถานการณ์แย่ที่สุดและดีที่สุด', `<div class="g2 w35"><div class="stack">${card('<h3>กำหนด 3 สถานการณ์</h3><p>min / ค่ากลาง / max ของตัวแปรสำคัญ</p>')}${card('<h3>ทุกตัวแปรอยู่ฝั่งแย่หรือฝั่งดีพร้อมกัน</h3><p>จึงเห็นขอบเขตจริงของผลลัพธ์</p>')}${card('<h3>ช่วงทุกค่ามาจากแหล่งอ้างอิง</h3><p>ใช้ช่วงของทุกแหล่งเป็น min/max (รายละเอียดในสไลด์สำรอง B1)</p>')}</div>
${tbl(['ตัวแปร', 'min (แย่)', 'ค่ากลาง', 'max (ดี)'], [row('ต้นทุนโซลาร์ (บาท/W)', 'cost'), row('ไฟที่ผลิตได้ (kWh/kWp)', 'yld', th), row('ไฟที่ลูกค้า A ใช้ได้', 'use'), row('ค่าบำรุงรักษาโซลาร์', 'om'), row('ค่าไฟขึ้นต่อปี', 'esc'), row('ราคาแบต (บาท/kWh)', 'bp', th), row('Demand ที่ลดได้', 'rel'), row('แบตเสื่อมต่อปี', 'bd'), row('ค่าบำรุงรักษาแบต', 'bom'), row('อายุแบต (Battery อย่างเดียว)', 'bl', x => x + ' ปี')], 'num')}</div>
${say('ลูกค้า B ใช้ไฟกลางวัน 1,400 kWh คงที่ สัดส่วนที่ใช้ได้จึงเปลี่ยนตามไฟที่ผลิตได้')}`));

// 24 formula correct
const fmin = EM['file as is (min)'], fmax = EM['file as is (max)'];
slides.push(slide(6, 'สูตรคำนวณถูกต้อง', `<div class="g2 w60"><div class="stack"><div class="crit">เทียบกับไฟล์ BESS ของ กฟผ.: <b>NPV และ IRR ตรงทุกหลัก</b></div>
${tbl(['กรณีในไฟล์ กฟผ.', 'NPV', 'IRR', 'ระยะคืนทุน*'], [['ต้นทุนต่ำ', `<b class="pos">${th(fmin.npv, 2)} บาท</b>`, `<b>${(fmin.irr * 100).toFixed(2)}%</b>`, `${fmin.payback.toFixed(2)} ปี`], ['ต้นทุนสูง', `<b class="pos">${th(fmax.npv, 2)} บาท</b>`, `<b>${(fmax.irr * 100).toFixed(2)}%</b>`, `${fmax.payback.toFixed(2)} ปี`]], 'num')}
<p class="fn">* คำนวณจากกระแสเงินสดในไฟล์</p>
<div class="banner">ตรวจกับ Excel จริง 117 กรณี ตรงทุกค่า ✓</div></div>
<div class="stack">${card(`${ok}<p>ไฟล์แสดงระยะคืนทุน 4.57 / 7.12 ปี เป็นตัวเลขที่พิมพ์ใส่ ไม่ได้คำนวณจากกระแสเงินสดของไฟล์เอง</p>`)}${card(`${ok}<p><b>ตรวจกับ Excel จริง:</b> ให้ Microsoft Excel คำนวณ 117 กรณี (ครบทุกการจับคู่ตัวเลือก 60 แบบ) เทียบกับแพลตฟอร์ม ตรงทุกค่า ต่างกันไม่เกิน 0.00000001 บาท</p>`)}${card(`${ok}<p><b>ตรวจทานซ้ำ:</b> cross-check รอบ 2 แยกอีกชุด ได้ตัวเลขตรงกันทุกตัว</p>`)}</div></div>
${guard('ทำไมไม่ตรงกับ 4.57 ในไฟล์', `ช่อง B9 ของชีต Summary เป็นค่าคงที่ ไม่ใช่สูตร ให้ดูคอลัมน์สะสมในชีต Cash Flow ของไฟล์เอง ซึ่งให้ระยะคืนทุน ${fmin.payback.toFixed(2)} และ ${fmax.payback.toFixed(2)} ปี`)}`));

// 25 reasonable vs market
slides.push(slide(6, 'ผลลัพธ์สมเหตุสมผลเมื่อเทียบกับตลาดและงานวิจัย', `<div class="g2 w65">${tbl(['เทียบกับ', 'ผลของเรา', 'สอดคล้องไหม'], [
  ['โซลาร์ที่ลูกค้าซื้อเองคืนทุน 4.2–5.8 ปี (CapSolar)', `กฟผ. ลงทุนคืนทุน <b class="pk">${base.pb.toFixed(1)} ปี</b>`, `${ok} ยาวกว่าเพราะ กฟผ. ได้แค่ 85% ของค่าไฟ`],
  ['แบตอย่างเดียวยังไม่คุ้มสำหรับโรงงานส่วนใหญ่ปี 2026 (CapSolar)', '<b class="neg">Battery ติดลบ</b>', `${ok} สอดคล้อง`],
  ['แบตจะคุ้มราวปี 2030 ที่ 2,880 บาท/kWh (RMUTL)', `ต้องเหลือ <b class="pk">${r50(B['Battery grid TOU'])}–${r50(B['Battery free TOU (baht/kWh)'])} บาท/kWh</b>`, `${ok} สอดคล้อง`],
  ['ทีม กฟผ. ให้ IRR แบตไว้ 6–9%', `ใช้สมมติฐานของทีม ได้ราว <b class="pos">${ir(EM['team figures, no double count'].irr)}</b>`, `${ok} ต่างกันที่สมมติฐาน ไม่ใช่สูตร`],
])}
${card(`<div class="ct">สรุป: ทำไมจึงเชื่อสูตรนี้</div><ul class="chk"><li>ผลสอดคล้องกับข้อมูลตลาดและงานวิจัยที่มีอยู่</li><li>เหตุผลของความแตกต่างอธิบายได้ตามเงื่อนไขของ กฟผ.</li><li>จึงมั่นใจได้ว่าสูตรมีความถูกต้องและสมเหตุสมผล</li></ul>`)}</div>`));

// 26 case 1 solar
const c1 = C['1 Solar A 15y'], c2 = C['1-20 Solar A 20y'], c3 = C['1B Solar B'], c4 = C['N1 Solar A 15y normal'];
const pbTxt = x => `${x.mid.pb == null ? 'ไม่คืนทุน' : x.mid.pb.toFixed(1)} / ${x.mid.dpb == null ? 'ไม่คืนทุน' : x.mid.dpb.toFixed(1)}`;
slides.push(slide(7, 'กรณีศึกษาที่ 1: Solar PPA', `<div class="kpis">${[['ลูกค้า A ใช้มิเตอร์ TOU', ''], ['โซลาร์ 500 kWp', ''], ['เงินลงทุน', `${(c1.mid.inv / 1e6).toFixed(1)} ล้านบาท`]].map(([a, b]) => `<span>${a} <b class="pk">${b}</b></span>`).join('')}</div>
<div class="g2 w55 mt">${tbl(['กรณี', 'IRR', 'NPV ค่ากลาง (min / max) ล้านบาท', 'คืนทุน / คืนทุนคิดลด (ปี)'], [
  ['สัญญา 15 ปี', `<b class="pos">${ir(c1.mid.irr)}</b>`, `<b class="${cls(c1.mid.npv)}">${mb(c1.mid.npv)}</b> (${mb(c1.min.npv)} / ${mb(c1.max.npv)})`, pbTxt(c1)],
  ['สัญญา 20 ปี', `<b class="pos">${ir(c2.mid.irr)}</b>`, `<b class="${cls(c2.mid.npv)}">${mb(c2.mid.npv)}</b> (${mb(c2.min.npv)} / ${mb(c2.max.npv)})`, pbTxt(c2)],
  ['ถ้าเป็นลูกค้า B', `<b class="neg">${ir(c3.mid.irr)}</b>`, `<b class="${cls(c3.mid.npv)}">${mb(c3.mid.npv)}</b> (${mb(c3.min.npv)} / ${mb(c3.max.npv)})`, pbTxt(c3)],
  ['ถ้าใช้มิเตอร์ธรรมดา', `<b class="neg">${ir(c4.mid.irr)}</b>`, `<b class="${cls(c4.mid.npv)}">${mb(c4.mid.npv)}</b> (${mb(c4.min.npv)} / ${mb(c4.max.npv)})`, pbTxt(c4)],
], 'num')}
${card(`<div class="ct">NPV (ล้านบาท) · แท่ง = ค่ากลาง · เส้น = min–max</div>${rangeChart([['15 ปี', c1.mid.npv, c1.min.npv, c1.max.npv], ['20 ปี', c2.mid.npv, c2.min.npv, c2.max.npv], ['ลูกค้า B', c3.mid.npv, c3.min.npv, c3.max.npv], ['มิเตอร์ธรรมดา', c4.mid.npv, c4.min.npv, c4.max.npv]])}`)}</div>
${say('คุ้มเมื่อลูกค้าใช้ไฟโซลาร์ได้เกือบหมดและใช้มิเตอร์ TOU ช่วง min–max กว้างเพราะประเมินกับทุกตัวแปรพร้อมกัน จึงต้องมีแพลตฟอร์ม')}`));

// 27 case 2 S+B
const sbA = C['3A Solar+Battery A'], sbB = C['3B Solar+Battery B'];
slides.push(slide(7, 'กรณีศึกษาที่ 2: Solar + Battery', `<div class="kpis"><span>โซลาร์ 500 kWp + แบต 500 kWh</span><span>เงินลงทุน <b class="pk">${(sbA.mid.inv / 1e6).toFixed(2)} ล้านบาท</b></span></div>
${tbl(['ลูกค้า', 'Solar PPA อย่างเดียว', 'Solar + Battery', 'ผลของการเพิ่มแบต'], [
  ['<b>B</b> (มีไฟเหลือในวันทำงาน)', `NPV <b class="neg">${mb(c3.mid.npv)}</b>`, `NPV <b class="neg">${mb(sbB.mid.npv)}</b> (IRR ${ir(sbB.mid.irr)})`, `<span class="tag o">NPV ลดลง ${((c3.mid.npv - sbB.mid.npv) / 1e6).toFixed(2)} ล้าน</span>`],
  ['<b>A</b>', `NPV <b class="pos">${mb(c1.mid.npv)}</b>`, `NPV <b class="neg">${mb(sbA.mid.npv)}</b> (IRR ${ir(sbA.mid.irr)})`, `<span class="tag o">NPV ลดลง ${((c1.mid.npv - sbA.mid.npv) / 1e6).toFixed(2)} ล้าน</span>`],
], 'num big3')}
<div class="g2 mt">${card(`<div class="ct">ช่วง min / max</div><p class="mid">ลูกค้า A ${mb(sbA.min.npv)} / ${mb(sbA.max.npv)} ล้าน</p><p class="mid">ลูกค้า B ${mb(sbB.min.npv)} / ${mb(sbB.max.npv)} ล้าน</p>`)}
${card(`<div class="ct">จุดคุ้มทุน</div><p>แบตต้องถูกลงเหลือ <b class="pk">~${r50(B['SB battery A (no worse than solar only)'])}–${r50(B['SB battery B'])} บาท/kWh</b> ถึงจะไม่ทำให้ NPV ลดลง (ราคาวันนี้ 12,000–15,000)</p>`)}</div>`));

// 28 case 3 battery
const bf = C['4 Battery free charge'], bg = C['5 Battery grid'];
slides.push(slide(7, 'กรณีศึกษาที่ 3: Battery', `<div class="kpis"><span>แบต 500 kWh / 250 kW</span><span>เงินลงทุน <b class="pk">${(bf.mid.inv / 1e6).toFixed(2)} ล้านบาท</b></span></div>
<div class="g2 w55 mt">${tbl(['ลูกค้า', 'IRR', 'NPV ค่ากลาง (min / max) ล้านบาท'], [
  ['มีโซลาร์และไฟเหลือ (ชาร์จฟรี)', `<b class="neg">${ir(bf.mid.irr)}</b>`, `<b class="neg">${mb(bf.mid.npv)}</b> (${mb(bf.min.npv)} / ${mb(bf.max.npv)})`],
  ['ไม่มีโซลาร์ (ชาร์จจากกริด)', `<b class="neg">${ir(bg.mid.irr)}</b>`, `<b class="neg">${mb(bg.mid.npv)}</b> (${mb(bg.min.npv)} / ${mb(bg.max.npv)})`],
], 'num')}
<div class="stack">${card(`<div class="ct">ไม่มีตัวแปรไหนเปลี่ยนตัวเดียวแล้วทำให้คุ้ม</div><ul class="li x"><li>ลด Demand ได้ 80% → <b class="neg">${ir(BS['Demand 80%'].irr)}</b></li><li>กฟผ. ได้ผลประหยัด 100% → <b class="neg">${ir(BS['EGAT share 100%'].irr)}</b></li><li>อายุแบต 15 ปี → <b class="neg">${ir(BS['life 15'].irr)}</b></li></ul>`)}
${card(`<div class="ct">จุดคุ้มทุน</div><p>แบต <b class="pk">~${r50(B['Battery free TOU (baht/kWh)'])} บาท/kWh</b> (ชาร์จฟรี)<br>แบต <b class="pk">~${r50(B['Battery grid TOU'])} บาท/kWh</b> (ชาร์จจากกริด)</p>`)}</div></div>`));

// 29 tornado (fixed)
const tr = [['ประเภทมิเตอร์ TOU → ธรรมดา', T['meter TOU→normal']], ['ไฟที่ลูกค้าใช้ได้ 85% → 75%', T['use 85→75']], ['ต้นทุนติดตั้ง 25 → 28 บาท/W', T['cost 25→28']], ['อัตราคิดลด 8% → 10%', T['rate 8→10']], ['ไฟที่ผลิตได้ 1,400 → 1,300', T['yld 1400→1300']], ['อายุสัญญา 15 → 20 ปี', T['term 15→20']]].map(([l, r]) => [l, r.npv - base.npv, r.npv]);
slides.push(slide(7, 'ตัวแปรที่ชี้ขาดความคุ้มค่า (Tornado Chart)', `<div class="kpis"><span>ฐาน: Solar PPA ลูกค้า A · NPV <b class="pos">${mb(base.npv)} ล้านบาท</b></span><span>แท่ง = NPV เปลี่ยนไปเท่าไรจากฐาน (ล้านบาท)</span></div>
${card(tornado(tr), 'mt')}
${say('แพลตฟอร์มจึงต้องได้ข้อมูลให้แม่นที่สุด ได้แก่ การใช้ไฟของลูกค้า มิเตอร์ ต้นทุนติดตั้ง และราคาแบต ส่วนต่อไปจะวัดว่าเก็บข้อมูลเหล่านี้จากลูกค้าได้แม่นแค่ไหน')}`));

// 30 break-even
slides.push(slide(7, 'ราคาที่ทำให้คุ้มพอดี (Break-even Price)', tbl(['กรณี', 'ราคาสูงสุดที่ยังคุ้ม', 'ราคาวันนี้', 'ข้อสรุป'], [
  ['Solar PPA ลูกค้า A, TOU, 15 ปี', `โซลาร์ <b class="pk">${B['Solar A TOU 15y (baht/W)'].toFixed(1)} บาท/W</b>`, '18–32 บาท/W', `${ok} ทำได้`],
  ['Solar PPA ลูกค้า A, TOU, 20 ปี', `โซลาร์ <b class="pk">${B['Solar A TOU 20y'].toFixed(1)} บาท/W</b>`, '18–32 บาท/W', `${ok} ทำได้เกือบทุกแหล่ง`],
  ['Solar PPA ลูกค้า A, มิเตอร์ธรรมดา, 15 ปี', `โซลาร์ <b class="pk">${B['Solar A normal 15y'].toFixed(1)} บาท/W</b>`, '18–32 บาท/W', `${ok} ต้องได้ราคาระบบใหญ่`],
  ['Solar PPA ลูกค้า B, TOU', `โซลาร์ <b class="pk">${B['Solar B TOU 15y'].toFixed(1)} บาท/W</b>`, '18–32 บาท/W', `${warn} ทำได้ยาก`],
  ['Battery (ชาร์จฟรี / ชาร์จจากกริด)', `แบต <b class="pk">~${r50(B['Battery free TOU (baht/kWh)'])} / ~${r50(B['Battery grid TOU'])} บาท/kWh</b>`, '12,000–15,000 บาท/kWh', `${no} ยังไม่คุ้ม`],
  ['แบตที่เพิ่มใน Solar + Battery', `แบต <b class="pk">~${r50(B['SB battery A (no worse than solar only)'])}–${r50(B['SB battery B'])} บาท/kWh</b>`, '12,000–15,000 บาท/kWh', `${no} ยังไม่คุ้ม`],
], 'big3')));

// ---------- section 8: customer data accuracy ----------
const Qs = [[1, 'ธุรกิจและจำนวนโรงงาน', 'cf'], [2, 'หน่วยไฟต่อเดือน/ปี', 'cf'], [3, 'ค่าไฟเฉลี่ยต่อเดือน', 'cf'], [4, 'วันทำงานและช่วงเวลา', 'in'], [5, 'ช่วงที่ใช้ไฟสูงสุด', 'in'], [6, 'สาเหตุของช่วงพีค', 'in'], [7, 'การใช้ไฟวันหยุด', 'in'], [8, 'แนวโน้มการใช้ไฟ', 'fl'], [9, 'มี Solar อยู่แล้วไหม', 'in'], [10, 'ขนาด Solar เดิม / ใช้เองหมดไหม', 'in'], [11, 'เคยพิจารณา Solar PPA', 'ld'], [12, 'ปัญหา Peak / Demand charge', 'ld'], [13, 'สนใจระบบลด Peak', 'ld'], [14, 'เป้าหมายพลังงาน', 'ld'], [15, 'แผนขยายโรงงาน', 'fl'], [16, 'ข้อจำกัดการติดตั้ง', 'fl']];
const QT = { in: ['เข้าสูตร', 'm'], cf: ['ตรวจกับบิล', 'b'], fl: ['ธงเตือน', 'o'], ld: ['จัดลำดับลูกค้า', 'g'] };
slides.push(slide(8, 'ข้อมูลที่เก็บจากลูกค้า: บิลค่าไฟ + คำถาม 16 ข้อ', `<div class="g2 w30"><div class="stack">${card(`<div class="ct">จากบิลค่าไฟฉบับเต็ม</div><ul class="chk"><li>ประเภทอัตรา / ชนิดมิเตอร์</li><li>หน่วย On-Peak / Off-Peak</li><li>Peak demand (kW)</li><li>ค่า Ft และรอบเดือน</li><li>ที่อยู่ → ไฟที่ผลิตได้ (PVGIS)</li><li>หมายเลขผู้ใช้ไฟ → ขอไฟล์ 15 นาที</li></ul>`)}
<div class="legend col">${Object.values(QT).map(([l, c]) => `<span><i class="tag ${c}">${l}</i></span>`).join('')}</div></div>
<div class="qgrid">${Qs.map(([i, t, k]) => `<div class="qq ${k}"><b>${i}</b><span>${t}</span><i class="tag ${QT[k][1]}">${QT[k][0]}</i></div>`).join('')}</div></div>
${say('ใน 16 ข้อ มี 6 ข้อที่เข้าสูตรจริง (4, 5, 6, 7, 9, 10) ข้อ 1–3 ใช้ตรวจว่าตรงกับบิล ข้อ 8, 15, 16 เป็นธงเตือน และข้อ 11–14 ใช้จัดลำดับลูกค้า')}`));

// persona
const kt = sc('solar150', 'S1'), ktN = sc('solar150', 'S3');
slides.push(slide(8, 'Persona: คุณต้น ผู้ตัดสินใจด้านพลังงาน โรงงานสิ่งทอ', `<div class="g3 persona">
${card(`<div class="avatar">ต</div><blockquote>“เราอยากลดค่าไฟ โดยไม่ต้องลงทุนระบบพลังงานเอง”</blockquote>
<div class="ct">Customer Background</div>${tbl(['', ''], [['ธุรกิจ', 'โรงงานสิ่งทอ 1 แห่ง'], ['การใช้ไฟ', '65,000 kWh/เดือน'], ['ค่าไฟ', '300,000 บาท/เดือน (≈ 4.62 บาท/หน่วย รวม VAT)'], ['วันทำงาน', '6 วัน/สัปดาห์ · 2 กะ (07–18, 19–06)'], ['ใช้ไฟสูงสุด', '09:00'], ['Solar ปัจจุบัน', 'ไม่มี'], ['มิเตอร์', `<b class="neg">ยังไม่ทราบ ต้องดูจากบิล</b>`]], 'kv')}`)}
${card(`<div class="ct">Pain Points</div><ul class="li"><li>ค่าไฟเป็นต้นทุนหลัก</li><li>มีช่วงที่ Peak / Demand charge สูง</li><li>ไม่รู้ว่าควรเลือก Solar / Battery / Solar + Battery</li><li>ไม่ต้องการลงทุนระบบเอง</li></ul><div class="ct mt">Decision Criteria</div><ul class="li"><li>ความคุ้มค่าในการลดค่าไฟ</li><li>ระยะเวลาคืนทุน</li><li>ผลกระทบต่อ Peak / Demand charge</li><li>ความเหมาะสมกับการใช้งานของโรงงาน</li></ul>`)}
${card(`<div class="ct">แพลตฟอร์มตอบคุณต้นว่าอะไร</div><div class="res2"><small>Solar PPA 150 kWp · มิเตอร์ TOU</small><b class="pos">IRR ${ir(kt.est.irr)} · NPV ${mb(kt.est.npv)} ล้าน</b></div><div class="res2"><small>Solar PPA 150 kWp · มิเตอร์ธรรมดา</small><b class="neg">IRR ${ir(ktN.est.irr)} · NPV ${mb(ktN.est.npv)} ล้าน</b></div><div class="res2"><small>Battery / Solar + Battery</small><b class="neg">ไม่คุ้ม: ไม่มีไฟโซลาร์เหลือ แบตต้องชาร์จจากกริด</b></div><p class="mt"><b class="pk">ชนิดมิเตอร์พลิกคำตอบได้</b> และถึงเป็น TOU ยังมีโอกาสผิด ${pc(kt.wrong, 0)} ถ้ามีแค่บิล + คำถาม (สไลด์ถัดไป)</p>`)}</div>`));

// accuracy 1
const P4 = [['☀ Solar PPA', 'solar500'], ['◈ Solar + Battery', 'hybrid'], ['ϟ Battery', 'battery']];
slides.push(slide(8, 'มีแค่บิล TOU + คำถาม 16 ข้อ ผลแม่นแค่ไหน', `<div class="g2 w60">${tbl(['ผลิตภัณฑ์', 'IRR ที่ประเมิน', 'IRR จริงน่าจะอยู่ (80%)', 'คลาดเคลื่อน', 'โอกาสตัดสินใจผิด'], P4.map(([l, k]) => { const r = sc(k, 'S1'); return [l, `<b class="${cls(r.est.npv)}">${ir(r.est.irr)}</b>`, `${ir(r.irr10)} – ${ir(r.irr90)}`, `±${half(r)} จุด`, `<b class="${r.wrong > 0.1 ? 'neg' : 'pos'} xl">${pc(r.wrong)}</b>`]; }), 'num')}
<div class="stack">${card(`<div class="ct pos">ตัดสินได้ทันที</div><p><b>Battery และ Solar + Battery</b> ผิด 0% เพราะผลอยู่ห่างเกณฑ์ 8% มาก แม้ข้อมูลคลาดสุดทางก็ยังติดลบ</p>`)}
${card(`<div class="ct neg">ยังตัดสินไม่ได้</div><p><b>Solar PPA</b> IRR อยู่ใกล้เกณฑ์ (9.6%) แต่ข้อมูลคลาดได้ ±2 จุด จึงมีโอกาสผิด ${pc(sc('solar500', 'S1').wrong, 0)}</p>`)}</div></div>
<div class="method">วิธีวัด: Monte Carlo 2,000 รอบ ด้วย engine เดียวกับแพลตฟอร์ม · สุ่มค่าที่ยังไม่รู้แน่ (สัดส่วนไฟที่ใช้ได้ ±8%, ราคาติดตั้ง ±15%, ไฟที่ผลิตได้ ±5%, O&amp;M ±20%, ราคาแบต ±15%, Demand ที่ลดได้ ±40%) · “ตัดสินใจผิด” = % ของรอบที่ NPV จริงอยู่คนละฝั่งกับที่ประเมิน</div>`));

// accuracy 2: ladder
const lad = [['S6', 'บิลไม่ครบ (ไม่เห็นประเภทอัตรา) + คำถาม'], ['S4', 'บิล TOU อย่างเดียว ไม่ได้ถาม'], ['S5', 'บิลธรรมดาไม่แยกหน่วย อย่างเดียว'], ['S1', 'บิล TOU + คำถาม 16 ข้อ'], ['S3', 'บิลธรรมดาไม่แยกหน่วย + คำถาม'], ['S2', 'บิลธรรมดาที่แยกหน่วย P/OP + คำถาม'], ['S7', 'บิล TOU + คำถาม + ใบเสนอราคา'], ['S8', '+ ไฟล์ 15 นาที (ครบ)']];
slides.push(slide(8, 'บิลแต่ละแบบ และข้อมูลที่เพิ่ม ลดโอกาสผิดได้เท่าไร', `<div class="g2 w60">${card(`<div class="ct">โอกาสตัดสินใจผิด · Solar PPA (ลูกค้า A)</div>${hbars(lad.map(([id, l]) => { const r = sc('solar500', id); return [l, r.wrong, r.wrong > 0.2 ? 'var(--orange)' : r.wrong > 0.05 ? '#e9c39a' : 'var(--mint)', `IRR ±${half(r)}`]; }), { max: 0.6, fmt: v => pc(v) })}`)}
<div class="stack">${card(`<div class="ct">อ่านอย่างไร</div><ul class="li"><li><b class="neg">บิลไม่เห็นประเภทอัตรา</b> แย่ที่สุด (${pc(sc('solar500', 'S6').wrong, 0)}) เพราะ TOU กับอัตราปกติให้ผลต่างกันจนพลิกคำตอบ</li><li><b>คำถาม 16 ข้อ</b> ลดโอกาสผิดจาก ${pc(sc('solar500', 'S4').wrong, 0)} เหลือ ${pc(sc('solar500', 'S1').wrong, 0)}</li><li><b class="pos">ใบเสนอราคา</b> ลดเหลือ ${pc(sc('solar500', 'S7').wrong)} โดยไม่ต้องรบกวนลูกค้า</li><li><b class="pos">ไฟล์ 15 นาที</b> ลดเหลือ ${pc(sc('solar500', 'S8').wrong)}</li></ul>`)}
${card(`<p class="fn">บิลอัตราปกติให้ IRR ต่ำกว่า TOU (${ir(sc('solar500', 'S3').est.irr)} เทียบ ${ir(base.irr)}) เพราะโครงสร้างค่าไฟ ไม่ใช่ความคลาดเคลื่อน · บิลอัตราปกติที่แยกหน่วย P/OP แม่นเกือบเท่าบิล TOU</p>`)}</div></div>`));

// accuracy 3: weights
const sw = MC.shapley.solar500.items, bw = MC.shapley.battery.items;
const nm = { B1: 'บิล: ประเภทอัตรา / มิเตอร์', B2: 'บิล: หน่วย On/Off-Peak', B3: 'บิล: ที่อยู่ → PVGIS', Q47: 'คำถามข้อ 4, 7', Q56: 'คำถามข้อ 5, 6', Q910: 'คำถามข้อ 9, 10', QS: 'ใบเสนอราคาโซลาร์', QB: 'ใบเสนอราคาแบต', F15: 'ไฟล์ 15 นาที' };
const col = id => id.startsWith('B') && id !== 'B1' || id === 'B1' ? 'var(--blue)' : id.startsWith('Q') && id.length > 2 && id !== 'QS' && id !== 'QB' ? 'var(--mint)' : 'var(--orange)';
slides.push(slide(8, 'ข้อมูลชิ้นไหนสำคัญที่สุด', `<div class="g2">${card(`<div class="ct">☀ Solar PPA · น้ำหนักต่อความแม่นยำ</div>${hbars(sw.map(i => [nm[i.id], i.share, col(i.id)]), { max: 0.45, fmt: v => pc(v) })}`)}
<div class="stack">${card(`<div class="ct">ϟ Battery · น้ำหนักต่อความแม่นยำ</div>${hbars(bw.map(i => [nm[i.id], i.share, col(i.id)]), { max: 0.7, fmt: v => pc(v) })}`)}
<div class="legend"><span><i style="background:var(--blue)"></i>จากบิล</span><span><i style="background:var(--mint)"></i>จากคำถาม</span><span><i style="background:var(--orange)"></i>ขอเพิ่ม</span></div>
${card(`<ul class="li"><li><b>ข้อ 9–10 "มีโซลาร์อยู่แล้วไหม"</b> สำคัญที่สุดสำหรับ Solar ถ้าไม่ถาม อาจประเมินไฟที่ใช้ได้สูงเกินจริงมาก (น้ำหนัก 25–59% ตามสมมติฐานว่ามีกี่ % ของโรงงานที่มีโซลาร์อยู่แล้ว)</li><li><b>Battery</b> ขึ้นกับราคาแบตเป็นหลัก ใบเสนอราคาแบตสำคัญที่สุด</li></ul>`)}</div></div>
<div class="method">น้ำหนักคิดแบบ Shapley value: จำลองทุกชุดข้อมูลที่เป็นไปได้ (128 ชุดสำหรับ Solar) แล้วเฉลี่ยว่าข้อมูลแต่ละชิ้นลดความแปรปรวนของ NPV ได้เท่าไร จึงไม่นับซ้ำเมื่อข้อมูลสองชิ้นช่วยเรื่องเดียวกัน · รวมกัน 100%</div>`));

// ---------- section 9 ----------
slides.push(slide(9, 'คำตอบของคำถามวิจัย', tbl(['คำถาม', 'คำตอบ'], [
  ['<b>1 เทียบกับไฟล์ BESS</b>', 'ใช้โครงสร้างไฟล์ กฟผ. เป็นฐาน ปรับ 7 จุดด้านเทคนิคและเงื่อนไขสัญญาตามแหล่งอ้างอิง และใช้ราคาตลาดแทนต้นทุนในไฟล์'],
  ['<b>2 ปัจจัยในสูตร</b>', 'ต้นทุน, ค่าบำรุงรักษา, ค่าเปลี่ยนอุปกรณ์, ความเสื่อม, ไฟที่หาย, มิเตอร์, การใช้ไฟของลูกค้า, ส่วนแบ่ง, อายุสัญญา, มูลค่าซาก'],
  ['<b>3 กฟผ. ลงทุนแบตเอง</b>', `ราคาวันนี้ยังไม่คุ้ม จะคุ้มเมื่อแบต ≤ ~${r50(B['Battery free TOU (baht/kWh)'])} บาท/kWh และลูกค้ามีโซลาร์เหลือ`],
  ['<b>4 ลูกค้ากับผลิตภัณฑ์</b>', '<b>Solar PPA</b> → โรงงานที่ใช้ไฟกลางวันมาก + มิเตอร์ TOU · <b>Solar + Battery</b> → ลูกค้าที่มีไฟเหลือหรือใช้ไฟถึงค่ำ (เมื่อแบตถูกลง) · <b>Battery</b> → ลูกค้าที่มีโซลาร์และไฟเหลืออยู่แล้ว'],
  { cells: ['<b>5 ข้อมูลแค่ไหนถึงพอ</b> <span class="tag o">ใหม่</span>', `บิลฉบับเต็ม + คำถาม 6 ข้อ พอตัดสิน Battery และ Solar + Battery ได้ทันที · Solar PPA ต้องมีใบเสนอราคา (ผิด ${pc(sc('solar500', 'S1').wrong, 0)} → ${pc(sc('solar500', 'S7').wrong, 0)}) และไฟล์ 15 นาทีก่อนเซ็นสัญญา (→ ${pc(sc('solar500', 'S8').wrong)})`], hl: true },
], 'big3')));

slides.push(slide(9, 'ข้อจำกัดและวิธีจัดการ', tbl(['ข้อจำกัด', 'วิธีจัดการ'], [
  ['ลด Demand 50% ยังไม่มีแหล่งรองรับโดยตรง', `${ok} ทดสอบ 30–80% แล้วข้อสรุปไม่เปลี่ยน และจะยืนยันด้วยข้อมูลราย 15 นาที (แพลตฟอร์มคิดกฎค่า Demand ขั้นต่ำ 70% ให้เมื่อใส่ Peak demand สูงสุด 12 เดือน)`],
  ['ราคาแบตไทยมาจากผู้ขายรายเดียว', `${ok} เทียบกับราคาโลกของ BNEF`],
  ['สัดส่วน 85:15 อ้างอิงสัญญาในสหรัฐฯ', `${ok} ทดสอบ 100% แล้วข้อสรุปไม่เปลี่ยน`],
  ['ลูกค้าตัวอย่างใช้ค่าเฉลี่ยรายวัน', `${ok} แพลตฟอร์มใช้ข้อมูลจริงของลูกค้า`],
  { cells: ['ช่วงความคลาดเคลื่อนของข้อมูลลูกค้า (±%) เป็นสมมติฐานของทีม', `${ok} วัดผลด้วย Monte Carlo 2,000 รอบแล้ว · จะปรับช่วงเมื่อมีข้อมูลโรงงานจริง 10–20 แห่ง · แพลตฟอร์มให้เลือกระดับข้อมูลที่มีได้`], hl: true },
  ['ผลในสไลด์ยังไม่คิดภาษีและเงินกู้', `${ok} แพลตฟอร์มรองรับแล้ว ใส่ได้เมื่อ กฟผ. กำหนดโครงสร้าง`],
], 'big3')));

slides.push(slide(9, 'ข้อค้นพบสำคัญ', `<div class="finds">${[
  ['สูตรมาตรฐานแก้ pain point ได้', 'คิดทั้งเทคนิคและการเงินแบบ DCF ทำให้ตัวเลขแม่นและตรวจย้อนได้'],
  ['ความคุ้มขึ้นกับลูกค้าแต่ละราย', 'ผลิตภัณฑ์เดียวกันคุ้มหรือไม่คุ้มก็ได้ จึงต้องมีแพลตฟอร์ม'],
  ['รู้แล้วว่าตัวแปรไหนสำคัญ', 'การใช้ไฟของลูกค้า มิเตอร์ ต้นทุนติดตั้ง และราคาแบต'],
  ['รู้แล้วว่าต้องขอข้อมูลอะไรก่อน', `บิลฉบับเต็ม + คำถาม 6 ข้อ คัดกรองได้ · ใบเสนอราคาคือข้อมูลถัดไปที่คุ้มที่สุด (ผิด ${pc(sc('solar500', 'S1').wrong, 0)} → ${pc(sc('solar500', 'S7').wrong, 0)})`],
  ['ได้ทั้งหลักวิชาการและความเป็นจริงทางธุรกิจ', 'เพราะพัฒนาแบบวนซ้ำกับผู้เชี่ยวชาญ']].map(([h, p], i) => `<div class="fd${i === 3 ? ' new' : ''}"><b>${i + 1}</b><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
${say('สิ่งที่ได้ไม่ใช่แค่ซอฟต์แวร์ แต่คือวิธีคิดตั้งแต่ pain point ไปจนถึงเครื่องมือที่แก้ปัญหาได้จริง')}`));

slides.push(slide(9, 'ขั้นต่อไป', `<div class="flow">${[['1', 'ทีม กฟผ. ตรวจสูตรรอบ 3'], ['2', 'ใส่สูตรในแพลตฟอร์มแล้ว ตรวจกับ Excel 117 กรณี ตรงทุกค่า'], ['3', 'ทดสอบกับข้อมูลการใช้ไฟของลูกค้าจริง (บิล 12 เดือน และไฟล์ราย 15 นาที)'], ['4', 'ปรับสูตรและช่วงความคลาดเคลื่อนตามผลทดสอบ']].map(([i, t], k) => `${k ? '<span class="arr">→</span>' : ''}<div class="fl"><div class="st">${i}</div><p>${t}</p></div>`).join('')}</div>
<div class="g2 mt">${card(`<div class="ct">ลำดับเก็บข้อมูลลูกค้า</div><ol class="ol"><li><b>บิลฉบับเต็ม</b> ที่เห็นประเภทอัตรา หน่วยแยกช่วง และ Demand</li><li><b>ถามข้อ 9–10 และ 4, 7</b> ทุกราย</li><li><b>คัดกรอง:</b> Battery / Solar + Battery ที่ห่างเกณฑ์ ตัดสินได้เลย</li><li><b>Solar ที่ IRR อยู่ใน 8% ± 2 จุด:</b> ขอใบเสนอราคา</li><li><b>ยังใกล้เส้น:</b> ขอไฟล์ 15 นาทีก่อนเซ็นสัญญา</li></ol>`)}
${card(`<div class="ct">ขอข้อมูลจาก กฟผ.</div><ul class="li"><li>สมมติฐานที่ใช้คิด IRR แบต 6–9%</li><li>ตัวเลขการลด Demand ที่ทำได้จริง</li><li>อัตราคิดลดที่ กฟผ. ใช้</li><li>ค่าแรกเข้า ENZY ใช้กับทุกโครงการไหม</li><li>ราคาแบตชุดใหม่ที่ใช้ประเมินตอนเปลี่ยนแบต</li></ul>`)}</div>
${say('สูตรพร้อมและอยู่ในแพลตฟอร์มแล้ว ขั้นต่อไปคือทดสอบกับข้อมูลลูกค้าจริง เพื่อให้ กฟผ. ตอบลูกค้าได้เร็วและแม่น')}`));

// ---------- backup ----------
slides.push(slide('สไลด์สำรอง · B1', 'พารามิเตอร์ทั้งหมดและแหล่งอ้างอิง', `<div class="g2">${tbl(['ตัวแปร', 'ค่า', 'แหล่ง'], [
  ['ค่าไฟ TOU', 'Peak 4.1839 / Off-peak 2.6037 / Demand 132.93', 'กฟภ.'], ['ค่าไฟธรรมดา', '3.1471 / Demand 196.26', 'กฟภ.'], ['Ft', '0.1623 บาท/kWh', 'กกพ. (ก.ย.–ธ.ค. 2569)'], ['ค่าไฟขึ้น', '0.2–0.6%/ปี', 'ร่าง PDP2026'],
  ['ต้นทุนโซลาร์', '18–32 บาท/W', 'Saimai, กกพ., CapSolar'], ['ไฟที่ผลิตได้', '1,250–1,475 kWh/kWp', 'KMUTT, CapSolar, IJSIT'], ['แผงเสื่อม', '0.7%/ปี', 'NREL ATB 2024, Limmanee'], ['ใช้ไฟได้', '75–90% (ค่ากลาง 85%)', 'CapSolar (ตัวอย่างโรงงาน 90%)'], ['ส่วนลด PPA', '10–30%', 'กกพ., ALT']], 'sm')}
${tbl(['ตัวแปร', 'ค่า', 'แหล่ง'], [['อายุอินเวอร์เตอร์', '10–15 ปี', 'SolaX'], ['ราคาแบต', '12,000–15,000 (ไทย) · 3,390–9,230 (โลก)', 'CapSolar, BNEF'], ['ไฟที่หาย', '15%', 'NREL ATB 2025'], ['แบตเสื่อม', '2–3%/ปี', 'CapSolar'], ['ค่าบำรุงรักษาแบต', '1–2% (ไทย), 4% (สหรัฐฯ)', 'CapSolar, NREL'], ['อายุแบต', '10 ปี (รับประกัน), 15 ปี', 'CapSolar, NREL'], ['ขนาดแบต', '2 ชั่วโมง', 'Lazard, NREL'], ['กฎค่าไฟขั้นต่ำ', '70% ของ Demand สูงสุดใน 12 เดือน', 'กฟภ.'], ['ส่วนแบ่งผลประหยัด · อัตราคิดลด', '85:15 · 8%', 'Hawaii · ไฟล์ กฟผ., RMUTL']], 'sm')}</div>`, 'bk'));

const nrow = (l, k) => { const x = C[k]; return [l, `<b class="${cls(x.mid.npv)}">${ir(x.mid.irr)}</b>`, `<b class="${cls(x.mid.npv)}">${mb(x.mid.npv)}</b> (${mb(x.min.npv)} / ${mb(x.max.npv)})`]; };
slides.push(slide('สไลด์สำรอง · B2', 'ผลเมื่อลูกค้าใช้มิเตอร์แบบธรรมดา', `${tbl(['กรณี', 'IRR', 'NPV ค่ากลาง (min / max) ล้านบาท'], [nrow('Solar PPA ลูกค้า A 15 ปี', 'N1 Solar A 15y normal'), nrow('Solar PPA ลูกค้า A 20 ปี', 'N1-20 Solar A 20y normal'), nrow('Solar PPA ลูกค้า B', 'N1B Solar B normal'), nrow('ลูกค้า A มีแบตแล้ว + โซลาร์', 'N2 A battery + solar normal'), nrow('Solar + Battery ลูกค้า B', 'N3B Solar+Battery B normal'), nrow('Battery ชาร์จจากโซลาร์ลูกค้า', 'N4 Battery free normal'), nrow('Battery ชาร์จจากกริด', 'N5 Battery grid normal')], 'num')}
${guard('ถ้าลูกค้าไม่ยอมเปลี่ยนมิเตอร์', 'ต้องทำสัญญา 20 ปี หรือเปลี่ยนเป็นมิเตอร์ TOU ได้ ค่าติดตั้ง 4,050 บาท (กฟภ. 22–33 kV)')}`, 'bk'));

const s3 = (l, a, b, f) => [l, `${f[0]} → ${ir(T[a].irr)}, <b class="${cls(T[a].npv)}">${mb(T[a].npv)}</b>`, `${f[1]} → ${ir(T[b].irr)}, <b class="${cls(T[b].npv)}">${mb(T[b].npv)}</b>`];
slides.push(slide('สไลด์สำรอง · B3', 'ความอ่อนไหวของ Solar PPA ครบทุกตัวแปร', `${tbl(['ตัวแปร (ค่ากลาง)', 'ถ้าต่ำลง: IRR, NPV (ล้านบาท)', 'ถ้าสูงขึ้น: IRR, NPV (ล้านบาท)'], [
  s3('ใช้ไฟได้ (85%)', 'use 85→75', 'use 85→95', ['75%', '95%']), s3('ต้นทุน (25 บาท/W)', 'cost 25→22', 'cost 25→28', ['22', '28']), s3('ไฟที่ผลิต (1,400)', 'yld 1400→1300', 'yld 1400→1475', ['1,300', '1,475']), s3('ค่าบำรุงรักษา (2%)', 'om 2→1.5', 'om 2→2.5', ['1.5%', '2.5%']),
  [`อัตราคิดลด (8%)`, `6% → <b class="pos">${mb(T['rate 8→6'].npv)}</b>`, `10% → <b class="neg">${mb(T['rate 8→10'].npv)}</b>`], s3('ส่วนลด (15%)', 'disc 15→10', 'disc 15→20', ['10%', '20%']), s3('ค่าไฟขึ้น (0.5%)', 'esc 0.5→0.2', 'esc 0.5→0.6', ['0.2%', '0.6%']), s3('สัดส่วน Peak (0.71)', 'peak share 0.71→0.68', 'peak share 0.71→0.80', ['0.68', '0.80'])], 'num')}
<p class="fn">ฐาน: Solar PPA ลูกค้า A, TOU, 15 ปี · IRR ${ir(base.irr)} · NPV ${mb(base.npv)} ล้านบาท · อัตราคิดลดไม่เปลี่ยน IRR</p>`, 'bk'));

slides.push(slide('สไลด์สำรอง · B4', 'ทำไมผลแบตต่างจากตัวเลขของทีม กฟผ.', `<div class="g2">${card(`<ul class="chk"><li>ใช้สมมติฐานของทีม กฟผ. (แบต 10,000 บาท/kWh, ค่าบำรุงรักษา 1%) กับวิธีของไฟล์ กฟผ. ได้ IRR ราว <b class="pos">${ir(EM['team figures, no double count'].irr)}</b> ตรงกับที่บอก (6–9%)</li><li>ใช้ราคาและค่าบำรุงรักษาเท่ากันในสูตรเรา ได้ IRR <b class="neg">${ir(BS['team: 10,000 baht/kWh + O&M 1%'].irr)}</b> ผลต่างมาจากรายละเอียดทางเทคนิคและเงื่อนไขสัญญา 5 จุด</li><li>เมื่อใช้ราคาแบตตลาด (13,500 บาท/kWh, ค่าบำรุงรักษา 1.5%) ได้ <b class="neg">${ir(C['4 Battery free charge'].mid.irr)}</b></li></ul>`)}
<div class="stack">${card(`<ol class="ol"><li>วัน Peak 250 วัน (กฟภ.)</li><li>ไฟที่หาย 15% (NREL)</li><li>แบตเสื่อม 2.5%/ปี (CapSolar)</li><li>แบ่งผลประหยัดสุทธิให้ลูกค้า 15% (Hawaii)</li><li>ลด Demand ได้ 50% (กฎขั้นต่ำ 70% ของ กฟภ.)</li></ol>`)}
${card(`<ul class="li"><li><b>ประเด็นที่ตรงกัน:</b> IRR ของ Solar PPA สัญญา 15 ปีไม่เกิน 10% (ได้ ${ir(base.irr)})</li><li><b>ประเด็นที่ต่างกัน:</b> ชั่วโมงแดดงานวิจัยไทย 3.4–4.0 ชม./วัน (ต่ำกว่า 4–6 ชม.) และราคาแบตใหม่ในไทย 12,000–15,000 บาท/kWh (สูงกว่า 10,000)</li></ul>`)}
${guard('สิ่งที่อยากถามทีม กฟผ.', 'ตัวเลข 6–9% ใช้สมมติฐานไหน')}</div></div>`, 'bk'));

slides.push(slide('สไลด์สำรอง · B5', 'สมมติฐานที่ยังต้องยืนยัน และผลที่ทดสอบแล้ว', tbl(['สมมติฐาน', 'ช่วงที่ทดสอบ', 'ข้อสรุปเปลี่ยนไหม'], [
  ['ลด Demand 50%', '30–80%', `${ok} ไม่เปลี่ยน (Battery ดีที่สุด ${ir(BS['Demand 80%'].irr)})`],
  ['ส่วนแบ่ง 85:15', 'กฟผ. ได้ 100%', `${ok} ไม่เปลี่ยน (Battery ${ir(BS['EGAT share 100%'].irr)})`],
  ['ใช้ไฟได้ 85% (ลูกค้า A)', '75–95%', `${warn} Solar PPA ไม่คุ้มเมื่อต่ำกว่า ~${useBE}%`],
  ['สัดส่วน Peak 0.71', '0.68–0.80', `${ok} ไม่เปลี่ยน (NPV ${mb(T['peak share 0.71→0.68'].npv)} ถึง ${mb(T['peak share 0.71→0.80'].npv)})`],
  ['มูลค่าซากแบต 50%', '—', `${warn} คิดแบบเส้นตรง ราคาขายต่อจริงอาจต่ำกว่า`],
  ['วันหยุดราชการ 11 วัน', '19 วัน (ปฏิทิน 2570)', `${ok} ไม่เปลี่ยน (Solar PPA ลูกค้า A NPV ${mb(tz.npv)})`],
  ['ช่วงความคลาดเคลื่อนข้อมูลลูกค้า', 'โรงงานมีโซลาร์อยู่แล้ว 5–20%', `${ok} อันดับน้ำหนักข้อมูลไม่เปลี่ยน (B7)`],
], 'big3'), 'bk'));

slides.push(slide('สไลด์สำรอง · B6', 'แหล่งอ้างอิงทั้งหมด (สรุป)', `<div class="g2">${[['⚡', 'อัตราค่าไฟ', 'กฟภ. (TOU, ธรรมดา, Demand), Ft: กกพ. (ก.ย.–ธ.ค. 2569)'], ['▤', 'นโยบายและแนวโน้ม', 'ร่าง PDP2026, สนพ., กกพ.'], ['▮', 'เทคนิคและผลผลิต', 'จุฬาฯ, KMUTT, RMUTL, IJSIT, NREL ATB'], ['฿', 'ราคาและต้นทุน', 'Saimai Solar, CapSolar, BNEF, Lazard'], ['⇄', 'รูปแบบธุรกิจ', 'Tokyo Gas, Banpu NEXT, ALT, Hawaii State Energy Office'], ['⁂', 'วิธีวัดความคลาดเคลื่อน', 'Monte Carlo + Shapley value บน engine ของแพลตฟอร์ม (คำนวณซ้ำได้จากสคริปต์ในโปรเจกต์)']].map(([i, h, p]) => card(`<div class="ic sm">${i}</div><h3>${h}</h3><p>${p}</p>`, 'row')).join('')}</div>`, 'bk'));

// B7 method
slides.push(slide('สไลด์สำรอง · B7', 'วิธีวัดความคลาดเคลื่อน: ช่วง ± ตามข้อมูลที่มี', `<div class="g2 w55">${tbl(['ค่าที่ใช้คำนวณ', 'ไม่มีข้อมูล', 'มีข้อมูลบางส่วน', 'ข้อมูลดีที่สุด'], [
  ['สัดส่วนไฟที่ใช้ได้', '±25%', 'คำถาม 4, 7: ±15% · บิลแยกหน่วย: ±12% · ทั้งสอง: <b>±8%</b>', 'ไฟล์ 15 นาที: <b class="pos">±3%</b>'],
  ['ไฟที่ผลิตได้', 'รู้แค่จังหวัด ±10%', 'ที่อยู่ในบิล → PVGIS: <b>±5%</b>', 'สำรวจหน้างาน: <b class="pos">±3%</b>'],
  ['ราคาติดตั้งโซลาร์ / O&amp;M', 'ราคาตลาด ±15% / ±20%', '—', 'ใบเสนอราคา: <b class="pos">±5% / ±10%</b>'],
  ['ราคาแบต / ประสิทธิภาพ / O&amp;M แบต', 'ราคาตลาด ±15% / ±5% / ±20%', '—', 'ใบเสนอราคา + สเปก: <b class="pos">±5% / ±3% / ±10%</b>'],
  ['% Demand ที่แบตลดได้', '±50%', 'คำถาม 5, 6: <b>±40%</b>', 'ไฟล์ 15 นาที: <b class="pos">±10%</b>'],
  ['ประเภทอัตรา / มิเตอร์', 'สุ่ม TOU หรือธรรมดา 50:50', '—', 'เห็นในบิล: รู้แน่'],
  ['มีโซลาร์อยู่แล้วไหม', '10% ของโรงงานมี → ไฟที่ใช้ได้เหลือ 60%', '—', 'คำถาม 9, 10: รู้แน่'],
], 'sm')}
<div class="stack">${card(`<div class="ct">ขั้นตอน</div><ol class="ol"><li>แปลงค่าที่ไม่แน่นอนเป็นช่วง ± ตามข้อมูลที่มี</li><li>สุ่มแบบสามเหลี่ยม: ค่าที่ประเมินมีโอกาสมากที่สุด</li><li>สุ่มทุกค่าพร้อมกัน แล้วคำนวณ IRR / NPV หนึ่งครั้ง</li><li>ทำซ้ำ 2,000 รอบ อ่าน P10 / P50 / P90 และนับรอบที่ตัดสินใจผิด</li><li>ใช้ชุดเลขสุ่มเดียวกันทุกกรณี ผลต่างจึงมาจากข้อมูลจริง ๆ</li></ol>`)}
${card('<p class="fn">ช่วง ± เป็นสมมติฐานของทีม ไม่ได้วัดจากโรงงานจริง · ไม่รวมความเสี่ยงตลาด (Ft, ค่าไฟ, อัตราคิดลด) · ควรปรับช่วงเมื่อมีข้อมูลโรงงานจริง 10–20 แห่ง</p>')}</div></div>`, 'bk'));

// B8 convergence
const cv = MC.conv;
slides.push(slide('สไลด์สำรอง · B8', 'ทดสอบกี่รอบ และทำไมต้อง 2,000 รอบ', `<div class="g2 w55">${tbl(['จำนวนรอบ', 'โอกาสผิดเฉลี่ย', 'แกว่งจากการสุ่ม (ทดลอง 30 seed)', 'แกว่งตามทฤษฎี √(p(1−p)/N)'], cv.map(x => ({ cells: [th(x.N), pc(x.meanWrong), `±${(x.sdWrong * 100).toFixed(1)} จุด`, `±${(x.theory * 100).toFixed(1)} จุด`], hl: x.N === 2000 })), 'num')}
<div class="stack">${card(`<ul class="li"><li><b>เกณฑ์:</b> ตัวเลข "โอกาสผิด" ต้องแกว่งจากการสุ่มไม่เกินประมาณ ±1 จุด เพื่อแยก 4% (มีใบเสนอราคา) ออกจาก 16% (ไม่มี) ได้ชัด</li><li><b class="pos">2,000 รอบ</b> ผ่านเกณฑ์ ส่วน 500 รอบไม่ผ่าน</li><li><b>5,000 รอบขึ้นไป</b> แคบลงอีกเล็กน้อย แต่ใช้เวลา 2.5 เท่า และคำตอบคุ้ม / ไม่คุ้มไม่เปลี่ยน</li><li>2,000 รอบใช้เวลาประมาณ 0.2 วินาทีต่อกรณี</li><li>การ์ดในแพลตฟอร์มใช้ 1,000 รอบเพื่อให้ตอบสนองทันที พอสำหรับคัดกรอง</li></ul>`)}</div></div>`, 'bk'));

// B9 all scenarios all products
const SCN = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
const lab = Object.fromEntries(MC.scen.solar500.map(s => [s.id, s.label]));
slides.push(slide('สไลด์สำรอง · B9', 'ผลทุกประเภทบิล ทุกผลิตภัณฑ์: คลาดเคลื่อน IRR และโอกาสตัดสินใจผิด', tbl(['ข้อมูลที่มี', 'Solar PPA', 'Solar + Battery', 'Battery'], SCN.map(id => ({ cells: [lab[id], ...['solar500', 'hybrid', 'battery'].map(k => { const r = sc(k, id); return `±${half(r)} · <b class="${r.wrong > 0.1 ? 'neg' : 'pos'}">${pc(r.wrong)}</b>`; })], hl: id === 'S1' })), 'num sm') + '<p class="fn">แต่ละช่อง: IRR คลาดเคลื่อน (จุด, P10–P90) · โอกาสตัดสินใจผิด · บิลประเภท 4 TOD ยังไม่รองรับในแพลตฟอร์ม · บิลประเภท 2 กิจการขนาดเล็กอยู่นอกกลุ่มเป้าหมาย</p>', 'bk'));

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
const fit = `<script>
// Scale each slide's content (CSS zoom) so it fills the frame without overflowing; keeps the 'พูด' strip at the bottom.
document.fonts.ready.then(() => {
  for (const sl of document.querySelectorAll('.slide:not(.cover)')) {
    const b = sl.querySelector('.body'); if (!b) continue;
    const avail = sl.getBoundingClientRect().bottom - 24 - b.getBoundingClientRect().top;
    let best = 0.6;
    for (let z = 0.6; z <= 1.42; z += 0.02) { b.style.zoom = z; if (b.getBoundingClientRect().height <= avail && b.scrollWidth <= b.clientWidth + 2) best = z; }
    b.style.zoom = best; b.style.minHeight = (avail / best) + 'px';
  }
  document.body.dataset.ready = '1';
});
</script>`;
fs.writeFileSync(OUT, `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>สไลด์นำเสนอ กฟผ.</title><style>${css}</style></head><body>${slides.join('\n')}${fit}</body></html>`);
console.log('slides', n, '→', decodeURIComponent(OUT.pathname));
