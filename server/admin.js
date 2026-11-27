// /quan-tri: where the CaramOS team writes the notices that every CaramOS computer shows (server/notices.js).
//
// One account. Its name and password hash are Pages secrets (ADMIN_USER, ADMIN_PASSWORD_HASH: "pbkdf2-sha256$<rounds>$
// <salt>$<hash>", made by scripts/admin-password.mjs), as is ADMIN_SESSION_SECRET, which signs the session cookie;
// nothing of it is in this public repository, and without them /quan-tri answers 404. A session lasts 12 hours. Eight
// failed sign-ins from one address in 15 minutes close the door for that address for 15 minutes; the address itself is
// not stored, only an HMAC of it. Every POST must come from this site (fromThisSite), and the cookie is SameSite=Strict.
// The pages have no script, no outside resource, and cannot be framed.
import { escapeHtml } from './stats.js';
import {
  CONDITIONS, EDITIONS, LEVELS, LIMITS, deleteNotice, getNotice, listNotices, parseForm, saveNotice, vietnamFromUtc,
} from './notices.js';

export const COOKIE = 'caramos_admin';
const SESSION_SECONDS = 12 * 3600;
const ROUNDS = 100000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const encoder = new TextEncoder();

export const LEVEL_LABEL = { info: 'Thông tin', warning: 'Cảnh báo', critical: 'Khẩn' };
export const EDITION_LABEL = { all: 'Cả hai bản', cinnamon: 'Cinnamon', xfce: 'Xfce' };
export const CONDITION_LABEL = { all: 'Mọi máy', 'update-waiting': 'Máy có bản cập nhật chưa cài',
  'update-failing': 'Máy cập nhật đang bị lỗi' };

function base64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function unbase64(text) {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
}

