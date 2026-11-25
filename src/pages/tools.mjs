import { L, t, esc } from "../lib/util.mjs";
import { storeButton } from "../lib/layout.mjs";
import { widget, faq, faqLd, SAMPLES } from "../lib/components.mjs";
import { dateField, privacyLine, toolCards, toolStrings } from "../lib/tools.mjs";

const toolLd = (ctx, name) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  url: ctx.abs(ctx.page[ctx.lang].path),
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: ctx.lang,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: ctx.config.app.developer }
});

function appNudge(ctx, campaign, text) {
  const T = (en, es) => t(ctx, { en, es });
  return `<aside class="app-aside stage" style="margin-top:40px" aria-label="Committed">
  <div class="dotfield" aria-hidden="true"></div>
  <div style="position:relative;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between">
    <div style="max-width:44ch"><p class="eyebrow"><b>Committed</b> ${T("for iPhone, Mac and Apple Watch", "para iPhone, Mac y Apple Watch")}</p><p class="muted" style="margin:0">${text}</p></div>
    <div class="button-row" style="margin:0">${storeButton(ctx, campaign)}</div>
  </div>
</aside>`;
}

const hub = {
  id: "tools",
  section: "tools",
  campaign: "tools",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "tools/", title: "Free Sobriety Tools: Calculator, Milestones, Progress Image | Committed", description: "Free, private sobriety tools that run in your browser: a sober time calculator, milestone dates, a shareable progress image, a start-date countdown and a money-saved calculator.", crumb: "Free tools" },
  es: { path: "es/herramientas/", title: "Herramientas de sobriedad gratis | Committed", description: "Herramientas de sobriedad gratuitas y privadas que funcionan en tu navegador: calculadora de sobriedad, fechas de hitos, imagen de progreso, cuenta regresiva y dinero ahorrado.", crumb: "Herramientas" },
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `<section class="prose" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Free tools", "Herramientas")}</b></p>
  <h1>${T("Free sobriety tools", "Herramientas de sobriedad gratuitas")}</h1>
  <p class="lede">${T("Small, private tools for counting and celebrating your time. They all run in your browser: nothing you enter is stored or sent anywhere.", "Herramientas pequeñas y privadas para contar y celebrar tu tiempo. Todas funcionan en tu navegador: nada de lo que ingresas se guarda ni se envía.")}</p>
</div></section>
<section class="section" style="padding-top:24px"><div class="shell">
  ${toolCards(ctx, ["calculator", "progress-image", "milestones", "countdown", "money-saved"], 2)}
  ${appNudge(ctx, "tools", T("The same date math runs inside Committed, which keeps your count every day, on every screen.", "Los mismos cálculos funcionan dentro de Committed, que lleva tu cuenta cada día, en cada pantalla."))}
</div></section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const ART_FAQ = L(
  [
    { q: "Is my date uploaded to make the image?", a: "No. The image is drawn in your browser with your device’s own graphics, and saving it downloads the file straight from the page. Nothing is uploaded, and nothing is kept after you close the tab." },
    { q: "Can I leave the date off the image?", a: "Yes. Every line is optional: the label, the start date, the breakdown, the next milestone and the Committed mark. Turn off whatever you don’t want to share." },
    { q: "What do Matrix, Your Sky and Ledger mean?", a: "They are the three views in the Committed app. Matrix draws a dot for every day, Your Sky draws your milestones as a constellation, and Ledger is the plain count in years, months and days." }
  ],
  [
    { q: "¿Se sube mi fecha para crear la imagen?", a: "No. La imagen se dibuja en tu navegador con los gráficos de tu propio dispositivo, y al guardarla el archivo se descarga directamente desde la página. No se sube nada y nada se conserva al cerrar la pestaña." },
    { q: "¿Puedo dejar la fecha fuera de la imagen?", a: "Sí. Cada línea es opcional: la etiqueta, la fecha de inicio, el desglose, el próximo hito y la marca de Committed. Desactiva lo que no quieras compartir." },
    { q: "¿Qué son Matriz, Tu cielo y Registro?", a: "Son las tres vistas de la app Committed. Matriz dibuja un punto por cada día, Tu cielo dibuja tus hitos como una constelación y Registro es la cuenta sencilla en años, meses y días." }
  ]
);

export const PALETTES = {
  mint: { label: "Mint", bg: "#0E1315", surface: "#181E21", ink: "#ECEFF0", accent: "#99D6C5", dawn: "#EDD2A4" },
  dreamy: { label: "Dreamy", bg: "#121110", surface: "#1C1A17", ink: "#EFEAE0", accent: "#E5DECF", dawn: "#ECD8B0" },
  sea: { label: "Sea", bg: "#0F151D", surface: "#161E28", ink: "#E5E9EE", accent: "#8FB3D6", dawn: "#F2CCA0" },
  amethyst: { label: "Amethyst", bg: "#15131E", surface: "#1E1B29", ink: "#E9E7F0", accent: "#ADA6DE", dawn: "#F2CCA0" },
  graphite: { label: "Graphite", bg: "#131416", surface: "#1C1E20", ink: "#E9EAEC", accent: "#B7BCC3", dawn: "#E7CBA4" },
  rose: { label: "Rose", bg: "#171215", surface: "#221A1E", ink: "#F1E7EA", accent: "#E3A7B9", dawn: "#F1D1A4" },
  copper: { label: "Copper", bg: "#16110E", surface: "#211915", ink: "#F2EAE3", accent: "#EBA47D", dawn: "#F1DDA9" },
  moss: { label: "Moss", bg: "#111410", surface: "#1A1E18", ink: "#EAEDE4", accent: "#B6CD8D", dawn: "#EECB98" }
};

const progressImage = {
  id: "progress-image",
  section: "tools",
  campaign: "art",
  updated: "2026-11-25",
  en: { path: "sobriety-progress-image/", title: "Sobriety Progress Image Maker: Share Your Sober Days | Committed", description: "Make a beautiful image of your sober time to save or share: choose Matrix, Your Sky or Ledger, pick a theme, and decide exactly what it shows. Free and private.", crumb: "Progress image" },
  es: { path: "es/imagen-progreso-sobriedad/", title: "Crea una imagen de tu progreso de sobriedad | Committed", description: "Crea una imagen de tu tiempo de sobriedad para guardar o compartir: elige Matriz, Tu cielo o Registro, un tema y exactamente qué muestra. Gratis y privada.", crumb: "Imagen de progreso" },
  scripts: ["js/dates.js", "js/constellation.js", "js/common.js", "js/artwork.js"],
  jsonLd: (ctx) => [toolLd(ctx, t(ctx, L("Sobriety progress image maker", "Creador de imágenes de progreso de sobriedad"))), faqLd(t(ctx, ART_FAQ))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    const radio = (name, value, label, checked) => `<label><input type="radio" name="${name}" value="${value}"${checked ? " checked" : ""}><span>${label}</span></label>`;
    const check = (name, label, checked = true) => `<label class="check"><input type="checkbox" name="${name}"${checked ? " checked" : ""}> ${label}</label>`;
    return `${toolStrings(ctx, {
      palettes: PALETTES,
      soberFrom: T("Sober from", "Sin"),
      defaultLabel: T("Alcohol", "Alcohol"),
      days: T(["day", "days"], ["día", "días"]),
      nextLine: T("Next: {name} on {date}", "Siguiente: {name} el {date}"),
      sinceLine: T("Since {date}", "Desde el {date}"),
      milestonesLine: T("{count} milestones reached", "{count} hitos alcanzados"),
      milestoneOneLine: T("1 milestone reached", "1 hito alcanzado"),
      brand: T("Committed · sobriety tracker", "Committed · contador de sobriedad"),
      dayOne: T("Day one", "Día uno"),
      fileName: T("my-sober-days", "mis-dias-sin")
    })}
