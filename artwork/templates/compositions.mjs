// The creative directions. Each direction is a full-bleed background plus one key visual; a shared
// layout places the visual and the words inside the spec's safe area (or a margin), so one direction
// looks the same on a 5K App Store canvas, an Open Graph card and an Instagram story.
//
//   field       Every day counts.          The Matrix: four years of dots, the milestones in dawn.
//   sky         Look how far you've come.  Your Sky: the constellation climbing out of the night.
//   glance      Progress at a glance.      The widgets, front and centre, across the themes.
//   everywhere  With you everywhere.       iPhone Home Screen, Mac desktop widgets, Apple Watch.
//   newyear     A new year, day by day.    365 dots for the year ahead, day one lit.
//
// App Store creative assets get `short` copy: one short phrase, no eyebrow (Apple: "a short phrase that
// enhances your visual rather than describes it"; no prices, URLs or other platforms).

import { emphasize, escapeHTML as e } from '../config/strings.mjs';
import { atmosphere, grain, matrixField, widgetCluster, homeScreen, macDesktop, macDesktopHeight, phone, watch, watchDetail, appIcon, wordmark } from './scenes.mjs';
import { constellation, constellationSky, starfield, skyGround, mix } from '../lib/viz.mjs';
import { phoneHeight } from '../lib/devices.mjs';

const at = (x, y, html, extra = '') => `<div class="abs" style="left:${x}px;top:${y}px;${extra}">${html}</div>`;

/** The rectangle key content must live in: the spec's safe area, or the canvas less a margin. */
function frameRect(ctx) {
  const { width: W, height: H, safe } = ctx;
  if (safe) return { x: safe[0], y: safe[1], w: safe[2], h: safe[3] };
  const m = Math.round(Math.min(W, H) * 0.075);
  return { x: m, y: m, w: W - 2 * m, h: H - 2 * m };
}

function shape(r) {
  const a = r.w / r.h;
  return a >= 1.55 ? 'wide' : a >= 1.12 ? 'landscape' : a >= 0.85 ? 'square' : 'portrait';
}

/** px for `pt` at the spec's display width: the legibility floor every caption is sized from. */
const pxFor = (ctx, pt) => (ctx.spec.display ? (pt * ctx.width) / ctx.spec.display : pt);

/**
 * The words. `short` → one phrase; otherwise eyebrow + headline. Sized so the smallest line clears the
 * spec's minimum at its display size with 25% to spare, and never smaller than `fraction` of the frame.
 */
function words(ctx, dir, { width, align = 'left', fraction }) {
  const { s } = ctx;
  const r = frameRect(ctx);
  const min = (ctx.spec.minTextPt ?? 8) * 1.25;
  // Never so large that the longest word cannot fit on a line (Geist semibold ≈ 0.58 em per letter).
  const longest = (key) => Math.max(...s.t(key).replace(/\*\*/g, '').split(/\s+/).map((w) => w.length));
  const fits = (key) => width / (longest(key) * 0.58);
  if (ctx.short) {
    const size = Math.min(fits(`${dir}.short`), Math.max(pxFor(ctx, min), Math.min(r.w, r.h * 1.6) * fraction));
    return {
      size,
      html: `<div data-key="caption" style="width:${width}px;text-align:${align}"><div class="headline" style="font-size:${size}px;line-height:1.04;letter-spacing:${-size * 0.024}px">${emphasize(s.t(`${dir}.short`))}</div></div>`,
    };
  }
  const size = Math.min(fits(`${dir}.headline`), Math.max(pxFor(ctx, min) / 0.3, Math.min(r.w, r.h * 1.6) * fraction));
  const eyebrow = Math.max(size * 0.3, pxFor(ctx, min));
  return {
    size,
    html: `<div data-key="caption" style="width:${width}px;text-align:${align}">
      <div class="eyebrow" style="font-size:${eyebrow}px;letter-spacing:${size * 0.03}px;margin-bottom:${size * 0.28}px">${e(s.t(`${dir}.eyebrow`))}</div>
      <div class="headline" style="font-size:${size}px;line-height:1.05;letter-spacing:${-size * 0.022}px">${emphasize(s.t(`${dir}.headline`))}</div></div>`,
  };
}

/**
 * Words beside (wide) or above (otherwise) a visual, both inside the frame. `visual(box)` returns
 * HTML laid out in a box of { w, h } and reports the size it actually used.
 */
