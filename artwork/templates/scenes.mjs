// Reusable scenes: the pieces every composition is built from. Each returns HTML sized in CSS px.

import { escapeHTML as e } from '../config/strings.mjs';
import { phone, macWindow, watch, watchDetail } from '../lib/devices.mjs';
import { constellationWidget, numeralWidget, chronicleWidget, WIDGET_SIZES } from '../lib/widgets.mjs';
import { matrix, constellation, constellationSky, starfield, skyGround, mix } from '../lib/viz.mjs';

/**
 * Fine film grain over dark gradients: without it an 8-bit PNG of a slow dark gradient bands into
 * visible rings. feTurbulence with a fixed seed is deterministic.
 */
export function grain(opacity = 0.045) {
  return `<svg class="abs" style="inset:0;width:100%;height:100%;opacity:${opacity}" aria-hidden="true">
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#grain)"/></svg>`;
}

/** The app's home atmosphere: a dawn glow rising from the bottom horizon (AtmosphereBackground). */
export function atmosphere(palette, { strength = 1, horizon = 100, grained = true } = {}) {
  return `<div class="abs" style="inset:0;background:
    radial-gradient(120% 60% at 50% ${horizon + 8}%, ${palette.dawn}${alpha(0.16 * strength)} 0%, transparent 60%),
    radial-gradient(90% 50% at 50% ${horizon + 2}%, ${palette.accent}${alpha(0.1 * strength)} 0%, transparent 70%),
    linear-gradient(${palette.bgDeep}, ${palette.bg})"></div>${grained ? grain() : ''}`;
}

export function alpha(a) {
  return Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, '0');
}

/** A full-bleed Matrix field for `c`, drawn so each dot is about `cell` px apart. */
export function matrixField(c, palette, { width, height, cell, margin = 0, opacity = 1, style = '' }) {
  const { svg } = matrix({
    width,
    height,
    dayCount: c.dayCount,
    milestoneDays: c.milestoneDays,
    palette,
    scale: cell / 30,
    margin,
    legible: 0,
  });
  return `<div class="abs" style="left:0;top:0;width:${width}px;height:${height}px;opacity:${opacity};${style}">${svg}</div>`;
}

/** A poster-scale night sky: the widget's constellation geometry over a seeded speck field. */
export function skyScene(c, palette, { width, height, k, specks = 900, seed = 11 }) {
  const sky = constellationSky(c);
  const ground = skyGround(palette.accent);
  return `<div class="abs" style="inset:0;background:radial-gradient(130% 90% at 70% 10%, ${mix(ground, palette.accent, 0.08)} 0%, ${ground} 45%, ${palette.bgDeep} 100%)"></div>
  <div class="abs" style="inset:0">${starfield({ width, height, count: specks, color: '#E9ECF3', seed })}</div>
  <div class="abs" style="inset:0">${constellation({ sky, width, height, accent: palette.accent, k })}</div>`;
}

/** Caption block: eyebrow + headline (+ optional sub), sized from the headline's px size. */
export function caption({ s, eyebrowKey, headlineKey, sub, size, align = 'left', width, emphasize, key = 'caption', color }) {
  const eyebrow = eyebrowKey ? `<div class="eyebrow" style="font-size:${size * 0.24}px;letter-spacing:${size * 0.03}px;margin-bottom:${size * 0.3}px">${e(s.t(eyebrowKey))}</div>` : '';
  const sb = sub ? `<div class="sub" style="font-size:${size * 0.36}px;line-height:1.35;margin-top:${size * 0.32}px">${e(sub)}</div>` : '';
  return `<div data-key="${key}" style="width:${width}px;text-align:${align};${color ? `color:${color}` : ''}">${eyebrow}
    <div class="headline" style="font-size:${size}px;line-height:1.06;letter-spacing:${-size * 0.022}px">${emphasize(s.t(headlineKey))}</div>${sb}</div>`;
}

