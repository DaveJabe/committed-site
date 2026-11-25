import { L, t } from "../lib/util.mjs";
import { storeButton } from "../lib/layout.mjs";
import { widget, faq, faqLd, appLd, SAMPLES } from "../lib/components.mjs";
import { calculatorForm, privacyLine, toolCards, toolStrings } from "../lib/tools.mjs";

const FAQ = L(
  [
    { q: "How is sober time calculated?", a: "Your start date is day zero, so the count is the number of calendar days from that date to today. The breakdown adds whole years, then whole months, then the remaining days, using real month lengths. Everything uses your device’s calendar day, so daylight-saving changes never add or drop a day." },
    { q: "What are the common sobriety milestones?", a: "Committed marks 1, 7, 14, 21, 30, 60, 90 and 100 days; 6, 9, 18, 30 and 42 months; and every yearly anniversary. Many recovery groups mark 24 hours, 30, 60 and 90 days, 6 and 9 months, and each year." },
    { q: "When is my six-month or one-year date if I started on the 31st?", a: "Months are added on the calendar and land on the last day of a shorter month. Six months from August 31 is February 28 (or 29 in a leap year), and one year from February 29 is February 28." },
    { q: "Does this calculator save my date?", a: "No. It runs entirely in your browser. The date isn’t stored, sent anywhere or added to the address." },
    { q: "Can I keep the count on my phone?", a: "Yes. Committed, the free app this calculator comes from, keeps your count on iPhone, Mac and Apple Watch, with widgets and milestones." }
  ],
  [
    { q: "¿Cómo se calcula el tiempo de sobriedad?", a: "Tu fecha de inicio es el día cero, así que la cuenta es el número de días del calendario desde esa fecha hasta hoy. El desglose suma años completos, luego meses completos y después los días restantes, con la duración real de cada mes. Todo usa el día del calendario de tu dispositivo, así que el cambio de horario nunca suma ni quita un día." },
    { q: "¿Cuáles son los hitos de sobriedad más comunes?", a: "Committed marca 1, 7, 14, 21, 30, 60, 90 y 100 días; 6, 9, 18, 30 y 42 meses; y cada aniversario. Muchos grupos de recuperación celebran las 24 horas, 30, 60 y 90 días, 6 y 9 meses, y cada año." },
    { q: "Si empecé un día 31, ¿cuándo cumplo seis meses o un año?", a: "Los meses se suman en el calendario y caen en el último día de un mes más corto. Seis meses después del 31 de agosto es el 28 de febrero (o el 29 en un año bisiesto), y un año después del 29 de febrero es el 28 de febrero." },
    { q: "¿La calculadora guarda mi fecha?", a: "No. Funciona por completo en tu navegador. La fecha no se guarda, no se envía a ningún sitio y no se añade a la dirección." },
    { q: "¿Puedo llevar la cuenta en mi teléfono?", a: "Sí. Committed, la app gratuita de la que viene esta calculadora, lleva tu cuenta en iPhone, Mac y Apple Watch, con widgets e hitos." }
  ]
);

