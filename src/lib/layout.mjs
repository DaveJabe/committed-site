// Shared page chrome: <head> metadata, header, footer. Every URL goes through ctx.url / ctx.abs so the
// base path and origin come from site.config.mjs alone.
import { esc, t } from "./util.mjs";

export function appStoreUrl(ctx, campaign, { mac = false } = {}) {
  const { appStoreId, providerToken } = ctx.config.app;
  const ct = `committed-site-${campaign}${ctx.lang === "es" ? "-es" : ""}`;
  return `https://apps.apple.com/app/apple-store/id${appStoreId}?pt=${providerToken}&ct=${encodeURIComponent(ct)}&mt=${mac ? 12 : 8}`;
}

export function storeButton(ctx, campaign, options = {}) {
  const label = options.label || t(ctx, { en: "Download on the App Store", es: "Descargar en el App Store" });
  const cls = options.secondary ? "button button-secondary" : "button button-primary";
  return `<a class="${cls}" href="${esc(appStoreUrl(ctx, campaign, options))}">${appleGlyph()}<span>${esc(label)}</span></a>`;
}

export function appleGlyph() {
  return `<svg class="apple-glyph" viewBox="0 0 17 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.3zM11.5 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>`;
}

function navItems(ctx) {
  return [
    { id: "iphone", label: t(ctx, { en: "iPhone", es: "iPhone" }) },
    { id: "mac", label: t(ctx, { en: "Mac", es: "Mac" }) },
    { id: "watch", label: t(ctx, { en: "Apple Watch", es: "Apple Watch" }) },
    { id: "widgets", label: t(ctx, { en: "Widgets", es: "Widgets" }) },
    { id: "tools", label: t(ctx, { en: "Free tools", es: "Herramientas" }) }
  ];
}

export function header(ctx) {
  const items = navItems(ctx)
    .map((item) => {
      const current = ctx.page.id === item.id || (item.id === "tools" && ctx.page.section === "tools");
      return `<li><a href="${ctx.link(item.id)}"${current ? ' aria-current="page"' : ""}>${esc(item.label)}</a></li>`;
    })
    .join("");
  const other = ctx.alternate();
  const langLink = other
    ? `<a class="lang-switch" href="${other.href}" hreflang="${other.lang}" lang="${other.lang}">${other.lang === "es" ? "Español" : "English"}</a>`
    : "";
  const menuLabel = t(ctx, { en: "Menu", es: "Menú" });
  const calcItem = `<li class="nav-calculator"><a href="${ctx.link("calculator")}"${ctx.page.id === "calculator" ? ' aria-current="page"' : ""}>${t(ctx, { en: "Sobriety calculator", es: "Calculadora de sobriedad" })}</a></li>`;
  return `<a class="skip-link" href="#main">${t(ctx, { en: "Skip to content", es: "Saltar al contenido" })}</a>
<header class="site-header">
  <div class="shell header-bar">
    <a class="brand" href="${ctx.link("product")}">
      <img src="${ctx.asset("icons/icon-128.png")}" alt="" width="32" height="32">
      <span>Committed</span>
    </a>
    <nav class="primary-nav" aria-label="${t(ctx, { en: "Main", es: "Principal" })}">
      <ul class="nav-links">${items}${calcItem}</ul>
      <details class="nav-menu">
        <summary><span>${menuLabel}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 5h12M2 11h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></summary>
        <ul>${items}${calcItem}</ul>
      </details>
    </nav>
    <div class="header-actions">
      ${langLink}
      <a class="button button-primary button-small" href="${esc(appStoreUrl(ctx, `${ctx.page.campaign || ctx.page.id}-header`))}">${t(ctx, { en: "Get the app", es: "Descargar" })}</a>
    </div>
  </div>
</header>`;
}

export function footer(ctx) {
  const col = (title, ids) =>
    `<div><h2>${esc(title)}</h2><ul>${ids
      .map(([id, label]) => `<li><a href="${ctx.link(id)}">${esc(label)}</a></li>`)
      .join("")}</ul></div>`;
  const L = (en, es) => t(ctx, { en, es });
  const other = ctx.alternate();
  return `<footer class="site-footer">
  <div class="shell">
    <div class="footer-columns">
      <div class="footer-brand">
        <a class="brand" href="${ctx.link("product")}"><img src="${ctx.asset("icons/icon-128.png")}" alt="" width="32" height="32" loading="lazy"><span>Committed</span></a>
        <p>${L("A private sobriety tracker for iPhone, Mac and Apple Watch. Free to use, with a one-time Lifetime Unlock.", "Un contador de sobriedad privado para iPhone, Mac y Apple Watch. Gratis, con un Lifetime Unlock de pago único.")}</p>
      </div>
      ${col(L("App", "App"), [
        ["product", L("Overview", "Descripción")],
        ["iphone", "iPhone"],
        ["mac", "Mac"],
        ["watch", "Apple Watch"],
        ["widgets", "Widgets"],
        ["whats-new", L("What’s new", "Novedades")]
      ])}
      ${col(L("Free tools", "Herramientas"), [
        ["calculator", L("Sobriety calculator", "Calculadora de sobriedad")],
        ["progress-image", L("Progress image", "Imagen de progreso")],
        ["milestones", L("Milestone dates", "Fechas de hitos")],
        ["countdown", L("Start-date countdown", "Cuenta regresiva")],
        ["money-saved", L("Money saved", "Dinero ahorrado")]
      ])}
      ${col("Committed", [
        ["about", L("About", "Acerca de")],
        ["press", L("Press kit", "Prensa")],
        ["support", L("Support", "Soporte")],
        ["privacy", L("Privacy", "Privacidad")]
      ])}
    </div>
    <div class="footer-base">
      <p>${L("Committed counts elapsed time. It is not medical advice or treatment. If you need help now, the app’s Resources section lists free helplines by country.", "Committed cuenta el tiempo transcurrido. No es consejo ni tratamiento médico. Si necesitas ayuda ahora, la sección Recursos de la app reúne líneas de ayuda gratuitas por país.")}</p>
      <p><span>© ${new Date().getUTCFullYear()} ${esc(ctx.config.app.developer)}</span>${
        other ? ` · <a href="${other.href}" hreflang="${other.lang}" lang="${other.lang}">${other.lang === "es" ? "Español" : "English"}</a>` : ""
      }</p>
    </div>
  </div>
</footer>`;
}

