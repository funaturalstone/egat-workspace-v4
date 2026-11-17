// Account profile: name, job title, location and photo — each account sees and edits only its own.
// Signed in: Supabase table `profiles` + private bucket `avatars` (RLS: owner only, files under <user id>/).
// Demo mode: kept in this browser only.
import { welcome } from './welcome.js';
const DEMO_KEY = 'egat-v4-demo-profile';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initials(name, email) {
  const base = (name || '').trim() || (email || '').split('@')[0] || '';
  if (!base) return '';
  const parts = base.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : base.slice(0, 2)).toUpperCase();
}

export function displayName(p) {
  return (p.display_name || '').trim() || (p.email ? p.email.split('@')[0] : 'ผู้ใช้โหมดทดลอง');
}

// Square-crop and shrink a photo in the browser before saving it (max 320 px JPEG).
export async function resizeImage(file, size = 320) {
  if (!file || !/^image\//.test(file.type)) throw new Error('ไฟล์ต้องเป็นรูปภาพ');
  if (file.size > 15 * 1024 * 1024) throw new Error('รูปใหญ่เกิน 15 MB');
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas.getContext('2d').drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close?.();
  return new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('แปลงรูปไม่สำเร็จ'))), 'image/jpeg', 0.86));
}

const blobToDataUrl = blob => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(blob); });

async function loadProfile(supabase, user) {
  if (!user || !supabase) {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(DEMO_KEY) || '{}'); } catch { /* storage blocked */ }
    return { mode: 'demo', email: '', display_name: saved.display_name || '', job_title: saved.job_title || '', location: saved.location || '', avatarUrl: saved.avatar || null };
  }
  const { data, error } = await supabase.from('profiles').select('display_name, job_title, location, avatar_path').maybeSingle();
  if (error) throw error;
  const p = { mode: 'cloud', email: user.email, display_name: data?.display_name || '', job_title: data?.job_title || '', location: data?.location || '', avatar_path: data?.avatar_path || null, avatarUrl: null };
  if (p.avatar_path) {
    const { data: signed } = await supabase.storage.from('avatars').createSignedUrl(p.avatar_path, 60 * 60);
    p.avatarUrl = signed?.signedUrl ?? null;
  }
  return p;
}