// Equal strings, compared in constant time for their length.
export function sameText(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16)), rounds = ROUNDS) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: rounds }, key, 256);
  return `pbkdf2-sha256$${rounds}$${base64(salt)}$${base64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256' || typeof password !== 'string') return false;
  const rounds = Number(parts[1]);
  // Cloudflare's PBKDF2 stops at 100 000 rounds.
  if (!Number.isInteger(rounds) || rounds < 10000 || rounds > 100000) return false;
  let salt;
  try {
    salt = unbase64(parts[2]);
  } catch {
    return false;
  }
  return sameText(await hashPassword(password, salt, rounds), String(stored));
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false,
    ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
  return base64(signature).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function makeSession(secret, user, now = new Date()) {
  const expires = Math.floor(now.getTime() / 1000) + SESSION_SECONDS;
  return `${expires}.${await hmac(secret, `session:${user}:${expires}`)}`;
}

export function cookieValue(header, name = COOKIE) {
  for (const part of String(header || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

export async function validSession(value, secret, user, now = new Date()) {
  const [expires, signature] = String(value || '').split('.');
  if (!/^\d{9,11}$/.test(expires || '') || !signature) return false;
  if (Number(expires) <= Math.floor(now.getTime() / 1000)) return false;
  return sameText(await hmac(secret, `session:${user}:${expires}`), signature);
}

function configured(env) {
  return Boolean(env.DB && env.ADMIN_USER && env.ADMIN_PASSWORD_HASH && env.ADMIN_SESSION_SECRET
    && String(env.ADMIN_SESSION_SECRET).length >= 32);
}

async function visitor(request, env) {
  return hmac(env.ADMIN_SESSION_SECRET, `address:${request.headers.get('CF-Connecting-IP') || ''}`);
}

export async function tooManyFailures(db, who, now = new Date()) {
  const since = new Date(now.getTime() - WINDOW_MS).toISOString();
  const row = await db.prepare('SELECT COUNT(*) AS n FROM admin_attempts WHERE who = ?1 AND at > ?2').bind(who, since).first();
  return (row?.n || 0) >= MAX_FAILURES;
}

async function recordFailure(db, who, now = new Date()) {
  const dayAgo = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  await db.batch([
    db.prepare('INSERT INTO admin_attempts (who, at) VALUES (?1, ?2)').bind(who, now.toISOString()),
    db.prepare('DELETE FROM admin_attempts WHERE at < ?1').bind(dayAgo),
  ]);
}

// ---------------------------------------------------------------------------------------------------------------------
// Pages

const HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  // Not no-referrer: under it a browser sends "Origin: null" with the page's own forms, and fromThisSite refuses them.
  // same-origin still sends nothing to other sites (a notice's link).
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};

function page(title, body, status = 200, extra = {}) {
  const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive"><meta name="referrer" content="same-origin">
<title>${escapeHtml(title)}</title>
<style>
:root{--bg:#f7f8f6;--fg:#1d2420;--dim:#5e6862;--line:#dfe4e0;--card:#fff;--accent:#2f7d4f;--warn:#b7791f;--bad:#b42318}
@media (prefers-color-scheme:dark){:root{--bg:#151a17;--fg:#e9eeea;--dim:#a2aca5;--line:#2c3530;--card:#1d2420;--accent:#4caf78}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:860px;margin:0 auto;padding:24px 16px 48px}h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:28px 0 10px}
.dim{color:var(--dim)}a{color:var(--accent)}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:12px 0}
.notice h3{margin:0 0 6px;font-size:16px}.notice p{margin:0;white-space:pre-wrap}.meta{color:var(--dim);font-size:13px;margin-top:8px}
.tag{display:inline-block;font-size:12px;font-weight:600;border-radius:6px;padding:1px 8px;margin-right:6px;border:1px solid var(--line)}
.tag.warning{color:var(--warn)}.tag.critical{color:var(--bad)}.tag.off{color:var(--dim)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
label{display:block;font-weight:600;margin:14px 0 4px}label small{font-weight:400;color:var(--dim)}
input[type=text],input[type=password],input[type=datetime-local],textarea,select{width:100%;font:inherit;color:inherit;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
textarea{min-height:120px;resize:vertical}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:600px){.two{grid-template-columns:1fr}}
button,.button{font:inherit;font-weight:600;border-radius:8px;padding:8px 14px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;text-decoration:none;display:inline-block}
button.primary{background:var(--accent);border-color:var(--accent);color:#fff}button.danger{color:var(--bad)}
.errors{border-color:var(--bad);color:var(--bad)}.ok{border-color:var(--accent)}
form.inline{display:inline}header{display:flex;justify-content:space-between;align-items:center;gap:12px}
</style></head><body><main>${body}</main></body></html>`;
  return new Response(html, { status, headers: { ...HEADERS, 'Content-Type': 'text/html; charset=utf-8', ...extra } });
}

function redirect(location, cookie) {
  const headers = { ...HEADERS, Location: location };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 303, headers });
}

function notFound() {
  return new Response('Not found', { status: 404, headers: { ...HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } });
}

function loginPage(message = '', status = 200) {
  return page('Đăng nhập: thông báo CaramOS', `<h1>Thông báo tới máy CaramOS</h1>
<p class="dim">Đăng nhập để viết thông báo gửi tới các máy đang dùng CaramOS.</p>
${message ? `<div class="card errors">${escapeHtml(message)}</div>` : ''}
<form class="card" method="post" action="/quan-tri/dang-nhap">
<label for="user">Tài khoản</label><input type="text" id="user" name="user" autocomplete="username" required>
<label for="password">Mật khẩu</label><input type="password" id="password" name="password" autocomplete="current-password" required>
<div class="row"><button class="primary" type="submit">Đăng nhập</button></div>
</form>`, status);
}