function layout(ctx, dir, visual, { textShare = 0.38, align } = {}) {
  const r = frameRect(ctx);
  const sh = shape(r);
  let html = '';
  if (!ctx.text) {
    const v = visual({ w: r.w, h: r.h });
    return at(r.x + (r.w - v.w) / 2, r.y + (r.h - v.h) / 2, v.html);
  }
  if (sh === 'wide') {
    // Social posts carry an eyebrow and a full headline: give the words more of the width.
    const textW = r.w * (ctx.short ? textShare : Math.max(textShare, 0.46));
    const gap = r.w * 0.05;
    const t = words(ctx, dir, { width: textW, fraction: ctx.short ? 0.075 : 0.05 });
    const v = visual({ w: r.w - textW - gap, h: r.h });
    const block = textW + gap + v.w;
    const x0 = r.x + (r.w - block) / 2;
    html += `<div class="abs" style="left:${x0}px;top:${r.y}px;height:${r.h}px;display:flex;align-items:center">${t.html}</div>`;
    html += at(x0 + textW + gap, r.y + (r.h - v.h) / 2, v.html);
  } else {
    const t = words(ctx, dir, { width: r.w, align: align ?? 'center', fraction: ctx.short ? 0.1 : 0.085 });
    const lines = Math.ceil((ctx.s.t(ctx.short ? `${dir}.short` : `${dir}.headline`).length * t.size * 0.52) / r.w);
    const textH = t.size * (1.08 * lines + (ctx.short ? 0 : 0.6)) + t.size * 0.5;
    const v = visual({ w: r.w, h: r.h - textH });
    html += at(r.x, r.y, t.html);
    html += at(r.x + (r.w - v.w) / 2, r.y + textH + (r.h - textH - v.h) / 2, v.html);
  }
  return html;
}

// MARK: - Field (Every day counts)

export function field(ctx) {
  const { width: W, height: H, palette, commitments } = ctx;
  const [alcohol] = commitments;
  const r = frameRect(ctx);
  const cell = Math.max(12, Math.min(W, H) / 28);
  let html = `<div class="abs" style="inset:0;background:${palette.bg}"></div>`;
  html += matrixField(alcohol, palette, { width: W, height: H, cell, opacity: 0.92 });
  if (!ctx.text) return html;
  // The words sit centred on a pool of background, so the dots fall away around them.
  const t = words(ctx, 'field', { width: Math.min(r.w, ctx.short ? r.w * 0.9 : r.w * 0.86), align: 'center', fraction: ctx.short ? 0.085 : 0.075 });
  html += `<div class="abs" style="inset:0;background:radial-gradient(${r.w * 0.62}px ${Math.max(r.h * 0.5, t.size * 2.4)}px at ${r.x + r.w / 2}px ${r.y + r.h / 2}px, ${palette.bg} 50%, ${palette.bg}00 100%)"></div>`;
  html += `<div class="abs" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;display:flex;align-items:center;justify-content:center">${t.html}</div>`;
  return html;
}

// MARK: - Sky (Look how far you've come)

export function sky(ctx) {
  const { width: W, height: H, palette, commitments } = ctx;
  const [alcohol] = commitments;
  const ground = skyGround(palette.accent);
  let html = `<div class="abs" style="inset:0;background:radial-gradient(130% 90% at 70% 10%, ${mix(ground, palette.accent, 0.1)} 0%, ${ground} 45%, ${palette.bgDeep} 100%)"></div>`;
  html += grain(0.06);
  html += `<div class="abs" style="inset:0">${starfield({ width: W, height: H, count: Math.round((W * H) / 8000), color: '#E9ECF3', seed: 11, maxR: Math.max(1.2, W / 1600) })}</div>`;
  const sky = constellationSky(alcohol);
  html += layout(ctx, 'sky', (box) => {
    const w = Math.min(box.w, box.h * 1.5);
    const h = Math.min(box.h, w / 1.2);
    const k = Math.min(w, h) / 120;
    return { w, h, html: `<div data-key="sky" style="width:${w}px;height:${h}px">${constellation({ sky, width: w, height: h, accent: palette.accent, k })}</div>` };
  }, { textShare: 0.4 });
  return html;
}

// MARK: - Glance (Progress at a glance): widget-forward

const THEMES = ['mint', 'sea', 'amethyst', 'copper', 'moss', 'rose'];

function clusterVisual(ctx, box) {
  const { s, palettes, commitments } = ctx;
  const themes = THEMES.map((id) => palettes[id]);
  const kind = box.w / box.h >= 2.6 ? 'wide' : box.w / box.h >= 1.1 ? 'pair' : 'stack';
  const probe = widgetCluster({ commitments, palettes: themes, s, scale: 1, layout: kind });
  const scale = Math.min(box.w / probe.width, box.h / probe.height);
  const c = widgetCluster({ commitments, palettes: themes, s, scale, layout: kind });
  return { w: c.width, h: c.height, html: c.html };
}

