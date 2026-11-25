// The synthetic demo commitments every piece of artwork shows. Never real user data: these are the
// App Store screenshot seed's commitments (Committed/Features/Settings/ScreenshotSeeder.swift), with
// their spans measured back from one fixed date so every render is identical.
//
// AS_OF is New Year's Eve 2026, for the New Year featuring push. Alcohol is then 4 years, 3 months and
// 19 days in (it started Sep 12, 2022), so its hero reads "4 YEARS" and its breakdown has no zeros.
// Change AS_OF and every piece moves together.

export const AS_OF = '2026-12-31';

export const COMMITMENTS = [
  {
    id: 'alcohol',
    nameKey: 'demo.alcohol',
    prefixKey: 'prefix.soberFrom',
    daysAgo: 1571, // Sep 12, 2022 → Dec 31, 2026
    style: 'matrix',
    unit: 'auto', // the hero reads "4 YEARS"
    customs: [
      { titleKey: 'demo.firstNewYear', day: 18 },
      { titleKey: 'demo.wedding', day: 1161 },
    ],
  },
  {
    id: 'nicotine',
    nameKey: 'demo.nicotine',
    prefixKey: 'prefix.freeFrom',
    daysAgo: 212,
    style: 'sky',
    unit: 'days',
  },
  {
    id: 'sugar',
    nameKey: 'demo.sugar',
    prefixKey: 'prefix.noMore',
    daysAgo: 96,
    style: 'ledger',
    unit: 'days',
  },
];
