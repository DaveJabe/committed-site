import { L, t, esc } from "./util.mjs";

export const TOOL_META = {
  calculator: L(
    { title: "Sobriety calculator", text: "Your sober time in days, and in years, months and days, with your next milestone." },
    { title: "Calculadora de sobriedad", text: "Tu tiempo de sobriedad en días, y en años, meses y días, con tu próximo hito." }
  ),
  "progress-image": L(
    { title: "Progress image", text: "Turn your count into a Matrix, Sky or Ledger image to save or share. You choose what it shows." },
    { title: "Imagen de progreso", text: "Convierte tu cuenta en una imagen de Matriz, Tu cielo o Registro para guardar o compartir. Tú eliges qué muestra." }
  ),
  milestones: L(
    { title: "Milestone dates", text: "Every milestone from your start date, past and upcoming, with an optional calendar file." },
    { title: "Fechas de hitos", text: "Cada hito desde tu fecha de inicio, pasados y próximos, con un archivo de calendario opcional." }
  ),
  countdown: L(
    { title: "Start-date countdown", text: "Planning a start date? Count down to day one and see when your first milestones will land." },
    { title: "Cuenta regresiva", text: "¿Planeas una fecha de inicio? Cuenta los días hasta el día uno y mira cuándo llegarán tus primeros hitos." }
  ),
  "money-saved": L(
    { title: "Money saved", text: "What you used to spend, multiplied by the days you’ve kept. See the total grow toward your next milestone." },
    { title: "Dinero ahorrado", text: "Lo que gastabas, multiplicado por los días que llevas. Mira cómo crece el total hasta tu próximo hito." }
  )
};

export function toolCards(ctx, ids, level = 3) {
  return `<div class="grid-2 tool-cards">${ids
    .map((id) => {
      const meta = t(ctx, TOOL_META[id]);
      return `<a class="card" href="${ctx.link(id)}"><h${level}>${esc(meta.title)}</h${level}><p>${esc(meta.text)}</p><span class="more">${t(ctx, L("Open", "Abrir"))} →</span></a>`;
    })
    .join("")}</div>`;
}

export function dateField(ctx, { id = "start-date", label, hint, future = false } = {}) {
  return `<div class="field">
  <label for="${id}">${label || t(ctx, L("Start date", "Fecha de inicio"))}</label>
  <input id="${id}" name="${id}" type="date" required autocomplete="off" data-date-input${future ? " data-allow-future" : ""}>
  ${hint ? `<p class="hint">${hint}</p>` : ""}
</div>`;
}

export function calculatorForm(ctx) {
  return `<form class="calculator-form" data-sobriety-calculator novalidate>
  ${dateField(ctx)}
  <button class="button button-primary" type="submit">${t(ctx, L("Calculate my time", "Calcular mi tiempo"))}</button>
  <p class="form-error" data-error role="alert" style="grid-column:1/-1"></p>
</form>`;
}

export function privacyLine(ctx) {
  return `<p class="privacy-line"><svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1 3 4v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V4l-7-3Z"/></svg><span>${t(ctx, L("Runs entirely in your browser. Your date isn’t stored, sent anywhere or added to the address, and this site has no analytics or cookies.", "Funciona por completo en tu navegador. Tu fecha no se guarda, no se envía a ningún sitio ni se añade a la dirección, y este sitio no tiene analíticas ni cookies."))}</span></p>`;
}

/** The strings the tools' scripts need, embedded as JSON so the scripts stay language-agnostic. */
export function toolStrings(ctx, extra = {}) {
  const base = t(ctx, L(
    {
      locale: "en-US",
      required: "Choose a start date first.",
      invalid: "That date couldn’t be read. Try entering it again.",
      future: "The start date needs to be today or earlier.",
      tooFar: "Pick a date within the next year.",
      day: ["day", "days"],
      month: ["month", "months"],
      year: ["year", "years"],
      week: ["week", "weeks"],
      since: "Since {date}",
      next: "Next: {name}",
      arrives: "{date}, in {distance}",
      today: "today",
      reachedToday: "Today: {name}",
      zeroDays: "Day one starts today",
      sober: "Sober from",
      sky: "Your Sky",
      matrix: "Matrix",
      ledger: "Ledger"
    },
    {
      locale: "es-MX",
      required: "Elige primero una fecha de inicio.",
      invalid: "No se pudo leer esa fecha. Intenta ingresarla de nuevo.",
      future: "La fecha de inicio debe ser hoy o antes.",
      tooFar: "Elige una fecha dentro del próximo año.",
      day: ["día", "días"],
      month: ["mes", "meses"],
      year: ["año", "años"],
      week: ["semana", "semanas"],
      since: "Desde el {date}",
      next: "Siguiente: {name}",
      arrives: "{date}, dentro de {distance}",
      today: "hoy",
      reachedToday: "Hoy: {name}",
      zeroDays: "El día uno empieza hoy",
      sober: "Sin",
      sky: "Tu cielo",
      matrix: "Matriz",
      ledger: "Registro"
    }
  ));
  return `<script type="application/json" id="tool-strings">${JSON.stringify({ ...base, ...extra }).replace(/</g, "\\u003c")}</script>`;
}
