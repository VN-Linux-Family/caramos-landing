import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { MAX_BODY, handleReport, methodNotAllowed, parseReport, utcDay } from './active.js';

const ID = createHash('sha256').update('0123456789abcdef0123456789abcdef:2026-11-25:caramos-active').digest('hex');
const GOOD = { id: ID, version: '1.5.2', edition: 'cinnamon' };

function fakeDb() {
  const rows = new Map();
  return {
    rows,
    prepare(sql) {
      assert.match(sql, /^INSERT OR IGNORE INTO active_machines/);
      return {
        bind(day, id, version, edition) {
          return {
            async run() {
              const key = `${day}|${id}`;
              if (!rows.has(key)) rows.set(key, { day, id, version, edition });
            },
          };
        },
      };
    },
  };
}

function post(body, headers = {}) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('https://caramos.example/api/active', {
    method: 'POST', body: text, headers: { 'Content-Type': 'application/json', ...headers },
  });
}

test('utcDay is the UTC date', () => {
  assert.equal(utcDay(new Date('2026-11-25T23:30:00+07:00')), '2026-11-25');
  assert.equal(utcDay(new Date('2026-11-26T06:59:59+07:00')), '2026-11-25');
  assert.equal(utcDay(new Date('2026-11-26T07:00:00+07:00')), '2026-11-26');
});

test('a well-formed report is accepted as it is', () => {
  assert.deepEqual(parseReport(GOOD), GOOD);
  assert.deepEqual(parseReport({ ...GOOD, edition: 'xfce', version: '1.5.2+test1' }), { ...GOOD, edition: 'xfce', version: '1.5.2+test1' });
  assert.deepEqual(parseReport({ ...GOOD, version: '1.5.1~rc1' }), { ...GOOD, version: '1.5.1~rc1' });
});

test('anything else in a report is refused', () => {
  for (const bad of [
    null, [], 'x', {},
    { ...GOOD, extra: 1 },
    { id: GOOD.id, version: GOOD.version },
    { ...GOOD, id: GOOD.id.toUpperCase() },
    { ...GOOD, id: GOOD.id.slice(1) },
    { ...GOOD, id: 42 },
    { ...GOOD, version: '' },
    { ...GOOD, version: 'abc' },
    { ...GOOD, version: '1.5.2; DROP TABLE' },
    { ...GOOD, version: '1.' + '1'.repeat(40) },
    { ...GOOD, edition: 'kde' },
    { ...GOOD, edition: 'Cinnamon' },
  ]) {
    assert.equal(parseReport(bad), null, JSON.stringify(bad));
  }
});

test('a report is counted once per computer per day', async () => {
  const db = fakeDb();
  const now = new Date('2026-11-25T03:00:00Z');
  assert.equal((await handleReport(post(GOOD), db, now)).status, 204);
  assert.equal((await handleReport(post(GOOD), db, now)).status, 204);
  assert.equal(db.rows.size, 1);
  assert.deepEqual([...db.rows.values()][0], { day: '2026-11-25', ...GOOD });
  const other = createHash('sha256').update('another').digest('hex');
  await handleReport(post({ ...GOOD, id: other, edition: 'xfce' }), db, now);
  assert.equal(db.rows.size, 2);
});

test('the answer says nothing and is never cached', async () => {
  const response = await handleReport(post(GOOD), fakeDb());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(await response.text(), '');
});

test('bad bodies are refused without touching the database', async () => {
  const db = fakeDb();
  assert.equal((await handleReport(post('{not json'), db)).status, 400);
  assert.equal((await handleReport(post({ ...GOOD, edition: 'kde' }), db)).status, 400);
  assert.equal((await handleReport(post('x'.repeat(MAX_BODY + 1)), db)).status, 413);
  assert.equal(db.rows.size, 0);
});

test('without the database binding the API says so', async () => {
  assert.equal((await handleReport(post(GOOD), undefined)).status, 503);
});

test('other methods answer 405', async () => {
  const response = methodNotAllowed();
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
});
