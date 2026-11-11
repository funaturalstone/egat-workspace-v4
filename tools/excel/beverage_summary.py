import sys, openpyxl
from openpyxl.styles import Font, PatternFill
src,out=sys.argv[1],sys.argv[2]
import json
WHATIF=json.load(open(sys.argv[3]))
wb=openpyxl.load_workbook(src)
F='Tahoma'; red=Font(name=F,size=11,bold=True,color='B3261E'); b=Font(name=F,size=10,bold=True); c=Font(name=F,size=10); t=Font(name=F,size=14,bold=True,color='122033'); n=Font(name=F,size=9,italic=True,color='555555')
hf=Font(name=F,size=10,bold=True,color='FFFFFF'); hfill=PatternFill('solid',fgColor='122033')
def find(sh,label):
    ws=wb[sh]
    for r in range(1,ws.max_row+1):
        if ws.cell(r,1).value==label: return r
    raise KeyError(sh+label)
for sh in ['Solar PPA','Solar + Battery','Battery']:
    wb[sh]['A3']='⚠ ไฟล์ทดสอบ: ค่าในช่องพื้นครีมทุกช่องเป็นค่าสมมติของ "โรงงานเครื่องดื่ม ค่าไฟ 200,000 บาท/เดือน" ไม่ใช่ข้อมูลจริง'; wb[sh]['A3'].font=red
ws=wb.create_sheet('สรุปผลทดสอบ',0)
for i,(v,f) in enumerate([('ทดสอบสูตร: โรงงานเครื่องดื่ม ค่าไฟ 200,000 บาท/เดือน',t),('⚠ ทุกตัวเลขในไฟล์นี้เป็นค่าสมมติเพื่อทดสอบสูตร ห้ามใช้เป็นผลความคุ้มค่าของลูกค้าจริง',red),('',None),('1. แตกบิล 200,000 บาท (รวม VAT 7%) เป็น input · มิเตอร์ TOU 22–33 kV · ทำงาน จ.–ส. 2 กะ',b)],1):
    ws.cell(i,1,v)
    if f: ws.cell(i,1).font=f
def hdr(r,cols):
    for j,h in enumerate(cols,1):
        x=ws.cell(r,j,h); x.font=hf; x.fill=hfill
r=5; hdr(r,['รายการ','ค่าสมมติ','หน่วย','บาท','เหตุผล']); r+=1
pre=25700*4.1839+21000*2.6037+46700*0.1623+128*132.93+312.24
for x in [('หน่วย On-Peak',25700,'kWh/เดือน',25700*4.1839,'55% ของหน่วยทั้งหมด (เดินเครื่องหนักช่วงกลางวันวันธรรมดา)'),('หน่วย Off-Peak',21000,'kWh/เดือน',21000*2.6037,'กะเย็น/กลางคืน + ห้องเย็นที่เปิด 24 ชม.'),('ค่า Ft',46700,'kWh/เดือน',46700*0.1623,'0.1623 บาท/kWh'),('Peak demand',128,'kW',128*132.93,'load factor 0.5 (ปกติของโรงงาน 2 กะ)'),('ค่าบริการ','','',312.24,'อัตรา กฟภ.'),('VAT 7%','','',0.07*pre,'')]:
    for j,v in enumerate(x,1): ws.cell(r,j,v).font=c
    ws.cell(r,4).number_format='#,##0'; r+=1
