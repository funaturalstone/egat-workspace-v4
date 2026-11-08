// Where the workspace lives: signed-in users sync to their own rows in Supabase (RLS: owner only),
// demo visitors keep the original browser-only localStorage behaviour.
import { createClient } from '@supabase/supabase-js';
import { freshWorkspace, validWorkspace, storageKey } from './projects.js';
import { toRows, toSettings, fromRows, removedIds } from './workspace-sync.js';
import { chooseMode, showSignedIn } from './auth.js';

const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;

const status = text => { const el = document.querySelector('#local-status'); if (el) el.textContent = text; };

function demoWorkspace() {
  let state = freshWorkspace(), available = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? localStorage.getItem('egat-bento-v3-project-workspace'));
    if (validWorkspace(saved)) state = saved;
  } catch { available = false; }
  return {
    mode: 'demo', state,
    save(s) {
      try { localStorage.setItem(storageKey, JSON.stringify(s)); available = true; } catch { available = false; }
      status(available ? '● โหมดทดลอง · บันทึกในเบราว์เซอร์นี้' : 'เฉพาะรอบนี้ · เบราว์เซอร์ไม่อนุญาตให้บันทึก');
    },
  };
}

async function cloudWorkspace(user) {
  status('กำลังโหลดข้อมูลจากคลาวด์…');
  const [rows, settings] = await Promise.all([
    supabase.from('client_projects').select('id, product, name, scenario, position').order('position'),
    supabase.from('workspace_settings').select('selected, active').maybeSingle(),
  ]);
  if (rows.error) throw rows.error;
  if (settings.error) throw settings.error;

  let known = new Set(rows.data.map(r => r.id));
  const fresh = rows.data.length === 0 && !settings.data;
  const { state, dropped } = fresh ? { state: freshWorkspace(), dropped: 0 } : fromRows(rows.data, settings.data);

  let timer = null, queued = null, chain = Promise.resolve();
  async function push(s) {
    const projectRows = toRows(s, user.id);
    if (projectRows.length) {
      const { error } = await supabase.from('client_projects').upsert(projectRows, { onConflict: 'owner,id' });
      if (error) throw error;
    }
    const gone = removedIds(known, s);
    if (gone.length) {
      const { error } = await supabase.from('client_projects').delete().eq('owner', user.id).in('id', gone);
      if (error) throw error;
    }
    const { error } = await supabase.from('workspace_settings').upsert(toSettings(s, user.id));
    if (error) throw error;
    known = new Set(s.projects.map(p => p.id));
  }
  // saves run one at a time, newest snapshot wins; failures keep the snapshot so the next change retries it
  function flush() {
    clearTimeout(timer); timer = null;
    if (!queued) return chain;
    const snapshot = queued; queued = null;
    chain = chain.then(() => push(snapshot)).then(
      () => status(queued ? 'กำลังบันทึก…' : '● บันทึกบนคลาวด์แล้ว'),
      () => { queued = queued ?? snapshot; status('บันทึกไม่สำเร็จ · จะลองใหม่เมื่อแก้ไขครั้งถัดไป'); },
    );
    return chain;
  }
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  addEventListener('beforeunload', e => { if (queued || timer) { flush(); e.preventDefault(); } });

  const ws = {
    mode: 'cloud', state,
    save(s) { queued = structuredClone(s); status('กำลังบันทึก…'); clearTimeout(timer); timer = setTimeout(flush, 600); },
  };
  if (fresh) ws.save(state); // first sign-in: start from the sample clients and store them for this account
  else status(dropped ? `● โหลดแล้ว · ข้าม ${dropped} รายการที่ข้อมูลไม่ถูกต้อง` : '● บันทึกบนคลาวด์แล้ว');
  return ws;
}

export async function openWorkspace() {
  const choice = await chooseMode(supabase);
  if (choice.mode === 'demo') { showSignedIn(null, supabase); return demoWorkspace(); }
  showSignedIn(choice.user, supabase);
  try {
    return await cloudWorkspace(choice.user);
  } catch (error) {
    console.error(error);
    status('โหลดข้อมูลคลาวด์ไม่สำเร็จ · กำลังเปิดโหมดทดลอง');
    return demoWorkspace();
  }
}