function target(row) {
  const parts = [EDITION_LABEL[row.editions] || row.editions];
  if (row.min_version && row.max_version) parts.push(`bản ${row.min_version} đến ${row.max_version}`);
  else if (row.min_version) parts.push(`bản ${row.min_version} trở lên`);
  else if (row.max_version) parts.push(`bản ${row.max_version} trở về trước`);
  else parts.push('mọi phiên bản');
  parts.push(CONDITION_LABEL[row.condition] || row.condition);
  return parts.join(' · ');
}

function when(row) {
  const show = (utc) => vietnamFromUtc(utc).replace('T', ' ');
  return row.ends_at ? `Từ ${show(row.starts_at)} đến ${show(row.ends_at)} (giờ Việt Nam)` : `Từ ${show(row.starts_at)} (giờ Việt Nam), không hẹn ngày tắt`;
}

function listPage(rows, flash = '') {
  const items = rows.map((row) => `<div class="card notice">
<div><span class="tag ${escapeHtml(row.level)}">${escapeHtml(LEVEL_LABEL[row.level] || row.level)}</span>${row.active ? '' : '<span class="tag off">Đang tắt</span>'}<span class="dim">#${escapeHtml(row.id)}</span></div>
<h3>${escapeHtml(row.title_vi)}</h3><p>${escapeHtml(row.body_vi)}</p>
${row.link_url ? `<p class="meta">Liên kết: ${escapeHtml(row.link_label_vi)} (${escapeHtml(row.link_url)})</p>` : ''}
<p class="meta">${escapeHtml(target(row))}<br>${escapeHtml(when(row))}${row.title_en ? '<br>Có bản tiếng Anh.' : '<br>Chưa có bản tiếng Anh: máy dùng tiếng Anh cũng thấy tiếng Việt.'}</p>
<div class="row"><a class="button" href="/quan-tri/sua/${escapeHtml(row.id)}">Sửa</a>
<form class="inline" method="post" action="/quan-tri/bat-tat"><input type="hidden" name="id" value="${escapeHtml(row.id)}"><button type="submit">${row.active ? 'Tắt' : 'Bật lại'}</button></form>
<form class="inline" method="post" action="/quan-tri/xoa"><input type="hidden" name="id" value="${escapeHtml(row.id)}"><button class="danger" type="submit">Xóa</button></form></div>
</div>`).join('');
  return page('Thông báo tới máy CaramOS', `<header><div><h1>Thông báo tới máy CaramOS</h1>
<p class="dim">Mỗi máy CaramOS đọc danh sách này vài phút sau khi đăng nhập và cứ 4 giờ một lần, rồi hiện mỗi thông báo một lần cho mỗi người dùng. Máy chỉ hiện chữ và một liên kết, không chạy gì cả.</p></div>
<form class="inline" method="post" action="/quan-tri/dang-xuat"><button type="submit">Đăng xuất</button></form></header>
${flash ? `<div class="card ok">${escapeHtml(flash)}</div>` : ''}
<div class="row"><a class="button" href="/quan-tri/moi"><strong>Viết thông báo mới</strong></a></div>
<h2>Các thông báo</h2>${items || '<p class="dim">Chưa có thông báo nào.</p>'}`);
}

