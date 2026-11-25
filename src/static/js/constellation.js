/*
 * The Committed constellation, ported from CommittedKit WidgetRenderers (ConstellationGeometry,
 * constellationSky, ConstellationSkyView) so the site draws the same sky the widgets do.
 * Works in the browser (window.CommittedSky) and in Node (the build renders widget SVGs with it).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CommittedSky = api;
})(typeof self !== "undefined" ? self : this, function () {
  const ORIGIN = { x: 0.17, y: 0.82 };
  const ORIGIN_CLUSTER = [[0, 0], [-6, -4], [5, -6], [-4, 5], [7, 3]];

  function spinePoint(localIndex, visibleCount) {
    const f = visibleCount <= 1 ? 0.5 : localIndex / (visibleCount - 1);
    return { x: 0.3 + f * 0.62, y: 0.7 - f * 0.52 + Math.sin(f * Math.PI * 2.4) * 0.045 };
  }

  /**
   * ladder: [{ day, isYear }] sorted by day; elapsed: whole days since the start.
   * Returns the same model the widget draws: a windowed spine of at most 7 stars around "you are here".
   */
  function model(ladder, elapsed) {
    const reachedCount = ladder.filter((m) => m.day <= elapsed).length;
    const early = ladder.filter((m) => !m.isYear);
    const earlyReached = early.filter((m) => m.day <= elapsed).length;
    const originReachedFraction = early.length ? earlyReached / early.length : 1;
    const originIsCurrent = reachedCount === 0;
    const spineEnd = Math.min(ladder.length, reachedCount + 1 + 2);
    const spineStart = Math.max(0, spineEnd - 7);
    const visible = spineEnd - spineStart;
    const stars = [];
    for (let i = 0; i < visible; i += 1) {
      const index = spineStart + i;
      let state;
      if (index < reachedCount) state = index === reachedCount - 1 && !originIsCurrent ? "current" : "reached";
      else if (index === reachedCount) state = "next";
      else state = "future";
      stars.push({ point: spinePoint(i, visible), state });
    }
    let pathProgress = 0;
    if (reachedCount >= 1 && reachedCount < ladder.length) {
      const a = ladder[reachedCount - 1].day;
      const b = ladder[reachedCount].day;
      if (b > a) pathProgress = Math.min(1, Math.max(0, (elapsed - a) / (b - a)));
    }
    return { stars, originReachedFraction, originIsCurrent, reachedCount, pathProgress };
  }

  /** Draws the model onto a 2D canvas context in a w×h box at (x, y). `unit` scales the point sizes. */
  function drawCanvas(c, sky, box, colors) {
    const { x, y, w, h } = box;
    const u = box.unit || 1;
    const P = (p) => ({ x: x + p.x * w, y: y + p.y * h });
    const origin = P(ORIGIN);
    const positions = sky.stars.map((s) => P(s.point));
    const current = sky.originIsCurrent ? origin : positions[sky.stars.findIndex((s) => s.state === "current")];
    const rgba = (hex, a) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };
    c.save();
    c.lineJoin = "round";
    c.lineCap = "round";
    const chain = [origin].concat(positions.filter((_, i) => ["reached", "current"].includes(sky.stars[i].state)));
    if (chain.length > 1) {
      c.beginPath();
      chain.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.strokeStyle = rgba(colors.accent, 0.5);
      c.lineWidth = 0.9 * u;
      c.stroke();
    }
    const nextIndex = sky.stars.findIndex((s) => s.state === "next");
    if (current && nextIndex >= 0) {
      const next = positions[nextIndex];
      const t = sky.pathProgress;
      const mid = { x: current.x + (next.x - current.x) * t, y: current.y + (next.y - current.y) * t };
      c.beginPath();
      c.setLineDash([1.6 * u, 1.8 * u]);
      c.moveTo(mid.x, mid.y);
      c.lineTo(next.x, next.y);
      c.strokeStyle = rgba(colors.accent, 0.4);
      c.lineWidth = 0.7 * u;
      c.stroke();
      c.setLineDash([]);
      if (t > 0.02) {
        c.beginPath();
        c.moveTo(current.x, current.y);
        c.lineTo(mid.x, mid.y);
        c.strokeStyle = rgba(colors.accent, 0.85);
        c.lineWidth = 1.1 * u;
        c.stroke();
      }
    }
    const glint = (p, r, color, alpha, glow, rays) => {
      if (glow) {
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
        g.addColorStop(0, rgba(color, 0.5 * alpha));
        g.addColorStop(1, rgba(color, 0));
        c.fillStyle = g;
        c.beginPath();
        c.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
        c.fill();
      }
      if (rays) {
        const l = r * 2.4;
        c.beginPath();
        c.moveTo(p.x, p.y - l); c.lineTo(p.x, p.y + l);
        c.moveTo(p.x - l, p.y); c.lineTo(p.x + l, p.y);
        c.strokeStyle = rgba(color, 0.7 * alpha);
        c.lineWidth = 0.6 * u;
        c.stroke();
      }
      c.beginPath();
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
      c.fillStyle = rgba(color, alpha);
      c.fill();
    };
    const ring = (p, r, color, alpha, width) => {
      c.beginPath();
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
      c.strokeStyle = rgba(color, alpha);
      c.lineWidth = width;
      c.stroke();
    };
    const originAlpha = 0.35 + 0.55 * sky.originReachedFraction;
    ORIGIN_CLUSTER.forEach(([dx, dy], i) => {
      glint({ x: origin.x + dx * u, y: origin.y + dy * u }, (i === 0 ? 2.3 : 1.3) * u, colors.accent, originAlpha, i === 0, i === 0);
    });
    if (sky.originIsCurrent) {
      ring(origin, 7 * u, colors.accent, 0.45, 1 * u);
      glint(origin, 2.6 * u, colors.ink, 1, true, true);
    }
    sky.stars.forEach((star, i) => {
      const p = positions[i];
      if (star.state === "reached") glint(p, 2.5 * u, colors.accent, 1, true, true);
      else if (star.state === "current") {
        ring(p, 7.5 * u, colors.accent, 0.5, 1 * u);
        glint(p, 3 * u, colors.ink, 1, true, true);
      } else if (star.state === "next") ring(p, 4.5 * u, colors.accent, 0.95, 1.4 * u);
      else glint(p, 1.4 * u, colors.ink, 0.4, false, false);
    });
    c.restore();
  }

  /** The same drawing as an SVG string, for static widget illustrations rendered at build time. */
  function svg(sky, w, h, colors) {
    const P = (p) => ({ x: +(p.x * w).toFixed(2), y: +(p.y * h).toFixed(2) });
    const origin = P(ORIGIN);
    const positions = sky.stars.map((s) => P(s.point));
    const current = sky.originIsCurrent ? origin : positions[sky.stars.findIndex((s) => s.state === "current")];
    const parts = [];
    const glint = (p, r, color, alpha, glow, rays) => {
      if (glow) parts.push(`<circle cx="${p.x}" cy="${p.y}" r="${(r * 3.2).toFixed(2)}" fill="url(#g-${color.slice(1)})" opacity="${alpha.toFixed(2)}"/>`);
      if (rays) {
        const l = (r * 2.4).toFixed(2);
        parts.push(`<path d="M${p.x} ${p.y - l}V${p.y + +l}M${p.x - l} ${p.y}H${p.x + +l}" stroke="${color}" stroke-opacity="${(0.7 * alpha).toFixed(2)}" stroke-width="0.6"/>`);
      }
      parts.push(`<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}" fill-opacity="${alpha.toFixed(2)}"/>`);
    };
    const chain = [origin].concat(positions.filter((_, i) => ["reached", "current"].includes(sky.stars[i].state)));
    if (chain.length > 1) parts.push(`<polyline points="${chain.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="${colors.accent}" stroke-opacity="0.5" stroke-width="0.9" stroke-linejoin="round"/>`);
    const nextIndex = sky.stars.findIndex((s) => s.state === "next");
    if (current && nextIndex >= 0) {
      const next = positions[nextIndex];
      const t = sky.pathProgress;
      const mid = { x: +(current.x + (next.x - current.x) * t).toFixed(2), y: +(current.y + (next.y - current.y) * t).toFixed(2) };
      parts.push(`<path d="M${mid.x} ${mid.y}L${next.x} ${next.y}" stroke="${colors.accent}" stroke-opacity="0.4" stroke-width="0.7" stroke-dasharray="1.6 1.8"/>`);
      if (t > 0.02) parts.push(`<path d="M${current.x} ${current.y}L${mid.x} ${mid.y}" stroke="${colors.accent}" stroke-opacity="0.85" stroke-width="1.1"/>`);
    }
    const originAlpha = 0.35 + 0.55 * sky.originReachedFraction;
    ORIGIN_CLUSTER.forEach(([dx, dy], i) => glint({ x: origin.x + dx, y: origin.y + dy }, i === 0 ? 2.3 : 1.3, colors.accent, originAlpha, i === 0, i === 0));
    sky.stars.forEach((star, i) => {
      const p = positions[i];
      if (star.state === "reached") glint(p, 2.5, colors.accent, 1, true, true);
      else if (star.state === "current") {
        parts.push(`<circle cx="${p.x}" cy="${p.y}" r="7.5" fill="none" stroke="${colors.accent}" stroke-opacity="0.5"/>`);
        glint(p, 3, colors.ink, 1, true, true);
      } else if (star.state === "next") parts.push(`<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="none" stroke="${colors.accent}" stroke-opacity="0.95" stroke-width="1.4"/>`);
      else glint(p, 1.4, colors.ink, 0.4, false, false);
    });
    const grad = (color) => `<radialGradient id="g-${color.slice(1)}"><stop offset="0" stop-color="${color}" stop-opacity="0.5"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
    return `<svg class="w-sky" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><defs>${grad(colors.accent)}${grad(colors.ink)}</defs>${parts.join("")}</svg>`;
  }

  return { model, drawCanvas, svg, spinePoint };
});
