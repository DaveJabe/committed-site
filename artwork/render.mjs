#!/usr/bin/env node
// Committed's promotional artwork renderer.
//
//   node artwork/render.mjs                     render everything into artwork/out/
//   node artwork/render.mjs --only og/          render the jobs whose id contains "og/"
//   node artwork/render.mjs --out /some/folder  render somewhere else
//   node artwork/render.mjs --verify            render each job twice and fail if any pixel differs
//
// Deterministic: fonts are embedded, the network is blocked, animation is off, the demo data is
// measured from one fixed date (config/demo.mjs) and every "random" placement is seeded. The same
// commit renders the same bytes on any machine with this Chromium.
//
// Every job is checked before it is written: exact pixel size, no alpha where Apple forbids it, key
// elements inside the spec's safe area, and headline text large enough to read at the size the asset
// is actually shown. A failed check fails the run. Results go to out/report.json and out/index.html.

import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

import { page as shell, ROOT } from './lib/page.mjs';
import { deviceCSS } from './lib/devices.mjs';
import { resolveCommitment, day } from './lib/model.mjs';
import { strings } from './config/strings.mjs';
import { SPECS } from './config/specs.mjs';
import { AS_OF, COMMITMENTS } from './config/demo.mjs';
import { jobs as allJobs } from './config/jobs.mjs';
import * as compositions from './templates/compositions.mjs';

// Playwright is resolved like `require` so a globally installed copy works without a package.json install.
const { chromium } = createRequire(import.meta.url)('playwright');

const palettesFile = JSON.parse(readFileSync(join(ROOT, 'artwork/config/palettes.json'), 'utf8'));
const PALETTES = palettesFile.palettes;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const OUT = value('--out') ?? join(ROOT, 'artwork/out');
const only = value('--only');
const verify = flag('--verify');

const dataURL = (path, type) => `data:${type};base64,${readFileSync(join(ROOT, path)).toString('base64')}`;
const ASSETS = { icon: dataURL('src/static/icon-1024.png', 'image/png') };

function build(job) {
  const spec = SPECS[job.spec];
  if (!spec) throw new Error(`${job.id}: unknown spec ${job.spec}`);
  const s = strings(job.locale);
  const palette = PALETTES[job.palette];
  const asOf = day(AS_OF);
  const commitments = COMMITMENTS.map((c) => resolveCommitment(c, asOf, s));
  const compose = compositions[job.composition];
  if (!compose) throw new Error(`${job.id}: unknown composition ${job.composition}`);
  const ctx = {
    width: spec.width,
    height: spec.height,
    safe: spec.safe,
    spec,
    s,
    locale: job.locale,
    palette,
    palettes: PALETTES,
    commitments,
    assets: ASSETS,
    page: job.page,
    text: job.text ?? true,
    short: job.spec.startsWith('appStore') || job.spec === 'inAppEventCard',
    transparent: !!job.transparent,
  };
  const body = compose(ctx);
  return { spec, html: shell({ width: spec.width, height: spec.height, palette, css: deviceCSS, body, transparent: !!job.transparent, lang: job.locale }) };
}

/** In-page checks: fonts loaded, key elements inside the safe area, smallest headline text at display size. */
async function inspect(page, spec) {
  return page.evaluate(({ safe, display, width }) => {
    const fonts = ['Geist', 'Inter', 'Inter Display'].map((f) => [f, document.fonts.check(`16px "${f}"`)]);
    const outside = [];
    if (safe) {
      const [sx, sy, sw, sh] = safe;
      for (const el of document.querySelectorAll('[data-key]')) {
        const r = el.getBoundingClientRect();
        if (r.left < sx - 1 || r.top < sy - 1 || r.right > sx + sw + 1 || r.bottom > sy + sh + 1) {
          outside.push({ key: el.dataset.key, rect: [r.left, r.top, r.width, r.height].map(Math.round) });
        }
      }
    }
    // Smallest text, in points at the display width, inside captions (failing) and anywhere (reported).
    let captionMin = Infinity;
    let anyMin = Infinity;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;
      const el = node.parentElement;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      if (!rect.width) continue;
      const scale = el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1;
      const px = parseFloat(getComputedStyle(el).fontSize) * scale;
      const pt = display ? (px * display) / width : px;
      anyMin = Math.min(anyMin, pt);
      if (el.closest('[data-key="caption"]')) captionMin = Math.min(captionMin, pt);
    }
    // Words that overflow their box (a long Spanish word that will not wrap, say).
    const overflow = [...document.querySelectorAll('[data-key="caption"], [data-key="caption"] *')]
      .filter((el) => el.scrollWidth > el.clientWidth + 1)
      .map((el) => el.textContent.trim().slice(0, 40));
    return { fonts, outside, captionMin, anyMin, overflow };
  }, { safe: spec.safe ?? null, display: spec.display ?? null, width: spec.width });
}

function identify(file) {
  const out = execFileSync('identify', ['-format', '%w %h %[channels] %[opaque]', file]).toString().trim();
  const [w, h, channels, opaque] = out.split(' ');
  return { width: +w, height: +h, channels, opaque: opaque === 'True' || opaque === 'true' };
}

