// The one place the site's address lives. Every canonical URL, hreflang alternate, Open Graph URL,
// sitemap entry, robots.txt line and internal link is built from these values, so moving to a custom
// domain is a change here (or two environment variables in the deploy workflow), not a find-and-replace.
//
// Today:        origin https://davejabe.github.io, basePath /committed-site/
// Custom domain: origin https://example.com, basePath /, customDomain example.com (writes the CNAME file)
//
// Environment variables override the file, so a preview build can point anywhere:
//   SITE_ORIGIN=https://example.com SITE_BASE_PATH=/ SITE_CUSTOM_DOMAIN=example.com npm run build

const env = (name) => (process.env[name] && process.env[name].trim()) || undefined;

function normalizeBasePath(value) {
  let path = value || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}

const origin = (env("SITE_ORIGIN") || "https://davejabe.github.io").replace(/\/+$/, "");
const basePath = normalizeBasePath(env("SITE_BASE_PATH") || "/committed-site/");
const customDomain = env("SITE_CUSTOM_DOMAIN") || null;

export default {
  origin,
  basePath,
  customDomain,

  // Search engines only read robots.txt at the root of a host. Under a GitHub Pages project path the
  // file we publish is never read; it starts to count once the site is served from a domain root.
  servesHostRoot: basePath === "/",

  app: {
    name: "Committed",
    storeName: "Committed: Sobriety Tracker",
    appStoreId: "6783140621",
    // App Store Connect provider token for campaign links (ct= names the page). Not a secret.
    providerToken: "122931649",
    price: "14.99",
    priceCurrency: "USD",
    version: "3.1",
    macVersion: "3.1",
    requirements: { ios: "18.6", macos: "15.2", watchos: "11.0" },
    developer: "David Jabech",
    supportEmail: "david.jabech@gmail.com"
  },

  googleSiteVerification: "5mSxgyHSeBd_lJ2ltm3Wd2vbET-D7cgbzbC3c-XejXQ"
};