async function saveProfile(supabase, user, current, fields, photo) {
  const next = { ...current, ...fields };
  if (current.mode === 'demo') {
    if (photo === 'remove') next.avatarUrl = null;
    else if (photo) next.avatarUrl = await blobToDataUrl(await resizeImage(photo, 160));
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify({ display_name: next.display_name, job_title: next.job_title, location: next.location, avatar: next.avatarUrl }));
    } catch { throw new Error('เบราว์เซอร์ไม่อนุญาตให้บันทึก'); }
    return next;
  }
  const oldPath = current.avatar_path;
  if (photo === 'remove') { next.avatar_path = null; next.avatarUrl = null; }
  else if (photo) {
    const blob = await resizeImage(photo);
    const path = `${user.id}/avatar-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error) throw error;
    next.avatar_path = path;
    next.avatarUrl = URL.createObjectURL(blob);
  }
  const { error } = await supabase.from('profiles').upsert({ owner: user.id, display_name: next.display_name, job_title: next.job_title, location: next.location, avatar_path: next.avatar_path ?? null });
  if (error) throw error;
  if (oldPath && oldPath !== next.avatar_path) await supabase.storage.from('avatars').remove([oldPath]); // tidy up the replaced photo
  return next;
}

export function avatarHtml(p, cls = '') {
  return p.avatarUrl
    ? `<span class="avatar ${cls}"><img src="${esc(p.avatarUrl)}" alt=""></span>`
    : `<span class="avatar ${cls}" aria-hidden="true">${esc(initials(p.display_name, p.email)) || '<svg viewBox="0 0 24 24" class="avatar-icon"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/></svg>'}</span>`;
}

function cardHtml(p) {
  const meta = [p.location ? `<span>${esc(p.location)}</span>` : '', p.email ? `<span>${esc(p.email)}</span>` : '<span>โหมดทดลอง · บันทึกในเบราว์เซอร์นี้</span>'].filter(Boolean).join('<i>·</i>');
  return `<div class="profile-card"><div class="profile-cover"></div><div class="profile-body">${avatarHtml(p, 'xl')}<div class="profile-text"><h2>${esc(displayName(p))}</h2><p>${esc(p.job_title || 'ยังไม่ได้ระบุตำแหน่ง')}</p><div class="profile-meta">${meta}</div></div></div></div>`;
}

// Header chip + sidebar account row + profile dialog.
export async function initProfile(supabase, user) {
  let profile;
  try { profile = await loadProfile(supabase, user); }
  catch (error) { console.error(error); profile = { mode: user ? 'cloud' : 'demo', email: user?.email || '', display_name: '', job_title: '', location: '', avatarUrl: null }; }

  if (profile.display_name || profile.avatarUrl) welcome.identify({ name: profile.display_name ? displayName(profile) : '', avatarUrl: profile.avatarUrl });

  const chip = document.createElement('button');
  chip.type = 'button'; chip.className = 'profile-chip'; chip.id = 'profile-chip';
  $('.top-actions')?.prepend(chip);

  const dialog = document.createElement('dialog');
  dialog.id = 'profile-dialog'; dialog.setAttribute('aria-labelledby', 'profile-dialog-title');
  document.body.append(dialog);

  let photo = null; // File | 'remove' | null
  const render = () => {
    chip.innerHTML = `${avatarHtml(profile, 'sm')}<span>${esc(displayName(profile))}</span>`;
    chip.setAttribute('aria-label', 'โปรไฟล์ของ ' + displayName(profile));
    const account = $('#account');
    if (account) {
      let row = account.querySelector('.account-profile');
      if (!row) { row = document.createElement('button'); row.type = 'button'; row.className = 'account-profile'; account.prepend(row); row.onclick = open; }
      row.innerHTML = `${avatarHtml(profile, 'md')}<span><b>${esc(displayName(profile))}</b><small>${esc(profile.job_title || profile.email || 'โหมดทดลอง')}</small></span>`;
      const label = $('#account-label'); if (label) label.hidden = true;
    }
  };
  const open = () => {
    photo = null;
    dialog.innerHTML = `<form method="dialog" class="profile-form" novalidate>
      <div class="dialog-top"><div><span class="eyebrow">YOUR ACCOUNT</span><h2 id="profile-dialog-title">โปรไฟล์ของฉัน</h2></div><button type="button" class="close-button" data-close aria-label="ปิด">×</button></div>
      <div id="profile-preview">${cardHtml(profile)}</div>
      <div class="profile-photo-row"><label class="button" for="profile-photo">เปลี่ยนรูป</label><input id="profile-photo" type="file" accept="image/*" hidden>${profile.avatarUrl ? '<button type="button" class="text-button" data-remove-photo>ลบรูป</button>' : ''}<small>JPG / PNG · ระบบย่อเป็น 320×320 ให้อัตโนมัติ</small></div>
      <label class="field">ชื่อที่แสดง<input id="profile-name" maxlength="80" autocomplete="name" value="${esc(profile.display_name)}" placeholder="เช่น สมชาย ใจดี"></label>
      <label class="field">ตำแหน่ง<input id="profile-title" maxlength="80" autocomplete="organization-title" value="${esc(profile.job_title)}" placeholder="เช่น Energy Analyst · ฝ่ายวางแผน"></label>
      <label class="field">สถานที่<input id="profile-location" maxlength="80" value="${esc(profile.location)}" placeholder="เช่น นนทบุรี, ประเทศไทย"></label>
      <p class="profile-message" role="status"></p>
      <div class="project-modal-actions"><button type="button" class="button" data-close>ยกเลิก</button><button type="submit" class="button primary">บันทึกโปรไฟล์</button></div>
    </form>`;
    const form = dialog.querySelector('form'), msg = dialog.querySelector('.profile-message');
    const preview = () => {
      const draft = { ...profile, display_name: form.querySelector('#profile-name').value, job_title: form.querySelector('#profile-title').value, location: form.querySelector('#profile-location').value };
      if (photo === 'remove') draft.avatarUrl = null;
      else if (photo) draft.avatarUrl = URL.createObjectURL(photo);
      dialog.querySelector('#profile-preview').innerHTML = cardHtml(draft);
    };
    form.addEventListener('input', preview);
    form.querySelector('#profile-photo').onchange = e => { const f = e.target.files?.[0]; if (f) { photo = f; msg.textContent = ''; preview(); } };
    form.querySelector('[data-remove-photo]')?.addEventListener('click', () => { photo = 'remove'; preview(); });
    form.querySelectorAll('[data-close]').forEach(b => (b.onclick = () => dialog.close()));
    form.onsubmit = async e => {
      e.preventDefault();
      const submit = form.querySelector('[type=submit]'); submit.disabled = true; msg.dataset.kind = 'info'; msg.textContent = 'กำลังบันทึก…';
      try {
        profile = await saveProfile(supabase, user, profile, {
          display_name: form.querySelector('#profile-name').value.trim(),
          job_title: form.querySelector('#profile-title').value.trim(),
          location: form.querySelector('#profile-location').value.trim(),
        }, photo);
        render(); dialog.close();
      } catch (error) {
        msg.dataset.kind = 'error'; msg.textContent = 'บันทึกไม่สำเร็จ · ' + (error?.message || error);
      } finally { submit.disabled = false; }
    };
    dialog.showModal();
    form.querySelector('#profile-name').focus();
  };
  chip.onclick = open;
  render();
  return { get profile() { return profile; } };
}