export function glance(ctx) {
  const { width: W, height: H } = ctx;
  let html = atmosphere(ctx.palette, { strength: 1.2 });
  // Auxiliary art: a faint field of specks, the widgets' night sky stretched across the canvas.
  html += `<div class="abs" style="inset:0;opacity:.55">${starfield({ width: W, height: H, count: Math.round((W * H) / 14000), color: '#E9ECF3', seed: 5, maxR: Math.max(1.2, W / 1800) })}</div>`;
  html += layout(ctx, 'glance', (box) => clusterVisual(ctx, box), { textShare: ctx.short ? 0.34 : 0.3 });
  return html;
}

// MARK: - Everywhere (With you everywhere)

function devicesVisual(ctx, box) {
  const { s, palette, commitments, assets, locale } = ctx;
  const [alcohol] = commitments;
  const macW = 1000;
  const macH = macDesktopHeight(macW);
  const phW = 300;
  const phH = phoneHeight(phW);
  const wW = 170;
  const wH = 292 * (wW / 252);
  const groupW = macW + phW * 0.55 + wW * 0.62;
  const groupH = Math.max(macH + 70, phH);
  const k = Math.min(box.w / groupW, box.h / groupH);
  const home = homeScreen({ commitments, palette, s, iconSrc: assets.icon, locale });
  let html = at(0, (groupH - macH) * k * 0.3, macDesktop({ width: macW * k, commitments, palette, s }));
  html += at((macW - phW * 0.45) * k, (groupH - phH) * k, phone({ width: phW * k, inner: home }));
  html += at((groupW - wW) * k, (groupH - wH - 12) * k, watch({ width: wW * k, inner: watchDetail(alcohol, palette, s) }));
  return { w: groupW * k, h: groupH * k, html: `<div style="position:relative;width:${groupW * k}px;height:${groupH * k}px">${html}</div>` };
}

export function everywhere(ctx) {
  const { width: W, height: H, palette, commitments } = ctx;
  let html = atmosphere(palette, { strength: 1 });
  // Auxiliary art: the Matrix, very faint, behind the devices.
  html += `<div class="abs" style="inset:0;opacity:.14">${matrixField(commitments[0], palette, { width: W, height: H, cell: Math.max(12, Math.min(W, H) / 30) })}</div>`;
  html += layout(ctx, 'everywhere', (box) => devicesVisual(ctx, box), { textShare: ctx.short ? 0.4 : 0.3 });
  return html;
}

// MARK: - New Year (seasonal): a year of dots, day one lit

export function newyear(ctx) {
  const { palette } = ctx;
  let html = atmosphere(palette, { strength: 1.4 });
  html += layout(ctx, 'newyear', (box) => {
    const a = box.w / box.h;
    const cols = a >= 2.4 ? 37 : a >= 1.5 ? 31 : a >= 1.1 ? 25 : a >= 0.8 ? 19 : 15;
    const rows = Math.ceil(365 / cols);
    const sp = Math.min(box.w / cols, box.h / rows);
    const r = sp * 0.21;
    let dots = '';
    for (let i = 1; i < 365; i++) dots += `<circle cx="${((i % cols) + 0.5) * sp}" cy="${(Math.floor(i / cols) + 0.5) * sp}" r="${r}"/>`;
    const ring = Math.min(Math.max(3, sp * 0.32) + 4, sp * 0.5);
    const w = cols * sp;
    const h = rows * sp;
    return {
      w,
      h,
      html: `<svg data-key="year" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block"><g fill="${palette.ink}" fill-opacity=".2">${dots}</g>
        <circle cx="${sp / 2}" cy="${sp / 2}" r="${ring - 0.5}" fill="none" stroke="${palette.accent}" stroke-opacity=".55" stroke-width="${Math.max(1, sp * 0.03)}"/>
        <circle cx="${sp / 2}" cy="${sp / 2}" r="${Math.max(ring * 0.58, r * 1.3)}" fill="${palette.accent}"/></svg>`,
    };
  }, { textShare: 0.36 });
  return html;
}

// MARK: - Open Graph card: one per site page

const OG_VISUAL = {
  calculator: 'matrix', product: 'everywhere', iphone: 'phone', mac: 'mac', watch: 'watch', widgets: 'widgets',
  'whats-new': 'sky', about: 'matrix', press: 'everywhere', tools: 'matrix', 'progress-image': 'sky',
  milestones: 'matrix', countdown: 'year', 'money-saved': 'matrix',
};

