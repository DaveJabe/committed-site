// Home Screen widget renditions, laid out from the widget extension's SwiftUI (sizes, paddings, type
// sizes, tracking, colors) so they read as the real widgets at marketing scale:
//
//   CommittedWidget/CommittedConstellationWidget.swift   constellation S / M / L
//   CommittedWidget/CommittedWidget.swift                 NumeralLayout S / M, ChronicleLayout S
//
// Sizes are iPhone 6.9" points (small 170, medium 364×170, large 364×382). The widgets use SF; this
// renders them in Inter, the closest openly licensed face, so a capture remains the reference for
// anything shown as a screenshot. Every widget gets a `data-widget` attribute for the report.

import { escapeHTML as e } from '../config/strings.mjs';
import { constellation, constellationSky, numeralInk, skyGround } from './viz.mjs';

export const WIDGET_SIZES = {
  small: [170, 170],
  medium: [364, 170],
  large: [364, 382],
};
export const WIDGET_RADIUS = 22;

export const widgetCSS = `
.w { position: relative; overflow: hidden; border-radius: ${WIDGET_RADIUS}px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 12px 32px rgba(0,0,0,.35); font-family: 'Inter', system-ui; color: var(--ink);
  font-feature-settings: 'tnum' 1; -webkit-font-smoothing: antialiased; flex: none; }
.w > svg { position: absolute; inset: 0; }
.w .scrim { position: absolute; inset: 0; }
.w .body { position: absolute; inset: 0; display: flex; flex-direction: column; }
.w .num { font-family: 'Inter Display', 'Inter'; font-weight: 300; line-height: 0.78; letter-spacing: -0.01em; white-space: nowrap; }
.w .unit { font-weight: 600; text-transform: uppercase; white-space: nowrap; }
.w .name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.w .cap { font-weight: 600; text-transform: uppercase; white-space: nowrap; }
.w .bar { position: relative; height: 0.5px; border-radius: 1px; }
.w .bar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 1px; }
`;

function shell(kind, family, palette, inner, style = '') {
  const [w, h] = WIDGET_SIZES[family];
  return `<div class="w" data-widget="${kind}-${family}" style="width:${w}px;height:${h}px;--ink:${palette.ink};${style}">${inner}</div>`;
}

/** The constellation widget, any family. */
export function constellationWidget(c, family, palette, s) {
  const [w, h] = WIDGET_SIZES[family];
  const sky = constellationSky(c);
  const ground = skyGround(palette.accent);
  const head = c.headline('days');
  const num = numeralInk(palette);
  const nextLine = s.t('app.nextStar', c.next.title, c.next.remainingDays);
  const scrim =
    family === 'medium'
      ? `linear-gradient(to right, ${ground} 12%, ${ground}00 66%)`
      : `linear-gradient(to top, ${ground} 6%, ${ground}00 56%)`;
  const chip = (size) =>
    `<span class="cap" style="font-size:${size}px;letter-spacing:${(1.2 / 9.5) * size}px;color:${palette.inkDim}">● ${c.ladder.filter((m) => m.days <= c.elapsed.totalDays).length}</span>`;
  let body;
  if (family === 'small') {
    body = `<div class="body" style="padding:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
        <span class="name" style="font-size:9.5px;letter-spacing:1.2px;opacity:.82">${e(c.name)}</span>${chip(9.5)}
      </div>
      <div style="flex:1"></div>
      <div style="display:flex;align-items:baseline;gap:6px"><span class="num" style="font-size:56px;color:${num}">${head.value}</span><span class="unit" style="font-size:10px;letter-spacing:2.4px">${e(head.unit)}</span></div>
    </div>`;
  } else if (family === 'medium') {
    body = `<div class="body" style="padding:18px;justify-content:center">
      <span class="num" style="font-size:80px;color:${num}">${head.value}</span>
      <span class="unit" style="font-size:11px;letter-spacing:2.4px;margin-top:6px">${e(head.unit)}</span>
      <span class="name" style="font-size:16px;margin-top:14px">${e(c.name)}</span>
      <span class="cap" style="font-size:9.5px;letter-spacing:1.2px;color:${palette.accent};opacity:.95;margin-top:7px;text-transform:none">${e(nextLine)}</span>
    </div>`;
  } else {
    body = `<div class="body" style="padding:24px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="name" style="font-size:20px">${e(c.name)}</span>${chip(11)}
      </div>
      <div style="flex:1"></div>
      <div style="display:flex;align-items:baseline;gap:8px"><span class="num" style="font-size:104px;color:${num}">${head.value}</span><span class="unit" style="font-size:14px;letter-spacing:2.4px">${e(head.unit)}</span></div>
      <span class="cap" style="font-size:9.5px;letter-spacing:1.2px;color:${palette.accent};opacity:.95;margin-top:12px;text-transform:none">${e(nextLine)}</span>
    </div>`;
  }
  return shell(
    'constellation',
    family,
    palette,
    `${constellation({ sky, width: w, height: h, accent: palette.accent })}<div class="scrim" style="background:${scrim}"></div>${body}`,
    `background:${ground}`
  );
}

