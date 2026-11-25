// POST /api/active: a CaramOS computer reports, once a day, that it is switched on (server/active.js). Anything else
// answers 405, so that a GET does not fall through to the site's pages.
import { handleReport, methodNotAllowed } from '../../server/active.js';

export async function onRequestPost({ request, env }) {
  return handleReport(request, env.DB);
}

export async function onRequest() {
  return methodNotAllowed();
}
