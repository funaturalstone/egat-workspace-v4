# EGAT Energy Workspace · V4

เว็บไซต์หลักอันที่ 2 ของ EGAT Feasibility Platform พัฒนาต่อจากต้นแบบ Workspace V4
(branch `design/workspace-v4` ของ repo หลัก) — **แยกขาดจากเว็บหลักทุกส่วน**

| ส่วน | V4 (repo นี้) | เว็บหลัก (ห้ามแตะ) |
|---|---|---|
| โค้ด | `funaturalstone/egat-workspace-v4` (private) | `funaturalstone/Egat-feasibility` |
| ฐานข้อมูล | Supabase `EGAT-Workspace-V4` · `hdreqbadncphcxlyxfrh` · Singapore | `EGAT-Feasibility` · `btbivrzhzqylmmfdgiji` |
| โฮสต์ | Vercel project `egat-workspace-v4` | Vercel project `egat-feasibility` |

![ภาพรวม](docs/overview-preview.jpg)

## ทำอะไรได้
- เลือกผลิตภัณฑ์ Solar PPA / Solar + Battery / Battery จากโมเดล 3 มิติ (Three.js)
- จัดการโครงการลูกค้าใน sidebar: เพิ่ม เปลี่ยนชื่อ ลบ เลิกทำ
- ภาพรวม สำรวจกราฟ สมมติฐาน กระแสเงินสด และเปรียบเทียบ ด้วยเอนจินคำนวณชุดเดียวกับเว็บหลัก (`domain/`)
- การตัดสินใจ Auto / Accept / Reject แยกตามลูกค้า
- **เข้าสู่ระบบ** แล้วโครงการบันทึกบนคลาวด์อัตโนมัติ เห็นได้เฉพาะบัญชีตัวเอง หรือใช้ **โหมดทดลอง** (เก็บในเบราว์เซอร์)

## โครงสร้าง
- `index.html` `app.js` `style.css` — UI
- `auth.js` — หน้าเข้าสู่ระบบ / สมัคร / โหมดทดลอง
- `store.js` — เลือกที่เก็บข้อมูล: Supabase (เข้าสู่ระบบ) หรือ localStorage (ทดลอง) · บันทึกแบบหน่วง 0.6 วินาที
- `workspace-sync.js` — แปลงข้อมูลแอป ↔ แถวในฐานข้อมูล (มีเทสต์)
- `projects.js` — ตรรกะลูกค้า · `charts.js` `domain/` — แบบจำลองการเงินและกราฟ · `scene.js` — 3D

## ฐานข้อมูล
- `client_projects` (owner, id, product, name, scenario jsonb, position)
- `workspace_settings` (owner, selected, active)
- เปิด RLS ทุกตาราง: ผู้ใช้ที่เข้าสู่ระบบอ่าน/เขียนได้เฉพาะแถวของตัวเอง · ผู้ไม่เข้าสู่ระบบเข้าถึงไม่ได้

## รันในเครื่อง
```sh
npm install
# สร้าง .env.local (ไม่ถูก commit)
#   VITE_SUPABASE_URL=https://hdreqbadncphcxlyxfrh.supabase.co
#   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
npm run dev      # http://localhost:5193
npm test         # 13 tests
npm run build
```
ใช้เฉพาะ publishable key ฝั่งหน้าเว็บ ห้ามใส่ service_role / secret key

ข้อมูลตัวอย่างเป็นสถานการณ์สมมติ ไม่ใช่ผลตอบแทนที่รับประกัน
