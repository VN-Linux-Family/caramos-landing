import assert from 'node:assert/strict';
import test from 'node:test';
import { afterEarlier, clientOf, downloadRow, firstLook, fromDataCentre, handleDownload, isBot, onR2, osOf, sourceOf,
  vietnamDay } from './downloads.js';
import { VERSION, r2Url, sourceforgeUrl } from './release.js';
import { sqliteD1 } from './sqlite-d1.mjs';

const FIREFOX_LINUX = 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0';
const CHROME_WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36';

// R2 as the download function asks it (HEAD), without the network: the ISO is there, or not (404).
const R2_HAS_IT = async () => ({ status: 200 });
const R2_LACKS_IT = async () => ({ status: 404 });

// The real tables (migrations 0003 and 0005) in an in-memory SQLite database.
function downloadsDb() {
  const db = sqliteD1(['0003_downloads.sql', '0005_download_kinds.sql']);
  db.rows = () => db.sqlite.prepare('SELECT * FROM downloads ORDER BY id').all().map((row) => ({ ...row }));
  return db;
}

function brokenDb() {
  const fail = () => { throw new Error('D1 down'); };
  const statement = { bind: () => statement, first: fail, run: fail, all: fail };
  return { prepare: () => statement };
}

function get(path, { ua = FIREFOX_LINUX, referer, method = 'GET', cf, language = 'vi-VN,vi;q=0.9', ip = '203.0.113.7' } = {}) {
  const headers = { 'User-Agent': ua, 'CF-Connecting-IP': ip };
  if (language) headers['Accept-Language'] = language;
  if (referer) headers.Referer = referer;
  const request = new Request(`https://caramos.vietnamlinuxfamily.net${path}`, { method, headers });
  if (cf) Object.defineProperty(request, 'cf', { value: cf });
  return request;
}

test('the Vietnam date turns at 17:00 UTC', () => {
  assert.equal(vietnamDay(new Date('2026-11-25T16:59:59Z')), '2026-11-25');
  assert.equal(vietnamDay(new Date('2026-11-25T17:00:00Z')), '2026-11-26');
});

test('bots and empty user agents are not counted', () => {
  for (const ua of ['', 'Googlebot/2.1', 'facebookexternalhit/1.1', 'curl/8.5.0', 'Wget/1.21', 'Mozilla/5.0 HeadlessChrome']) {
    assert.equal(isBot(ua), true, ua);
  }
  assert.equal(isBot(FIREFOX_LINUX), false);
});

test('only the operating system family is kept', () => {
  assert.equal(osOf(CHROME_WINDOWS), 'windows');
  assert.equal(osOf(FIREFOX_LINUX), 'linux');
  assert.equal(osOf('Mozilla/5.0 (Linux; Android 14; SM-A546E)'), 'android');
  assert.equal(osOf('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'), 'ios');
  assert.equal(osOf('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)'), 'mac');
  assert.equal(osOf('something else'), 'other');
});

test('where a click came from', () => {
  const url = (q) => new URL(`https://caramos.vietnamlinuxfamily.net/tai/xfce${q}`);
  assert.equal(sourceOf(url('?from=hero'), 'https://www.facebook.com/'), 'hero');
  assert.equal(sourceOf(url('?from=<script>'), undefined), 'direct');
  assert.equal(sourceOf(url(''), 'https://l.facebook.com/l.php?u=x'), 'facebook.com');
  assert.equal(sourceOf(url(''), 'https://github.com/VN-Linux-Family/CaramOS'), 'github.com');
  assert.equal(sourceOf(url(''), 'https://caramos.vietnamlinuxfamily.net/giao-duc/'), 'site');
  assert.equal(sourceOf(url(''), 'not a url'), 'direct');
  assert.equal(sourceOf(url(''), undefined), 'direct');
});

test('a click is counted with its place and sent to R2', async () => {
  const db = downloadsDb();
  const now = new Date('2026-11-25T03:04:05Z');
  const cf = { country: 'VN', region: 'Hanoi', city: 'Hanoi', asn: 45899, asOrganization: 'VNPT Corp' };
  const response = await handleDownload(get('/tai/cinnamon?from=hero', { cf }), db, 'cinnamon', { now, fetch: R2_HAS_IT });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), r2Url('cinnamon'));
  assert.equal(response.headers.get('Location'), `https://download.caramos.vietnamlinuxfamily.net/CaramOS-${VERSION}-cinnamon-amd64.iso`);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const [row] = db.rows();
  assert.match(row.client, /^[0-9a-f]{24}$/);
  assert.deepEqual({ ...row, id: undefined, client: undefined }, {
    id: undefined, at: '2026-11-25T03:04:05Z', day: '2026-11-25', edition: 'cinnamon', version: VERSION, mirror: 'r2',
    country: 'VN', region: 'Hanoi', city: 'Hanoi', source: 'hero', os: 'linux', kind: 'nguoi', reason: null,
    client: undefined, asn: 45899, network: 'VNPT Corp',
  });
});

