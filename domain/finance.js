// finance.js — Calculation engine (LOCKED)
// สูตรการเงินล้วน ๆ ไม่ผูกกับ UI หรือ database
// ทุกฟังก์ชันรับ array ของกระแสเงินสด (cashflows) โดย index 0 = ปีที่ 0 (ตอนลงทุน)
//
// ข้อตกลงร่วม:
//   cashflows[0] = กระแสเงินสดปีที่ 0 (ปกติติดลบ = เงินลงทุน CAPEX)
//   cashflows[t] = กระแสเงินสดสุทธิปีที่ t

/**
 * NPV (Net Present Value) — มูลค่าปัจจุบันสุทธิ
 * NPV = Σ CF_t / (1 + r)^t   (t = 0 .. n)
 * ปีที่ 0 ไม่ถูก discount เพราะ (1+r)^0 = 1
 */
export function npv(rate, cashflows) {
  return cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
}

/**
 * IRR (Internal Rate of Return) — อัตราผลตอบแทนภายใน
 * คือ rate ที่ทำให้ NPV = 0
 * ใช้วิธี bisection (แบ่งครึ่ง) เพราะเสถียรกว่า Newton เมื่อ cash flow สลับเครื่องหมาย
 * คืนค่า null ถ้าหา IRR ไม่ได้ (เช่น NPV ไม่เคยข้ามศูนย์ในช่วงที่ค้นหา)
 */
export function irr(cashflows, lo = -0.9, hi = 1.0) {
  const f = (r) => npv(r, cashflows);
  let fLo = f(lo);
  let fHi = f(hi);

  // ขยายขอบบนถ้ายังไม่คร่อมศูนย์ (โครงการผลตอบแทนสูงมาก)
  let tries = 0;
  while (fLo * fHi > 0 && hi < 10 && tries < 50) {
    hi += 0.5;
    fHi = f(hi);
    tries++;
  }
  if (fLo * fHi > 0) return null; // หา root ไม่เจอ

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = f(mid);
    if (Math.abs(fMid) < 1e-7) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Simple Payback Period — ระยะเวลาคืนทุน (ไม่คิด time value)
 * คืนจำนวนปี (ทศนิยม) ที่กระแสเงินสดสะสม >= 0 เป็นครั้งแรก
 * คืน null ถ้าคืนทุนไม่ครบตลอดอายุโครงการ
 */
export function paybackPeriod(cashflows) {
  if (!cashflows.length || cashflows.some(cf => !Number.isFinite(cf))) return null;
  if (cashflows[0] >= 0) return 0;
  let cumulative = 0;
  for (let t = 0; t < cashflows.length; t++) {
    const prev = cumulative;
    cumulative += cashflows[t];
    if (cumulative >= 0 && t > 0) {
      // interpolate เศษของปี: เหลือเท่าไหร่หารด้วยกระแสเงินสดปีนั้น
      const fraction = cashflows[t] !== 0 ? -prev / cashflows[t] : 0;
      return (t - 1) + fraction;
    }
  }
  return null;
}

/**
 * Discounted Payback Period — คืนทุนแบบคิด time value
 * เหมือน payback แต่ใช้กระแสเงินสดที่ discount แล้ว
 */
export function discountedPayback(rate, cashflows) {
  const discounted = cashflows.map((cf, t) => cf / Math.pow(1 + rate, t));
  return paybackPeriod(discounted);
}

/**
 * LCOE (Levelized Cost of Energy) — ต้นทุนเฉลี่ยต่อหน่วยไฟฟ้า (บาท/kWh)
 * LCOE = PV(ต้นทุนทั้งหมด) / PV(พลังงานที่ผลิต)
 * ** สำคัญ: ต้อง discount ทั้งตัวเศษ (ต้นทุน) และตัวส่วน (พลังงาน) **
 * costs[t]  = ต้นทุนรวมปีที่ t (รวม CAPEX ที่ปี 0, OPEX, ค่าพลังงาน, ค่าเปลี่ยนแบตฯ)
 * energy[t] = พลังงานที่ผลิต/ส่งมอบปีที่ t (kWh); ปีที่ 0 ปกติ = 0
 */
export function lcoe(rate, costs, energy) {
  const pvCost = costs.reduce((a, c, t) => a + c / Math.pow(1 + rate, t), 0);
  const pvEnergy = energy.reduce((a, e, t) => a + e / Math.pow(1 + rate, t), 0);
  if (pvEnergy === 0) return null;
  return pvCost / pvEnergy;
}
