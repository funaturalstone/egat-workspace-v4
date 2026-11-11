// Raw-input form: the inputs of reports/EGAT_Platform_Input_แยกตามผลิตภัณฑ์.xlsx, grouped by who provides them.
// The formulas live in domain/inputs.js; this file only draws the form and keeps the project's scenario in step.
import { GROUPS, SELECTORS, inputStatus, derive, isPercent, prefillSource, defaultRaw } from './domain/inputs.js';
import { fmt } from './charts.js';

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MODEL_FIELDS = [
  ['initial_investment', 'เงินลงทุนเริ่มต้น', 'บาท'], ['project_life', 'อายุโครงการ', 'ปี'], ['discount_rate', 'อัตราคิดลด', '%'],
  ['revenue_y1', 'รายได้ / ผลประหยัดปีแรก', 'บาท/ปี'], ['revenue_growth', 'อัตราเติบโตของรายได้', '%/ปี'],
  ['revenue2_y1', 'รายได้ส่วนที่ 2 ปีแรก (ส่วนแบต)', 'บาท/ปี'], ['revenue2_growth', 'อัตราเติบโตรายได้ส่วนที่ 2', '%/ปี'],
  ['om_y1', 'ค่า O&M ปีแรก', 'บาท/ปี'], ['om_growth', 'อัตราเติบโตของ O&M', '%/ปี'], ['other_y1', 'ค่าใช้จ่ายอื่นปีแรก', 'บาท/ปี'],
  ['other_growth', 'อัตราเติบโตค่าใช้จ่ายอื่น', '%/ปี'], ['salvage_value', 'มูลค่าซาก', 'บาท'], ['replacement_cost', 'ค่าเปลี่ยนอุปกรณ์', 'บาท'],
  ['replacement_year', 'ปีที่เปลี่ยนอุปกรณ์ (0 = ไม่มี)', 'ปี'], ['peak_rate', 'ค่าไฟช่วง Peak', 'บาท/kWh'], ['offpeak_rate', 'ค่าไฟช่วง Off-peak', 'บาท/kWh'],
  ['peak_energy_kwh_day', 'พลังงานย้ายช่วงต่อวัน', 'kWh'], ['energy_y1_kwh', 'พลังงานต่อปี (ไฟที่ลูกค้าใช้ได้)', 'kWh/ปี'],
  ['customer_saving_y1', 'ผลประหยัดของลูกค้าปีแรก', 'บาท/ปี'],
  ['growth_switch_year', 'ปีที่เปลี่ยนอัตราเติบโต (0 = ไม่เปลี่ยน)', 'ปี'], ['revenue_growth_late', 'อัตราเติบโตของรายได้ หลังปีนั้น', '%/ปี'],
  ['revenue2_growth_late', 'อัตราเติบโตรายได้ส่วนที่ 2 หลังปีนั้น', '%/ปี'], ['revenue2_reset_every', 'รายได้ส่วนที่ 2 กลับเป็นของใหม่ทุก (ปี)', 'ปี'],
  ['revenue2_degradation', 'อัตราเสื่อมของรายได้ส่วนที่ 2', '%/ปี'], ['replacement2_cost', 'ค่าเปลี่ยนอุปกรณ์รายการที่ 2', 'บาท'],
  ['replacement2_every', 'เปลี่ยนรายการที่ 2 ซ้ำทุก (ปี)', 'ปี'], ['tax_rate', 'อัตราภาษีเงินได้', '%'], ['debt_share', 'สัดส่วนเงินกู้', '%'],
  ['debt_rate', 'ดอกเบี้ยเงินกู้', '%/ปี'], ['debt_years', 'ระยะผ่อนเงินกู้', 'ปี'],
];
const show = (v, unit) => v == null || !Number.isFinite(v) ? '—'
  : unit.startsWith('%') ? fmt(v * 100, 4) + ' %'
  : unit === 'สัดส่วน' || unit.includes('บาท/kWh') ? fmt(v, 4)
  : ['ปี', 'วัน', 'ปีที่'].includes(unit) ? fmt(v, 0) : fmt(v, 2);
