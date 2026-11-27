// The hidden statistics page, /thong-ke/<STATS_KEY> (functions/thong-ke/[key].js): ISO downloads (server/downloads.js)
// and the computers switched on each day (server/active.js). The key is a Pages secret, so the address is in no file
// of this public repository; a wrong key answers 404. The page is rendered here, has no script, tells search engines
// not to index it, and sends no Referer, so its address does not leak through its links.
import { vietnamDay } from './downloads.js';
import { utcDay } from './active.js';

const DAYS = 30;
// Rows that are not a person's click (server/downloads.js, migrations/0005_download_kinds.sql), in words.
const REASON = {
  'may-chu': 'Máy chủ trong trung tâm dữ liệu (Amazon, Google, Microsoft…)',
  'khong-ngon-ngu': 'Chương trình tự động: không gửi ngôn ngữ như trình duyệt',
  'dot-loat': 'Bấm từ ba nút trở lên trong một phút',
  'bam-lai': 'Cùng người bấm lại cùng bản trong ngày',
  'cu-may-chu': 'Trước khi có bộ lọc: máy chủ ở Mỹ và các đợt bấm hàng loạt',
  'cu-bam-lai': 'Trước khi có bộ lọc: cùng nơi, cùng loại máy bấm lại cùng bản trong nửa giờ',
};
const KIND = { nguoi: 'Có', bot: 'Không: máy', lap: 'Không: bấm lại' };
const COUNTRY = { VN: 'Việt Nam', US: 'Mỹ', JP: 'Nhật Bản', KR: 'Hàn Quốc', SG: 'Singapore', DE: 'Đức', FR: 'Pháp',
  AU: 'Úc', CA: 'Canada', GB: 'Anh', TW: 'Đài Loan', CN: 'Trung Quốc', TH: 'Thái Lan', KH: 'Campuchia', LA: 'Lào' };
const OS = { windows: 'Windows', linux: 'Linux', mac: 'macOS', android: 'Android', ios: 'iPhone, iPad',
  chromeos: 'ChromeOS', other: 'Khác' };
const MIRROR = { r2: 'Cloudflare R2', sourceforge: 'SourceForge (dự phòng)' };
const EDITION = { cinnamon: 'Cinnamon', xfce: 'Xfce' };
// The page's own placements (?from= on the buttons) and the other kinds of source, in words.
const SOURCE = { hero: 'Trang chủ: đầu trang', editions: 'Trang chủ: bảng chọn bản', download: 'Trang chủ: mục Tải',
  edu: 'Trang Giáo dục', 'edu-steps': 'Trang Giáo dục: các bước', github: 'GitHub (README)', site: 'Trang chủ: chỗ khác',
  direct: 'Gõ thẳng hoặc không rõ' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Equal keys, compared in constant time.
export function sameKey(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string' || expected.length < 24) return false;
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i += 1) diff |= (given.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
  return diff === 0;
}

function dayBefore(day, count) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - count);
  return date.toISOString().slice(0, 10);
}

// Everything the page shows, read in one batch.
export async function readStats(db, now = new Date()) {
  const today = vietnamDay(now);
  const from7 = dayBefore(today, 6);
  const from30 = dayBefore(today, DAYS - 1);
  const activeFrom = dayBefore(utcDay(now), DAYS - 1);
  const people = "kind = 'nguoi'";
  const queries = {
    totals: db.prepare('SELECT COUNT(*) AS total, COALESCE(SUM(day = ?1), 0) AS today, COALESCE(SUM(day >= ?2), 0) AS week, '
      + `COALESCE(SUM(day >= ?3), 0) AS month FROM downloads WHERE ${people}`).bind(today, from7, from30),
    editions: db.prepare(`SELECT edition, mirror, COUNT(*) AS n FROM downloads WHERE ${people} GROUP BY edition, mirror ORDER BY n DESC`),
    versions: db.prepare(`SELECT version, COUNT(*) AS n FROM downloads WHERE ${people} GROUP BY version ORDER BY n DESC LIMIT 10`),
    daily: db.prepare(`SELECT day, edition, COUNT(*) AS n FROM downloads WHERE ${people} AND day >= ?1 GROUP BY day, edition`).bind(from30),
    places: db.prepare(`SELECT country, region, city, COUNT(*) AS n FROM downloads WHERE ${people} GROUP BY country, region, city `
      + 'ORDER BY n DESC LIMIT 20'),
    sources: db.prepare(`SELECT source, COUNT(*) AS n FROM downloads WHERE ${people} GROUP BY source ORDER BY n DESC LIMIT 15`),
    systems: db.prepare(`SELECT os, COUNT(*) AS n FROM downloads WHERE ${people} GROUP BY os ORDER BY n DESC`),
    filtered: db.prepare(`SELECT reason, COUNT(*) AS n, COALESCE(SUM(day >= ?1), 0) AS month FROM downloads WHERE NOT (${people}) `
      + 'GROUP BY reason ORDER BY n DESC').bind(from30),
    recent: db.prepare('SELECT at, edition, version, mirror, country, region, city, source, os, kind, reason FROM downloads '
      + 'ORDER BY id DESC LIMIT 50'),
    active: db.prepare('SELECT day, COUNT(*) AS total, SUM(edition = \'cinnamon\') AS cinnamon, SUM(edition = \'xfce\') AS xfce '
      + 'FROM active_machines WHERE day >= ?1 GROUP BY day ORDER BY day DESC').bind(activeFrom),
    activeVersions: db.prepare('SELECT version, COUNT(*) AS n FROM active_machines '
      + 'WHERE day = (SELECT MAX(day) FROM active_machines) GROUP BY version ORDER BY n DESC'),
  };
  const names = Object.keys(queries);
  const results = await db.batch(names.map((name) => queries[name]));
  const data = Object.fromEntries(names.map((name, index) => [name, results[index].results || []]));
  return { today, from30, ...data, totals: data.totals[0] || { total: 0, today: 0, week: 0, month: 0 } };
}

