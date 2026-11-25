// Neutral, drawn device frames (no Apple product imagery is copied). Proportions follow the current
// devices closely enough to read as iPhone, Mac and Apple Watch at marketing sizes:
//
//   phone   iPhone 6.9" class: 440 × 956 pt screen, continuous corners, Dynamic Island
//   mac     a macOS window (title bar with the three window controls) or a whole desktop
//   watch   a 46 mm-class case: 416 × 496 px screen (Series 10–12 screenshot size), digital crown
//
// Every frame takes a `scale` (CSS px per point) so the same frame works on an Open Graph card and a
// 5K App Store canvas. Screens hold either HTML (renditions) or a capture image.

import { escapeHTML as e } from '../config/strings.mjs';

export const deviceCSS = `
.phone { position: relative; flex: none; background: #0B0D0E; box-shadow: inset 0 0 0 1px rgba(255,255,255,.10), 0 30px 80px rgba(0,0,0,.45); }
.phone .screen { position: absolute; overflow: hidden; background: var(--bg); }
.phone .island { position: absolute; background: #000; }
.phone .screen > img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.mac { position: relative; flex: none; overflow: hidden; background: var(--bg); box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 40px 120px rgba(0,0,0,.55); }
.mac .titlebar { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; }
.mac .lights { display: flex; }
.mac .lights i { display: block; border-radius: 50%; }
.watch { position: relative; flex: none; background: #0F1112; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 24px 70px rgba(0,0,0,.5); }
.watch .screen { position: absolute; overflow: hidden; background: #000; }
.watch .crown { position: absolute; background: #1A1D1F; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
`;

/** iPhone frame around `inner` (HTML) or a capture `src`. `width` is the outer width in px. */
export function phone({ width, inner = '', src, alt = '', key = true, style = '' }) {
  const s = width / 476; // 440 pt screen + 2 × 18 pt bezel
  const bezel = 18 * s;
  const screenW = 440 * s;
  const screenH = 956 * s;
  const content = src ? `<img src="${src}" alt="${e(alt)}">` : `<div style="position:absolute;inset:0;transform-origin:0 0;transform:scale(${s});width:440px;height:956px">${inner}</div>`;
  return `<div class="phone" ${key ? 'data-key="phone"' : ''} style="width:${width}px;height:${screenH + 2 * bezel}px;border-radius:${74 * s}px;${style}">
    <div class="screen" style="left:${bezel}px;top:${bezel}px;width:${screenW}px;height:${screenH}px;border-radius:${56 * s}px">${content}</div>
    <div class="island" style="left:${bezel + (screenW - 126 * s) / 2}px;top:${bezel + 11 * s}px;width:${126 * s}px;height:${37 * s}px;border-radius:${19 * s}px"></div>
  </div>`;
}

export const phoneHeight = (width) => (width / 476) * 992;

/** A macOS window. `inner` is laid out in points inside a `pointW`×`pointH` content area. */
export function macWindow({ width, pointW = 1100, inner = '', title = '', key = true, style = '', bg = 'var(--bg)' }) {
  const s = width / pointW;
  const barH = 52;
  const pointH = Math.round(pointW * 0.625);
  return `<div class="mac" ${key ? 'data-key="mac"' : ''} style="width:${width}px;height:${pointH * s}px;border-radius:${16 * s}px;background:${bg};${style}">
    <div style="position:absolute;inset:0;transform-origin:0 0;transform:scale(${s});width:${pointW}px;height:${pointH}px">
      <div class="titlebar" style="height:${barH}px;padding:0 20px;gap:12px">
        <div class="lights" style="gap:8px">${['#FF5F57', '#FEBC2E', '#28C840'].map((c) => `<i style="width:12px;height:12px;background:${c}"></i>`).join('')}</div>
        <span style="font:600 13px Inter;color:var(--inkDim);margin-left:12px">${e(title)}</span>
      </div>
      <div style="position:absolute;left:0;right:0;top:${barH}px;bottom:0">${inner}</div>
    </div>
  </div>`;
}

/** Apple Watch case around `inner`, laid out on a 208 × 248 pt screen (416 × 496 px at 2×). */
export function watch({ width, inner = '', key = true, style = '' }) {
  const s = width / 252; // 208 pt screen + 2 × 22 pt case
  const rim = 22 * s;
  return `<div class="watch" ${key ? 'data-key="watch"' : ''} style="width:${width}px;height:${292 * s}px;border-radius:${64 * s}px;${style}">
    <div class="screen" style="left:${rim}px;top:${rim}px;width:${208 * s}px;height:${248 * s}px;border-radius:${44 * s}px">
      <div style="position:absolute;inset:0;transform-origin:0 0;transform:scale(${s});width:208px;height:248px">${inner}</div>
    </div>
    <div class="crown" style="right:${-7 * s}px;top:${70 * s}px;width:${10 * s}px;height:${44 * s}px;border-radius:${4 * s}px"></div>
    <div class="crown" style="right:${-4 * s}px;top:${140 * s}px;width:${6 * s}px;height:${50 * s}px;border-radius:${3 * s}px"></div>
  </div>`;
}

/**
 * The watch app's commitment detail (Committed Watch App/WatchCommitmentDetailView.swift): eyebrow,
 * accent hero numeral, sub line, since line, next milestone. In points on the 208 × 248 screen.
 */
export function watchDetail(c, palette, s) {
  const h = c.headline('auto');
  const e2 = c.elapsed;
  const sub = [];
  if (e2.years) sub.push(`${e2.months} ${s.unitWord(e2.months, 'months')}`);
  sub.push(`${e2.days} ${s.unitWord(e2.days, 'days')}`);
  return `<div style="padding:44px 14px 0;font-family:Inter;color:#fff">
    <div style="font:600 13px Inter;color:${palette.accent};margin-bottom:10px">${e(c.name)}</div>
    <div style="font:600 11px Inter;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,.55)">${e(c.prefix)} ${e(c.name)}</div>
    <div style="display:flex;align-items:baseline;gap:5px;margin-top:4px">
      <span style="font:600 50px Inter;letter-spacing:-1px;color:${palette.accent};font-feature-settings:'tnum'">${h.value}</span>
      <span style="font:500 19px Inter;color:rgba(255,255,255,.6)">${e(h.unit)}</span></div>
    <div style="font:400 14px Inter;color:rgba(255,255,255,.6);margin-top:2px">${e(sub.join(' · '))}</div>
    <div style="font:400 12px Inter;color:rgba(255,255,255,.38);margin-top:6px">${e(s.t('app.since', c.since))}</div>
  </div>`;
}
