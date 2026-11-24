// Renders every page to HTML after `vite build`, so search engines, AI crawlers and link previews read the content
// without running JavaScript. The browser then hydrates the same markup (src/entry-client.jsx). The pages are the
// ones in src/routes.js, which the browser reads too:
//
//   /                 Vietnamese home      dist/index.html
//   /en/              English home         dist/en/index.html
//   /giao-duc/        schools (vi)         dist/giao-duc/index.html
//   /en/education/    schools (en)         dist/en/education/index.html
//   /doanh-nghiep/    companies (vi)       dist/doanh-nghiep/index.html
//   /en/business/     companies (en)       dist/en/business/index.html
//   /support/         donation page        dist/support/index.html
//
// It also writes dist/404.html (Cloudflare Pages then answers unknown paths with a real 404), dist/sitemap.xml and
// dist/llms.txt.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const server = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);
const {
  render, copy, VERSION, links, SITE, RELEASE_DATE, shots, heroShot, srcSetOf, routes, pathOf, diagrams, diagramWarnings,
} = server;

// A line that no longer fits its box in a diagram (src/diagrams.js) is worth a look before deploying.
for (const [name, diagram] of Object.entries(diagrams)) {
  for (const warning of diagramWarnings(name, diagram)) console.warn(`warning: diagram ${warning}`);
}

// The stylesheet (about 6 KB compressed) goes inline, so the first paint waits for no other request.
const builtTemplate = readFileSync(join(dist, 'index.html'), 'utf8');
const cssLink = builtTemplate.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (!cssLink) throw new Error('no stylesheet link in dist/index.html');
const css = readFileSync(join(dist, cssLink[1]), 'utf8');
const template = builtTemplate.replace(cssLink[0], () => `<style>${css}</style>`);
const today = new Date().toISOString().slice(0, 10);
// The link preview of every page. It names the version, so each release draws a new one under a new name
// (/assets is cached for a year); its description is copy[lang].seo.ogAlt.
const ogImage = `${SITE}/assets/og-caramos-1.5.0.jpg`;
const org = {
  '@type': 'Organization',
  '@id': 'https://vietnamlinuxfamily.net/#organization',
  name: 'Vietnam Linux Family',
  url: 'https://vietnamlinuxfamily.net/',
  sameAs: [links.org, links.facebook, links.telegram, links.discord],
};

// Head tags and JSON-LD are read by machines: no word joiners from typeset (src/content.js) in them.
const escape = (text) => String(text).replace(/\u2060/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script> must not be able to close the element.
const jsonLd = (data) => JSON.stringify(data, null, 2).replace(/\u2060/g, '').replace(/</g, '\\u003c');

function landingGraph(lang, url) {
  const t = copy[lang];
  const inLanguage = lang === 'vi' ? 'vi-VN' : 'en-US';
  const software = `${SITE}/#software`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'CaramOS',
        inLanguage: ['vi-VN', 'en-US'],
        publisher: { '@id': org['@id'] },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t.seo.title,
        description: t.seo.description,
        inLanguage,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': software },
        primaryImageOfPage: ogImage,
        dateModified: today,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': software,
        name: 'CaramOS',
        description: t.seo.description,
        applicationCategory: 'OperatingSystem',
        operatingSystem: 'Linux',
        softwareVersion: VERSION,
        datePublished: RELEASE_DATE,
        releaseNotes: links.release,
        license: 'https://www.gnu.org/licenses/gpl-3.0.html',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
        downloadUrl: [links.download, links.downloadXfce],
        memoryRequirements: lang === 'vi' ? '2 GB RAM (bản Xfce), khuyên dùng 4 GB' : '2 GB of RAM (Xfce edition), 4 GB recommended',
        storageRequirements: lang === 'vi' ? 'Ổ đĩa trống từ 20 GB' : '20 GB of free disk space',
        image: ogImage,
        screenshot: [`${SITE}${heroShot}`, `${SITE}${shots}/xfce-desktop-150.webp`],
        inLanguage: ['vi-VN', 'en-US'],
        publisher: { '@id': org['@id'] },
        author: { '@id': org['@id'] },
        hasPart: [
          { '@type': 'SoftwareApplication', name: 'CaramOS Cinnamon', softwareVersion: VERSION, operatingSystem: 'Linux', applicationCategory: 'OperatingSystem', downloadUrl: links.download, fileSize: '2.9 GB', memoryRequirements: '4 GB RAM' },
          { '@type': 'SoftwareApplication', name: 'CaramOS Xfce', softwareVersion: VERSION, operatingSystem: 'Linux', applicationCategory: 'OperatingSystem', downloadUrl: links.downloadXfce, fileSize: '2.7 GB', memoryRequirements: '2 GB RAM' },
        ],
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE}/#source`,
        name: 'CaramOS',
        codeRepository: links.repo,
        license: 'https://www.gnu.org/licenses/gpl-3.0.html',
        targetProduct: { '@id': software },
      },
      {
        // Describes the visible questions below; Google no longer shows FAQ rich results, other engines read it.
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage,
        mainEntity: t.faq.items.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}

