// inputs.js — raw inputs → numbers for the cash-flow model, per product.
// Same inputs and formulas as reports/EGAT_Platform_Input_แยกตามผลิตภัณฑ์.xlsx (sections 1–6).
// Values are stored as plain numbers; percentages as fractions (8% = 0.08).

// PEA tariff table (bills from May 2023) · Ft for Sep–Dec 2026 (ERC 22 Jul 2026) · weekdays in 2027
export const TARIFFS = [
  { volt: 1, label: '≥ 69 kV', peak: 4.1025, off: 2.5849, dT: 74.14, norm: 3.1097, dN: 175.70 },
  { volt: 2, label: '22–33 kV', peak: 4.1839, off: 2.6037, dT: 132.93, norm: 3.1471, dN: 196.26 },
  { volt: 3, label: '< 22 kV', peak: 4.3297, off: 2.6369, dT: 210.00, norm: 3.1751, dN: 221.50 },
];
export const SHARED = { ft: 0.1623, wkd: 261 };
export const SOURCES = {
  tariff: 'ตารางอัตรา กฟภ. (ใช้ตั้งแต่บิล พ.ค. 2566)',
  ft: 'มติ กกพ. 22 ก.ค. 2569 (งวด ก.ย.–ธ.ค. 2569 · งวด ม.ค.–เม.ย. 2570 ยังไม่ประกาศ ณ 11 พ.ย. 2569)',
  wkd: 'นับจากปฏิทินปี 2570',
  egat: 'ไฟล์ BESS Feasibility Model_rev01 ของ กฟผ.',
};

const METER = { key: 'meter', label: 'ประเภทมิเตอร์ของลูกค้า', options: [[1, 'TOU'], [2, 'แบบธรรมดา']] };
const VOLT = { key: 'volt', label: 'ระดับแรงดัน (ดูในบิล)', options: TARIFFS.map(t => [t.volt, t.label]) };
const BT = { key: 'bt', label: 'ประเภทแบต', options: [[1, 'แบตใหม่'], [2, 'แบตมือสอง']] };
const UM = { key: 'um', label: 'วิธีหาสัดส่วนไฟที่ลูกค้าใช้', options: [[1, 'คำนวณจากบิล'], [2, 'ใส่เองจากไฟล์ 15 นาที']] };
const SRC = { key: 'src', label: 'แหล่งไฟชาร์จแบต', options: [[1, 'ชาร์จจากกริด Off-peak'], [2, 'โซลาร์ส่วนเกินของลูกค้าเอง']] };
export const SELECTORS = { solar: [METER, UM, VOLT], hybrid: [METER, UM, VOLT, BT], battery: [METER, SRC, VOLT, BT] };
const DEFAULT_SEL = { meter: 1, um: 1, src: 1, volt: 2, bt: 1 };

export const GROUPS = [{"key": "ลูกค้า", "title": "1. ข้อมูลจากลูกค้า (โรงงาน)"}, {"key": "กฟภ.", "title": "2. ข้อมูลจาก กฟภ. / กกพ. / ครม."}, {"key": "ผู้รับเหมา", "title": "3. ข้อมูลจากผู้รับเหมา / ผู้ขายอุปกรณ์"}, {"key": "กฟผ.", "title": "4. ข้อมูลที่ กฟผ. กำหนด"}];

