// Plain-language reason for one year's net cash flow, shown when a year is clicked.
// Uses the same identity as buildCashflows(): net = revenue − O&M − other − replacement + salvage.
const baht = v => Math.round(v).toLocaleString('en-US') + ' บาท';

export function explainYear(row, previous = null) {
  const operating = row.revenue - row.om_cost - row.other_cost; // cash from running the system this year
  const formula = row.year === 0
    ? `เงินลงทุนเริ่มต้น −${baht(-row.net_cf)}`
    : `รายได้ ${baht(row.revenue)} − O&M ${baht(row.om_cost)} − ค่าใช้จ่ายอื่น ${baht(row.other_cost)}`
      + (row.replacement ? ` − เปลี่ยนอุปกรณ์ ${baht(row.replacement)}` : '')
      + (row.salvage ? ` + มูลค่าซาก ${baht(row.salvage)}` : '')
      + ` = ${row.net_cf < 0 ? '−' : ''}${baht(Math.abs(row.net_cf))}`;

  let cause = null, text = '';
  if (row.year === 0) {
    cause = 'investment';
    text = `ปี 0 คือปีที่จ่ายเงินลงทุนเริ่มต้น ${baht(-row.net_cf)} จึงติดลบ และค่อย ๆ คืนทุนจากกระแสเงินสดปีถัด ๆ ไป`;
  } else if (row.net_cf < 0 && row.replacement > 0 && operating > 0) {
    cause = 'replacement';
    text = `ปีนี้ติดลบเพราะมีค่าเปลี่ยนอุปกรณ์ ${baht(row.replacement)} (จ่ายครั้งเดียว) ซึ่งมากกว่ากระแสเงินสดจากการดำเนินงาน ${baht(operating)} ที่ได้ในปีนี้ ปีถัดไปจะกลับมาเป็นบวกตามปกติ`;
  } else if (row.net_cf < 0) {
    cause = 'operating';
    text = `ปีนี้ติดลบเพราะรายได้ ${baht(row.revenue)} ต่ำกว่าค่า O&M และค่าใช้จ่ายอื่นรวม ${baht(row.om_cost + row.other_cost)}`
      + (row.replacement ? ` และยังมีค่าเปลี่ยนอุปกรณ์ ${baht(row.replacement)}` : '');
  } else if (row.replacement > 0) {
    cause = 'replacement-covered';
    text = `ปีนี้มีค่าเปลี่ยนอุปกรณ์ ${baht(row.replacement)} แต่กระแสเงินสดจากการดำเนินงานยังครอบคลุมได้ จึงยังเป็นบวก`;
  }

  // Cumulative total going down after it had been rising is worth calling out too.
  const dips = previous != null && row.year > 0 && row.cumulative < previous.cumulative;
  return { negative: row.net_cf < 0, cause, text, formula, operating, cumulativeDips: dips };
}
