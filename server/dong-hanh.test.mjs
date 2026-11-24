// node --test server/: the rules of Đồng hành (server/dong-hanh.js).
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CODE, GOAL, MESSAGE, hasCode, judge, maskName, monthOf, nameAfterCode, sameText, summary, vietnamMonth,
} from './dong-hanh.js';

const transfer = (fields = {}) => ({
  id: 92704,
  gateway: 'MBBank',
  transactionDate: '2026-11-24 14:02:37',
  accountNumber: '0123456789',
  code: null,
  content: 'DONGHANH Nguyen Van An',
  transferType: 'in',
  transferAmount: 200000,
  accumulated: 19077000,
  subAccount: null,
  referenceCode: 'FT24012345678',
  description: '',
  ...fields,
});

test('the month is Vietnam time, and resets by itself', () => {
  assert.equal(vietnamMonth(new Date('2026-11-30T16:59:59Z')), '2026-11');
  assert.equal(vietnamMonth(new Date('2026-11-30T17:00:00Z')), '2026-12', 'midnight in Hanoi is 17:00 UTC');
  assert.equal(monthOf('2026-12-01 00:00:05'), '2026-12');
  assert.equal(monthOf('garbage', new Date('2026-11-05T00:00:00Z')), '2026-11');
});

test('the code is found however the person typed it', () => {
  for (const content of ['DONGHANH', 'donghanh', 'Dong hanh Lan', 'Đồng hành', 'MBVCB.123.DONGHANH NGUYEN VAN A.CT tu',
    'dong-hanh']) {
    assert.ok(hasCode(content), content);
  }
  for (const content of ['NGUYEN VAN A chuyen tien', 'DONG', '', null]) assert.ok(!hasCode(content), String(content));
});

test('the name written after the code, without what banks add', () => {
  assert.deepEqual(nameAfterCode('DONGHANH Nguyen Van An'), ['Nguyen', 'Van', 'An']);
  assert.deepEqual(nameAfterCode('Đồng hành Trần Thị Bích'), ['Trần', 'Thị', 'Bích']);
  assert.deepEqual(nameAfterCode('MBVCB.1234567890.DONGHANH NGUYEN VAN A.CT tu 0123 NGUYEN VAN A'), ['NGUYEN', 'VAN', 'A']);
  assert.deepEqual(nameAfterCode('DONGHANH LE MINH GD 123456-112524'), ['LE', 'MINH']);
  assert.deepEqual(nameAfterCode('DONGHANH NGUYEN VAN A FT24012345678'), ['NGUYEN', 'VAN', 'A']);
  assert.equal(nameAfterCode('DONGHANH'), null);
  assert.equal(nameAfterCode('DONGHANH- Ma GD ACSP/ ab123'), null);
  assert.equal(nameAfterCode('DONGHANH 123456'), null);
  assert.deepEqual(nameAfterCode('DONGHANH Mot Hai Ba Bon Nam Sau'), ['Mot', 'Hai', 'Ba', 'Bon'], 'four words at most');
});

test('names are masked: first letters only', () => {
  assert.equal(maskName(['Nguyen', 'Van', 'An']), 'N*** V** A*');
  assert.equal(maskName(['trần', 'thị', 'bích']), 'T*** T** B***');
  assert.equal(maskName(['A']), 'A');
  assert.equal(maskName(null), null);
});

test('a transfer with the code counts, with only its amount, date and masked name', () => {
  const verdict = judge(transfer(), { accounts: ['0123456789'] });
  assert.deepEqual(verdict, {
    count: true,
    row: { id: 92704, month: '2026-11', amount: 200000, name: 'N*** V** A*', at: '2026-11-24 14:02:37' },
  });
  assert.ok(!JSON.stringify(verdict).includes('Nguyen'), 'the content is not kept');
  assert.equal(judge(transfer({ content: 'DONGHANH' })).row.name, null, 'no name: a supporter');
  assert.equal(judge(transfer({ content: 'mua hang', code: CODE })).count, true, "SePay's own payment code");
});

test('what does not count', () => {
  const reason = (fields, options) => judge(transfer(fields), options).reason;
  assert.equal(reason({ content: 'luong thang 11' }), 'no code');
  assert.equal(reason({ transferType: 'out' }), 'not money in');
  assert.equal(reason({ transferAmount: 0 }), 'no amount');
  assert.equal(reason({ transferAmount: -5 }), 'no amount');
  assert.equal(reason({ transferAmount: '12.5' }), 'no amount');
  assert.equal(reason({ id: undefined }), 'no id');
  assert.equal(reason({ accountNumber: '999' }, { accounts: ['0123456789'] }), 'another account');
  assert.equal(judge(transfer({ accountNumber: '999', subAccount: '0123456789' }), { accounts: ['0123456789'] }).count, true,
    'a virtual account (VA) of the same account counts');
  assert.equal(judge(null).count, false);
});

