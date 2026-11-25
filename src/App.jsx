import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  VERSION, links, installCommand, upgradeCommand, heroShot, canonUsbPrinters, captdriverPrinters, networkPrinters,
  githubApi, fallbackRepo, compactNumber, copy, dailyPhoto, sizeOf, srcSetOf, SITE,
} from './content.js';
import { pathOf } from './routes.js';
import { diagrams } from './diagrams.js';
import { FeatureDiagram } from './FeatureDiagram.jsx';
import { DongHanhButton, DongHanhHero, DongHanhSection, HERO_ID } from './DongHanh.jsx';

// Downloads open in a new tab, as before the redesign, so the install steps stay open beside them.
const newTab = { target: '_blank', rel: 'noopener noreferrer' };
// A download link with the place it sits on the page, which the download counter keeps (functions/tai).
const from = (href, place) => `${href}${href.includes('?') ? '&' : '?'}from=${place}`;

// One page per route (src/routes.js), rendered at build time (scripts/prerender.mjs) and hydrated in the browser.
// Every page but the support page (which has the whole panel) gets the Đồng hành button (src/DongHanh.jsx); on the
// home page it stays hidden while the hero's Đồng hành card is on screen.
export function App({ page, lang }) {
  if (page === 'support') return <SupportPage />;
  const body = page === 'education' ? <EducationPage lang={lang} />
    : page === 'business' ? <BusinessPage lang={lang} />
      : <Landing lang={lang} />;
  const home = page !== 'education' && page !== 'business';
  return <>{body}<DongHanhButton lang={lang} heroId={home ? HERO_ID : undefined} /></>;
}

function Landing({ lang }) {
  const t = copy[lang];
  const [repo, setRepo] = useState(fallbackRepo);
  const [contributors, setContributors] = useState([]);
  const [githubError, setGithubError] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetch(githubApi.repo, { signal: controller.signal }), fetch(githubApi.contributors, { signal: controller.signal })])
      .then(async ([repoResponse, peopleResponse]) => {
        if (!repoResponse.ok || !peopleResponse.ok) throw new Error('GitHub API request failed');
        setRepo(await repoResponse.json());
        setContributors(await peopleResponse.json());
      })
      .catch((error) => { if (error.name !== 'AbortError') setGithubError(true); });
    return () => controller.abort();
  }, []);

  const copyCommand = async (command) => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const area = document.createElement('textarea');
      area.value = command;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(command);
    window.setTimeout(() => setCopied(''), 1800);
  };

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header t={t} page="home" lang={lang} />
    <main id="main">
      <Hero t={t} lang={lang} />
      <Backing t={t} />
      <WhatsNew t={t} />
      <Editions t={t} />
      <Orgs t={t} lang={lang} />
      <Features t={t} />
      <DailyWallpaper t={t} />
      <Printers t={t} />
      <Compare t={t} />
      <Extras t={t} />
      <Upgrade t={t} copied={copied} onCopy={copyCommand} />
      <ReleaseNotes t={t} />
      <Faq t={t} />
      <Community t={t} repo={repo} contributors={contributors} githubError={githubError} />
      <Download t={t} />
    </main>
    <Footer t={t} />
  </>;
}

function Logo() {
  return <img className="logo" src="/assets/caramos-logo-64.png" alt="" width="32" height="32" />;
}

