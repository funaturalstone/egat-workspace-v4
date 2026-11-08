// Welcome screen shown right after signing in (or choosing demo mode), before the workspace appears.
// The steps tick off as the real work finishes: sign-in → client projects loaded → dashboard drawn.
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const MIN_SHOW = 3000; // ms, so each step can be read even when loading is instant
const STEP_GAP = 760;  // ms between ticks
const PERSON = '<svg viewBox="0 0 24 24" class="avatar-icon"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/></svg>';
// Latin names become two initials; Thai names (and demo) keep the person icon, since Thai doesn't abbreviate well.
const mark = name => (/^[A-Za-z0-9]/.test(name || '') ? name.trim().split(/[\s._-]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() : '');

let el = null, startedAt = 0, done = 0, finishing = null, target = -1, timer = null, lastTick = 0;

export const welcome = {
  get active() { return Boolean(el); },

  start({ mode = 'cloud', email = '' } = {}) {
    if (el) return;
    startedAt = performance.now(); done = 0; target = -1; clearTimeout(timer); timer = null; lastTick = 0;
    const steps = mode === 'demo'
      ? ['เปิดโหมดทดลอง', 'เตรียมโครงการตัวอย่าง', 'จัดแดชบอร์ดและกราฟ']
      : ['ยืนยันตัวตนสำเร็จ', 'โหลดโครงการลูกค้าของคุณ', 'จัดแดชบอร์ดและกราฟ'];
    const name = mode === 'demo' ? 'ผู้ทดลองใช้งาน' : (email.split('@')[0] || '');
    el = document.createElement('div');
    el.className = 'welcome';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<div class="welcome-inner">
      <div class="welcome-mark" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M36.5 7 15 36.5h14.5L26 57l23-31.5H34.2L36.5 7Z"/></svg></div>
      <p class="welcome-kicker">${mode === 'demo' ? 'ยินดีต้อนรับสู่โหมดทดลอง' : 'ยินดีต้อนรับกลับ'}</p>
      <div class="welcome-who"><span class="welcome-avatar" aria-hidden="true">${mode === 'demo' ? PERSON : esc(mark(name)) || PERSON}</span><h2 class="welcome-name">${esc(name)}</h2></div>
      <p class="welcome-sub">EGAT Financial Feasibility · ลงทุนพลังงาน มองเห็นความคุ้มค่า</p>
      <ol class="welcome-steps">${steps.map((s, i) => `<li data-step="${i}"><i aria-hidden="true"></i><span>${s}</span></li>`).join('')}</ol>
      <div class="welcome-bar" aria-hidden="true"><span></span></div>
    </div>`;
    document.body.append(el);
    document.body.classList.add('welcoming');
    this.step(0);
  },

  // Put the account's real name and photo on the screen once the profile has loaded.
  identify({ name, avatarUrl } = {}) {
    if (!el) return;
    if (name) el.querySelector('.welcome-name').textContent = name;
    const av = el.querySelector('.welcome-avatar');
    if (avatarUrl) av.innerHTML = `<img src="${esc(avatarUrl)}" alt="">`;
    else if (name) av.innerHTML = esc(mark(name)) || PERSON;
  },

  // Mark steps 0..i as finished. Ticks are queued so they land one by one, STEP_GAP apart.
  step(i) {
    if (!el) return;
    target = Math.max(target, i);
    const pump = () => {
      if (timer || !el || done > target) return;
      const wait = reduce() || done === 0 ? 0 : Math.max(0, STEP_GAP - (performance.now() - lastTick));
      timer = setTimeout(() => {
        timer = null;
        if (!el) return;
        el.querySelector(`[data-step="${done}"]`)?.classList.add('done');
        done += 1; lastTick = performance.now();
        el.style.setProperty('--progress', String(done / 3));
        pump();
      }, wait);
    };
    pump();
  },

  // Finish all steps, wait the minimum time, then wipe away to reveal the workspace.
  finish() {
    if (!el || finishing) return finishing;
    this.step(2);
    const wait = Math.max(0, MIN_SHOW - (performance.now() - startedAt), reduce() ? 0 : (3 - done) * STEP_GAP + 600);
    finishing = new Promise(resolve => setTimeout(() => {
      const node = el; el = null; finishing = null;
      node.classList.add('out');
      document.body.classList.remove('welcoming');
      setTimeout(() => { node.remove(); resolve(); }, reduce() ? 200 : 1020);
    }, wait));
    return finishing;
  },
};
