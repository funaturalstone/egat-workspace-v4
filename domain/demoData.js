// Deliberately synthetic examples. Never copy production records into public demo data.
const base = {
  revenue_growth: .02, om_growth: .01, other_growth: .01, discount_rate: .08,
  replacement_year: 0, replacement_cost: 0, decision_override: 'auto',
  peak_rate: 4.1839, offpeak_rate: 2.6037, peak_energy_kwh_day: 400,
  parent_id: null,
  note: 'ข้อมูลสมมติสำหรับทดลองใช้งาน ไม่ใช่ข้อมูลโครงการจริง',
};
export const DEMO_SCENARIOS = [
  // หัวข้อหลัก (main topic) = เทคโนโลยี · parent_id = null
  { ...base, id: 'demo-bess', name: 'BESS · โครงการตัวอย่าง', initial_investment: 4500000, project_life: 10, revenue_y1: 1050000, om_y1: 45000, other_y1: 35000, salvage_value: 300000, energy_y1_kwh: 146000 },
  // sub topic (ลูกค้า) ของ BESS · parent_id = หัวข้อหลัก
  { ...base, id: 'demo-bess-c1', parent_id: 'demo-bess', name: 'โครงการลูกค้าคนที่ 1', initial_investment: 3800000, project_life: 10, revenue_y1: 920000, om_y1: 40000, other_y1: 30000, salvage_value: 260000, energy_y1_kwh: 128000 },

  { ...base, id: 'demo-hybrid', name: 'Solar + Battery · ตัวอย่าง', initial_investment: 9500000, project_life: 20, revenue_y1: 1400000, om_y1: 150000, other_y1: 40000, salvage_value: 500000, replacement_year: 10, replacement_cost: 1800000, energy_y1_kwh: 360000 },
  { ...base, id: 'demo-solar', name: 'Solar PPA · ตัวอย่าง', initial_investment: 6500000, project_life: 25, revenue_y1: 950000, om_y1: 120000, other_y1: 30000, salvage_value: 300000, energy_y1_kwh: 330000 },
];
