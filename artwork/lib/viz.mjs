// Committed's three visualizations as SVG, ported from the app's own drawing code so the artwork
// draws the same thing the app does:
//
//   matrix()        Committed/Features/Sobriety/Styles/Matrix/MatrixLayout.swift + MatrixView.swift
//   constellation() CommittedKit/Sources/CommittedKit/WidgetRenderers.swift (ConstellationGeometry,
//                   constellationSky(asOf:), ConstellationSkyView)
//   ledgerRows()    Committed/Features/Sobriety/Styles/Ledger/LedgerView.swift
//
// These are renditions drawn from the app's geometry and palette tokens, not screenshots. Anywhere a
// piece is presented as "what the app looks like" (App Store, press screenshots), use a capture.

import { daysBetween, rng } from './model.mjs';

const f = (n) => Math.round(n * 100) / 100;

// MARK: - Matrix

/** MatrixLayout's fit: columns/rows/uncapped pitch for `count` square cells filling the area. */
function fit(count, areaW, areaH) {
  const n = Math.max(1, count);
  const aspect = areaH > 0 ? areaW / areaH : 1;
  const cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
  const rows = Math.max(1, Math.ceil(n / cols));
  return { cols, rows, pitch: Math.min(areaW / cols, areaH / rows) };
}

/**
 * The dot field: one dot per day (binned to weeks or months when days would fall below legibility),
 * milestone cells in dawn, today's cell as a ringed accent dot. `margin`/`maxScale` default to the
 * app's phone values; artwork may pass a larger `scaleOverride` to draw the same field at poster size.
 */
export function matrixLayout({ width, height, dayCount, milestoneDays, scale: scaleOverride, margin = 26, legible }) {
  const referenceWidth = 402;
  const scale = scaleOverride ?? Math.min(width / referenceWidth, 1.25);
  const clearance = 4 * scale;
  const maxDotRadius = 30 * scale * 0.3;
  const reserve = maxDotRadius + clearance;
  const areaW = Math.max(0, width - 2 * margin);
  const areaH = Math.max(60, height - 2 * reserve);
  const legibleCell = legible ?? 6.6 * scale;

  const bins = (per) => Math.floor((dayCount - 1) / per) + 1;
  let unit = 'day';
  let count = dayCount;
  if (fit(dayCount, areaW, areaH).pitch < legibleCell) {
    const weeks = bins(7);
    if (fit(weeks, areaW, areaH).pitch >= legibleCell) {
      unit = 'week';
      count = weeks;
    } else {
      unit = 'month';
      count = bins(30.44);
    }
  }
  const per = { day: 1, week: 7, month: 30.44 }[unit];
  const { cols, rows, pitch } = fit(count, areaW, areaH);
  const sp = Math.min(pitch, 30 * scale);
  const dotRadius = Math.max(0.7, sp * 0.21);
  const milestoneRadius = Math.max(1.2, sp * 0.3);
  const x0 = margin + (areaW - (cols - 1) * sp) / 2;
  const y0 = reserve + (areaH - (rows - 1) * sp) / 2;
  const milestoneBins = new Set(
    [...milestoneDays].filter((d) => d >= 1 && d <= dayCount).map((d) => Math.floor((d - 1) / per))
  );
  return { unit, count, cols, rows, sp, dotRadius, milestoneRadius, x0, y0, milestoneBins };
}

/** TodayMarker.coreRadius(ringOuterRadius:) */
function todayCore(ring) {
  return Math.max(1, ring / 3, Math.min(ring * 0.58, ring - 1 - 2));
}

