# Committed artwork pipeline

One command renders every piece of promotional artwork for Committed, in English and Spanish, from the
app's own palettes, fonts, visualizations and widget layouts:

```sh
node artwork/render.mjs                    # ~4 minutes: every image into artwork/out/, plus report.json and index.html
node artwork/presskit.mjs                  # press-kit-en/, press-kit-es/ and their zips
node artwork/export-site.mjs src/static    # copies OG cards, heroes and press kits under the names the site build uses
```

Needs Node 18+ and Playwright's Chromium (`npm i -g playwright && npx playwright install chromium` on a
fresh machine) and ImageMagick (`brew install imagemagick`). Useful flags: `--only og/` renders the jobs
whose id contains that text, `--out <folder>` writes elsewhere, `--verify` renders everything twice and
fails if a single pixel differs.

`artwork/out/` is not committed. Open `artwork/out/index.html` to review a run.

## What it makes

| Folder | Pieces | Size |
|---|---|---|
| `appstore/header/` | Product page header art (iOS 27), 4 directions × 2 languages | 3840 × 1646 |
| `appstore/search/` | Search results art (iOS 27), 4 directions × 2 languages | 3840 × 2560 |
| `appstore/universal/` | One asset for both placements, 2 directions × 2 languages | 5244 × 2950 |
| `appstore/event/` | In-App Event card for a New Year event | 1920 × 1080 |
| `web/` | Website hero: iPhone Home Screen widgets, Mac desktop widgets, Apple Watch (solid and transparent) | 2400 × 1500 |
| `og/` | Open Graph link previews for each of the website's 14 pages (ids in `config/jobs.mjs`) | 1200 × 630 |
| `social/` | Square, story and landscape posts, 4 directions × 2 languages | 1080², 1080 × 1920, 1600 × 900 |
| `editorial/` | Text-free key art for press and Apple featuring | 3840 × 2160 |
| `mac/` | Mac desktop widgets artwork | 2880 × 1800 |

## Creative directions

- **field**: *Every day counts.* Four years of Matrix dots, the milestones in dawn.
- **sky**: *Look how far you've come.* Your Sky's constellation climbing out of the night.
- **glance**: *Progress at a glance.* The widgets, front and centre, across six themes.
- **everywhere**: *With you everywhere.* iPhone, Mac and Apple Watch together.
- **newyear**: *A new year, day by day.* 365 dots, day one lit (seasonal).

## How it stays honest

- **Demo data only.** `config/demo.mjs` holds the App Store seed's synthetic commitments (Alcohol,
  Nicotine, Sugar), measured back from one fixed date. No real person's data is ever an input.
- **Drawn from the app, not imitated.** `lib/viz.mjs` ports the app's Matrix layout and the widgets'
  constellation geometry line for line; `lib/widgets.mjs` lays out the widgets from the widget
  extension's SwiftUI; `config/palettes.json` is generated from `PaletteTokens.swift`; words come from
  the app's string catalogs. Widgets use SF on device; here they use Inter, the closest openly licensed
  face. These are **renditions**. Anything presented as a screenshot (App Store screenshots, the press
  kit's screenshots) must be a **capture** of the app.
- **Claims are checked.** `config/strings.mjs` says only what the 3.1 source supports. Widgets, the
  Watch app, sync and extra themes need the Lifetime Unlock, so nothing pairs them with "free". App
  Store creative carries one short phrase and no price, URL or other platform, per Apple's guidance.
- **Every image is checked before it is written**: exact pixel size, no alpha where Apple forbids it,
  every key element inside the spec's safe area, no caption overflowing its box, and the smallest
  caption text large enough to read at the size the image is actually shown (`config/specs.mjs`
  records each spec's source and display width). A failed check fails the run.
- **Deterministic.** Fonts are embedded, the network is blocked, animation is off and every random
  placement is seeded, so a commit renders the same bytes every time (`--verify` proves it).

## Keeping it in sync with the app

```sh
node artwork/scripts/sync-from-app.mjs ../Committed   # palettes.json and the shipping app icons
```

## Genuine captures

- **iPhone**: in the app repo, `scripts/capture-studio-frames.sh <iPhone 17 Pro Max simulator UDID>
  <folder>` captures every Screenshot Studio frame at 1320 × 2868, English and Spanish. Copy the `en/`
  and `es/` folders to `artwork/captures/studio/`; the press kit then uses them instead of the website's
  598 × 1300 frames.
- **Mac**: the Mac Screenshot Studio (Debug menu) frames, captured at 2880 × 1800 and named
  `Mac_<N>_<Name>_<en|es>.png`, are imported with
  `node artwork/scripts/import-mac-captures.mjs <folder>` into `artwork/captures/mac/{en,es}/NN-name.png`
  (flattened: App Store screenshots may not carry alpha). The 3.1 set is committed. The press kit carries
  them whole plus the bare app window cut from frames 01, 02, 05 and 06, and the website's Mac page hero is
  the window from 01-matrix (`lib/captures.mjs` holds the window's rectangle and fails the run if a new
  Studio layout moves it).

## Specs

Apple's numbers in `config/specs.mjs` were read from Apple's documentation on 25 Nov 2026:
[creative assets](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications/),
[screenshots](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/),
[asset best practices](https://developer.apple.com/app-store/asset-best-practices/). Check them again
before each submission.