export function head(ctx, page) {
  const { config } = ctx;
  const meta = page[ctx.lang];
  const canonical = ctx.abs(meta.path);
  // Per-page cards from the artwork pipeline (social/og-<page id>[-es].png, 1200 × 630) win when present.
  const ogCandidates = [`social/og-${page.id}${ctx.lang === "es" ? "-es" : ""}.png`, `social/og-${page.id}.png`];
  const ogFile = ogCandidates.find((path) => ctx.hasAsset(path));
  const og = meta.ogImage || (ogFile ? { path: ogFile, width: 1200, height: 630 } : { path: "social/og-default.png", width: 1200, height: 630 });
  const ogAlt = meta.ogImageAlt || t(ctx, { en: "Committed, a private sobriety tracker", es: "Committed, un contador de sobriedad privado" });
  const alternates = ["en", "es"]
    .filter((lang) => page[lang])
    .map((lang) => `<link rel="alternate" hreflang="${lang}" href="${ctx.abs(page[lang].path)}">`)
    .join("\n  ");
  const xDefault = page.en ? `<link rel="alternate" hreflang="x-default" href="${ctx.abs(page.en.path)}">` : "";
  const jsonLd = (page.jsonLd ? page.jsonLd(ctx) : [])
    .concat(page.breadcrumb === false ? [] : [breadcrumbLd(ctx, page)])
    .filter(Boolean)
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`)
    .join("\n  ");
  const styles = (page.styles || []).map((href) => `<link rel="stylesheet" href="${ctx.asset(href)}">`).join("\n  ");
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${page.id === "calculator" && ctx.lang === "en" ? `<meta name="google-site-verification" content="${config.googleSiteVerification}">` : ""}
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  ${page.sitemap === false ? '<meta name="robots" content="noindex">' : ""}
  <meta name="color-scheme" content="${page.lightMode ? "dark light" : "dark"}">
  <meta name="theme-color" content="#0e1315"${page.lightMode ? ' media="(prefers-color-scheme: dark)"' : ""}>
  ${page.lightMode ? '<meta name="theme-color" content="#f5f3ee" media="(prefers-color-scheme: light)">' : ""}
  <meta name="apple-itunes-app" content="app-id=${config.app.appStoreId}">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  ${xDefault}
  <link rel="icon" href="${ctx.asset("icons/favicon-32.png")}" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${ctx.asset("icons/apple-touch-icon.png")}">
  <link rel="preload" href="${ctx.url("fonts/geist-variable.woff2")}" as="font" type="font/woff2" crossorigin>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Committed">
  <meta property="og:title" content="${esc(meta.ogTitle || meta.title)}">
  <meta property="og:description" content="${esc(meta.ogDescription || meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ctx.absAsset(og.path)}">
  <meta property="og:image:width" content="${og.width}">
  <meta property="og:image:height" content="${og.height}">
  <meta property="og:image:alt" content="${esc(ogAlt)}">
  <meta property="og:locale" content="${ctx.lang === "es" ? "es_MX" : "en_US"}">
  ${page[ctx.lang === "es" ? "en" : "es"] ? `<meta property="og:locale:alternate" content="${ctx.lang === "es" ? "en_US" : "es_MX"}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="${ctx.asset("css/site.css")}">
  ${styles}
  ${jsonLd}
</head>`;
}

function breadcrumbLd(ctx, page) {
  if (page.id === "calculator" || page.id === "product") return null;
  const items = [{ name: "Committed", path: ctx.pagePath("product") }];
  if (page.section === "tools" && page.id !== "tools") items.push({ name: t(ctx, { en: "Free tools", es: "Herramientas" }), path: ctx.pagePath("tools") });
  items.push({ name: page[ctx.lang].crumb || page[ctx.lang].h1 || page[ctx.lang].title.split(" | ")[0], path: page[ctx.lang].path });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: ctx.abs(item.path) }))
  };
}

export function documentShell(ctx, page, body) {
  const scripts = (page.scripts || []).map((src) => `<script src="${ctx.asset(src)}" defer></script>`).join("\n  ");
  return `<!doctype html>
<html lang="${ctx.lang}" class="${page.lightMode ? "allows-light" : "dark-only"}">
${head(ctx, page)}
<body class="page-${page.id}">
${header(ctx)}
<main id="main">
${body}
</main>
${footer(ctx)}
  ${scripts}
</body>
</html>
`;
}
