import React, { useEffect, useId, useRef, useState } from 'react';
import { dongHanhCopy } from './content.js';

// Đồng hành: this month's support of CaramOS and VNLF against the goal, with the bank QR to give. The numbers come from
// /api/dong-hanh (functions/api/dong-hanh.js), which counts the transfers SePay reports. Prerendered pages carry no
// numbers; the browser loads them, and again every 15 s while the panel is open, so a transfer just made shows up.
// From 150% of the goal the QR goes away and it says thank you; a new month starts again at 0.
// Three places: the small card on the right of the home page's hero (DongHanhHero), the button at the bottom right of
// the other pages and further down the home page (DongHanhButton), and the panel on the support page (DongHanhSection).
const STATUS_URL = '/api/dong-hanh';
const REFRESH_MS = 15_000;
// The hero card's id: the button stays hidden while the card is on screen.
export const HERO_ID = 'dong-hanh';

// The card and the button load at the same moment on the home page: one request serves both.
let lastLoad = null;
function fetchStatus() {
  const now = Date.now();
  if (lastLoad && now - lastLoad.at < REFRESH_MS - 1000) return lastLoad.promise;
  const promise = fetch(STATUS_URL, { cache: 'no-store' }).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  lastLoad = { at: now, promise };
  promise.catch(() => {
    if (lastLoad && lastLoad.promise === promise) lastLoad = null;
  });
  return promise;
}

function useStatus(live) {
  const [status, setStatus] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let stopped = false;
    let timer = 0;
    const load = async () => {
      try {
        const data = await fetchStatus();
        if (!stopped) {
          setStatus(data);
          setFailed(false);
        }
      } catch {
        if (!stopped) setFailed(true);
      }
      if (!stopped && live) timer = window.setTimeout(load, REFRESH_MS);
    };
    load();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [live]);
  return { status, failed };
}

const percentOf = (status) => (status && status.goal ? Math.floor((status.total / status.goal) * 100) : 0);
// What to write in the transfer ("Caramos Dong Hanh"); the QR fills it in.
const messageOf = (status) => status.message || status.code;
// The first letter of a masked name ("N*** V** A*" → "N"), for the little faces of recent supporters.
const initialOf = (name) => (name ? name.trim().charAt(0).toUpperCase() : '♥');

function qrUrl(status) {
  const { bank } = status;
  if (!bank || !bank.account || !bank.code) return '';
  const query = new URLSearchParams({ acc: bank.account, bank: bank.code, des: messageOf(status), template: 'qronly' });
  return `https://qr.sepay.vn/img?${query}`;
}

function Heart() {
  return <svg className="dh-heart" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-7-4.4-9.2-8.6C1.4 8.6 3 5 6.4 5c2 0 3.4 1.1 4.1 2.4h3C14.2 6.1 15.6 5 17.6 5 21 5 22.6 8.6 21.2 11.4 19 15.6 12 20 12 20z" />
  </svg>;
}

function useCopy(value) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Without clipboard access the text stays selectable.
    }
  };
  return [copied, copy];
}

function CopyRow({ label, value, t }) {
  const [copied, copy] = useCopy(value);
  return <div className="dh-row">
    <dt>{label}</dt>
    <dd><code>{value}</code><button type="button" className="dh-copy" onClick={copy}>{copied ? t.copied : t.copy}</button></dd>
  </div>;
}