function progressBar(progress, palette, height = 0.5) {
  return `<div class="bar" style="height:${height}px;background:${palette.inkGhost}"><i style="width:${(progress * 100).toFixed(1)}%;background:${palette.accent}"></i></div>`;
}

/** numeralFontSize(value:full:compact:) — four or more digits drop to the compact size. */
const numeralSize = (value, full, compact) => (String(value).length >= 4 ? compact : full);

/** NumeralLayout: small (name, centered hero, progress + countdown) or medium (two columns). */
export function numeralWidget(c, family, palette, s, unit = 'days') {
  const head = c.headline(unit);
  const num = numeralInk(palette);
  const countdown = s.t('app.milestoneCountdown', c.next.remainingDays, c.next.title);
  let inner;
  if (family === 'small') {
    inner = `<div class="body" style="padding:14px">
      <span class="name" style="font-size:14px">${e(c.name)}</span>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
        <span class="num" style="font-size:${numeralSize(head.value, 64, 52)}px;color:${num}">${head.value}</span>
        <span class="unit" style="font-size:11px;letter-spacing:3px">${e(head.unit)}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">${progressBar(c.next.progress, palette)}
        <span class="cap" style="font-size:11px;letter-spacing:1.2px;color:${palette.accent}">${e(countdown)}</span></div>
    </div>`;
  } else {
    inner = `<div class="body" style="padding:16px 16px;flex-direction:row;align-items:stretch">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px">
        <span class="num" style="font-size:${numeralSize(head.value, 88, 70)}px;color:${num}">${head.value}</span>
        <span class="unit" style="font-size:11px;letter-spacing:3px;padding-left:3px">${e(head.unit)}</span>
      </div>
      <div style="width:.8px;background:${palette.hairline};margin:6px 18px"></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:8px;min-width:0">
        <span class="name" style="font-size:17px">${e(c.name)}</span>
        <span class="cap" style="font-size:9px;font-weight:500;letter-spacing:1.2px;color:${palette.inkDim}">${e(s.t('app.since', c.since))}</span>
        <div style="flex:1"></div>
        <div style="display:flex;flex-direction:column;gap:7px">${progressBar(c.next.progress, palette)}
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">
            <span class="cap" style="font-size:9px;font-weight:500;letter-spacing:1.1px;color:${palette.inkDim}">${e(c.next.previousTitle)}</span>
            <span class="cap" style="font-size:11px;letter-spacing:1.1px;color:${palette.accent}">${e(countdown)}</span></div></div>
      </div>
    </div>`;
  }
  return shell('numeral', family, palette, inner, `background:${palette.bg}`);
}

/** ChronicleLayout (small): prefix, name, "Since …", and the count bottom-left. */
export function chronicleWidget(c, palette, s, unit = 'days') {
  const head = c.headline(unit);
  const inner = `<div class="body" style="padding:14px;gap:4px">
    <span class="cap" style="font-size:8px;font-weight:500;letter-spacing:1.8px;color:${palette.inkFaint}">${e(c.prefix)}</span>
    <span class="name" style="font-size:15px">${e(c.name)}</span>
    <span style="font-size:10px;letter-spacing:.4px;color:${palette.inkDim}">${e(s.t('app.since', c.since))}</span>
    <div style="flex:1"></div>
    <div style="display:flex;align-items:baseline;gap:4px"><span class="num" style="font-size:${numeralSize(head.value, 52, 44)}px;color:${numeralInk(palette)}">${head.value}</span><span class="unit" style="font-size:10px;letter-spacing:2px">${e(head.unit)}</span></div>
  </div>`;
  return shell('chronicle', 'small', palette, inner, `background:${palette.bg}`);
}