// The Education and Business pages: a WebPage in the same graph as the home page, with its audience and a
// breadcrumb back home. Their questions are plain HTML, without FAQPage markup.
function pageGraph(lang, url, page) {
  const t = copy[lang];
  const p = t[page];
  const home = `${SITE}${pathOf('home', lang)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'CaramOS',
        inLanguage: ['vi-VN', 'en-US'],
        publisher: { '@id': org['@id'] },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: p.seo.title,
        description: p.seo.description,
        inLanguage: lang === 'vi' ? 'vi-VN' : 'en-US',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#software` },
        audience: page === 'education'
          ? { '@type': 'EducationalAudience', educationalRole: 'teacher' }
          : { '@type': 'BusinessAudience' },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        primaryImageOfPage: ogImage,
        dateModified: today,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'CaramOS', item: home },
          { '@type': 'ListItem', position: 2, name: t.menu.find(([, href]) => href === pathOf(page, lang))[0], item: url },
        ],
      },
    ],
  };
}

function headFor(page) {
  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta http-equiv="content-language" content="${page.lang}" />`,
    `<link rel="canonical" href="${page.url}" />`,
  ];
  if (page.alternates) {
    for (const [hreflang, href] of page.alternates) tags.push(`<link rel="alternate" hreflang="${hreflang}" href="${href}" />`);
  }
  tags.push(
    `<meta property="og:site_name" content="CaramOS" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${page.url}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(page.ogAlt)}" />`,
    `<meta property="og:locale" content="${page.lang === 'vi' ? 'vi_VN' : 'en_US'}" />`,
    `<meta property="og:locale:alternate" content="${page.lang === 'vi' ? 'en_US' : 'vi_VN'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:image:alt" content="${escape(page.ogAlt)}" />`,
  );
  for (const href of page.preload || []) tags.push(href);
  if (page.graph) tags.push(`<script type="application/ld+json">\n${jsonLd(page.graph)}\n</script>`);
  return tags.map((tag) => `    ${tag}`).join('\n');
}

