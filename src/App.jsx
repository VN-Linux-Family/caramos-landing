import React, { Fragment, useEffect, useState } from 'react';
import {
  VERSION, links, installCommand, upgradeCommand, shots, canonUsbPrinters, captdriverPrinters, networkPrinters,
  githubApi, fallbackRepo, compactNumber, copy, dailyPhoto, sizeOf, srcSetOf,
} from './content.js';

// Downloads open in a new tab, as before the redesign, so the install steps stay open beside them.
const newTab = { target: '_blank', rel: 'noopener noreferrer' };

// One page per route, rendered at build time (scripts/prerender.mjs) and hydrated in the browser:
// '/' is Vietnamese, '/en/' English, '/support/' the donation page.
export function App({ route }) {
  return route === 'support' ? <SupportPage /> : <Landing lang={route === 'en' ? 'en' : 'vi'} />;
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
    <Header t={t} />
    <main id="main">
      <Hero t={t} />
      <Editions t={t} />
      <School t={t} />
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

function Header({ t }) {
  const [label, href, hreflang] = t.otherLanguage;
  return <header className="site-header">
    <div className="site-header-inner">
      <a className="brand" href="#main" translate="no"><Logo /><span>CaramOS</span></a>
      <nav className="site-nav" aria-label={t.menuDownload === 'Tải về' ? 'Mục chính' : 'Main'}>
        {t.menu.map(([text, target]) => <a key={target} href={target}>{text}</a>)}
      </nav>
      <div className="site-header-end">
        <a className="lang-link" href={href} hrefLang={hreflang} lang={hreflang}>{label}</a>
        <a className="btn btn-amber btn-small" href="#download">{t.menuDownload}</a>
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

function Hero({ t }) {
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
        <a className="btn btn-amber btn-large" href={links.download} {...newTab}>
          <span>{t.downloadCinnamon}</span><small>{t.downloadCinnamonNote}</small>
        </a>
        <a className="btn btn-green btn-large" href={links.downloadXfce} {...newTab}>
          <span>{t.downloadXfce}</span><small>{t.downloadXfceNote}</small>
        </a>
      </div>
      <p className="hero-upgrade"><a href="#ota">{t.heroUpgrade}</a></p>
    </div>
    <figure className="hero-shot">
      <img src={`${shots}/first-login.webp`} srcSet={srcSetOf(`${shots}/first-login.webp`)} sizes="(max-width: 960px) 100vw, 60vw" alt={t.heroShotAlt} width="1600" height="1000" fetchPriority="high" />
    </figure>
    <dl className="hero-facts">
      {t.heroFacts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
    </dl>
  </section>;
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
    ['cinnamon', e.cinnamon, links.download, links.checksums, 'btn-amber'],
    ['xfce', e.xfce, links.downloadXfce, links.checksumsXfce, 'btn-green'],
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
          {columns.map(([key, edition, download, checksum, tone], index) => <td key={key} data-edition={edition.name}>
            <a className={`btn ${tone}`} href={download} {...newTab}>{e.download[index]}</a>
            <a className="quiet-link" href={checksum} {...newTab}>{e.checksum}</a>
          </td>)}
        </tr>
      </tbody>
    </table>
    <p className="footnote">{e.footnote}</p>
  </section>;
}

function Shot({ image, overlay, eager }) {
  const [src, alt, width, height] = image;
  return <div className={`shot${overlay ? ' has-overlay' : ''}`}>
    <img src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    {overlay && <img className="shot-overlay" src={overlay[0]} alt={overlay[1]} width={overlay[2]} height={overlay[3]} loading="lazy" decoding="async" />}
  </div>;
}

function School({ t }) {
  const s = t.school;
  const [lab, ...rest] = s.items;
  return <section className="section school" id="school" aria-labelledby="school-title">
    <SectionHead id="school-title" title={s.title} lead={s.lead} />
    <article className="school-main">
      <Shot image={lab.image} overlay={lab.overlay} />
      <div className="school-text"><h3>{lab.title}</h3><p>{lab.text}</p></div>
    </article>
    <div className="school-pair">
      {rest.map((item) => <article key={item.title}>
        <Shot image={item.image} />
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </article>)}
    </div>
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
      <ul className="ticks">{points.map((point) => <li key={point}>{point}</li>)}</ul>
      {link && <a className="text-link" href={link[1]}>{link[0]}</a>}
    </div>
    <FeatureMedia media={media} />
  </article>;
}

function FeatureMedia({ media }) {
  const [src, alt] = media.main;
  if (media.type === 'pair') {
    return <div className="feature-media is-pair">
      <img src={src} alt={alt} width="440" height="480" loading="lazy" decoding="async" />
      <img src={media.second[0]} alt={media.second[1]} width="440" height="480" loading="lazy" decoding="async" />
    </div>;
  }
  const main = <img className="media-main" src={src} alt={alt} {...sizeOf(src)} loading="lazy" decoding="async" />;
  return <div className={`feature-media is-${media.type}`}>
    {media.phone ? <picture><source media="(max-width: 620px)" srcSet={media.phone} />{main}</picture> : main}
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
          <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </article>)}
    </div>
    <p className="muted release-hint">{t.releaseScrollHint}</p>
  </section>;
}

function Faq({ t }) {
  return <section className="section faq" id="faq" aria-labelledby="faq-title">
    <SectionHead id="faq-title" title={t.faq.title} />
    <div className="faq-list">
      {t.faq.items.map(([question, answer], index) => <details key={question} open={index === 0}>
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
    <div className="unikorn" id="support">
      <div>
        <h3>{t.supportTitle}</h3>
        <p className="muted">{t.supportLead}</p>
        <a className="text-link" href={links.unikorn} {...newTab}>{t.supportAction}</a>
      </div>
      <a className="unikorn-badge" href={links.unikorn} {...newTab}>
        <img src="https://unikorn.vn/api/widgets/badge/caramos?theme=light" alt="CaramOS trên Unikorn.vn" width="256" height="64" loading="lazy" />
      </a>
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
          <a className="btn btn-amber btn-large" href={links.download} {...newTab}><span>{t.downloadCinnamon}</span><small>{t.downloadCinnamonNote}</small></a>
          <a className="quiet-link" href={links.checksums} {...newTab}>{t.checksums}</a>
        </div>
        <div className="download-choice">
          <a className="btn btn-light btn-large" href={links.downloadXfce} {...newTab}><span>{t.downloadXfce}</span><small>{t.downloadXfceNote}</small></a>
          <a className="quiet-link" href={links.checksumsXfce} {...newTab}>{t.checksumsXfce}</a>
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
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
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
