// ISO downloads: the landing page's download buttons go to /tai/<edition> (functions/tai/[edition].js), which writes
// one row here and sends the browser on to the file: Cloudflare R2 by default, SourceForge for the backup link
// (?mirror=sourceforge). A resumed download goes straight to the file, so it is not counted twice. Bots, link
// previews and HEAD requests are sent on without a row. Writing the row never stops the download.
//
// The hidden statistics page (functions/thong-ke/[key].js) reads these rows and the daily active-machine reports.
import { EDITIONS, VERSION, r2Url, sourceforgeUrl } from './release.js';

const SITE_HOSTS = new Set(['caramos.vietnamlinuxfamily.net', 'localhost', '127.0.0.1']);
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|curl|wget|python-requests|httpclient|headless/i;
const PLACEMENT = /^[a-z0-9][a-z0-9-]{0,23}$/;

// "YYYY-MM-DD" in Vietnam time (UTC+7, no daylight saving).
export function vietnamDay(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isBot(userAgent) {
  return !userAgent || BOT.test(userAgent);
}

// The operating system family only.
export function osOf(userAgent = '') {
  const ua = String(userAgent);
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'mac';
  if (/CrOS/i.test(ua)) return 'chromeos';
  if (/Linux|X11/i.test(ua)) return 'linux';
  return 'other';
}

// Where the click came from: ?from=<placement> (the page's own buttons, the README), else an outside site's host
// from the Referer ("facebook.com"), else "direct".
export function sourceOf(url, referer) {
  const from = url.searchParams.get('from');
  if (from && PLACEMENT.test(from)) return from;
  if (referer) {
    try {
      const host = new URL(referer).hostname.toLowerCase().replace(/^(www|m|l|lm|mobile)\./, '');
      if (host && !SITE_HOSTS.has(host)) return host.slice(0, 64);
      if (host) return 'site';
    } catch {
      // a broken Referer counts as direct
    }
  }
  return 'direct';
}

function clip(value, length = 64) {
  return value ? String(value).slice(0, length) : null;
}

// The row to write, or null for a request that is not counted.
export function downloadRow(request, edition, { now = new Date(), cf = request.cf || {} } = {}) {
  if (!EDITIONS.includes(edition) || request.method !== 'GET') return null;
  const userAgent = request.headers.get('User-Agent') || '';
  if (isBot(userAgent)) return null;
  const url = new URL(request.url);
  return {
    at: now.toISOString().slice(0, 19) + 'Z',
    day: vietnamDay(now),
    edition,
    version: VERSION,
    mirror: url.searchParams.get('mirror') === 'sourceforge' ? 'sourceforge' : 'r2',
    country: clip(cf.country, 8),
    region: clip(cf.region),
    city: clip(cf.city),
    source: sourceOf(url, request.headers.get('Referer')),
    os: osOf(userAgent),
  };
}

export function targetOf(edition, mirror) {
  return mirror === 'sourceforge' ? sourceforgeUrl(edition) : r2Url(edition);
}

function redirect(location) {
  return new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } });
}

export async function handleDownload(request, db, edition, options = {}) {
  if (!EDITIONS.includes(edition)) return new Response('Not found', { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const mirror = new URL(request.url).searchParams.get('mirror') === 'sourceforge' ? 'sourceforge' : 'r2';
  const row = downloadRow(request, edition, options);
  if (row && db) {
    try {
      await db.prepare(
        'INSERT INTO downloads (at, day, edition, version, mirror, country, region, city, source, os) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ).bind(row.at, row.day, row.edition, row.version, row.mirror, row.country, row.region, row.city, row.source,
        row.os).run();
    } catch {
      // Counting is a bonus; the download goes on.
    }
  }
  return redirect(targetOf(edition, mirror));
}