// The same header on every page. Menu anchors (#features) are home page sections, so other pages link to them on
// the home page; Giáo dục and Doanh nghiệp are pages. Below 1280 px the menu folds behind a Menu button.
// cta: [label, href, short label for phones]; the home page's is Tải về.
function Header({ t, page, lang, cta }) {
  const [label, , hreflang, short] = t.otherLanguage;
  const home = pathOf('home', lang);
  const here = pathOf(page, lang);
  const otherLang = lang === 'vi' ? 'en' : 'vi';
  const otherHref = pathOf(page, otherLang) || pathOf('home', otherLang);
  const hrefOf = (target) => (target.startsWith('#') && page !== 'home' ? `${home}${target}` : target);
  const [ctaLabel, ctaHref, ctaShort] = cta || [t.menuDownload, hrefOf('#download')];
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event) => { if (!headerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return <header className={`site-header${open ? ' is-open' : ''}`} ref={headerRef}>
    <div className="site-header-inner">
      <a className="brand" href={page === 'home' ? '#main' : home} translate="no"><Logo /><span>CaramOS</span></a>
      <nav className="site-nav" id="site-menu" aria-label={t.navLabel}>
        {t.menu.map(([text, target]) => <a key={target} href={hrefOf(target)} aria-current={target === here ? 'page' : undefined} onClick={() => setOpen(false)}>{text}</a>)}
        <a className="nav-github" href={links.repo}>GitHub</a>
      </nav>
      <div className="site-header-end">
        <a className="github-link" href={links.repo} aria-label={t.githubLabel} title={t.githubLabel}><GithubMark /></a>
        <a className="lang-link" href={otherHref} hrefLang={hreflang} lang={hreflang} aria-label={label}><span className="long">{label}</span><span className="short" aria-hidden="true">{short}</span></a>
        <a className="btn btn-outline btn-small donate-link" href="/support/">{t.supportPage}</a>
        <a className="btn btn-amber btn-small header-cta" href={ctaHref}>
          {ctaShort ? <><span className="long">{ctaLabel}</span><span className="short">{ctaShort}</span></> : ctaLabel}
        </a>
        <button type="button" className="menu-toggle" ref={toggleRef} aria-expanded={open} aria-controls="site-menu" aria-label={t.menuLabel} onClick={() => setOpen((value) => !value)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          <span className="menu-toggle-text" aria-hidden="true">{t.menuLabel}</span>
        </button>
      </div>
    </div>
  </header>;
}

// Replays what the Lotus input method does with Telex keystrokes, once, after the page has loaded. The finished
// words are in the HTML from the start, for search engines, screen readers and visitors who prefer less motion.
function useTelex(frames, finalText) {
  const [state, setState] = useState({ text: finalText, key: -1, typing: false });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timers = [];
    const at = (ms, next) => timers.push(window.setTimeout(() => setState(next), ms));
    let time = 1100;
    for (let n = finalText.length - 1; n >= 0; n -= 1) {
      at(time, { text: finalText.slice(0, n), key: -1, typing: true });
      time += 38;
    }
    time += 320;
    frames.forEach(([, text], index) => {
      at(time, { text, key: index, typing: true });
      time += index === frames.length - 1 ? 0 : 150;
    });
    at(time + 1400, { text: finalText, key: -1, typing: false });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [frames, finalText]);
  return state;
}

function Hero({ t, lang }) {
  const telex = useTelex(t.telex, t.heroTyped);
  return <section className="hero" id="overview" aria-labelledby="hero-title">
    <div className="hero-copy">
      <h1 id="hero-title" className="hero-title" aria-label={`${t.heroLine} ${t.heroTyped}`}>
        <span className="hero-line">{t.heroLine}</span>{' '}
        <span className={`hero-typed${telex.typing ? ' is-typing' : ''}`} data-final={t.heroTyped}><span>{telex.text}</span></span>
      </h1>
      <div className="telex">
        <p className="telex-keys" aria-hidden="true" translate="no">
          {t.telex.map(([key], index) => <kbd key={index} className={`${key === ' ' ? 'is-space' : ''}${index === telex.key ? ' is-down' : ''}`}>{key === ' ' ? '' : key}</kbd>)}
        </p>
        <p className="telex-note">{t.telexNote}</p>
      </div>
      <p className="hero-intro">{t.heroIntro}</p>
      <div className="hero-actions">
        <a className="btn btn-amber btn-large" href={from(links.download, 'hero')}>
          <span>{t.downloadCinnamon}</span><small>{t.downloadCinnamonNote}</small>
        </a>
        <a className="btn btn-green btn-large" href={from(links.downloadXfce, 'hero')}>
          <span>{t.downloadXfce}</span><small>{t.downloadXfceNote}</small>
        </a>
      </div>
      <p className="hero-mirror">{t.mirrorLead} <a href={from(links.mirrorCinnamon, 'hero')}>{t.mirrorCinnamon}</a>, <a href={from(links.mirrorXfce, 'hero')}>{t.mirrorXfce}</a>.</p>
      <p className="hero-links"><a href="#whats-new">{t.heroNew}</a><a href="#ota">{t.heroUpgrade}</a><a href="/support/">{t.heroDonate}</a><a href={links.repo}>{t.heroSource}</a></p>
    </div>
    <div className="hero-side">
      <figure className="hero-shot">
        <img src={heroShot} srcSet={srcSetOf(heroShot)} sizes="(max-width: 960px) 100vw, 880px" alt={t.heroShotAlt} {...sizeOf(heroShot)} fetchPriority="high" />
      </figure>
      <DongHanhHero lang={lang} />
    </div>
    <dl className="hero-facts">
      {t.heroFacts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
    </dl>
  </section>;
}

// Right under the hero: the Unikorn badges (the product, and its daily, weekly and monthly ranks), the clap, and Donate.
const unikornBadges = [
  ['https://unikorn.vn/api/widgets/badge/caramos?theme=light', 256],
  ['https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=daily', 250],
  ['https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=weekly', 250],
  ['https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=monthly', 250],
];

function Backing({ t }) {
  return <section className="backing" id="support" aria-labelledby="backing-title">
    <div className="backing-text">
      <h2 id="backing-title">{t.supportTitle}</h2>
      <p>{t.supportLead} {t.backing.donateLine}</p>
      <div className="backing-actions">
        <a className="btn btn-green" href={links.unikorn} {...newTab}>{t.supportAction}</a>
        <a className="btn btn-outline" id="donate" href="/support/">{t.heroDonate}</a>
      </div>
    </div>
    <ul className="unikorn-badges">
      {unikornBadges.map(([src, width], index) => <li key={src}>
        <a href={links.unikorn} {...newTab}><img src={src} alt={t.backing.badges[index]} width={width} height="64" loading="lazy" /></a>
      </li>)}
    </ul>
  </section>;
}

// What the latest version brought (content.js whatsNew), right under the Unikorn band, where a first-time visitor
// still sees it: blocks like the features further down, then the smaller changes, then the full release notes.
function WhatsNew({ t }) {
  const w = t.whatsNew;
  return <section className="section whats-new" id="whats-new" aria-labelledby="whats-new-title">
    <SectionHead id="whats-new-title" title={w.title} lead={w.lead} />
    {w.blocks.map((feature, index) => <Feature key={feature.id} feature={feature} flip={index % 2 === 1} />)}
    <div className="whats-new-more">
      <h3>{w.moreTitle}</h3>
      <ul className="extras-list whats-new-list">
        {w.more.map(([title, text, href]) => <li key={title}>
          <h4>{title}</h4>
          <p>{text}{href && <> <a href={href}>{w.moreLink}</a></>}</p>
        </li>)}
      </ul>
      <a className="text-link" href="#release-notes">{w.allNotes}</a>
    </div>
  </section>;
}

// A sentence with `command` parts, which show as code (the release notes quote commands that way). A command wraps
// only between its words, never inside --auto-update.
function Rich({ text }) {
  const parts = text.split('`');
  if (parts.length < 3) return text;
  return parts.map((part, index) => (index % 2
    ? <code key={index} translate="no">{part.split(' ').map((word, n) => <Fragment key={n}>{n > 0 && ' '}<span>{word}</span></Fragment>)}</code>
    : <Fragment key={index}>{part}</Fragment>));
}

function SectionHead({ id, title, lead, children }) {
  return <header className="section-head">
    <h2 id={id}>{title}</h2>
    {lead && <p>{lead}</p>}
    {children}
  </header>;
}

function Editions({ t }) {
  const e = t.editions;
  const columns = [
    ['cinnamon', e.cinnamon, links.download, links.checksums, 'btn-amber', links.mirrorCinnamon],
    ['xfce', e.xfce, links.downloadXfce, links.checksumsXfce, 'btn-green', links.mirrorXfce],
  ];
  return <section className="section editions" id="editions" aria-labelledby="editions-title">
    <SectionHead id="editions-title" title={e.title} lead={e.lead} />
    <div className="editions-shots">
      {columns.map(([key, edition]) => <figure key={key} id={key}>
        <img src={edition.image[0]} srcSet={srcSetOf(edition.image[0])} sizes="(max-width: 760px) 100vw, 50vw" alt={edition.image[1]} width="1280" height="800" loading="lazy" decoding="async" />
        <figcaption><strong>{edition.name}</strong>{edition.note}</figcaption>
      </figure>)}
    </div>
    <table className="editions-table">
      <thead>
        <tr><td /><th scope="col">{e.cinnamon.name}</th><th scope="col">{e.xfce.name}</th></tr>
      </thead>
      <tbody>
        {e.rows.map(([label, cinnamon, xfce]) => <tr key={label}>
          <th scope="row">{label}</th>
          <td data-edition={e.cinnamon.name}>{cinnamon}</td>
          <td data-edition={e.xfce.name}>{xfce}</td>
        </tr>)}
        <tr className="editions-get">
          <th scope="row">{t.menuDownload}</th>
          {columns.map(([key, edition, download, checksum, tone, mirror], index) => <td key={key} data-edition={edition.name}>
            <a className={`btn ${tone}`} href={from(download, 'editions')}>{e.download[index]}</a>
            <a className="quiet-link" href={checksum} {...newTab}>{e.checksum}</a>
            <a className="quiet-link" href={from(mirror, 'editions')}>{e.mirror}</a>
          </td>)}
        </tr>
      </tbody>
    </table>
    <p className="footnote">{e.footnote}</p>
  </section>;
}

// eager: the picture is in the first screen, so it loads at once and before the other pictures.
function Shot({ image, overlay, eager }) {
  const [src, alt, width, height] = image;
  const size = width ? { width, height } : sizeOf(src);
  return <div className={`shot${overlay ? ' has-overlay' : ''}`}>
    <img src={src} alt={alt} {...size} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} />
    {overlay && <img className="shot-overlay" src={overlay[0]} alt={overlay[1]} width={overlay[2]} height={overlay[3]} loading={eager ? 'eager' : 'lazy'} decoding="async" />}
  </div>;
}

// A screenshot with its caption: figure = [src, alt, caption]. A part of a window gets the usual frame; a whole window
// cut out of the desktop (window: transparent round corners) only gets a shadow, like a window on the screen.
function Screen({ figure, window: isWindow }) {
  const [src, alt, caption] = figure;
  return <figure className={`screen${isWindow ? ' is-window' : ''}`}>
    <img src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

// Schools and companies on the home page, each with its real screen and a link to its own page: the school lab
// with the picture on the left, the company manager (free trial) with the picture on the right. id="school" keeps
// the old #school links working.
function Orgs({ t, lang }) {
  const { title, lead, education: e, business: b } = t.orgs;
  return <section className="section band orgs" id="school" aria-labelledby="orgs-title">
    <SectionHead id="orgs-title" title={title} lead={lead} />
    <article className="orgs-edu" aria-labelledby="orgs-edu-title">
      <Shot image={e.image} overlay={e.overlay} />
      <div className="orgs-text">
        <h3 id="orgs-edu-title">{e.title}</h3>
        <p className="orgs-who">{e.who}</p>
        <ul className="ticks">{e.points.map((point) => <li key={point}>{point}</li>)}</ul>
        <a className="btn btn-green orgs-link" href={pathOf('education', lang)}>{e.link}</a>
      </div>
    </article>
    <article className="orgs-biz" id="business" aria-labelledby="orgs-biz-title">
      <Shot image={b.image} />
      <div className="orgs-text">
        <h3 id="orgs-biz-title">{b.title}</h3>
        <p className="orgs-who">{b.who}</p>
        <p className="orgs-status">{b.status}</p>
        <ul className="ticks">{b.points.map((point) => <li key={point}>{point}</li>)}</ul>
        <a className="btn btn-green orgs-link" href={pathOf('business', lang)}>{b.link}</a>
      </div>
    </article>
  </section>;
}

function Features({ t }) {
  return <section className="section features" id="features" aria-labelledby="features-title">
    <SectionHead id="features-title" title={t.featuresTitle} lead={t.featuresLead} />
    {t.features.map((feature, index) => <Feature key={feature.id} feature={feature} flip={index % 2 === 1} />)}
    <div className="gallery">
      <h3>{t.galleryTitle}</h3>
      <div className="gallery-row">
        {t.gallery.map(([src, alt, caption]) => <figure key={src}>
          <img src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />
          <figcaption>{caption}</figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}

function Feature({ feature, flip }) {
  const { id, title, lead, points, media, link, wide } = feature;
  return <article className={`feature${wide ? ' is-wide' : flip ? ' is-flipped' : ''}`} id={`feature-${id}`}>
    <div className="feature-text">
      <h3>{title}</h3>
      <p className="feature-lead">{lead}</p>
      <ul className="ticks">{points.map((point) => <li key={point}><Rich text={point} /></li>)}</ul>
      {link && <a className="text-link" href={link[1]}>{link[0]}</a>}
    </div>
    <FeatureMedia media={media} />
  </article>;
}

function FeatureMedia({ media }) {
  if (media.type === 'duo') {
    // Two pictures side by side with a caption each. Each grows with its pixel width, so both show at one scale.
    return <div className="feature-media is-duo">
      {media.items.map(([src, alt, caption]) => <figure key={src} style={{ flexGrow: sizeOf(src).width }}>
        <img src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />
        <figcaption>{caption}</figcaption>
      </figure>)}
    </div>;
  }
  const [src, alt] = media.main;
  if (media.type === 'pair') {
    return <div className="feature-media is-pair">
      <img src={src} alt={alt} width="440" height="480" loading="lazy" decoding="async" />
      <img src={media.second[0]} alt={media.second[1]} width="440" height="480" loading="lazy" decoding="async" />
    </div>;
  }
  const main = <img className="media-main" src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />;
  return <div className={`feature-media is-${media.type}${media.overlaySize === 'large' ? ' has-large-overlay' : ''}`}>
    {media.phone ? <picture><source media="(max-width: 620px)" srcSet={media.phone} width="400" height="498" />{main}</picture> : main}
    {media.overlay && <img className="media-overlay" src={media.overlay[0]} alt={media.overlay[1]} {...sizeOf(media.overlay[0])} loading="lazy" decoding="async" />}
  </div>;
}

function DailyWallpaper({ t }) {
  const d = t.daily;
  return <section className="daily" aria-labelledby="daily-title">
    <div className="daily-text">
      <h2 id="daily-title">{d.title}</h2>
      <div>
        <p>{d.text}</p>
        <a className="text-link" href="/wallpapers/">{d.link}</a>
      </div>
    </div>
    <figure className="daily-photo">
      <img
        src={dailyPhoto.src}
        srcSet={`${dailyPhoto.srcSmall} 760w, ${dailyPhoto.src} 1440w`}
        sizes="100vw"
        alt={d.alt}
        width={dailyPhoto.width}
        height={dailyPhoto.height}
        loading="lazy"
        decoding="async"
      />
      <figcaption><a href={dailyPhoto.source}>{d.credit(dailyPhoto.author, dailyPhoto.license)}</a></figcaption>
    </figure>
  </section>;
}

function Printers({ t }) {
  const p = t.printers;
  return <section className="section printers" id="printers" aria-labelledby="printers-title">
    <div className="printers-intro">
      <div>
        <h2 id="printers-title">{p.title}</h2>
        <p className="section-lead">{p.lead}</p>
        <ol className="steps">
          {p.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}
        </ol>
      </div>
      <img className="framed" src={p.image[0]} alt={p.image[1]} width="1000" height="540" loading="lazy" decoding="async" />
    </div>
    <div className="printer-lists">
      <div>
        <h3>{p.usbTitle} <span className="count">{canonUsbPrinters.length + captdriverPrinters.length} {p.models}</span></h3>
        <p className="muted">{p.usbHow}</p>
        <h4>{p.canonGroup}</h4>
        <ModelList models={canonUsbPrinters} />
        <h4>{p.captGroup} <span className="muted">({p.captSince})</span></h4>
        <ModelList models={captdriverPrinters} note={p.experimental} />
      </div>
      <div>
        <h3>{p.networkTitle} <span className="count">{networkPrinters.length} {p.models}</span></h3>
        <p className="muted">{p.networkHow}</p>
        <ModelList models={networkPrinters} />
      </div>
    </div>
    <p className="note-box"><strong>{p.otherTitle}</strong> {p.other}</p>
    <p className="footnote">{p.note}</p>
  </section>;
}

function ModelList({ models, note }) {
  // A break opportunity after each slash, so LBP3010/LBP3018/LBP3050 wraps on a phone instead of overflowing.
  return <ul className="model-list">
    {models.map(([name, experimental]) => <li key={name}>
      {name.split('/').map((part, index) => <Fragment key={part}>{index > 0 && <>/<wbr /></>}{part}</Fragment>)}
      {experimental && <em>{note}</em>}
    </li>)}
  </ul>;
}

function Compare({ t }) {
  const c = t.compare;
  return <section className="section compare" aria-labelledby="compare-title">
    <SectionHead id="compare-title" title={c.title} lead={c.lead} />
    <table className="compare-table">
      <thead><tr>{c.head.map((cell, index) => index === 0 ? <td key="corner" /> : <th key={cell} scope="col">{cell}</th>)}</tr></thead>
      <tbody>{c.rows.map(([label, ours, theirs]) => <tr key={label}><th scope="row">{label}</th><td>{ours}</td><td>{theirs}</td></tr>)}</tbody>
    </table>
  </section>;
}

function Extras({ t }) {
  return <section className="section extras" aria-labelledby="extras-title">
    <SectionHead id="extras-title" title={t.extrasTitle} lead={t.extrasLead} />
    <ul className="extras-list">
      {t.extras.map(([, title, text]) => <li key={title}>
        <h3>{title}</h3>
        <p>{text}</p>
      </li>)}
    </ul>
  </section>;
}

function Upgrade({ t, copied, onCopy }) {
  const commands = [
    [t.otaInstallLabel, installCommand, t.otaInstallHint, t.otaCopyInstallLabel],
    [t.otaUpgradeLabel, upgradeCommand, t.otaUpgradeHint, t.otaCopyUpgradeLabel],
  ];
  return <section className="section upgrade" id="ota" aria-labelledby="ota-title">
    <SectionHead id="ota-title" title={t.otaTitle} lead={t.otaLead} />
    <ol className="upgrade-flow" aria-label={t.otaFlowLabel}>
      {t.otaFlow.map(([src, alt, caption]) => <li key={src}>
        <img src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />
        <p>{caption}</p>
      </li>)}
    </ol>
    <div className="upgrade-commands">
      {commands.map(([label, command, hint, aria]) => <div className="command" key={command}>
        <p className="command-label">{label}</p>
        <div className="command-row">
          <code translate="no">{command}</code>
          <button type="button" onClick={() => onCopy(command)} aria-label={aria}>{copied === command ? t.copiedCommand : t.copyCommand}</button>
        </div>
        <p className="muted">{hint}</p>
      </div>)}
    </div>
    <p className="visually-hidden" role="status" aria-live="polite">{copied ? t.otaCopied : ''}</p>
  </section>;
}

function ReleaseNotes({ t }) {
  const entries = [...t.releaseNotes, t.initialRelease];
  return <section className="section release-notes" id="release-notes" aria-labelledby="release-title">
    <SectionHead id="release-title" title={t.releaseNotesTitle} lead={t.releaseNotesLead} />
    <div className="release-list" role="region" aria-label={t.releaseListLabel} tabIndex={0}>
      {entries.map(([version, title, items], index) => <article key={version} className={`release${index === 0 ? ' is-latest' : ''}`}>
        <p className="release-version">{version}{index === 0 && <span>{t.releaseCurrent}</span>}</p>
        <div>
          <h3>{title}</h3>
          <ul>{items.map((item) => <li key={item}><Rich text={item} /></li>)}</ul>
        </div>
      </article>)}
    </div>
    <p className="muted release-hint">{t.releaseScrollHint}</p>
  </section>;
}

function Faq({ t }) {
  return <Questions id="faq" title={t.faq.title} items={t.faq.items} />;
}

// Questions and answers as plain HTML; no FAQ markup for search engines on the Education and Business pages.
function Questions({ id, title, items }) {
  return <section className="section faq" id={id} aria-labelledby={`${id}-title`}>
    <SectionHead id={`${id}-title`} title={title} />
    <div className="faq-list">
      {items.map(([question, answer], index) => <details key={question} open={index === 0}>
        <summary><h3>{question}</h3></summary>
        <p>{answer}</p>
      </details>)}
    </div>
  </section>;
}

function Community({ t, repo, contributors, githubError }) {
  const stats = [
    [compactNumber(repo.stargazers_count), t.starsLabel],
    [compactNumber(repo.forks_count), t.forksLabel],
    [compactNumber(repo.open_issues_count), t.issuesLabel],
  ];
  return <section className="section community" id="ecosystem" aria-labelledby="community-title">
    <SectionHead id="community-title" title={t.communityTitle} lead={t.communityLead} />
    <ul className="channel-list">
      {t.ecosystem.map(([icon, name, desc, meta, , url]) => <li key={name}>
        <a href={url}>
          <span className="channel-icon"><SvgIcon name={icon} /></span>
          <span className="channel-name">{name}</span>
          <span className="channel-meta">{meta}</span>
          <span className="channel-desc">{desc}</span>
        </a>
      </li>)}
    </ul>
    <div className="project" id="opensource">
      <div className="project-info">
        <h3>{t.projectTitle}</h3>
        <p className="muted">{t.openSourceLead}</p>
        <dl className="project-stats">{stats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
        <p className="project-repo"><a className="text-link" href={links.repo}><GithubMark />{t.projectRepoLink}</a></p>
        <dl className="project-facts">{t.openSource.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
      </div>
      <div className="project-people">
        <h3>{t.contributorsTitle}</h3>
        <p className="muted">{githubError ? t.contributorsFallback : t.contributorsLead}</p>
        <ul className="people">
          {contributors.map((person) => <li key={person.id}>
            <a href={person.html_url}>
              <img src={person.avatar_url} alt="" width="40" height="40" loading="lazy" />
              <span>{person.login}</span>
              <small>{t.contributorsCount(person.contributions)}</small>
            </a>
          </li>)}
        </ul>
        <h3>{t.buildTitle}</h3>
        <p className="muted">{t.buildLead}</p>
        <pre className="code-block" translate="no">{`make build                      # dev ISO, lz4\nmake release VERSION=x.y.z      # release ISO, xz\nmake docker-build               # containerized build\nmake debug-iso                  # boot branding diagnostics`}</pre>
      </div>
    </div>
  </section>;
}

function Download({ t }) {
  return <section className="download" id="download" aria-labelledby="download-title">
    <div className="download-inner">
      <div className="download-text">
        <h2 id="download-title">{t.downloadTitle}</h2>
        <p>{t.downloadLead}</p>
        <ul className="requirements">{t.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="download-choices">
        <div className="download-choice">
          <a className="btn btn-amber btn-large" href={from(links.download, 'download')}><span>{t.downloadCinnamon}</span><small>{t.downloadCinnamonNote}</small></a>
          <a className="quiet-link" href={links.checksums} {...newTab}>{t.checksums}</a>
          <a className="quiet-link" href={from(links.mirrorCinnamon, 'download')}>{t.mirrorLink}</a>
        </div>
        <div className="download-choice">
          <a className="btn btn-light btn-large" href={from(links.downloadXfce, 'download')}><span>{t.downloadXfce}</span><small>{t.downloadXfceNote}</small></a>
          <a className="quiet-link" href={links.checksumsXfce} {...newTab}>{t.checksumsXfce}</a>
          <a className="quiet-link" href={from(links.mirrorXfce, 'download')}>{t.mirrorLink}</a>
        </div>
        <a className="quiet-link" href={links.release} {...newTab}>{t.downloadAll}</a>
      </div>
    </div>
  </section>;
}

function Footer({ t }) {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <p className="brand" translate="no"><Logo /><span>CaramOS</span></p>
      <p>{t.footerNote}</p>
      <ul>{t.footerLinks.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}<li><a href={links.vnlf}>vietnamlinuxfamily.net</a></li></ul>
    </div>
  </footer>;
}

// GitHub's mark (octicons mark-github, MIT licence), filled, in the colour of the text around it.
function GithubMark() {
  return <svg className="github-mark" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>;
}

function SvgIcon({ name }) {
  const paths = {
    locale: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    palette: <><path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.7 1.7 0 0 1 1.1-2.9H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" /><path d="M7.5 10h.01M10 7h.01M14 7h.01M16.5 10h.01" /></>,
    camera: <><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-5" /></>,
    website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    telegram: <><path d="M21 4 3 11l7 2 2 7z" /><path d="m10 13 4 3 7-12" /></>,
    discord: <><path d="M7 8c3-2 7-2 10 0l1 8c-4 3-8 3-12 0z" /><path d="M9 15c2 1 4 1 6 0M9.5 12h.01M14.5 12h.01" /></>,
    facebook: <><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1z" /></>,
    apps: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
    mirror: <><path d="M8 5h8v14H8z" /><path d="M5 8h3M16 8h3M5 16h3M16 16h3" /></>,
    mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

// /giao-duc/ and /en/education/: what CaramOS 1.4.0 gives a school computer lab.
function EducationPage({ lang }) {
  const t = copy[lang];
  const e = t.education;
  const a = t.anchors;
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header t={t} page="education" lang={lang} cta={[t.menuDownload, `#${a.start}`]} />
    <main id="main" className="page-main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="page-hero-copy">
          <h1 id="page-title" className="page-title">{e.hero.title}</h1>
          <p className="page-lead">{e.hero.lead}</p>
          <div className="hero-actions">
            <a className="btn btn-amber btn-large" href={from(links.downloadXfce, 'edu')}><span>{e.hero.download}</span><small>{e.hero.downloadNote}</small></a>
            <a className="btn btn-outline btn-large" href={`#${a.contact}`}><span>{e.hero.contact}</span></a>
          </div>
        </div>
        <div className="page-hero-media"><Shot image={e.hero.image} overlay={e.hero.overlay} eager /></div>
        <Facts items={e.hero.facts} />
      </section>

      <MapSection id={a.map} text={e.map} diagram={diagrams.education} lang={lang} words={t.diagramWords} />

      <section className="section lab-section" aria-labelledby="lab-title">
        <div className="page-split">
          <div>
            <h2 id="lab-title" className="page-h2">{e.lab.title}</h2>
            <p className="page-intro">{e.lab.lead}</p>
          </div>
          <div className="lab-actions">
            <h3 className="list-title">{e.lab.pointsTitle}</h3>
            <ul className="ticks">{e.lab.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
        </div>
        <div className="lab-choice">
          <h3 className="list-title">{e.lab.choiceTitle}</h3>
          <dl>{e.lab.choices.map(([name, note, text]) => <div key={name}><dt>{name} <span>({note})</span></dt><dd>{text}</dd></div>)}</dl>
          <p className="muted lab-note">{e.lab.note}</p>
        </div>
      </section>

      <PageFeature id="old-pcs" block={e.oldPcs} />
      <PageFeature id="textbook" block={e.textbook} flip />

      <section className="section apps-section" aria-labelledby="apps-title">
        <div className="apps-head">
          <div>
            <h2 id="apps-title" className="page-h2">{e.apps.title}</h2>
            <p className="page-intro">{e.apps.lead}</p>
          </div>
          <img className="framed" src={e.apps.image[0]} alt={e.apps.image[1]} {...sizeOf(e.apps.image[0])} loading="lazy" decoding="async" />
        </div>
        <div className="app-groups">
          {e.apps.groups.map(([group, apps]) => <div key={group}>
            <h3>{group}</h3>
            <dl>{apps.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl>
          </div>)}
        </div>
      </section>

      <section className="section" aria-labelledby="care-title">
        <h2 id="care-title" className="page-h2 care-title">{e.care.title}</h2>
        <ul className="extras-list is-three">
          {e.care.items.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
        </ul>
      </section>

      <StepsSection id={a.start} steps={e.steps}>
        <div className="steps-downloads">
          <a className="btn btn-amber" href={from(links.downloadXfce, 'edu-steps')}>{e.steps.downloads[0]}</a>
          <a className="btn btn-outline" href={from(links.download, 'edu-steps')}>{e.steps.downloads[1]}</a>
        </div>
      </StepsSection>

      <Questions id={a.faq} title={e.faq.title} items={e.faq.items} />
      <ContactSection t={t} kind="education" id={a.contact} lang={lang} />
    </main>
    <Footer t={t} />
  </>;
}

// /doanh-nghiep/ and /en/business/: CaramOS Doanh nghiệp, a free trial, with screenshots of version 0.3.0.
function BusinessPage({ lang }) {
  const t = copy[lang];
  const b = t.business;
  const a = t.anchors;
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header t={t} page="business" lang={lang} cta={[b.cta, `#${a.contact}`]} />
    <main id="main" className="page-main">
      <section className="page-hero is-business" aria-labelledby="page-title">
        <div className="page-hero-copy">
          <h1 id="page-title" className="page-title">{b.hero.title}</h1>
          <p className="page-lead">{b.hero.lead}</p>
          <p className="status-note"><strong>{b.hero.status[0]}</strong> {b.hero.status[1]}</p>
          <div className="hero-actions is-single">
            <a className="btn btn-amber btn-large" href={`#${a.start}`}><span>{b.hero.cta}</span></a>
            <a className="text-link" href={`#${a.map}`}>{b.hero.mapLink}</a>
          </div>
        </div>
        <figure className="page-hero-media hero-figure is-bleed">
          <Shot image={b.hero.image} eager />
          <figcaption>{b.hero.caption}</figcaption>
        </figure>
        <Facts items={b.hero.facts} />
      </section>

      <MapSection id={a.map} text={b.map} diagram={diagrams.business} lang={lang} words={t.diagramWords} />

      <section className="section" aria-labelledby="settings-title">
        <SectionHead id="settings-title" title={b.settings.title} lead={b.settings.lead} />
        <table className="settings-table">
          <thead><tr>{b.settings.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
          <tbody>{b.settings.rows.map(([name, text]) => <tr key={name}><th scope="row">{name}</th><td>{text}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="section" aria-labelledby="inventory-title">
        <SectionHead id="inventory-title" title={b.inventory.title} lead={b.inventory.lead} />
        <div className="screens">{b.inventory.figures.map((figure) => <Screen key={figure[0]} figure={figure} />)}</div>
        <div className="extras-list is-three inventory-cols">
          {b.inventory.columns.map(([title, items]) => <div key={title}>
            <h3>{title}</h3>
            <ul className="plain-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>)}
        </div>
      </section>

      <section className="section page-split is-even" aria-labelledby="actions-title">
        <div>
          <h2 id="actions-title" className="page-h2">{b.actions.title}</h2>
          <p className="page-intro">{b.actions.lead}</p>
          <ul className="ticks">{b.actions.items.map((item) => <li key={item}>{item}</li>)}</ul>
          <Screen figure={b.actions.image} />
        </div>
        <div className="help-flow">
          <h3 className="list-title">{b.actions.helpTitle}</h3>
          <ol className="steps">{b.actions.help.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>
          <Screen figure={b.actions.helpImage} window />
        </div>
      </section>

      <section className="section page-split" aria-labelledby="files-title">
        <div>
          <h2 id="files-title" className="page-h2">{b.files.title}</h2>
          <p className="page-intro">{b.files.lead}</p>
        </div>
        <ul className="ticks split-list">{b.files.points.map((point) => <li key={point}>{point}</li>)}</ul>
      </section>

      <section className="privacy" aria-labelledby="privacy-title">
        <div className="privacy-inner">
          <div className="privacy-main">
            <div className="privacy-head">
              <h2 id="privacy-title">{b.privacy.title}</h2>
              <p>{b.privacy.lead}</p>
              <p className="privacy-law">{b.privacy.law}</p>
            </div>
            <div className="privacy-lists">
              <div>
                <h3>{b.privacy.neverTitle}</h3>
                <ul className="privacy-never">{b.privacy.never.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>{b.privacy.alwaysTitle}</h3>
                <ul className="ticks">{b.privacy.always.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
          </div>
          <Screen figure={b.privacy.image} window />
        </div>
      </section>

      <section className="section page-split" aria-labelledby="security-title">
        <h2 id="security-title" className="page-h2">{b.security.title}</h2>
        <dl className="security-list">{b.security.items.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
      </section>

      <StepsSection id={a.start} steps={b.steps}>
        <p className="muted steps-note">{b.steps.note}</p>
        <Screen figure={b.steps.image} />
      </StepsSection>

      <Questions id={a.faq} title={b.faq.title} items={b.faq.items} />
      <ContactSection t={t} kind="business" id={a.contact} lang={lang} />
    </main>
    <Footer t={t} />
  </>;
}

function Facts({ items }) {
  return <dl className="hero-facts">{items.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>;
}

// The diagram, on the theme's mist from edge to edge.
function MapSection({ id, text, diagram, lang, words }) {
  return <section className="section band map" id={id} aria-labelledby={`${id}-title`}>
    <SectionHead id={`${id}-title`} title={text.title} lead={text.lead} />
    <FeatureDiagram diagram={diagram} lang={lang} id={`${id}-diagram`} words={words} />
  </section>;
}

// A section with its text on one side and a screenshot on the other, like the home page's features.
function PageFeature({ id, block, flip }) {
  return <section className="section" aria-labelledby={`${id}-title`}>
    <div className={`feature page-feature${flip ? ' is-flipped' : ''}`}>
      <div className="feature-text">
        <h2 id={`${id}-title`} className="page-h2">{block.title}</h2>
        <p className="feature-lead">{block.lead}</p>
        <ul className="ticks">{block.points.map((point) => <li key={point}>{point}</li>)}</ul>
      </div>
      <div className="feature-media">
        <img className="media-main" src={block.image[0]} srcSet={srcSetOf(block.image[0])} sizes="(max-width: 960px) 100vw, 58vw" alt={block.image[1]} {...sizeOf(block.image[0])} loading="lazy" decoding="async" />
      </div>
    </div>
  </section>;
}

// "Bắt đầu thế nào": real steps in order, so they are numbered.
function StepsSection({ id, steps, children }) {
  return <section className="section page-split steps-section" id={id} aria-labelledby={`${id}-title`}>
    <div>
      <h2 id={`${id}-title`} className="page-h2">{steps.title}</h2>
      <p className="page-intro">{steps.lead}</p>
      {children}
    </div>
    <ol className="steps page-steps">{steps.items.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>
  </section>;
}

// The feedback form (feedback or a feature request). The site is static, so sending opens the visitor's email app
// with the message written out for links.contactEmail. Nothing is stored and nothing is sent anywhere else.
function ContactSection({ t, kind, id, lang }) {
  const c = t[kind].contact;
  const f = t.contactForm;
  const [values, setValues] = useState({ type: f.kinds[0], name: '', org: '', message: '' });
  const [errors, setErrors] = useState({});
  const [mailText, setMailText] = useState('');
  const [copied, setCopied] = useState(false);
  const messageRef = useRef(null);
  const fieldId = (key) => `${kind}-${key}`;

  const bind = (key) => ({
    id: fieldId(key),
    name: key,
    value: values[key],
    onChange: (event) => {
      const value = event.target.value;
      setValues((old) => ({ ...old, [key]: value }));
      if (errors[key] && value.trim()) setErrors((old) => ({ ...old, [key]: undefined }));
    },
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${fieldId(key)}-error` : undefined,
  });

  const submit = (event) => {
    event.preventDefault();
    if (!values.message.trim()) {
      setErrors({ message: f.messageError });
      messageRef.current?.focus();
      return;
    }
    setErrors({});
    const org = values.org.trim();
    const subject = `[${c.subject}] ${values.type}${org ? `: ${org}` : ''}`;
    const rows = [[f.mail.kind, values.type], [f.mail.name, values.name], [c.orgLabel, values.org]];
    const body = [
      ...rows.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`),
      '',
      `${f.mail.message}:`,
      values.message.trim(),
      '',
      `${f.mail.from} ${SITE}${pathOf(kind, lang)}`,
    ].join('\r\n');
    setMailText(`${subject}\n\n${body.replace(/\r\n/g, '\n')}`);
    setCopied(false);
    window.location.href = `mailto:${links.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${links.contactEmail}\n\n${mailText}`);
      setCopied(true);
    } catch {
      // Without clipboard access the address stays on the page to write to by hand.
    }
  };

  const errorOf = (key) => errors[key] && <p className="field-error" id={`${fieldId(key)}-error`}>{errors[key]}</p>;

  return <section className="contact" id={id} aria-labelledby={`${id}-title`}>
    <div className="contact-main">
      <h2 id={`${id}-title`} className="page-h2">{c.title}</h2>
      <p className="page-intro">{c.lead}</p>
      {/* Without JavaScript the browser hands the fields to the email app itself. */}
      <form className="contact-form" action={`mailto:${links.contactEmail}`} method="post" encType="text/plain" noValidate onSubmit={submit}>
        <fieldset className="field is-wide field-choice">
          <legend>{f.kind}</legend>
          <div className="choice-row">
            {f.kinds.map((label) => <label key={label} className="choice">
              <input type="radio" name="type" value={label} checked={values.type === label}
                onChange={() => setValues((old) => ({ ...old, type: label }))} />
              <span>{label}</span>
            </label>)}
          </div>
        </fieldset>
        <div className="field is-wide">
          <label htmlFor={fieldId('message')}>{f.message} <span className="field-required">({f.required})</span></label>
          <textarea {...bind('message')} ref={messageRef} rows="5" maxLength="3000" placeholder={c.messagePlaceholder} aria-required="true" />
          {errorOf('message')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('name')}>{f.name}</label>
          <input {...bind('name')} type="text" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor={fieldId('org')}>{c.orgLabel}</label>
          <input {...bind('org')} type="text" autoComplete="organization" />
        </div>
        <div className="contact-submit">
          <button type="submit" className="btn btn-green">{f.submit}</button>
          <p className="contact-privacy">{f.privacy}</p>
        </div>
      </form>
      <div className="contact-sent">
        <p role="status">{mailText && <>{f.opened} <a href={`mailto:${links.contactEmail}`}>{links.contactEmail}</a>.</>}</p>
        {mailText && <button type="button" className="btn btn-outline btn-small" onClick={copyMessage}>{copied ? f.copied : f.copy}</button>}
      </div>
    </div>
    <div className="contact-channels">
      <h3>{f.channelsTitle}</h3>
      <ul>
        {f.channels.map(([icon, name, meta, href]) => <li key={name}>
          <a href={href}>
            <span className="channel-icon"><SvgIcon name={icon} /></span>
            <span className="channel-name">{name}</span>
            <span className="channel-meta">{meta}</span>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}

function SupportPage() {
  const usdtWallet = 'TCUujuiz26P26oAbuECvqpHUnd2sWudv2G';
  const [copiedWallet, setCopiedWallet] = useState(false);
  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(usdtWallet);
      setCopiedWallet(true);
      window.setTimeout(() => setCopiedWallet(false), 1800);
    } catch {
      // Without clipboard access the address stays selectable on the page.
    }
  };

  const donationCards = [
    ['paypal', 'PayPal', '', 'paypal.me/mrd900', 'Donate via PayPal', 'https://paypal.me/mrd900'],
    ['kofi', 'Ko-fi', '0% fee', 'ko-fi.com/mrd900', 'Support on Ko-fi', 'https://ko-fi.com/mrd900'],
    ['coffee', 'Buy Me a Coffee', '', 'buymeacoffee.com/mrd900', 'Buy a Coffee', 'https://buymeacoffee.com/mrd900'],
  ];

  return <div className="support-page">
    <header className="support-page-nav">
      <a className="brand" href="/"><Logo /><span>CaramOS</span></a>
      <a className="btn btn-outline btn-small" href="/">Về trang chủ</a>
    </header>
    <main className="support-page-main">
      <section className="support-page-hero">
        <h1>Fund the Future of CaramOS</h1>
        <p>CaramOS miễn phí và luôn hướng đến cộng đồng. Sự ủng hộ của bạn giúp chúng tôi duy trì hạ tầng, thử nghiệm ISO, cải thiện tính năng, viết tài liệu và giữ dự án sống lâu dài. Dù nhỏ hay lớn, mọi đóng góp đều rất đáng quý!</p>
      </section>

      <DongHanhSection lang="vi" />

      <section className="featured-donation momo-donation">
        <div className="featured-info">
          <div className="donation-icon-row">
            <DonationIcon name="momo" />
            <div><h2>MoMo</h2><p>Accepts transfers from <strong>all Vietnamese banks</strong></p></div>
          </div>
          <p className="featured-recipient">Recipient: <strong>Lê Viết Dũng</strong></p>
          <a className="btn btn-green" href="https://nhantien.momo.vn/0947287893" {...newTab}>Donate via MoMo</a>
        </div>
        <div className="donation-qr-box">
          <img src="/assets/support/momo-vietqr.png" alt="MoMo VietQR Code" width="180" height="191" loading="lazy" />
          <span>Scan with MoMo or any banking app</span>
        </div>
      </section>

      <section className="donation-grid" aria-label="Online donation methods">
        {donationCards.map(([icon, title, fee, address, action, url]) => <article className="donation-card" key={title}>
          <div className="donation-icon-row">
            <DonationIcon name={icon} />
            <div><h2>{title}</h2>{fee && <p>{fee}</p>}</div>
          </div>
          <p className="donation-link"><code>{address}</code></p>
          <a className="btn btn-green" href={url} {...newTab}>{action}</a>
        </article>)}
      </section>

      <section className="featured-donation">
        <div className="featured-info">
          <div className="donation-icon-row">
            <DonationIcon name="usdt" />
            <div><h2>USDT (TRC20)</h2><p>Network: Tron TRC20</p></div>
          </div>
          <div className="crypto-address"><code>{usdtWallet}</code><button type="button" onClick={copyWallet}>{copiedWallet ? 'Copied' : 'Copy'}</button></div>
        </div>
        <div className="donation-qr-box">
          <img src="/assets/support/usdt-trc20-qr.png" alt="USDT TRC20 Wallet QR Code" width="180" height="180" loading="lazy" />
          <span>Scan with your crypto wallet</span>
        </div>
      </section>

      <section className="support-thanks">
        <h2>Cảm ơn bạn đã ủng hộ!</h2>
        <p>Dù bạn donate, chia sẻ dự án hay tham gia hỗ trợ người dùng mới, sự đồng hành của bạn đều giúp CaramOS và cộng đồng VNLF phát triển tốt hơn.</p>
        <a className="btn btn-green" href={links.discord} {...newTab}>Tham gia Discord Community</a>
      </section>
    </main>
  </div>;
}

function DonationIcon({ name }) {
  const icons = {
    paypal: <><rect width="36" height="36" rx="8" fill="#003087" /><path d="M14 10H20C22.5 10 24 11.5 24 14C24 16.5 22.5 18 20 18H17L16 26H12L14 10Z" fill="#fff" /><path d="M16 12H21C23 12 24.5 13.2 24.5 15.5C24.5 17.8 23 19 21 19H18.5L17.5 26" stroke="#009cde" strokeWidth="1.5" fill="none" /></>,
    kofi: <><rect width="36" height="36" rx="8" fill="#72B3EB" /><rect x="7" y="12" width="17" height="14" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="2" /><path d="M24 15H26C27.7 15 29 16.3 29 18C29 19.7 27.7 21 26 21H24" stroke="#1A1A1A" strokeWidth="2" fill="white" /><path d="M18.5 16.3C18.1 15.7 17.4 15.3 16.6 15.3C15.3 15.3 14.2 16.4 14.2 17.7C14.2 20.3 15.5 21 15.5 21L18.5 23.5L21.5 21C21.5 21 22.8 20.3 22.8 17.7C22.8 16.4 21.7 15.3 20.4 15.3C19.6 15.3 18.9 15.7 18.5 16.3Z" fill="#EF5A29" /></>,
    coffee: <><rect width="36" height="36" rx="8" fill="#FFDD00" /><ellipse cx="18" cy="10" rx="6" ry="2" stroke="#0D1117" strokeWidth="2.2" fill="none" /><path d="M14 10C14 8 16 7 18 8C20 9 22 8 22 10" stroke="#0D1117" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M12 13L13.5 28H22.5L24 13" stroke="#0D1117" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M14 19L14.5 27H21.5L22 19C20 18 16 18 14 19Z" fill="white" /></>,
    usdt: <><rect width="36" height="36" rx="8" fill="#26A17B" /><path d="M11 12H25" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><path d="M18 12V27" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><ellipse cx="18" cy="18" rx="6" ry="2" stroke="white" strokeWidth="1.5" fill="none" /></>,
    momo: <><rect width="36" height="36" rx="8" fill="#A50064" /><path d="M5 17V12C5 9.5 6.5 8 8.2 8C9.9 8 10.5 9.5 10.5 11V17" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M10.5 17V12C10.5 9.5 12 8 13.7 8C15.4 8 16 9.5 16 11V17" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><circle cx="24" cy="12.5" r="4.5" stroke="white" strokeWidth="2.2" fill="none" /><path d="M5 29V24C5 21.5 6.5 20 8.2 20C9.9 20 10.5 21.5 10.5 23V29" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M10.5 29V24C10.5 21.5 12 8 13.7 20C15.4 20 16 21.5 16 23V29" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><circle cx="24" cy="24.5" r="4.5" stroke="white" strokeWidth="2.2" fill="none" /></>,
  };
  return <svg className="donation-icon" viewBox="0 0 36 36" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">{icons[name]}</svg>;
}
