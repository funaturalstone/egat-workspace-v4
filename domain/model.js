// model.js — Domain logic
// รับ scenario (ชุด input) แล้วสร้างตารางกระแสเงินสดแบบเดียวกับชีต Cash Flow ใน Excel
// จากนั้นเรียกสูตรใน finance.js มาคำนวณ NPV / IRR / Payback / LCOE
import { npv, irr, paybackPeriod, discountedPayback, lcoe } from "./finance.js";

/**
 * สร้างตารางกระแสเงินสดรายปีจาก scenario
 * ปีที่ 0 = จ่าย CAPEX (net_cf ติดลบ)
 * ปีที่ 1..life = Revenue - O&M - Other (+ Salvage ปีสุดท้าย)
 */
export function buildCashflows(s) {
  const rows = [];
  // ปีที่ 0
  rows.push({
    year: 0,
    revenue: 0,
    om_cost: 0,
    other_cost: 0,
    replacement: 0,
    salvage: 0,
    net_cf: -s.initial_investment,
  });

  for (let t = 1; t <= s.project_life; t++) {
    const revenue = s.revenue_y1 * Math.pow(1 + s.revenue_growth, t - 1);
    const om = s.om_y1 * Math.pow(1 + s.om_growth, t - 1);
    const other = s.other_y1 * Math.pow(1 + s.other_growth, t - 1);
    // ค่าเปลี่ยนอุปกรณ์ใหญ่ (เช่น แบตเตอรี่) จ่ายครั้งเดียวในปีที่กำหนด
    const replacement =
      s.replacement_year > 0 && t === s.replacement_year ? s.replacement_cost : 0;
    const salvage = t === s.project_life ? s.salvage_value : 0;
    const net = revenue - om - other - replacement + salvage;
    rows.push({
      year: t,
      revenue,
      om_cost: om,
      other_cost: other,
      replacement,
      salvage,
      net_cf: net,
    });
  }

  // เติม discount factor, present value, cumulative
  let cumulative = 0;
  let discountedCumulative = 0;
  for (const r of rows) {
    r.discount_factor = 1 / Math.pow(1 + s.discount_rate, r.year);
    r.present_value = r.net_cf * r.discount_factor;
    cumulative += r.net_cf;
    r.cumulative = cumulative;
    discountedCumulative += r.present_value;
    r.discounted_cumulative = discountedCumulative;
  }
  return rows;
}

/**
 * คำนวณผลลัพธ์ทั้งหมดของ scenario หนึ่ง
 */
export function computeScenario(s) {
  const rows = buildCashflows(s);
  const netCfs = rows.map((r) => r.net_cf);

  const npvValue = npv(s.discount_rate, netCfs);
  const irrValue = irr(netCfs);
  const paybackValue = paybackPeriod(netCfs);
  const discPaybackValue = discountedPayback(s.discount_rate, netCfs);

  // LCOE (ตัวเสริม): PV(ต้นทุนรวม) / PV(พลังงาน)
  // ต้นทุน = CAPEX(ปี0) + O&M + Other ของแต่ละปี  (ไม่รวม salvage)
  const costs = rows.map((r) =>
    r.year === 0 ? s.initial_investment : r.om_cost + r.other_cost + r.replacement
  );
  const energy = rows.map((r) => (r.year === 0 ? 0 : s.energy_y1_kwh));
  const lcoeValue = lcoe(s.discount_rate, costs, energy);

  // คำแนะนำจากระบบ (IRR เทียบ hurdle rate)
  const recommendation =
    irrValue != null && irrValue > s.discount_rate ? "accept" : "reject";
  // การตัดสินใจสุดท้าย: 'auto' = ใช้คำแนะนำ, ไม่งั้นใช้ที่ผู้ใช้เลือก
  const override = s.decision_override || "auto";
  const decisionFinal = override === "auto" ? recommendation : override;

  // ===== ประหยัดฝั่งลูกค้า (peak shaving) =====
  // ย้ายพลังงานจากช่วง peak (ซื้อแพง) ไปชาร์จช่วง off-peak (ถูก)
  const days = 365;
  const peakRate = s.peak_rate ?? 4.1839;
  const offRate = s.offpeak_rate ?? 2.6037;
  const peakKwhDay = s.peak_energy_kwh_day ?? 400;
  const costBeforeYear = peakKwhDay * peakRate * days; // จ่ายราคา peak ทั้งหมด
  const costAfterYear = peakKwhDay * offRate * days; // ชาร์จ off-peak
  const customerSavingYear = costBeforeYear - costAfterYear;

  // ประหยัดสะสมรายปีตลอดอายุโครงการ (สำหรับกราฟ area)
  const customerCumulative = [];
  let cum = 0;
  for (let t = 1; t <= s.project_life; t++) {
    cum += customerSavingYear;
    customerCumulative.push({ year: t, saving: customerSavingYear, cumulative: cum });
  }

  return {
    scenario: s,
    cashflows: rows,
    npv: npvValue,
    irr: irrValue,
    payback: paybackValue,
    discounted_payback: discPaybackValue,
    break_even: {
      simple: paybackValue,
      discounted: discPaybackValue,
      // First crossing is not necessarily permanent recovery (e.g. battery replacement).
      simpleFallsBelowAgain: paybackValue != null && rows.some(r => r.year > paybackValue && r.cumulative < 0),
      discountedFallsBelowAgain: discPaybackValue != null && rows.some(r => r.year > discPaybackValue && r.discounted_cumulative < 0),
    },
    lcoe: lcoeValue,
    recommendation,
    decisionFinal,
    customer: {
      peakRate,
      offRate,
      peakKwhDay,
      costBeforeYear,
      costAfterYear,
      savingYear: customerSavingYear,
      cumulative: customerCumulative,
      savingTotal: customerSavingYear * s.project_life,
    },
  };
}