ws.cell(r,1,'รวมบิลต่อเดือน').font=b; ws.cell(r,4,f'=SUM(D6:D{r-1})').font=b; ws.cell(r,4).number_format='#,##0'; r+=2
ws.cell(r,1,'2. ค่าสมมติอื่นที่สำคัญ (ค่าทั้งหมดอยู่ในช่องพื้นครีมของแต่ละแท็บ)').font=b; r+=1
hdr(r,['รายการ','ค่าสมมติ','หน่วย','','เหตุผล']); r+=1
for a in [('วันทำงาน',300,'วัน/ปี','จ.–ส. หักวันหยุดยาว'),('วันหยุดราชการที่ตรง จ.–ศ.',14,'วัน','ประมาณจากปฏิทินวันหยุดปี 2570 (ครม. ยังไม่ประกาศ)'),('ขนาดโซลาร์',200,'kWp','ไฟโซลาร์ต่อวัน 767 kWh ไม่เกินไฟกลางวันจากบิล 864 kWh'),('ต้นทุนโซลาร์',25,'บาท/W','ค่ากลางที่ใช้ในไฟล์ก่อนหน้า'),('ไฟที่ผลิตได้',1400,'kWh/kWp/ปี','ค่ากลางภาคกลาง'),('ส่วนลด PPA',0.15,'%',''),('ส่วนแบ่ง กฟผ. (แบต)',0.85,'%',''),('อายุสัญญา',15,'ปี',''),('แบต','100 kWh / 50 kW','','ตัดยอด 128 → ~103 kW (ลดได้ 50% ของกำลังแบต)'),('ราคาแบตใหม่','8,500 + 4,000/kW + 2,500 + 250,000','','ค่าจากไฟล์ก่อนหน้า (ไฟล์ BESS ของ กฟผ. คิดที่ 500 kWh)'),('เปลี่ยนแบต (Solar + Battery)','ปีที่ 10 · 60% ของราคาเดิม','','สัญญา 15 ปี แบตอายุ 10 ปี จึงต้องเปลี่ยน 1 ครั้ง (ราคาสมมติ)')]:
    ws.cell(r,1,a[0]).font=c; ws.cell(r,2,a[1]).font=c; ws.cell(r,3,a[2]).font=c; ws.cell(r,5,a[3]).font=c
    if a[2]=='%': ws.cell(r,2).number_format='0%'
    r+=1
r+=1
ws.cell(r,1,'3. ผลลัพธ์: แพลตฟอร์ม (ช่องใหม่) เทียบโมเดลเต็ม · ดึงจากส่วนเช็คผลของแต่ละแท็บ').font=b; r+=1
hdr(r,['ผลิตภัณฑ์','NPV แพลตฟอร์ม','NPV โมเดลเต็ม','ส่วนต่าง NPV','IRR แพลตฟอร์ม','IRR โมเดลเต็ม','คืนทุน (ปี)','ผลประหยัดลูกค้า/ปี']); r+=1
for sh in ['Solar PPA','Solar + Battery','Battery']:
    q=f"'{sh}'!"; rn,ri,rp,rc=[find(sh,l) for l in ('NPV (บาท)','IRR','คืนทุน (ปี)','ผลประหยัดของลูกค้าปีแรก')]
    ws.cell(r,1,sh).font=b
    for j,f,fmt in [(2,f'={q}C{rn}','#,##0.00'),(3,f'={q}D{rn}','#,##0.00'),(4,f'=B{r}-C{r}','0.000000'),(5,f'={q}C{ri}','0.0000%'),(6,f'={q}D{ri}','0.0000%'),(7,f'={q}D{rp}','0.00'),(8,f'={q}D{rc}','#,##0')]:
        ws.cell(r,j,f).font=c; ws.cell(r,j).number_format=fmt
    r+=1
r+=1
ws.cell(r,1,'4. ลองเปลี่ยนทีละตัว (IRR โมเดลเต็ม · คำนวณด้วยเอนจินเดียวกับแพลตฟอร์มซึ่งตรงกับ Excel)').font=b; r+=1
hdr(r,['สิ่งที่เปลี่ยน','Solar PPA','Solar + Battery','Battery','']); r+=1
for w in WHATIF:
    ws.cell(r,1,w[0]).font=c
    for j,v in enumerate(w[1:],2): ws.cell(r,j,v).font=c; ws.cell(r,j).number_format='0.0%'
    r+=1
r+=1
for s in ['อ่านผล: อัตราคิดลด 8% ถ้า IRR สูงกว่า 8% = คุ้ม',
          'แพลตฟอร์ม V4 (หลังแก้) รับอัตราเติบโตติดลบ, อัตราเติบโต O&M/ค่าใช้จ่ายอื่น, รายได้ส่วนที่ 2 และผลประหยัดลูกค้า จึงได้ผลเท่าโมเดลเต็ม',
          'Battery ติดลบทุกกรณี เพราะเงินที่ กฟผ. ได้ต่อปี (~49,500) น้อยกว่า O&M + ค่าใช้จ่ายอื่น (~58,250) กระแสเงินสดติดลบตั้งแต่ปีแรก']:
    ws.cell(r,1,s).font=n; r+=1
for col,w in zip('ABCDEFGH',[38,18,18,16,16,16,12,18]): ws.column_dimensions[col].width=w
wb.save(out)