// need: when the input is required for the selected options ('optional' = never required, has a default)
export const INPUTS = [
  {"key":"onpk","label":"หน่วยไฟ On-Peak ต่อเดือน","unit":"kWh/เดือน","products":["solar","hybrid"],"need":"um1","group":"ลูกค้า","who":"ฝ่ายบัญชี / จัดซื้อของโรงงาน","doc":"บิลค่าไฟ TOU เดือนล่าสุด (ช่องหน่วย On-Peak)","prefill":null},
  {"key":"pdem","label":"Peak demand (ความต้องการพลังไฟฟ้าสูงสุด)","unit":"kW","products":["hybrid","battery"],"need":"always","group":"ลูกค้า","who":"ฝ่ายบัญชี / จัดซื้อของโรงงาน","doc":"บิลค่าไฟ (ช่องความต้องการพลังไฟฟ้าสูงสุด)","prefill":null},
  {"key":"pdemMax","label":"Peak demand สูงสุดในรอบ 12 เดือน","unit":"kW","products":["hybrid","battery"],"need":"optional","group":"ลูกค้า","who":"ฝ่ายบัญชี / จัดซื้อของโรงงาน","doc":"บิลค่าไฟ 12 เดือนย้อนหลัง (ค่าสูงสุด) · ใส่แล้วคิดกฎค่า Demand ขั้นต่ำ 70% ให้ · เว้นว่างได้","prefill":null},
  {"key":"wdays","label":"วันทำงานต่อปี","unit":"วัน","products":["solar","hybrid"],"need":"always","group":"ลูกค้า","who":"ผู้จัดการโรงงาน / ฝ่ายผลิต","doc":"ถาม \"ทำงานกี่วันต่อสัปดาห์ หยุดยาวกี่วัน\" แล้วคิดเป็นวันต่อปี","prefill":null},
  {"key":"mon","label":"จำนวนวันอาทิตย์ที่โรงงานหยุด (ไว้ชาร์จแบตด้วยไฟโซลาร์ส่วนเกิน)","unit":"วัน/ปี","products":["hybrid"],"need":"always","group":"ลูกค้า","who":"ผู้จัดการโรงงาน / ฝ่ายผลิต","doc":"ถาม \"วันอาทิตย์หยุดทุกสัปดาห์ไหม\" (ถ้าทำงาน 7 วันใส่ 0)","prefill":null},
  {"key":"useman","label":"สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้","unit":"%","products":["solar","hybrid"],"need":"um2","group":"ลูกค้า","who":"ไฟล์ 15 นาทีของลูกค้า (ขอผ่าน กฟภ.) วิเคราะห์โดยวิศวกร กฟผ.","doc":"จับคู่ไฟล์การใช้ไฟ 15 นาที 12 เดือน กับกราฟผลิตไฟรายชั่วโมง","prefill":null},
  {"key":"custsur","label":"ไฟโซลาร์เหลือของลูกค้าเองในวัน Peak","unit":"kWh/วัน","products":["battery"],"need":"src2","group":"ลูกค้า","who":"ผู้ดูแลระบบโซลาร์ของลูกค้า","doc":"ระบบมอนิเตอร์โซลาร์ของลูกค้า หรือไฟล์ 15 นาที","prefill":null},
  {"key":"relT","label":"สัดส่วน Demand ที่แบตลดได้จริง (TOU)","unit":"% ของกำลังแบต","products":["hybrid","battery"],"need":"meter1","group":"ลูกค้า","who":"ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.","doc":"จำลองตัดยอด 12 เดือน (ถ้าใส่ Peak demand สูงสุด 12 เดือน ระบบคิดกฎขั้นต่ำ 70% ให้)","prefill":null},
  {"key":"relN","label":"สัดส่วน Demand ที่แบตลดได้จริง (ธรรมดา)","unit":"% ของกำลังแบต","products":["hybrid","battery"],"need":"meter2","group":"ลูกค้า","who":"ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.","doc":"เหมือนข้างบน แต่ค่า Demand วัดทุกช่วงเวลา","prefill":null},
  {"key":"ndays","label":"วันที่ต้องใช้แบตตัดยอด (มิเตอร์ธรรมดา, ชาร์จจากกริด)","unit":"วัน/ปี","products":["battery"],"need":"meter2src1","group":"ลูกค้า","who":"ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.","doc":"นับวันที่ไฟพุ่งเกินเป้า","prefill":null},
  {"key":"peak","label":"ค่าไฟช่วง Peak (TOU)","unit":"บาท/kWh","products":["solar","hybrid","battery"],"need":"meter1","group":"กฟภ.","who":"กฟภ.","doc":"ตารางอัตรา TOU ตามระดับแรงดัน (ดึงจากแท็บค่าไฟ กฟภ.)","prefill":{"tariff":"peak"}},
  {"key":"off","label":"ค่าไฟช่วง Off-peak (TOU)","unit":"บาท/kWh","products":["solar","hybrid","battery"],"need":"meter1","group":"กฟภ.","who":"กฟภ.","doc":"ตารางอัตรา TOU","prefill":{"tariff":"off"}},
  {"key":"norm","label":"ค่าไฟมิเตอร์แบบธรรมดา","unit":"บาท/kWh","products":["solar","hybrid","battery"],"need":"meter2","group":"กฟภ.","who":"กฟภ.","doc":"ตารางอัตราปกติ (3.1)","prefill":{"tariff":"norm"}},
  {"key":"dT","label":"ค่า Demand (TOU)","unit":"บาท/kW/เดือน","products":["hybrid","battery"],"need":"meter1","group":"กฟภ.","who":"กฟภ.","doc":"ตารางอัตรา TOU","prefill":{"tariff":"dT"}},
  {"key":"dN","label":"ค่า Demand (แบบธรรมดา)","unit":"บาท/kW/เดือน","products":["hybrid","battery"],"need":"meter2","group":"กฟภ.","who":"กฟภ.","doc":"ตารางอัตราปกติ (3.1)","prefill":{"tariff":"dN"}},
  {"key":"ft","label":"ค่า Ft","unit":"บาท/kWh","products":["solar","hybrid","battery"],"need":"always","group":"กฟภ.","who":"กกพ.","doc":"ประกาศค่า Ft งวดล่าสุด","prefill":{"shared":"ft"}},
  {"key":"wkd","label":"วันจันทร์–ศุกร์ในปี","unit":"วัน","products":["solar","hybrid","battery"],"need":"always","group":"กฟภ.","who":"ปฏิทิน","doc":"นับจากปฏิทินของปีที่ประเมิน","prefill":{"shared":"wkd"}},
  {"key":"hol","label":"วันหยุดราชการที่ตรงวันจันทร์–ศุกร์","unit":"วัน","products":["solar","hybrid","battery"],"need":"always","group":"กฟภ.","who":"ครม. (ประกาศวันหยุดราชการประจำปี)","doc":"นับวันหยุดในประกาศที่ไม่ตรงเสาร์อาทิตย์ · ปฏิทิน 2570 ที่เผยแพร่ (อิงวันหยุดธนาคาร ธปท.) มี 19 วัน แต่ ครม. ยังไม่อนุมัติ (ตรวจ 11 พ.ย. 2569)","prefill":null},
  {"key":"kwp","label":"ขนาดโซลาร์","unit":"kWp","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"วิศวกร กฟผ. ร่วมกับผู้รับเหมา EPC","doc":"ออกแบบไม่ให้เกินไฟกลางวันของลูกค้า และไม่เกินพื้นที่หลังคา","prefill":null},
  {"key":"cost","label":"ต้นทุนติดตั้งโซลาร์ (เหมารวม)","unit":"บาท/W","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับเหมา EPC โซลาร์ 2–3 ราย","doc":"ใบเสนอราคา ขอบเขตงานเดียวกัน","prefill":null},
  {"key":"yld","label":"ไฟที่ผลิตได้","unit":"kWh/kWp/ปี","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับเหมา EPC (ผลจำลอง PVsyst) หรือวิศวกร กฟผ. (PVGIS)","doc":"ผลจำลองที่พิกัดโรงงาน หักเงาและทิศหลังคา","prefill":null},
  {"key":"after9","label":"สัดส่วนไฟโซลาร์ที่ผลิตหลัง 09:00","unit":"%","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับเหมา EPC หรือวิศวกร กฟผ.","doc":"จากผลจำลองรายชั่วโมงของไซต์","prefill":null},
  {"key":"deg","label":"แผงเสื่อมต่อปี","unit":"%/ปี","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ผลิตแผง","doc":"datasheet และใบรับประกันกำลังผลิตแผง","prefill":null},
  {"key":"om","label":"O&M โซลาร์ (รวมค่าประกันและค่าบริหาร)","unit":"% ของเงินลงทุน/ปี","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับเหมา O&M + บริษัทประกันภัย","doc":"(ค่าสัญญา O&M + เบี้ยประกัน) ÷ เงินลงทุน","prefill":null},
  {"key":"invY","label":"ปีที่เปลี่ยน inverter","unit":"ปีที่","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขาย inverter","doc":"ระยะรับประกัน inverter","prefill":null},
  {"key":"invC","label":"ค่าเปลี่ยน inverter","unit":"บาท/kW","products":["solar","hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขาย inverter","doc":"ใบเสนอราคา inverter","prefill":null},
  {"key":"bkwh","label":"ความจุแบต","unit":"kWh","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"วิศวกร กฟผ. ร่วมกับผู้ขายแบต","doc":"ออกแบบจากไฟล์ 15 นาทีของลูกค้า","prefill":null},
  {"key":"bkw","label":"กำลังแบต","unit":"kW","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"วิศวกร กฟผ. ร่วมกับผู้ขายแบต","doc":"ออกแบบจากไฟล์ 15 นาทีของลูกค้า","prefill":null},
  {"key":"dod","label":"ความจุที่ใช้ได้ต่อรอบ","unit":"%","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"เงื่อนไขรับประกัน · ไฟล์ BESS ของ กฟผ. ใช้ 400/500 kWh","prefill":0.8},
  {"key":"rte","label":"ประสิทธิภาพชาร์จ-จ่าย (รวมไฟของแอร์แบต)","unit":"%","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"datasheet แบต + ไฟที่ระบบระบายความร้อนใช้","prefill":null},
  {"key":"bpack","label":"แบตใหม่: เซลล์ + BMS + ตู้","unit":"บาท/kWh","products":["hybrid","battery"],"need":"bt1","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ใบเสนอราคา","prefill":null},
  {"key":"bpcs","label":"แบตใหม่: PCS","unit":"บาท/kW","products":["hybrid","battery"],"need":"bt1","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ใบเสนอราคา","prefill":null},
  {"key":"binst","label":"แบตใหม่: ค่าติดตั้ง","unit":"บาท/kWh","products":["hybrid","battery"],"need":"bt1","group":"ผู้รับเหมา","who":"ผู้รับเหมา BESS","doc":"ใบเสนอราคา","prefill":null},
  {"key":"blump","label":"แบตใหม่: ระบบดับเพลิง + EMS (ก้อน)","unit":"บาท","products":["hybrid","battery"],"need":"bt1","group":"ผู้รับเหมา","who":"ผู้รับเหมา BESS","doc":"ใบเสนอราคา","prefill":null},
  {"key":"slsys","label":"แบตมือสอง: BESS system (ผ่านทดสอบ + BMS)","unit":"บาท/kWh","products":["hybrid","battery"],"need":"bt2","group":"ผู้รับเหมา","who":"ผู้ขายแบตมือสอง","doc":"ใบเสนอราคา","prefill":null},
  {"key":"slturn","label":"แบตมือสอง: ค่าติดตั้ง Turnkey","unit":"บาท/kWh","products":["hybrid","battery"],"need":"bt2","group":"ผู้รับเหมา","who":"ผู้รับเหมา BESS","doc":"รวม PCS, EMS, ตู้, ระบบดับเพลิง, ติดตั้ง","prefill":null},
  {"key":"bdeg","label":"แบตเสื่อมต่อปี","unit":"%/ปี","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ใบรับประกัน (ความจุที่เหลือเมื่อครบประกัน ÷ จำนวนปี)","prefill":null},
  {"key":"bom","label":"O&M แบต","unit":"% ของเงินลงทุน/ปี","products":["hybrid","battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับเหมา O&M แบต","doc":"ค่าสัญญา O&M ÷ เงินลงทุนแบต","prefill":null},
  {"key":"blife","label":"อายุโครงการแบต","unit":"ปี","products":["battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ระยะรับประกัน · ไฟล์ BESS ของ กฟผ. ใช้ 10 ปี","prefill":10},
  {"key":"bsalv","label":"มูลค่าซากแบตปีสุดท้าย","unit":"% ของเงินลงทุน","products":["battery"],"need":"always","group":"ผู้รับเหมา","who":"ผู้รับซื้อคืน / รีไซเคิลแบต","doc":"ใบเสนอราคารับซื้อคืน · ไฟล์ BESS ของ กฟผ. ใช้ 10% · ติดลบได้ถ้ามีค่ารื้อถอน","prefill":0.1},
  {"key":"bswap","label":"ปีที่ต้องเปลี่ยนแบต (อายุแบต)","unit":"ปี","products":["hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ระยะรับประกันแบต · ไฟล์ BESS ของ กฟผ. ใช้ 10 ปี","prefill":10},
  {"key":"bswapPct","label":"ราคาแบตชุดใหม่ตอนเปลี่ยน","unit":"% ของเงินลงทุนแบตเดิม","products":["hybrid"],"need":"always","group":"ผู้รับเหมา","who":"ผู้ขายแบต","doc":"ราคาคาดการณ์ ณ ปีที่เปลี่ยน (ใส่ 0 ถ้าอายุแบตไม่น้อยกว่าอายุโครงการ)","prefill":null},
  {"key":"chgh","label":"ชั่วโมงที่ใช้ชาร์จแบตจากโซลาร์ (ใช้เช็คขนาดโซลาร์)","unit":"ชม./วัน","products":["battery"],"need":"src2","group":"ผู้รับเหมา","who":"ผู้รับเหมา BESS","doc":"ไฟล์ BESS ของ กฟผ. ใช้ 4 ชม.","prefill":4},
  {"key":"disc","label":"ส่วนลด PPA ให้ลูกค้า","unit":"%","products":["solar","hybrid"],"need":"always","group":"กฟผ.","who":"ฝ่ายการตลาด / คณะทำงานกำหนดราคา กฟผ.","doc":"เงื่อนไขที่เสนอลูกค้า","prefill":null},
  {"key":"share","label":"ส่วนแบ่งผลประหยัดสุทธิที่ กฟผ. ได้ (ส่วนแบต)","unit":"%","products":["hybrid","battery"],"need":"always","group":"กฟผ.","who":"ฝ่ายการตลาด / คณะทำงานกำหนดราคา กฟผ.","doc":"เงื่อนไขสัญญาแบ่งผลประหยัด","prefill":null},
  {"key":"term","label":"อายุสัญญา","unit":"ปี","products":["solar"],"need":"always","group":"กฟผ.","who":"ฝ่ายกฎหมาย / การตลาด กฟผ.","doc":"ร่างสัญญา PPA","prefill":null},
  {"key":"hlife","label":"อายุโครงการ","unit":"ปี","products":["hybrid"],"need":"always","group":"กฟผ.","who":"ฝ่ายกฎหมาย / การตลาด กฟผ.","doc":"ร่างสัญญา","prefill":null},
  {"key":"rate","label":"อัตราคิดลด","unit":"%","products":["solar","hybrid","battery"],"need":"always","group":"กฟผ.","who":"ฝ่ายการเงิน กฟผ.","doc":"นโยบาย hurdle rate · ไฟล์ BESS ของ กฟผ. ใช้ 8%","prefill":0.08},
  {"key":"esc","label":"ค่าไฟขึ้นต่อปี","unit":"%/ปี","products":["solar","hybrid","battery"],"need":"always","group":"กฟผ.","who":"ฝ่ายวางแผน กฟผ.","doc":"สมมติฐานจาก PDP และแนวโน้มค่า Ft","prefill":null},
  {"key":"escY","label":"ใช้อัตราค่าไฟขึ้นข้างบนถึงปีที่","unit":"ปีที่","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายวางแผน กฟผ.","doc":"เว้นว่าง = ใช้อัตราเดียวตลอดโครงการ","prefill":null},
  {"key":"esc2","label":"ค่าไฟขึ้นต่อปีหลังจากนั้น","unit":"%/ปี","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายวางแผน กฟผ.","doc":"เว้นว่าง = ใช้อัตราเดียวกับข้างบน","prefill":null},
  {"key":"enzy","label":"ค่าแรกเข้า ENZY (ครั้งเดียว)","unit":"บาท","products":["solar","hybrid","battery"],"need":"always","group":"กฟผ.","who":"หน่วยงานที่ดูแล ENZY","doc":"ไฟล์ BESS ของ กฟผ. ใช้ 120,000 บาท (ใส่ 0 ถ้าไม่ใช้ ENZY)","prefill":120000},
  {"key":"othS","label":"ค่าใช้จ่ายอื่นต่อปี: ส่วนโซลาร์","unit":"บาท/ปี","products":["solar","hybrid"],"need":"always","group":"กฟผ.","who":"ฝ่ายบัญชี กฟผ.","doc":"ค่าใช้จ่ายที่ไม่อยู่ใน O&M (ใส่ 0 ถ้ารวมแล้ว)","prefill":null},
  {"key":"othB","label":"ค่าใช้จ่ายอื่นต่อปี: ส่วนแบต","unit":"บาท/ปี","products":["hybrid","battery"],"need":"always","group":"กฟผ.","who":"ฝ่ายบัญชี กฟผ.","doc":"ไฟล์ BESS ของ กฟผ. ใช้ 35,000 บาท","prefill":35000},
  {"key":"xfer","label":"มูลค่าที่ได้ตอนโอนระบบปลายสัญญา","unit":"บาท","products":["solar","hybrid"],"need":"always","group":"กฟผ.","who":"ฝ่ายกฎหมาย / การตลาด กฟผ.","doc":"เงื่อนไขในสัญญา (ใส่ 0 ถ้าโอนให้ลูกค้าฟรี · ติดลบได้ถ้ามีค่ารื้อถอน)","prefill":null},
  {"key":"inf","label":"O&M ขึ้นต่อปี","unit":"%/ปี","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายบัญชี กฟผ.","doc":"ไฟล์ BESS ของ กฟผ. ใช้ 0.5%","prefill":0.005},
  {"key":"othG","label":"ค่าใช้จ่ายอื่นเพิ่มขึ้นต่อปี","unit":"%/ปี","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายบัญชี กฟผ.","doc":"ไฟล์ BESS ของ กฟผ. ใช้ 1%","prefill":0.01},
  {"key":"tax","label":"อัตราภาษีเงินได้","unit":"%","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายบัญชี กฟผ.","doc":"กฟผ. ไม่เสียภาษีเงินได้นิติบุคคล จึงใช้ 0 · ใส่ 20% ถ้าต้องการเทียบแบบเอกชน (ค่าเสื่อมเส้นตรงตลอดอายุโครงการ)","prefill":0,"src":"กฟผ. ไม่เสียภาษีเงินได้นิติบุคคล"},
  {"key":"debt","label":"สัดส่วนเงินกู้","unit":"% ของเงินลงทุน","products":["solar","hybrid","battery"],"need":"optional","group":"กฟผ.","who":"ฝ่ายการเงิน กฟผ.","doc":"0 = ใช้เงินของ กฟผ. ทั้งหมด · ถ้ากู้ จะแสดง NPV/IRR ส่วนทุนเพิ่ม","prefill":0,"src":"ค่าตั้งต้น = ไม่กู้"},
  {"key":"kd","label":"ดอกเบี้ยเงินกู้","unit":"%/ปี","products":["solar","hybrid","battery"],"need":"debtPos","group":"กฟผ.","who":"ฝ่ายการเงิน กฟผ.","doc":"อัตราพันธบัตรหรือเงินกู้ล่าสุดของ กฟผ.","prefill":null},
  {"key":"tenor","label":"ระยะผ่อนเงินกู้","unit":"ปี","products":["solar","hybrid","battery"],"need":"debtPos","group":"กฟผ.","who":"ฝ่ายการเงิน กฟผ.","doc":"เงื่อนไขเงินกู้ (ผ่อนเงินงวดเท่ากันทุกปี)","prefill":null}
];

const NEED = {
  always: () => true, optional: () => false,
  um1: s => s.um === 1, um2: s => s.um === 2, meter1: s => s.meter === 1, meter2: s => s.meter === 2,
  src2: s => s.src === 2, meter2src1: s => s.meter === 2 && s.src === 1, bt1: s => s.bt === 1, bt2: s => s.bt === 2,
  debtPos: (s, v) => (v.debt ?? 0) > 0,
};
export const isPercent = unit => unit.startsWith('%');
export const inputsFor = product => INPUTS.filter(i => i.products.includes(product));

export function defaultRaw() { return { sel: { ...DEFAULT_SEL }, values: {} }; }
const selOf = raw => ({ ...DEFAULT_SEL, ...(raw?.sel ?? {}) });

// Value shown before the user types anything: official tariffs, Ft, weekdays, or EGAT BESS-file defaults.
export function prefillValue(input, sel) {
  const p = input.prefill;
  if (p == null) return null;
  if (typeof p === 'number') return p;
  if (p.tariff) return (TARIFFS.find(t => t.volt === sel.volt) ?? TARIFFS[1])[p.tariff];
  if (p.shared) return SHARED[p.shared];
  return null;
}
export function prefillSource(input) {
  const p = input.prefill;
  if (p == null) return null;
  if (input.src) return input.src;
  if (typeof p === 'number') return SOURCES.egat;
  return p.tariff ? SOURCES.tariff : SOURCES[p.shared];
}

// Status of every input for one product: required / filled / not used, plus the list still missing.
export function inputStatus(product, raw) {
  const sel = selOf(raw), values = raw?.values ?? {};
  // pass 1: values (typed, else default) · pass 2: which inputs are required (some depend on other values, e.g. loan terms)
  const rows = inputsFor(product).map(input => {
    const typed = values[input.key];
    const hasTyped = typed != null && typed !== '' && Number.isFinite(Number(typed));
    const pre = prefillValue(input, sel);
    return { input, value: hasTyped ? Number(typed) : pre, typed: hasTyped, prefilled: !hasTyped && pre != null };
  });
  const v = Object.fromEntries(rows.map(r => [r.input.key, r.value]));
  for (const row of rows) {
    row.need = NEED[row.input.need](sel, v);
    row.optional = row.input.need === 'optional';
    row.used = row.need || row.optional;
    row.missing = row.need && row.value == null;
  }
  return { sel, rows, missing: rows.filter(r => r.missing).map(r => r.input.key) };
}

const MIN = Math.min, MAX = Math.max;

// Section 5 (derived values) and section 6 (model fields) of the Excel file.
export function derive(product, raw) {
  const st = inputStatus(product, raw), sel = st.sel;
  const v = Object.fromEntries(st.rows.map(r => [r.input.key, r.value ?? 0]));
  const tou = sel.meter === 1;
  const d = {}, steps = [];
  const step = (key, label, unit, value, how) => { d[key] = value; steps.push({ key, label, unit, value, how }); };
  const optional = k => st.rows.find(r => r.input.key === k)?.value ?? null;
  const esc2 = optional('esc2') ?? v.esc, escY = optional('escY') ?? 0;
  step('pdays', 'วัน Peak ต่อปี', 'วัน', v.wkd - v.hol, 'วันจันทร์–ศุกร์ − วันหยุดราชการ');
  if (product !== 'battery') {
    step('solarday', 'ไฟโซลาร์ต่อวัน', 'kWh/วัน', v.kwp * v.yld / 365, 'kWp × ไฟที่ผลิตได้ ÷ 365');
    if (sel.um === 1) step('dayload', 'ไฟกลางวันต่อวันทำงาน (ประมาณจากบิล)', 'kWh/วัน', v.onpk / (d.pdays / 12) * 9 / 13, 'หน่วย On-Peak ÷ วัน Peak ต่อเดือน × 9 ÷ 13');
    step('use', 'สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', '%', sel.um === 1 ? MIN(d.dayload, d.solarday) * v.wdays / (v.kwp * v.yld) : v.useman,
      sel.um === 1 ? 'min(ไฟกลางวัน, ไฟโซลาร์ต่อวัน) × วันทำงาน ÷ ไฟโซลาร์ทั้งปี' : 'ค่าที่ใส่จากไฟล์ 15 นาที');
    step('s', 'สัดส่วนไฟโซลาร์ที่ตรงช่วง Peak', 'สัดส่วน', MIN(1, d.pdays / v.wdays) * v.after9, '(วัน Peak ÷ วันทำงาน) × สัดส่วนหลัง 09:00');
    step('avoid', 'ราคาที่โซลาร์ทดแทนได้', 'บาท/kWh', tou ? d.s * v.peak + (1 - d.s) * v.off + v.ft : v.norm + v.ft,
      tou ? 's × Peak + (1 − s) × Off-peak + Ft' : 'ค่าไฟธรรมดา + Ft');
    step('ppa', 'ราคา PPA', 'บาท/kWh', d.avoid * (1 - v.disc), 'ราคาที่โซลาร์ทดแทนได้ × (1 − ส่วนลด)');
    step('srev', 'รายได้โซลาร์ปีแรก', 'บาท/ปี', v.kwp * v.yld * d.use * d.ppa, 'kWp × ไฟที่ผลิตได้ × สัดส่วนที่ลูกค้าใช้ × ราคา PPA');
    step('capS', 'เงินลงทุนโซลาร์', 'บาท', v.cost * v.kwp * 1000, 'ต้นทุน × kWp × 1,000');
    step('gS', 'อัตราเติบโตรายได้จริง (โซลาร์)', '%/ปี', (1 + v.esc) * (1 - v.deg) - 1, '(1 + ค่าไฟขึ้น) × (1 − แผงเสื่อม) − 1');
    step('gSL', 'อัตราเติบโตรายได้จริงหลังปีที่เปลี่ยนอัตรา (โซลาร์)', '%/ปี', (1 + esc2) * (1 - v.deg) - 1, 'เหมือนข้างบน แต่ใช้ค่าไฟขึ้นช่วงหลัง');
  }
  if (product !== 'solar') {
    step('capB', 'เงินลงทุนแบต', 'บาท', sel.bt === 1 ? (v.bpack + v.binst) * v.bkwh + v.bpcs * v.bkw + v.blump : (v.slsys + v.slturn) * v.bkwh,
      sel.bt === 1 ? '(เซลล์ + ติดตั้ง) × kWh + PCS × kW + ก้อน' : '(BESS + Turnkey) × kWh');
    step('usable', 'ความจุที่ใช้ได้ต่อรอบ', 'kWh', v.bkwh * v.dod, 'ความจุ × % ที่ใช้ได้');
    step('bval', 'มูลค่าไฟที่แบตจ่าย', 'บาท/kWh', tou ? v.peak + v.ft : v.norm + v.ft, tou ? 'Peak + Ft' : 'ค่าไฟธรรมดา + Ft');
    step('gprice', 'ค่าไฟที่ใช้ชาร์จจากกริด', 'บาท/kWh', tou ? v.off + v.ft : v.norm + v.ft, tou ? 'Off-peak + Ft' : 'ค่าไฟธรรมดา + Ft');
    step('dcut', 'Demand ที่ตัดได้', 'kW', (tou ? v.relT : v.relN) * MIN(v.bkw, v.pdem), '% ที่ลดได้ × min(kW แบต, Peak demand)');
    const M = optional('pdemMax');
    step('dsave', 'ค่า Demand ที่ลดได้ต่อปี', 'บาท/ปี', (tou ? v.dT : v.dN) * 12 * (M == null ? d.dcut : MAX(v.pdem, 0.7 * M) - MAX(v.pdem - d.dcut, 0.7 * M)),
      M == null ? 'อัตรา Demand × 12 × kW ที่ลดได้' : 'อัตรา Demand × 12 × [max(Peak, 70% ของสูงสุด 12 เดือน) − max(Peak − kW ที่ตัด, 70% ของสูงสุด)]');
    step('gB', 'อัตราเติบโตรายได้จริง (แบต)', '%/ปี', (1 + v.esc) * (1 - v.bdeg) - 1, '(1 + ค่าไฟขึ้น) × (1 − แบตเสื่อม) − 1');
    step('gBL', 'อัตราเติบโตรายได้จริงหลังปีที่เปลี่ยนอัตรา (แบต)', '%/ปี', (1 + esc2) * (1 - v.bdeg) - 1, 'เหมือนข้างบน แต่ใช้ค่าไฟขึ้นช่วงหลัง');
  }
  if (product === 'hybrid') {
    step('surwd', 'ไฟโซลาร์เหลือในวันทำงาน', 'kWh/วัน', sel.um === 1 ? MAX(0, d.solarday - d.dayload) : 0, 'max(0, ไฟโซลาร์ต่อวัน − ไฟกลางวัน)');
    const fromSurplus = MIN(d.surwd, d.usable), mondays = MIN(v.mon, d.pdays);
    step('hfree', 'ไฟเข้าแบตฟรีต่อปี', 'kWh/ปี', fromSurplus * d.pdays + (d.usable - fromSurplus) * mondays * (d.solarday >= d.usable ? 1 : 0), 'ไฟเหลือวันทำงาน + วันจันทร์ที่ชาร์จจากไฟวันอาทิตย์');
    step('hgrid', 'ไฟเข้าแบตจากกริดต่อปี', 'kWh/ปี', (tou ? 1 : 0) * (d.usable - fromSurplus) * MAX(0, d.pdays - mondays), 'ส่วนที่ขาด × วัน Peak ที่เหลือ (เฉพาะ TOU)');
    step('bnet', 'ผลประหยัดสุทธิส่วนแบตปีแรก', 'บาท/ปี', (d.hfree + d.hgrid) * v.rte * d.bval + d.dsave - d.hgrid * d.gprice, 'ไฟที่แบตจ่าย × มูลค่าไฟ + ค่า Demand − ค่าไฟชาร์จ');
    step('nswap', 'เปลี่ยนแบตกี่ครั้งในอายุโครงการ', 'ครั้ง', v.bswap < v.hlife ? Math.floor((v.hlife - 1) / v.bswap) : 0, 'จำนวนปีที่ k × อายุแบต < อายุโครงการ');
    step('swapc', 'ค่าแบตชุดใหม่ต่อครั้ง', 'บาท', v.bswapPct * d.capB, 'ราคาแบตชุดใหม่ (%) × เงินลงทุนแบต');
  }
  if (product === 'battery') {
    step('bin', 'ไฟเข้าแบตต่อปี', 'kWh/ปี', sel.src === 2 ? MIN(d.usable, v.custsur) * d.pdays : d.usable * (tou ? d.pdays : v.ndays), sel.src === 2 ? 'จำกัดด้วยไฟเหลือของลูกค้า × วัน Peak' : 'ความจุที่ใช้ได้ × วันที่ใช้');
    step('bnet', 'ผลประหยัดสุทธิปีแรก', 'บาท/ปี',
      sel.src === 2 ? d.bin * v.rte * d.bval + d.dsave : tou ? d.bin * v.rte * d.bval + d.dsave - d.bin * d.gprice : d.dsave - d.bin * (1 - v.rte) * d.gprice,
      'ผลประหยัดของลูกค้าก่อนแบ่ง หักค่าไฟชาร์จแล้ว');
    if (sel.src === 2) step('needkwp', 'ขนาดโซลาร์ขั้นต่ำของลูกค้า (ชาร์จฟรี)', 'kWp', d.usable / v.chgh * 1.3, 'ความจุที่ใช้ได้ ÷ ชม.ชาร์จ × 1.3');
  }

  // Section 6: numbers for the cash-flow model
  const omg = optional('inf') ?? 0.01, othg = optional('othG') ?? 0.01;
  let f;
  if (product === 'solar') {
    const life = v.term, rep = v.invY <= life;
    f = { initial_investment: d.capS + v.enzy, project_life: life, revenue_y1: d.srev, revenue_growth: d.gS, revenue_growth_late: d.gSL, revenue2_y1: 0, revenue2_growth: 0,
      om_y1: v.om * d.capS, other_y1: v.othS, salvage_value: v.xfer, replacement_cost: rep ? v.invC * v.kwp : 0, replacement_year: rep ? v.invY : 0,
      peak_rate: d.avoid, energy_y1_kwh: v.kwp * v.yld * d.use, energy_degradation: v.deg, customer_saving_y1: 0 };
  } else if (product === 'hybrid') {
    const life = v.hlife, rep = v.invY <= life;
    const swap = v.bswap < life;
    f = { initial_investment: d.capS + d.capB + v.enzy, project_life: life, revenue_y1: d.srev, revenue_growth: d.gS, revenue_growth_late: d.gSL,
      revenue2_y1: v.share * d.bnet, revenue2_growth: d.gB, revenue2_growth_late: d.gBL, revenue2_reset_every: swap ? v.bswap : 0, revenue2_degradation: v.bdeg,
      replacement2_cost: swap ? d.swapc : 0, replacement2_year: 0, replacement2_every: swap ? v.bswap : 0,
      om_y1: v.om * d.capS + v.bom * d.capB, other_y1: v.othS + v.othB, salvage_value: v.xfer, replacement_cost: rep ? v.invC * v.kwp : 0, replacement_year: rep ? v.invY : 0,
      peak_rate: tou ? v.peak : v.norm, offpeak_rate: tou ? v.off : v.norm, peak_energy_kwh_day: d.usable, energy_y1_kwh: v.kwp * v.yld * d.use, energy_degradation: v.deg,
      customer_saving_y1: v.kwp * v.yld * d.use * (d.avoid - d.ppa) + (1 - v.share) * d.bnet };
  } else {
    f = { initial_investment: d.capB + v.enzy, project_life: v.blife, revenue_y1: v.share * d.bnet, revenue_growth: d.gB, revenue_growth_late: d.gBL, revenue2_y1: 0, revenue2_growth: 0,
      om_y1: v.bom * d.capB, other_y1: v.othB, salvage_value: v.bsalv * d.capB, replacement_cost: 0, replacement_year: 0,
      peak_rate: tou ? v.peak : v.norm, offpeak_rate: tou ? v.off : v.norm, peak_energy_kwh_day: d.usable, energy_y1_kwh: d.bin * v.rte, energy_degradation: v.bdeg,
      customer_saving_y1: (1 - v.share) * d.bnet };
  }
  f.discount_rate = v.rate; f.om_growth = omg; f.other_growth = othg;
  f.growth_switch_year = escY;
  const debt = optional('debt') ?? 0;
  f.tax_rate = optional('tax') ?? 0; f.debt_share = debt; f.debt_rate = debt > 0 ? v.kd : 0; f.debt_years = debt > 0 ? v.tenor : 0;
  const complete = st.missing.length === 0 && Object.values(f).every(Number.isFinite);
  return { complete, missing: st.missing, status: st, derived: d, steps, fields: f };
}