export function wordmark(size, extra = '') {
  return `<div class="wordmark" style="font-size:${size}px;letter-spacing:${size * 0.24}px;${extra}">Committed</div>`;
}

/** The app icon (from the app's asset catalog, via the capture manifest), masked to the iOS shape. */
export function appIcon(src, size, extra = '') {
  return `<img src="${src}" alt="" style="width:${size}px;height:${size}px;border-radius:${size * 0.2237}px;display:block;${extra}">`;
}

/** A tidy cluster of Home Screen widgets, `scale`× their point size. Returns { html, width, height }. */
export function widgetCluster({ commitments, palettes, s, scale, gap = 22, layout = 'wide' }) {
  const [alcohol, nicotine, sugar] = commitments;
  const P = palettes;
  const W = (html, w, h) => `<div style="width:${w * scale}px;height:${h * scale}px;flex:none"><div style="transform-origin:0 0;transform:scale(${scale})">${html}</div></div>`;
  const [sw, sh] = WIDGET_SIZES.small;
  const [mw, mh] = WIDGET_SIZES.medium;
  const [lw, lh] = WIDGET_SIZES.large;
  const g = gap * scale;
  if (layout === 'wide') {
    // Large constellation · [medium numeral / two smalls] · [two smalls / medium constellation]
    const col2 = `<div style="display:flex;flex-direction:column;gap:${g}px">
      ${W(numeralWidget(sugar, 'medium', P[0], s), mw, mh)}
      <div style="display:flex;gap:${g}px">${W(chronicleWidget(alcohol, P[1], s, 'auto'), sw, sh)}${W(numeralWidget(nicotine, 'small', P[2], s), sw, sh)}</div></div>`;
    const col3 = `<div style="display:flex;flex-direction:column;gap:${g}px">
      <div style="display:flex;gap:${g}px">${W(constellationWidget(sugar, 'small', P[3], s), sw, sh)}${W(numeralWidget(alcohol, 'small', P[4], s, 'auto'), sw, sh)}</div>
      ${W(constellationWidget(alcohol, 'medium', P[5], s), mw, mh)}</div>`;
    const html = `<div data-key="widgets" style="display:flex;gap:${g}px;align-items:flex-start">${W(constellationWidget(nicotine, 'large', P[0], s), lw, lh)}${col2}${col3}</div>`;
    return { html, width: (lw + 2 * mw) * scale + 2 * g, height: lh * scale };
  }
  if (layout === 'pair') {
    const html = `<div data-key="widgets" style="display:flex;gap:${g}px;align-items:flex-start">${W(constellationWidget(nicotine, 'large', P[0], s), lw, lh)}
      <div style="display:flex;flex-direction:column;gap:${g}px">${W(numeralWidget(sugar, 'medium', P[0], s), mw, mh)}
      <div style="display:flex;gap:${g}px">${W(chronicleWidget(alcohol, P[0], s, 'auto'), sw, sh)}${W(constellationWidget(sugar, 'small', P[0], s), sw, sh)}</div></div></div>`;
    return { html, width: (lw + mw) * scale + g, height: lh * scale };
  }
  // 'stack': medium over two smalls (phone column)
  const html = `<div data-key="widgets" style="display:flex;flex-direction:column;gap:${g}px">${W(constellationWidget(nicotine, 'medium', P[0], s), mw, mh)}
    <div style="display:flex;gap:${g}px">${W(numeralWidget(sugar, 'small', P[0], s), sw, sh)}${W(chronicleWidget(alcohol, P[0], s, 'auto'), sw, sh)}</div></div>`;
  return { html, width: mw * scale, height: (mh + sh) * scale + g };
}

