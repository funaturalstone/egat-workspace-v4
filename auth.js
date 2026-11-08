// Login gate shown before the workspace opens. Demo mode stays available without an account.
const DEMO_KEY = 'egat-v4-mode';
const $ = s => document.querySelector(s);

export async function chooseMode(supabase) {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session) return { mode: 'cloud', user: data.session.user };
  }
  try { if (sessionStorage.getItem(DEMO_KEY) === 'demo') return { mode: 'demo' }; } catch { /* storage blocked */ }
  return new Promise(resolve => openGate(supabase, resolve));
}

function openGate(supabase, resolve) {
  const gate = $('#auth-gate'), form = $('#auth-form'), msg = $('#auth-message'), submit = $('#auth-submit');
  let signup = false;
  const say = (text, kind = 'error') => { msg.textContent = text; msg.dataset.kind = kind; };
  const setMode = s => {
    signup = s;
    $('#auth-title').textContent = s ? 'สมัครบัญชีใหม่' : 'เข้าสู่ระบบ';
    submit.textContent = s ? 'สมัครบัญชี →' : 'เข้าสู่ระบบ →';
    $('#auth-switch').textContent = s ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครใหม่';
    $('#auth-password').autocomplete = s ? 'new-password' : 'current-password';
    say('');
  };
  const done = value => { gate.hidden = true; document.body.classList.remove('gated'); resolve(value); };

  gate.hidden = false; document.body.classList.add('gated');
  $('#auth-switch').onclick = () => setMode(!signup);
  $('#auth-demo').onclick = () => { try { sessionStorage.setItem(DEMO_KEY, 'demo'); } catch { /* storage blocked */ } done({ mode: 'demo' }); };
  form.onsubmit = async e => {
    e.preventDefault();
    if (!supabase) return;
    const email = $('#auth-email').value.trim(), password = $('#auth-password').value;
    if (!/^\S+@\S+\.\S+$/.test(email)) return say('กรุณากรอกอีเมลให้ถูกต้อง');
    if (password.length < 8) return say('รหัสผ่านอย่างน้อย 8 ตัวอักษร');
    submit.disabled = true; say(signup ? 'กำลังสมัคร…' : 'กำลังเข้าสู่ระบบ…', 'info');
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } });
        if (error) throw error;
        if (data.session) return done({ mode: 'cloud', user: data.session.user });
        setMode(false); say('ส่งอีเมลยืนยันแล้ว · กดลิงก์ในอีเมล แล้วกลับมาเข้าสู่ระบบ', 'info');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        done({ mode: 'cloud', user: data.user });
      }
    } catch (err) {
      say(thaiError(err));
    } finally {
      submit.disabled = false;
    }
  };
  setMode(false);
  if (!supabase) {
    form.querySelectorAll('input, button').forEach(el => { el.disabled = true; });
    $('#auth-switch').disabled = true;
    say('ยังไม่ได้ตั้งค่า Supabase ในเครื่องนี้ · ใช้โหมดทดลองได้', 'info');
  } else {
    $('#auth-email').focus();
  }
}

function thaiError(err) {
  const m = String(err?.message || '');
  if (/invalid login credentials/i.test(m)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if (/email not confirmed/i.test(m)) return 'ยังไม่ได้ยืนยันอีเมล · ตรวจกล่องจดหมายของคุณ';
  if (/already registered/i.test(m)) return 'อีเมลนี้มีบัญชีแล้ว · ลองเข้าสู่ระบบแทน';
  if (/rate limit/i.test(m)) return 'ส่งคำขอบ่อยเกินไป · รอสักครู่แล้วลองใหม่';
  if (/fetch|network/i.test(m)) return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ · ตรวจการเชื่อมต่ออินเทอร์เน็ต';
  return `ทำรายการไม่สำเร็จ · ${m}`;
}

// Sidebar account row + header labels for the chosen mode.
export function showSignedIn(user, supabase) {
  document.body.dataset.mode = user ? 'cloud' : 'demo';
  $('#account-label').textContent = user ? user.email : 'โหมดทดลอง · ไม่ได้เข้าสู่ระบบ';
  const action = $('#account-action');
  action.textContent = user ? 'ออกจากระบบ' : 'เข้าสู่ระบบ / สมัคร';
  action.onclick = async () => {
    try { sessionStorage.removeItem(DEMO_KEY); } catch { /* storage blocked */ }
    if (user && supabase) await supabase.auth.signOut();
    location.reload();
  };
  $('#account').hidden = false;
  const badge = $('.demo-badge');
  if (badge?.lastChild) badge.lastChild.textContent = user ? ' WORKSPACE V4 · CLOUD' : ' WORKSPACE V4 · DEMO';
  const tag = $('.sample-tag');
  if (tag) tag.textContent = user ? 'ข้อมูลของบัญชีนี้' : 'ข้อมูลสมมติ';
}