test('the backup link is counted as SourceForge and sent there', async () => {
  const db = downloadsDb();
  const response = await handleDownload(get('/tai/xfce?mirror=sourceforge&from=editions', { ua: CHROME_WINDOWS }), db, 'xfce',
    { fetch: R2_HAS_IT });
  assert.equal(response.headers.get('Location'), sourceforgeUrl('xfce'));
  const [row] = db.rows();
  assert.equal(row.mirror, 'sourceforge');
  assert.equal(row.source, 'editions');
  assert.equal(row.os, 'windows');
});

test('data centres and scripts without a browser language are kept but not counted as people', async () => {
  assert.equal(fromDataCentre({ asn: 16509, asOrganization: 'AMAZON-02' }), true);
  assert.equal(fromDataCentre({ asn: 396982, asOrganization: 'GOOGLE-CLOUD-PLATFORM' }), true);
  assert.equal(fromDataCentre({ asn: 8075, asOrganization: 'Microsoft Corporation' }), true);
  assert.equal(fromDataCentre({ asn: 63949, asOrganization: 'Akamai Connected Cloud' }), true);
  for (const [asn, name] of [[45899, 'VNPT Corp'], [7552, 'Viettel Group'], [18403, 'FPT Telecom Company'],
    [13335, 'Cloudflare, Inc.'], [36183, 'Akamai Technologies, Inc.']]) {
    assert.equal(fromDataCentre({ asn, asOrganization: name }), false, name);
  }
  assert.deepEqual(firstLook(get('/tai/xfce', { language: '' })), { kind: 'bot', reason: 'khong-ngon-ngu' });
  assert.deepEqual(firstLook(get('/tai/xfce')), { kind: 'nguoi', reason: null });

  const db = downloadsDb();
  await handleDownload(get('/tai/xfce', { cf: { country: 'US', city: 'Ashburn', asn: 14618, asOrganization: 'AMAZON-AES' } }),
    db, 'xfce', { fetch: R2_HAS_IT });
  await handleDownload(get('/tai/xfce', { language: '', ip: '198.51.100.1' }), db, 'xfce', { fetch: R2_HAS_IT });
  assert.deepEqual(db.rows().map((row) => [row.kind, row.reason]), [['bot', 'may-chu'], ['bot', 'khong-ngon-ngu']]);
});

test('a third link within a minute makes all of them a computer, a later click of the same edition a repeat', async () => {
  assert.deepEqual(afterEarlier({ kind: 'nguoi', reason: null }, { otherLinks: 2, sameEdition: 0 }), { kind: 'bot', reason: 'dot-loat' });
  assert.deepEqual(afterEarlier({ kind: 'bot', reason: 'may-chu' }, { otherLinks: 5 }), { kind: 'bot', reason: 'may-chu' });

  const db = downloadsDb();
  const at = (second) => new Date(`2026-11-27T02:59:${String(second).padStart(2, '0')}Z`);
  const click = (path, edition, second, ip) => handleDownload(get(path, { ip }), db, edition, { now: at(second), fetch: R2_HAS_IT });
  await click('/tai/cinnamon?from=hero', 'cinnamon', 19, '192.0.2.9');
  await click('/tai/xfce?from=hero', 'xfce', 19, '192.0.2.9');
  await click('/tai/cinnamon?from=editions&mirror=sourceforge', 'cinnamon', 21, '192.0.2.9');
  await click('/tai/xfce?from=download', 'xfce', 26, '192.0.2.9');
  assert.deepEqual(db.rows().map((row) => row.kind), ['bot', 'bot', 'bot', 'bot']);
  assert.equal(new Set(db.rows().map((row) => row.client)).size, 1);

  // A person pressing the same button three times in five seconds (seen in Đà Lạt on 26/11): one click, two repeats.
  for (const second of [12, 15, 17]) {
    await handleDownload(get('/tai/xfce?from=hero', { ip: '192.0.2.77' }), db, 'xfce', { now: new Date(`2026-11-26T06:28:${second}Z`), fetch: R2_HAS_IT });
  }
  assert.deepEqual(db.rows().slice(4).map((row) => row.kind), ['nguoi', 'lap', 'lap']);
  db.sqlite.exec("DELETE FROM downloads WHERE id > 4");

  // A person: Cinnamon, the same again 40 minutes later (a repeat), then Xfce (counted).
  await handleDownload(get('/tai/cinnamon', { ip: '192.0.2.50' }), db, 'cinnamon', { now: new Date('2026-11-27T03:00:00Z'), fetch: R2_HAS_IT });
  await handleDownload(get('/tai/cinnamon', { ip: '192.0.2.50' }), db, 'cinnamon', { now: new Date('2026-11-27T03:40:00Z'), fetch: R2_HAS_IT });
  await handleDownload(get('/tai/xfce', { ip: '192.0.2.50' }), db, 'xfce', { now: new Date('2026-11-27T03:41:00Z'), fetch: R2_HAS_IT });
  assert.deepEqual(db.rows().slice(4).map((row) => [row.edition, row.kind]), [['cinnamon', 'nguoi'], ['cinnamon', 'lap'], ['xfce', 'nguoi']]);
  // The next Vietnam day (from 17:00 UTC) is a new start.
  await handleDownload(get('/tai/cinnamon', { ip: '192.0.2.50' }), db, 'cinnamon', { now: new Date('2026-11-27T17:00:00Z'), fetch: R2_HAS_IT });
  assert.equal(db.rows().at(-1).kind, 'nguoi');
});