<section class="calc-hero" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Free tool", "Herramienta gratuita")}</b></p>
  <h1>${T("Make an image of your sober time", "Crea una imagen de tu tiempo de sobriedad")}</h1>
  <p class="lede">${T("Turn your count into something worth keeping. Pick a view and a theme, choose what to show, and save a PNG to share or keep for yourself.", "Convierte tu cuenta en algo que valga la pena guardar. Elige una vista y un tema, decide qué mostrar y guarda un PNG para compartir o quedártelo.")}</p>
</div></section>
<section class="section" style="padding-top:16px"><div class="shell">
  <div class="tool" data-artwork>
    <form class="tool-controls" data-artwork-form novalidate>
      ${dateField(ctx, { hint: T("Your start date is day zero.", "Tu fecha de inicio es el día cero.") })}
      <p class="form-error" data-error role="alert"></p>
      <div class="field">
        <label for="art-label">${T("What you’re counting", "Lo que cuentas")}</label>
        <input id="art-label" name="label" type="text" maxlength="40" autocomplete="off" value="${T("Alcohol", "Alcohol")}">
        <p class="hint">${T("Shown as “Sober from …”. Leave it blank for just the count.", "Se muestra como «Sin …». Déjalo vacío para mostrar solo la cuenta.")}</p>
      </div>
      <fieldset><legend>${T("View", "Vista")}</legend><div class="segmented">${radio("view", "matrix", T("Matrix", "Matriz"), true)}${radio("view", "sky", T("Your Sky", "Tu cielo"))}${radio("view", "ledger", T("Ledger", "Registro"))}</div></fieldset>
      <fieldset><legend>${T("Theme", "Tema")}</legend><div class="swatches">${Object.entries(PALETTES).map(([key, p], index) => `<label title="${p.label}"><input type="radio" name="theme" value="${key}"${index === 0 ? " checked" : ""} aria-label="${p.label}"><span><i style="--sw-bg:${p.bg};--sw-accent:${p.accent};--sw-dawn:${p.dawn}"></i></span></label>`).join("")}</div></fieldset>
      <fieldset><legend>${T("Size", "Tamaño")}</legend><div class="segmented">${radio("size", "square", T("Square", "Cuadrado"), true)}${radio("size", "story", T("Story", "Historia"))}${radio("size", "wide", T("Wide", "Ancho"))}</div></fieldset>
      <fieldset><legend>${T("Show", "Mostrar")}</legend><div class="checks">
        ${check("showLabel", T("What I’m counting", "Lo que cuento"))}
        ${check("showBreakdown", T("Years, months and days", "Años, meses y días"))}
        ${check("showStart", T("My start date", "Mi fecha de inicio"), false)}
        ${check("showNext", T("My next milestone", "Mi próximo hito"))}
        ${check("showBrand", T("A small Committed mark", "Una pequeña marca de Committed"))}
      </div></fieldset>
      ${privacyLine(ctx)}
    </form>
    <div class="tool-output">
      <div class="artwork-preview" data-preview>
        <canvas data-canvas role="img" aria-label="${T("Preview of your progress image", "Vista previa de tu imagen de progreso")}"></canvas>
      </div>
      <p class="visually-hidden" data-summary aria-live="polite"></p>
      <div class="button-row" style="justify-content:center">
        <button class="button button-primary" type="button" data-download disabled>${T("Save image", "Guardar imagen")}</button>
        <button class="button button-secondary" type="button" data-share hidden disabled>${T("Share…", "Compartir…")}</button>
      </div>
      <p class="fineprint" style="text-align:center">${T("PNG, drawn at full resolution on your device.", "PNG, dibujado en alta resolución en tu dispositivo.")}</p>
    </div>
  </div>
  ${appNudge(ctx, "art", T("Want this every day? Committed draws Matrix, Your Sky and Ledger live in the app and on your widgets.", "¿Lo quieres todos los días? Committed dibuja Matriz, Tu cielo y Registro en vivo en la app y en tus widgets."))}