test("the month's summary: full from 150% of the goal on", () => {
  const base = { month: '2026-11', count: 3, recent: [], bank: { code: 'MBBank', account: '1', holder: 'X' } };
  assert.equal(summary({ ...base, total: GOAL }).full, false, '100%: the QR stays');
  assert.equal(summary({ ...base, total: GOAL * 1.5 - 1 }).full, false);
  assert.equal(summary({ ...base, total: GOAL * 1.5 }).full, true);
  assert.equal(summary({ ...base, total: 0 }).goal, 5_000_000);
});

test('the API key compares in constant time', async () => {
  assert.equal(await sameText('Apikey abc', 'Apikey abc'), true);
  assert.equal(await sameText('Apikey abd', 'Apikey abc'), false);
  assert.equal(await sameText('Apikey ab', 'Apikey abc'), false);
  assert.equal(await sameText('', 'Apikey abc'), false);
});

test("SePay's HMAC-SHA256 signature: right secret, body and time only", async () => {
  const { hmacHex, validSignature } = await import('./dong-hanh.js');
  const { createHmac } = await import('node:crypto');
  const body = '{"id":7,"transferType":"in","transferAmount":100000,"content":"DONGHANH"}';
  const now = Date.UTC(2026, 10, 24, 12, 0, 0);
  const timestamp = Math.floor(now / 1000);
  const expected = createHmac('sha256', 's3cret').update(`${timestamp}.${body}`).digest('hex');
  assert.equal(await hmacHex('s3cret', `${timestamp}.${body}`), expected, 'the same as an independent HMAC');
  const signed = { signature: `sha256=${expected}`, timestamp: String(timestamp), body };
  assert.equal(await validSignature('s3cret', signed, now), true);
  assert.equal(await validSignature('s3cret', { ...signed, signature: `SHA256=${expected.toUpperCase()}` }, now), true);
  assert.equal(await validSignature('other', signed, now), false, 'another secret');
  assert.equal(await validSignature('s3cret', { ...signed, body: body.replace('100000', '900000') }, now), false,
    'a changed body');
  assert.equal(await validSignature('s3cret', signed, now + 301_000), false, 'older than 5 minutes');
  assert.equal(await validSignature('s3cret', { ...signed, timestamp: '' }, now), false);
  assert.equal(await validSignature('s3cret', { ...signed, signature: null }, now), false);
});

test('a VA and its main account both count, in any case; other accounts do not', () => {
  const accounts = ['VQRTEST0001', '0900000001'];
  const count = (fields) => judge(transfer(fields), { accounts }).count;
  assert.equal(count({ accountNumber: '0900000001', subAccount: 'VQRTEST0001' }), true, 'into the VA');
  assert.equal(count({ accountNumber: '0900000001', subAccount: 'vqrtest0001 ' }), true, 'the VA in another case');
  assert.equal(count({ accountNumber: 'VQRTEST0001', subAccount: null }), true, 'the VA as the account');
  assert.equal(count({ accountNumber: '0900000001', subAccount: null }), true, 'straight into the main account');
  assert.equal(count({ accountNumber: '0911111111', subAccount: 'VQROTHER' }), false, 'another account');
  assert.equal(judge(transfer(), { accounts: [undefined, ''] }).count, true, 'nothing configured: every account');
});

test('the message "Caramos Dong Hanh" counts, however the bank writes it, and the name after it shows', () => {
  for (const content of [MESSAGE, 'CARAMOS DONG HANH', 'caramosdonghanh', 'MBVCB.123.CARAMOS DONG HANH.CT tu 0123']) {
    assert.ok(hasCode(content), content);
  }
  assert.deepEqual(nameAfterCode('Caramos Dong Hanh Nguyen Van A'), ['Nguyen', 'Van', 'A']);
  assert.deepEqual(nameAfterCode('CARAMOS DONG HANH LE MINH GD 123456'), ['LE', 'MINH']);
  assert.equal(nameAfterCode('Caramos Dong Hanh'), null, 'no name: a supporter');
  assert.equal(nameAfterCode('Dong Hanh Caramos'), null, 'the word Caramos is not a name');
  const base = { month: '2026-11', total: 0, count: 0, recent: [], bank: {} };
  assert.equal(summary(base).message, 'Caramos Dong Hanh');
  assert.equal(judge(transfer({ content: 'CARAMOS DONG HANH TRAN THI B' })).row.name, 'T*** T** B');
});
