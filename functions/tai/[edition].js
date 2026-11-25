// GET /tai/cinnamon, /tai/xfce: count the download (server/downloads.js), then send the browser to the ISO on R2,
// or on SourceForge with ?mirror=sourceforge.
import { handleDownload } from '../../server/downloads.js';

export async function onRequest({ request, env, params }) {
  return handleDownload(request, env.DB, String(params.edition || ''));
}
