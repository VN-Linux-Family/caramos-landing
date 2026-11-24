// End-to-end check of the SePay webhook, both HMAC-SHA256 and API Key with the one key, against `yarn dev:api`
// (wrangler pages dev, local D1).
// It posts made-up transfers, so it runs only against this machine, never the live site.
// Usage: node server/sepay-e2e.mjs http://127.0.0.1:8788 <SEPAY_WEBHOOK_SECRET> <BANK_ACCOUNT>   (both from .dev.vars)
import { createHmac } from 'node:crypto';

const [base, secret, account] = process.argv.slice(2);
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(base || '') || !secret || !account) {
  console.error('usage: node server/sepay-e2e.mjs http://127.0.0.1:8788 <SEPAY_WEBHOOK_SECRET> <BANK_ACCOUNT>');
  process.exit(2);
}
const hook = `${base}/api/sepay-webhook`;
const sign = (timestamp, body) => `sha256=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;
const nowSeconds = () => Math.floor(Date.now() / 1000);
const vietnamNow = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19);
const run = Date.now() % 1_000_000_000;
const transfer = (id, fields = {}) => ({
  id, gateway: 'MBBank', transactionDate: vietnamNow(), accountNumber: account, code: null,
  content: 'Caramos Dong Hanh Tran Thi Mai', transferType: 'in', transferAmount: 150000, accumulated: 0, subAccount: null,
  referenceCode: `FT-E2E-${id}`, description: '', ...fields,
});

async function post(label, body, headers, expectStatus, expectCounted) {
  const response = await fetch(hook, { method: 'POST', body, headers });
  const text = await response.text();
  let counted;
  try { counted = JSON.parse(text).counted; } catch { counted = undefined; }
  const ok = response.status === expectStatus && (expectCounted === undefined || counted === expectCounted);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: ${response.status} ${text}`);
  return ok;
}

const before = await (await fetch(`${base}/api/dong-hanh`, { cache: 'no-store' })).json();
const results = [];
const jsonHeaders = (timestamp, body) => ({
  'Content-Type': 'application/json', 'X-SePay-Timestamp': String(timestamp), 'X-SePay-Signature': sign(timestamp, body),
});

const first = JSON.stringify(transfer(run + 1));
let t = nowSeconds();
results.push(await post('signed JSON is counted', first, jsonHeaders(t, first), 201, true));
results.push(await post('the same transfer again is not counted twice', first, jsonHeaders(nowSeconds(), first), 201,
  false));
results.push(await post('a changed body is refused', first.replace('150000', '9150000'), jsonHeaders(t, first), 401));
const old = JSON.stringify(transfer(run + 2));
t = nowSeconds() - 400;
results.push(await post('a signature older than 5 minutes is refused', old, jsonHeaders(t, old), 401));
t = nowSeconds();
results.push(await post('another secret is refused', old, {
  'Content-Type': 'application/json', 'X-SePay-Timestamp': String(t),
  'X-SePay-Signature': `sha256=${createHmac('sha256', 'wrong').update(`${t}.${old}`).digest('hex')}`,
}, 401));
results.push(await post('a wrong API key is refused', old,
  { 'Content-Type': 'application/json', Authorization: 'Apikey whatever' }, 401));
const viaKey = JSON.stringify(transfer(run + 5, { content: 'CARAMOS DONG HANH PHAM THU HA' }));
results.push(await post('the same key sent as an API key is counted', viaKey,
  { 'Content-Type': 'application/json', Authorization: `Apikey ${secret}` }, 201, true));
results.push(await post('no headers at all is refused', old, { 'Content-Type': 'application/json' }, 401));
const form = new URLSearchParams(Object.entries(transfer(run + 3, { content: 'Dong hanh Le Van Binh' }))
  .map(([name, value]) => [name, value == null ? '' : String(value)])).toString();
t = nowSeconds();
results.push(await post('signed urlencoded is counted', form, {
  'Content-Type': 'application/x-www-form-urlencoded', 'X-SePay-Timestamp': String(t), 'X-SePay-Signature': sign(t, form),
}, 201, true));
const noCode = JSON.stringify(transfer(run + 4, { content: 'tien dien thang 11' }));
t = nowSeconds();
results.push(await post('signed but without the code: delivered, not counted', noCode, jsonHeaders(t, noCode), 201,
  false));

const after = await (await fetch(`${base}/api/dong-hanh`, { cache: 'no-store' })).json();
const added = after.total - before.total;
const countOk = added === 450000 && after.count - before.count === 3;
console.log(`${countOk ? 'PASS' : 'FAIL'} the month went from ${before.total} (${before.count}) to ${after.total} `
  + `(${after.count}): +${added}`);
console.log(`     recent: ${after.recent.map((item) => `${item.name || '(anonymous)'} ${item.amount}`).join(', ')}`);
results.push(countOk);
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `${failed} FAILED` : `all ${results.length} passed`);
process.exit(failed ? 1 : 0);
