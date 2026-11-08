// Success screen shown right after signing in (or choosing demo mode), before the workspace appears —
// in the style of an investment app's "order succeeded" screen: a check that pops and draws, ripples
// and sparkles, then a receipt card whose rows tick off as the real work finishes
// (sign-in → client projects loaded → dashboard drawn). "เข้าสู่แดชบอร์ด" skips ahead.
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const MIN_SHOW = 3800;   // ms, long enough to read the card even when loading is instant
const FIRST_TICK = 1300; // ms, after the card has slid in
const STEP_GAP = 520;    // ms between ticks
const PERSON = '<svg viewBox="0 0 24 24" class="avatar-icon"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/></svg>';
// Latin names become two initials; Thai names (and demo) keep the person icon, since Thai doesn't abbreviate well.
const mark = name => (/^[A-Za-z0-9]/.test(name || '') ? name.trim().split(/[\s._-]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() : '');

let el = null, startedAt = 0, done = 0, finishing = null, target = -1, timer = null, lastTick = 0, ready = false, skip = false;

function close(resolve) {
  const node = el; el = null; finishing = null; ready = false; skip = false;
  clearTimeout(timer); timer = null;
  node.classList.add('leaving');                      // button press + card confirm pulse
  setTimeout(() => {
    node.classList.add('out');                        // sheet slides up and away
    document.body.classList.remove('welcoming');
    document.body.classList.add('dashboard-in');      // workspace rises in underneath
    dispatchEvent(new CustomEvent('welcome:closed')); // app replays cards, count-up and charts
    setTimeout(() => { node.remove(); resolve?.(); }, reduce() ? 0 : 900);
    setTimeout(() => document.body.classList.remove('dashboard-in'), 1400);
  }, reduce() ? 0 : 260);
}

export const welcome = {
  get active() { return Boolean(el); },

  start({ mode = 'cloud', email = '' } = {}) {
    if (el) return;
    startedAt = performance.now(); done = 0; target = -1; clearTimeout(timer); timer = null; lastTick = 0; ready = false; skip = false;
    const demo = mode === 'demo';
    const steps = demo
      ? ['เปิดโหมดทดลอง', 'เตรียมโครงการตัวอย่าง', 'จัดแดชบอร์ดและกราฟ']
      : ['ยืนยันตัวตน', 'โหลดโครงการลูกค้าของคุณ', 'จัดแดชบอร์ดและกราฟ'];
    const name = demo ? 'ผู้ทดลองใช้งาน' : (email.split('@')[0] || '');
    const when = new Date().toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    el = document.createElement('div');
    el.className = 'welcome';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<div class="welcome-inner">
      <div class="ws-burst" aria-hidden="true">
        <span class="ws-ring"></span><span class="ws-ring"></span><span class="ws-ring"></span>
        ${Array.from({ length: 10 }, (_, i) => `<span class="ws-spark" style="--a:${i * 36}deg;--d:${i % 2 ? 78 : 96}px;--s:${i % 3 ? 6 : 9}px"></span>`).join('')}
        <svg class="ws-check" viewBox="0 0 96 96"><defs><linearGradient id="ws-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ff0c4"/><stop offset="1" stop-color="#2fbf86"/></linearGradient></defs><circle cx="48" cy="48" r="44" fill="url(#ws-g)"/><path d="M29 49.5 42 62 67 35"/></svg>
      </div>
      <h2 class="ws-title">${demo ? 'Demo mode ready' : 'Login successful'}</h2>
      <p class="ws-sub">${demo ? 'ยินดีต้อนรับ · ข้อมูลตัวอย่างเก็บในเบราว์เซอร์นี้' : 'ยินดีต้อนรับกลับ คุณ<b class="welcome-name">' + esc(name) + '</b>'}</p>
      <div class="ws-card">
        <div class="ws-account"><span class="welcome-avatar">${demo ? PERSON : esc(mark(name)) || PERSON}</span><div><b class="ws-account-name">${esc(name)}</b><small>${demo ? 'โหมดทดลอง' : esc(email)}</small></div><span class="ws-badge">${demo ? 'DEMO' : 'CLOUD'}</span></div>
        <ol class="welcome-steps">${steps.map((s, i) => `<li data-step="${i}"><span>${s}</span><i aria-hidden="true"></i></li>`).join('')}</ol>
        <div class="ws-foot"><span>EGAT Financial Feasibility</span><span>${esc(when)}</span></div>
      </div>
      <button type="button" class="ws-enter" data-enter>เข้าสู่แดชบอร์ด →</button>
    </div>`;
    document.body.append(el);
    document.body.classList.add('welcoming');
    el.querySelector('[data-enter]').onclick = () => { skip = true; if (ready) close(); };
    this.step(0);
  },

  // Put the account's real name and photo on the screen once the profile has loaded.
  identify({ name, avatarUrl } = {}) {
    if (!el) return;
    if (name) el.querySelectorAll('.welcome-name, .ws-account-name').forEach(n => (n.textContent = name));
    const av = el.querySelector('.welcome-avatar');
    if (avatarUrl) av.innerHTML = `<img src="${esc(avatarUrl)}" alt="">`;
    else if (name) av.innerHTML = esc(mark(name)) || PERSON;
  },

  // Mark rows 0..i as finished. Ticks are queued so they land one by one after the card is in.
  step(i) {
    if (!el) return;
    target = Math.max(target, i);
    const pump = () => {
      if (timer || !el || done > target) return;
      const since = performance.now() - startedAt;
      const wait = reduce() ? 0 : done === 0 ? Math.max(0, FIRST_TICK - since) : Math.max(0, STEP_GAP - (performance.now() - lastTick));
      timer = setTimeout(() => {
        timer = null;
        if (!el) return;
        el.querySelector(`[data-step="${done}"]`)?.classList.add('done');
        done += 1; lastTick = performance.now();
        pump();
      }, wait);
    };
    pump();
  },

  // Everything is ready: tick the remaining rows, wait for the minimum time (or the button), then wipe away.
  finish() {
    if (!el || finishing) return finishing;
    ready = true;
    this.step(2);
    if (skip) { finishing = new Promise(close); return finishing; }
    const since = performance.now() - startedAt;
    const remainingTicks = done === 0 ? Math.max(0, FIRST_TICK - since) + 2 * STEP_GAP : (3 - done) * STEP_GAP;
    const wait = reduce() ? 600 : Math.max(MIN_SHOW - since, remainingTicks + 700);
    finishing = new Promise(resolve => setTimeout(() => (el ? close(resolve) : resolve()), wait));
    return finishing;
  },
};
