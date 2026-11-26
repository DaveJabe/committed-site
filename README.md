# Committed website

The marketing site, free tools and legal pages for Committed, served by GitHub Pages at
https://committedtracker.app/ (the old https://davejabe.github.io/committed-site/ addresses redirect there).

## Build and preview

Needs Node 20 or later. There are no dependencies to install.

```sh
npm test          # date math tests in 13 time zones
npm run build     # writes dist/ and fails on any broken internal link or missing asset
npm run preview   # serves dist/ at http://localhost:4321/
```

`dist/` is generated and not committed. The deploy workflow builds it on every push to `main`; the Check workflow
builds it (at the domain root and under a project path) on pull requests and never deploys.

## Configuration

`site.config.mjs` is the only place the origin and base path live. Environment variables override it:

| Variable | Default | Meaning |
|---|---|---|
| `SITE_ORIGIN` | `https://committedtracker.app` | Scheme and host for canonical and Open Graph URLs |
| `SITE_BASE_PATH` | `/` | Path the site is served under |
| `SITE_CUSTOM_DOMAIN` | `committedtracker.app` | Written to the `CNAME` file; `none` leaves it out |

In GitHub Actions they come from repository **Variables** of the same names. The move to the domain is described in
[docs/DOMAIN-MIGRATION.md](docs/DOMAIN-MIGRATION.md). The audit behind this rebuild is [docs/AUDIT.md](docs/AUDIT.md).

## Where things live

- `src/pages/*.mjs`: one module per group of pages. Each page has an `en` and `es` path, title and description,
  and a `render(ctx)`. Links go through `ctx.link(pageId)`, assets through `ctx.asset(path)`, so nothing hard-codes
  the base path.
- `src/lib/`: layout (head, header, footer, App Store links), shared components (widgets, Matrix, Ledger, watch,
  pricing, FAQ) and tool helpers.
- `src/static/`: copied as is. `js/dates.js` is the app's date math and milestone ladder; `js/constellation.js`
  is the Sky geometry from the widgets.
- `src/content/`: the privacy policy text, kept verbatim.

Product facts (prices, entitlements, requirements, version) are in `site.config.mjs` and `src/lib/components.mjs`.
Check them against the app's `Entitlements.swift` and the App Store listing when a release changes them.

## Dropping in artwork

The build uses these files when they exist and falls back otherwise, so no code change is needed:

| File in `src/static/` | Used for |
|---|---|
| `social/og-<pageId>.png`, `social/og-<pageId>-es.png` (1200 × 630) | That page's link preview (falls back to `social/og-default.png`) |
| `assets/mac/committed-mac-hero.webp`, `-es.webp` | The Mac page hero (falls back to an HTML desktop) |
| `press/committed-press-kit.zip`, `-es.zip` | The download button on the press page |

All sample commitments on the site are synthetic.
