// GET /tai/cinnamon, /tai/xfce: count the download (server/downloads.js), then send the browser to the ISO on R2,
// or on SourceForge with ?mirror=sourceforge. STATS_KEY also keys the daily hash that groups one person's clicks.
import { handleDownload } from '../../server/downloads.js';

export async function onRequest({ request, env, params }) {
  return handleDownload(request, env.DB, String(params.edition || ''), { secret: env.STATS_KEY });
}
