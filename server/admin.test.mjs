import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COOKIE, cookieValue, handleAdmin, hashPassword, makeSession, sameText, validSession, verifyPassword,
} from './admin.js';
import { sqliteD1 } from './sqlite-d1.mjs';

const ORIGIN = 'https://caramos.vietnamlinuxfamily.net';
const NOW = new Date('2026-11-27T02:00:00Z');
const SECRET = 's'.repeat(40);
const PASSWORD = 'mật khẩu thật dài 2026';

async function environment() {
  return {
    DB: sqliteD1(['0004_notices.sql']),
    ADMIN_USER: 'caramos',
    ADMIN_PASSWORD_HASH: await hashPassword(PASSWORD, new Uint8Array(16).fill(7), 10000),
    ADMIN_SESSION_SECRET: SECRET,
  };
}

function request(path, { method = 'GET', form, cookie, origin = ORIGIN, ip = '203.0.113.9' } = {}) {
  const headers = { 'CF-Connecting-IP': ip };
  if (method === 'POST' && origin !== null) headers.Origin = origin;
  if (cookie) headers.Cookie = `${COOKIE}=${cookie}`;
  let body;
  if (form) {
    body = new URLSearchParams(form).toString();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return new Request(`${ORIGIN}/quan-tri${path ? `/${path}` : ''}`, { method, headers, body });
}

async function signIn(env, now = NOW) {
  const response = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: PASSWORD } }),
    env, 'dang-nhap', now);
  assert.equal(response.status, 303);
  return cookieValue(response.headers.get('Set-Cookie'));
}

test('passwords are checked against their PBKDF2 hash', async () => {
  const stored = await hashPassword('một mật khẩu dài', new Uint8Array(16).fill(1), 10000);
  assert.match(stored, /^pbkdf2-sha256\$10000\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
  assert.equal(await verifyPassword('một mật khẩu dài', stored), true);
  assert.equal(await verifyPassword('một mật khẩu dài ', stored), false);
  assert.equal(await verifyPassword('một mật khẩu dài', 'sha1$1$abc$def'), false);
  assert.equal(await verifyPassword('một mật khẩu dài', 'pbkdf2-sha256$500$AAAA$BBBB'), false, 'too few rounds');
  assert.equal(await verifyPassword('x', undefined), false);
  assert.equal(sameText('abc', 'abc'), true);
  assert.equal(sameText('abc', 'abd'), false);
});

test('a session is signed, for one account, and ends', async () => {
  const value = await makeSession(SECRET, 'caramos', NOW);
  assert.equal(await validSession(value, SECRET, 'caramos', NOW), true);
  assert.equal(await validSession(value, SECRET, 'someone', NOW), false);
  assert.equal(await validSession(value, 't'.repeat(40), 'caramos', NOW), false);
  assert.equal(await validSession(value.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')), SECRET, 'caramos', NOW), false);
  assert.equal(await validSession(value, SECRET, 'caramos', new Date(NOW.getTime() + 13 * 3600 * 1000)), false);
  assert.equal(await validSession('', SECRET, 'caramos', NOW), false);
  assert.equal(cookieValue(`a=1; ${COOKIE}=x.y; b=2`), 'x.y');
});

test('without its secrets the page does not exist', async () => {
  const env = await environment();
  delete env.ADMIN_PASSWORD_HASH;
  assert.equal((await handleAdmin(request(''), env, '', NOW)).status, 404);
  const short = { ...(await environment()), ADMIN_SESSION_SECRET: 'short' };
  assert.equal((await handleAdmin(request(''), short, '', NOW)).status, 404);
});

test('signing in: the form, a wrong password, the cookie', async () => {
  const env = await environment();
  const page = await handleAdmin(request(''), env, '', NOW);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /<form class="card" method="post" action="\/quan-tri\/dang-nhap">/);
  assert.match(page.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.equal(page.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive');
  const wrong = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: 'sai' } }), env,
    'dang-nhap', NOW);
  assert.equal(wrong.status, 401);
  assert.match(await wrong.text(), /Tài khoản hoặc mật khẩu không đúng/);
  const right = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: PASSWORD } }), env,
    'dang-nhap', NOW);
  assert.equal(right.status, 303);
  assert.equal(right.headers.get('Location'), '/quan-tri');
  const cookie = right.headers.get('Set-Cookie');
  for (const part of ['Path=/quan-tri', 'HttpOnly', 'Secure', 'SameSite=Strict', 'Max-Age=43200']) assert.ok(cookie.includes(part), part);
  const stored = await env.DB.prepare('SELECT who, at FROM admin_attempts').all();
  assert.equal(stored.results.length, 1);
  assert.ok(!JSON.stringify(stored.results).includes('203.0.113.9'), 'the address itself is not stored');
});

