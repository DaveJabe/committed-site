# Website audit and baseline (25 November 2026)

Audit of `DaveJabe/committed-site` at `7baa910` (the live site at https://davejabe.github.io/committed-site/),
checked against the app at `DaveJabe/Committed` `release-candidate-3.1` and the US App Store listing.
This records what the site was before the rebuild, what was wrong, and what this branch does about it.

## Baseline

| | Before |
|---|---|
| Source | None. `dist/` was hand-edited HTML; the workflow published `dist/` as committed. |
| Pages | 9: calculator (EN/ES), iPhone (EN/ES), Apple Watch (EN only), support (EN/ES), privacy (EN/ES) |
| Platforms named | iPhone, Apple Watch. Mac described as "Coming to Mac with version 3.0" (it shipped 14 Nov). |
| Config | `/committed-site/` and `https://davejabe.github.io/committed-site/` hard-coded ~180 times across 9 files |
| Heaviest files | `committed-apple-watch.png` 1.9 MB (unreferenced), `favicon.svg` 68 KB (a base64 PNG in an SVG), `icon-1024.png` 52 KB used as a 38 px logo |
| Analytics | None (good). Search Console verification tag present on the EN homepage. |

## Findings

### Product claims (verified against the code and App Store; facts in project memory)

1. **macOS described as upcoming.** iPhone pages said "Coming to Mac with version 3.0". Mac has been live since 3.0 (14 Nov 2026), macOS 15.2+. No Mac page, nav item, metadata or structured data existed.
2. **"iCloud backup" terminology.** iPhone page listed "Private iCloud backup"; support page "How does iCloud backup work?". Since 3.0 it is two-way **iCloud Sync** (the privacy policy was already updated; the marketing pages were not).
3. **"No developer servers".** The homepage privacy accordion said the app uses no developer servers. The 3.1 privacy policy correctly names the one exception: the Cloudflare Worker that receives feedback a person chooses to send.
4. **Entitlements incomplete or inconsistent.** Pages listed widgets, Watch, multiple and hidden commitments, custom milestones and iCloud backup as paid, but omitted themes (7 of 8 are paid), the free first custom milestone, and that Meetings/Resources and all three views are free. `Entitlements.swift` and the paywall rows are now the source for every pricing table.
5. **Milestones differed from the app.** The web calculator used 1, 7, 30, 60, 90 days, 6 and 18 months, 500 and 1,000 days and anniversaries. The app's ladder is 1, 7, 14, 21, 30, 60, 90, 100 days; 6, 9, 18, 30, 42 months; years 1 to 60. The glowing dots and "Next" line therefore disagreed with the app for most people.
6. **Structured data.** `operatingSystem` was "iOS, watchOS"; no macOS, no version, the price offer said only "free".
7. **Spanish terms.** ES pages used "Lifetime Unlock" and English view names; the app ships "Desbloqueo de por vida", "Matriz", "Tu cielo", "Registro", "Sincronización con iCloud".

### Localization

8. The Apple Watch page had no Spanish equivalent, and its "Español" link pointed at the Spanish calculator. hreflang on that page listed EN only.
9. `og:locale:alternate` was `es_ES` while the calculator formats Spanish dates for `es-MX`.

### Accessibility

10. On the homepage an `h2` ("Want to keep track?") preceded the page's `h1`.
11. The calculator method lived in a `popover` behind a 1-character "i" button (not indexable, easy to miss).
12. No skip link on the homepage, watch, support or privacy pages; nav links under 44 px tall at some widths.
13. The Watch page used a photo with a 1440 × 810 `width/height` while the `srcset` described a different file set (harmless) and the iPhone page's Watch image declared 1672 × 941.

After the rebuild, axe-core (WCAG 2 A/AA + best practices) reports **0 violations** on all 32 indexed pages in both dark and light appearance.

### Responsive layout

14. Two stylesheets (`styles.css`, `mobile.css`) with overlapping rules and five breakpoints; the header wrapped into three rows on mid-width phones. Now one stylesheet; checked at 390 px (iPhone 13) and 1280 px with no horizontal overflow on any page.

### Assets

15. See "Heaviest files" above. The 1.9 MB PNG is kept at its URL (it may be linked from elsewhere) but is not used by any page. The logo now uses a 5 KB 128 px PNG; favicons are 32 px and 180 px PNGs.

### Links, paths and configuration

16. Every internal link, asset path, canonical, hreflang, OG URL and sitemap entry hard-coded the GitHub Pages project path, so a custom domain meant editing every file by hand.
17. `robots.txt` lived at `/committed-site/robots.txt`. Crawlers only read `/robots.txt` at a host's root, so it was never used. It starts working once the site is served from a domain root.
18. Sitemap had no hreflang alternates and inconsistent `changefreq`/`priority` (both ignored by Google).
19. Cache-busting was a hand-typed `?v=20261113.3` that had to be bumped on every CSS change; now a content hash.

### Deployment

20. `.github/workflows/deploy-pages.yml` publishes on every push to `main`. Nothing checked links before publishing.

## What this branch changes

- A dependency-free build (`build.mjs`, Node 20+) generates `dist/` from `src/`. `site.config.mjs` is the only place the origin and base path live; environment variables override it. The build fails on any broken internal link or missing asset.
- The deploy workflow builds before publishing; a new `Check` workflow runs tests and two builds (current path and a custom-domain root) on pull requests and never deploys.
- `src/static/js/dates.js` ports the app's date math and milestone ladder; tests run in 13 time zones covering DST, leap days and month-end clamping.
- All existing URLs are kept. New pages are listed in the PR.