test('the person hash changes with the day and the key, and holds no address', async () => {
  const request = get('/tai/xfce', { ip: '192.0.2.50' });
  const a = await clientOf(request, '2026-11-27', 'k1');
  assert.equal(a, await clientOf(request, '2026-11-27', 'k1'));
  assert.notEqual(a, await clientOf(request, '2026-11-28', 'k1'));
  assert.notEqual(a, await clientOf(request, '2026-11-27', 'k2'));
  assert.doesNotMatch(a, /192|0\.2/);
});

test('HEAD, bots and unknown editions are not counted', async () => {
  const db = downloadsDb();
  assert.equal((await handleDownload(get('/tai/xfce', { method: 'HEAD' }), db, 'xfce', { fetch: R2_HAS_IT })).status, 302);
  assert.equal((await handleDownload(get('/tai/xfce', { ua: 'Googlebot/2.1' }), db, 'xfce', { fetch: R2_HAS_IT })).status, 302);
  assert.equal((await handleDownload(get('/tai/kde'), db, 'kde')).status, 404);
  assert.equal((await handleDownload(get('/tai/xfce', { method: 'POST' }), db, 'xfce')).status, 405);
  assert.equal(db.rows().length, 0);
});

test('a broken database never stops the download', async () => {
  const response = await handleDownload(get('/tai/cinnamon'), brokenDb(), 'cinnamon', { fetch: R2_HAS_IT });
  assert.equal(response.status, 302);
  assert.equal((await handleDownload(get('/tai/cinnamon'), undefined, 'cinnamon', { fetch: R2_HAS_IT })).status, 302);
});

test('an ISO that R2 no longer (or not yet) has is fetched from SourceForge, and counted so', async () => {
  // A release's CI deletes an edition's older ISO from R2 as soon as it uploads the new one, before the site names it.
  const db = downloadsDb();
  const response = await handleDownload(get('/tai/cinnamon?from=hero'), db, 'cinnamon', { fetch: R2_LACKS_IT });
  assert.equal(response.headers.get('Location'), sourceforgeUrl('cinnamon'));
  assert.equal(db.rows()[0].mirror, 'sourceforge');
});

test('R2 is asked with HEAD, and taken as there when it does not answer', async () => {
  const asked = [];
  assert.equal(await onR2('xfce', async (url, init) => { asked.push([url, init.method]); return { status: 200 }; }), true);
  assert.deepEqual(asked, [[r2Url('xfce'), 'HEAD']]);
  assert.equal(await onR2('xfce', R2_LACKS_IT), false);
  assert.equal(await onR2('xfce', async () => { throw new Error('timeout'); }), true);
});

test('long or missing location fields are kept short or empty', () => {
  const row = downloadRow(get('/tai/xfce', { cf: { country: 'VN', city: 'x'.repeat(300) } }), 'xfce');
  assert.equal(row.city.length, 64);
  assert.equal(row.region, null);
});
