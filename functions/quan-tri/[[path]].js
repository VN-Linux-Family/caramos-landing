// /quan-tri and everything under it: where the notices to CaramOS computers are written (server/admin.js).
import { handleAdmin } from '../../server/admin.js';

export async function onRequest({ request, env, params }) {
  const path = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  return handleAdmin(request, env, path.replace(/^\/+|\/+$/g, ''));
}
