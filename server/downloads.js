// ISO downloads: the landing page's download buttons go to /tai/<edition> (functions/tai/[edition].js), which writes
// one row here and sends the browser on to the file: Cloudflare R2 by default, SourceForge for the backup link
// (?mirror=sourceforge). A resumed download goes straight to the file, so it is not counted twice. Self-declared
// bots, link previews and HEAD requests are sent on without a row. Writing the row never stops the download.
//
// Not every other row is a person (migrations/0005_download_kinds.sql). Of the first 156 rows (25-27/11/2026), about
// 60 came from data centres in the US (Amazon, Google, Microsoft), some clicking all ten buttons within ten seconds
// with ordinary browser names. Such rows, and the same person clicking the same edition again, are kept but marked,
// and the statistics page counts people only.
//
// The hidden statistics page (functions/thong-ke/[key].js) reads these rows and the daily active-machine reports.
import { EDITIONS, VERSION, r2Url, sourceforgeUrl } from './release.js';

const SITE_HOSTS = new Set(['caramos.vietnamlinuxfamily.net', 'localhost', '127.0.0.1']);
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|curl|wget|python-requests|httpclient|headless/i;
const PLACEMENT = /^[a-z0-9][a-z0-9-]{0,23}$/;
// Networks of data centres rather than of homes and offices: the big clouds and hosting companies, by the network
// name Cloudflare gives, plus a few whose name says nothing (Linode, Vultr, Scaleway, SoftLayer). Cloudflare, Akamai
// and Fastly are left out on purpose: people using WARP or iCloud Private Relay come through them.
const DATA_CENTRE = /amazon|google|microsoft|azure|digitalocean|hetzner|\bovh|linode|vultr|choopa|oracle|alibaba|tencent|contabo|scaleway|leaseweb|m247|datacamp|ionos|upcloud|kamatera|psychz|quadranet|colocrossing|g-?core|zenlayer|hostinger|hivelocity|servers\.com|equinix|softlayer|\bibm\b|huawei|yandex|baidu|bytedance|facebook|meta platforms/i;
const DATA_CENTRE_ASNS = new Set([63949, 20473, 12876, 36351]);
// Three different links within this many seconds from one person: a computer following every button on the page.
// (A person pressing the same button three times is a repeat, not a computer.)
const BURST_SECONDS = 60;

// "YYYY-MM-DD" in Vietnam time (UTC+7, no daylight saving).
export function vietnamDay(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isBot(userAgent) {
  return !userAgent || BOT.test(userAgent);
}

export function fromDataCentre(cf = {}) {
  return DATA_CENTRE_ASNS.has(Number(cf.asn)) || DATA_CENTRE.test(String(cf.asOrganization || ''));
}

// What the request alone says: a person, or a computer. Every browser sends the languages its user reads.
export function firstLook(request, cf = {}) {
  if (fromDataCentre(cf)) return { kind: 'bot', reason: 'may-chu' };
  if (!request.headers.get('Accept-Language')) return { kind: 'bot', reason: 'khong-ngon-ngu' };
  return { kind: 'nguoi', reason: null };
}

// What the same person's earlier rows today add: a third different link (edition, mirror and button) within a minute
// makes them all a computer's, and the same edition again is a repeat. A row already known to be a computer's keeps
// its reason.
export function afterEarlier(look, { otherLinks = 0, sameEdition = 0 } = {}) {
  if (look.kind === 'bot') return look;
  if (otherLinks >= 2) return { kind: 'bot', reason: 'dot-loat' };
  if (sameEdition > 0) return { kind: 'lap', reason: 'bam-lai' };
  return look;
}

// A keyed hash of the address and the browser, salted with the Vietnam day.
export async function clientOf(request, day, secret) {
  const encoder = new TextEncoder();
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret || 'caramos-downloads'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${day}|${ip}|${request.headers.get('User-Agent') || ''}`));
  return Array.from(new Uint8Array(mac).slice(0, 12), (byte) => byte.toString(16).padStart(2, '0')).join('');
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
    at: utcSecond(now),
    day: vietnamDay(now),
    edition,
    version: VERSION,
    mirror: url.searchParams.get('mirror') === 'sourceforge' ? 'sourceforge' : 'r2',
    country: clip(cf.country, 8),
    region: clip(cf.region),
    city: clip(cf.city),
    source: sourceOf(url, request.headers.get('Referer')),
    os: osOf(userAgent),
    asn: Number.isInteger(cf.asn) ? cf.asn : null,
    network: clip(cf.asOrganization),
    ...firstLook(request, cf),
  };
}

function utcSecond(date) {
  return date.toISOString().slice(0, 19) + 'Z';
}

// Writes the row, after looking at the same person's earlier rows today.
export async function countRow(db, request, row, { now = new Date(), secret } = {}) {
  row.client = await clientOf(request, row.day, secret);
  const since = utcSecond(new Date(now.getTime() - BURST_SECONDS * 1000));
  const link = "edition || '/' || mirror || '/' || source";
  const earlier = await db.prepare(
    `SELECT COUNT(DISTINCT CASE WHEN at >= ?1 AND ${link} <> ?2 THEN ${link} END) AS otherLinks, `
    + "COALESCE(SUM(edition = ?3 AND kind = 'nguoi'), 0) AS sameEdition FROM downloads WHERE client = ?4",
  ).bind(since, `${row.edition}/${row.mirror}/${row.source}`, row.edition, row.client).first();
  Object.assign(row, afterEarlier(row, earlier || {}));
  await db.prepare(
    'INSERT INTO downloads (at, day, edition, version, mirror, country, region, city, source, os, kind, reason, client, '
    + 'asn, network) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(row.at, row.day, row.edition, row.version, row.mirror, row.country, row.region, row.city, row.source, row.os,
    row.kind, row.reason, row.client, row.asn, row.network).run();
  if (row.reason === 'dot-loat') {
    await db.prepare("UPDATE downloads SET kind = 'bot', reason = 'dot-loat' WHERE client = ?1 AND at >= ?2 AND kind <> 'bot'")
      .bind(row.client, since).run();
  }
}

export function targetOf(edition, mirror) {
  return mirror === 'sourceforge' ? sourceforgeUrl(edition) : r2Url(edition);
}

function redirect(location) {
  return new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } });
}

// Whether R2 has this edition's ISO. Only the newest release is kept there: when a release's CI uploads one edition,
// it deletes that edition's older ISO, before this site names the new version (and the editions are built one after
// the other). Asked at most once a minute per data centre (cacheTtl), and taken as there when R2 does not answer.
export async function onR2(edition, fetchImpl = fetch) {
  try {
    const response = await fetchImpl(r2Url(edition), {
      method: 'HEAD',
      cf: { cacheTtl: 60, cacheEverything: true },
      signal: AbortSignal.timeout(3000),
    });
    return response.status !== 404;
  } catch {
    return true;
  }
}

export async function handleDownload(request, db, edition, options = {}) {
  if (!EDITIONS.includes(edition)) return new Response('Not found', { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  let mirror = new URL(request.url).searchParams.get('mirror') === 'sourceforge' ? 'sourceforge' : 'r2';
  // Not on R2 (yet, or any more): SourceForge keeps every release.
  if (mirror === 'r2' && !(await onR2(edition, options.fetch))) mirror = 'sourceforge';
  const row = downloadRow(request, edition, options);
  if (row) row.mirror = mirror;
  if (row && db) {
    try {
      await countRow(db, request, row, options);
    } catch {
      // Counting is a bonus; the download goes on.
    }
  }
  return redirect(targetOf(edition, mirror));
}
