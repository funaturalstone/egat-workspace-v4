// BESS sheet of "BESS Feasibility Model_rev01.xlsx": turns system size, unit costs and tariffs
// into the model inputs (investment, year-1 savings, salvage) that computeScenario() consumes.
// Defaults reproduce the workbook cell for cell; every assumption can be overridden.

export const BESS_DEFAULTS = {
  sizeKwh: 500,                                   // BESS!B12
  systemCostPerKwh: { min: 3630, max: 5940 },     // BESS!B6:C6  second-life pack + test/grading/repurpose/BMS + system
  installCostPerKwh: { min: 5000, max: 8000 },    // BESS!B7:C7  turnkey in Thailand: PCS / EMS / container / fire / installation
  entryFee: 120000,                               // Inputs!B4   ENZY entry fee added to the investment
  energyKwhPerDay: 400,                           // BESS!B18    energy charged / discharged per day
  peakRate: 4.1839,                               // BESS!B22    PEA peak tariff (THB/kWh)
  offpeakRate: 2.6037,                            // BESS!C22    off-peak tariff (THB/kWh)
  daysPerYear: 360,                               // BESS!B25    the workbook uses 30 × 12
  demandChargePerKw: 196.26,                      // BESS!B28    demand-charge discount (THB/kW)
  demandKw: 400,                                  // BESS!B28    the workbook multiplies by 400
  demandMonthsPerYear: 1,                         // BESS!B28    counted once a year in the workbook
  salvagePct: 0.10,                               // Inputs!B12  salvage = 10% of the investment
};

// Inputs sheet rows that are typed in rather than derived (same for min and max).
export const BESS_MODEL_DEFAULTS = {
  project_life: 10, revenue_growth: 0.02, om_y1: 8000, om_growth: 0.005,
  other_y1: 35000, other_growth: 0.01, discount_rate: 0.08,
  replacement_year: 0, replacement_cost: 0,
};

const pick = (v, level) => (typeof v === 'object' && v !== null ? v[level] : v);

// Cost and savings build-up for one cost level ('min' | 'max').
export function bessBreakdown(level = 'min', overrides = {}) {
  const a = { ...BESS_DEFAULTS, ...overrides };
  const systemCost = a.sizeKwh * pick(a.systemCostPerKwh, level);     // BESS!B14
  const installCost = a.sizeKwh * pick(a.installCostPerKwh, level);   // BESS!B15 (B16 hard-codes 500; scaled with size here)
  const capex = systemCost + installCost;                              // BESS!B16
  const investment = capex + a.entryFee;                               // Inputs!B4
  const peakShaving = a.peakRate * a.energyKwhPerDay * a.daysPerYear;      // BESS!B25
  const tariffManagement = a.offpeakRate * a.energyKwhPerDay * a.daysPerYear; // BESS!C27
  const demandCharge = a.demandChargePerKw * a.demandKw * a.demandMonthsPerYear; // BESS!B28
  const annualSaving = peakShaving + tariffManagement + demandCharge;  // BESS!B29
  return {
    level, systemCost, installCost, capex, investment,
    peakShaving, tariffManagement, demandCharge, annualSaving,
    salvage: investment * a.salvagePct,                                // Inputs!B12
    simplePaybackCapex: capex / annualSaving,                          // BESS!B32 (CAPEX ÷ year-1 saving, no costs)
    assumptions: a,
  };
}

// A complete scenario for computeScenario(), as the Inputs_min / Inputs_max sheets build it.
export function bessScenario(level = 'min', overrides = {}, modelOverrides = {}) {
  const b = bessBreakdown(level, overrides);
  return {
    ...BESS_MODEL_DEFAULTS,
    initial_investment: b.investment,
    revenue_y1: b.annualSaving,
    salvage_value: b.salvage,
    energy_y1_kwh: b.assumptions.energyKwhPerDay * 365,
    peak_rate: b.assumptions.peakRate,
    offpeak_rate: b.assumptions.offpeakRate,
    peak_energy_kwh_day: b.assumptions.energyKwhPerDay,
    decision_override: 'auto',
    ...modelOverrides,
  };
}
