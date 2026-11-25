#!/usr/bin/env node
// Copies rendered artwork into the website's static folder under the names its build looks for:
//
//   node artwork/export-site.mjs <static folder>      e.g. src/static
//
//   social/og-<pageId>.png, social/og-<pageId>-es.png     link previews (1200 × 630)
//   assets/mac/committed-mac-hero.webp, -es.webp          Mac page hero (16:10, desktop widgets)
//   assets/hero/committed-hero.webp, -es.webp             cross-platform hero on #0E1315
//   assets/hero/committed-hero-transparent.webp, -es      the same on transparency
//   press/committed-press-kit.zip, -es.zip                press kit downloads
//
// Run node artwork/render.mjs and node artwork/presskit.mjs first.

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/page.mjs';
import { OG_PAGES } from './config/jobs.mjs';

const target = process.argv[2];
if (!target) {
  console.error('usage: node artwork/export-site.mjs <static folder>');
  process.exit(1);
}
const OUT = join(ROOT, 'artwork/out');
const put = (from, to, convert) => {
  const src = join(OUT, from);
  if (!existsSync(src)) throw new Error(`missing ${from}: render first`);
  const dest = join(target, to);
  mkdirSync(dirname(dest), { recursive: true });
  if (convert) execFileSync('convert', [src, ...convert, dest]);
  else copyFileSync(src, dest);
  console.log(`${to}`);
};
const suffix = (l) => (l === 'es' ? '-es' : '');
for (const l of ['en', 'es']) {
  for (const id of OG_PAGES) put(`og/${id}-${l}.png`, `social/og-${id}${suffix(l)}.png`);
  put(`mac/desktop-widgets-${l}.png`, `assets/mac/committed-mac-hero${suffix(l)}.webp`, ['-resize', '2400x1500', '-quality', '86', '-strip']);
  put(`web/hero-${l}.png`, `assets/hero/committed-hero${suffix(l)}.webp`, ['-quality', '86', '-strip']);
  put(`web/hero-${l}-transparent.png`, `assets/hero/committed-hero-transparent${suffix(l)}.webp`, ['-quality', '86', '-define', 'webp:alpha-quality=90', '-strip']);
  put(`committed-press-kit${suffix(l)}.zip`, `press/committed-press-kit${suffix(l)}.zip`);
}