export function matrix({ width, height, dayCount, milestoneDays, palette, ...rest }) {
  const L = matrixLayout({ width, height, dayCount, milestoneDays, ...rest });
  const now = Math.max(0, L.count - 1);
  let regular = '';
  let milestones = '';
  for (let i = 0; i < L.count; i++) {
    if (i === now) continue;
    const x = f(L.x0 + (i % L.cols) * L.sp);
    const y = f(L.y0 + Math.floor(i / L.cols) * L.sp);
    if (L.milestoneBins.has(i)) milestones += `<circle cx="${x}" cy="${y}" r="${f(L.milestoneRadius)}"/>`;
    else regular += `<circle cx="${x}" cy="${y}" r="${f(L.dotRadius)}"/>`;
  }
  const nx = f(L.x0 + (now % L.cols) * L.sp);
  const ny = f(L.y0 + Math.floor(now / L.cols) * L.sp);
  const ring = Math.min(Math.max(3, L.sp * 0.32) + 4, L.sp * 0.5);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
<g fill="${palette.accent}" fill-opacity="0.6">${regular}</g>
<g fill="${palette.dawn}" fill-opacity="0.95">${milestones}</g>
<circle cx="${nx}" cy="${ny}" r="${f(ring - 0.5)}" fill="none" stroke="${palette.accent}" stroke-opacity="0.5" stroke-width="1"/>
<circle cx="${nx}" cy="${ny}" r="${f(todayCore(ring))}" fill="${palette.accent}"/>
</svg>`;
  return { svg, layout: L };
}

// MARK: - Constellation (the widget sky)

const ORIGIN = { x: 0.17, y: 0.82 };
const ORIGIN_SPECKS = [
  [0, 0],
  [-6, -4],
  [5, -6],
  [-4, 5],
  [7, 3],
];

function spinePoint(localIndex, visibleCount) {
  const fraction = visibleCount <= 1 ? 0.5 : localIndex / (visibleCount - 1);
  return { x: 0.3 + fraction * 0.62, y: 0.7 - fraction * 0.52 + Math.sin(fraction * Math.PI * 2.4) * 0.045 };
}

/** WidgetCommitmentData.constellationSky(asOf:) */
export function constellationSky(commitment) {
  const ladder = commitment.ladder;
  const elapsedDays = daysBetween(commitment.start, commitment.asOf);
  const reachedCount = ladder.filter((m) => m.days <= elapsedDays).length;
  const early = ladder.filter((m) => m.scale !== 'year');
  const earlyReached = early.filter((m) => m.days <= elapsedDays).length;
  const originReachedFraction = early.length ? earlyReached / early.length : 1;
  const originIsCurrent = reachedCount === 0;
  const spineEnd = Math.min(ladder.length, reachedCount + 1 + 2);
  const spineStart = Math.max(0, spineEnd - 7);
  const visible = spineEnd - spineStart;
  const stars = Array.from({ length: visible }, (_, local) => {
    const index = spineStart + local;
    const state =
      index < reachedCount
        ? index === reachedCount - 1 && !originIsCurrent
          ? 'current'
          : 'reached'
        : index === reachedCount
          ? 'next'
          : 'future';
    return { point: spinePoint(local, visible), state };
  });
  let pathProgress = 0;
  if (reachedCount >= 1 && reachedCount < ladder.length) {
    const a = ladder[reachedCount - 1].days;
    const b = ladder[reachedCount].days;
    pathProgress = b > a ? Math.min(1, Math.max(0, (elapsedDays - a) / (b - a))) : 0;
  }
  return { stars, originReachedFraction, originIsCurrent, reachedCount, pathProgress };
}

let glowId = 0;

/**
 * ConstellationSkyView, drawn at `width`×`height` points. `k` scales the fixed point sizes (star radii,
 * strokes, cluster offsets) for poster-sized skies; 1 is the widget's own size.
 */
export function constellation({ sky, width, height, accent, ink = '#E9ECF3', k = 1 }) {
  const id = `g${++glowId}`;
  const P = (u) => ({ x: u.x * width, y: u.y * height });
  const origin = P(ORIGIN);
  const pos = sky.stars.map((s) => P(s.point));
  const current = sky.originIsCurrent ? origin : pos[sky.stars.findIndex((s) => s.state === 'current')];
  let out = '';

  const chain = [origin, ...pos.filter((_, i) => ['reached', 'current'].includes(sky.stars[i].state))];
  if (chain.length > 1) {
    out += `<polyline points="${chain.map((p) => `${f(p.x)},${f(p.y)}`).join(' ')}" fill="none" stroke="${accent}" stroke-opacity="0.5" stroke-width="${f(0.9 * k)}" stroke-linejoin="round"/>`;
  }
  const nextIndex = sky.stars.findIndex((s) => s.state === 'next');
  if (current && nextIndex >= 0) {
    const next = pos[nextIndex];
    const tr = { x: current.x + (next.x - current.x) * sky.pathProgress, y: current.y + (next.y - current.y) * sky.pathProgress };
    out += `<line x1="${f(tr.x)}" y1="${f(tr.y)}" x2="${f(next.x)}" y2="${f(next.y)}" stroke="${accent}" stroke-opacity="0.4" stroke-width="${f(0.7 * k)}" stroke-dasharray="${f(1.6 * k)} ${f(1.8 * k)}"/>`;
    if (sky.pathProgress > 0.02) {
      out += `<line x1="${f(current.x)}" y1="${f(current.y)}" x2="${f(tr.x)}" y2="${f(tr.y)}" stroke="${accent}" stroke-opacity="0.85" stroke-width="${f(1.1 * k)}"/>`;
    }
  }

  const glint = (c, r, color, opacity, glow, rays) => {
    let s = '';
    if (glow) s += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r * 3.2)}" fill="url(#${id}-${color === ink ? 'i' : 'a'})" opacity="${opacity}"/>`;
    if (rays) {
      const l = r * 2.4;
      s += `<path d="M${f(c.x)} ${f(c.y - l)}V${f(c.y + l)}M${f(c.x - l)} ${f(c.y)}H${f(c.x + l)}" stroke="${color}" stroke-opacity="${f(0.7 * opacity)}" stroke-width="${f(0.6 * k)}"/>`;
    }
    s += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${color}" fill-opacity="${opacity}"/>`;
    return s;
  };

  const clusterOpacity = 0.35 + 0.55 * sky.originReachedFraction;
  ORIGIN_SPECKS.forEach(([dx, dy], i) => {
    out += glint({ x: origin.x + dx * k, y: origin.y + dy * k }, (i === 0 ? 2.3 : 1.3) * k, accent, f(clusterOpacity), i === 0, i === 0);
  });
  if (sky.originIsCurrent) {
    out += `<circle cx="${f(origin.x)}" cy="${f(origin.y)}" r="${f(7 * k)}" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="${k}"/>`;
    out += glint(origin, 2.6 * k, ink, 1, true, true);
  }
  sky.stars.forEach((s, i) => {
    const c = pos[i];
    if (s.state === 'reached') out += glint(c, 2.5 * k, accent, 1, true, true);
    if (s.state === 'current') {
      out += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(7.5 * k)}" fill="none" stroke="${accent}" stroke-opacity="0.5" stroke-width="${k}"/>`;
      out += glint(c, 3 * k, ink, 1, true, true);
    }
    if (s.state === 'next') out += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(4.5 * k)}" fill="none" stroke="${accent}" stroke-opacity="0.95" stroke-width="${f(1.4 * k)}"/>`;
    if (s.state === 'future') out += glint(c, 1.4 * k, ink, 0.4, false, false);
  });

  const defs = `<defs>
<radialGradient id="${id}-a"><stop offset="0" stop-color="${accent}" stop-opacity="0.5"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-i"><stop offset="0" stop-color="${ink}" stop-opacity="0.5"/><stop offset="1" stop-color="${ink}" stop-opacity="0"/></radialGradient>
</defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${defs}${out}</svg>`;
}