function build(page) {
  const head = headFor(page);
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${page.lang}">`)
    .replace(/<!--head-start-->[\s\S]*?<!--head-end-->/, head.trimStart())
    .replace('<!--app-->', page.body);
  if (html.includes('<!--app-->') || html.includes('head-start')) throw new Error(`template markers left in ${page.file}`);
  const out = join(dist, page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${page.file} (${(html.length / 1024).toFixed(0)} KB)`);
}

// The fonts and the screenshot of the first viewport, so the headline and the picture arrive first.
const fontPreload = (weight, subset) => `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/be-vietnam-pro-v12-${weight}-${subset}.woff2" crossorigin />`;
const heroPreload = [
  fontPreload(800, 'latin'),
  fontPreload(800, 'vietnamese'),
  fontPreload(400, 'latin'),
  fontPreload(400, 'vietnamese'),
  `<link rel="preload" as="image" type="image/webp" href="${heroShot}" imagesrcset="${srcSetOf(heroShot)}" imagesizes="(max-width: 960px) 100vw, 60vw" fetchpriority="high" />`,
];

// The Education page's first screen is the Computer Lab screenshot; the Business page's is the admin's Overview.
const fontsPreload = heroPreload.slice(0, 4);
const imagePreload = (src) => `<link rel="preload" as="image" type="image/webp" href="${src}" fetchpriority="high" />`;
const pagePreload = {
  education: [...fontsPreload, imagePreload(`${shots}/lab-veyon-140.webp`)],
  business: [...fontsPreload, imagePreload(`${shots}/business-overview-030.webp`)],
};

const urlOf = (page, lang) => `${SITE}${pathOf(page, lang)}`;
// hreflang: each page and its translation, with the Vietnamese one as the default.
const alternatesOf = (page) => [['vi', urlOf(page, 'vi')], ['en', urlOf(page, 'en')], ['x-default', urlOf(page, 'vi')]];

for (const { page, lang, path } of routes) {
  const t = copy[lang];
  const url = `${SITE}${path}`;
  const file = `${path.slice(1)}index.html`;
  if (page === 'home') {
    build({
      lang, file, url,
      alternates: alternatesOf('home'),
      title: t.seo.title,
      description: t.seo.description,
      ogAlt: t.seo.ogAlt,
      preload: heroPreload,
      graph: landingGraph(lang, url),
      body: render(page, lang),
    });
  } else if (page === 'support') {
    build({
      lang, file, url,
      title: 'Ủng hộ CaramOS — Vietnam Linux Family',
      description: 'Ủng hộ CaramOS qua MoMo, PayPal, Ko-fi, Buy Me a Coffee hoặc USDT TRC20, để dự án Linux cho người Việt sống lâu dài.',
      ogAlt: copy.vi.seo.ogAlt,
      body: render(page, lang),
    });
  } else {
    const { seo } = t[page];
    build({
      lang, file, url,
      alternates: alternatesOf(page),
      title: seo.title,
      description: seo.description,
      // Every page shows the same link preview (ogImage), so its description is the home page's.
      ogAlt: t.seo.ogAlt,
      preload: pagePreload[page],
      graph: pageGraph(lang, url, page),
      body: render(page, lang),
    });
  }
}

// A real 404: without this file Cloudflare Pages would answer every unknown path with the home page.
writeFileSync(join(dist, '404.html'), `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Không tìm thấy trang — CaramOS</title>
    <link rel="icon" href="/assets/CaramOS_logo.png" />
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fff; color: #15291d; font: 17px/1.6 system-ui, sans-serif; }
      main { max-width: 34rem; padding: 2rem; }
      h1 { margin: 0 0 .5rem; font-size: 2rem; line-height: 1.15; }
      a { color: #1f5135; text-underline-offset: 3px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Không tìm thấy trang này</h1>
      <p>Đường dẫn có thể đã đổi. Mời bạn về <a href="/">trang chủ CaramOS</a> hoặc <a href="/#download">tải CaramOS ${VERSION}</a>.</p>
      <p lang="en">This page does not exist. Go to the <a href="/en/">CaramOS home page</a>.</p>
    </main>
  </body>
</html>
`);

const urlEntry = (loc, alternatesForUrl) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
${(alternatesForUrl || []).map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`).join('\n')}
  </url>`.replace(/\n\n/g, '\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['home', 'education', 'business'].flatMap((page) => ['vi', 'en'].map((lang) => urlEntry(urlOf(page, lang), alternatesOf(page)))).join('\n')}
${urlEntry(`${SITE}/wallpapers/`)}
${urlEntry(`${SITE}/support/`)}
</urlset>
`);

// A plain-text summary for AI assistants that read /llms.txt (llmstxt.org); the same facts as the page.
const vi = copy.vi;
const en = copy.en;
const news = en.whatsNew;
const llms = `# CaramOS

> ${en.faq.items[0][1]}

- Version: ${VERSION}, released ${RELEASE_DATE}. Website: ${SITE}/ (Vietnamese), ${SITE}/en/ (English).
- For schools: ${urlOf('education', 'en')}. For companies: ${urlOf('business', 'en')}.
- Download the Cinnamon edition (2.9 GB, computers with 4 GB of RAM or more): ${links.download}
- Download the Xfce edition (2.7 GB, 2 GB computers and school labs): ${links.downloadXfce}
- Checksums: ${links.checksums} and ${links.checksumsXfce}
- Release notes: ${links.release}
- Source code (GPL-3.0): ${links.repo}
- Community: ${links.facebook}, ${links.telegram}, ${links.discord}

## ${news.title}

${news.lead}

${news.blocks.map((block) => `### ${block.title}\n\n${block.lead}\n\n${block.points.map((point) => `- ${point}`).join('\n')}`).join('\n\n')}

### ${news.moreTitle}

${news.more.map(([title, text]) => `- **${title}.** ${text}`).join('\n')}

## CaramOS for schools

${urlOf('education', 'en')} (English), ${urlOf('education', 'vi')} (Vietnamese). ${en.education.seo.description}

${en.education.lab.lead}

${[en.education.oldPcs, en.education.textbook].map((block) => `${block.lead}`).join('\n\n')}

Learning apps in the App Center's "Learning and teaching" step: ${en.education.apps.groups.flatMap(([, apps]) => apps.map(([name, text]) => `${name} (${text.charAt(0).toLowerCase()}${text.slice(1)})`)).join('; ')}.

## CaramOS Business

${urlOf('business', 'en')} (English), ${urlOf('business', 'vi')} (Vietnamese). ${en.business.hero.status.join(' ')}

${en.business.hero.lead} Every feature is off until the admin turns it on, for the whole company or one department. It is free during the trial period and may become paid later.

${en.business.settings.rows.map(([name, text]) => `- ${name}: ${text}`).join('\n')}

${en.business.privacy.title}: ${en.business.privacy.lead} Never: ${en.business.privacy.never.join(', ').toLowerCase()}. ${en.business.privacy.law}

Feedback and feature requests: ${links.contactEmail}.

## Frequently asked questions

${en.faq.items.map(([question, answer]) => `### ${question}\n\n${answer}`).join('\n\n')}

## Câu hỏi thường gặp (tiếng Việt)

${vi.faq.items.map(([question, answer]) => `### ${question}\n\n${answer}`).join('\n\n')}
`;
// Plain text: without the word joiners that keep number ranges whole on the page (typeset in src/content.js).
writeFileSync(join(dist, 'llms.txt'), llms.replace(/\u2060/g, ''));
console.log('wrote 404.html, sitemap.xml, llms.txt');
