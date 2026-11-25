// The CaramOS release the site offers. The page (src/content.js) and the download counter (functions/tai) both read
// it, so a release changes one line here.
export const VERSION = '1.5.2';
export const EDITIONS = ['cinnamon', 'xfce'];

// The ISO of an edition, on Cloudflare R2 (only the newest release is kept there) and on SourceForge (every release).
export function isoName(edition, version = VERSION) {
  return `CaramOS-${version}-${edition}-amd64.iso`;
}

export function r2Url(edition, version = VERSION) {
  return `https://download.caramos.vietnamlinuxfamily.net/${isoName(edition, version)}`;
}

export function sourceforgeUrl(edition, version = VERSION) {
  return `https://sourceforge.net/projects/caramos/files/v${version}/${isoName(edition, version)}/download`;
}