const inputValue = (v, unit) => v == null ? '' : Number((isPercent(unit) ? v * 100 : v).toFixed(8));
const rawOf = s => ({ sel: { ...defaultRaw().sel, ...(s.raw?.sel ?? {}) }, values: { ...(s.raw?.values ?? {}) } });

function badge(row) {
  if (row.missing) return ['missing', '⚠ ต้องใส่'];
  if (row.optional && row.value == null) return ['optional', 'ไม่บังคับ'];
  if (row.prefilled) return ['prefilled', 'ค่าตั้งต้น'];
  return ['ok', '✓'];
}

export function rawFormHtml(product, s, title) {
  const raw = rawOf(s), st = inputStatus(product, raw);
  const selectors = SELECTORS[product].map(x => `<label class="field">${x.label}<span class="input-wrap"><select data-sel="${x.key}" aria-label="${x.label}">${x.options.map(([v, t]) => `<option value="${v}"${raw.sel[x.key] === v ? ' selected' : ''}>${v} = ${t}</option>`).join('')}</select></span></label>`).join('');
  const groups = GROUPS.map((g, gi) => {
    const rows = st.rows.filter(r => r.input.group === g.key && r.used);
    if (!rows.length) return '';
    return `<div class="raw-group g${gi}"><h4>${g.title}</h4><div class="form-grid">${rows.map(row => {
      const i = row.input, [cls, text] = badge(row), src = row.prefilled ? prefillSource(i) : null;
      return `<label class="field raw-field ${cls}" data-raw-field="${i.key}"><span class="raw-label">${esc(i.label)} <b class="raw-badge" data-badge="${i.key}">${text}</b></span>`
        + `<span class="input-wrap"><input aria-label="${esc(i.label)}" data-raw="${i.key}" type="number" step="any" value="${inputValue(row.value, i.unit)}"><span>${esc(i.unit)}</span></span>`
        + `<small class="raw-who"><b>${esc(i.who)}</b> · ${esc(i.doc)}${src ? ` · ค่าตั้งต้นจาก ${esc(src)}` : ''}</small></label>`;
    }).join('')}</div></div>`;
  }).join('');
  return `<section class="card input-card raw-card"><div class="raw-head"><div><h3>${title}</h3><p>กรอกข้อมูลดิบ แบ่งตามผู้ให้ข้อมูล · สูตรเดียวกับไฟล์ EGAT_Platform_Input_แยกตามผลิตภัณฑ์.xlsx</p></div><span class="raw-status" id="raw-status"></span></div>`
    + `<div class="form-grid raw-selectors">${selectors}</div>${groups}</section>`
    + `<section class="card raw-calc"><h3>ค่าที่คำนวณจาก input (สูตร)</h3><div id="raw-derived"></div></section>`
    + `<section class="card raw-calc"><h3>ตัวเลขที่ส่งเข้าแบบจำลองการเงิน</h3><div id="raw-model"></div></section>`;
}

function tables(product, res) {
  const derived = `<table class="raw-table"><thead><tr><th>ค่า</th><th>ผล</th><th>หน่วย</th><th>สูตร</th></tr></thead><tbody>${res.steps.map(x => `<tr><td>${x.label}</td><td class="num">${res.complete ? show(x.value, x.unit) : '—'}</td><td>${x.unit}</td><td class="how">${x.how}</td></tr>`).join('')}</tbody></table>`;
  const f = res.fields;
  const keys = MODEL_FIELDS.filter(([k]) => f[k] !== undefined && !(product !== 'hybrid' && (k.startsWith('revenue2') || k.startsWith('replacement2')))
    && !(product === 'solar' && k === 'customer_saving_y1') && !(k === 'revenue_growth_late' && !f.growth_switch_year)
    && !(k === 'revenue2_growth_late' && !f.growth_switch_year) && !(['debt_rate', 'debt_years'].includes(k) && !f.debt_share));
  const model = `<table class="raw-table"><thead><tr><th>ช่องในแบบจำลอง</th><th>ค่า</th><th>หน่วย</th></tr></thead><tbody>${keys.map(([k, label, unit]) => `<tr><td>${label}</td><td class="num">${res.complete ? show(f[k], unit) : '—'}</td><td>${unit}</td></tr>`).join('')}</tbody></table>`;
  return { derived, model };
}

