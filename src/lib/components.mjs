// Reusable page parts. Widgets are drawn in HTML from the app's widget layouts (CommittedWidget,
// CommittedKit WidgetRenderers) with synthetic sample commitments, never real user data.
import { createRequire } from "node:module";
import { esc, t, L } from "./util.mjs";

const require = createRequire(import.meta.url);
const D = require("../static/js/dates.js");
const Sky = require("../static/js/constellation.js");

const MINT = { accent: "#99d6c5", ink: "#eceff0", dawn: "#edd2a4" };

// Sample commitments. The "as of" day is fixed so the build is deterministic and the numbers stay tidy.
const SAMPLE_TODAY = D.parse("2026-11-25");
export const SAMPLES = {
  alcohol: { name: L("Alcohol", "Alcohol"), start: D.addDays(SAMPLE_TODAY, -94) },
  alcohol90: { name: L("Alcohol", "Alcohol"), start: D.addDays(SAMPLE_TODAY, -90) },
  nicotine: { name: L("Nicotine", "Nicotina"), start: D.addMonths(SAMPLE_TODAY, -7) },
  social: { name: L("Social media", "Redes sociales"), start: D.addDays(SAMPLE_TODAY, -21) },
  years: { name: L("Alcohol", "Alcohol"), start: D.addYears(SAMPLE_TODAY, -4) }
};

const fmt = (ctx, n) => new Intl.NumberFormat(ctx.lang === "es" ? "es-MX" : "en-US").format(n);
const unitWord = (ctx, kind, n) => {
  const words = {
    days: L(["day", "days"], ["día", "días"]),
    months: L(["month", "months"], ["mes", "meses"]),
    years: L(["year", "years"], ["año", "años"])
  }[kind];
  return t(ctx, words)[n === 1 ? 0 : 1];
};
export const milestoneName = (ctx, m) => `${fmt(ctx, m.value)} ${unitWord(ctx, m.kind, m.value)}`;

function stats(sample) {
  const elapsed = D.daysBetween(sample.start, SAMPLE_TODAY);
  const reached = D.reached(sample.start, SAMPLE_TODAY);
  const next = D.upcoming(sample.start, SAMPLE_TODAY)[0];
  const previousDay = reached.length ? reached[reached.length - 1].day : 0;
  const progress = (elapsed - previousDay) / (next.day - previousDay);
  return { elapsed, reached, next, progress, breakdown: D.breakdown(sample.start, SAMPLE_TODAY) };
}

