// POST /api/sepay-webhook: SePay reports each transfer into the linked bank account (my.sepay.vn > Webhooks).
// Authentication uses one key, the SEPAY_WEBHOOK_SECRET secret of this Pages project, whichever of SePay's two choices
// the webhook's "Bảo mật" step has:
// - HMAC-SHA256 (recommended): SePay signs "<timestamp>.<raw body>" (X-SePay-Signature, X-SePay-Timestamp) and never
//   sends the key; a changed body or a signature older than 5 minutes is refused. The webhook must send JSON (SePay's
//   default) or urlencoded: for multipart/form-data SePay signs a form-encoded string, not the body it sends.
// - API Key: SePay sends "Authorization: Apikey <key>".
// A transfer with the code DONGHANH is counted once, by SePay's transaction id: SePay may send the same one again (its
// retries, a manual resend). The answer is 201 {"success": true}, which every SePay webhook counts as delivered, also
// for a transfer that does not count, so that SePay does not resend it.
import { judge, json, sameText, validSignature } from '../../server/dong-hanh.js';

async function readBody(raw, request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return JSON.parse(raw);
  if (type.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(raw));
  const copy = new Request(request.url, { method: 'POST', headers: request.headers, body: raw });
  return Object.fromEntries(await copy.formData());
}

export async function onRequestPost({ request, env }) {
  // Trimmed: a key pasted with a line break would never match.
  const secret = (env.SEPAY_WEBHOOK_SECRET || '').trim();
  if (!secret || !env.DB) return json({ success: false, error: 'not configured' }, 503);
  const raw = await request.text();
  const signature = request.headers.get('X-SePay-Signature');
  const trusted = signature
    ? await validSignature(secret, { signature, timestamp: request.headers.get('X-SePay-Timestamp'), body: raw })
    : await sameText(request.headers.get('Authorization') || '', `Apikey ${secret}`);
  if (!trusted) return json({ success: false, error: 'unauthorized' }, 401);
  let tx;
  try {
    tx = await readBody(raw, request);
  } catch {
    return json({ success: false, error: 'unreadable body' }, 400);
  }
  const verdict = judge(tx, { accounts: [env.BANK_ACCOUNT, env.BANK_MAIN_ACCOUNT] });
  if (!verdict.count) return json({ success: true, counted: false, reason: verdict.reason }, 201);
  const { id, month, amount, name, at } = verdict.row;
  const result = await env.DB.prepare(
    'INSERT OR IGNORE INTO donations (sepay_id, month, amount, name, at) VALUES (?, ?, ?, ?, ?)',
  ).bind(id, month, amount, name, at).run();
  const added = Boolean(result.meta && result.meta.changes);
  return json({ success: true, counted: added, reason: added ? undefined : 'seen before' }, 201);
}

export function onRequest() {
  return json({ success: false, error: 'POST only' }, 405, { Allow: 'POST' });
}