export function rawComplete(product, s) { return derive(product, rawOf(s)).complete; }

// get(): current scenario · set(v): save it · rerender(): redraw the page · onUpdate(complete): refresh results
export function bindRaw(root, { product, get, set, rerender, onUpdate }) {
  const update = () => {
    const s = get(), raw = rawOf(s), res = derive(product, raw);
    const st = res.status;
    for (const row of st.rows) {
      const el = root.querySelector(`[data-raw-field="${row.input.key}"]`); if (!el) continue;
      const [cls, text] = badge(row);
      el.classList.remove('missing', 'prefilled', 'ok', 'optional'); el.classList.add(cls);
      el.querySelector('.raw-badge').textContent = text;
    }
    const status = root.querySelector('#raw-status');
    status.textContent = res.complete ? '✅ ครบ' : `ยังขาด ${res.missing.length} ช่อง`;
    status.classList.toggle('done', res.complete);
    const t = tables(product, res);
    root.querySelector('#raw-derived').innerHTML = t.derived;
    root.querySelector('#raw-model').innerHTML = t.model;
    set(res.complete ? { ...s, ...res.fields, raw, input_mode: 'raw' } : { ...s, raw, input_mode: 'raw' });
    onUpdate(res.complete);
  };
  root.querySelectorAll('[data-sel]').forEach(el => el.onchange = () => {
    const s = get(), raw = rawOf(s); raw.sel[el.dataset.sel] = Number(el.value);
    const res = derive(product, raw);
    set(res.complete ? { ...s, ...res.fields, raw, input_mode: 'raw' } : { ...s, raw, input_mode: 'raw' });
    rerender();
  });
  root.querySelectorAll('[data-raw]').forEach(el => {
    el.oninput = () => {
      const s = get(), raw = rawOf(s), key = el.dataset.raw, unit = inputStatus(product, raw).rows.find(r => r.input.key === key).input.unit;
      const n = Number(el.value);
      if (el.value === '' || !Number.isFinite(n)) delete raw.values[key]; else raw.values[key] = isPercent(unit) ? n / 100 : n;
      set({ ...s, raw });
      // a value that switches other inputs on or off (e.g. loan share → rate and term): redraw, keep the cursor here
      const shown = [...root.querySelectorAll('[data-raw-field]')].map(x => x.dataset.rawField).join();
      const want = inputStatus(product, raw).rows.filter(r => r.used).map(r => r.input.key).join();
      if (shown !== want) {
        rerender();
        const again = document.querySelector(`[data-raw="${key}"]`);
        if (again) { again.focus(); const n = again.value.length; try { again.setSelectionRange(n, n); } catch {} }
        return;
      }
      update();
    };
    // clearing a field that has an official / EGAT-file default brings the default back
    el.onblur = () => {
      if (el.value !== '') return;
      const row = inputStatus(product, rawOf(get())).rows.find(r => r.input.key === el.dataset.raw);
      if (row?.prefilled) el.value = inputValue(row.value, row.input.unit);
    };
  });
  update();
}

// Rows for the CSV export: every raw input with its value, who provides it and whether it was typed or a default.
export function rawCsvRows(product, s) {
  if (s.input_mode !== 'raw' || !s.raw) return [];
  const st = inputStatus(product, rawOf(s)), res = derive(product, rawOf(s));
  const group = Object.fromEntries(GROUPS.map(g => [g.key, g.title]));
  return [[], ['Raw inputs (ข้อมูลดิบ)'], ['Options', ...Object.entries(st.sel).map(([k, v]) => `${k}=${v}`)],
    ['Group', 'Input', 'Unit', 'Value (% as fraction)', 'Status', 'Who provides it', 'Document'],
    ...st.rows.filter(r => r.used).map(r => [group[r.input.group], r.input.label, r.input.unit, r.value ?? '', r.missing ? 'missing' : r.typed ? 'typed' : r.prefilled ? 'default' : 'blank (optional)', r.input.who, r.input.doc]),
    [], ['Calculated values'], ['Value', 'Result', 'Unit', 'Formula'], ...res.steps.map(x => [x.label, x.value, x.unit, x.how])];
}