function dateLabel(ctx, value, style = "medium") {
  const date = new Date(Date.UTC(value.y, value.m - 1, value.d, 12));
  const options = style === "medium" ? { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" } : { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat(ctx.lang === "es" ? "es-MX" : "en-US", options).format(date);
}

const DAYS_UNIT = L("Days", "Días");

export const widget = {
  numeral(ctx, sample = SAMPLES.alcohol90) {
    const s = stats(sample);
    return `<div class="widget small" role="img" aria-label="${esc(t(ctx, L(`Numeral widget: ${t(ctx, sample.name)}, ${s.elapsed} days, next ${milestoneName(ctx, s.next)}`, `Widget Numérico: ${t(ctx, sample.name)}, ${s.elapsed} días, siguiente ${milestoneName(ctx, s.next)}`)))}">
  <div class="w-name">${esc(t(ctx, sample.name))}</div>
  <div style="margin-top:auto"><div class="w-num" style="font-size:52px">${fmt(ctx, s.elapsed)}</div><div class="w-unit" style="margin-top:6px">${t(ctx, DAYS_UNIT)}</div></div>
  <div class="w-bar" style="margin-top:12px"><i style="width:${Math.round(s.progress * 100)}%"></i></div>
  <div class="w-foot" style="margin-top:7px">${fmt(ctx, s.next.day - s.elapsed)}${t(ctx, L("d", " d"))} · ${esc(milestoneName(ctx, s.next))}</div>
</div>`;
  },

  minimal(ctx, sample = SAMPLES.alcohol90) {
    const s = stats(sample);
    return `<div class="widget small" role="img" aria-label="${esc(t(ctx, L(`Minimal widget: ${s.elapsed} days`, `Widget Mínimo: ${s.elapsed} días`)))}">
  <div class="w-center"><div class="w-num" style="font-size:60px">${fmt(ctx, s.elapsed)}</div><div class="w-unit" style="margin-top:8px">${t(ctx, DAYS_UNIT)}</div></div>
</div>`;
  },

  chronicle(ctx, sample = SAMPLES.alcohol90) {
    const s = stats(sample);
    return `<div class="widget small" role="img" aria-label="${esc(t(ctx, L(`Chronicle widget: sober from ${t(ctx, sample.name)} since ${dateLabel(ctx, sample.start)}, ${s.elapsed} days`, `Widget Crónica: sin ${t(ctx, sample.name)} desde ${dateLabel(ctx, sample.start)}, ${s.elapsed} días`)))}">
  <div class="w-label">${t(ctx, L("Sober from", "Sin"))}</div>
  <div class="w-name" style="font-size:15px;margin-top:3px">${esc(t(ctx, sample.name))}</div>
  <div class="w-foot" style="text-transform:none;letter-spacing:0;font-size:10.5px;margin-top:3px">${t(ctx, L("Since", "Desde"))} ${esc(dateLabel(ctx, sample.start))}</div>
  <div style="margin-top:auto;display:flex;align-items:baseline;gap:7px"><span class="w-num" style="font-size:40px">${fmt(ctx, s.elapsed)}</span><span class="w-unit">${t(ctx, DAYS_UNIT)}</span></div>
</div>`;
  },

  constellation(ctx, sample = SAMPLES.alcohol, size = "small") {
    const s = stats(sample);
    const ladder = D.milestones(sample.start).map((m) => ({ day: m.day, isYear: m.kind === "years" }));
    const model = Sky.model(ladder, s.elapsed);
    const w = size === "small" ? 158 : 338;
    const h = size === "large" ? 354 : 158;
    return `<div class="widget ${size}" role="img" aria-label="${esc(t(ctx, L(`Constellation widget: ${t(ctx, sample.name)}, ${s.elapsed} days, ${model.reachedCount} milestones reached`, `Widget Constelación: ${t(ctx, sample.name)}, ${s.elapsed} días, ${model.reachedCount} hitos alcanzados`)))}">
  ${Sky.svg(model, w, h, MINT)}
  <div class="w-top"><span class="w-name">${esc(t(ctx, sample.name))}</span><span class="w-stars">${model.reachedCount}</span></div>
  <div style="margin-top:auto;display:flex;align-items:baseline;gap:7px"><span class="w-num" style="font-size:${size === "small" ? 34 : 44}px">${fmt(ctx, s.elapsed)}</span><span class="w-unit">${t(ctx, DAYS_UNIT)}</span></div>
</div>`;
  },

  two(ctx, a = SAMPLES.alcohol90, b = SAMPLES.nicotine) {
    const half = (sample) => {
      const s = stats(sample);
      const big = s.breakdown.years ? [s.breakdown.years, "years"] : s.elapsed >= 183 ? [s.breakdown.months, "months"] : [s.elapsed, "days"];
      return `<div style="flex:1;display:flex;flex-direction:column;min-width:0"><div class="w-name">${esc(t(ctx, sample.name))}</div><div style="margin-top:auto"><div class="w-num" style="font-size:46px">${fmt(ctx, big[0])}</div><div class="w-unit" style="margin-top:6px">${esc(unitWord(ctx, big[1], big[0]))}</div></div><div class="w-bar" style="margin-top:10px"><i style="width:${Math.round(s.progress * 100)}%"></i></div></div>`;
    };
    return `<div class="widget medium" role="img" aria-label="${esc(t(ctx, L("Two Commitments widget", "Widget Dos compromisos")))}"><div style="display:flex;gap:22px;height:100%">${half(a)}<div style="width:1px;background:rgba(236,239,240,.1)"></div>${half(b)}</div></div>`;
  },

  circular(ctx, sample = SAMPLES.alcohol90) {
    const s = stats(sample);
    const r = 27;
    const c = 2 * Math.PI * r;
    return `<div class="w-circular" role="img" aria-label="${esc(t(ctx, L(`Circular complication: ${s.elapsed} days`, `Complicación circular: ${s.elapsed} días`)))}"><svg viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="3"/><circle cx="29" cy="29" r="${r}" fill="none" stroke="#99d6c5" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(c * s.progress).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 29 29)"/></svg><div><b>${fmt(ctx, s.elapsed)}</b><span>${t(ctx, DAYS_UNIT)}</span></div></div>`;
  },

  rectangular(ctx, sample = SAMPLES.years) {
    const s = stats(sample);
    return `<div class="w-rect" role="img" aria-label="${esc(t(ctx, L(`Rectangular complication: ${fmt(ctx, s.elapsed)} days sober`, `Complicación rectangular: ${fmt(ctx, s.elapsed)} días`)))}"><span>${esc(t(ctx, sample.name))}</span><b>${fmt(ctx, s.elapsed)} ${t(ctx, L("days", "días"))}</b><span>${t(ctx, L("Next", "Siguiente"))}: ${esc(milestoneName(ctx, s.next))}</span></div>`;
  }
};

export function ledger(ctx, sample = SAMPLES.nicotine) {
  const s = stats(sample);
  const rows = [];
  if (s.breakdown.years) rows.push([s.breakdown.years, "years"]);
  if (s.breakdown.years || s.breakdown.months) rows.push([s.breakdown.months, "months"]);
  rows.push([s.breakdown.days, "days"]);
  return `<div class="ledger" role="img" aria-label="${esc(rows.map(([n, k]) => `${n} ${unitWord(ctx, k, n)}`).join(", "))}">
  ${rows.map(([n, k]) => `<div class="ledger-row"><b>${fmt(ctx, n)}</b><span>${esc(unitWord(ctx, k, n))}</span></div>`).join("")}
  <p class="ledger-foot">${t(ctx, L("Since", "Desde"))} ${esc(dateLabel(ctx, sample.start))}</p>
</div>`;
}

export function watch(ctx) {
  return `<div class="watch" role="img" aria-label="${esc(t(ctx, L("Apple Watch face with a Committed complication showing 1,461 days", "Esfera de Apple Watch con una complicación de Committed que muestra 1461 días")))}"><div class="watch-screen" aria-hidden="true"><div class="watch-date">${t(ctx, L("WED 25", "MIÉ 25"))}</div><div class="watch-time">10:09</div>${widget.rectangular(ctx).replace(/role="img" aria-label="[^"]*"/, "")}</div></div>`;
}

const SHOT = {
  matrix: { file: "assets/committed-matrix", alt: L("Committed on iPhone in Matrix view: four years sober shown as a grid of dots, one per day, with milestones highlighted", "Committed en iPhone con la vista Matriz: cuatro años de sobriedad como una cuadrícula de puntos, uno por día, con los hitos resaltados") },
  sky: { file: "assets/committed-sky", alt: L("Committed’s Your Sky view: seven months free from nicotine drawn as a constellation of milestones", "La vista Tu cielo de Committed: siete meses sin nicotina dibujados como una constelación de hitos") },
  widgets: { file: "assets/committed-widgets", alt: L("An iPhone Home Screen with Committed widgets: a constellation, day counts and a progress bar", "Una pantalla de inicio de iPhone con widgets de Committed: una constelación, cuentas de días y una barra de progreso") }
};

export function phone(ctx, which, { eager = false, crop = false } = {}) {
  const shot = SHOT[which];
  const file = `${shot.file}${ctx.lang === "es" ? "-es" : ""}.webp`;
  return `<figure class="phone${crop ? " phone-crop" : ""}"><img src="${ctx.asset(file)}" width="598" height="1300" alt="${esc(t(ctx, shot.alt))}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></figure>`;
}

export function watchPhoto(ctx, { eager = false } = {}) {
  const alt = t(ctx, L("An Apple Watch on a wrist, with a Committed complication reading 1,461 days sober", "Un Apple Watch en la muñeca con una complicación de Committed que marca 1461 días sin beber"));
  return `<img src="${ctx.asset("assets/committed-watch-960.webp")}" srcset="${ctx.asset("assets/committed-watch-480.webp")} 480w, ${ctx.asset("assets/committed-watch-960.webp")} 960w, ${ctx.asset("assets/committed-watch-1440.webp")} 1440w" sizes="(max-width: 860px) calc(100vw - 40px), 580px" width="1440" height="810" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async" style="border-radius:var(--radius-l)">`;
}

/** Prefers a supplied artwork file (from the artwork pipeline) and falls back to the HTML composition. */
export function artworkOr(ctx, path, alt, fallback, { width, height, eager = false, className = "" } = {}) {
  const localized = ctx.lang === "es" ? path.replace(/(\.[a-z]+)$/, "-es$1") : path;
  const file = ctx.hasAsset(localized) ? localized : ctx.hasAsset(path) ? path : null;
  if (!file) return fallback;
  return `<img class="${className}" src="${ctx.asset(file)}" alt="${esc(alt)}"${width ? ` width="${width}" height="${height}"` : ""}${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

export function heroComposition(ctx, { eager = true } = {}) {
  return `<div class="composition" role="group" aria-label="${esc(t(ctx, L("Committed widgets, the iPhone app and an Apple Watch complication, with sample data", "Widgets de Committed, la app para iPhone y una complicación de Apple Watch, con datos de ejemplo")))}">
  <div class="widget-column">
    ${widget.constellation(ctx, SAMPLES.alcohol, "medium")}
    <div class="widget-row">${widget.numeral(ctx)}${widget.chronicle(ctx)}</div>
  </div>
  <div class="composition-device">${phone(ctx, "matrix", { eager, crop: true })}${watch(ctx)}</div>
</div>`;
}

export const icons = {
  grid: `<svg viewBox="0 0 20 20" aria-hidden="true"><g fill="currentColor"><circle cx="5" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="15" cy="15" r="2.6"/></g></svg>`,
  lock: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M6 8V6a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1Zm2 0h4V6a2 2 0 1 0-4 0v2Z"/></svg>`,
  cloud: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M6 16a4 4 0 0 1-.6-8A5 5 0 0 1 15 7.5 3.5 3.5 0 0 1 14.5 16H6Z"/></svg>`,
  flag: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M4 2h1.5v16H4V2Zm3 1h9l-2 3.5L16 10H7V3Z"/></svg>`,
  palette: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 0 0 0 16c1 0 1.5-.7 1.5-1.4 0-.8-.6-1.1-.6-1.9 0-.8.7-1.4 1.5-1.4H14a4 4 0 0 0 4-4C18 5.3 14.4 2 10 2ZM6 10.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm2.5-3.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z"/></svg>`,
  watch: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7 1h6l.6 3H14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-.4l-.6 3H7l-.6-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h.4L7 1Z"/></svg>`,
  widgets: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z"/></svg>`,
  stack: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M6 2h11v11h-2V4H6V2Zm-3 4h10v12H3V6Z"/></svg>`,
  shield: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1 3 4v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V4l-7-3Z"/></svg>`,
  people: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1 16c0-2.8 2.7-5 6-5s6 2.2 6 5v1H1v-1Zm13 1v-1c0-1.4-.4-2.6-1.2-3.6 2.9-.3 6.2 1.1 6.2 3.6v1h-5Z"/></svg>`,
  access: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 6.5l5 1v3.5L6.5 18h2l1.5-5 1.5 5h2L12 11V7.5l5-1-.4-1.6L10 6 3.4 4.9 3 6.5Z"/></svg>`,
  globe: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm5.9 7h-2.5a12 12 0 0 0-1.2-4.8A6 6 0 0 1 15.9 9ZM10 4c.7.9 1.3 2.6 1.4 5H8.6c.1-2.4.7-4.1 1.4-5ZM7.8 4.2A12 12 0 0 0 6.6 9H4.1a6 6 0 0 1 3.7-4.8ZM4.1 11h2.5c.1 1.8.5 3.5 1.2 4.8A6 6 0 0 1 4.1 11Zm5.9 5c-.7-.9-1.3-2.6-1.4-5h2.8c-.1 2.4-.7 4.1-1.4 5Zm2.2-.2c.7-1.3 1.1-3 1.2-4.8h2.5a6 6 0 0 1-3.7 4.8Z"/></svg>`,
  mac: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M2 3h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6l.5 2H14v1H6v-1h1.5L8 15H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v8h14V5H3Z"/></svg>`,
  phone: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M6 1h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Zm0 3v12h8V4H6Z"/></svg>`
};

export const lockIcon = `<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 1 1 6 0v2h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H5Zm1.5 0h3V5a1.5 1.5 0 1 0-3 0v2Z"/></svg>`;

export function featureList(items) {
  return `<ul class="feature-list">${items
    .map((item) => `<li><span class="mark">${icons[item.icon] || icons.grid}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></li>`)
    .join("")}</ul>`;
}

export function faq(items) {
  return `<div class="faq">${items.map((item) => `<details><summary>${item.q}</summary><div class="answer"><p>${item.a}</p></div></details>`).join("")}</div>`;
}

export function faqLd(items) {
  const strip = (html) => html.replace(/<[^>]+>/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: strip(item.q), acceptedAnswer: { "@type": "Answer", text: strip(item.a) } }))
  };
}

