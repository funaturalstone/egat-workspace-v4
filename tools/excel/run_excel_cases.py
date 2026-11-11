# Fills each case into a copy of the blank workbook, recalculates it in Microsoft Excel (AppleScript), and records
# Excel's section 6 fields and section 7 results. Output = the fixture used by inputs.test.mjs.
# Usage: run_excel_cases.py BLANK.xlsx CASES.json OUT.json WORKFILE.xlsx
import json, sys, shutil, subprocess, re, os
sys.path.insert(0, os.path.dirname(__file__))
import xlread
blank, cases_path, out_path, work = sys.argv[1:5]
JS = open(os.path.join(os.path.dirname(__file__), '../../domain/inputs.js')).read()
INPUTS = [json.loads(l.strip().rstrip(',')) for l in JS.split('export const INPUTS = [')[1].split('\n];')[0].strip().split('\n')]
SEL = {'solar': ['meter', 'um', 'volt'], 'hybrid': ['meter', 'um', 'volt', 'bt'], 'battery': ['meter', 'src', 'volt', 'bt']}
SHEET = {'solar': 'Solar PPA', 'hybrid': 'Solar + Battery', 'battery': 'Battery'}
MAP = {'เงินลงทุนเริ่มต้น': ('initial_investment', 1), 'อายุโครงการ': ('project_life', 1), 'อัตราคิดลด': ('discount_rate', 100),
 'รายได้ / ผลประหยัดปีแรก': ('revenue_y1', 1), 'อัตราเติบโตของรายได้': ('revenue_growth', 100), 'ปีที่เปลี่ยนอัตราเติบโต (0 = ไม่เปลี่ยน)': ('growth_switch_year', 1),
 'อัตราเติบโตของรายได้ หลังปีนั้น': ('revenue_growth_late', 100), 'รายได้ส่วนที่ 2 ปีแรก (ส่วนแบต)': ('revenue2_y1', 1),
 'อัตราเติบโตรายได้ส่วนที่ 2': ('revenue2_growth', 100), 'อัตราเติบโตรายได้ส่วนที่ 2 หลังปีนั้น': ('revenue2_growth_late', 100),
 'รายได้ส่วนที่ 2 กลับเป็นของใหม่ทุก (ปี)': ('revenue2_reset_every', 1), 'อัตราเสื่อมของรายได้ส่วนที่ 2': ('revenue2_degradation', 100),
 'ค่าเปลี่ยนอุปกรณ์รายการที่ 2': ('replacement2_cost', 1), 'ปีที่เปลี่ยนรายการที่ 2 (0 = ไม่มี)': ('replacement2_year', 1), 'เปลี่ยนรายการที่ 2 ซ้ำทุก (ปี)': ('replacement2_every', 1),
 'ค่า O&M ปีแรก': ('om_y1', 1), 'อัตราเติบโตของ O&M': ('om_growth', 100), 'ค่าใช้จ่ายอื่นปีแรก': ('other_y1', 1), 'อัตราเติบโตค่าใช้จ่ายอื่น': ('other_growth', 100),
 'มูลค่าซาก': ('salvage_value', 1), 'ค่าเปลี่ยนอุปกรณ์': ('replacement_cost', 1), 'ปีที่เปลี่ยนอุปกรณ์ (0 = ไม่มี)': ('replacement_year', 1),
 'อัตราภาษีเงินได้': ('tax_rate', 100), 'สัดส่วนเงินกู้': ('debt_share', 100), 'ดอกเบี้ยเงินกู้': ('debt_rate', 100), 'ระยะผ่อนเงินกู้': ('debt_years', 1),
 'ค่าไฟช่วง Peak': ('peak_rate', 1), 'ค่าไฟช่วง Off-peak': ('offpeak_rate', 1), 'พลังงานย้ายช่วงต่อวัน': ('peak_energy_kwh_day', 1),
 'พลังงานต่อปี (ไฟที่ลูกค้าใช้ได้)': ('energy_y1_kwh', 1), 'ผลประหยัดของลูกค้าปีแรก (0 = คำนวณเอง)': ('customer_saving_y1', 1)}
METRICS = ['NPV (บาท)', 'IRR', 'คืนทุน (ปี)', 'NPV ส่วนทุน (บาท)', 'IRR ส่วนทุน', 'ผลประหยัดของลูกค้าปีแรก']
layout = xlread.read(blank)
def input_rows(sh):
    cells = layout[sh]
    sec5 = min(r for (c, r), v in cells.items() if c == 'A' and isinstance(v, str) and v.startswith('5.'))
    rows = {}
    for (c, r), v in sorted(cells.items(), key=lambda x: x[0][1]):
        if c == 'A' and isinstance(v, str) and r < sec5 and v not in rows: rows[v] = r
    return rows
ROWS = {p: input_rows(SHEET[p]) for p in SHEET}
cases = json.load(open(cases_path)); out = []
for case in cases:
    shutil.copy(blank, work)
    lines = [f'set wb to open workbook workbook file name (POSIX file "{work}" as text)']
    for p in SHEET:
        if p not in case['products']: continue
        raw = case['products'][p]; sh = SHEET[p]
        for i, k in enumerate(SEL[p]):
            lines.append(f'set value of range "D{4 + i}" of worksheet "{sh}" of wb to {raw["sel"].get(k, 2 if k == "volt" else 1)}')
        for inp in INPUTS:
            if p in inp['products'] and inp['key'] in raw['values']:
                lines.append(f'set value of range "C{ROWS[p][inp["label"]]}" of worksheet "{sh}" of wb to {float(raw["values"][inp["key"]])!r}')
    lines += ['calculate full rebuild', 'save wb', 'close wb saving no']
    script = 'with timeout of 300 seconds\ntell application "Microsoft Excel"\n' + '\n'.join('  ' + l for l in lines) + '\nend tell\nend timeout\n'
    subprocess.run(['osascript', '-e', script], check=True)
    book = xlread.read(work)
    for p, raw in case['products'].items():
        cells = book[SHEET[p]]; rows = sorted({r for (c, r) in cells}); fields = {}; m = {}; sec = 0; status = None
        for r in rows:
            a = cells.get(('A', r))
            if a == 'สถานะข้อมูล': status = cells.get(('D', r))
            if isinstance(a, str) and a[:2] in ('5.', '6.', '7.'): sec = int(a[0])
            if sec == 6 and a in MAP and isinstance(cells.get(('C', r)), float): k, div = MAP[a]; fields[k] = cells[('C', r)] / div
            if sec == 7 and a in METRICS: m[a] = {'platform': cells.get(('C', r)), 'full': cells.get(('D', r))}
        out.append({'case': case['case'], 'product': p, 'raw': raw, 'status': status, 'fields': fields, 'excel': m})
    print(case['case'], 'done', flush=True)
json.dump(out, open(out_path, 'w'), ensure_ascii=False, indent=0)
