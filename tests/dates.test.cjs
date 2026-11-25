// Date math tests. Run with: npm test (which runs this file under several time zones).
// Expected values come from the native app's rules (CommittedKit ElapsedTimeBreakdown, BuiltInMilestones,
// Foundation Calendar.date(byAdding:) clamping) and its own test cases for leap years and daylight saving.
const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/static/js/dates.js");

const d = (text) => D.parse(text);

test("parse rejects impossible days", () => {
  assert.equal(D.parse("2023-02-29"), null);
  assert.equal(D.parse("2024-13-01"), null);
  assert.equal(D.parse("nonsense"), null);
  assert.deepEqual(D.parse("2024-02-29"), { y: 2024, m: 2, d: 29 });
});

test("day counts are calendar days, start is day zero", () => {
  assert.equal(D.daysBetween(d("2026-01-01"), d("2026-01-01")), 0);
  assert.equal(D.daysBetween(d("2026-01-01"), d("2026-01-02")), 1);
  assert.equal(D.daysBetween(d("2024-01-01"), d("2025-01-01")), 366);
  assert.equal(D.daysBetween(d("2023-01-01"), d("2024-01-01")), 365);
});

test("daylight-saving transitions never add or drop a day", () => {
  // US spring forward 8 Mar 2026, fall back 1 Nov 2026; EU 29 Mar / 25 Oct 2026; Southern hemisphere 5 Apr 2026.
  assert.equal(D.daysBetween(d("2026-03-07"), d("2026-03-09")), 2);
  assert.equal(D.daysBetween(d("2026-10-31"), d("2026-11-02")), 2);
  assert.equal(D.daysBetween(d("2026-03-28"), d("2026-03-30")), 2);
  assert.equal(D.daysBetween(d("2026-04-04"), d("2026-04-06")), 2);
  assert.deepEqual(D.addDays(d("2026-03-07"), 1), d("2026-03-08"));
  assert.deepEqual(D.addDays(d("2026-11-01"), 1), d("2026-11-02"));
});

test("today reads the local calendar day, including across DST", () => {
  const local = new Date(2026, 2, 8, 2, 30); // the skipped hour in US zones resolves to the same local day
  assert.deepEqual(D.today(local), { y: 2026, m: 3, d: 8 });
  const lateNight = new Date(2026, 10, 1, 23, 59);
  assert.deepEqual(D.today(lateNight), { y: 2026, m: 11, d: 1 });
});

test("months and years clamp to the end of a shorter month", () => {
  assert.deepEqual(D.addMonths(d("2026-01-31"), 1), d("2026-02-28"));
  assert.deepEqual(D.addMonths(d("2024-01-31"), 1), d("2024-02-29"));
  assert.deepEqual(D.addYears(d("2024-02-29"), 1), d("2025-02-28"));
  assert.deepEqual(D.addYears(d("2024-02-29"), 4), d("2028-02-29"));
  assert.deepEqual(D.addMonths(d("2025-08-31"), 6), d("2026-02-28"));
  assert.deepEqual(D.addMonths(d("2026-12-15"), 1), d("2027-01-15"));
});

test("breakdown in years, months and days", () => {
  assert.deepEqual(D.breakdown(d("2022-11-25"), d("2026-11-25")), { years: 4, months: 0, days: 0, totalDays: 1461 });
  assert.deepEqual(D.breakdown(d("2026-01-31"), d("2026-03-01")), { years: 0, months: 1, days: 1, totalDays: 29 });
  assert.deepEqual(D.breakdown(d("2024-02-29"), d("2025-02-28")), { years: 1, months: 0, days: 0, totalDays: 365 });
  assert.deepEqual(D.breakdown(d("2024-02-29"), d("2025-03-01")), { years: 1, months: 0, days: 1, totalDays: 366 });
  assert.deepEqual(D.breakdown(d("2026-11-24"), d("2026-11-25")), { years: 0, months: 0, days: 1, totalDays: 1 });
  assert.deepEqual(D.breakdown(d("2025-12-31"), d("2026-11-30")), { years: 0, months: 11, days: 0, totalDays: 334 });
});

test("the milestone ladder matches the app", () => {
  const start = d("2026-01-31");
  const list = D.milestones(start).slice(0, 15).map((m) => `${m.value} ${m.kind}@${m.day}`);
  assert.deepEqual(list, [
    "1 days@1", "7 days@7", "14 days@14", "21 days@21", "30 days@30", "60 days@60", "90 days@90",
    "100 days@100", "6 months@181", "9 months@273", "1 years@365", "18 months@546", "2 years@730",
    "30 months@912", "3 years@1096"
  ]);
});

test("next milestone and reached milestones", () => {
  const start = d("2026-08-27");
  const now = d("2026-11-25"); // day 90
  assert.equal(D.daysBetween(start, now), 90);
  const next = D.upcoming(start, now, 2);
  assert.equal(next[0].kind, "days");
  assert.equal(next[0].value, 100);
  assert.deepEqual(next[0].date, d("2026-12-05"));
  assert.equal(next[1].kind, "months");
  assert.equal(next[1].value, 6);
  assert.deepEqual(next[1].date, d("2027-02-27"));
  assert.deepEqual(D.reached(start, now).map((m) => m.day), [1, 7, 14, 21, 30, 60, 90]);
});

test("a leap-day start reaches its anniversaries on 28 February", () => {
  const start = d("2024-02-29");
  const years = D.milestones(start).filter((m) => m.kind === "years").slice(0, 4).map((m) => D.format(m.date));
  assert.deepEqual(years, ["2025-02-28", "2026-02-28", "2027-02-28", "2028-02-29"]);
});

test("past the 60-year ladder, milestones keep coming every year", () => {
  const start = d("1960-01-01");
  const next = D.upcoming(start, d("2026-11-25"))[0];
  assert.equal(next.kind, "years");
  assert.equal(next.value, 67);
});
