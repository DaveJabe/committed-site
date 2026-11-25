// Output specifications. Apple's numbers were read from Apple's own documentation on 2026-11-25; the
// `source` on each entry is where to re-check them. Re-verify before each submission season: Apple
// adds sizes (the iOS 27 creative assets are new this year).
//
// `safe` is the "art safe area" as [x, y, width, height] in canvas pixels. Anything an element marks as
// `data-key` (a headline, a widget, a device) must sit inside it; render.mjs fails the job otherwise.
// `display` is the narrowest width, in CSS points, the asset is shown at, so render.mjs can check that
// the smallest text still reads at that size (`minTextPt`).

const CREATIVE = 'https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications/';
const SCREENSHOTS = 'https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/';

export const SPECS = {
  // App Store creative assets (iOS 27): product page header and search results art. PNG/JPEG, no alpha.
  appStoreHeader: {
    label: 'App Store product page header (21:9)',
    width: 3840,
    height: 1646,
    safe: [1097, 493, 1646, 661],
    formats: ['png'],
    alpha: false,
    display: 390,
    minTextPt: 10,
    source: CREATIVE,
  },
  appStoreSearch: {
    label: 'App Store search results (3:2)',
    width: 3840,
    height: 2560,
    safe: [836, 765, 2168, 1030],
    formats: ['png', 'jpg'],
    alpha: false,
    display: 360,
    minTextPt: 10,
    source: CREATIVE,
  },
  appStoreUniversal: {
    label: 'App Store universal creative (16:9, both placements)',
    width: 5244,
    height: 2950,
    safe: [1921, 660, 1402, 962],
    formats: ['png'],
    alpha: false,
    display: 390,
    minTextPt: 10,
    source: CREATIVE,
  },
  inAppEventCard: {
    label: 'In-App Event card (16:9)',
    width: 1920,
    height: 1080,
    formats: ['png', 'jpg'],
    alpha: false,
    display: 360,
    minTextPt: 10,
    source: CREATIVE,
  },
  // Screenshots (captures are checked against these, never generated).
  iphone69: { label: 'iPhone 6.9" screenshot', sizes: [[1320, 2868], [1290, 2796], [1260, 2736]], alpha: false, source: SCREENSHOTS },
  iphone61: { label: 'iPhone 6.1" screenshot (required set)', sizes: [[1206, 2622], [1179, 2556]], alpha: false, source: SCREENSHOTS },
  mac: { label: 'Mac screenshot (16:10)', sizes: [[2880, 1800], [2560, 1600], [1440, 900], [1280, 800]], alpha: false, source: SCREENSHOTS },
  watch: {
    label: 'Apple Watch screenshot',
    sizes: [[422, 514], [410, 502], [416, 496], [396, 484], [368, 448], [312, 390]],
    alpha: false,
    source: SCREENSHOTS,
  },

  // Web and social. Open Graph: 1200×630 is the size Facebook, LinkedIn, iMessage and X all crop well.
  openGraph: { label: 'Open Graph link preview', width: 1200, height: 630, formats: ['png'], alpha: false, display: 360, minTextPt: 8 },
  websiteHero: { label: 'Website hero composition', width: 2400, height: 1500, formats: ['png'], alpha: true, display: 360, minTextPt: 6 },
  socialSquare: { label: 'Social square (Instagram, Threads)', width: 1080, height: 1080, formats: ['png'], alpha: false, display: 340, minTextPt: 8 },
  socialStory: {
    label: 'Social story (9:16)',
    width: 1080,
    height: 1920,
    // Instagram and TikTok overlay the top ~250 px and bottom ~340 px of a story.
    safe: [64, 250, 952, 1330],
    formats: ['png'],
    alpha: false,
    display: 340,
    minTextPt: 8,
  },
  socialLandscape: { label: 'Social landscape (16:9)', width: 1600, height: 900, formats: ['png'], alpha: false, display: 400, minTextPt: 8 },
  editorial: { label: 'Editorial key art, no text (16:9, 4K)', width: 3840, height: 2160, formats: ['png'], alpha: false },
  macArtwork: { label: 'Mac desktop artwork (16:10)', width: 2880, height: 1800, formats: ['png'], alpha: false, display: 640, minTextPt: 7 },
};