function option(value, label, selected) {
  return `<option value="${escapeHtml(value)}"${value === selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
}

function formPage(row = {}, errors = []) {
  const value = (name) => escapeHtml(row[name] ?? '');
  const id = row.id ? escapeHtml(row.id) : '';
  const starts = row.starts_at && !row.starts_local ? vietnamFromUtc(row.starts_at) : (row.starts_local || '');
  const ends = row.ends_at && !row.ends_local ? vietnamFromUtc(row.ends_at) : (row.ends_local || '');
  const active = row.active === undefined ? true : Boolean(row.active);
  return page(id ? `Sửa thông báo #${id}` : 'Viết thông báo mới', `<h1>${id ? `Sửa thông báo #${id}` : 'Viết thông báo mới'}</h1>
<p><a href="/quan-tri">Quay lại danh sách</a></p>
${errors.length ? `<div class="card errors">${errors.map((e) => `<div>${escapeHtml(e)}</div>`).join('')}</div>` : ''}
<form class="card" method="post" action="/quan-tri/luu">
${id ? `<input type="hidden" name="id" value="${id}">` : ''}
<label for="level">Mức độ</label><select id="level" name="level">${LEVELS.map((l) => option(l, LEVEL_LABEL[l], row.level || 'info')).join('')}</select>
<label for="title_vi">Tiêu đề <small>(tối đa ${LIMITS.title} ký tự)</small></label><input type="text" id="title_vi" name="title_vi" maxlength="${LIMITS.title}" value="${value('title_vi')}" required>
<label for="body_vi">Nội dung <small>(chữ thường, xuống dòng giữ nguyên; tối đa ${LIMITS.body} ký tự)</small></label><textarea id="body_vi" name="body_vi" maxlength="${LIMITS.body}" required>${value('body_vi')}</textarea>
<label for="title_en">Tiêu đề tiếng Anh <small>(cho bản Xfce tiếng Anh; để trống thì máy tiếng Anh thấy tiếng Việt)</small></label><input type="text" id="title_en" name="title_en" maxlength="${LIMITS.title}" value="${value('title_en')}">
<label for="body_en">Nội dung tiếng Anh</label><textarea id="body_en" name="body_en" maxlength="${LIMITS.body}">${value('body_en')}</textarea>
<h2>Gửi tới máy nào</h2>
<div class="two"><div><label for="editions">Bản</label><select id="editions" name="editions">${EDITIONS.map((e) => option(e, EDITION_LABEL[e], row.editions || 'all')).join('')}</select></div>
<div><label for="condition">Điều kiện</label><select id="condition" name="condition">${CONDITIONS.map((c) => option(c, CONDITION_LABEL[c], row.condition || 'all')).join('')}</select></div></div>
<div class="two"><div><label for="min_version">Phiên bản từ <small>(ví dụ 1.0.12; trống: không giới hạn)</small></label><input type="text" id="min_version" name="min_version" value="${value('min_version')}" placeholder="1.0.1"></div>
<div><label for="max_version">Phiên bản đến <small>(trống: không giới hạn)</small></label><input type="text" id="max_version" name="max_version" value="${value('max_version')}" placeholder="1.5.1"></div></div>
<h2>Liên kết <small class="dim">(không bắt buộc, chỉ trang trên vietnamlinuxfamily.net)</small></h2>
<label for="link_url">Địa chỉ</label><input type="text" id="link_url" name="link_url" value="${value('link_url')}" placeholder="https://caramos.vietnamlinuxfamily.net/...">
<div class="two"><div><label for="link_label_vi">Nhãn nút</label><input type="text" id="link_label_vi" name="link_label_vi" maxlength="${LIMITS.label}" value="${value('link_label_vi')}" placeholder="Xem hướng dẫn"></div>
<div><label for="link_label_en">Nhãn nút tiếng Anh</label><input type="text" id="link_label_en" name="link_label_en" maxlength="${LIMITS.label}" value="${value('link_label_en')}" placeholder="See how"></div></div>
<h2>Thời gian <small class="dim">(giờ Việt Nam)</small></h2>
<div class="two"><div><label for="starts_at">Bắt đầu <small>(trống: ngay khi lưu)</small></label><input type="datetime-local" id="starts_at" name="starts_at" value="${escapeHtml(starts)}"></div>
<div><label for="ends_at">Kết thúc <small>(trống: tới khi tắt)</small></label><input type="datetime-local" id="ends_at" name="ends_at" value="${escapeHtml(ends)}"></div></div>
<label><input type="checkbox" name="active" value="1"${active ? ' checked' : ''}> Đang bật</label>
<div class="row"><button class="primary" type="submit">Lưu</button><a class="button" href="/quan-tri">Hủy</a></div>
</form>`);
}

function sessionCookie(value, maxAge) {
  return `${COOKIE}=${value}; Path=/quan-tri; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

// A POST sent by a page of this site. Browsers say so in Sec-Fetch-Site, which no page script can set, and in Origin
// unless the sending page's referrer policy is no-referrer: then Origin is "null" (a page opened before the policy
// changed). Another site's form or script gets Sec-Fetch-Site cross-site or same-site and its own Origin.
export function fromThisSite(request, url) {
  const site = request.headers.get('Sec-Fetch-Site');
  if (site) return site === 'same-origin';
  return request.headers.get('Origin') === url.origin;
}

function idFrom(form) {
  const id = Number(form.get('id'));
  return Number.isInteger(id) && id > 0 ? id : null;
}

// /quan-tri and everything under it. path is what follows /quan-tri, without slashes at either end.
export async function handleAdmin(request, env, path, now = new Date()) {
  if (!configured(env)) return notFound();
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  if (method === 'POST' && !fromThisSite(request, url)) {
    return new Response('Forbidden', { status: 403, headers: { ...HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const db = env.DB;
  const user = String(env.ADMIN_USER);
  if (method === 'POST' && path === 'dang-nhap') {
    const who = await visitor(request, env);
    if (await tooManyFailures(db, who, now)) return loginPage('Sai mật khẩu nhiều lần. Thử lại sau 15 phút.', 429);
    const form = await request.formData();
    const okUser = sameText(String(form.get('user') || ''), user);
    const okPassword = await verifyPassword(String(form.get('password') || ''), env.ADMIN_PASSWORD_HASH);
    if (!okUser || !okPassword) {
      await recordFailure(db, who, now);
      return loginPage('Tài khoản hoặc mật khẩu không đúng.', 401);
    }
    return redirect('/quan-tri', sessionCookie(await makeSession(env.ADMIN_SESSION_SECRET, user, now), SESSION_SECONDS));
  }
  const signedIn = await validSession(cookieValue(request.headers.get('Cookie')), env.ADMIN_SESSION_SECRET, user, now);
  if (!signedIn) {
    if (method === 'GET' && (path === '' || path === 'moi' || path.startsWith('sua/'))) return loginPage();
    return redirect('/quan-tri');
  }
  if (method === 'GET' && path === '') {
    const saved = url.searchParams.get('da-luu');
    return listPage(await listNotices(db), saved ? `Đã lưu thông báo #${saved}. Các máy nhận trong vài giờ tới.` : '');
  }
  if (method === 'GET' && path === 'moi') return formPage();
  if (method === 'GET' && path.startsWith('sua/')) {
    const row = await getNotice(db, Number(path.slice(4)) || 0);
    return row ? formPage(row) : notFound();
  }
  if (method === 'POST' && path === 'dang-xuat') return redirect('/quan-tri', sessionCookie('', 0));
  if (method === 'POST' && path === 'luu') {
    const form = await request.formData();
    const id = idFrom(form);
    if (id && !(await getNotice(db, id))) return notFound();
    const { notice, errors } = parseForm(form, now);
    if (errors.length) {
      return formPage({ ...notice, id, starts_local: String(form.get('starts_at') || ''), ends_local: String(form.get('ends_at') || '') },
        errors);
    }
    const savedId = await saveNotice(db, notice, id, now);
    return redirect(`/quan-tri?da-luu=${encodeURIComponent(savedId ?? '')}`);
  }
  if (method === 'POST' && (path === 'xoa' || path === 'bat-tat')) {
    const form = await request.formData();
    const id = idFrom(form);
    const row = id ? await getNotice(db, id) : null;
    if (!row) return notFound();
    if (path === 'xoa') await deleteNotice(db, id);
    else await db.prepare('UPDATE notices SET active = ?1, updated_at = ?2 WHERE id = ?3').bind(row.active ? 0 : 1, now.toISOString().replace(/\.\d{3}Z$/, 'Z'), id).run();
    return redirect('/quan-tri');
  }
  return notFound();
}