/** The constellation widget's night-sky ground: the accent mixed 90% toward #06070B. */
export function skyGround(accent) {
  return mix(accent, '#06070B', 0.9);
}

export function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const c = (s) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return '#' + [16, 8, 0].map((s) => c(s).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** `ink` stepped 30% toward the accent: PaletteTokens.numeralInk, the widgets' hero numeral color. */
export function numeralInk(palette) {
  return mix(palette.ink, palette.accent, 0.3);
}

/** A seeded field of faint background specks for poster-sized skies (decoration, not data). */
export function starfield({ width, height, count, color, seed = 7, maxR = 1.2 }) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = r() * width;
    const y = r() * height;
    const rad = 0.3 + r() * r() * maxR;
    const o = 0.12 + r() * 0.45;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill-opacity="${f(o)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true"><g fill="${color}">${s}</g></svg>`;
}

// MARK: - Ledger

/** LedgerView's rows: one per unit (years, months, days) with a value, largest unit first. */
export function ledgerRows(commitment, s) {
  const e = commitment.elapsed;
  const rows = [];
  if (e.years) rows.push({ value: e.years, unit: s.unitWord(e.years, 'years') });
  if (e.years || e.months) rows.push({ value: e.months, unit: s.unitWord(e.months, 'months') });
  rows.push({ value: e.days, unit: s.unitWord(e.days, 'days') });
  rows.push({ value: e.totalDays, unit: s.unitWord(e.totalDays, 'days'), total: true });
  return rows;
}
