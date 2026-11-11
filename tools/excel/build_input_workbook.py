# One sheet per product. Inputs grouped by who provides them. Only public / EGAT-file facts are pre-filled.
# Usage: build_by_product.py OUT [testvalues.json]
import sys, json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.workbook.properties import CalcProperties

OUT = sys.argv[1]
TEST = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
F = 'Tahoma'
f_t = Font(name=F, size=14, bold=True, color='122033')
f_b = Font(name=F, size=10, bold=True)
f_h = Font(name=F, size=10, bold=True, color='FFFFFF')
f_c = Font(name=F, size=10)
f_in = Font(name=F, size=10, color='0000FF')
f_pre = Font(name=F, size=10, color='008000')
f_big = Font(name=F, size=11, bold=True, color='122033')
f_note = Font(name=F, size=9, italic=True, color='555555')
f_warn = Font(name=F, size=9, bold=True, color='B3261E')
fill_h = PatternFill('solid', fgColor='122033')
fill_y = PatternFill('solid', fgColor='FFFF00')
fill_in = PatternFill('solid', fgColor='FFF2CC')
fill_pre = PatternFill('solid', fgColor='E2EFDA')
fill_out = PatternFill('solid', fgColor='C6E0B4')
GROUP_FILL = {'ลูกค้า': 'FCE4D6', 'กฟภ.': 'E4DFEC', 'ผู้รับเหมา': 'DDEBF7', 'กฟผ.': 'E2EFDA', 'คำนวณ': 'EDEDED', 'แพลตฟอร์ม': 'C6E0B4', 'เช็ค': 'E8EEF5'}
box = Border(bottom=Side(style='thin', color='D0D5DB'))
wrap = Alignment(wrap_text=True, vertical='top')
BAHT, BAHT2, PCT = '#,##0;(#,##0);0', '#,##0.00;(#,##0.00);0.00', '0.0%;(0.0%);0.0%'
wb = Workbook()

# ---------------- วิธีใช้ ----------------
rd = wb.active; rd.title = 'วิธีใช้'
for i, (t, f) in enumerate([
    ('แบบฟอร์ม input และสูตร แยกตามผลิตภัณฑ์', f_t),
    ('มี 3 แท็บหลัก: Solar PPA · Solar + Battery · Battery แต่ละแท็บมีครบในตัว: ช่อง input → ค่าที่คำนวณ → ตัวเลขที่ต้องพิมพ์ลงแพลตฟอร์ม → เช็คผล', f_note),
    ('', None),
    ('ในแต่ละแท็บ ช่อง input แบ่งตาม "ได้ข้อมูลจากใคร" 4 กลุ่ม', f_b),
    ('1. ลูกค้า (โรงงาน): บิลค่าไฟ, เวลาทำงาน, ไฟล์การใช้ไฟ 15 นาที', f_c),
    ('2. กฟภ. / กกพ. / ครม.: ค่าไฟ ค่า Ft และวันหยุดราชการ  ← ผมใส่ค่าที่ประกาศแล้วให้ (พื้นเขียวอ่อน)', f_c),
    ('3. ผู้รับเหมา / ผู้ขายอุปกรณ์: ราคา ไฟที่ผลิตได้ ประสิทธิภาพ และการรับประกัน', f_c),
    ('4. กฟผ.: ขนาดระบบ เงื่อนไขสัญญา อัตราคิดลด  ← ใส่ให้เฉพาะค่าที่อยู่ในไฟล์ BESS ของ กฟผ. (พื้นเขียวอ่อน)', f_c),
    ('', None),
    ('สีช่อง', f_b),
    ('พื้นครีม = ช่องว่าง ต้องกรอกเอง · พื้นเขียวอ่อน = ผมใส่ให้จากแหล่งทางการหรือไฟล์ของ กฟผ. (แก้ทับได้) · พื้นเหลือง = ช่องเลือก · พื้นเขียวเข้ม = ตัวเลขที่ต้องพิมพ์ลงแพลตฟอร์ม', f_c),
    ('', None),
    ('ขั้นตอน', f_b),
    ('1. เลือกแท็บของผลิตภัณฑ์ แล้วเลือกช่องเหลืองด้านบน (ประเภทมิเตอร์, ระดับแรงดัน ฯลฯ)', f_c),
    ('2. กรอกทุกช่องที่คอลัมน์ "สถานะ" ขึ้น ⚠ ต้องใส่ (ช่องที่ไม่ใช้กับตัวเลือกที่เลือกจะไม่ขึ้น)', f_c),
    ('3. เมื่อแถว "สถานะข้อมูล" ขึ้น ✅ ครบ ให้คัดลอกตัวเลขในส่วน "ตัวเลขที่ต้องพิมพ์ลงแพลตฟอร์ม" ไปพิมพ์ทีละช่อง', f_c),
    ('4. ส่วน "เช็คผล" บอกว่าแพลตฟอร์มจะแสดงผลเท่าไร เทียบกับโมเดลเต็ม (แพลตฟอร์มยังมีข้อจำกัด ดูแท็บสูตรของแพลตฟอร์ม)', f_c),
    ('', None),
    ('สิ่งที่ผมใส่ให้แล้ว', f_b),
    ('• ค่าไฟ TOU และค่าไฟแบบธรรมดาของ กฟภ. ทั้ง 3 ระดับแรงดัน (ตารางอัตรา กฟภ. ใช้ตั้งแต่บิลเดือน พ.ค. 2566) · ค่า Ft งวด ก.ย.–ธ.ค. 2569 = 0.1623 บาท (มติ กกพ. 22 ก.ค. 2569) · จำนวนวันจันทร์–ศุกร์ปี 2570 = 261 วัน (นับจากปฏิทิน)', f_c),
    ('• จากไฟล์ BESS Feasibility Model_rev01 ของ กฟผ.: อัตราคิดลด 8%, ค่าแรกเข้า ENZY 120,000 บาท, ค่าใช้จ่ายอื่นของแบต 35,000 บาท/ปี (เพิ่ม 1%/ปี), O&M เพิ่ม 0.5%/ปี, ใช้ความจุแบต 80%, อายุโครงการแบต 10 ปี, มูลค่าซาก 10%, ชาร์จจากโซลาร์ 4 ชม.', f_c),
    ('• ที่ไม่ใส่: ทุกอย่างที่ขึ้นกับลูกค้ารายนั้น, ใบเสนอราคา, และการตัดสินใจของ กฟผ. ที่ยังไม่มีเอกสาร', f_c),
], 1):
    c = rd.cell(row=i, column=1, value=t)
    if f: c.font = f
rd.column_dimensions['A'].width = 160

# ---------------- ค่าไฟ กฟภ. (shared, pre-filled) ----------------
tf = wb.create_sheet('ค่าไฟ กฟภ.')
tf['A1'] = 'ตารางค่าไฟ กฟภ. (ใส่ให้แล้วจากประกาศ)'; tf['A1'].font = f_t
tf['A2'] = 'ที่มา: ตารางอัตราค่าไฟฟ้า กฟภ. ใช้ตั้งแต่บิลเดือน พ.ค. 2566 (pea.co.th) · กฟน. ใช้อัตราเดียวกันแต่แบ่งระดับแรงดันต่างกัน · อัตราแบบธรรมดา (3.1) ใช้ได้เฉพาะลูกค้าเดิมก่อน พ.ย. 2558'
tf['A2'].font = f_note
for j, h in enumerate(['ระดับแรงดัน', 'เลือก', 'TOU: Peak (บาท/kWh)', 'TOU: Off-peak (บาท/kWh)', 'TOU: Demand (บาท/kW/เดือน)', 'ธรรมดา: ค่าไฟ (บาท/kWh)', 'ธรรมดา: Demand (บาท/kW/เดือน)'], 1):
    c = tf.cell(row=4, column=j, value=h); c.font = f_h; c.fill = fill_h; c.alignment = Alignment(wrap_text=True)
TAR = [('≥ 69 kV', 1, 4.1025, 2.5849, 74.14, 3.1097, 175.70), ('22–33 kV', 2, 4.1839, 2.6037, 132.93, 3.1471, 196.26), ('< 22 kV', 3, 4.3297, 2.6369, 210.00, 3.1751, 221.50)]
for i, row in enumerate(TAR):
    for j, v in enumerate(row):
        c = tf.cell(row=5 + i, column=1 + j, value=v); c.font = f_pre if j >= 2 else f_c
        if j >= 2: c.fill = fill_pre; c.number_format = '0.0000' if j in (2, 3, 5) else BAHT2
tf['A9'] = 'ค่า Ft (บาท/kWh)'; tf['C9'] = 0.1623; tf['C9'].font = f_pre; tf['C9'].fill = fill_pre; tf['C9'].number_format = '0.0000'
tf['D9'] = 'งวด ก.ย.–ธ.ค. 2569 · มติ กกพ. ครั้งที่ 29/2569 (22 ก.ค. 2569) · ต้องอัปเดตทุก 4 เดือน · ตรวจ 11 พ.ย. 2569: งวด ม.ค.–เม.ย. 2570 ยังไม่ประกาศ'; tf['D9'].font = f_note
tf['A10'] = 'วันจันทร์–ศุกร์ในปี 2570'; tf['C10'] = 261; tf['C10'].font = f_pre; tf['C10'].fill = fill_pre
tf['D10'] = 'นับจากปฏิทิน (ปี 2569 ก็ 261 วัน) · วันหยุดราชการที่ตรงวันธรรมดาให้กรอกในแท็บผลิตภัณฑ์'; tf['D10'].font = f_note
tf['A11'] = 'ช่วงเวลา Peak ของ TOU'; tf['C11'] = 'จันทร์–ศุกร์ 09:00–22:00 · วันเสาร์ อาทิตย์ และวันหยุดราชการเป็น Off-peak ทั้งวัน'; tf['C11'].font = f_c
for col, w in zip('ABCDEFG', [24, 8, 18, 20, 22, 20, 24]): tf.column_dimensions[col].width = w
TARIFF = {'peak': 'C', 'off': 'D', 'dT': 'E', 'norm': 'F', 'dN': 'G'}

