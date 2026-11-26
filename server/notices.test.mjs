import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeNotices, compareVersions, handlePublic, linkAllowed, parseForm, publicNotice, saveNotice, utcFromVietnam,
  vietnamFromUtc,
} from './notices.js';
import { sqliteD1 } from './sqlite-d1.mjs';

const NOW = new Date('2026-11-27T02:00:00Z');

function form(fields) {
  const data = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const MINIMAL = { level: 'warning', title_vi: 'Máy chưa cập nhật', body_vi: 'Mở Trung tâm cập nhật\nrồi bấm Cập nhật.', active: '1' };

test('links go to vietnamlinuxfamily.net over https only', () => {
  assert.equal(linkAllowed('https://vietnamlinuxfamily.net/caramos/H-1'), true);
  assert.equal(linkAllowed('https://caramos.vietnamlinuxfamily.net/'), true);
  assert.equal(linkAllowed('http://caramos.vietnamlinuxfamily.net/'), false);
  assert.equal(linkAllowed('https://evilvietnamlinuxfamily.net/'), false);
  assert.equal(linkAllowed('https://vietnamlinuxfamily.net.evil.com/'), false);
  assert.equal(linkAllowed('https://user:pw@vietnamlinuxfamily.net/'), false);
  assert.equal(linkAllowed('javascript:alert(1)'), false);
  assert.equal(linkAllowed('not a url'), false);
});

test('the form speaks Vietnam time, the table UTC', () => {
  assert.equal(utcFromVietnam('2026-11-27T09:30'), '2026-11-27T02:30:00Z');
  assert.equal(utcFromVietnam('2026-11-27T03:00'), '2026-11-26T20:00:00Z');
  assert.equal(vietnamFromUtc('2026-11-26T20:00:00Z'), '2026-11-27T03:00');
  assert.equal(utcFromVietnam('27/11/2026 09:30'), null);
  assert.equal(utcFromVietnam(''), null);
  assert.equal(vietnamFromUtc(''), '');
});

test('versions compare by number', () => {
  assert.equal(compareVersions('1.0.16.1', '1.0.16'), 1);
  assert.equal(compareVersions('1.3.11', '1.3.9'), 1);
  assert.equal(compareVersions('1.5.2', '1.5.2'), 0);
  assert.equal(compareVersions('1.0.20', '1.5.0'), -1);
});

test('a minimal notice: Vietnamese only, every computer, from now on', () => {
  const { notice, errors } = parseForm(form(MINIMAL), NOW);
  assert.deepEqual(errors, []);
  assert.equal(notice.level, 'warning');
  assert.equal(notice.body_vi, 'Mở Trung tâm cập nhật\nrồi bấm Cập nhật.');
  assert.equal(notice.editions, 'all');
  assert.equal(notice.condition, 'all');
  assert.equal(notice.starts_at, '2026-11-27T02:00:00Z');
  assert.equal(notice.ends_at, '');
  assert.equal(notice.active, 1);
});

test('the form says what is wrong', () => {
  const cases = [
    [{ ...MINIMAL, title_vi: '' }, 'Cần tiêu đề tiếng Việt.'],
    [{ ...MINIMAL, body_vi: '' }, 'Cần nội dung tiếng Việt.'],
    [{ ...MINIMAL, level: 'urgent' }, 'Chọn mức độ.'],
    [{ ...MINIMAL, title_en: 'Update' }, 'Tiếng Anh cần cả tiêu đề lẫn nội dung, hoặc để trống cả hai.'],
    [{ ...MINIMAL, min_version: '1.5' }, null],
    [{ ...MINIMAL, min_version: '1.5.x' }, 'Phiên bản "1.5.x" không đúng dạng 1.5.2.'],
    [{ ...MINIMAL, min_version: '1.5.2', max_version: '1.0.20' }, 'Phiên bản "từ" lớn hơn phiên bản "đến".'],
    [{ ...MINIMAL, link_url: 'https://example.com', link_label_vi: 'Xem' }, 'Liên kết phải là https trên vietnamlinuxfamily.net.'],
    [{ ...MINIMAL, link_url: 'https://caramos.vietnamlinuxfamily.net/' }, 'Liên kết cần nhãn tiếng Việt.'],
    [{ ...MINIMAL, link_label_vi: 'Xem' }, 'Có nhãn liên kết mà chưa có liên kết.'],
    [{ ...MINIMAL, starts_at: '2026-11-28T09:00', ends_at: '2026-11-27T09:00' }, 'Kết thúc phải sau bắt đầu.'],
    [{ ...MINIMAL, editions: 'kde' }, 'Bản không hợp lệ.'],
    [{ ...MINIMAL, condition: 'always' }, 'Điều kiện không hợp lệ.'],
    [{ ...MINIMAL, title_vi: 'x'.repeat(121) }, 'Tiêu đề dài quá 120 ký tự.'],
  ];
  for (const [fields, message] of cases) {
    const { errors } = parseForm(form(fields), NOW);
    if (message === null) assert.deepEqual(errors, [], JSON.stringify(fields));
    else assert.ok(errors.includes(message), `${JSON.stringify(fields)} → ${errors}`);
  }
});

test('the computers get the notices that are on, started and not ended', async () => {
  const db = sqliteD1(['0004_notices.sql']);
  const base = parseForm(form(MINIMAL), NOW).notice;
  const now = await saveNotice(db, base, null, NOW);
  await saveNotice(db, { ...base, title_vi: 'Đã tắt', active: 0 }, null, NOW);
  await saveNotice(db, { ...base, title_vi: 'Chưa tới', starts_at: '2026-11-28T00:00:00Z' }, null, NOW);
  await saveNotice(db, { ...base, title_vi: 'Đã hết', ends_at: '2026-11-27T01:00:00Z', starts_at: '2026-11-26T00:00:00Z' }, null, NOW);
  const later = await saveNotice(db, { ...base, title_vi: 'Có hạn', ends_at: '2026-12-01T00:00:00Z',
    title_en: 'Update', body_en: 'Open the Update Center.', editions: 'xfce', min_version: '1.0.1', max_version: '1.5.1',
    condition: 'update-waiting', link_url: 'https://caramos.vietnamlinuxfamily.net/', link_label_vi: 'Xem', link_label_en: 'See' },
  null, NOW);
  const notices = await activeNotices(db, NOW);
  assert.deepEqual(notices.map((n) => n.id), [now, later]);
  assert.deepEqual(notices[1], {
    id: later, level: 'warning', title: { vi: 'Có hạn', en: 'Update' },
    body: { vi: 'Mở Trung tâm cập nhật\nrồi bấm Cập nhật.', en: 'Open the Update Center.' }, editions: 'xfce',
    min_version: '1.0.1', max_version: '1.5.1', condition: 'update-waiting',
    link: { url: 'https://caramos.vietnamlinuxfamily.net/', label: { vi: 'Xem', en: 'See' } },
    starts_at: '2026-11-27T02:00:00Z', ends_at: '2026-12-01T00:00:00Z',
  });
  assert.equal(publicNotice({ ...notices[0], link_url: '' }).link, null);
});

test('GET /api/thong-bao: a short cache, nothing about the asker', async () => {
  const db = sqliteD1(['0004_notices.sql']);
  await saveNotice(db, parseForm(form(MINIMAL), NOW).notice, null, NOW);
  const response = await handlePublic(db, NOW);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=300');
  const body = await response.json();
  assert.equal(body.schema, 1);
  assert.equal(body.notices.length, 1);
  assert.equal(body.notices[0].title.vi, 'Máy chưa cập nhật');
  const empty = await (await handlePublic(undefined, NOW)).json();
  assert.deepEqual(empty, { schema: 1, notices: [] });
});