export function appLd(ctx, extra = {}) {
  const { app } = ctx.config;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.storeName,
    applicationCategory: "LifestyleApplication",
    operatingSystem: `iOS ${app.requirements.ios} or later, macOS ${app.requirements.macos} or later, watchOS ${app.requirements.watchos} or later`,
    softwareVersion: app.version,
    inLanguage: ["en", "es"],
    url: ctx.abs(ctx.pagePath("product")),
    downloadUrl: `https://apps.apple.com/app/id${app.appStoreId}`,
    installUrl: `https://apps.apple.com/app/id${app.appStoreId}`,
    image: ctx.absAsset("icons/icon-512.png"),
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: app.priceCurrency, name: t(ctx, L("Free download", "Descarga gratuita")) },
      { "@type": "Offer", price: app.price, priceCurrency: app.priceCurrency, name: t(ctx, L("Lifetime Unlock (one-time in-app purchase, US price)", "Desbloqueo de por vida (compra única dentro de la app, precio en EE. UU.)")) }
    ],
    author: { "@type": "Person", name: app.developer },
    ...extra
  };
}

/** The shared free-vs-unlock comparison, worded from Entitlements.swift and the paywall rows. */
export function pricing(ctx, campaign) {
  const free = t(ctx, L(
    ["One commitment, tracked for as long as you like", "Matrix, Your Sky and Ledger", "Every built-in milestone, plus one of your own", "A countdown to a start date up to a year away", "Meetings and Resources", "The Mint theme"],
    ["Un compromiso, durante todo el tiempo que quieras", "Matriz, Tu cielo y Registro", "Todos los hitos incluidos, más uno tuyo", "Cuenta atrás hasta una fecha de inicio de hasta un año", "Reuniones y Recursos", "El tema Mint"]
  ));
  const unlock = t(ctx, L(
    ["Multiple commitments", "Hidden commitments behind Face ID (Touch ID on Mac)", "Home Screen, Lock Screen and desktop widgets", "The Apple Watch app and complications", "All eight themes", "iCloud Sync across your devices", "Unlimited custom milestones"],
    ["Varios compromisos", "Compromisos ocultos con Face ID (Touch ID en Mac)", "Widgets de pantalla de inicio, pantalla bloqueada y escritorio", "La app de Apple Watch y sus complicaciones", "Los ocho temas", "Sincronización con iCloud entre tus dispositivos", "Hitos personalizados sin límite"]
  ));
  const li = (items) => items.map((item) => `<li>${esc(item)}</li>`).join("");
  return `<div class="pricing">
  <div class="card"><p class="eyebrow">${t(ctx, L("<b>Free</b> forever", "<b>Gratis</b> para siempre"))}</p><p class="price">$0</p><p class="muted">${t(ctx, L("No trial, no time limit, no account.", "Sin prueba, sin límite de tiempo, sin cuenta."))}</p><ul>${li(free)}</ul></div>
  <div class="card featured"><p class="eyebrow">${t(ctx, L("<b>Lifetime Unlock</b> · one time", "<b>Desbloqueo de por vida</b> · pago único"))}</p><p class="price">$${ctx.config.app.price}<span class="small faint"> ${t(ctx, L("US", "EE. UU."))}</span></p><p class="muted">${t(ctx, L("Everything, forever, on every device signed in to your Apple Account. No subscription.", "Todo, para siempre, en cada dispositivo con tu cuenta de Apple. Sin suscripción."))}</p><ul>${li(unlock)}</ul></div>
</div>
<p class="fineprint">${t(ctx, L("Prices vary by country; the App Store shows yours in your currency. One in-app purchase unlocks Committed on iPhone, Mac and Apple Watch.", "Los precios varían según el país; el App Store muestra el tuyo en tu moneda. Una compra dentro de la app desbloquea Committed en iPhone, Mac y Apple Watch."))}</p>`;
}
