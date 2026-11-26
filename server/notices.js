// Notices to every CaramOS computer: written at /quan-tri (server/admin.js), read by the computers from /api/thong-bao
// (functions/api/thong-bao.js). caramos-ota on each computer fetches the list a few minutes after login and every few
// hours, keeps the notices meant for its CaramOS version, its edition and its state (an update waiting or failing),
// and shows each notice once to each user, in Vietnamese or in English. The request carries nothing about the computer:
// it picks its notices itself.
//
// This reaches every computer whose updater is recent, also when its updates are stuck: the computer reads the list
// over HTTPS without APT or dpkg. A notice is text and at most one link to vietnamlinuxfamily.net; the computer runs
// nothing it is told.

export const LEVELS = ['info', 'warning', 'critical'];
export const EDITIONS = ['all', 'cinnamon', 'xfce'];
export const CONDITIONS = ['all', 'update-waiting', 'update-failing'];
export const LIMITS = { title: 120, body: 2000, label: 40, url: 300 };
const VERSION = /^\d{1,3}(\.\d{1,3}){1,3}$/;
// "2026-11-27T08:30" from <input type="datetime-local">, read as Vietnam time.
const LOCAL_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const VIETNAM_OFFSET_MS = 7 * 3600 * 1000;

// The link a notice may carry: https on vietnamlinuxfamily.net or one of its subdomains, nothing else.
export function linkAllowed(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  return url.protocol === 'https:' && !url.username && !url.password
    && (host === 'vietnamlinuxfamily.net' || host.endsWith('.vietnamlinuxfamily.net'));
}

// "YYYY-MM-DDTHH:MM:SSZ" in UTC from a Vietnam local time of the form; null when it is not one.
export function utcFromVietnam(local) {
  const match = LOCAL_TIME.exec(String(local || ''));
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const ms = Date.UTC(y, mo - 1, d, h, mi) - VIETNAM_OFFSET_MS;
  const date = new Date(ms);
  if (Number.isNaN(ms) || date.getUTCFullYear() < 2020 || date.getUTCFullYear() > 2100) return null;
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// The form's value for a UTC time: Vietnam local time, "YYYY-MM-DDTHH:MM".
export function vietnamFromUtc(utc) {
  const ms = Date.parse(utc || '');
  if (Number.isNaN(ms)) return '';
  return new Date(ms + VIETNAM_OFFSET_MS).toISOString().slice(0, 16);
}

export function nowUtc(now = new Date()) {
  return now.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function compareVersions(a, b) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff) return diff < 0 ? -1 : 1;
  }
  return 0;
}

function text(form, name) {
  const value = form.get(name);
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : '';
}

// The notice in the admin form (FormData or URLSearchParams), checked: {notice, errors}. errors are in Vietnamese,
// for the form; notice is the row to store when there are none.
export function parseForm(form, now = new Date()) {
  const errors = [];
  const notice = {
    level: text(form, 'level'),
    title_vi: text(form, 'title_vi'),
    body_vi: text(form, 'body_vi'),
    title_en: text(form, 'title_en'),
    body_en: text(form, 'body_en'),
    editions: text(form, 'editions') || 'all',
    min_version: text(form, 'min_version'),
    max_version: text(form, 'max_version'),
    condition: text(form, 'condition') || 'all',
    link_url: text(form, 'link_url'),
    link_label_vi: text(form, 'link_label_vi'),
    link_label_en: text(form, 'link_label_en'),
    active: form.get('active') ? 1 : 0,
  };
  if (!LEVELS.includes(notice.level)) errors.push('Chọn mức độ.');
  if (!notice.title_vi) errors.push('Cần tiêu đề tiếng Việt.');
  if (!notice.body_vi) errors.push('Cần nội dung tiếng Việt.');
  for (const name of ['title_vi', 'title_en']) {
    if (notice[name].length > LIMITS.title) errors.push(`Tiêu đề dài quá ${LIMITS.title} ký tự.`);
  }
  for (const name of ['body_vi', 'body_en']) {
    if (notice[name].length > LIMITS.body) errors.push(`Nội dung dài quá ${LIMITS.body} ký tự.`);
  }
  if (Boolean(notice.title_en) !== Boolean(notice.body_en)) errors.push('Tiếng Anh cần cả tiêu đề lẫn nội dung, hoặc để trống cả hai.');
  if (!EDITIONS.includes(notice.editions)) errors.push('Bản không hợp lệ.');
  if (!CONDITIONS.includes(notice.condition)) errors.push('Điều kiện không hợp lệ.');
  for (const name of ['min_version', 'max_version']) {
    if (notice[name] && !VERSION.test(notice[name])) errors.push(`Phiên bản "${notice[name]}" không đúng dạng 1.5.2.`);
  }
  if (notice.min_version && notice.max_version && VERSION.test(notice.min_version) && VERSION.test(notice.max_version)
      && compareVersions(notice.min_version, notice.max_version) > 0) {
    errors.push('Phiên bản "từ" lớn hơn phiên bản "đến".');
  }
  if (notice.link_url) {
    if (notice.link_url.length > LIMITS.url || !linkAllowed(notice.link_url)) {
      errors.push('Liên kết phải là https trên vietnamlinuxfamily.net.');
    }
    if (!notice.link_label_vi) errors.push('Liên kết cần nhãn tiếng Việt.');
  } else if (notice.link_label_vi || notice.link_label_en) {
    errors.push('Có nhãn liên kết mà chưa có liên kết.');
  }
  for (const name of ['link_label_vi', 'link_label_en']) {
    if (notice[name].length > LIMITS.label) errors.push(`Nhãn liên kết dài quá ${LIMITS.label} ký tự.`);
  }
  const startsLocal = text(form, 'starts_at');
  const endsLocal = text(form, 'ends_at');
  notice.starts_at = startsLocal ? utcFromVietnam(startsLocal) : nowUtc(now);
  notice.ends_at = endsLocal ? utcFromVietnam(endsLocal) : '';
  if (notice.starts_at === null) errors.push('Thời điểm bắt đầu không hợp lệ.');
  if (notice.ends_at === null) errors.push('Thời điểm kết thúc không hợp lệ.');
  if (notice.starts_at && notice.ends_at && notice.ends_at <= notice.starts_at) errors.push('Kết thúc phải sau bắt đầu.');
  return { notice, errors };
}

