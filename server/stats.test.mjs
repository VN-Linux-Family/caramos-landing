import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml, handleStats, readStats, renderStats, sameKey } from './stats.js';
import { sqliteD1 } from './sqlite-d1.mjs';

const KEY = 'k'.repeat(32);

function stats(overrides = {}) {
  return {
    today: '2026-11-25',
    from30: '2026-10-27',
    totals: { total: 12, today: 3, week: 9, month: 12 },
    editions: [{ edition: 'cinnamon', mirror: 'r2', n: 8 }, { edition: 'xfce', mirror: 'sourceforge', n: 4 }],
    versions: [{ version: '1.5.1', n: 12 }],
    daily: [{ day: '2026-11-25', edition: 'cinnamon', n: 2 }, { day: '2026-11-25', edition: 'xfce', n: 1 }],
    places: [{ country: 'VN', region: 'Hanoi', city: 'Hanoi', n: 7 }, { country: 'US', region: null, city: null, n: 1 }],
    sources: [{ source: 'hero', n: 6 }, { source: 'facebook.com', n: 3 }],
    systems: [{ os: 'windows', n: 9 }, { os: 'linux', n: 3 }],
    filtered: [{ reason: 'may-chu', n: 5, month: 5 }, { reason: 'bam-lai', n: 2, month: 1 }],
    recent: [{ at: '2026-11-25T03:04:05Z', edition: 'xfce', version: '1.5.1', mirror: 'r2', country: 'VN', region: 'Hanoi', city: 'Hanoi', source: 'edu', os: 'windows', kind: 'nguoi', reason: null },
      { at: '2026-11-25T03:00:00Z', edition: 'cinnamon', version: '1.5.1', mirror: 'r2', country: 'US', region: 'Virginia', city: 'Ashburn', source: 'hero', os: 'mac', kind: 'bot', reason: 'may-chu' }],
    active: [{ day: '2026-11-25', total: 40, cinnamon: 30, xfce: 10 }],
    activeVersions: [{ version: '1.5.1', n: 35 }, { version: '1.5.0', n: 5 }],
    ...overrides,
  };
}

function fakeDb(data) {
  const order = ['totals', 'editions', 'versions', 'daily', 'places', 'sources', 'systems', 'filtered', 'recent', 'active', 'activeVersions'];
  const statement = { bind: () => statement };
  return {
    prepare: () => statement,
    batch: async (statements) => {
      assert.equal(statements.length, order.length);
      return order.map((name) => ({ results: name === 'totals' ? [data.totals] : data[name] }));
    },
  };
}

test('keys are compared whole, and short keys never open the page', () => {
  assert.equal(sameKey(KEY, KEY), true);
  assert.equal(sameKey(KEY.slice(1), KEY), false);
  assert.equal(sameKey(`${KEY}x`, KEY), false);
  assert.equal(sameKey('short', 'short'), false);
  assert.equal(sameKey(KEY, undefined), false);
});

test('a wrong key answers 404 and is never indexed', async () => {
  const response = await handleStats('nope', { STATS_KEY: KEY, DB: fakeDb(stats()) });
  assert.equal(response.status, 404);
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.equal((await handleStats(KEY, { DB: fakeDb(stats()) })).status, 404);
});

test('the right key shows the page, private and without scripts', async () => {
  const response = await handleStats(KEY, { STATS_KEY: KEY, DB: fakeDb(stats()) }, new Date('2026-11-25T05:00:00Z'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(response.headers.get('Content-Security-Policy'), /default-src 'none'/);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/);
  assert.doesNotMatch(html, /<script/i);
  for (const text of ['Thống kê CaramOS', 'Hanoi (Việt Nam)', 'SourceForge (dự phòng)', 'facebook.com', 'Windows', '40 máy', '12:00 25/11',
    'Máy chủ trong trung tâm dữ liệu', 'Không: máy']) {
    assert.ok(html.includes(text), text);
  }
});

test('what visitors send is escaped', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>&"\''), '&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;');
  const html = renderStats(stats({ sources: [{ source: '<script>alert(1)</script>', n: 1 }],
    places: [{ country: 'VN', region: '"><b>', city: '<i>', n: 1 }] }));
  assert.doesNotMatch(html, /<script>alert/);
  assert.doesNotMatch(html, /<i>|"><b>/);
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

test('an empty database still renders', () => {
  const html = renderStats(stats({ totals: { total: 0, today: 0, week: 0, month: 0 }, editions: [], versions: [], daily: [],
    places: [], sources: [], systems: [], recent: [], active: [], activeVersions: [] }));
  assert.ok(html.includes('Chưa có số liệu.'));
});

test('only people are counted; the rest is listed by reason (real SQL)', async () => {
  const db = sqliteD1(['0002_active_machines.sql', '0003_downloads.sql', '0005_download_kinds.sql']);
  const insert = db.sqlite.prepare('INSERT INTO downloads (at, day, edition, version, mirror, country, region, city, source, os, kind, reason) '
    + "VALUES (?, ?, ?, '1.5.2', 'r2', ?, NULL, NULL, 'hero', 'windows', ?, ?)");
  insert.run('2026-11-27T03:00:00Z', '2026-11-27', 'cinnamon', 'VN', 'nguoi', null);
  insert.run('2026-11-27T03:01:00Z', '2026-11-27', 'cinnamon', 'VN', 'lap', 'bam-lai');
  insert.run('2026-11-27T03:02:00Z', '2026-11-27', 'xfce', 'US', 'bot', 'may-chu');
  insert.run('2026-11-27T03:02:01Z', '2026-11-27', 'xfce', 'US', 'bot', 'may-chu');
  const result = await readStats(db, new Date('2026-11-27T05:00:00Z'));
  assert.deepEqual(result.totals, { total: 1, today: 1, week: 1, month: 1 });
  assert.deepEqual(result.editions, [{ edition: 'cinnamon', mirror: 'r2', n: 1 }]);
  assert.deepEqual(result.places, [{ country: 'VN', region: null, city: null, n: 1 }]);
  assert.deepEqual(result.filtered, [{ reason: 'may-chu', n: 2, month: 2 }, { reason: 'bam-lai', n: 1, month: 1 }]);
  assert.deepEqual(result.recent.map((row) => row.kind), ['bot', 'bot', 'lap', 'nguoi']);
});