export default {
  id: "calculator",
  section: "tools",
  campaign: "home",
  updated: "2026-11-25",
  breadcrumb: false,
  lightMode: true,
  en: {
    path: "",
    title: "Sobriety Date Calculator | Committed",
    description: "Calculate your sober time and next milestone privately in your browser. Committed tracks sobriety on iPhone, Mac and Apple Watch with no account or subscription.",
    ogDescription: "Calculate your sober time and next milestone privately in your browser."
  },
  es: {
    path: "es/",
    title: "Calculadora de sobriedad | Committed",
    description: "Calcula tu tiempo de sobriedad y tu próximo hito de forma privada en tu navegador. Committed lleva tu cuenta en iPhone, Mac y Apple Watch, sin cuenta ni suscripción.",
    ogDescription: "Calcula tu tiempo de sobriedad y tu próximo hito de forma privada en tu navegador."
  },
  scripts: ["js/dates.js", "js/common.js", "js/calculator.js"],
  jsonLd: (ctx) => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t(ctx, L("Sobriety Date Calculator", "Calculadora de sobriedad")),
      url: ctx.abs(ctx.page[ctx.lang].path),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      inLanguage: ctx.lang,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: ctx.config.app.developer }
    },
    appLd(ctx),
    faqLd(t(ctx, FAQ))
  ],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `${toolStrings(ctx)}
<section class="calc-hero">
  <div class="shell calc-layout">
    <div>
      <h1>${T("Sobriety date calculator", "Calculadora de sobriedad")}</h1>
      <p class="lede" style="margin-bottom:28px">${T("Enter the day you started to see your sober time, your milestones so far and the next one coming.", "Ingresa el día en que empezaste para ver tu tiempo de sobriedad, los hitos que ya alcanzaste y el siguiente.")}</p>
      <div class="calculator" id="${T("calculator", "calculadora")}">
        ${calculatorForm(ctx)}
        <p class="calculator-empty" data-calc-empty>${T("Your sober time, your milestones so far and a dot for every day will appear here. Nothing you enter leaves this page.", "Tu tiempo de sobriedad, tus hitos y un punto por cada día aparecerán aquí. Nada de lo que ingresas sale de esta página.")}</p>
        <div class="calculator-results" data-results aria-live="polite" hidden>
          <p class="eyebrow result-kicker">${T("Time since your date", "Tiempo desde tu fecha")}</p>
          <span class="day-number numeral" data-total-days>0</span>
          <p class="day-label" data-day-label></p>
          <p class="result-detail" data-breakdown></p>
          <p class="result-date" data-since></p>
          <div class="next-milestone">
            <p class="next-label" data-next-label></p>
            <p class="next-date" data-next-date></p>
            <div class="next-progress" aria-hidden="true"><i data-next-progress></i></div>
          </div>
          <div class="result-actions">
            <a class="button button-primary" data-carry href="${ctx.link("progress-image")}">${T("Make a shareable image", "Crear una imagen para compartir")}</a>
            <a class="button button-secondary" data-carry href="${ctx.link("milestones")}">${T("See all my milestone dates", "Ver todas las fechas de mis hitos")}</a>
          </div>
        </div>
        <div class="dot-field" data-dot-field hidden>
          <p class="dot-caption">${T("Every dot is a day you chose. The bright ones are milestones.", "Cada punto es un día que elegiste. Los brillantes son hitos.")}</p>
          <canvas data-dot-canvas aria-hidden="true"></canvas>
          <ul class="dot-legend" aria-hidden="true">
            <li><span class="legend-dot is-milestone"></span>${T("milestone", "hito")}</li>
            <li><span class="legend-dot"></span>${T("a day", "un día")}</li>
            <li><span class="legend-dot is-today"></span>${T("today", "hoy")}</li>
          </ul>
        </div>
      </div>
      <details class="how-it-works">
        <summary>${T("How your sober time is calculated", "Cómo se calcula tu tiempo de sobriedad")}</summary>
        <p>${T("The day count is the number of calendar days between your start date and today; your start date is day zero. The breakdown counts years, months and days with real month lengths. Dates use your device’s calendar, so daylight-saving changes don’t change the count. Milestones match the Committed app exactly.", "La cuenta de días es el número de días del calendario entre tu fecha de inicio y hoy; tu fecha de inicio es el día cero. El desglose cuenta años, meses y días con la duración real de cada mes. Se usa el calendario de tu dispositivo, así que el cambio de horario no altera la cuenta. Los hitos son exactamente los de la app Committed.")}</p>
        <p>${T("You choose your start date; the calculator doesn’t decide what counts as a sobriety date.", "Tú eliges tu fecha de inicio; la calculadora no decide qué cuenta como fecha de sobriedad.")}</p>
      </details>
    </div>
    <aside class="app-aside stage" aria-labelledby="app-aside-title">
      <div class="dotfield" aria-hidden="true"></div>
      <div style="position:relative">
        <p class="eyebrow"><b>Committed</b> ${T("for iPhone, Mac and Apple Watch", "para iPhone, Mac y Apple Watch")}</p>
        <h2 id="app-aside-title">${T("Want to keep track?", "¿Quieres llevar la cuenta?")}</h2>
        <p class="muted">${T("Committed keeps your count, shows your next milestone and puts it on your Home Screen, desktop and wrist. Free, with no account, ads or subscription.", "Committed lleva tu cuenta, te muestra tu próximo hito y lo pone en tu pantalla de inicio, tu escritorio y tu muñeca. Gratis, sin cuenta, anuncios ni suscripción.")}</p>
        <div class="button-row" style="margin-top:20px">${storeButton(ctx, "home")}<a class="button button-secondary" href="${ctx.link("product")}">${T("See the app", "Conoce la app")}</a></div>
      </div>
      <div class="widget-row" style="position:relative">${widget.numeral(ctx)}${widget.constellation(ctx, SAMPLES.alcohol)}</div>
    </aside>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head">
      <h2 class="title-s">${T("More free tools", "Más herramientas gratuitas")}</h2>
      <p class="muted">${T("All of them run in your browser. Nothing you enter leaves your device.", "Todas funcionan en tu navegador. Nada de lo que ingresas sale de tu dispositivo.")}</p>
    </div>
    ${toolCards(ctx, ["progress-image", "milestones", "countdown", "money-saved"])}
  </div>
</section>

<section class="section">
  <div class="shell-narrow">
    <h2 class="title-s">${T("About the calculator", "Sobre la calculadora")}</h2>
    ${faq(t(ctx, FAQ))}
    ${privacyLine(ctx)}
  </div>
</section>`;
  }
};