export function og(ctx) {
  const { width: W, height: H, s, palette, commitments, assets, page: pageId, locale } = ctx;
  const [alcohol] = commitments;
  const visual = OG_VISUAL[pageId];
  // No grain at link-preview size: banding is invisible there and grain triples the file.
  let html = atmosphere(palette, { strength: 1.1, grained: false });
  const pad = 64;
  const textW = 560;
  html += at(pad, pad, `<div style="display:flex;align-items:center;gap:16px">${appIcon(assets.icon, 56)}${wordmark(20, 'color:var(--ink)')}</div>`);
  html += at(pad, 190, `<div data-key="caption" style="width:${textW}px">
    <div class="headline" style="font-size:58px;line-height:1.04;letter-spacing:-1.3px">${e(s.t(`og.${pageId}`))}</div>
    <div class="sub" style="font-size:28px;line-height:1.3;margin-top:22px">${e(s.t(`og.${pageId}.sub`))}</div></div>`);
  html += at(pad, H - pad - 22, `<div class="wordmark" style="font-size:18px;letter-spacing:2px;color:var(--inkFaint)">${e(s.t('claim.platforms'))}</div>`);
  const vx = pad + textW + 40;
  const vw = W - vx;
  if (visual === 'matrix') {
    html += `<div class="abs" style="left:${vx}px;top:0;width:${vw}px;height:${H}px;overflow:hidden">${matrixField(alcohol, palette, { width: vw, height: H, cell: 17, margin: 24 })}</div>`;
  } else if (visual === 'sky') {
    const sky = constellationSky(alcohol);
    html += `<div class="abs" style="left:${vx - 40}px;top:0;width:${vw + 40}px;height:${H}px;overflow:hidden;background:radial-gradient(90% 90% at 70% 30%, ${skyGround(palette.accent)} 0%, transparent 75%)">
      ${starfield({ width: vw + 40, height: H, count: 160, color: '#E9ECF3', seed: 13 })}</div>`;
    html += at(vx, 60, constellation({ sky, width: vw - 40, height: H - 120, accent: palette.accent, k: 3.2 }));
  } else if (visual === 'year') {
    const cols = 15;
    const sp = Math.min((vw - 60) / cols, (H - 120) / Math.ceil(365 / cols));
    let dots = '';
    for (let i = 1; i < 365; i++) dots += `<circle cx="${((i % cols) + 0.5) * sp}" cy="${(Math.floor(i / cols) + 0.5) * sp}" r="${sp * 0.21}"/>`;
    const w = cols * sp;
    const h = Math.ceil(365 / cols) * sp;
    html += at(vx + (vw - w) / 2, (H - h) / 2, `<svg width="${w}" height="${h}"><g fill="${palette.ink}" fill-opacity=".2">${dots}</g><circle cx="${sp / 2}" cy="${sp / 2}" r="${sp * 0.45}" fill="none" stroke="${palette.accent}" stroke-opacity=".55"/><circle cx="${sp / 2}" cy="${sp / 2}" r="${sp * 0.26}" fill="${palette.accent}"/></svg>`);
  } else if (visual === 'phone') {
    const pw = 300;
    html += at(vx + (vw - pw) / 2, 70, phone({ width: pw, inner: homeScreen({ commitments, palette, s, iconSrc: assets.icon, locale }) }));
  } else if (visual === 'mac') {
    const mw = 760;
    html += at(vx + 10, (H - macDesktopHeight(mw)) / 2, macDesktop({ width: mw, commitments, palette, s }));
  } else if (visual === 'watch') {
    const ww = 290;
    html += at(vx + (vw - ww) / 2 - 20, (H - 292 * (ww / 252)) / 2, watch({ width: ww, inner: watchDetail(alcohol, palette, s) }));
  } else if (visual === 'widgets') {
    const v = clusterVisual(ctx, { w: vw - 50, h: H - 120 });
    html += at(vx + (vw - v.w) / 2 - 10, (H - v.h) / 2, v.html);
  } else {
    const v = devicesVisual(ctx, { w: vw + 140, h: H - 60 });
    html += at(vx - 10, (H - v.h) / 2 + 20, v.html);
  }
  return html;
}

// MARK: - Website hero: widget-forward, cross-platform, no words (the page sets its own headline)

export function hero(ctx) {
  let html = ctx.transparent ? '' : `<div class="abs" style="inset:0;background:${ctx.palette.bg}"></div>`;
  const pad = 40;
  const v = devicesVisual(ctx, { w: ctx.width - 2 * pad, h: ctx.height - 2 * pad });
  html += at((ctx.width - v.w) / 2, (ctx.height - v.h) / 2, v.html);
  return html;
}

// MARK: - Mac desktop artwork: the desktop widgets, full-bleed

export function macdesktop(ctx) {
  const { width: W, s, palette, commitments } = ctx;
  return `<div data-key="desktop" class="abs" style="inset:0">${macDesktop({ width: W, commitments, palette, s, bare: true })}</div>`;
}