/** An iPhone Home Screen (440 × 956 pt) with Committed's widgets and its icon. */
export function homeScreen({ commitments, palette, s, iconSrc, locale }) {
  const [alcohol, nicotine, sugar] = commitments;
  const time = locale === 'es' ? '9:41' : '9:41';
  return `<div style="position:absolute;inset:0;background:
      radial-gradient(120% 55% at 50% 108%, ${palette.dawn}38 0%, transparent 62%),
      radial-gradient(80% 40% at 20% 0%, ${palette.accent}1C 0%, transparent 70%), ${palette.bgDeep}">
    <div style="position:absolute;left:52px;top:20px;font:600 17px Inter;color:#fff">${time}</div>
    <div style="position:absolute;left:38px;top:84px;display:flex;flex-direction:column;gap:22px">
      ${constellationWidget(nicotine, 'medium', palette, s)}
      <div style="display:flex;gap:24px">${numeralWidget(sugar, 'small', palette, s)}${chronicleWidget(alcohol, palette, s, 'auto')}</div>
      ${numeralWidget(nicotine, 'medium', palette, s, 'days')}
    </div>
    <div style="position:absolute;left:38px;top:720px;display:flex;flex-direction:column;align-items:center;gap:6px;width:72px">
      ${appIcon(iconSrc, 64)}<span style="font:500 12px Inter;color:#fff">Committed</span></div>
    <div style="position:absolute;left:12px;right:12px;bottom:10px;height:92px;border-radius:38px;background:rgba(255,255,255,.08)"></div>
  </div>`;
}

/** A Mac desktop (a display, not a window) with desktop widgets: same widget views as iPhone. */
export function macDesktop({ width, commitments, palette, s, key = true, style = '', bare = false }) {
  const [alcohol, nicotine, sugar] = commitments;
  const pw = 1512; // 14" MacBook Pro-class desktop in points
  const ph = 945;
  const k = width / pw;
  const inner = `<div style="position:absolute;inset:0;background:
      radial-gradient(110% 70% at 70% 115%, ${palette.dawn}30 0%, transparent 60%),
      radial-gradient(70% 60% at 85% 0%, ${palette.accent}22 0%, transparent 70%),
      linear-gradient(160deg, ${mix(palette.bg, palette.accent, 0.06)} 0%, ${palette.bgDeep} 100%)"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:30px;background:rgba(0,0,0,.25);display:flex;align-items:center;padding:0 18px;gap:22px;font:600 13px Inter;color:rgba(255,255,255,.88)">
      <span>Committed</span></div>
    <div style="position:absolute;left:30px;top:56px;display:flex;flex-direction:column;gap:20px">
      ${constellationWidget(alcohol, 'large', palette, s)}
      <div style="display:flex;gap:24px">${numeralWidget(nicotine, 'small', palette, s)}${chronicleWidget(sugar, palette, s, 'days')}</div>
    </div>
    <div style="position:absolute;left:418px;top:56px;display:flex;flex-direction:column;gap:20px">
      ${constellationWidget(nicotine, 'medium', palette, s)}
      ${numeralWidget(sugar, 'medium', palette, s)}
    </div>`;
  if (bare) {
    const b = width / pw;
    return `<div style="position:absolute;inset:0;width:${pw}px;height:${ph}px;transform-origin:0 0;transform:scale(${b})">${inner}</div>`;
  }
  return `<div ${key ? 'data-key="mac"' : ''} style="position:relative;flex:none;width:${width}px;height:${ph * k + 2 * 14 * k}px;border-radius:${26 * k}px;background:#0B0D0E;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),0 40px 120px rgba(0,0,0,.5);${style}">
    <div style="position:absolute;left:${14 * k}px;top:${14 * k}px;width:${pw * k}px;height:${ph * k}px;border-radius:${12 * k}px;overflow:hidden">
      <div style="position:absolute;inset:0;width:${pw}px;height:${ph}px;transform-origin:0 0;transform:scale(${k})">${inner}</div>
    </div></div>`;
}

export const macDesktopHeight = (width) => (width / 1512) * (945 + 28);

export { phone, watch, watchDetail, macWindow };