async function renderOne(browser, job) {
  const { spec, html } = build(job);
  const context = await browser.newContext({ viewport: { width: spec.width, height: spec.height }, deviceScaleFactor: 1 });
  await context.route('**/*', (route) => (route.request().url().startsWith('data:') ? route.continue() : route.abort()));
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() =>
    Promise.all(['300 16px Inter', '400 16px Inter', '600 16px Inter', '300 16px "Inter Display"', '400 16px Geist', '600 16px Geist'].map((f) => document.fonts.load(f)))
  );
  await page.evaluate(() => document.fonts.ready);
  const checks = await inspect(page, spec);
  const png = await page.screenshot({ type: 'png', omitBackground: !!job.transparent, fullPage: false });
  await context.close();
  return { spec, png, checks };
}

function finish(job, spec, png, checks) {
  const file = join(OUT, job.id);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
  // Apple rejects alpha channels: flatten to RGB for every spec that forbids alpha.
  if (spec.alpha === false || (!job.transparent && spec.alpha !== false)) {
    execFileSync('convert', [file, '-background', '#000', '-alpha', 'remove', '-alpha', 'off', '-strip', `PNG24:${file}`]);
  } else {
    execFileSync('convert', [file, '-strip', `PNG32:${file}`]);
  }
  const info = identify(file);
  const problems = [];
  if (info.width !== spec.width || info.height !== spec.height) problems.push(`size ${info.width}×${info.height}, expected ${spec.width}×${spec.height}`);
  if (spec.alpha === false && info.channels.includes('a')) problems.push('has an alpha channel');
  for (const [f, ok] of checks.fonts) if (!ok) problems.push(`font ${f} did not load`);
  for (const o of checks.overflow) problems.push(`caption overflows its box: "${o}"`);
  for (const o of checks.outside) problems.push(`"${o.key}" outside the safe area at ${o.rect.join(',')}`);
  if (spec.minTextPt && checks.captionMin < spec.minTextPt) problems.push(`caption text ${checks.captionMin.toFixed(1)} pt at display size, minimum ${spec.minTextPt} pt`);
  const bytes = readFileSync(file);
  return {
    id: job.id,
    use: job.use,
    spec: job.spec,
    specLabel: spec.label,
    locale: job.locale,
    composition: job.composition,
    provenance: job.provenance,
    width: info.width,
    height: info.height,
    alpha: info.channels.includes('a'),
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    captionMinPt: Number.isFinite(checks.captionMin) ? +checks.captionMin.toFixed(1) : null,
    smallestTextPt: Number.isFinite(checks.anyMin) ? +checks.anyMin.toFixed(1) : null,
    problems,
  };
}

async function main() {
  const list = allJobs().filter((j) => !only || j.id.includes(only));
  const browser = await chromium.launch();
  const results = [];
  for (const job of list) {
    const { spec, png, checks } = await renderOne(browser, job);
    if (verify) {
      const again = await renderOne(browser, job);
      if (!again.png.equals(png)) {
        results.push({ id: job.id, problems: ['not deterministic: a second render differs'] });
        continue;
      }
    }
    const r = finish(job, spec, png, checks);
    results.push(r);
    console.log(`${r.problems.length ? '✗' : '✓'} ${r.id}  ${r.width}×${r.height}  ${(r.bytes / 1024).toFixed(0)} KB${r.problems.length ? '  ' + r.problems.join('; ') : ''}`);
  }
  await browser.close();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'report.json'), JSON.stringify({ asOf: AS_OF, results }, null, 2) + '\n');
  writeFileSync(join(OUT, 'index.html'), contactSheet(results));
  const failed = results.filter((r) => r.problems.length);
  console.log(`\n${results.length - failed.length}/${results.length} passed. Report: ${relative(process.cwd(), join(OUT, 'index.html'))}`);
  if (failed.length) process.exit(1);
}

function contactSheet(results) {
  const rows = results
    .map(
      (r) => `<figure class="${r.problems?.length ? 'bad' : ''}"><a href="${r.id}"><img src="${r.id}" loading="lazy" alt=""></a>
      <figcaption><b>${r.id}</b><br>${r.width}×${r.height} · ${r.locale} · ${r.provenance} · ${(r.bytes / 1024).toFixed(0)} KB${r.captionMinPt ? ` · headline ${r.captionMinPt} pt shown` : ''}<br><span>${r.use ?? ''}</span>${r.problems?.length ? `<br><em>${r.problems.join('<br>')}</em>` : ''}</figcaption></figure>`
    )
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><title>Committed artwork</title><style>
body{margin:0;padding:32px;background:#0E1315;color:#ECEFF0;font:14px/1.4 system-ui}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:28px}
img{width:100%;height:220px;object-fit:contain;background:repeating-conic-gradient(#181E21 0 25%,#21282B 0 50%) 0 0/16px 16px;border-radius:8px}
figcaption{margin-top:8px;color:#9AA3A6}b{color:#ECEFF0}em{color:#F2A0A0;font-style:normal}.bad img{outline:2px solid #F2A0A0}
</style><h1>Committed artwork · as of ${AS_OF}</h1><main>${rows}</main>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
