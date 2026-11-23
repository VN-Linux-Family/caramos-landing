import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';

export { copy, VERSION, links, SITE, RELEASE_DATE, shots, heroShot, srcSetOf, dailyPhoto } from './content.js';
export { routes, pathOf } from './routes.js';
export { diagrams, diagramWarnings } from './diagrams.js';

export function render(page, lang) {
  return renderToString(<App page={page} lang={lang} />);
}
