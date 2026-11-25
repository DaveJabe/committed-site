// What to render. Each job names a spec (config/specs.mjs), a composition (templates/compositions.mjs)
// and a locale; render.mjs does the rest. Output paths are relative to the output folder.
//
// `provenance` says what the pixels are, for the report and the press kit:
//   rendition  drawn by this pipeline from the app's own geometry, tokens and strings
//   capture    a genuine screenshot (only ever copied and checked, never redrawn)

import { LOCALES } from './strings.mjs';

const DIRECTIONS = ['field', 'sky', 'glance', 'everywhere'];
const SOCIAL_DIRECTIONS = ['field', 'sky', 'glance', 'newyear'];
// The website's page ids (committed-site src: social/og-<pageId>.png).
export const OG_PAGES = ['calculator', 'product', 'iphone', 'mac', 'watch', 'widgets', 'whats-new', 'about', 'press', 'tools', 'progress-image', 'milestones', 'countdown', 'money-saved'];

export function jobs() {
  const list = [];
  for (const locale of LOCALES) {
    for (const d of DIRECTIONS) {
      list.push({ id: `appstore/header/${d}-${locale}.png`, spec: 'appStoreHeader', composition: d, locale, use: 'App Store product page header (iOS 27)' });
      list.push({ id: `appstore/search/${d}-${locale}.png`, spec: 'appStoreSearch', composition: d, locale, use: 'App Store search results art (iOS 27)' });
    }
    for (const d of ['glance', 'field']) {
      list.push({ id: `appstore/universal/${d}-${locale}.png`, spec: 'appStoreUniversal', composition: d, locale, use: 'App Store creative, one asset for both placements' });
    }
    list.push({ id: `appstore/event/newyear-${locale}.png`, spec: 'inAppEventCard', composition: 'newyear', locale, use: 'In-App Event card for a New Year event, if Dave creates one' });

    list.push({ id: `web/hero-${locale}.png`, spec: 'websiteHero', composition: 'hero', locale, use: 'Website hero, #0E1315 background' });
    list.push({ id: `web/hero-${locale}-transparent.png`, spec: 'websiteHero', composition: 'hero', locale, transparent: true, use: 'Website hero, transparent background' });
    for (const page of OG_PAGES) {
      list.push({ id: `og/${page}-${locale}.png`, spec: 'openGraph', composition: 'og', page, locale, use: `Open Graph card for the ${page} page` });
    }
    for (const d of SOCIAL_DIRECTIONS) {
      list.push({ id: `social/square/${d}-${locale}.png`, spec: 'socialSquare', composition: d, locale, use: 'Instagram / Threads / Bluesky post' });
      list.push({ id: `social/story/${d}-${locale}.png`, spec: 'socialStory', composition: d, locale, use: 'Instagram / TikTok story' });
      list.push({ id: `social/landscape/${d}-${locale}.png`, spec: 'socialLandscape', composition: d, locale, use: 'X / Mastodon / LinkedIn post' });
    }
    for (const d of ['glance', 'everywhere']) {
      list.push({ id: `editorial/${d}-${locale}.png`, spec: 'editorial', composition: d, locale, text: false, use: 'Editorial key art without a headline (press, Apple featuring)' });
    }
    list.push({ id: `mac/desktop-widgets-${locale}.png`, spec: 'macArtwork', composition: 'macdesktop', locale, use: 'Mac artwork: desktop widgets (not a Mac App Store screenshot)' });
  }
  for (const d of ['field', 'sky', 'newyear']) {
    list.push({ id: `editorial/${d}.png`, spec: 'editorial', composition: d, locale: 'en', text: false, use: 'Editorial key art without text (press, Apple featuring)' });
  }
  return list.map((j) => ({ provenance: 'rendition', palette: 'mint', ...j }));
}
