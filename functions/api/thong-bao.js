// GET /api/thong-bao: the notices for CaramOS computers (server/notices.js). The computers ask without telling anything
// about themselves and keep what is meant for them. Anything but GET answers 405.
import { handlePublic } from '../../server/notices.js';

export async function onRequestGet({ env }) {
  return handlePublic(env.DB);
}

export async function onRequest() {
  return new Response(JSON.stringify({ error: 'method not allowed' }), {
    status: 405,
    headers: { Allow: 'GET', 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });
}
