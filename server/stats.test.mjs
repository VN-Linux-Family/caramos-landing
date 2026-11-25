import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml, handleStats, renderStats, sameKey } from './stats.js';

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
    recent: [{ at: '2026-11-25T03:04:05Z', edition: 'xfce', version: '1.5.1', mirror: 'r2', country: 'VN', region: 'Hanoi', city: 'Hanoi', source: 'edu', os: 'windows' }],
    active: [{ day: '2026-11-25', total: 40, cinnamon: 30, xfce: 10 }],
    activeVersions: [{ version: '1.5.1', n: 35 }, { version: '1.5.0', n: 5 }],
    ...overrides,
  };
}

function fakeDb(data) {
  const order = ['totals', 'editions', 'versions', 'daily', 'places', 'sources', 'systems', 'recent', 'active', 'activeVersions'];
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
  for (const text of ['Thống kê CaramOS', 'Hanoi (Việt Nam)', 'SourceForge (dự phòng)', 'facebook.com', 'Windows', '40 máy', '12:00 25/11']) {
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
