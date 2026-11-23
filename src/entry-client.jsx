import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { routeOf } from './routes.js';
import './fonts.css';
import './styles.css';

// The English page used to be /?lang=en; old links and bookmarks land on /en/.
const asked = new URLSearchParams(window.location.search).get('lang');
if (window.location.pathname === '/' && asked === 'en') {
  window.location.replace(`/en/${window.location.hash}`);
} else {
  // The same table scripts/prerender.mjs renders the pages from.
  const { page, lang } = routeOf(window.location.pathname);
  const root = document.getElementById('root');
  const app = <App page={page} lang={lang} />;
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
