/* Sobriety date calculator. Date math and milestones come from dates.js, which mirrors the app. */
(function () {
  const form = document.querySelector("[data-sobriety-calculator]");
  if (!form) return;
  const { S, D, number, plural, milestoneName, formatDay, formatBreakdown, fill, readDate, setMax, wireCarry, takeCarried } = window.CommittedTools;

  const input = form.querySelector("[data-date-input]");
  const error = form.querySelector("[data-error]");
  const results = document.querySelector("[data-results]");
  const $ = (name) => document.querySelector(`[data-${name}]`);
  const dotField = $("dot-field");
  const canvas = $("dot-canvas");
  let current = null;

  setMax(input, D.today());

  function render(start) {
    const today = D.today();
    const total = D.daysBetween(start, today);
    const next = D.upcoming(start, today)[0];
    const reached = D.reached(start, today);
    const previous = reached.length ? reached[reached.length - 1] : null;
    const reachedToday = previous && previous.day === total;

    $("total-days").textContent = number.format(total);
    $("day-label").textContent = total === 0 ? S.zeroDays : (S.day || ["day", "days"])[total === 1 ? 0 : 1];
    $("breakdown").textContent = total === 0 ? "" : formatBreakdown(D.breakdown(start, today));
    $("since").textContent = fill(S.since, { date: formatDay(start) });
    $("next-label").textContent = reachedToday ? fill(S.reachedToday, { name: milestoneName(previous) }) : fill(S.next, { name: milestoneName(next) });
    $("next-date").textContent = reachedToday
      ? fill(S.next, { name: milestoneName(next) }) + " · " + formatDay(next.date)
      : fill(S.arrives, { date: formatDay(next.date), distance: plural("day", next.day - total) });
    const from = previous ? previous.day : 0;
    $("next-progress").style.width = `${Math.round(((total - from) / (next.day - from)) * 100)}%`;
    results.hidden = false;
    const empty = $("calc-empty");
    if (empty) empty.hidden = true;

    // Matrix: one dot per day; dot i is day i + 1, the last one is today (MatrixLayout).
    dotState = { count: Math.max(1, total), milestones: new Set(reached.map((m) => m.day - 1)) };
    dotField.hidden = false;
    draw(true);
  }

  // ---- Dot field ---------------------------------------------------------------------------------
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let dotState = null;
  let frame = 0;

  function layout(count, width) {
    const budget = Math.min(320, Math.max(120, Math.sqrt(count) * 6));
    for (let spacing = 22; spacing > 3; spacing -= 0.25) {
      const columns = Math.max(1, Math.floor(width / spacing));
      const rows = Math.ceil(count / columns);
      if (rows * spacing <= budget) return { spacing, columns, rows };
    }
    const columns = Math.max(1, Math.floor(width / 3));
    return { spacing: 3, columns, rows: Math.ceil(count / columns) };
  }

  function draw(animate) {
    if (!dotState) return;
    cancelAnimationFrame(frame);
    const width = canvas.clientWidth;
    if (width <= 0) return;
    const { count, milestones } = dotState;
    const { spacing, columns, rows } = layout(count, width);
    const ratio = window.devicePixelRatio || 1;
    const height = rows * spacing;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    dotState.width = width;
    const c = canvas.getContext("2d");
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
    const styles = getComputedStyle(canvas);
    const accent = styles.getPropertyValue("--accent").trim() || "#99d6c5";
    const ring = styles.getPropertyValue("--ink-faint").trim() || "#8a9395";
    const dawn = "#edd2a4";
    const dayR = Math.max(0.7, spacing * 0.21);
    const msR = Math.max(1.2, spacing * 0.3);
    const at = (i) => ({ x: (i % columns) * spacing + spacing / 2, y: Math.floor(i / columns) * spacing + spacing / 2 });
    const last = count - 1;

    const range = (from, to) => {
      c.beginPath();
      for (let i = from; i < to; i += 1) {
        if (i === last || milestones.has(i)) continue;
        const p = at(i);
        c.moveTo(p.x + dayR, p.y);
        c.arc(p.x, p.y, dayR, 0, Math.PI * 2);
      }
      c.globalAlpha = 0.55;
      c.fillStyle = accent;
      c.fill();
      c.beginPath();
      for (let i = from; i < to; i += 1) {
        if (i === last || !milestones.has(i)) continue;
        const p = at(i);
        c.moveTo(p.x + msR, p.y);
        c.arc(p.x, p.y, msR, 0, Math.PI * 2);
      }
      c.globalAlpha = 1;
      c.fillStyle = dawn;
      c.fill();
      if (to === count) {
        const p = at(last);
        c.beginPath();
        c.arc(p.x, p.y, Math.max(1.4, spacing * 0.24), 0, Math.PI * 2);
        c.fillStyle = milestones.has(last) ? dawn : accent;
        c.fill();
        c.beginPath();
        c.arc(p.x, p.y, Math.max(4, spacing * 0.46), 0, Math.PI * 2);
        c.lineWidth = Math.max(1, spacing * 0.07);
        c.strokeStyle = ring;
        c.stroke();
      }
    };

    c.clearRect(0, 0, width, height);
    if (!animate || reducedMotion.matches) return range(0, count);
    const duration = Math.min(1400, 500 + count * 0.6);
    const begin = performance.now();
    let drawn = 0;
    const step = (now) => {
      const progress = Math.min(1, (now - begin) / duration);
      const target = progress === 1 ? count : Math.floor(count * (1 - Math.pow(1 - progress, 3)));
      if (target > drawn) {
        range(drawn, target);
        drawn = target;
      }
      if (drawn < count) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      if (dotState && canvas.clientWidth > 0 && canvas.clientWidth !== dotState.width) draw(false);
    }).observe(canvas);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const read = readDate(input);
    if (read.error) {
      error.textContent = read.error;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    current = read.value;
    render(current);
  });

  wireCarry(() => current);
  const carried = takeCarried();
  if (carried) {
    input.value = D.format(carried);
    form.requestSubmit();
  }
})();
