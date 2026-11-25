// GET /thong-ke/<STATS_KEY>: the hidden statistics page (server/stats.js). Any other key answers 404.
import { handleStats } from '../../server/stats.js';

export async function onRequestGet({ env, params }) {
  return handleStats(String(params.key || ''), env);
}
