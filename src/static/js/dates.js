/*
 * Committed date math for the web tools, ported from the native app so the site and the app agree.
 *
 * The app's "date only" commitments (the ones you start by picking a day) store the start as noon UTC
 * and read "today" as the device's local calendar day, then do all arithmetic in a fixed UTC Gregorian
 * calendar (CommittedKit ElapsedTimeBreakdown.forCommitment). Doing the same here means a day is
 * always a calendar day: daylight-saving changes and travel never add or drop one.
 *
 * Every value in this file is a plain calendar day {y, m, d} (m is 1–12). No Date object carries a
 * time zone into the math; only today() reads the device clock, in local time.
 *
 * Milestones follow CommittedKit BuiltInMilestones.ladder: days 1, 7, 14, 21, 30, 60, 90, 100;
 * months 6, 9, 18, 30, 42; years 1 to 60, then every year after. Months and years add on the
 * calendar and clamp to the end of a shorter month, as Foundation's Calendar.date(byAdding:) does:
 * Jan 31 + 1 month = Feb 28 (or 29), and Feb 29 + 1 year = Feb 28.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CommittedDates = api;
})(typeof self !== "undefined" ? self : this, function () {
  const DAY_MS = 86400000;

  const day = (y, m, d) => ({ y, m, d });

  function serial(value) {
    return Date.UTC(value.y, value.m - 1, value.d) / DAY_MS;
  }

  function fromSerial(n) {
    const date = new Date(n * DAY_MS);
    return day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  function today(now = new Date()) {
    return day(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  /** Parses "YYYY-MM-DD" (the value of an <input type="date">). Returns null if it is not a real day. */
  function parse(text) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || "").trim());
    if (!match) return null;
    const value = day(Number(match[1]), Number(match[2]), Number(match[3]));
    const check = fromSerial(serial(value));
    if (check.y !== value.y || check.m !== value.m || check.d !== value.d) return null;
    return value;
  }

  function format(value) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${String(value.y).padStart(4, "0")}-${pad(value.m)}-${pad(value.d)}`;
  }

  function compare(a, b) {
    return serial(a) - serial(b);
  }

  function daysBetween(start, end) {
    return serial(end) - serial(start);
  }

  function addDays(value, days) {
    return fromSerial(serial(value) + days);
  }

  function daysInMonth(y, m) {
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
  }

  function addMonths(value, months) {
    const index = value.y * 12 + (value.m - 1) + months;
    const y = Math.floor(index / 12);
    const m = index - y * 12 + 1;
    return day(y, m, Math.min(value.d, daysInMonth(y, m)));
  }

  function addYears(value, years) {
    return addMonths(value, years * 12);
  }

  /** Years, months and days from start to end, each step a calendar addition from the start. */
  function breakdown(start, end) {
    if (compare(end, start) < 0) return { years: 0, months: 0, days: 0, totalDays: daysBetween(start, end) };
    let years = end.y - start.y;
    while (years > 0 && compare(addYears(start, years), end) > 0) years -= 1;
    let months = (end.y - start.y) * 12 + (end.m - start.m) - years * 12;
    while (months > 0 && compare(addMonths(start, years * 12 + months), end) > 0) months -= 1;
    const anchor = addMonths(start, years * 12 + months);
    return { years, months, days: daysBetween(anchor, end), totalDays: daysBetween(start, end) };
  }

  const LADDER = (() => {
    const items = [];
    [1, 7, 14, 21, 30, 60, 90, 100].forEach((value) => items.push({ kind: "days", value }));
    [6, 9, 18, 30, 42].forEach((value) => items.push({ kind: "months", value }));
    for (let value = 1; value <= 60; value += 1) items.push({ kind: "years", value });
    return items;
  })();

  function milestoneDate(start, milestone) {
    if (milestone.kind === "days") return addDays(start, milestone.value);
    if (milestone.kind === "months") return addMonths(start, milestone.value);
    return addYears(start, milestone.value);
  }

  /**
   * Every built-in milestone with its calendar date and day number, in date order. Past the 60-year
   * ladder the app keeps naming whole years, so `throughYears` can extend it.
   */
  function milestones(start, throughYears = 60) {
    const ladder = LADDER.slice();
    for (let value = 61; value <= throughYears; value += 1) ladder.push({ kind: "years", value });
    return ladder
      .map((milestone) => {
        const date = milestoneDate(start, milestone);
        return { ...milestone, date, day: daysBetween(start, date) };
      })
      .sort((a, b) => a.day - b.day || order(a) - order(b));
  }

  const order = (m) => ({ days: 0, months: 1, years: 2 })[m.kind];

  /** Milestones reached on or before `end` (a milestone is reached on its own day). */
  function reached(start, end) {
    const elapsed = daysBetween(start, end);
    return milestones(start, Math.max(60, end.y - start.y + 1)).filter((m) => m.day <= elapsed);
  }

  /** The next milestone strictly after `end`, and the ones after it. */
  function upcoming(start, end, count = 1) {
    const elapsed = daysBetween(start, end);
    return milestones(start, Math.max(60, end.y - start.y + count + 2))
      .filter((m) => m.day > elapsed)
      .slice(0, count);
  }

  return {
    day,
    today,
    parse,
    format,
    compare,
    daysBetween,
    addDays,
    addMonths,
    addYears,
    daysInMonth,
    breakdown,
    milestones,
    reached,
    upcoming,
    LADDER
  };
});