# ---------------- master input list ----------------
# key, label, unit, products, condition (uses {meter} {um} {src} {bt} placeholders), group, who provides, document / method, prefill
C_METER1, C_METER2 = '{meter}=1', '{meter}=2'
INPUTS = [
    # ลูกค้า
    ('onpk', 'หน่วยไฟ On-Peak ต่อเดือน', 'kWh/เดือน', 'S SB', '{um}=1', 'ลูกค้า', 'ฝ่ายบัญชี / จัดซื้อของโรงงาน', 'บิลค่าไฟ TOU เดือนล่าสุด (ช่องหน่วย On-Peak)', None),
    ('pdem', 'Peak demand (ความต้องการพลังไฟฟ้าสูงสุด)', 'kW', 'SB B', None, 'ลูกค้า', 'ฝ่ายบัญชี / จัดซื้อของโรงงาน', 'บิลค่าไฟ (ช่องความต้องการพลังไฟฟ้าสูงสุด)', None),
    ('pdemMax', 'Peak demand สูงสุดในรอบ 12 เดือน', 'kW', 'SB B', 'FALSE', 'ลูกค้า', 'ฝ่ายบัญชี / จัดซื้อของโรงงาน', 'บิลค่าไฟ 12 เดือนย้อนหลัง (ค่าสูงสุด) · ใส่แล้วคิดกฎค่า Demand ขั้นต่ำ 70% ให้ · เว้นว่างได้', None),
    ('wdays', 'วันทำงานต่อปี', 'วัน', 'S SB', None, 'ลูกค้า', 'ผู้จัดการโรงงาน / ฝ่ายผลิต', 'ถาม "ทำงานกี่วันต่อสัปดาห์ หยุดยาวกี่วัน" แล้วคิดเป็นวันต่อปี', None),
    ('mon', 'จำนวนวันอาทิตย์ที่โรงงานหยุด (ไว้ชาร์จแบตด้วยไฟโซลาร์ส่วนเกิน)', 'วัน/ปี', 'SB', None, 'ลูกค้า', 'ผู้จัดการโรงงาน / ฝ่ายผลิต', 'ถาม "วันอาทิตย์หยุดทุกสัปดาห์ไหม" (ถ้าทำงาน 7 วันใส่ 0)', None),
    ('useman', 'สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', '%', 'S SB', '{um}=2', 'ลูกค้า', 'ไฟล์ 15 นาทีของลูกค้า (ขอผ่าน กฟภ.) วิเคราะห์โดยวิศวกร กฟผ.', 'จับคู่ไฟล์การใช้ไฟ 15 นาที 12 เดือน กับกราฟผลิตไฟรายชั่วโมง', None),
    ('custsur', 'ไฟโซลาร์เหลือของลูกค้าเองในวัน Peak', 'kWh/วัน', 'B', '{src}=2', 'ลูกค้า', 'ผู้ดูแลระบบโซลาร์ของลูกค้า', 'ระบบมอนิเตอร์โซลาร์ของลูกค้า หรือไฟล์ 15 นาที', None),
    ('relT', 'สัดส่วน Demand ที่แบตลดได้จริง (TOU)', '% ของกำลังแบต', 'SB B', C_METER1, 'ลูกค้า', 'ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.', 'จำลองตัดยอด 12 เดือน (ถ้าใส่ Peak demand สูงสุด 12 เดือน ระบบคิดกฎขั้นต่ำ 70% ให้)', None),
    ('relN', 'สัดส่วน Demand ที่แบตลดได้จริง (ธรรมดา)', '% ของกำลังแบต', 'SB B', C_METER2, 'ลูกค้า', 'ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.', 'เหมือนข้างบน แต่ค่า Demand วัดทุกช่วงเวลา', None),
    ('ndays', 'วันที่ต้องใช้แบตตัดยอด (มิเตอร์ธรรมดา, ชาร์จจากกริด)', 'วัน/ปี', 'B', 'AND({meter}=2,{src}=1)', 'ลูกค้า', 'ไฟล์ 15 นาทีของลูกค้า วิเคราะห์โดยวิศวกร กฟผ.', 'นับวันที่ไฟพุ่งเกินเป้า', None),
    # กฟภ. / กกพ. / ครม.
    ('peak', 'ค่าไฟช่วง Peak (TOU)', 'บาท/kWh', 'S SB B', C_METER1, 'กฟภ.', 'กฟภ.', 'ตารางอัตรา TOU ตามระดับแรงดัน (ดึงจากแท็บค่าไฟ กฟภ.)', 'tariff:peak'),
    ('off', 'ค่าไฟช่วง Off-peak (TOU)', 'บาท/kWh', 'S SB B', C_METER1, 'กฟภ.', 'กฟภ.', 'ตารางอัตรา TOU', 'tariff:off'),
    ('norm', 'ค่าไฟมิเตอร์แบบธรรมดา', 'บาท/kWh', 'S SB B', C_METER2, 'กฟภ.', 'กฟภ.', 'ตารางอัตราปกติ (3.1)', 'tariff:norm'),
    ('dT', 'ค่า Demand (TOU)', 'บาท/kW/เดือน', 'SB B', C_METER1, 'กฟภ.', 'กฟภ.', 'ตารางอัตรา TOU', 'tariff:dT'),
    ('dN', 'ค่า Demand (แบบธรรมดา)', 'บาท/kW/เดือน', 'SB B', C_METER2, 'กฟภ.', 'กฟภ.', 'ตารางอัตราปกติ (3.1)', 'tariff:dN'),
    ('ft', 'ค่า Ft', 'บาท/kWh', 'S SB B', None, 'กฟภ.', 'กกพ.', 'ประกาศค่า Ft งวดล่าสุด', "='ค่าไฟ กฟภ.'!$C$9"),
    ('wkd', 'วันจันทร์–ศุกร์ในปี', 'วัน', 'S SB B', None, 'กฟภ.', 'ปฏิทิน', 'นับจากปฏิทินของปีที่ประเมิน', "='ค่าไฟ กฟภ.'!$C$10"),
    ('hol', 'วันหยุดราชการที่ตรงวันจันทร์–ศุกร์', 'วัน', 'S SB B', None, 'กฟภ.', 'ครม. (ประกาศวันหยุดราชการประจำปี)', 'นับวันหยุดในประกาศที่ไม่ตรงเสาร์อาทิตย์ · ปฏิทิน 2570 ที่เผยแพร่ (อิงวันหยุดธนาคาร ธปท.) มี 19 วัน แต่ ครม. ยังไม่อนุมัติ (ตรวจ 11 พ.ย. 2569)', None),
    # ผู้รับเหมา / ผู้ขายอุปกรณ์
    ('kwp', 'ขนาดโซลาร์', 'kWp', 'S SB', None, 'ผู้รับเหมา', 'วิศวกร กฟผ. ร่วมกับผู้รับเหมา EPC', 'ออกแบบไม่ให้เกินไฟกลางวันของลูกค้า และไม่เกินพื้นที่หลังคา', None),
    ('cost', 'ต้นทุนติดตั้งโซลาร์ (เหมารวม)', 'บาท/W', 'S SB', None, 'ผู้รับเหมา', 'ผู้รับเหมา EPC โซลาร์ 2–3 ราย', 'ใบเสนอราคา ขอบเขตงานเดียวกัน', None),
    ('yld', 'ไฟที่ผลิตได้', 'kWh/kWp/ปี', 'S SB', None, 'ผู้รับเหมา', 'ผู้รับเหมา EPC (ผลจำลอง PVsyst) หรือวิศวกร กฟผ. (PVGIS)', 'ผลจำลองที่พิกัดโรงงาน หักเงาและทิศหลังคา', None),
    ('after9', 'สัดส่วนไฟโซลาร์ที่ผลิตหลัง 09:00', '%', 'S SB', None, 'ผู้รับเหมา', 'ผู้รับเหมา EPC หรือวิศวกร กฟผ.', 'จากผลจำลองรายชั่วโมงของไซต์', None),
    ('deg', 'แผงเสื่อมต่อปี', '%/ปี', 'S SB', None, 'ผู้รับเหมา', 'ผู้ผลิตแผง', 'datasheet และใบรับประกันกำลังผลิตแผง', None),
    ('om', 'O&M โซลาร์ (รวมค่าประกันและค่าบริหาร)', '% ของเงินลงทุน/ปี', 'S SB', None, 'ผู้รับเหมา', 'ผู้รับเหมา O&M + บริษัทประกันภัย', '(ค่าสัญญา O&M + เบี้ยประกัน) ÷ เงินลงทุน', None),
    ('invY', 'ปีที่เปลี่ยน inverter', 'ปีที่', 'S SB', None, 'ผู้รับเหมา', 'ผู้ขาย inverter', 'ระยะรับประกัน inverter', None),
    ('invC', 'ค่าเปลี่ยน inverter', 'บาท/kW', 'S SB', None, 'ผู้รับเหมา', 'ผู้ขาย inverter', 'ใบเสนอราคา inverter', None),
    ('bkwh', 'ความจุแบต', 'kWh', 'SB B', None, 'ผู้รับเหมา', 'วิศวกร กฟผ. ร่วมกับผู้ขายแบต', 'ออกแบบจากไฟล์ 15 นาทีของลูกค้า', None),
    ('bkw', 'กำลังแบต', 'kW', 'SB B', None, 'ผู้รับเหมา', 'วิศวกร กฟผ. ร่วมกับผู้ขายแบต', 'ออกแบบจากไฟล์ 15 นาทีของลูกค้า', None),
    ('dod', 'ความจุที่ใช้ได้ต่อรอบ', '%', 'SB B', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'เงื่อนไขรับประกัน · ไฟล์ BESS ของ กฟผ. ใช้ 400/500 kWh', 0.8),
    ('rte', 'ประสิทธิภาพชาร์จ-จ่าย (รวมไฟของแอร์แบต)', '%', 'SB B', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'datasheet แบต + ไฟที่ระบบระบายความร้อนใช้', None),
    ('bpack', 'แบตใหม่: เซลล์ + BMS + ตู้', 'บาท/kWh', 'SB B', '{bt}=1', 'ผู้รับเหมา', 'ผู้ขายแบต', 'ใบเสนอราคา', None),
    ('bpcs', 'แบตใหม่: PCS', 'บาท/kW', 'SB B', '{bt}=1', 'ผู้รับเหมา', 'ผู้ขายแบต', 'ใบเสนอราคา', None),
    ('binst', 'แบตใหม่: ค่าติดตั้ง', 'บาท/kWh', 'SB B', '{bt}=1', 'ผู้รับเหมา', 'ผู้รับเหมา BESS', 'ใบเสนอราคา', None),
    ('blump', 'แบตใหม่: ระบบดับเพลิง + EMS (ก้อน)', 'บาท', 'SB B', '{bt}=1', 'ผู้รับเหมา', 'ผู้รับเหมา BESS', 'ใบเสนอราคา', None),
    ('slsys', 'แบตมือสอง: BESS system (ผ่านทดสอบ + BMS)', 'บาท/kWh', 'SB B', '{bt}=2', 'ผู้รับเหมา', 'ผู้ขายแบตมือสอง', 'ใบเสนอราคา', None),
    ('slturn', 'แบตมือสอง: ค่าติดตั้ง Turnkey', 'บาท/kWh', 'SB B', '{bt}=2', 'ผู้รับเหมา', 'ผู้รับเหมา BESS', 'รวม PCS, EMS, ตู้, ระบบดับเพลิง, ติดตั้ง', None),
    ('bdeg', 'แบตเสื่อมต่อปี', '%/ปี', 'SB B', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'ใบรับประกัน (ความจุที่เหลือเมื่อครบประกัน ÷ จำนวนปี)', None),
    ('bom', 'O&M แบต', '% ของเงินลงทุน/ปี', 'SB B', None, 'ผู้รับเหมา', 'ผู้รับเหมา O&M แบต', 'ค่าสัญญา O&M ÷ เงินลงทุนแบต', None),
    ('blife', 'อายุโครงการแบต', 'ปี', 'B', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'ระยะรับประกัน · ไฟล์ BESS ของ กฟผ. ใช้ 10 ปี', 10),
    ('bsalv', 'มูลค่าซากแบตปีสุดท้าย', '% ของเงินลงทุน', 'B', None, 'ผู้รับเหมา', 'ผู้รับซื้อคืน / รีไซเคิลแบต', 'ใบเสนอราคารับซื้อคืน · ไฟล์ BESS ของ กฟผ. ใช้ 10% · ติดลบได้ถ้ามีค่ารื้อถอน', 0.1),
    ('bswap', 'ปีที่ต้องเปลี่ยนแบต (อายุแบต)', 'ปี', 'SB', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'ระยะรับประกันแบต · ไฟล์ BESS ของ กฟผ. ใช้ 10 ปี', 10),
    ('bswapPct', 'ราคาแบตชุดใหม่ตอนเปลี่ยน', '% ของเงินลงทุนแบตเดิม', 'SB', None, 'ผู้รับเหมา', 'ผู้ขายแบต', 'ราคาคาดการณ์ ณ ปีที่เปลี่ยน (ใส่ 0 ถ้าอายุแบตไม่น้อยกว่าอายุโครงการ)', None),
    ('chgh', 'ชั่วโมงที่ใช้ชาร์จแบตจากโซลาร์ (ใช้เช็คขนาดโซลาร์)', 'ชม./วัน', 'B', '{src}=2', 'ผู้รับเหมา', 'ผู้รับเหมา BESS', 'ไฟล์ BESS ของ กฟผ. ใช้ 4 ชม.', 4),
    # กฟผ.
    ('disc', 'ส่วนลด PPA ให้ลูกค้า', '%', 'S SB', None, 'กฟผ.', 'ฝ่ายการตลาด / คณะทำงานกำหนดราคา กฟผ.', 'เงื่อนไขที่เสนอลูกค้า', None),
    ('share', 'ส่วนแบ่งผลประหยัดสุทธิที่ กฟผ. ได้ (ส่วนแบต)', '%', 'SB B', None, 'กฟผ.', 'ฝ่ายการตลาด / คณะทำงานกำหนดราคา กฟผ.', 'เงื่อนไขสัญญาแบ่งผลประหยัด', None),
    ('term', 'อายุสัญญา', 'ปี', 'S', None, 'กฟผ.', 'ฝ่ายกฎหมาย / การตลาด กฟผ.', 'ร่างสัญญา PPA', None),
    ('hlife', 'อายุโครงการ', 'ปี', 'SB', None, 'กฟผ.', 'ฝ่ายกฎหมาย / การตลาด กฟผ.', 'ร่างสัญญา', None),
    ('rate', 'อัตราคิดลด', '%', 'S SB B', None, 'กฟผ.', 'ฝ่ายการเงิน กฟผ.', 'นโยบาย hurdle rate · ไฟล์ BESS ของ กฟผ. ใช้ 8%', 0.08),
    ('esc', 'ค่าไฟขึ้นต่อปี', '%/ปี', 'S SB B', None, 'กฟผ.', 'ฝ่ายวางแผน กฟผ.', 'สมมติฐานจาก PDP และแนวโน้มค่า Ft', None),
    ('escY', 'ใช้อัตราค่าไฟขึ้นข้างบนถึงปีที่', 'ปีที่', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายวางแผน กฟผ.', 'เว้นว่าง = ใช้อัตราเดียวตลอดโครงการ', None),
    ('esc2', 'ค่าไฟขึ้นต่อปีหลังจากนั้น', '%/ปี', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายวางแผน กฟผ.', 'เว้นว่าง = ใช้อัตราเดียวกับข้างบน', None),
    ('enzy', 'ค่าแรกเข้า ENZY (ครั้งเดียว)', 'บาท', 'S SB B', None, 'กฟผ.', 'หน่วยงานที่ดูแล ENZY', 'ไฟล์ BESS ของ กฟผ. ใช้ 120,000 บาท (ใส่ 0 ถ้าไม่ใช้ ENZY)', 120000),
    ('othS', 'ค่าใช้จ่ายอื่นต่อปี: ส่วนโซลาร์', 'บาท/ปี', 'S SB', None, 'กฟผ.', 'ฝ่ายบัญชี กฟผ.', 'ค่าใช้จ่ายที่ไม่อยู่ใน O&M (ใส่ 0 ถ้ารวมแล้ว)', None),
    ('othB', 'ค่าใช้จ่ายอื่นต่อปี: ส่วนแบต', 'บาท/ปี', 'SB B', None, 'กฟผ.', 'ฝ่ายบัญชี กฟผ.', 'ไฟล์ BESS ของ กฟผ. ใช้ 35,000 บาท', 35000),
    ('xfer', 'มูลค่าที่ได้ตอนโอนระบบปลายสัญญา', 'บาท', 'S SB', None, 'กฟผ.', 'ฝ่ายกฎหมาย / การตลาด กฟผ.', 'เงื่อนไขในสัญญา (ใส่ 0 ถ้าโอนให้ลูกค้าฟรี · ติดลบได้ถ้ามีค่ารื้อถอน)', None),
    ('inf', 'O&M ขึ้นต่อปี', '%/ปี', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายบัญชี กฟผ.', 'ไฟล์ BESS ของ กฟผ. ใช้ 0.5%', 0.005),
    ('othG', 'ค่าใช้จ่ายอื่นเพิ่มขึ้นต่อปี', '%/ปี', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายบัญชี กฟผ.', 'ไฟล์ BESS ของ กฟผ. ใช้ 1%', 0.01),
    ('tax', 'อัตราภาษีเงินได้', '%', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายบัญชี กฟผ.', 'กฟผ. ไม่เสียภาษีเงินได้นิติบุคคล จึงใช้ 0 · ใส่ 20% ถ้าต้องการเทียบแบบเอกชน (ค่าเสื่อมเส้นตรงตลอดอายุโครงการ)', 0),
    ('debt', 'สัดส่วนเงินกู้', '% ของเงินลงทุน', 'S SB B', 'FALSE', 'กฟผ.', 'ฝ่ายการเงิน กฟผ.', '0 = ใช้เงินของ กฟผ. ทั้งหมด · ถ้ากู้ จะแสดง NPV/IRR ส่วนทุนเพิ่ม', 0),
    ('kd', 'ดอกเบี้ยเงินกู้', '%/ปี', 'S SB B', '{R_debt}>0', 'กฟผ.', 'ฝ่ายการเงิน กฟผ.', 'อัตราพันธบัตรหรือเงินกู้ล่าสุดของ กฟผ.', None),
    ('tenor', 'ระยะผ่อนเงินกู้', 'ปี', 'S SB B', '{R_debt}>0', 'กฟผ.', 'ฝ่ายการเงิน กฟผ.', 'เงื่อนไขเงินกู้ (ผ่อนเงินงวดเท่ากันทุกปี)', None),
]
GROUPS = [('ลูกค้า', '1. ข้อมูลจากลูกค้า (โรงงาน)'), ('กฟภ.', '2. ข้อมูลจาก กฟภ. / กกพ. / ครม.'), ('ผู้รับเหมา', '3. ข้อมูลจากผู้รับเหมา / ผู้ขายอุปกรณ์'), ('กฟผ.', '4. ข้อมูลที่ กฟผ. กำหนด')]
PRODUCTS = [
    ('S', 'Solar PPA', 'กฟผ. ติดโซลาร์บนหลังคาโรงงาน แล้วขายไฟให้ลูกค้าถูกกว่าค่าไฟการไฟฟ้า',
     [('meter', 'ประเภทมิเตอร์ของลูกค้า', '1 = TOU · 2 = แบบธรรมดา', '1,2'), ('um', 'วิธีหาสัดส่วนไฟที่ลูกค้าใช้', '1 = คำนวณจากบิล · 2 = ใส่เองจากไฟล์ 15 นาที', '1,2'), ('volt', 'ระดับแรงดัน (ดูในบิล)', '1 = ≥ 69 kV · 2 = 22–33 kV · 3 = < 22 kV', '1,2,3')]),
    ('SB', 'Solar + Battery', 'กฟผ. ติดโซลาร์และแบต ใช้ไฟโซลาร์ตอนกลางวัน เก็บไฟเข้าแบตไว้จ่ายช่วงค่าไฟแพง',
     [('meter', 'ประเภทมิเตอร์ของลูกค้า', '1 = TOU · 2 = แบบธรรมดา', '1,2'), ('um', 'วิธีหาสัดส่วนไฟที่ลูกค้าใช้', '1 = คำนวณจากบิล · 2 = ใส่เองจากไฟล์ 15 นาที', '1,2'), ('volt', 'ระดับแรงดัน (ดูในบิล)', '1 = ≥ 69 kV · 2 = 22–33 kV · 3 = < 22 kV', '1,2,3'), ('bt', 'ประเภทแบต', '1 = แบตใหม่ · 2 = แบตมือสอง', '1,2')]),
    ('B', 'Battery', 'กฟผ. ติดแบตอย่างเดียว ชาร์จไฟตอนถูก จ่ายตอนแพง และลดค่า Demand แล้วแบ่งผลประหยัดกับลูกค้า',
     [('meter', 'ประเภทมิเตอร์ของลูกค้า', '1 = TOU · 2 = แบบธรรมดา', '1,2'), ('src', 'แหล่งไฟชาร์จแบต', '1 = ชาร์จจากกริด Off-peak · 2 = โซลาร์ส่วนเกินของลูกค้าเอง', '1,2'), ('volt', 'ระดับแรงดัน (ดูในบิล)', '1 = ≥ 69 kV · 2 = 22–33 kV · 3 = < 22 kV', '1,2,3'), ('bt', 'ประเภทแบต', '1 = แบตใหม่ · 2 = แบตมือสอง', '1,2')]),
]

def build(code, name, desc, sels):
    ws = wb.create_sheet(name)
    ws['A1'] = f'{name}: input → สูตร → ตัวเลขที่ต้องพิมพ์ลงแพลตฟอร์ม'; ws['A1'].font = f_t
    ws['A2'] = desc; ws['A2'].font = f_note
    S = {}
    for i, (k, lab, note, opts) in enumerate(sels):
        r = 4 + i
        ws.cell(row=r, column=1, value=lab).font = f_b
        c = ws.cell(row=r, column=4, value=TEST.get(f'{code}:{k}', 2 if k == 'volt' else 1)); c.font = f_in; c.fill = fill_y; c.alignment = Alignment(horizontal='center')
        ws.cell(row=r, column=5, value=note).font = f_note
        dv = DataValidation(type='list', formula1=f'"{opts}"'); ws.add_data_validation(dv); dv.add(c)
        S[k] = f'$D${r}'
    for k in ('meter', 'um', 'src', 'bt', 'volt'): S.setdefault(k, '1')
    r = 4 + len(sels) + 1
    status_row = r; r += 2
    HR = r
    for j, h in enumerate(['ข้อมูล', 'หน่วย', 'ค่า', '', 'ได้จากใคร', 'เอกสาร / วิธีหา', 'สถานะ'], 1):
        c = ws.cell(row=HR, column=j, value=h); c.font = f_h; c.fill = fill_h
    r += 1
    R = {}; miss_rows = []
    for gkey, gtitle in GROUPS:
        items = [x for x in INPUTS if x[5] == gkey and code in x[3].split()]
        if not items: continue
        c = ws.cell(row=r, column=1, value=gtitle); c.font = f_b
        for j in range(1, 8): ws.cell(row=r, column=j).fill = PatternFill('solid', fgColor=GROUP_FILL[gkey])
        r += 1
        for k, lab, unit, prods, cond, grp, who, doc, pre in items:
            ws.cell(row=r, column=1, value=lab).font = f_c
            ws.cell(row=r, column=2, value=unit).font = f_c
            if k in TEST:
                val, font, fill = TEST[k], f_in, fill_in
            elif isinstance(pre, str) and pre.startswith('tariff:'):
                col = TARIFF[pre.split(':')[1]]
                val, font, fill = f"=INDEX('ค่าไฟ กฟภ.'!${col}$5:${col}$7,{S['volt']})", f_pre, fill_pre
            elif pre is not None:
                val, font, fill = pre, f_pre, fill_pre
            else:
                val, font, fill = None, f_in, fill_in
            c = ws.cell(row=r, column=3, value=val); c.font = font; c.fill = fill
            c.number_format = PCT if unit.startswith('%') else ('0.0000' if unit == 'บาท/kWh' else (BAHT2 if unit == 'บาท/kW/เดือน' else BAHT))
            ws.cell(row=r, column=5, value=who).font = f_b
            w = ws.cell(row=r, column=6, value=doc); w.font = f_note; w.alignment = wrap
            need = 'TRUE' if cond is None else cond.format(**S, **{'R_' + kk: vv for kk, vv in R.items()})
            if cond == 'FALSE':
                ws.cell(row=r, column=7, value='ไม่บังคับ').font = f_note
            else:
                ws.cell(row=r, column=7, value=f'=IF(AND({need},C{r}=""),"⚠ ต้องใส่",IF({need},"✓","ไม่ใช้"))').font = f_warn
            ws.cell(row=r, column=8, value=f'=IF(AND({need},C{r}=""),1,0)').font = f_note
            for j in range(1, 8): ws.cell(row=r, column=j).border = box
            R[k] = f'$C${r}'; miss_rows.append(r)
            r += 1
    ws.cell(row=status_row, column=1, value='สถานะข้อมูล').font = f_b
    miss = f'SUM(H{min(miss_rows)}:H{max(miss_rows)})'
    c = ws.cell(row=status_row, column=4, value=f'=IF({miss}=0,"✅ ครบ","ยังขาด "&{miss}&" ช่อง")'); c.font = Font(name=F, size=12, bold=True, color='B3261E')
    OK = f'$D${status_row}="✅ ครบ"'
    # derived
    r += 1
    c = ws.cell(row=r, column=1, value='5. ค่าที่คำนวณจาก input (สูตร)'); c.font = f_b
    for j in range(1, 8): ws.cell(row=r, column=j).fill = PatternFill('solid', fgColor=GROUP_FILL['คำนวณ'])
    r += 1
    G = lambda k: R[k] if k in R else '0'
    DER = []
    DER.append(('pdays', 'วัน Peak ต่อปี', 'วัน', f'{G("wkd")}-{G("hol")}', BAHT, 'วันจันทร์–ศุกร์ − วันหยุดราชการ'))
    if code in ('S', 'SB'):
        DER += [
            ('solarday', 'ไฟโซลาร์ต่อวัน', 'kWh/วัน', f'{G("kwp")}*{G("yld")}/365', BAHT, 'kWp × ไฟที่ผลิตได้ ÷ 365'),
            ('dayload', 'ไฟกลางวันต่อวันทำงาน (ประมาณจากบิล)', 'kWh/วัน', f'IF({S["um"]}=1,{G("onpk")}/(C{{pdays}}/12)*9/13,"")', BAHT, 'หน่วย On-Peak ÷ วัน Peak ต่อเดือน × 9 ÷ 13 [ประมาณ: โหลดเรียบช่วง 09:00–22:00]'),
            ('use', 'สัดส่วนไฟโซลาร์ที่ลูกค้าใช้ได้', '%', f'IF({S["um"]}=1,MIN(C{{dayload}},C{{solarday}})*{G("wdays")}/({G("kwp")}*{G("yld")}),{G("useman")})', PCT, 'min(ไฟกลางวัน, ไฟโซลาร์ต่อวัน) × วันทำงาน ÷ ไฟโซลาร์ทั้งปี'),
            ('s', 'สัดส่วนไฟโซลาร์ที่ตรงช่วง Peak', 'สัดส่วน', f'MIN(1,C{{pdays}}/{G("wdays")})*{G("after9")}', '0.00', '(วัน Peak ÷ วันทำงาน) × สัดส่วนหลัง 09:00'),
            ('avoid', 'ราคาที่โซลาร์ทดแทนได้', 'บาท/kWh', f'IF({S["meter"]}=1,C{{s}}*{G("peak")}+(1-C{{s}})*{G("off")}+{G("ft")},{G("norm")}+{G("ft")})', '0.0000', 'TOU: s × Peak + (1 − s) × Off-peak + Ft · ธรรมดา: ค่าไฟธรรมดา + Ft'),
            ('ppa', 'ราคา PPA', 'บาท/kWh', f'C{{avoid}}*(1-{G("disc")})', '0.0000', 'ราคาที่โซลาร์ทดแทนได้ × (1 − ส่วนลด)'),
            ('srev', 'รายได้โซลาร์ปีแรก', 'บาท/ปี', f'{G("kwp")}*{G("yld")}*C{{use}}*C{{ppa}}', BAHT, 'kWp × ไฟที่ผลิตได้ × สัดส่วนที่ลูกค้าใช้ × ราคา PPA'),
            ('capS', 'เงินลงทุนโซลาร์', 'บาท', f'{G("cost")}*{G("kwp")}*1000', BAHT, 'ต้นทุน × kWp × 1,000'),
            ('gS', 'อัตราเติบโตรายได้จริง (โซลาร์)', '%/ปี', f'(1+{G("esc")})*(1-{G("deg")})-1', PCT, '(1 + ค่าไฟขึ้น) × (1 − แผงเสื่อม) − 1'),
            ('gSL', 'อัตราเติบโตรายได้จริงหลังปีที่เปลี่ยนอัตรา (โซลาร์)', '%/ปี', f'(1+IF({G("esc2")}="",{G("esc")},{G("esc2")}))*(1-{G("deg")})-1', PCT, 'เหมือนข้างบน แต่ใช้ค่าไฟขึ้นช่วงหลัง'),
        ]
    if code in ('SB', 'B'):
        DER += [
            ('capB', 'เงินลงทุนแบต', 'บาท', f'IF({S["bt"]}=1,({G("bpack")}+{G("binst")})*{G("bkwh")}+{G("bpcs")}*{G("bkw")}+{G("blump")},({G("slsys")}+{G("slturn")})*{G("bkwh")})', BAHT, 'ใหม่: (เซลล์ + ติดตั้ง) × kWh + PCS × kW + ก้อน · มือสอง: (BESS + Turnkey) × kWh'),
            ('usable', 'ความจุที่ใช้ได้ต่อรอบ', 'kWh', f'{G("bkwh")}*{G("dod")}', BAHT, 'ความจุ × % ที่ใช้ได้'),
            ('bval', 'มูลค่าไฟที่แบตจ่าย', 'บาท/kWh', f'IF({S["meter"]}=1,{G("peak")}+{G("ft")},{G("norm")}+{G("ft")})', '0.0000', 'TOU: Peak + Ft'),
            ('gprice', 'ค่าไฟที่ใช้ชาร์จจากกริด', 'บาท/kWh', f'IF({S["meter"]}=1,{G("off")}+{G("ft")},{G("norm")}+{G("ft")})', '0.0000', 'TOU: Off-peak + Ft'),
            ('dcut', 'Demand ที่ตัดได้', 'kW', f'IF({S["meter"]}=1,{G("relT")},{G("relN")})*MIN({G("bkw")},{G("pdem")})', BAHT2, '% ที่ลดได้ × min(kW แบต, Peak demand)'),
            ('dsave', 'ค่า Demand ที่ลดได้ต่อปี', 'บาท/ปี', f'IF({S["meter"]}=1,{G("dT")},{G("dN")})*12*IF({G("pdemMax")}="",C{{dcut}},MAX({G("pdem")},0.7*{G("pdemMax")})-MAX({G("pdem")}-C{{dcut}},0.7*{G("pdemMax")}))', BAHT, 'อัตรา Demand × 12 × kW ที่ลดได้ · ถ้าใส่ Peak demand สูงสุด 12 เดือน: max(Peak, 70% ของสูงสุด) − max(Peak − kW ที่ตัด, 70% ของสูงสุด)'),
            ('gB', 'อัตราเติบโตรายได้จริง (แบต)', '%/ปี', f'(1+{G("esc")})*(1-{G("bdeg")})-1', PCT, '(1 + ค่าไฟขึ้น) × (1 − แบตเสื่อม) − 1'),
            ('gBL', 'อัตราเติบโตรายได้จริงหลังปีที่เปลี่ยนอัตรา (แบต)', '%/ปี', f'(1+IF({G("esc2")}="",{G("esc")},{G("esc2")}))*(1-{G("bdeg")})-1', PCT, 'เหมือนข้างบน แต่ใช้ค่าไฟขึ้นช่วงหลัง'),
        ]
    if code == 'SB':
        DER += [
            ('surwd', 'ไฟโซลาร์เหลือในวันทำงาน', 'kWh/วัน', f'IF({S["um"]}=1,MAX(0,C{{solarday}}-C{{dayload}}),0)', BAHT, 'max(0, ไฟโซลาร์ต่อวัน − ไฟกลางวัน)'),
            ('hfree', 'ไฟเข้าแบตฟรีต่อปี', 'kWh/ปี', f'MIN(C{{surwd}},C{{usable}})*C{{pdays}}+(C{{usable}}-MIN(C{{surwd}},C{{usable}}))*MIN({G("mon")},C{{pdays}})*IF(C{{solarday}}>=C{{usable}},1,0)', BAHT, 'ไฟเหลือวันทำงาน + วันจันทร์ที่ชาร์จจากไฟวันอาทิตย์'),
            ('hgrid', 'ไฟเข้าแบตจากกริดต่อปี', 'kWh/ปี', f'IF({S["meter"]}=1,1,0)*(C{{usable}}-MIN(C{{surwd}},C{{usable}}))*MAX(0,C{{pdays}}-MIN({G("mon")},C{{pdays}}))', BAHT, 'ส่วนที่ขาด × วัน Peak ที่เหลือ (เฉพาะ TOU)'),
            ('bnet', 'ผลประหยัดสุทธิส่วนแบตปีแรก', 'บาท/ปี', f'(C{{hfree}}+C{{hgrid}})*{G("rte")}*C{{bval}}+C{{dsave}}-C{{hgrid}}*C{{gprice}}', BAHT, 'ไฟที่แบตจ่าย × มูลค่าไฟ + ค่า Demand − ค่าไฟชาร์จ'),
            ('nswap', 'เปลี่ยนแบตกี่ครั้งในอายุโครงการ', 'ครั้ง', f'IF({G("bswap")}<{G("hlife")},INT(({G("hlife")}-1)/{G("bswap")}),0)', BAHT, 'จำนวนปีที่ k × อายุแบต < อายุโครงการ'),
            ('swapc', 'ค่าแบตชุดใหม่ต่อครั้ง', 'บาท', f'{G("bswapPct")}*C{{capB}}', BAHT, 'ราคาแบตชุดใหม่ (%) × เงินลงทุนแบต'),
        ]
    if code == 'B':
        DER += [
            ('bin', 'ไฟเข้าแบตต่อปี', 'kWh/ปี', f'IF({S["src"]}=2,MIN(C{{usable}},{G("custsur")})*C{{pdays}},C{{usable}}*IF({S["meter"]}=1,C{{pdays}},{G("ndays")}))', BAHT, 'ชาร์จฟรี: จำกัดด้วยไฟเหลือของลูกค้า'),
            ('bnet', 'ผลประหยัดสุทธิปีแรก', 'บาท/ปี', f'IF({S["src"]}=2,C{{bin}}*{G("rte")}*C{{bval}}+C{{dsave}},IF({S["meter"]}=1,C{{bin}}*{G("rte")}*C{{bval}}+C{{dsave}}-C{{bin}}*C{{gprice}},C{{dsave}}-C{{bin}}*(1-{G("rte")})*C{{gprice}}))', BAHT, 'ผลประหยัดของลูกค้าก่อนแบ่ง หักค่าไฟชาร์จแล้ว'),
            ('needkwp', 'ขนาดโซลาร์ขั้นต่ำของลูกค้า (ชาร์จฟรี)', 'kWp', f'IF({S["src"]}=2,C{{usable}}/{G("chgh")}*1.3,"")', BAHT, 'ความจุที่ใช้ได้ ÷ ชม.ชาร์จ × 1.3 (ไฟล์ BESS ของ กฟผ.)'),
        ]
    drow = {}
    for k, *_ in DER: drow[k] = r; r += 1
    for k, lab, unit, fml, fmt, how in DER:
        rr = drow[k]
        for kk, vv in drow.items(): fml = fml.replace('{' + kk + '}', str(vv))
        ws.cell(row=rr, column=1, value=lab).font = f_c
        ws.cell(row=rr, column=2, value=unit).font = f_c
        c = ws.cell(row=rr, column=3, value=f'=IFERROR({fml},"")'); c.font = f_c; c.number_format = fmt
        ws.cell(row=rr, column=5, value='คำนวณ').font = f_b
        w = ws.cell(row=rr, column=6, value=how); w.font = f_note; w.alignment = wrap
        for j in range(1, 8): ws.cell(row=rr, column=j).border = box
        R[k] = f'$C${rr}'
    # platform fields
    r += 1
    c = ws.cell(row=r, column=1, value='6. ตัวเลขที่ต้องพิมพ์ลงแพลตฟอร์ม (แสดงเมื่อสถานะข้อมูล ✅ ครบ)'); c.font = f_b
    for j in range(1, 8): ws.cell(row=r, column=j).fill = PatternFill('solid', fgColor=GROUP_FILL['แพลตฟอร์ม'])
    r += 1
    for j, h in enumerate(['ช่องในแพลตฟอร์ม', 'หน่วยที่พิมพ์', 'ตัวเลขที่ต้องพิมพ์', '', 'สูตร', 'ข้อควรรู้'], 1):
        c = ws.cell(row=r, column=j, value=h); c.font = f_h; c.fill = fill_h
    r += 1
    X = lambda k: R[k]
    OMG = f'IF({X("inf")}="",1,{X("inf")}*100)'; OTHG = f'IF({X("othG")}="",1,{X("othG")}*100)'
    if code == 'S':
        inv = f'{X("capS")}+{X("enzy")}'; life = X('term'); rev = X('srev'); grow = f'{X("gS")}*100'
        om = f'{X("om")}*{X("capS")}'; oth = X('othS'); salv = X('xfer')
        repc = f'IF({X("invY")}<={life},{X("invC")}*{X("kwp")},0)'; repy = f'IF({X("invY")}<={life},{X("invY")},0)'; peakf = X('avoid')
        energy = f'{X("kwp")}*{X("yld")}*{X("use")}'
    elif code == 'SB':
        inv = f'{X("capS")}+{X("capB")}+{X("enzy")}'; life = X('hlife'); rev = X('srev'); grow = f'{X("gS")}*100'
        om = f'{X("om")}*{X("capS")}+{X("bom")}*{X("capB")}'; oth = f'{X("othS")}+{X("othB")}'; salv = X('xfer')
        repc = f'IF({X("invY")}<={life},{X("invC")}*{X("kwp")},0)'; repy = f'IF({X("invY")}<={life},{X("invY")},0)'; peakf = f'IF({S["meter"]}=1,{X("peak")},{X("norm")})'
        energy = f'{X("kwp")}*{X("yld")}*{X("use")}'
    else:
        inv = f'{X("capB")}+{X("enzy")}'; life = X('blife'); rev = f'{X("share")}*{X("bnet")}'; grow = f'{X("gB")}*100'
        om = f'{X("bom")}*{X("capB")}'; oth = X('othB'); salv = f'{X("bsalv")}*{X("capB")}'; repc = '0'; repy = '0'; peakf = f'IF({S["meter"]}=1,{X("peak")},{X("norm")})'
        energy = f'{X("bin")}*{X("rte")}'
    if code == 'S': cs = f'{X("kwp")}*{X("yld")}*{X("use")}*({X("avoid")}-{X("ppa")})'
    elif code == 'SB': cs = f'{X("kwp")}*{X("yld")}*{X("use")}*({X("avoid")}-{X("ppa")})+(1-{X("share")})*{X("bnet")}'
    else: cs = f'(1-{X("share")})*{X("bnet")}'
    FIELDS = [
        ('inv', 'เงินลงทุนเริ่มต้น', 'บาท', inv, BAHT2, 'เงินลงทุน + ค่าแรกเข้า ENZY', ''),
        ('life', 'อายุโครงการ', 'ปี', life, BAHT, 'อายุสัญญา / อายุแบต', 'ต้องเท่ากับอายุสัญญา'),
        ('rate', 'อัตราคิดลด', '%', f'{X("rate")}*100', '0.0', 'อัตราคิดลด × 100', 'พิมพ์เป็นตัวเลข % เช่น 8'),
        ('rev', 'รายได้ / ผลประหยัดปีแรก', 'บาท/ปี', rev, BAHT2,
         {'S': 'kWp × ไฟที่ผลิตได้ × สัดส่วนที่ลูกค้าใช้ × ราคา PPA', 'SB': 'ส่วนโซลาร์เท่านั้น (ส่วนแบตใส่ในรายได้ส่วนที่ 2)', 'B': 'ส่วนแบ่ง กฟผ. × ผลประหยัดสุทธิ'}[code], 'รายได้ของ กฟผ. ต้องไม่เกินผลประหยัดของลูกค้า'),
        ('grow', 'อัตราเติบโตของรายได้', '%/ปี', grow, '0.000000', '(1 + ค่าไฟขึ้น) × (1 − เสื่อม) − 1', 'ติดลบได้ พิมพ์ทศนิยมตามนี้'),
    ]
    GL = 'gBL' if code == 'B' else 'gSL'
    FIELDS += [('sw', 'ปีที่เปลี่ยนอัตราเติบโต (0 = ไม่เปลี่ยน)', 'ปี', f'IF({X("escY")}="",0,{X("escY")})', BAHT, 'ใช้อัตราค่าไฟขึ้นแรกถึงปีนี้', 'เว้นว่าง = ใช้อัตราเดียว'),
               ('growL', 'อัตราเติบโตของรายได้ หลังปีนั้น', '%/ปี', f'{X(GL)}*100', '0.000000', '(1 + ค่าไฟขึ้นช่วงหลัง) × (1 − เสื่อม) − 1', '')]
    if code == 'SB':
        FIELDS += [('rev2', 'รายได้ส่วนที่ 2 ปีแรก (ส่วนแบต)', 'บาท/ปี', f'{X("share")}*{X("bnet")}', BAHT2, 'ส่วนแบ่ง กฟผ. × ผลประหยัดสุทธิส่วนแบต', ''),
                   ('grow2', 'อัตราเติบโตรายได้ส่วนที่ 2', '%/ปี', f'{X("gB")}*100', '0.000000', '(1 + ค่าไฟขึ้น) × (1 − แบตเสื่อม) − 1', 'ติดลบได้'),
                   ('grow2L', 'อัตราเติบโตรายได้ส่วนที่ 2 หลังปีนั้น', '%/ปี', f'{X("gBL")}*100', '0.000000', 'ใช้ค่าไฟขึ้นช่วงหลัง', ''),
                   ('r2reset', 'รายได้ส่วนที่ 2 กลับเป็นของใหม่ทุก (ปี)', 'ปี', f'IF({X("bswap")}<{X("hlife")},{X("bswap")},0)', BAHT, 'อายุแบต (ถ้าต้องเปลี่ยนในอายุโครงการ)', 'เปลี่ยนแบตแล้วความจุกลับมาเต็ม'),
                   ('r2deg', 'อัตราเสื่อมของรายได้ส่วนที่ 2', '%/ปี', f'{X("bdeg")}*100', '0.000000', 'แบตเสื่อมต่อปี', ''),
                   ('rep2c', 'ค่าเปลี่ยนอุปกรณ์รายการที่ 2', 'บาท', f'IF({X("bswap")}<{X("hlife")},{X("swapc")},0)', BAHT2, 'ค่าแบตชุดใหม่ต่อครั้ง', ''),
                   ('rep2y', 'ปีที่เปลี่ยนรายการที่ 2 (0 = ไม่มี)', 'ปี', '0', BAHT, 'ใช้ช่องเปลี่ยนซ้ำแทน', ''),
                   ('rep2e', 'เปลี่ยนรายการที่ 2 ซ้ำทุก (ปี)', 'ปี', f'IF({X("bswap")}<{X("hlife")},{X("bswap")},0)', BAHT, 'อายุแบต · ไม่นับปีสุดท้ายของโครงการ', '')]
    FIELDS += [
        ('om', 'ค่า O&M ปีแรก', 'บาท/ปี', om, BAHT2, 'O&M % × เงินลงทุน', ''),
        ('omg', 'อัตราเติบโตของ O&M', '%/ปี', OMG, '0.000000', 'O&M ขึ้นต่อปี × 100', ''),
        ('oth', 'ค่าใช้จ่ายอื่นปีแรก', 'บาท/ปี', oth, BAHT2, 'ค่าใช้จ่ายอื่นต่อปี', ''),
        ('othg', 'อัตราเติบโตค่าใช้จ่ายอื่น', '%/ปี', OTHG, '0.000000', 'ค่าใช้จ่ายอื่นเพิ่มขึ้นต่อปี × 100', ''),
        ('salv', 'มูลค่าซาก', 'บาท', salv, BAHT2, 'มูลค่าปลายโครงการ', ''),
        ('repc', 'ค่าเปลี่ยนอุปกรณ์', 'บาท', repc, BAHT2, 'ค่าเปลี่ยน inverter × kWp' if code != 'B' else 'ไม่มี (อายุโครงการเท่าอายุแบต)', ''),
        ('repy', 'ปีที่เปลี่ยนอุปกรณ์ (0 = ไม่มี)', 'ปี', repy, BAHT, 'ปีที่เปลี่ยน inverter' if code != 'B' else '0', ''),
        ('tax', 'อัตราภาษีเงินได้', '%', f'N({X("tax")})*100', '0.000000', 'อัตราภาษี × 100', 'กฟผ. ใช้ 0'),
        ('debt', 'สัดส่วนเงินกู้', '%', f'N({X("debt")})*100', '0.000000', 'สัดส่วนเงินกู้ × 100', '0 = ไม่กู้'),
        ('kd', 'ดอกเบี้ยเงินกู้', '%/ปี', f'IF(N({X("debt")})>0,{X("kd")}*100,0)', '0.000000', 'ดอกเบี้ย × 100', ''),
        ('tenor', 'ระยะผ่อนเงินกู้', 'ปี', f'IF(N({X("debt")})>0,{X("tenor")},0)', BAHT, 'จำนวนปีผ่อน', ''),
        ('peak', 'ค่าไฟช่วง Peak', 'บาท/kWh', peakf, '0.000000', 'ราคาที่โซลาร์ทดแทนได้' if code == 'S' else 'ค่าไฟ Peak (TOU) / ค่าไฟธรรมดา', 'Solar ใส่ราคาที่โซลาร์ทดแทนได้ ผลประหยัดลูกค้าจะตรง' if code == 'S' else ''),
    ]
    if code != 'S':
        FIELDS += [('off', 'ค่าไฟช่วง Off-peak', 'บาท/kWh', f'IF({S["meter"]}=1,{X("off")},{X("norm")})', '0.000000', 'ค่าไฟ Off-peak', ''),
                   ('pe', 'พลังงานย้ายช่วงต่อวัน', 'kWh', X('usable'), BAHT, 'ความจุที่ใช้ได้ต่อรอบ', 'ใช้แสดงในกราฟเท่านั้น')]
    FIELDS += [('energy', 'พลังงานต่อปี (ไฟที่ลูกค้าใช้ได้)', 'kWh/ปี', energy, BAHT2,
                'kWp × ไฟที่ผลิตได้ × สัดส่วนที่ลูกค้าใช้' if code != 'B' else 'ไฟเข้าแบต × ประสิทธิภาพ', 'ใช้คิด LCOE' + (' และผลประหยัดลูกค้า' if code == 'S' else ''))]
    if code != 'S':
        FIELDS += [('cust', 'ผลประหยัดของลูกค้าปีแรก (0 = คำนวณเอง)', 'บาท/ปี', cs, BAHT2, 'ผลประหยัดสุทธิ × (1 − ส่วนแบ่ง กฟผ.)' + (' + ผลประหยัดส่วนโซลาร์' if code == 'SB' else ''), 'ใส่ค่านี้แล้วกราฟผลประหยัดลูกค้าจะตรง')]
    PF = {}
    for k, lab, unit, fml, fmt, how, note in FIELDS:
        ws.cell(row=r, column=1, value=lab).font = f_note if lab.startswith('   ') else f_b
        ws.cell(row=r, column=2, value=unit).font = f_c
        c = ws.cell(row=r, column=3, value=f'=IF({OK},IFERROR({fml},""),"")'); c.number_format = fmt
        c.font = f_note if lab.startswith('   ') else f_big
        if not lab.startswith('   '): c.fill = fill_out
        ws.cell(row=r, column=5, value=how).font = f_note
        w = ws.cell(row=r, column=6, value=note); w.font = f_note; w.alignment = wrap
        for j in range(1, 8): ws.cell(row=r, column=j).border = box
        PF[k] = f'$C${r}'; r += 1
    # check: platform vs full model
    r += 1
    c = ws.cell(row=r, column=1, value='7. เช็คผล: แพลตฟอร์มจะแสดงเท่าไร เทียบกับโมเดลเต็ม'); c.font = f_b
    for j in range(1, 8): ws.cell(row=r, column=j).fill = PatternFill('solid', fgColor=GROUP_FILL['เช็ค'])
    r += 1
    sumr = r; r += 9
    YR = r; NY = 30
    ws.cell(row=YR, column=1, value='ปีที่').font = f_b
    for t in range(NY + 1): ws.cell(row=YR, column=9 + t, value=t).font = f_b
    def line(row, label, f0, ft, fmt=BAHT, bold=False, wrapE=True):
        ws.cell(row=row, column=1, value=label).font = f_b if bold else f_c
        for t in range(NY + 1):
            v = f0 if t == 0 else ft(L(9 + t), L(8 + t))
            if wrapE and isinstance(v, str) and v.startswith('='): v = '=IFERROR(' + v[1:] + ',0)'
            c = ws.cell(row=row, column=9 + t, value=v); c.number_format = fmt
    Y = lambda c: f'{c}${YR}'
    INF = f'IF({X("inf")}="",0.01,{X("inf")})'; OTG = f'IF({X("othG")}="",0.01,{X("othG")})'
    r = YR + 1
    # --- platform side: exactly what domain/model.js does with the section 6 numbers ---
    P = PF
    GF = lambda c, g, gl: f'IF({P["sw"]}>0,(1+{g}/100)^(MIN({Y(c)},{P["sw"]})-1)*(1+{gl}/100)^MAX(0,{Y(c)}-{P["sw"]}),(1+{g}/100)^({Y(c)}-1))'
    rev2p = (lambda c: f'+{P["rev2"]}*{GF(c, P["grow2"], P["grow2L"])}/(1-{P["r2deg"]}/100)^IF({P["r2reset"]}>0,INT(({Y(c)}-1)/{P["r2reset"]})*{P["r2reset"]},0)') if code == 'SB' else (lambda c: '')
    rep2p = (lambda c: f'+IF({P["rep2e"]}>0,IF(AND(MOD({Y(c)},{P["rep2e"]})=0,{Y(c)}<{P["life"]}),{P["rep2c"]},0),IF(AND({P["rep2y"]}>0,{Y(c)}={P["rep2y"]}),{P["rep2c"]},0))') if code == 'SB' else (lambda c: '')
    inl = lambda c, body: f'=IF({Y(c)}<={P["life"]},{body},0)'
    rows = {}
    def put(key, label, f0, ft, bold=False):
        nonlocal r
        rows[key] = r; line(r, label, f0, ft, bold=bold); r += 1
    put('revp', '   แพลตฟอร์ม: รายได้', '=0', lambda c, pc: inl(c, f'{P["rev"]}*{GF(c, P["grow"], P["growL"])}{rev2p(c)}'))
    put('opxp', '   แพลตฟอร์ม: O&M + ค่าใช้จ่ายอื่น', '=0', lambda c, pc: inl(c, f'{P["om"]}*(1+{P["omg"]}/100)^({Y(c)}-1)+{P["oth"]}*(1+{P["othg"]}/100)^({Y(c)}-1)'))
    put('repp', '   แพลตฟอร์ม: ค่าเปลี่ยนอุปกรณ์', '=0', lambda c, pc: inl(c, f'IF(AND({P["repy"]}>0,{Y(c)}={P["repy"]}),{P["repc"]},0){rep2p(c)}'))
    put('depp', '   แพลตฟอร์ม: ค่าเสื่อม (คิดภาษี)', '=0', lambda c, pc: inl(c, f'{P["inv"]}/{P["life"]}'))
    put('taxp', '   แพลตฟอร์ม: ภาษี', '=0', lambda c, pc: inl(c, f'MAX(0,{P["tax"]}/100*({c}{rows["revp"]}-{c}{rows["opxp"]}-{c}{rows["repp"]}-{c}{rows["depp"]}))'))
    put('cfp', 'กระแสเงินสด: แพลตฟอร์ม', f'=-{P["inv"]}', lambda c, pc: inl(c, f'{c}{rows["revp"]}-{c}{rows["opxp"]}-{c}{rows["repp"]}-{c}{rows["taxp"]}+IF({Y(c)}={P["life"]},{P["salv"]},0)'), bold=True)
    # --- full model: straight from the raw inputs, written independently of section 6 ---
    escN = f'N({X("escY")})'; esc2 = f'IF({X("esc2")}="",{X("esc")},{X("esc2")})'
    escF = lambda c: f'IF({escN}>0,(1+{X("esc")})^(MIN({Y(c)},{escN})-1)*(1+{esc2})^MAX(0,{Y(c)}-{escN}),(1+{X("esc")})^({Y(c)}-1))'
    if code == 'S':
        lf = X('term'); invf = f'{X("capS")}+{X("enzy")}'; salvf = X('xfer')
        revf = lambda c: f'{X("srev")}*(1-{X("deg")})^({Y(c)}-1)*{escF(c)}'
        opxf = lambda c: f'{X("om")}*{X("capS")}*(1+{INF})^({Y(c)}-1)+{X("othS")}*(1+{OTG})^({Y(c)}-1)'
        repf = lambda c: f'IF({Y(c)}={X("invY")},{X("invC")}*{X("kwp")},0)'
    elif code == 'SB':
        lf = X('hlife'); invf = f'{X("capS")}+{X("capB")}+{X("enzy")}'; salvf = X('xfer')
        sw = f'{X("bswap")}<{lf}'
        revf = lambda c: (f'{X("srev")}*(1-{X("deg")})^({Y(c)}-1)*{escF(c)}'
                          f'+{X("share")}*{X("bnet")}*(1-{X("bdeg")})^IF({sw},MOD({Y(c)}-1,{X("bswap")}),{Y(c)}-1)*{escF(c)}')
        opxf = lambda c: f'({X("om")}*{X("capS")}+{X("bom")}*{X("capB")})*(1+{INF})^({Y(c)}-1)+({X("othS")}+{X("othB")})*(1+{OTG})^({Y(c)}-1)'
        repf = lambda c: f'IF({Y(c)}={X("invY")},{X("invC")}*{X("kwp")},0)+IF(AND({sw},MOD({Y(c)},{X("bswap")})=0,{Y(c)}<{lf}),{X("bswapPct")}*{X("capB")},0)'
    else:
        lf = X('blife'); invf = f'{X("capB")}+{X("enzy")}'; salvf = f'{X("bsalv")}*{X("capB")}'
        revf = lambda c: f'{X("share")}*{X("bnet")}*(1-{X("bdeg")})^({Y(c)}-1)*{escF(c)}'
        opxf = lambda c: f'{X("bom")}*{X("capB")}*(1+{INF})^({Y(c)}-1)+{X("othB")}*(1+{OTG})^({Y(c)}-1)'
        repf = lambda c: '0'
    inf_ = lambda c, body: f'=IF({Y(c)}<={lf},{body},0)'
    put('revf', '   โมเดลเต็ม: รายได้ (เสื่อมทุกปี, เปลี่ยนแบตแล้วเริ่มใหม่)', '=0', lambda c, pc: inf_(c, revf(c)))
    put('opxf', '   โมเดลเต็ม: O&M + ค่าใช้จ่ายอื่น', '=0', lambda c, pc: inf_(c, opxf(c)))
    put('repf', '   โมเดลเต็ม: ค่าเปลี่ยนอุปกรณ์', '=0', lambda c, pc: inf_(c, repf(c)))
    put('depf', '   โมเดลเต็ม: ค่าเสื่อม (คิดภาษี)', '=0', lambda c, pc: inf_(c, f'({invf})/{lf}'))
    put('taxf', '   โมเดลเต็ม: ภาษี', '=0', lambda c, pc: inf_(c, f'MAX(0,N({X("tax")})*({c}{rows["revf"]}-{c}{rows["opxf"]}-{c}{rows["repf"]}-{c}{rows["depf"]}))'))
    put('cff', 'กระแสเงินสด: โมเดลเต็ม', f'=-({invf})', lambda c, pc: inf_(c, f'{c}{rows["revf"]}-{c}{rows["opxf"]}-{c}{rows["repf"]}-{c}{rows["taxf"]}+IF({Y(c)}={lf},{salvf},0)'), bold=True)
    # --- equity view (only when there is a loan) ---
    def equity(tag, inv, share, kd, n, life, taxr, R):
        D = f'({share})*({inv})'
        pay = f'IF({kd}>0,{D}*{kd}/(1-(1+{kd})^(-{n})),{D}/{n})'
        put('bal' + tag, f'   เงินกู้คงเหลือ ({tag})', f'={D}', lambda c, pc: f'=IF({Y(c)}<={n},{pc}{rows["bal" + tag]}*(1+{kd})-{pay},0)')
        put('int' + tag, f'   ดอกเบี้ย ({tag})', '=0', lambda c, pc: f'=IF({Y(c)}<=MIN({n},{life}),{pc}{rows["bal" + tag]}*{kd},0)')
        put('pay' + tag, f'   เงินงวด ({tag})', '=0', lambda c, pc: f'=IF({Y(c)}<=MIN({n},{life}),{pay},0)')
        put('eqcf' + tag, f'กระแสเงินสดส่วนทุน ({tag})', f'=-({inv})+{D}', lambda c, pc: (
            f'=IF({Y(c)}<={life},{c}{R[0]}-{c}{R[1]}-{c}{R[2]}-MAX(0,{taxr}*({c}{R[0]}-{c}{R[1]}-{c}{R[2]}-{c}{R[3]}-{c}{rows["int" + tag]}))-{c}{rows["pay" + tag]}+IF({Y(c)}={life},{R[4]},0),0)'), bold=True)
    equity('p', P['inv'], f'{P["debt"]}/100', f'{P["kd"]}/100', f'MAX(1,ROUND({P["tenor"]},0))', P['life'], f'{P["tax"]}/100', [rows['revp'], rows['opxp'], rows['repp'], rows['depp'], P['salv']])
    equity('f', invf, f'N({X("debt")})', f'N({X("kd")})', f'MAX(1,ROUND(N({X("tenor")}),0))', lf, f'N({X("tax")})', [rows['revf'], rows['opxf'], rows['repf'], rows['depf'], salvf])
    cfp, cff = rows['cfp'], rows['cff']
    helpers = {}
    for nm, cfr in (('p', cfp), ('f', cff)):
        ws.cell(row=r, column=1, value=f'   ตัวช่วยหาปีคืนทุน ({nm})').font = f_c
        for t in range(1, NY + 1):
            col, prev = L(9 + t), L(8 + t)
            ws.cell(row=r, column=9 + t, value=f'=IF(AND(SUM($I{cfr}:{prev}{cfr})<0,SUM($I{cfr}:{col}{cfr})>=0),{prev}${YR}+(-SUM($I{cfr}:{prev}{cfr}))/{col}{cfr},"")').number_format = '0.0'
        helpers[nm] = r; r += 1
    rng = lambda cfr: f'$I{cfr}:${L(9 + NY)}{cfr}'
    IRRF = lambda cfr: f'IFERROR(IRR({rng(cfr)},0.05),IFERROR(IRR({rng(cfr)},-0.1),IFERROR(IRR({rng(cfr)},-0.3),IFERROR(IRR({rng(cfr)},-0.5),"หา IRR ไม่ได้"))))'
    NPVF = lambda cfr: f'SUMPRODUCT({rng(cfr)},1/(1+{X("rate")})^$I${YR}:${L(9 + NY)}${YR})'
    for j, h in enumerate(['ตัวชี้วัด', '', 'แพลตฟอร์ม', 'โมเดลเต็ม', 'ส่วนต่าง'], 1):
        c = ws.cell(row=sumr, column=j, value=h); c.font = f_h; c.fill = fill_h
    hasDebt = f'N({X("debt")})>0'
    for i, (lab, fmt, fx, diff) in enumerate([
        ('NPV (บาท)', BAHT, lambda cfr, hr, eq: NPVF(cfr), True),
        ('IRR', PCT, lambda cfr, hr, eq: IRRF(cfr), True),
        ('คืนทุน (ปี)', '0.0', lambda cfr, hr, eq: f'IF(COUNT($J{hr}:${L(9 + NY)}{hr})=0,"ไม่คืนทุน",MIN($J{hr}:${L(9 + NY)}{hr}))', False),
        ('NPV ส่วนทุน (บาท)', BAHT, lambda cfr, hr, eq: f'IF({hasDebt},{NPVF(eq)},"ไม่มีเงินกู้")', True),
        ('IRR ส่วนทุน', PCT, lambda cfr, hr, eq: f'IF({hasDebt},{IRRF(eq)},"ไม่มีเงินกู้")', True)]):
        rr = sumr + 1 + i
        ws.cell(row=rr, column=1, value=lab).font = f_b
        for j, (cfr, hr, eq) in enumerate([(cfp, helpers['p'], rows['eqcfp']), (cff, helpers['f'], rows['eqcff'])]):
            c = ws.cell(row=rr, column=3 + j, value=f'=IF({OK},{fx(cfr, hr, eq)},"รอข้อมูล")'); c.number_format = fmt; c.font = f_b
        if diff:
            c = ws.cell(row=rr, column=5, value=f'=IFERROR(C{rr}-D{rr},"")'); c.number_format = fmt; c.font = f_c
    rr = sumr + 6
    ws.cell(row=rr, column=1, value='คุ้มไหม').font = f_b
    for j in range(2):
        c = ws.cell(row=rr, column=3 + j, value=f'=IF(ISNUMBER({L(3 + j)}{sumr + 1}),IF({L(3 + j)}{sumr + 1}>0,"✅ คุ้ม","❌ ไม่คุ้ม"),"")'); c.font = f_b
    rr = sumr + 7
    ws.cell(row=rr, column=1, value='ผลประหยัดของลูกค้าปีแรก').font = f_b
    pcs = f'{PF["energy"]}*{PF["peak"]}-{PF["rev"]}' if code == 'S' else PF['cust']
    for j, fml in enumerate([pcs, cs]):
        c = ws.cell(row=rr, column=3 + j, value=f'=IF({OK},IFERROR({fml},""),"รอข้อมูล")'); c.number_format = BAHT; c.font = f_b
    c = ws.cell(row=rr, column=5, value=f'=IFERROR(C{rr}-D{rr},"")'); c.number_format = BAHT; c.font = f_c
    for col, w in zip('ABCDEFGH', [52, 15, 16, 3, 40, 52, 11, 4]):
        ws.column_dimensions[col].width = w
    for t in range(NY + 1): ws.column_dimensions[L(9 + t)].width = 11
    ws.freeze_panes = f'A{HR + 1}'

for code, name, desc, sels in PRODUCTS:
    build(code, name, desc, sels)

fx = wb.create_sheet('สูตรของแพลตฟอร์ม')
fx['A1'] = 'สูตรที่แพลตฟอร์มใช้ (domain/model.js) และข้อจำกัด'; fx['A1'].font = f_t
r = 3
for a, b in [
    ('สูตรของแพลตฟอร์ม (domain/model.js)', None),
    ('ปีที่ 0', '− เงินลงทุนเริ่มต้น'),
    ('รายได้ปีที่ t', 'รายได้ปีแรก × ตัวคูณการเติบโต + รายได้ส่วนที่ 2 × ตัวคูณการเติบโตส่วนที่ 2 ÷ (1 − อัตราเสื่อม)^(ปีที่เริ่มรอบแบตใหม่)'),
    ('ตัวคูณการเติบโต', 'ถ้าไม่ใส่ปีที่เปลี่ยนอัตรา: (1 + g)^(t − 1) · ถ้าใส่ N: (1 + g)^(min(t, N) − 1) × (1 + g หลังปีนั้น)^(max(0, t − N))'),
    ('O&M / ค่าใช้จ่ายอื่นปีที่ t', 'ค่าปีแรก × (1 + อัตราเติบโตที่กรอก)^(t − 1)'),
    ('ค่าเปลี่ยนอุปกรณ์', 'รายการที่ 1 ครั้งเดียวในปีที่กำหนด · รายการที่ 2 ครั้งเดียว หรือซ้ำทุก n ปี (ไม่นับปีสุดท้าย) เช่น เปลี่ยนแบต'),
    ('ภาษี', 'max(0, อัตราภาษี × (รายได้ − O&M − อื่น ๆ − เปลี่ยนอุปกรณ์ − ค่าเสื่อมเส้นตรง)) · ไม่ยกยอดขาดทุน · กฟผ. ใช้อัตรา 0'),
    ('กระแสเงินสดปีที่ t', 'รายได้ − O&M − ค่าใช้จ่ายอื่น − ค่าเปลี่ยนอุปกรณ์ − ภาษี + มูลค่าซาก (ปีสุดท้าย, ติดลบได้ = ค่ารื้อถอน)'),
    ('ส่วนทุน (ถ้ากู้)', 'ปี 0: −(เงินลงทุน − เงินกู้) · ปีที่ t: รายได้ − ค่าใช้จ่าย − ภาษี(หักดอกเบี้ย) − เงินงวด + มูลค่าซาก · เงินงวดเท่ากันทุกปี · คิดลดด้วยอัตราเดียวกัน'),
    ('NPV / IRR / คืนทุน', 'NPV = Σ กระแสเงินสด ÷ (1 + อัตราคิดลด)^t · IRR = อัตราที่ทำให้ NPV = 0 · คืนทุน = ปีแรกที่สะสม ≥ 0'),
    ('ผลประหยัดลูกค้า (Solar)', 'พลังงานต่อปี × ค่าไฟช่วง Peak − รายได้ปีแรก'),
    ('ผลประหยัดลูกค้า (แบต)', 'ใช้ช่อง "ผลประหยัดของลูกค้าปีแรก" ถ้ากรอก · ถ้าใส่ 0 จะประมาณจาก พลังงานย้ายช่วงต่อวัน × (Peak − Off-peak) × 365'),
    ('สิ่งที่แบบจำลองยังไม่คิด', None),
    ('1. ฤดูกาล', 'คิดเป็นรายปี ความต่างตามฤดูของไฟโซลาร์และโหลดเข้ามาผ่านสัดส่วนไฟที่ลูกค้าใช้ (เลือกวิธีที่ 2 = ไฟล์ 15 นาที จะแม่นที่สุด)'),
    ('2. ขาดทุนยกยอดทางภาษี', 'ปีที่ขาดทุนไม่เสียภาษี แต่ไม่นำขาดทุนไปหักปีถัดไป (มีผลเฉพาะเมื่ออัตราภาษี > 0)'),
]:
    if b is None:
        r += 1; c = fx.cell(row=r, column=1, value=a); c.font = f_b
    else:
        fx.cell(row=r, column=1, value=a).font = f_c
        c = fx.cell(row=r, column=2, value=b); c.font = f_c; c.alignment = wrap
    r += 1
fx.column_dimensions['A'].width = 34; fx.column_dimensions['B'].width = 120
for s in wb.worksheets: s.sheet_view.showGridLines = False
wb.calculation = CalcProperties(fullCalcOnLoad=True)
wb.save(OUT)
print('saved', OUT)
