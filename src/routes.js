// Every page of the site, in one list that both the browser (src/entry-client.jsx) and the prerender
// (scripts/prerender.mjs) read, so a page added here is rendered to HTML and found again when it hydrates.
//
//   page       what App renders ('home', 'education', 'business', 'support')
//   lang       'vi' or 'en'
//   path       the URL, always with a trailing slash; dist/<path>/index.html
export const routes = [
  { page: 'home', lang: 'vi', path: '/' },
  { page: 'home', lang: 'en', path: '/en/' },
  { page: 'education', lang: 'vi', path: '/giao-duc/' },
  { page: 'education', lang: 'en', path: '/en/education/' },
  { page: 'business', lang: 'vi', path: '/doanh-nghiep/' },
  { page: 'business', lang: 'en', path: '/en/business/' },
  { page: 'support', lang: 'vi', path: '/support/' },
];

// The page for a URL path. '/giao-duc' and '/giao-duc/index.html' count as '/giao-duc/'. Paths the list does not
// know only reach the app in local previews (Cloudflare Pages answers them with 404.html): they get the home page
// of their language.
export function routeOf(pathname) {
  const path = `${pathname.replace(/index\.html$/, '').replace(/\/+$/, '')}/`;
  return routes.find((route) => route.path === path)
    || routes.find((route) => route.page === 'home' && route.lang === (/^\/en\//.test(path) ? 'en' : 'vi'));
}

// The path of a page in a language, or undefined when the site has no such page.
export function pathOf(page, lang) {
  return routes.find((route) => route.page === page && route.lang === lang)?.path;
}
