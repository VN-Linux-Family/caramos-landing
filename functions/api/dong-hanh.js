// GET /api/dong-hanh: this month's Đồng hành (Vietnam time): the total against the goal, how many transfers, the last
// few masked names, and the bank account the QR pays into. BANK_CODE (VietQR short name), BANK_ACCOUNT (the account or
// VA the QR pays) and BANK_HOLDER are secrets of this Pages project, so that they stay out of this public repository;
// BANK_MAIN_ACCOUNT, the main account behind a VA, is only used to count transfers and is never shown.
import { RECENT, json, summary, vietnamMonth } from '../../server/dong-hanh.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'not configured' }, 503);
  const month = vietnamMonth();
  const totals = await env.DB.prepare(
    'SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count FROM donations WHERE month = ?',
  ).bind(month).first();
  const recent = await env.DB.prepare(
    'SELECT name, amount, at FROM donations WHERE month = ? ORDER BY at DESC, sepay_id DESC LIMIT ?',
  ).bind(month, RECENT).all();
  const bank = { code: env.BANK_CODE || '', account: env.BANK_ACCOUNT || '', holder: env.BANK_HOLDER || '' };
  return json(summary({ month, total: totals.total, count: totals.count, recent: recent.results || [], bank }), 200, {
    'Cache-Control': 'public, max-age=15',
  });
}
