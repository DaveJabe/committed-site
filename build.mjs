#!/usr/bin/env node
// Builds the site into dist/ from src/. No dependencies: Node 20+ only.
//
//   npm run build            build with site.config.mjs (today: GitHub Pages under /committed-site/)
//   SITE_ORIGIN=https://example.com SITE_BASE_PATH=/ npm run build   build for a custom domain at the root
//
// Pages live in src/pages/*.mjs. Each exports one page (or an array) with an `id`, an `en` and/or `es`
// block (path relative to the base path, title, description) and a `render(ctx)` that returns the
// <main> contents. Links between pages use ctx.link(id), so a page can move by changing one path.
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import config from "./site.config.mjs";
import { documentShell } from "./src/lib/layout.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "src");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, "static"), out, { recursive: true });

// ---- Pages ---------------------------------------------------------------------------------------

const pageFiles = readdirSync(join(src, "pages")).filter((file) => file.endsWith(".mjs")).sort();
const pages = [];
for (const file of pageFiles) {
  const module = await import(pathToFileURL(join(src, "pages", file)).href);
  const exported = module.default;
  for (const page of Array.isArray(exported) ? exported : [exported]) pages.push(page);
}
const byId = new Map();
for (const page of pages) {
  if (byId.has(page.id)) throw new Error(`Duplicate page id: ${page.id}`);
  byId.set(page.id, page);
}

const hashes = new Map();
function hashOf(path) {
  if (!hashes.has(path)) {
    const file = join(out, path);
    if (!existsSync(file)) throw new Error(`Missing asset: ${path}`);
    hashes.set(path, createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10));
  }
  return hashes.get(path);
}

const url = (path = "") => `${config.basePath}${String(path).replace(/^\/+/, "")}`;
const abs = (path = "") => `${config.origin}${url(path)}`;

function makeContext(page, lang) {
  const ctx = {
    config,
    lang,
    page,
    pages: byId,
    url,
    abs,
    asset: (path) => `${url(path)}?v=${hashOf(path)}`,
    absAsset: (path) => `${abs(path)}?v=${hashOf(path)}`,
    hasAsset: (path) => existsSync(join(out, path)),
    pagePath(id, language = lang) {
      const target = byId.get(id);
      if (!target) throw new Error(`Unknown page id "${id}" linked from ${page.id}`);
      return (target[language] || target.en).path;
    },
    link(id, hash = "") {
      return url(ctx.pagePath(id)) + hash;
    },
    alternate() {
      const other = lang === "en" ? "es" : "en";
      return page[other] ? { lang: other, href: url(page[other].path) } : null;
    }
  };
  return ctx;
}

const written = [];
for (const page of pages) {
  for (const lang of ["en", "es"]) {
    if (!page[lang]) continue;
    const ctx = makeContext(page, lang);
    const body = page.render(ctx);
    const html = page.raw ? body : documentShell(ctx, page, body);
    const path = page[lang].path;
    const file = path === "" || path.endsWith("/") ? join(out, path, "index.html") : join(out, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    written.push({ page, lang, path });
  }
}

// ---- Sitemap, robots, CNAME ------------------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = pages
  .filter((page) => page.sitemap !== false)
  .flatMap((page) =>
    ["en", "es"]
      .filter((lang) => page[lang])
      .map((lang) => {
        const alternates = ["en", "es"]
          .filter((other) => page[other])
          .map((other) => `    <xhtml:link rel="alternate" hreflang="${other}" href="${abs(page[other].path)}"/>`)
          .concat(page.en ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(page.en.path)}"/>`] : [])
          .join("\n");
        return `  <url>\n    <loc>${abs(page[lang].path)}</loc>\n    <lastmod>${page.updated || today}</lastmod>\n${alternates}\n  </url>`;
      })
  );
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join("\n")}\n</urlset>\n`
);

writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("sitemap.xml")}\n`);
if (config.customDomain) writeFileSync(join(out, "CNAME"), `${config.customDomain}\n`);
writeFileSync(join(out, ".nojekyll"), "");

// ---- Checks: every internal link and asset must exist ------------------------------------------------

const problems = [];
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const files = walk(out);
for (const file of files.filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src|srcset|content)="([^"]+)"/g)) {
    for (const candidate of match[1].split(",").map((part) => part.trim().split(/\s+/)[0])) {
      let target = candidate;
      if (target.startsWith(config.origin)) target = target.slice(config.origin.length);
      if (!target.startsWith(config.basePath) || target.startsWith("//")) continue;
      const clean = decodeURIComponent(target.slice(config.basePath.length).split(/[?#]/)[0]);
      const resolved = clean === "" || clean.endsWith("/") ? join(out, clean, "index.html") : join(out, clean);
      if (!existsSync(resolved)) problems.push(`${relative(out, file)} → ${candidate}`);
    }
  }
  if (/\/committed-site\//.test(html) && config.basePath !== "/committed-site/") problems.push(`${relative(out, file)} hard-codes /committed-site/`);
}
if (problems.length) {
  console.error(`Broken internal links or assets:\n  ${[...new Set(problems)].join("\n  ")}`);
  process.exit(1);
}

console.log(`Built ${written.length} pages for ${abs()} into dist/ (${files.length} files).`);
