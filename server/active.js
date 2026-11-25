// How many CaramOS computers are switched on each day.
//
// Once a day, the daily update check of each computer (caramos-ota) posts to /api/active:
//   {"id": "<64 hex>", "version": "1.5.2", "edition": "cinnamon" | "xfce"}
// id is the SHA-256 of the computer's /etc/machine-id, the UTC day and a fixed word, made on the computer. It changes
// every day, so the days of one computer cannot be linked and no computer can be identified; counting the distinct ids
// of a day gives the number of computers switched on that day. Users can turn the report off on their computer
// (`sudo caramos-ota --stats off`). Nothing else is kept: no IP address, no time of day, no other field.
//
// The numbers are read with wrangler (package.json "stats:active"); there is no public read endpoint.

export const MAX_BODY = 1024;
const ID = /^[0-9a-f]{64}$/;
const VERSION = /^[0-9]{1,3}(\.[0-9]{1,3}){1,3}([~+-][0-9A-Za-z.~+-]{1,24})?$/;
export const EDITIONS = new Set(['cinnamon', 'xfce']);

// "YYYY-MM-DD" of a moment in UTC, the day the computer's id is made for.
export function utcDay(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

// The report, checked: {id, version, edition}, or null when anything is missing, extra or malformed.
export function parseReport(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const keys = Object.keys(value).sort().join(',');
  if (keys !== 'edition,id,version') return null;
  const { id, version, edition } = value;
  if (typeof id !== 'string' || !ID.test(id)) return null;
  if (typeof version !== 'string' || version.length > 32 || !VERSION.test(version)) return null;
  if (typeof edition !== 'string' || !EDITIONS.has(edition)) return null;
  return { id, version, edition };
}

function reply(status, body) {
  const headers = { 'Cache-Control': 'no-store' };
  if (body === undefined) return new Response(null, { status, headers });
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

// The POST handler, apart from Pages so that tests can give it a request and a fake D1.
export async function handleReport(request, db, now = new Date()) {
  if (!db) return reply(503, { error: 'not configured' });
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_BODY) return reply(413, { error: 'too large' });
  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply(413, { error: 'too large' });
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'bad json' });
  }
  const report = parseReport(value);
  if (!report) return reply(400, { error: 'bad report' });
  await db.prepare('INSERT OR IGNORE INTO active_machines (day, id, version, edition) VALUES (?, ?, ?, ?)')
    .bind(utcDay(now), report.id, report.version, report.edition).run();
  return reply(204);
}

export function methodNotAllowed() {
  return new Response(JSON.stringify({ error: 'method not allowed' }), {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });
}
