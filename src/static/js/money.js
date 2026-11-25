/* Money saved: (days kept) × (what you used to spend per day). Everything stays on the page. */
(function () {
  const form = document.querySelector("[data-money-form]");
  if (!form) return;
  const { S, D, locale, plural, milestoneName, formatDay, fill, readDate, setMax, takeCarried } = window.CommittedTools;
  const input = form.querySelector("[data-date-input]");
  const error = form.querySelector("[data-error]");
  const $ = (n) => document.querySelector(`[data-${n}]`);
  setMax(input, D.today());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const read = readDate(input);
    if (read.error) { error.textContent = read.error; input.focus(); return; }
    const amount = parseFloat(String(form.amount.value).replace(",", "."));
    if (!(amount > 0)) { error.textContent = S.amountRequired; form.amount.focus(); return; }
    const perDay = amount / parseFloat(form.period.value);
    const money = new Intl.NumberFormat(locale, { style: "currency", currency: form.currency.value, maximumFractionDigits: 0 });
    const start = read.value;
    const today = D.today();
    const days = D.daysBetween(start, today);
    const next = D.upcoming(start, today)[0];
    $("total").textContent = money.format(perDay * days);
    $("since").textContent = `${fill(S.savedSince, { date: formatDay(start) })} · ${plural("day", days)}`;
    const stats = [
      [fill(S.byNext, { name: milestoneName(next) }), perDay * next.day],
      [S.perMonth, perDay * 30.436875],
      [S.perYear, perDay * 365.2425]
    ];
    if (next.kind !== "years" || next.value !== 1) {
      const year = D.milestones(start).find((m) => m.kind === "years" && m.value === 1);
      if (year.day > days) stats.splice(1, 0, [S.byYear, perDay * year.day]);
    }
    $("stats").innerHTML = "";
    stats.forEach(([label, value]) => {
      const div = document.createElement("div");
      div.innerHTML = "<dt></dt><dd></dd>";
      div.children[0].textContent = label;
      div.children[1].textContent = money.format(value);
      $("stats").appendChild(div);
    });
    $("empty").hidden = true;
    $("output").hidden = false;
  });
  const carried = takeCarried();
  if (carried) input.value = D.format(carried);
})();