</div></section>
<section class="section"><div class="shell-narrow"><h2 class="title-s">${T("Questions", "Preguntas")}</h2>${faq(t(ctx, ART_FAQ))}</div></section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const milestones = {
  id: "milestones",
  section: "tools",
  campaign: "milestones",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "sobriety-milestones/", title: "Sobriety Milestone Calculator: Every Milestone Date | Committed", description: "Find the date of every sobriety milestone from your start date: 30, 60 and 90 days, 6 months, 1 year and beyond. Add them to your calendar. Free and private.", crumb: "Milestone dates" },
  es: { path: "es/hitos-sobriedad/", title: "Calculadora de hitos de sobriedad: todas las fechas | Committed", description: "Calcula la fecha de cada hito de sobriedad desde tu fecha de inicio: 30, 60 y 90 días, 6 meses, 1 año y más. Añádelos a tu calendario. Gratis y privada.", crumb: "Fechas de hitos" },
  scripts: ["js/dates.js", "js/common.js", "js/milestones.js"],
  jsonLd: (ctx) => [toolLd(ctx, t(ctx, L("Sobriety milestone calculator", "Calculadora de hitos de sobriedad")))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `${toolStrings(ctx, {
      reachedOn: T("Reached", "Alcanzado"),
      upcomingIn: T("in {distance}", "dentro de {distance}"),
      todayWord: T("Today", "Hoy"),
      icsTitle: T("Sobriety milestone: {name}", "Hito de sobriedad: {name}"),
      icsDescription: T("Calculated from your start date on the Committed website.", "Calculado desde tu fecha de inicio en el sitio de Committed."),
      fileName: T("sobriety-milestones.ics", "hitos-sobriedad.ics")
    })}
<section class="calc-hero" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Free tool", "Herramienta gratuita")}</b></p>
  <h1>${T("Sobriety milestone calculator", "Calculadora de hitos de sobriedad")}</h1>
  <p class="lede">${T("Every milestone from your start date, the ones you’ve reached and the ones ahead, using the same milestones as the Committed app.", "Cada hito desde tu fecha de inicio, los que ya alcanzaste y los que vienen, con los mismos hitos de la app Committed.")}</p>
</div></section>
<section class="section" style="padding-top:16px"><div class="shell">
  <div class="tool">
    <form class="tool-controls" data-milestone-form novalidate>
      ${dateField(ctx, { hint: T("Your start date is day zero. A future date works too.", "Tu fecha de inicio es el día cero. También sirve una fecha futura."), future: true })}
      <p class="form-error" data-error role="alert"></p>
      <button class="button button-primary" type="submit" style="width:100%">${T("Show my milestones", "Ver mis hitos")}</button>
      ${privacyLine(ctx)}
    </form>
    <div class="tool-output">
      <p class="muted" data-empty>${T("Your milestones will appear here.", "Tus hitos aparecerán aquí.")}</p>
      <div data-output hidden>
        <table class="milestone-table"><caption data-caption></caption><thead><tr><th scope="col">${T("Milestone", "Hito")}</th><th scope="col">${T("Date", "Fecha")}</th><th scope="col">${T("Day", "Día")}</th></tr></thead><tbody data-rows></tbody></table>
        <div class="button-row">
          <button class="button button-secondary" type="button" data-more>${T("Show more years", "Mostrar más años")}</button>
          <button class="button button-secondary" type="button" data-ics>${T("Add upcoming milestones to my calendar (.ics)", "Añadir los próximos hitos a mi calendario (.ics)")}</button>
          <a class="button button-secondary" data-carry href="${ctx.link("progress-image")}">${T("Make a progress image", "Crear una imagen de progreso")}</a>
        </div>
        <p class="fineprint">${T("The calendar file is made on your device and opened by your own calendar app. Months are calendar months: a milestone that would fall on the 31st of a shorter month lands on its last day.", "El archivo de calendario se crea en tu dispositivo y lo abre tu propia app de calendario. Los meses son meses del calendario: un hito que caería el día 31 de un mes más corto llega su último día.")}</p>
      </div>
    </div>
  </div>
  ${appNudge(ctx, "milestones", T("Committed celebrates each of these as it arrives, and lets you add milestones of your own.", "Committed celebra cada uno de estos cuando llega y te deja añadir tus propios hitos."))}
</div></section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const countdown = {
  id: "countdown",
  section: "tools",
  campaign: "countdown",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "sobriety-countdown/", title: "Sobriety Start Date Countdown: Days Until Day One | Committed", description: "Planning to stop on a date that matters, like New Year’s Day? Count down to day one and see when your first sobriety milestones will land. Free and private.", crumb: "Start-date countdown" },
  es: { path: "es/cuenta-regresiva-sobriedad/", title: "Cuenta regresiva para tu fecha de inicio | Committed", description: "¿Vas a dejarlo en una fecha especial, como el Año Nuevo? Cuenta los días hasta el día uno y mira cuándo llegarán tus primeros hitos. Gratis y privada.", crumb: "Cuenta regresiva" },
  scripts: ["js/dates.js", "js/common.js", "js/countdown.js"],
  jsonLd: (ctx) => [toolLd(ctx, t(ctx, L("Sobriety start-date countdown", "Cuenta regresiva para la fecha de inicio")))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `${toolStrings(ctx, {
      daysUntil: T(["day until day one", "days until day one"], ["día para el día uno", "días para el día uno"]),
      startsToday: T("Day one is today.", "El día uno es hoy."),
      startsOn: T("Day one: {date}", "Día uno: {date}"),
      alreadyStarted: T("That date has passed: you’re already {days} in.", "Esa fecha ya pasó: ya llevas {days}."),
      firstMilestones: T("Your first milestones", "Tus primeros hitos"),
      newYear: T("New Year’s Day", "Año Nuevo")
    })}
<section class="calc-hero" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Free tool", "Herramienta gratuita")}</b></p>
  <h1>${T("Count down to day one", "Cuenta los días hasta el día uno")}</h1>
  <p class="lede">${T("Choosing a date to start, like the first of the month or New Year’s Day, gives you time to prepare. See how many days are left, and when your first milestones will arrive.", "Elegir una fecha para empezar, como el primero del mes o el Año Nuevo, te da tiempo para prepararte. Mira cuántos días faltan y cuándo llegarán tus primeros hitos.")}</p>
</div></section>
<section class="section" style="padding-top:16px"><div class="shell">
  <div class="tool">
    <form class="tool-controls" data-countdown-form novalidate>
      ${dateField(ctx, { label: T("Your planned start date", "Tu fecha de inicio planeada"), hint: T("Up to a year from today, like in the app.", "Hasta un año desde hoy, como en la app."), future: true })}
      <div class="button-row" style="margin:0 0 18px"><button class="button button-secondary button-small" type="button" data-preset="new-year">${T("New Year’s Day", "Año Nuevo")}</button><button class="button button-secondary button-small" type="button" data-preset="next-month">${T("First of next month", "Primero del próximo mes")}</button><button class="button button-secondary button-small" type="button" data-preset="monday">${T("Next Monday", "Próximo lunes")}</button></div>
      <p class="form-error" data-error role="alert"></p>
      <button class="button button-primary" type="submit" style="width:100%">${T("Start the countdown", "Empezar la cuenta regresiva")}</button>
      ${privacyLine(ctx)}
    </form>
    <div class="tool-output" aria-live="polite">
      <p class="muted" data-empty>${T("Pick a date to see your countdown.", "Elige una fecha para ver tu cuenta regresiva.")}</p>
      <div data-output hidden>
        <span class="numeral big-figure" data-days></span>
        <p class="day-label" data-days-label></p>
        <p class="result-date" data-start></p>
        <h2 class="title-s" style="margin-top:28px" data-first-title></h2>
        <table class="milestone-table"><tbody data-rows></tbody></table>
      </div>
    </div>
  </div>
  ${appNudge(ctx, "countdown", T("Set a future start in Committed and it counts down for you, with a quiet reminder on your Lock Screen when day one arrives.", "Fija un inicio futuro en Committed y contará los días por ti, con un aviso discreto en la pantalla bloqueada cuando llegue el día uno."))}
</div></section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const moneySaved = {
  id: "money-saved",
  section: "tools",
  campaign: "money",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "money-saved-calculator/", title: "Sobriety Money Saved Calculator | Committed", description: "See how much money you’ve saved since you quit drinking, smoking or vaping: enter your start date and what you used to spend. Free and private.", crumb: "Money saved" },
  es: { path: "es/calculadora-dinero-ahorrado/", title: "Calculadora de dinero ahorrado al dejar de beber o fumar | Committed", description: "Mira cuánto dinero has ahorrado desde que dejaste de beber, fumar o vapear: ingresa tu fecha de inicio y lo que gastabas. Gratis y privada.", crumb: "Dinero ahorrado" },
  scripts: ["js/dates.js", "js/common.js", "js/money.js"],
  jsonLd: (ctx) => [toolLd(ctx, t(ctx, L("Money saved calculator", "Calculadora de dinero ahorrado")))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    const currencies = ["USD", "EUR", "GBP", "MXN", "CAD", "AUD", "ARS", "CLP", "COP", "PEN", "BRL", "JPY", "INR"];
    return `${toolStrings(ctx, {
      savedSince: T("saved since {date}", "ahorrados desde el {date}"),
      perYear: T("Every year", "Cada año"),
      perMonth: T("Every month", "Cada mes"),
      byNext: T("By {name}", "Para {name}"),
      byYear: T("By 1 year", "Para 1 año"),
      amountRequired: T("Enter how much you used to spend.", "Ingresa cuánto gastabas.")
    })}
<section class="calc-hero" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Free tool", "Herramienta gratuita")}</b></p>
  <h1>${T("How much money have you saved?", "¿Cuánto dinero has ahorrado?")}</h1>
  <p class="lede">${T("Enter your start date and roughly what you used to spend. It’s an estimate, but it adds up fast.", "Ingresa tu fecha de inicio y más o menos lo que gastabas. Es una estimación, pero suma rápido.")}</p>
</div></section>
<section class="section" style="padding-top:16px"><div class="shell">
  <div class="tool">
    <form class="tool-controls" data-money-form novalidate>
      ${dateField(ctx)}
      <div class="field">
        <label for="amount">${T("What you used to spend", "Lo que gastabas")}</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <input id="amount" name="amount" type="number" inputmode="decimal" min="0" step="any" placeholder="20" required>
          <select name="period" aria-label="${T("How often", "Con qué frecuencia")}"><option value="1">${T("per day", "por día")}</option><option value="7" selected>${T("per week", "por semana")}</option><option value="30.436875">${T("per month", "por mes")}</option></select>
        </div>
      </div>
      <div class="field"><label for="currency">${T("Currency", "Moneda")}</label><select id="currency" name="currency">${currencies.map((c) => `<option value="${c}"${c === (ctx.lang === "es" ? "MXN" : "USD") ? " selected" : ""}>${c}</option>`).join("")}</select></div>
      <p class="form-error" data-error role="alert"></p>
      <button class="button button-primary" type="submit" style="width:100%">${T("Calculate", "Calcular")}</button>
      ${privacyLine(ctx)}
    </form>
    <div class="tool-output" aria-live="polite">
      <p class="muted" data-empty>${T("Your total will appear here.", "Tu total aparecerá aquí.")}</p>
      <div data-output hidden>
        <span class="numeral big-figure" data-total></span>
        <p class="day-label" data-since></p>
        <dl class="stat-grid" data-stats></dl>
      </div>
    </div>
  </div>
  ${appNudge(ctx, "money", T("Committed keeps the count that this total grows from, on your Home Screen, desktop and wrist.", "Committed lleva la cuenta de la que crece este total, en tu pantalla de inicio, tu escritorio y tu muñeca."))}
</div></section>`;
  }
};

const notFound = {
  id: "not-found",
  sitemap: false,
  breadcrumb: false,
  lightMode: true,
  en: { path: "404.html", title: "Page not found | Committed", description: "This page doesn’t exist." },
  render(ctx) {
    return `<section class="prose shell-narrow"><p class="eyebrow"><b>404</b></p><h1>Page not found</h1><p class="lede">That page doesn’t exist, or it has moved.</p><div class="button-row"><a class="button button-primary" href="${ctx.link("calculator")}">Sobriety calculator</a><a class="button button-secondary" href="${ctx.link("product")}">About the app</a><a class="button button-secondary" href="${ctx.url("es/")}" lang="es">Calculadora en español</a></div></section>`;
  }
};

export default [hub, progressImage, milestones, countdown, moneySaved, notFound];
