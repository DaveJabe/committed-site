#!/usr/bin/env node
// Assembles the downloadable press kit from the rendered artwork, the app icons and the genuine
// captures, then zips it:
//
//   node artwork/render.mjs && node artwork/presskit.mjs      → artwork/out/press-kit-{en,es}/ and committed-press-kit.zip, committed-press-kit-es.zip
//
// Screenshots are never redrawn here. They are copied from genuine captures only:
//   artwork/captures/studio/{en,es}/NN.png   full-size Screenshot Studio frames (Committed repo:
//                                            scripts/capture-studio-frames.sh), preferred when present
//   src/static/assets/committed-*.webp       the website's current App Store frames (598 × 1300), used
//                                            until full-size captures are added
//   artwork/captures/mac/{en,es}/NN-*.png    the Mac Screenshot Studio frames (2880 × 1800), whole, plus
//                                            the bare app window cut from the frames that allow it

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/page.mjs';
import { WINDOW_FRAMES, macCaptureDir, macCaptures, windowCropArgs } from './lib/captures.mjs';

const OUT = join(ROOT, 'artwork/out');
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'pipe' });
const list = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith('.')).sort() : []);

if (!existsSync(join(OUT, 'report.json'))) {
  console.error('Render first: node artwork/render.mjs');
  process.exit(1);
}
// One kit per language: icons and text-free art in both, screenshots, compositions and fact sheet in its own.
for (const L of ['en', 'es']) {
  const KIT = join(OUT, `press-kit-${L}`);
  rmSync(KIT, { recursive: true, force: true });
  for (const d of ['icons', `screenshots/iphone/${L}`, 'screenshots/apple-watch', 'screenshots/mac', 'artwork', 'fact-sheet']) mkdirSync(join(KIT, d), { recursive: true });

  // Icons: the shipping 1024 masters, the iOS icon as Apple supplies it (square: the system applies the
  // mask) and pre-masked with transparency for print and web, at common sizes.
  const icons = join(ROOT, 'artwork/brand/icons');
  for (const size of [1024, 512, 256, 128]) {
    run('convert', [join(icons, 'ios-1024.png'), '-resize', `${size}x${size}`, '-strip', join(KIT, `icons/committed-icon-square-${size}.png`)]);
    const r = Math.round(size * 0.2237);
    run('convert', [
      join(icons, 'ios-1024.png'), '-resize', `${size}x${size}`, '-alpha', 'set',
      '(', '-size', `${size}x${size}`, 'xc:none', '-fill', 'white', '-draw', `roundrectangle 0,0 ${size - 1},${size - 1} ${r},${r}`, ')',
      '-compose', 'DstIn', '-composite', '-strip', join(KIT, `icons/committed-icon-rounded-${size}.png`),
    ]);
  }
  cpSync(join(icons, 'macos-1024.png'), join(KIT, 'icons/committed-icon-mac-1024.png'));
  run('convert', [
    join(icons, 'watchos-1024.png'), '-alpha', 'set',
    '(', '-size', '1024x1024', 'xc:none', '-fill', 'white', '-draw', 'circle 512,512 512,0', ')',
    '-compose', 'DstIn', '-composite', '-strip', join(KIT, 'icons/committed-icon-watch-1024.png'),
  ]);

  // Screenshots: genuine captures only.
  let iphoneSource = 'website frames (598 × 1300)';
  for (const locale of [L]) {
    const studio = join(ROOT, 'artwork/captures/studio', locale);
    if (list(studio).length) {
      iphoneSource = 'full-size Screenshot Studio captures';
      for (const f of list(studio)) cpSync(join(studio, f), join(KIT, `screenshots/iphone/${locale}/committed-iphone-${f}`));
    } else {
      for (const name of ['matrix', 'sky', 'widgets']) {
        const src = join(ROOT, `src/static/assets/committed-${name}${locale === 'es' ? '-es' : ''}.webp`);
        run('convert', [src, '-strip', join(KIT, `screenshots/iphone/${locale}/committed-iphone-${name}.png`)]);
      }
    }
  }
  run('convert', [join(ROOT, 'src/static/assets/committed-watch-1440.webp'), '-strip', join(KIT, 'screenshots/apple-watch/committed-apple-watch-photo.jpg')]);
  // Mac: the App Store frames as they are, and the window alone (no headline) where it can be cut out.
  const mac = macCaptures(L);
  if (mac.length) mkdirSync(join(KIT, 'screenshots/mac/window'), { recursive: true });
  for (const f of mac) {
    const src = join(macCaptureDir(L), f);
    cpSync(src, join(KIT, `screenshots/mac/committed-mac-${f}`));
    if (WINDOW_FRAMES.includes(f.replace(/\.png$/, ''))) run('convert', [...windowCropArgs(src, { transparent: true }), '-strip', join(KIT, `screenshots/mac/window/committed-mac-window-${f}`)]);
  }

  // Artwork: the text-free key art plus the cross-platform and widget compositions.
  const art = [
    'editorial/field.png', 'editorial/sky.png', 'editorial/newyear.png',
    `editorial/glance-${L}.png`, `editorial/everywhere-${L}.png`,
    `web/hero-${L}.png`, `web/hero-${L}-transparent.png`,
    `mac/desktop-widgets-${L}.png`,
    `social/landscape/glance-${L}.png`, `social/landscape/field-${L}.png`, `social/landscape/sky-${L}.png`,
  ];
  // Opaque pieces go out as high-quality JPEG (what editors expect, and a tenth of the PNG's size: the
  // film grain does not compress losslessly); transparent ones stay PNG.
  for (const a of art) {
    const name = `committed-${a.replace(/\//g, '-')}`;
    if (a.includes('transparent')) cpSync(join(OUT, a), join(KIT, 'artwork', name));
    else run('convert', [join(OUT, a), '-quality', '90', '-sampling-factor', '4:4:4', '-strip', join(KIT, 'artwork', name.replace(/\.png$/, '.jpg'))]);
  }

  cpSync(join(ROOT, `artwork/press/fact-sheet-${L}.md`), join(KIT, `fact-sheet/committed-${L === 'es' ? 'ficha' : 'fact-sheet'}-${L}.md`));

  writeFileSync(
    join(KIT, 'README.txt'),
    `Committed press kit / Kit de prensa

  fact-sheet/    Descriptions, facts, pricing, platforms, recent releases (English and Spanish)
  icons/         App icon: square master (Apple applies the mask), pre-masked with transparency, Mac and Apple Watch
  screenshots/   Genuine captures of the app. iPhone: ${iphoneSource}. Apple Watch: a photo of the watch face complication.${mac.length ? ' Mac: the App Store frames (2880 × 1800), and in mac/window/ the app window alone, on transparency.' : ''}
  artwork/       Key art and compositions drawn from the app's own designs (widgets, Matrix, Your Sky). "editorial" pieces carry no text.

  Everything shows synthetic demonstration data, never a real person's information.
  Todo muestra datos de demostración ficticios, nunca información de una persona real.

  Website: https://committedtracker.app
  App Store: https://apps.apple.com/app/id6783140621
  `.replace(/^  /gm, '')
  );

  const zip = join(OUT, `committed-press-kit${L === 'es' ? '-es' : ''}.zip`);
  rmSync(zip, { force: true });
  execFileSync('zip', ['-qrX', zip, `press-kit-${L}`], { cwd: OUT });
  console.log(`press kit (${L}): ${zip}`);
}
