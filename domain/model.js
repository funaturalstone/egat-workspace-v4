// model.js — Domain logic
// รับ scenario (ชุด input) แล้วสร้างตารางกระแสเงินสดแบบเดียวกับชีต Cash Flow ใน Excel
// จากนั้นเรียกสูตรใน finance.js มาคำนวณ NPV / IRR / Payback / LCOE
import { npv, irr, paybackPeriod, discountedPayback, lcoe } from "./finance.js";

/**
 * สร้างตารางกระแสเงินสดรายปีจาก scenario
 * ปีที่ 0 = จ่าย CAPEX (net_cf ติดลบ)
 * ปีที่ 1..life = รายได้(ส่วนหลัก + ส่วนที่ 2) − O&M − ค่าใช้จ่ายอื่น − ค่าเปลี่ยนอุปกรณ์ − ภาษี (+ มูลค่าซากปีสุดท้าย)
 * ทุกช่องใหม่มีค่าตั้งต้นที่ทำให้ผลเท่าเดิม (ไม่มีช่วงที่ 2 ของอัตราเติบโต, ไม่เปลี่ยนแบต, ภาษี 0)
 */
// ตัวคูณการเติบโตปีที่ t: ปีที่ 2..N ใช้อัตรา g, หลังปีที่ N ใช้อัตรา gLate (N = 0 คือใช้ g ตลอด)
function growthFactor(t, g, gLate, N) {
  if (!(N > 0)) return Math.pow(1 + g, t - 1);
  return Math.pow(1 + g, Math.min(t, N) - 1) * Math.pow(1 + gLate, Math.max(0, t - N));
}
export function buildCashflows(s) {
  const life = s.project_life;
  const N = s.growth_switch_year ?? 0;
  const g1 = s.revenue_growth, g1l = s.revenue_growth_late ?? g1;
  const g2 = s.revenue2_growth ?? 0, g2l = s.revenue2_growth_late ?? g2;
  // รายได้ส่วนที่ 2 กลับไปเป็นของใหม่ทุก R2 ปี (เช่น เปลี่ยนแบตแล้วความจุกลับมาเต็ม): หักผลเสื่อมของรอบก่อนออก
  const R2 = s.revenue2_reset_every ?? 0, d2 = s.revenue2_degradation ?? 0;
  const taxRate = s.tax_rate ?? 0, depYears = s.depreciation_years || life;
  const rows = [];
  rows.push({ year: 0, revenue: 0, revenue1: 0, revenue2: 0, om_cost: 0, other_cost: 0, replacement: 0, replacement1: 0, replacement2: 0,
    depreciation: 0, tax: 0, salvage: 0, net_cf: -s.initial_investment });

  for (let t = 1; t <= life; t++) {
    const revenue1 = s.revenue_y1 * growthFactor(t, g1, g1l, N);
    const back = R2 > 0 ? Math.floor((t - 1) / R2) * R2 : 0;
    const revenue2 = (s.revenue2_y1 ?? 0) * growthFactor(t, g2, g2l, N) / Math.pow(1 - d2, back);
    const revenue = revenue1 + revenue2;
    const om = s.om_y1 * Math.pow(1 + (s.om_growth ?? 0.01), t - 1);
    const other = s.other_y1 * Math.pow(1 + (s.other_growth ?? 0.01), t - 1);
    // ค่าเปลี่ยนอุปกรณ์ 2 รายการ: รายการที่ 1 ครั้งเดียว · รายการที่ 2 ครั้งเดียว หรือซ้ำทุก n ปี (ไม่นับปีสุดท้าย)
    const replacement1 = s.replacement_year > 0 && t === s.replacement_year ? s.replacement_cost : 0;
    const every = s.replacement2_every ?? 0, y2 = s.replacement2_year ?? 0;
    const replacement2 = (every > 0 ? t % every === 0 && t < life : y2 > 0 && t === y2) ? (s.replacement2_cost ?? 0) : 0;
    const replacement = replacement1 + replacement2;
    const salvage = t === life ? s.salvage_value : 0;
    // ภาษีเงินได้: ค่าเสื่อมเส้นตรงของเงินลงทุน · ค่าเปลี่ยนอุปกรณ์หักเป็นค่าใช้จ่ายในปีนั้น · ปีที่ขาดทุนไม่เสียภาษี (ไม่ยกยอด)
    const depreciation = t <= depYears ? s.initial_investment / depYears : 0;
    const tax = taxRate > 0 ? Math.max(0, taxRate * (revenue - om - other - replacement - depreciation)) : 0;
    const net = revenue - om - other - replacement - tax + salvage;
    rows.push({ year: t, revenue, revenue1, revenue2, om_cost: om, other_cost: other, replacement, replacement1, replacement2,
      depreciation, tax, salvage, net_cf: net });
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
 * มุมมองส่วนทุน เมื่อกู้เงินบางส่วน (debt_share > 0): ผ่อนแบบเงินงวดเท่ากัน
 * กระแสเงินสดส่วนทุน = รายได้ − O&M − อื่น ๆ − เปลี่ยนอุปกรณ์ − ภาษี(หักดอกเบี้ยแล้ว) − เงินงวด + มูลค่าซาก · ปีที่ 0 = −(เงินลงทุน − เงินกู้)
 */
export function equityCashflows(s, rows) {
  const share = s.debt_share ?? 0;
  if (!(share > 0)) return null;
  const debt = share * s.initial_investment, kd = s.debt_rate ?? 0, n = Math.max(1, Math.round(s.debt_years ?? 1));
  const payment = kd > 0 ? debt * kd / (1 - Math.pow(1 + kd, -n)) : debt / n;
  const taxRate = s.tax_rate ?? 0;
  let balance = debt;
  const out = [{ year: 0, interest: 0, principal: 0, payment: 0, balance: debt, net_cf: -(s.initial_investment - debt) }];
  for (const r of rows.slice(1)) {
    const interest = r.year <= n ? balance * kd : 0;
    const pay = r.year <= n ? payment : 0;
    const principal = pay - interest;
    balance = Math.max(0, balance - principal);
    const tax = taxRate > 0 ? Math.max(0, taxRate * (r.revenue - r.om_cost - r.other_cost - r.replacement - r.depreciation - interest)) : 0;
    out.push({ year: r.year, interest, principal, payment: pay, balance, tax,
      net_cf: r.revenue - r.om_cost - r.other_cost - r.replacement - tax - pay + r.salvage });
  }
  return { debt, payment, rows: out };
}

/**
 * คำนวณผลลัพธ์ทั้งหมดของ scenario หนึ่ง
 */
export function computeScenario(s) {
  const rows = buildCashflows(s);
  const netCfs = rows.map((r) => r.net_cf);

  const npvValue = npv(s.discount_rate, netCfs);
  const eq = equityCashflows(s, rows);
  const equity = eq && { ...eq, npv: npv(s.discount_rate, eq.rows.map((r) => r.net_cf)), irr: irr(eq.rows.map((r) => r.net_cf)) };
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
  let costAfterYear = peakKwhDay * offRate * days; // ชาร์จ off-peak
  // ถ้ากรอกผลประหยัดของลูกค้าที่คำนวณละเอียดแล้ว (หักไฟหาย นับวันจริง รวมค่า Demand หักส่วนแบ่ง กฟผ.) ให้ใช้ค่านั้น
  const savingOverride = s.customer_saving_y1 ?? 0;
  if (savingOverride > 0) costAfterYear = costBeforeYear - savingOverride;
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
    equity,
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
