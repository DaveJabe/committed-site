/* Start-date countdown: days until day one (the app allows a start up to a year ahead), and the first milestones. */
(function () {
  const form = document.querySelector("[data-countdown-form]");
  if (!form) return;
  const { S, D, number, plural, milestoneName, formatDay, fill, readDate, setMax } = window.CommittedTools;
  const input = form.querySelector("[data-date-input]");
  const error = form.querySelector("[data-error]");
  const $ = (n) => document.querySelector(`[data-${n}]`);
  const today = D.today();
  input.min = D.format(today);
  setMax(input, D.addYears(today, 1));

  const presets = {
    "new-year": () => D.day(today.m === 1 && today.d === 1 ? today.y : today.y + 1, 1, 1),
    "next-month": () => D.addMonths(D.day(today.y, today.m, 1), 1),
    monday: () => { const weekday = new Date(Date.UTC(today.y, today.m - 1, today.d)).getUTCDay(); return D.addDays(today, ((8 - weekday) % 7) || 7); }
  };
  document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => {
    input.value = D.format(presets[button.dataset.preset]());
    form.requestSubmit();
  }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const read = readDate(input, { allowFuture: true });
    if (read.error) { error.textContent = read.error; input.setAttribute("aria-invalid", "true"); input.focus(); return; }
    input.removeAttribute("aria-invalid");
    const start = read.value;
    const days = D.daysBetween(D.today(), start);
    $("days").textContent = number.format(Math.max(0, days));
    $("days-label").textContent = days > 0 ? S.daysUntil[days === 1 ? 0 : 1] : days === 0 ? S.startsToday : fill(S.alreadyStarted, { days: plural("day", -days) });
    $("start").textContent = fill(S.startsOn, { date: formatDay(start, "weekday") });
    $("first-title").textContent = S.firstMilestones;
    const rows = $("rows");
    rows.innerHTML = "";
    D.milestones(start).slice(0, 10).forEach((m) => {
      const tr = document.createElement("tr");
      tr.className = "is-future";
      tr.innerHTML = "<td></td><td></td>";
      tr.children[0].textContent = milestoneName(m);
      tr.children[1].textContent = formatDay(m.date, "short");
      rows.appendChild(tr);
    });
    $("empty").hidden = true;
    $("output").hidden = false;
  });
})();
