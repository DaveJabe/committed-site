/* Milestone dates: every built-in milestone from a start date, and an optional .ics calendar file made on the device. */
(function () {
  const form = document.querySelector("[data-milestone-form]");
  if (!form) return;
  const { S, D, number, plural, milestoneName, formatDay, fill, readDate, wireCarry, takeCarried } = window.CommittedTools;
  const input = form.querySelector("[data-date-input]");
  const error = form.querySelector("[data-error]");
  const output = document.querySelector("[data-output]");
  const rows = document.querySelector("[data-rows]");
  let start = null;
  let years = 10;

  input.max = D.format(D.addYears(D.today(), 1));

  function render() {
    const today = D.today();
    const elapsed = D.daysBetween(start, today);
    const list = D.milestones(start, Math.max(60, years)).filter((m) => m.kind !== "years" || m.value <= years);
    let nextMarked = false;
    rows.innerHTML = "";
    for (const m of list) {
      const tr = document.createElement("tr");
      let state = "is-future";
      if (m.day <= elapsed) state = "is-reached";
      else if (!nextMarked) { state = "is-next"; nextMarked = true; }
      tr.className = state;
      const distance = m.day - elapsed;
      const when = state === "is-reached" ? "" : distance === 0 ? S.todayWord : fill(S.upcomingIn, { distance: plural("day", distance) });
      tr.innerHTML = `<td></td><td></td><td></td>`;
      tr.children[0].textContent = milestoneName(m);
      tr.children[1].textContent = formatDay(m.date, "short") + (when && state === "is-next" ? ` · ${when}` : "");
      tr.children[2].textContent = number.format(m.day);
      rows.appendChild(tr);
    }
    document.querySelector("[data-caption]").textContent = fill(S.since, { date: formatDay(start) });
    document.querySelector("[data-empty]").hidden = true;
    output.hidden = false;
  }

  function ics() {
    const today = D.today();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = new Date();
    const dtstamp = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}00Z`;
    const escapeText = (text) => text.replace(/[\;,]/g, (c) => `\\${c}`);
    const upcoming = D.milestones(start, Math.max(60, years)).filter((m) => D.compare(m.date, today) >= 0 && (m.kind !== "years" || m.value <= years));
    const events = upcoming.map((m, index) => {
      const day = D.format(m.date).replace(/-/g, "");
      const next = D.format(D.addDays(m.date, 1)).replace(/-/g, "");
      return ["BEGIN:VEVENT", `UID:committed-${day}-${index}@committed.local`, `DTSTAMP:${dtstamp}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${next}`, `SUMMARY:${escapeText(fill(S.icsTitle, { name: milestoneName(m) }))}`, `DESCRIPTION:${escapeText(S.icsDescription)}`, "TRANSP:TRANSPARENT", "END:VEVENT"].join("\r\n");
    });
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Committed//Milestones//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = S.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const read = readDate(input, { allowFuture: true });
    if (read.error) { error.textContent = read.error; input.setAttribute("aria-invalid", "true"); input.focus(); return; }
    input.removeAttribute("aria-invalid");
    start = read.value;
    years = Math.max(10, D.today().y - start.y + 3);
    render();
  });
  document.querySelector("[data-more]").addEventListener("click", () => { years += 10; render(); });
  document.querySelector("[data-ics]").addEventListener("click", ics);
  wireCarry(() => start);
  const carried = takeCarried();
  if (carried) { input.value = D.format(carried); form.requestSubmit(); }
})();
