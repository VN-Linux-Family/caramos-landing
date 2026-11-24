// Đồng hành: the monthly support of CaramOS and VNLF, counted from the bank transfers SePay reports.
//
// SePay posts every incoming transfer of the linked account to /api/sepay-webhook. A transfer counts when its content
// has the code (the QR fills it in), so the account can also receive other money. Each month starts again at 0 by
// itself: the month of a transfer is the month of its bank date (Vietnam time), and the status reads the current one.
// Only the amount, the date and a masked name are kept, never the transfer's content.

export const GOAL = 5_000_000; // VND a month
export const FULL_RATIO = 1.5; // from 150% of the goal on, the QR goes and the panel says thank you
export const CODE = 'DONGHANH';
// What the QR fills in and the page asks people to write. Counting needs only CODE inside it (spaces, case and accents
// do not matter), so "CARAMOS DONG HANH", "caramosdonghanh" and a bare "Dong hanh" all count.
export const MESSAGE = 'Caramos Dong Hanh';
export const RECENT = 5;
const NAME_WORDS = 4;
// Words banks add after the content ("…DONGHANH NGUYEN VAN A GD 123456", "…CT tu 0123…"): a name stops there.
const NOT_A_NAME = new Set(['CT', 'GD', 'MA', 'FT', 'TU', 'DEN', 'TOI', 'CK', 'CHUYEN', 'TIEN', 'TRF', 'IBFT', 'QR',
  'ND', 'NOI', 'DUNG', 'THANH', 'TOAN', 'REF', 'TRACE', 'ACSP', 'MBVCB', 'CARAMOS']);

// "YYYY-MM" of a moment in Vietnam time (UTC+7, no daylight saving).
export function vietnamMonth(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 7);
}

// The month of SePay's transactionDate, "YYYY-MM-DD HH:MM:SS" in the bank's (Vietnam) time; else the current one.
export function monthOf(transactionDate, now = new Date()) {
  const match = /^(\d{4})-(\d{2})-\d{2}/.exec(String(transactionDate || ''));
  return match ? `${match[1]}-${match[2]}` : vietnamMonth(now);
}

// Upper-case ASCII letters and digits only: "Đồng hành", "dong-hanh" and "DONG HANH" all become DONGHANH.
export function squeeze(text) {
  return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function hasCode(content) {
  return squeeze(content).includes(CODE);
}

// The name someone wrote after the code ("DONGHANH Nguyen Van An" -> ["Nguyen", "Van", "An"]), or null. It ends at
// the bank's own separators and fields: a dot, a dash, a word with digits, or a word banks add.
export function nameAfterCode(content) {
  const text = String(content || '').normalize('NFC');
  // DONGHANH as the QR writes it, or typed by hand: "Dong hanh", "Đồng hành", "dong-hanh".
  const match = /[dđ]\s*[oòóỏõọôồốổỗộơờớởỡợ]\s*n\s*g[\s._-]*h\s*[aàáảãạăằắẳẵặâầấẩẫậ]\s*n\s*h/iu.exec(text);
  if (!match) return null;
  const segment = text.slice(match.index + match[0].length).split(/[.,;:|/\\_\-–(){}[\]]/)[0];
  const words = [];
  for (const word of segment.trim().split(/\s+/)) {
    if (!word || !/^\p{L}+$/u.test(word) || NOT_A_NAME.has(squeeze(word))) break;
    words.push(word);
    if (words.length === NAME_WORDS) break;
  }
  return words.length ? words : null;
}

// Each word as its first letter and up to three stars: "Nguyen Van An" -> "N*** V** A*".
export function maskName(words) {
  if (!words || !words.length) return null;
  return words.map((word) => {
    const letters = [...word];
    return letters[0].toLocaleUpperCase('vi') + '*'.repeat(Math.min(letters.length - 1, 3));
  }).join(' ');
}

// What to do with one webhook transaction: { count: true, row } or { count: false, reason }.
// Account numbers compare without spaces or case: SePay may report a VA (subAccount) in another case than the bank.
const accountKey = (value) => String(value || '').trim().toUpperCase();

// `accounts`: where a counted transfer may arrive, the account the QR pays (a VA, which SePay reports as subAccount)
// and the main account behind it. With none given, every account counts.
export function judge(tx, { accounts = [] } = {}, now = new Date()) {
  if (!tx || typeof tx !== 'object') return { count: false, reason: 'no transaction' };
  const id = Number(tx.id);
  if (!Number.isSafeInteger(id) || id <= 0) return { count: false, reason: 'no id' };
  if (tx.transferType !== 'in') return { count: false, reason: 'not money in' };
  const amount = Number(tx.transferAmount);
  if (!Number.isSafeInteger(amount) || amount <= 0) return { count: false, reason: 'no amount' };
  const wanted = accounts.map(accountKey).filter(Boolean);
  if (wanted.length && !wanted.includes(accountKey(tx.accountNumber)) && !wanted.includes(accountKey(tx.subAccount))) {
    return { count: false, reason: 'another account' };
  }
  if (!hasCode(tx.content) && !hasCode(tx.code)) return { count: false, reason: 'no code' };
  const at = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(String(tx.transactionDate || ''))
    ? tx.transactionDate
    : new Date(now.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
  return {
    count: true,
    row: { id, month: monthOf(at, now), amount, name: maskName(nameAfterCode(tx.content)), at },
  };
}

// The month's progress, as /api/dong-hanh returns it.
export function summary({ month, total, count, recent, bank }) {
  return {
    month,
    goal: GOAL,
    total,
    count,
    full: total >= GOAL * FULL_RATIO,
    recent: recent.map(({ name, amount, at }) => ({ name, amount, at })),
    code: CODE,
    message: MESSAGE,
    bank,
  };
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

// Compares two texts in constant time (for the webhook's API key).
export async function sameText(given, expected) {
  const a = new TextEncoder().encode(String(given));
  const b = new TextEncoder().encode(String(expected));
  if (a.byteLength !== b.byteLength) {
    // Same work either way, then no.
    if (crypto.subtle.timingSafeEqual) crypto.subtle.timingSafeEqual(b, b);
    return false;
  }
  if (crypto.subtle.timingSafeEqual) return crypto.subtle.timingSafeEqual(a, b);
  let diff = 0;
  for (let i = 0; i < a.byteLength; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// SePay's HMAC-SHA256 signature (developer.sepay.vn/vi/sepay-webhooks/xac-thuc): X-SePay-Signature is
// "sha256=<hex of HMAC-SHA256(secret, "<X-SePay-Timestamp>.<raw body>")>", and the timestamp (Unix seconds) must be
// within 5 minutes of now, so an old request sent again is refused.
export const SIGNATURE_WINDOW_S = 300;

export async function hmacHex(secret, text) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function validSignature(secret, { signature, timestamp, body }, now = Date.now()) {
  const seconds = Number(timestamp);
  if (!signature || !Number.isSafeInteger(seconds) || Math.abs(now / 1000 - seconds) > SIGNATURE_WINDOW_S) return false;
  return sameText(String(signature).trim().toLowerCase(), `sha256=${await hmacHex(secret, `${seconds}.${body}`)}`);
}