test('eight failures from one address close the door for 15 minutes', async () => {
  const env = await environment();
  for (let i = 0; i < 8; i += 1) {
    const r = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: `sai ${i}` } }), env,
      'dang-nhap', NOW);
    assert.equal(r.status, 401);
  }
  const blocked = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: PASSWORD } }), env,
    'dang-nhap', NOW);
  assert.equal(blocked.status, 429);
  const other = await handleAdmin(request('dang-nhap', { method: 'POST', ip: '198.51.100.7',
    form: { user: 'caramos', password: PASSWORD } }), env, 'dang-nhap', NOW);
  assert.equal(other.status, 303, 'another address can still sign in');
  const later = await handleAdmin(request('dang-nhap', { method: 'POST', form: { user: 'caramos', password: PASSWORD } }), env,
    'dang-nhap', new Date(NOW.getTime() + 16 * 60 * 1000));
  assert.equal(later.status, 303);
});

test('a POST from another site is refused, signed in or not', async () => {
  const env = await environment();
  const cookie = await signIn(env);
  for (const origin of ['https://evil.example', null]) {
    const r = await handleAdmin(request('luu', { method: 'POST', cookie, origin, form: { level: 'info', title_vi: 'x', body_vi: 'y' } }),
      env, 'luu', NOW);
    assert.equal(r.status, 403);
  }
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM notices').first()).n, 0);
});

test('without a session: the sign-in form, and nothing is changed', async () => {
  const env = await environment();
  const r = await handleAdmin(request('luu', { method: 'POST', form: { level: 'info', title_vi: 'x', body_vi: 'y' } }), env, 'luu', NOW);
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('Location'), '/quan-tri');
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM notices').first()).n, 0);
  const form = await handleAdmin(request('moi'), env, 'moi', NOW);
  assert.match(await form.text(), /Đăng nhập/);
});

test('write, list, edit, turn off and delete a notice', async () => {
  const env = await environment();
  const cookie = await signIn(env);
  const fields = { level: 'critical', title_vi: 'Máy kẹt cập nhật', body_vi: 'Bấm Cập nhật trong Trung tâm cập nhật.',
    max_version: '1.5.1', condition: 'update-waiting', active: '1' };
  const saved = await handleAdmin(request('luu', { method: 'POST', cookie, form: fields }), env, 'luu', NOW);
  assert.equal(saved.status, 303);
  assert.equal(saved.headers.get('Location'), '/quan-tri?da-luu=1');
  const list = await (await handleAdmin(new Request(`${ORIGIN}/quan-tri?da-luu=1`, { headers: { Cookie: `${COOKIE}=${cookie}` } }),
    env, '', NOW)).text();
  assert.match(list, /Đã lưu thông báo #1/);
  assert.match(list, /Máy kẹt cập nhật/);
  assert.match(list, /bản 1\.5\.1 trở về trước · Máy có bản cập nhật chưa cài/);
  assert.match(list, /Chưa có bản tiếng Anh/);
  const edit = await (await handleAdmin(request('sua/1', { cookie }), env, 'sua/1', NOW)).text();
  assert.match(edit, /value="Máy kẹt cập nhật"/);
  assert.match(edit, /<option value="critical" selected>/);
  const bad = await handleAdmin(request('luu', { method: 'POST', cookie, form: { ...fields, id: '1', title_vi: '' } }), env, 'luu', NOW);
  assert.equal(bad.status, 200);
  assert.match(await bad.text(), /Cần tiêu đề tiếng Việt/);
  const updated = await handleAdmin(request('luu', { method: 'POST', cookie, form: { ...fields, id: '1', title_vi: 'Đã sửa' } }), env,
    'luu', NOW);
  assert.equal(updated.status, 303);
  assert.equal((await env.DB.prepare('SELECT title_vi FROM notices WHERE id = 1').first()).title_vi, 'Đã sửa');
  await handleAdmin(request('bat-tat', { method: 'POST', cookie, form: { id: '1' } }), env, 'bat-tat', NOW);
  assert.equal((await env.DB.prepare('SELECT active FROM notices WHERE id = 1').first()).active, 0);
  const missing = await handleAdmin(request('xoa', { method: 'POST', cookie, form: { id: '9' } }), env, 'xoa', NOW);
  assert.equal(missing.status, 404);
  await handleAdmin(request('xoa', { method: 'POST', cookie, form: { id: '1' } }), env, 'xoa', NOW);
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM notices').first()).n, 0);
  const out = await handleAdmin(request('dang-xuat', { method: 'POST', cookie }), env, 'dang-xuat', NOW);
  assert.match(out.headers.get('Set-Cookie'), new RegExp(`^${COOKIE}=; Path=/quan-tri; Max-Age=0`));
});

test('what people typed is shown as text, never as HTML', async () => {
  const env = await environment();
  const cookie = await signIn(env);
  await handleAdmin(request('luu', { method: 'POST', cookie, form: { level: 'info', title_vi: '<script>alert(1)</script>',
    body_vi: '"><img src=x onerror=alert(1)>', active: '1' } }), env, 'luu', NOW);
  const list = await (await handleAdmin(request('', { cookie }), env, '', NOW)).text();
  assert.ok(!list.includes('<script>alert(1)</script>'));
  assert.ok(list.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!list.includes('<img src=x'));
});