const COLUMNS = ['level', 'title_vi', 'body_vi', 'title_en', 'body_en', 'editions', 'min_version', 'max_version',
  'condition', 'link_url', 'link_label_vi', 'link_label_en', 'starts_at', 'ends_at', 'active'];

export async function listNotices(db) {
  const { results } = await db.prepare('SELECT * FROM notices ORDER BY id DESC').all();
  return results || [];
}

export async function getNotice(db, id) {
  return db.prepare('SELECT * FROM notices WHERE id = ?1').bind(id).first();
}

export async function saveNotice(db, notice, id = null, now = new Date()) {
  const values = COLUMNS.map((name) => notice[name]);
  const at = nowUtc(now);
  if (id) {
    const set = COLUMNS.map((name, index) => `${name} = ?${index + 1}`).join(', ');
    await db.prepare(`UPDATE notices SET ${set}, updated_at = ?${COLUMNS.length + 1} WHERE id = ?${COLUMNS.length + 2}`)
      .bind(...values, at, id).run();
    return id;
  }
  const placeholders = COLUMNS.map((_, index) => `?${index + 1}`).join(', ');
  const result = await db.prepare(`INSERT INTO notices (${COLUMNS.join(', ')}, created_at, updated_at) `
    + `VALUES (${placeholders}, ?${COLUMNS.length + 1}, ?${COLUMNS.length + 1})`).bind(...values, at).run();
  return result.meta?.last_row_id ?? null;
}

export async function deleteNotice(db, id) {
  await db.prepare('DELETE FROM notices WHERE id = ?1').bind(id).run();
}

// What the computers get for one stored notice.
export function publicNotice(row) {
  return {
    id: row.id,
    level: row.level,
    title: { vi: row.title_vi, en: row.title_en || '' },
    body: { vi: row.body_vi, en: row.body_en || '' },
    editions: row.editions,
    min_version: row.min_version || '',
    max_version: row.max_version || '',
    condition: row.condition,
    link: row.link_url ? { url: row.link_url, label: { vi: row.link_label_vi, en: row.link_label_en || '' } } : null,
    starts_at: row.starts_at,
    ends_at: row.ends_at || '',
  };
}

export async function activeNotices(db, now = new Date()) {
  const at = nowUtc(now);
  const { results } = await db.prepare('SELECT * FROM notices WHERE active = 1 AND starts_at <= ?1 '
    + "AND (ends_at = '' OR ends_at > ?1) ORDER BY id").bind(at).all();
  return (results || []).map(publicNotice);
}

// GET /api/thong-bao. Five minutes of cache: a notice reaches the computers within minutes of being saved.
export async function handlePublic(db, now = new Date()) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300',
    'X-Robots-Tag': 'noindex' };
  if (!db) return new Response(JSON.stringify({ schema: 1, notices: [] }), { status: 200, headers });
  const notices = await activeNotices(db, now);
  return new Response(JSON.stringify({ schema: 1, notices }), { status: 200, headers });
}
