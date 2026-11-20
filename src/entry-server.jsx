import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';

export { copy, VERSION, links, SITE, RELEASE_DATE, shots, dailyPhoto } from './content.js';

export function render(route) {
  return renderToString(<App route={route} />);
}