function place(row) {
  const country = COUNTRY[row.country] || row.country || 'Không rõ';
  const parts = [row.city, row.region && row.region !== row.city ? row.region : null].filter(Boolean);
  return parts.length ? `${parts.join(', ')} (${country})` : country;
}

function vietnamTime(at) {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return at;
  const local = new Date(date.getTime() + 7 * 3600 * 1000).toISOString();
  return `${local.slice(11, 16)} ${local.slice(8, 10)}/${local.slice(5, 7)}`;
}

function table(head, rows) {
  if (!rows.length) return '<p class="empty">Chưa có số liệu.</p>';
  // A column of numbers is right-aligned, its heading too.
  const numeric = head.map((_, i) => rows.every((cells) => typeof cells[i] === 'number' || cells[i] === null));
  const th = head.map((h, i) => `<th${numeric[i] ? ' class="num"' : ''}>${escapeHtml(h)}</th>`).join('');
  const body = rows.map((cells) => `<tr>${cells.map((c, i) => `<td${numeric[i] ? ' class="num"' : ''}>${escapeHtml(c ?? 0)}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
}

function dailyChart(stats) {
  const byDay = new Map();
  for (const row of stats.daily) {
    const day = byDay.get(row.day) || { cinnamon: 0, xfce: 0 };
    day[row.edition] = row.n;
    byDay.set(row.day, day);
  }
  const days = [];
  for (let i = DAYS - 1; i >= 0; i -= 1) days.push(dayBefore(stats.today, i));
  const max = Math.max(1, ...days.map((d) => (byDay.get(d)?.cinnamon || 0) + (byDay.get(d)?.xfce || 0)));
  const bars = days.map((d) => {
    const v = byDay.get(d) || { cinnamon: 0, xfce: 0 };
    const total = v.cinnamon + v.xfce;
    const c = (v.cinnamon / max) * 100;
    const x = (v.xfce / max) * 100;
    return `<div class="bar" title="${escapeHtml(`${d.slice(8)}/${d.slice(5, 7)}: ${total} lượt (Cinnamon ${v.cinnamon}, Xfce ${v.xfce})`)}">`
      + `<span class="x" style="height:${x.toFixed(1)}%"></span><span class="c" style="height:${c.toFixed(1)}%"></span>`
      + `<small>${d.slice(8)}</small></div>`;
  }).join('');
  return `<div class="chart" role="img" aria-label="Lượt tải ${DAYS} ngày qua">${bars}</div>`
    + '<p class="legend"><span class="c"></span>Cinnamon <span class="x"></span>Xfce</p>';
}

export function renderStats(stats, now = new Date()) {
  const t = stats.totals;
  const cards = [['Hôm nay', t.today], ['7 ngày', t.week], ['30 ngày', t.month], ['Tất cả', t.total]]
    .map(([label, n]) => `<div class="card"><strong>${escapeHtml(n)}</strong><span>${escapeHtml(label)}</span></div>`).join('');
  const lastActive = stats.active[0];
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive"><meta name="referrer" content="no-referrer">
<title>Thống kê CaramOS</title>
<style>
:root{--bg:#f7f8f6;--fg:#1d2420;--dim:#5e6862;--line:#dfe4e0;--card:#fff;--c:#d9862b;--x:#2f7d4f}
@media (prefers-color-scheme:dark){:root{--bg:#151a17;--fg:#e9eeea;--dim:#a2aca5;--line:#2c3530;--card:#1d2420}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:980px;margin:0 auto;padding:24px 16px 48px}h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:32px 0 12px}
.dim,.empty{color:var(--dim)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-top:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}.card strong{display:block;font-size:28px}
.card span{color:var(--dim)}table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line)}th{font-weight:600;color:var(--dim)}td.num,th.num{text-align:right}
tr:last-child td{border-bottom:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.chart{display:flex;align-items:flex-end;gap:3px;height:180px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 12px 22px;position:relative}
.bar{flex:1;height:100%;display:flex;flex-direction:column-reverse;position:relative}.bar span{display:block;width:100%}
.bar .c{background:var(--c);border-radius:3px 3px 0 0}.bar .x{background:var(--x)}.bar small{position:absolute;bottom:-18px;left:0;right:0;text-align:center;font-size:10px;color:var(--dim)}
.legend{color:var(--dim);font-size:13px}.legend span{display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 4px 0 10px}
.legend .c{background:var(--c)}.legend .x{background:var(--x)}.scroll{overflow-x:auto}
</style></head><body><main>
<h1>Thống kê CaramOS</h1>
<p class="dim">Cập nhật lúc ${escapeHtml(vietnamTime(now.toISOString()))}. Ngày tính theo giờ Việt Nam. Trang này không có trên Google; đừng chia sẻ đường dẫn.</p>
<h2>Lượt tải ISO</h2>
<p class="dim">Chỉ tính người bấm tải. Máy chủ, chương trình tự động và lượt bấm lại cùng bản trong ngày vẫn được ghi nhưng không tính (bảng Không tính bên dưới).</p>
<div class="cards">${cards}</div>
<h2>Lượt tải ${DAYS} ngày qua</h2>
${dailyChart(stats)}
<div class="grid">
<section><h2>Theo bản và nơi lưu</h2>${table(['Bản', 'Tải từ', 'Lượt'], stats.editions.map((r) => [EDITION[r.edition] || r.edition, MIRROR[r.mirror] || r.mirror, r.n]))}</section>
<section><h2>Theo phiên bản</h2>${table(['Phiên bản', 'Lượt'], stats.versions.map((r) => [r.version, r.n]))}</section>
<section><h2>Nơi tải</h2>${table(['Nơi', 'Lượt'], stats.places.map((r) => [place(r), r.n]))}</section>
<section><h2>Đến từ</h2>${table(['Nguồn', 'Lượt'], stats.sources.map((r) => [SOURCE[r.source] || r.source, r.n]))}</section>
<section><h2>Hệ điều hành của máy tải</h2>${table(['Hệ điều hành', 'Lượt'], stats.systems.map((r) => [OS[r.os] || r.os, r.n]))}</section>
<section><h2>Không tính</h2>${table(['Lý do', '30 ngày', 'Tất cả'], (stats.filtered || []).map((r) => [REASON[r.reason] || r.reason || 'Không rõ', r.month, r.n]))}</section>
</div>
<h2>50 lượt bấm gần nhất</h2>
<div class="scroll">${table(['Lúc', 'Bản', 'Tải từ', 'Nơi', 'Nguồn', 'Máy', 'Tính'], stats.recent.map((r) => [vietnamTime(r.at), `${EDITION[r.edition] || r.edition} ${r.version}`, MIRROR[r.mirror] || r.mirror, place(r), SOURCE[r.source] || r.source, OS[r.os] || r.os, KIND[r.kind] || 'Có']))}</div>
<h2>Máy đang dùng CaramOS mỗi ngày</h2>
<p class="dim">Mỗi máy báo một lần một ngày (ngày theo giờ UTC) bằng một mã đổi mỗi ngày; máy tắt thống kê thì không báo.${lastActive ? ` Ngày gần nhất: ${escapeHtml(lastActive.total)} máy.` : ''}</p>
<div class="grid">
<section>${table(['Ngày', 'Tất cả', 'Cinnamon', 'Xfce'], stats.active.map((r) => [`${r.day.slice(8)}/${r.day.slice(5, 7)}`, r.total, r.cinnamon, r.xfce]))}</section>
<section><h2>Phiên bản đang chạy (ngày gần nhất)</h2>${table(['Phiên bản', 'Máy'], stats.activeVersions.map((r) => [r.version, r.n]))}</section>
</div>
</main></body></html>`;
}

const PRIVATE = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
};

export async function handleStats(key, env, now = new Date()) {
  if (!sameKey(key, env.STATS_KEY) || !env.DB) {
    return new Response('Not found', { status: 404, headers: { ...PRIVATE, 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const stats = await readStats(env.DB, now);
  return new Response(renderStats(stats, now), { status: 200, headers: { ...PRIVATE, 'Content-Type': 'text/html; charset=utf-8' } });
}