// A small copy button with an icon, for the card.
function CopyIcon({ label, value, t }) {
  const [copied, copy] = useCopy(value);
  const name = copied ? t.copied : t.copyLabel(label);
  return <button type="button" className={`dh-icon-copy${copied ? ' is-done' : ''}`} onClick={copy} aria-label={name}
    title={name}>
    {copied
      ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
      : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V7A2.5 2.5 0 0 0 13 4.5H7A2.5 2.5 0 0 0 4.5 7v6A2.5 2.5 0 0 0 7 15.5h1.5" /></svg>}
  </button>;
}

// The month's total against the goal, its bar, and how many gave.
function Progress({ t, status }) {
  const percent = percentOf(status);
  return <div className="dh-progress">
    <p className="dh-amounts">
      <span>{t.month(status.month)}</span>
      <strong>{t.money(status.total)}</strong>
      <span className="dh-of">{t.of(t.money(status.goal))}</span>
    </p>
    <div className={`dh-bar${percent >= 100 ? ' dh-bar-reached' : ''}`} role="progressbar" aria-valuemin={0}
      aria-valuemax={100} aria-valuenow={Math.min(percent, 100)} aria-label={t.progressLabel(percent)}>
      <span style={{ width: `${Math.min(percent, 100)}%` }} />
    </div>
    <p className="dh-count">{t.percent(percent)} · {t.count(status.count)}</p>
  </div>;
}

function Panel({ t, status, failed, titleId, showOther }) {
  if (!status) {
    return <div className="dh-panel">
      <h2 id={titleId}>{t.title}</h2>
      <p className="dh-lead">{t.lead}</p>
      <p className="dh-note" role="status">{failed ? t.failed : t.loading}</p>
    </div>;
  }
  const percent = percentOf(status);
  const qr = qrUrl(status);
  return <div className="dh-panel">
    <h2 id={titleId}>{t.title}</h2>
    {!status.full && <p className="dh-lead">{t.lead}</p>}
    <Progress t={t} status={status} />
    {status.full
      ? <div className="dh-thanks" role="status">
          <p className="dh-thanks-title">{t.full}</p>
          <p>{t.fullNext}</p>
        </div>
      : <>
          {percent >= 100 && <p className="dh-reached">{t.reached}</p>}
          {qr
            ? <div className="dh-pay">
                <figure className="dh-qr">
                  <img src={qr} alt={t.qrAlt} width="150" height="150" loading="lazy" />
                  <figcaption>{t.scan}</figcaption>
                </figure>
                <dl className="dh-bank">
                  <div className="dh-row"><dt>{t.bank}</dt><dd>{status.bank.code}</dd></div>
                  <CopyRow label={t.account} value={status.bank.account} t={t} />
                  {status.bank.holder && <div className="dh-row"><dt>{t.holder}</dt><dd>{status.bank.holder}</dd></div>}
                  <CopyRow label={t.content} value={messageOf(status)} t={t} />
                </dl>
              </div>
            : <p className="dh-note">{t.noAccount}</p>}
          <p className="dh-note">{t.nameHint(messageOf(status))}</p>
        </>}
    {status.recent && status.recent.length > 0 && <div className="dh-recent">
      <h3>{t.recentTitle}</h3>
      <ul>
        {status.recent.map((item, index) => <li key={`${item.at}-${index}`}>
          <span className="dh-who">{item.name || t.anonymous}</span>
          <span className="dh-amount">{t.money(item.amount)}</span>
        </li>)}
      </ul>
    </div>}
    {showOther && <p className="dh-other"><a href="/support/">{t.other}</a></p>}
  </div>;
}

// The small card on the right of the home page's hero, over the screenshot's corner: the month's progress, the last
// few supporters, and a small QR (larger under the pointer) with the account and the message to copy. Before the
// numbers load it keeps its lines, empty, so that nothing moves.
export function DongHanhHero({ lang }) {
  const t = dongHanhCopy[lang] || dongHanhCopy.vi;
  const { status, failed } = useStatus(false);
  const titleId = useId();
  const full = Boolean(status && status.full);
  const percent = percentOf(status);
  const qr = status && !full ? qrUrl(status) : '';
  const bank = status && status.bank && status.bank.account ? status.bank : null;
  const recent = status && status.recent ? status.recent.slice(0, 4) : [];
  return <section className={`dh-card${full ? ' is-full' : ''}`} id={HERO_ID} aria-labelledby={titleId}>
    <div className="dh-card-head">
      <h2 id={titleId}><Heart />{t.title}</h2>
      <span className="dh-card-month">{status ? t.month(status.month) : ''}</span>
    </div>
    <p className="dh-card-amount">
      <strong>{status ? t.money(status.total) : ' '}</strong>
      {status && <span>{t.of(t.money(status.goal))}</span>}
      {status && <b>{t.percent(percent)}</b>}
    </p>
    <div className="dh-card-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={Math.min(percent, 100)} aria-label={t.progressLabel(percent)}>
      <span style={{ width: `${Math.min(percent, 100)}%` }} />
    </div>
    <p className="dh-card-people">
      {recent.length > 0 && <span className="dh-faces" aria-hidden="true">
        {recent.map((item, index) => <span key={`${item.at}-${index}`} className="dh-face"
          title={`${item.name || t.anonymous}: ${t.money(item.amount)}`}>{initialOf(item.name)}</span>)}
      </span>}
      <span role="status">{status ? t.count(status.count) : (failed ? t.failed : t.loading)}</span>
    </p>
    {full
      ? <p className="dh-card-thanks">{t.full}</p>
      : <div className="dh-card-pay">
          <figure className="dh-card-qr">
            {qr ? <img src={qr} alt={t.qrAlt} width="96" height="96" /> : <span className="dh-qr-blank" />}
          </figure>
          <dl className="dh-card-bank">
            <div>
              <dt>{bank ? [bank.code, bank.holder].filter(Boolean).join(' · ') : t.account}</dt>
              <dd><code>{bank ? bank.account : ' '}</code>{bank && <CopyIcon label={t.account} value={bank.account} t={t} />}</dd>
            </div>
            <div>
              <dt>{t.contentLong}</dt>
              <dd><code>{status ? messageOf(status) : ' '}</code>{status && <CopyIcon label={t.contentLong} value={messageOf(status)} t={t} />}</dd>
            </div>
          </dl>
        </div>}
    {!full && <p className="dh-card-note">{t.cardNote}{lang === 'en' && <>{' '}<a href="/support/">{t.other}</a></>}</p>}
  </section>;
}

// The button at the bottom right; it opens the panel (a sheet from the bottom on phones). With heroId, it stays hidden
// while that card is on screen, from the first render on, so that the home page does not flash it.
export function DongHanhButton({ lang, heroId }) {
  const t = dongHanhCopy[lang] || dongHanhCopy.vi;
  const [open, setOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(Boolean(heroId));
  const { status, failed } = useStatus(open);
  const titleId = useId();
  const panelId = useId();
  const toggleRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const hero = heroId ? document.getElementById(heroId) : null;
    if (!hero || typeof IntersectionObserver === 'undefined') {
      setHeroInView(false);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event) => {
      if (!sheetRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const percent = percentOf(status);
  const hidden = heroInView && !open;
  return <div className={`dh-float${open ? ' dh-open' : ''}${hidden ? ' is-hidden' : ''}`}>
    {open && <div className="dh-sheet" id={panelId} ref={sheetRef} role="dialog" aria-labelledby={titleId} tabIndex={-1}>
      <button type="button" className="dh-close" onClick={() => setOpen(false)} aria-label={t.close}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <Panel t={t} status={status} failed={failed} titleId={titleId} showOther />
    </div>}
    <button type="button" className="dh-toggle" ref={toggleRef} aria-expanded={open} aria-controls={panelId}
      onClick={() => setOpen((value) => !value)}>
      <Heart />
      <span>{t.button}</span>
      {status && <span className="dh-toggle-meta">{status.full ? t.fullShort : `${percent}%`}</span>}
    </button>
  </div>;
}

// The whole panel inside a page (the support page).
export function DongHanhSection({ lang }) {
  const t = dongHanhCopy[lang] || dongHanhCopy.vi;
  const { status, failed } = useStatus(true);
  const titleId = useId();
  return <section className="dh-section" aria-labelledby={titleId}>
    <Panel t={t} status={status} failed={failed} titleId={titleId} showOther={false} />
  </section>;
}
