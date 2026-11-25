/*
 * Progress image maker. Draws a Matrix, Your Sky or Ledger image of someone's sober time on a canvas,
 * entirely on their device, and saves it as a PNG. Nothing is uploaded or stored.
 *
 * The drawings follow the app: Matrix is one dot per day (binning to weeks, then months, when days get
 * too small, like MatrixLayout), Your Sky is the widget constellation (CommittedKit WidgetRenderers),
 * Ledger is the years/months/days rows of LedgerView. Colors are the app's eight palettes.
 */
(function () {
  const root = document.querySelector("[data-artwork]");
  if (!root) return;
  const { S, D, locale, number, plural, milestoneName, formatDay, fill, readDate, setMax, takeCarried } = window.CommittedTools;
  const Sky = window.CommittedSky;
  const form = root.querySelector("[data-artwork-form]");
  const input = form.querySelector("[data-date-input]");
  const error = form.querySelector("[data-error]");
  const canvas = root.querySelector("[data-canvas]");
  const summary = root.querySelector("[data-summary]");
  const downloadButton = root.querySelector("[data-download]");
  const shareButton = root.querySelector("[data-share]");

  const SIZES = { square: [1080, 1080], story: [1080, 1920], wide: [1600, 900] };
  const FONT = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const sample = D.addDays(D.today(), -94);
  let start = null;

  setMax(input, D.today());

  function options() {
    const data = new FormData(form);
    return {
      label: String(data.get("label") || "").trim().slice(0, 40),
      view: data.get("view") || "matrix",
      palette: S.palettes[data.get("theme")] || S.palettes.mint,
      size: SIZES[data.get("size")] || SIZES.square,
      showLabel: data.get("showLabel") === "on",
      showBreakdown: data.get("showBreakdown") === "on",
      showStart: data.get("showStart") === "on",
      showNext: data.get("showNext") === "on",
      showBrand: data.get("showBrand") === "on"
    };
  }

  const hex = (h, a = 1) => {
    const n = parseInt(h.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  function tracked(c, text, x, y, spacing, align = "left") {
    // Canvas letterSpacing is not everywhere yet; draw tracked uppercase labels glyph by glyph.
    if ("letterSpacing" in c) {
      c.letterSpacing = `${spacing}px`;
      c.textAlign = align;
      c.fillText(text, x, y);
      c.letterSpacing = "0px";
      return;
    }
    let width = 0;
    for (const ch of text) width += c.measureText(ch).width + spacing;
    let cursor = align === "right" ? x - width : x;
    c.textAlign = "left";
    for (const ch of text) {
      c.fillText(ch, cursor, y);
      cursor += c.measureText(ch).width + spacing;
    }
  }

  function fitText(c, text, weight, size, maxWidth) {
    let s = size;
    c.font = `${weight} ${s}px ${FONT}`;
    while (c.measureText(text).width > maxWidth && s > 10) {
      s -= 2;
      c.font = `${weight} ${s}px ${FONT}`;
    }
    return s;
  }

  // ---- Matrix: MatrixLayout's fit and unit ladder ---------------------------------------------------
  function drawMatrix(c, box, days, milestoneDays, p, u) {
    const legible = 13 * u;
    const fit = (count) => {
      let best = { cols: 1, rows: count, pitch: 0 };
      for (let cols = 1; cols <= count; cols += 1) {
        const rows = Math.ceil(count / cols);
        const pitch = Math.min(box.w / cols, box.h / rows);
        if (pitch > best.pitch) best = { cols, rows, pitch };
        if (box.w / cols < best.pitch) break;
      }
      return best;
    };
    let per = 1;
    let count = Math.max(1, days);
    let layout = fit(count);
    if (layout.pitch < legible && days > 0) {
      per = 7;
      count = Math.floor((days - 1) / 7) + 1;
      layout = fit(count);
      if (layout.pitch < legible) {
        per = 30.44;
        count = Math.floor((days - 1) / 30.44) + 1;
        layout = fit(count);
      }
    }
    const pitch = Math.min(layout.pitch, 64 * u);
    const bins = new Set(milestoneDays.filter((d) => d >= 1 && d <= days).map((d) => Math.floor((d - 1) / per)));
    const blockW = layout.cols * pitch;
    const blockH = layout.rows * pitch;
    const x0 = box.x + (box.w - blockW) / 2 + pitch / 2;
    const y0 = box.y + (box.h - blockH) / 2 + pitch / 2;
    const dayR = Math.max(1, pitch * 0.21);
    const msR = Math.max(1.6, pitch * 0.3);
    const last = count - 1;
    const at = (i) => [x0 + (i % layout.cols) * pitch, y0 + Math.floor(i / layout.cols) * pitch];
    c.beginPath();
    for (let i = 0; i < count; i += 1) {
      if (i === last || bins.has(i)) continue;
      const [x, y] = at(i);
      c.moveTo(x + dayR, y);
      c.arc(x, y, dayR, 0, Math.PI * 2);
    }
    c.fillStyle = hex(p.accent, 0.5);
    c.fill();
    c.beginPath();
    for (const i of bins) {
      if (i === last) continue;
      const [x, y] = at(i);
      c.moveTo(x + msR, y);
      c.arc(x, y, msR, 0, Math.PI * 2);
    }
    c.fillStyle = p.dawn;
    c.fill();
    const [x, y] = at(last);
    c.beginPath();
    c.arc(x, y, Math.max(2, pitch * 0.25), 0, Math.PI * 2);
    c.fillStyle = bins.has(last) ? p.dawn : p.accent;
    c.fill();
    c.beginPath();
    c.arc(x, y, Math.max(6, pitch * 0.46), 0, Math.PI * 2);
    c.lineWidth = Math.max(1.5, pitch * 0.07);
    c.strokeStyle = hex(p.ink, 0.6);
    c.stroke();
    return { per };
  }

  // ---- Your Sky: the widget constellation, plus a quiet scatter of background stars ----------------
  function drawSky(c, box, startDay, elapsed, p, u) {
    let seed = (startDay.y * 372 + startDay.m * 31 + startDay.d) >>> 0;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) >>> 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < 90; i += 1) {
      c.beginPath();
      c.arc(box.x + rand() * box.w, box.y + rand() * box.h, (0.6 + rand() * 1.3) * u, 0, Math.PI * 2);
      c.fillStyle = hex(p.ink, 0.08 + rand() * 0.2);
      c.fill();
    }
    const ladder = D.milestones(startDay, Math.max(60, D.today().y - startDay.y + 2)).map((m) => ({ day: m.day, isYear: m.kind === "years" }));
    Sky.drawCanvas(c, Sky.model(ladder, elapsed), { ...box, unit: 3.2 * u }, { accent: p.accent, ink: p.ink });
  }

  // ---- Ledger: LedgerView's rows -------------------------------------------------------------------
  function drawLedger(c, box, b, p, u) {
    const rows = [];
    if (b.years) rows.push([b.years, "year"]);
    if (b.years || b.months) rows.push([b.months, "month"]);
    rows.push([b.days, "day"]);
    const rowH = Math.min(box.h / rows.length, 230 * u);
    const size = rowH * 0.72;
    let y = box.y + (box.h - rowH * rows.length) / 2;
    c.strokeStyle = hex(p.ink, 0.18);
    c.lineWidth = Math.max(1, 1.5 * u);
    const line = (yy) => { c.beginPath(); c.moveTo(box.x, yy); c.lineTo(box.x + box.w, yy); c.stroke(); };
    line(y);
    for (const [value, unit] of rows) {
      c.fillStyle = p.ink;
      c.font = `300 ${size}px ${FONT}`;
      c.textAlign = "left";
      c.textBaseline = "alphabetic";
      c.fillText(number.format(value), box.x - size * 0.03, y + rowH * 0.8);
      c.fillStyle = hex(p.ink, 0.55);
      c.font = `600 ${22 * u}px ${FONT}`;
      tracked(c, (S[unit] || [unit, unit + "s"])[value === 1 ? 0 : 1].toUpperCase(), box.x + box.w, y + rowH * 0.8, 5 * u, "right");
      y += rowH;
      line(y);
    }
  }

  function brandMark(c, x, y, s, p) {
    const r = s * 0.13;
    const g = s * 0.36;
    const dots = [[0, 0, p.dawn, 1], [g, 0, p.ink, 0.35], [0, g, p.ink, 0.35], [g, g, p.accent, 1]];
    dots.forEach(([dx, dy, color, alpha]) => {
      c.beginPath();
      c.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      c.fillStyle = hex(color, alpha);
      c.fill();
    });
    c.beginPath();
    c.arc(x + g, y + g, r * 1.9, 0, Math.PI * 2);
    c.strokeStyle = hex(p.accent, 0.45);
    c.lineWidth = s * 0.03;
    c.stroke();
  }

  function render() {
    const o = options();
    const day = start || sample;
    const today = D.today();
    const elapsed = D.daysBetween(day, today);
    const b = D.breakdown(day, today);
    const next = D.upcoming(day, today)[0];
    const reached = D.reached(day, today);
    const [W, H] = o.size;
    const u = Math.min(W, H) / 1080;
    const p = o.palette;
    const wide = W > H;
    canvas.width = W;
    canvas.height = H;
    const c = canvas.getContext("2d");
    c.textBaseline = "alphabetic";

    c.fillStyle = p.bg;
    c.fillRect(0, 0, W, H);
    const glow = c.createRadialGradient(W * 0.8, H * 0.1, 0, W * 0.8, H * 0.1, Math.max(W, H) * 0.7);
    glow.addColorStop(0, hex(p.accent, 0.07));
    glow.addColorStop(1, hex(p.accent, 0));
    c.fillStyle = glow;
    c.fillRect(0, 0, W, H);

    const pad = 84 * u;
    let y = pad + 26 * u;

    // Eyebrow: "SOBER FROM" in the accent, the name in ink (the app's commitment label).
    if (o.showLabel && o.label) {
      c.font = `600 ${26 * u}px ${FONT}`;
      c.fillStyle = p.accent;
      const lead = `${S.soberFrom.toUpperCase()} `;
      tracked(c, lead, pad, y, 5 * u);
      const leadWidth = c.measureText(lead).width + lead.length * 5 * u;
      c.fillStyle = p.ink;
      tracked(c, o.label.toUpperCase(), pad + leadWidth, y, 5 * u);
      y += 30 * u;
    }

    // Headline numeral (Matrix and Sky). Ledger puts its numbers in the rows instead.
    const footerLines = [];
    if (o.showNext) {
      footerLines.push(reached.length && reached[reached.length - 1].day === elapsed
        ? fill(S.reachedToday, { name: milestoneName(reached[reached.length - 1]) })
        : fill(S.nextLine, { name: milestoneName(next), date: formatDay(next.date) }));
    }
    if (o.showStart) footerLines.push(fill(S.sinceLine, { date: formatDay(day) }));
    const footerH = (footerLines.length ? footerLines.length * 46 * u + 10 * u : 0) + (o.showBrand ? 70 * u : 0);

    let vizTop;
    if (o.view !== "ledger") {
      const big = elapsed === 0 ? S.dayOne : number.format(elapsed);
      const target = wide ? 230 * u : 260 * u;
      const size = fitText(c, big, 300, target, W - pad * 2 - 200 * u);
      y += size * 0.86;
      c.fillStyle = p.ink;
      c.font = `300 ${size}px ${FONT}`;
      if ("letterSpacing" in c) c.letterSpacing = `${-size * 0.045}px`;
      c.textAlign = "left";
      c.fillText(big, pad - size * 0.04, y);
      const bigWidth = c.measureText(big).width;
      if ("letterSpacing" in c) c.letterSpacing = "0px";
      if (elapsed > 0) {
        c.font = `600 ${26 * u}px ${FONT}`;
        c.fillStyle = p.dawn;
        tracked(c, S.days[elapsed === 1 ? 0 : 1].toUpperCase(), pad + bigWidth + 14 * u, y, 5 * u);
      }
      if (o.showBreakdown && elapsed > 0 && (b.years || b.months)) {
        y += 64 * u;
        c.font = `400 ${36 * u}px ${FONT}`;
        c.fillStyle = hex(p.ink, 0.72);
        c.fillText(window.CommittedTools.formatBreakdown(b), pad, y);
      }
      vizTop = y + 56 * u;
    } else {
      vizTop = y + 24 * u;
    }

    const vizBottom = H - pad - footerH - (footerH ? 30 * u : 0);
    const box = { x: pad, y: vizTop, w: W - pad * 2, h: Math.max(120 * u, vizBottom - vizTop) };
    if (o.view === "matrix") drawMatrix(c, box, elapsed, reached.map((m) => m.day), p, u);
    else if (o.view === "sky") drawSky(c, box, day, elapsed, p, u);
    else drawLedger(c, box, b, p, u);

    // Footer.
    let fy = H - pad - (o.showBrand ? 70 * u : 0);
    c.textAlign = "left";
    for (let i = footerLines.length - 1; i >= 0; i -= 1) {
      c.font = `${i === 0 ? 500 : 400} ${32 * u}px ${FONT}`;
      c.fillStyle = i === 0 ? p.ink : hex(p.ink, 0.6);
      c.fillText(footerLines[i], pad, fy);
      fy -= 46 * u;
    }
    if (o.showBrand) {
      const by = H - pad - 22 * u;
      brandMark(c, pad + 6 * u, by - 18 * u, 46 * u, p);
      c.font = `500 ${26 * u}px ${FONT}`;
      c.fillStyle = hex(p.ink, 0.7);
      c.fillText(S.brand, pad + 52 * u, by);
    }

    const description = [o.showLabel && o.label ? `${S.soberFrom} ${o.label}` : "", plural("day", elapsed), o.showBreakdown && (b.years || b.months) ? window.CommittedTools.formatBreakdown(b) : "", ...footerLines].filter(Boolean).join(". ");
    canvas.setAttribute("aria-label", description);
    summary.textContent = start ? description : "";
  }

  function fileName() {
    return `${S.fileName}-${number.format(D.daysBetween(start, D.today())).replace(/\D/g, "")}.png`;
  }

  function toBlob() {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  downloadButton.addEventListener("click", async () => {
    if (!start) return;
    const blob = await toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  if (navigator.canShare) {
    shareButton.hidden = false;
    shareButton.addEventListener("click", async () => {
      if (!start) return;
      const file = new File([await toBlob()], fileName(), { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file] }); } catch (e) { /* cancelled */ }
      }
    });
  }

  function useDate() {
    error.textContent = "";
    if (!input.value) { start = null; downloadButton.disabled = true; shareButton.disabled = true; render(); return; }
    const read = readDate(input);
    if (read.error) {
      error.textContent = read.error;
      input.setAttribute("aria-invalid", "true");
      return;
    }
    input.removeAttribute("aria-invalid");
    start = read.value;
    downloadButton.disabled = false;
    shareButton.disabled = false;
    render();
  }

  form.addEventListener("submit", (event) => { event.preventDefault(); useDate(); });
  input.addEventListener("change", useDate);
  form.addEventListener("input", (event) => { if (event.target !== input) render(); });
  form.addEventListener("change", (event) => { if (event.target !== input) render(); });

  const carried = takeCarried();
  if (carried) input.value = D.format(carried);

  const ready = document.fonts && document.fonts.load
    ? Promise.all([document.fonts.load(`300 100px ${FONT}`), document.fonts.load(`600 20px ${FONT}`)]).catch(() => {})
    : Promise.resolve();
  ready.then(() => (input.value ? useDate() : render()));
})();
