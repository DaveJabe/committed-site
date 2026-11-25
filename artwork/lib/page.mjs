// The HTML shell every piece renders in: fonts embedded as data URLs (no network, no system fonts),
// the palette as CSS variables, and the shared type styles. Templates return only their <body> markup.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { widgetCSS } from './widgets.mjs';

export const ROOT = new URL('../..', import.meta.url).pathname; // the committed-site repository
const font = (path) => `data:font/woff2;base64,${readFileSync(join(ROOT, path)).toString('base64')}`;

const FONTS = `
@font-face { font-family: 'Geist'; src: url(${font('dist/fonts/geist-variable.woff2')}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Inter'; src: url(${font('artwork/fonts/inter-light.woff2')}) format('woff2'); font-weight: 300; }
@font-face { font-family: 'Inter'; src: url(${font('artwork/fonts/inter-regular.woff2')}) format('woff2'); font-weight: 400 500; }
@font-face { font-family: 'Inter'; src: url(${font('artwork/fonts/inter-semibold.woff2')}) format('woff2'); font-weight: 600 700; }
@font-face { font-family: 'Inter Display'; src: url(${font('artwork/fonts/inter-display-light.woff2')}) format('woff2'); font-weight: 300; }
`;

export function paletteVars(p) {
  return Object.entries(p)
    .filter(([, v]) => typeof v === 'string' && /^(#|rgba)/.test(v))
    .map(([k, v]) => `--${k}:${v};`)
    .join('');
}

export function page({ width, height, palette, css = '', body, transparent = false, lang = 'en' }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
:root { ${paletteVars(palette)} }
body { background: ${transparent ? 'transparent' : 'var(--bg)'}; color: var(--ink); font-family: 'Geist', sans-serif;
  -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; font-kerning: normal; }
.abs { position: absolute; }
.eyebrow { font-weight: 500; text-transform: uppercase; color: var(--accent); }
.headline { font-weight: 600; color: var(--ink); text-wrap: balance; }
.headline em { font-style: normal; color: var(--accent); }
.sub { font-weight: 400; color: var(--inkDim); text-wrap: pretty; }
.wordmark { font-weight: 500; text-transform: uppercase; color: var(--inkDim); }
*, *::before, *::after { animation: none !important; transition: none !important; }
${widgetCSS}
${css}
</style></head><body>${body}</body></html>`;
}
