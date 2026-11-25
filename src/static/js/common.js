/* Shared helpers for the web tools. Nothing here stores or sends anything. */
(function () {
  const D = window.CommittedDates;
  const S = JSON.parse((document.getElementById("tool-strings") || { textContent: "{}" }).textContent || "{}");
  const locale = S.locale || document.documentElement.lang || "en-US";
  const number = new Intl.NumberFormat(locale);

  const plural = (unit, n) => `${number.format(n)} ${(S[unit] || [unit, unit + "s"])[n === 1 ? 0 : 1]}`;
  const unitFor = { days: "day", months: "month", years: "year" };

  function milestoneName(m) {
    return plural(unitFor[m.kind], m.value);
  }

  function toDate(value) {
    return new Date(Date.UTC(value.y, value.m - 1, value.d, 12));
  }

  function formatDay(value, style = "long") {
    const options = style === "long"
      ? { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
      : style === "weekday"
        ? { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
        : { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" };
    return new Intl.DateTimeFormat(locale, options).format(toDate(value));
  }

  function formatBreakdown(b) {
    const parts = [];
    if (b.years) parts.push(plural("year", b.years));
    if (b.months) parts.push(plural("month", b.months));
    if (b.days || !parts.length) parts.push(plural("day", b.days));
    return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(parts);
  }

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
  }

  /** Reads and validates a date input. Returns { value } or { error }. */
  function readDate(input, { allowFuture = false, maxYearsAhead = 1 } = {}) {
    if (!input.value) return { error: S.required };
    const value = D.parse(input.value);
    if (!value) return { error: S.invalid };
    const today = D.today();
    if (!allowFuture && D.compare(value, today) > 0) return { error: S.future };
    if (allowFuture && D.compare(value, D.addYears(today, maxYearsAhead)) > 0) return { error: S.tooFar };
    return { value };
  }

  function setMax(input, value) {
    input.max = D.format(value);
  }

  /**
   * Carrying a date between tools happens only when someone clicks a [data-carry] link: the date
   * rides in the URL fragment (which browsers never send to a server), and the page that receives it
   * removes it from the address bar straight away.
   */
  function wireCarry(getValue) {
    document.querySelectorAll("[data-carry]").forEach((link) => {
      link.addEventListener("click", () => {
        const value = getValue();
        if (!value) return;
        const base = link.getAttribute("href").split("#")[0];
        link.setAttribute("href", `${base}#d=${D.format(value)}`);
      });
    });
  }

  function takeCarried() {
    const match = /^#d=(\d{4}-\d{2}-\d{2})$/.exec(location.hash);
    if (!match) return null;
    history.replaceState(null, "", location.pathname + location.search);
    return D.parse(match[1]);
  }

  window.CommittedTools = { S, D, locale, number, plural, milestoneName, formatDay, formatBreakdown, fill, readDate, setMax, wireCarry, takeCarried, toDate };
})();
