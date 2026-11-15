// Independent check of Khun Ton's electricity savings: rebuild his bill line by line from the October bill
// (its own rates and units), take the solar energy off it, add the battery's charging and demand cut, and compare
// the difference with what the platform reports. Uses none of the platform's saving formulas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { BILL, MONTHS } from './domain/khunTonData.js';
import { sampleRaw } from './domain/khunTon.js';
import { sampleScenario } from './projects.js';
import { computeScenario } from './domain/model.js';
import { customerSavings } from './charts.js';

const line = name => BILL.lines.find(l => l.item.startsWith(name));
const unit = name => BILL.units.find(u => u.item.startsWith(name)).units;
const rate = { demand: line('ค่าความต้องการพลังไฟฟ้า').rate, on: line('ค่าพลังงาน On-Peak').rate, off: line('ค่าพลังงาน Off-Peak').rate, ft: line('ค่า Ft').rate };
const fixed = line('ค่าบริการ').amount + line('ค่าเพาเวอร์แฟคเตอร์').amount; // service fee and power-factor charge: no system changes them
// one month's bill before VAT, from units and on-peak demand
const bill = ({ on, off, kw }, k = 1) => k * (rate.demand * kw + rate.on * on + rate.off * off + rate.ft * (on + off)) + fixed;
const oct = { on: unit('หน่วย On-Peak'), off: unit('หน่วย Off-Peak') + unit('หน่วยวันหยุด'), kw: unit('Demand On-Peak') };

// what each system does to one month in year t (k = tariff level that year)
function month(product, t) {
  const v = sampleRaw(product).values, k = (1 + v.esc) ** (t - 1);
  let m = { ...oct }, toEgat = 0;
  if (product !== 'battery') {
    const used = v.kwp * v.yld * v.useman * (1 - v.deg) ** (t - 1) / 12;   // solar energy the factory uses this month
    const onShare = (v.wkd - v.hol) / v.wdays * v.after9;                  // weekdays (not holidays) after 09:00 are On-Peak
    const eOn = used * onShare, eOff = used - eOn;
    m = { ...m, on: m.on - eOn, off: m.off - eOff };
    toEgat += k * (eOn * rate.on + eOff * rate.off + used * rate.ft) * (1 - v.disc); // PPA: 85% of the grid price it replaces
  }
  let battery = 0;
  if (product !== 'solar') {
    const life = product === 'hybrid' ? v.bswap : v.blife, age = (t - 1) % life, fade = (1 - v.bdeg) ** age;
    const charge = v.bkwh * v.dod * (v.wkd - v.hol) / 12 * fade;           // charged Off-Peak on On-Peak days
    const cut = { on: -charge * v.rte, off: charge, kw: -v.relT * Math.min(v.bkw, v.pdem) * fade };
    const before = bill(m, k), after = bill({ on: m.on + cut.on, off: m.off + cut.off, kw: m.kw + cut.kw }, k);
    battery = before - after;                                              // bill reduction from the battery
    m = { on: m.on + cut.on, off: m.off + cut.off, kw: m.kw + cut.kw };
    toEgat += v.share * battery;                                           // EGAT keeps 85% of it
  }
  const without = bill(oct, k), withSystem = bill(m, k) + toEgat;
  return { without, withSystem, saving: without - withSystem, toEgat };
}

test('the October bill rebuilt from its own rates and units equals the printed bill', () => {
  const total = BILL.lines.find(l => l.item === 'รวมเงินค่าไฟฟ้า').amount;
  assert.ok(Math.abs(bill(oct) - total) < 0.05, `rebuilt ${bill(oct)} vs printed ${total}`);
  assert.ok(Math.abs(bill(oct) * 1.07 - BILL.lines.find(l => l.item === 'รวมเงินที่ต้องชำระ').amount) < 0.05);
});

test('year-1 saving from the bill simulation equals the platform and the Excel workbook', () => {
  const excel = { solar: 108426.73628835614, hybrid: 124045.86428835616, battery: 15619.128000000004 };
  for (const p of ['solar', 'hybrid', 'battery']) {
    const sim = month(p, 1), r = computeScenario(sampleScenario(p)), c = customerSavings(r, p);
    assert.ok(Math.abs(sim.saving * 12 - excel[p]) < 0.01, `${p}: simulated ${sim.saving * 12} vs Excel ${excel[p]}`);
    assert.ok(Math.abs(sim.saving * 12 - c.savingExVat) < 0.01, `${p}: simulated vs platform ${c.savingExVat}`);
    assert.ok(Math.abs(sim.toEgat * 12 - r.cashflows[1].revenue) < 0.01, `${p}: what the customer pays EGAT = EGAT revenue`);
  }
});

test('every year of the savings chart equals the bill simulation (tariff growth, degradation, battery swap)', () => {
  for (const p of ['solar', 'hybrid', 'battery']) {
    const c = customerSavings(computeScenario(sampleScenario(p)), p), v = sampleRaw(p).values;
    for (const row of c.cumulative) {
      const sim = month(p, row.year);
      assert.ok(Math.abs(sim.saving * 12 - row.savingExVat) < 0.01, `${p} year ${row.year}: ${sim.saving * 12} vs ${row.savingExVat}`);
      assert.ok(Math.abs(sim.saving * 12 * 1.07 - row.saving) < 0.01, `${p} year ${row.year} with VAT`);
      // "without" line: real 6-month bills × 2, growing with the tariff
      const six = MONTHS.reduce((a, m) => a + m.baht, 0);
      assert.ok(Math.abs(row.bill - six * 2 * (1 + v.esc) ** (row.year - 1)) < 1e-6, `${p} year ${row.year} bill`);
    }
    // the two lines add up: total without − total with = total saved
    const end = c.cumulative.at(-1), sum = c.cumulative.reduce((a, r) => a + r.saving, 0);
    assert.ok(Math.abs(end.before - end.after - sum) < 1e-6 && Math.abs(end.cumulative - sum) < 1e-6);
  }
});
