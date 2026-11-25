// Demo data and the date math the artwork draws from. Everything is a pure function of the fixed
// `AS_OF` date in config/demo.mjs, so a render on any machine, on any day, produces the same pixels.
//
// The milestone ladder mirrors CommittedKit/BuiltInMilestones.swift (days 1…100, months 6…42, years
// 1…60). Months and years resolve with calendar arithmetic from the start date, the way the app's
// `Milestone.effectiveDays` does, not the 30/365 approximation.

const DAY = 86_400_000;

/** A calendar date as a UTC midnight timestamp, so no time zone or DST can shift a day count. */
export function day(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(t, n) {
  return t + n * DAY;
}

/** Calendar month addition with the day clamped to the month's length (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(t, n) {
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(d.getUTCDate(), last));
}

export function daysBetween(a, b) {
  return Math.round((b - a) / DAY);
}

export const LADDER = [
  ...[1, 7, 14, 21, 30, 60, 90, 100].map((value) => ({ kind: 'days', value })),
  ...[6, 9, 18, 30, 42].map((value) => ({ kind: 'months', value })),
  ...Array.from({ length: 60 }, (_, i) => ({ kind: 'years', value: i + 1 })),
];

/** The built-in ladder (plus any custom day offsets) resolved against a start date, sorted by day. */
export function resolvedLadder(start, customs = []) {
  const builtIn = LADDER.map((m) => {
    const days =
      m.kind === 'days' ? m.value : daysBetween(start, addMonths(start, m.kind === 'months' ? m.value : m.value * 12));
    return { ...m, days, scale: m.kind === 'years' ? 'year' : m.kind === 'months' ? 'month' : 'day' };
  });
  const custom = customs.map((c) => ({ kind: 'custom', title: c.title, days: c.days, scale: 'day' }));
  return [...builtIn, ...custom].sort((a, b) => a.days - b.days);
}

/** Elapsed whole days and the app's breakdown (years, months, days) from start to asOf. */
export function elapsed(start, asOf) {
  const totalDays = daysBetween(start, asOf);
  let years = 0;
  while (addMonths(start, (years + 1) * 12) <= asOf) years++;
  let months = 0;
  const afterYears = addMonths(start, years * 12);
  while (addMonths(afterYears, months + 1) <= asOf) months++;
  const days = daysBetween(addMonths(afterYears, months), asOf);
  return { totalDays, years, months, days, weeks: Math.floor(totalDays / 7) };
}

export function milestoneTitle(m, s) {
  if (m.kind === 'custom') return m.title;
  return s.unitCount(m.value, m.kind);
}

/** The next milestone after `asOf`, with the days remaining and its progress from the previous one. */
export function nextMilestone(start, asOf, ladder, s) {
  const elapsedDays = daysBetween(start, asOf);
  const index = ladder.findIndex((m) => m.days > elapsedDays);
  const next = ladder[index];
  const previous = index > 0 ? ladder[index - 1].days : 0;
  return {
    title: milestoneTitle(next, s),
    previousTitle: index > 0 ? milestoneTitle(ladder[index - 1], s) : '',
    remainingDays: next.days - elapsedDays,
    progress: (elapsedDays - previous) / (next.days - previous),
  };
}

/** The headline a widget shows for a unit choice: { value, unit } with the unit word localized. */
export function headline(start, asOf, unit, s) {
  const e = elapsed(start, asOf);
  if (unit === 'days') return { value: e.totalDays, unit: s.unitWord(e.totalDays, 'days') };
  if (unit === 'weeks') return { value: e.weeks, unit: s.unitWord(e.weeks, 'weeks') };
  if (unit === 'months') return { value: e.years * 12 + e.months, unit: s.unitWord(e.years * 12 + e.months, 'months') };
  if (e.years > 0) return { value: e.years, unit: s.unitWord(e.years, 'years') };
  if (e.months > 0) return { value: e.months, unit: s.unitWord(e.months, 'months') };
  return { value: e.totalDays, unit: s.unitWord(e.totalDays, 'days') };
}

/** A small seeded PRNG (mulberry32) so every "random" star or speck lands in the same place each run. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resolves a demo commitment (config/demo.mjs) into everything a renderer needs, in one language. */
export function resolveCommitment(c, asOf, s) {
  const start = addDays(asOf, -c.daysAgo);
  const customs = (c.customs ?? []).map((k) => ({ title: s.t(k.titleKey), days: k.day }));
  const ladder = resolvedLadder(start, customs);
  return {
    id: c.id,
    name: s.t(c.nameKey),
    prefix: s.t(c.prefixKey),
    start,
    asOf,
    ladder,
    elapsed: elapsed(start, asOf),
    dayCount: daysBetween(start, asOf) + 1,
    milestoneDays: new Set(ladder.map((m) => m.days)),
    next: nextMilestone(start, asOf, ladder, s),
    headline: (unit = c.unit ?? 'days') => headline(start, asOf, unit, s),
    since: s.date(start),
  };
}
