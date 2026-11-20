import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App.jsx';
import './fonts.css';
import './styles.css';

// Same rule as scripts/prerender.mjs: /en/ is English, /support/ the donation page, everything else Vietnamese.
function routeOf(pathname) {
  if (/^\/en(\/|$)/.test(pathname)) return 'en';
  if (/^\/support(\/|$)/.test(pathname)) return 'support';
  return 'vi';
}

// The English page used to be /?lang=en; old links and bookmarks land on /en/.
const asked = new URLSearchParams(window.location.search).get('lang');
if (window.location.pathname === '/' && asked === 'en') {
  window.location.replace(`/en/${window.location.hash}`);
} else {
  const root = document.getElementById('root');
  const app = <App route={routeOf(window.location.pathname)} />;
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
