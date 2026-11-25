import assert from 'node:assert/strict';
import test from 'node:test';
import { downloadRow, handleDownload, isBot, osOf, sourceOf, vietnamDay } from './downloads.js';
import { VERSION, r2Url, sourceforgeUrl } from './release.js';

const FIREFOX_LINUX = 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0';
const CHROME_WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36';

function fakeDb({ fail = false } = {}) {
  const rows = [];
  return {
    rows,
    prepare(sql) {
      assert.match(sql, /^INSERT INTO downloads/);
      return { bind: (...values) => ({ run: async () => { if (fail) throw new Error('D1 down'); rows.push(values); } }) };
    },
  };
}

function get(path, { ua = FIREFOX_LINUX, referer, method = 'GET', cf } = {}) {
  const headers = { 'User-Agent': ua };
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
  const db = fakeDb();
  const now = new Date('2026-11-25T03:04:05Z');
  const response = await handleDownload(get('/tai/cinnamon?from=hero', { cf: { country: 'VN', region: 'Hanoi', city: 'Hanoi' } }),
    db, 'cinnamon', { now });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), r2Url('cinnamon'));
  assert.equal(response.headers.get('Location'), `https://download.caramos.vietnamlinuxfamily.net/CaramOS-${VERSION}-cinnamon-amd64.iso`);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(db.rows, [['2026-11-25T03:04:05Z', '2026-11-25', 'cinnamon', VERSION, 'r2', 'VN', 'Hanoi', 'Hanoi', 'hero', 'linux']]);
});

test('the backup link is counted as SourceForge and sent there', async () => {
  const db = fakeDb();
  const response = await handleDownload(get('/tai/xfce?mirror=sourceforge&from=editions', { ua: CHROME_WINDOWS }), db, 'xfce');
  assert.equal(response.headers.get('Location'), sourceforgeUrl('xfce'));
  assert.equal(db.rows[0][4], 'sourceforge');
  assert.equal(db.rows[0][8], 'editions');
  assert.equal(db.rows[0][9], 'windows');
});

test('HEAD, bots and unknown editions are not counted', async () => {
  const db = fakeDb();
  assert.equal((await handleDownload(get('/tai/xfce', { method: 'HEAD' }), db, 'xfce')).status, 302);
  assert.equal((await handleDownload(get('/tai/xfce', { ua: 'Googlebot/2.1' }), db, 'xfce')).status, 302);
  assert.equal((await handleDownload(get('/tai/kde'), db, 'kde')).status, 404);
  assert.equal((await handleDownload(get('/tai/xfce', { method: 'POST' }), db, 'xfce')).status, 405);
  assert.equal(db.rows.length, 0);
});

test('a broken database never stops the download', async () => {
  const response = await handleDownload(get('/tai/cinnamon'), fakeDb({ fail: true }), 'cinnamon');
  assert.equal(response.status, 302);
  assert.equal((await handleDownload(get('/tai/cinnamon'), undefined, 'cinnamon')).status, 302);
});

test('long or missing location fields are kept short or empty', () => {
  const row = downloadRow(get('/tai/xfce', { cf: { country: 'VN', city: 'x'.repeat(300) } }), 'xfce');
  assert.equal(row.city.length, 64);
  assert.equal(row.region, null);
});
