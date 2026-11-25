import { L, t, esc } from "../lib/util.mjs";
import { storeButton } from "../lib/layout.mjs";
import { heroComposition, phone, ledger, widget, watch, featureList, pricing, faq, faqLd, appLd, icons, SAMPLES } from "../lib/components.mjs";

const FAQ = L(
  [
    { q: "Is Committed free?", a: "Yes. You can track one commitment for as long as you like, with every view and every built-in milestone, without paying. The optional Lifetime Unlock is a one-time purchase ($14.99 in the US) that adds widgets, the Apple Watch app, iCloud Sync, more commitments and more themes. There is no subscription." },
    { q: "Does Committed collect my data?", a: "No. There is no account, no analytics, no advertising and no tracking, and the App Store privacy label reads “Data Not Collected”. Your commitments stay on your devices and, if you turn on iCloud Sync, in your own private iCloud. The only thing the developer ever receives is feedback you choose to send." },
    { q: "Which devices does it run on?", a: "iPhone with iOS 18.6 or later, Mac with macOS 15.2 or later, and Apple Watch with watchOS 11.0 or later. One download covers all three, and one Lifetime Unlock unlocks all three." },
    { q: "Can I track something other than alcohol?", a: "Yes. Track drinking, nicotine, gambling, social media or anything else you’ve committed to, and choose the wording that fits, such as “Sober from” or “Free from”." },
    { q: "What if my start date is in the future?", a: "Set it anyway. Committed counts down to day one, then starts counting up. Start dates can be up to a year ahead." },
    { q: "Is Committed a treatment program?", a: "No. Committed counts elapsed time and celebrates milestones. It isn’t medical advice or treatment. Its Meetings and Resources screens point to recovery groups’ own meeting finders and to free helplines." }
  ],
  [
    { q: "¿Committed es gratis?", a: "Sí. Puedes llevar un compromiso durante todo el tiempo que quieras, con todas las vistas y todos los hitos incluidos, sin pagar. El Desbloqueo de por vida es una compra única opcional (14,99 USD en EE. UU.) que añade widgets, la app de Apple Watch, la sincronización con iCloud, más compromisos y más temas. No hay suscripción." },
    { q: "¿Committed recopila mis datos?", a: "No. No hay cuenta, ni analíticas, ni publicidad, ni rastreo, y la etiqueta de privacidad del App Store dice «Datos no recopilados». Tus compromisos se quedan en tus dispositivos y, si activas la sincronización con iCloud, en tu propio iCloud privado. Lo único que recibe el desarrollador son los comentarios que tú decidas enviar." },
    { q: "¿En qué dispositivos funciona?", a: "iPhone con iOS 18.6 o posterior, Mac con macOS 15.2 o posterior y Apple Watch con watchOS 11.0 o posterior. Una sola descarga sirve para los tres, y un solo Desbloqueo de por vida desbloquea los tres." },
    { q: "¿Puedo contar algo que no sea el alcohol?", a: "Sí. Lleva la cuenta del alcohol, la nicotina, el juego, las redes sociales o cualquier otro compromiso, y elige las palabras que te queden, como «Sin» o «Libre de»." },
    { q: "¿Y si mi fecha de inicio es en el futuro?", a: "Ponla igual. Committed cuenta los días que faltan para el día uno y después empieza a contar hacia adelante. La fecha puede estar hasta un año en el futuro." },
    { q: "¿Committed es un tratamiento?", a: "No. Committed cuenta el tiempo transcurrido y celebra tus hitos. No es consejo ni tratamiento médico. Sus pantallas Reuniones y Recursos te llevan a los buscadores de reuniones de cada grupo y a líneas de ayuda gratuitas." }
  ]
);

export default {
  id: "product",
  campaign: "app",
  updated: "2026-11-25",
  en: {
    path: "sobriety-tracker-app/",
    title: "Committed: Private Sobriety Tracker for iPhone, Mac and Apple Watch",
    description: "Count your sober days, see every milestone coming, and keep your progress on your Home Screen, Mac desktop and wrist. No account, ads or subscription.",
    crumb: "Sobriety tracker app"
  },
  es: {
    path: "es/app-sobriedad/",
    title: "Committed: contador de sobriedad privado para iPhone, Mac y Apple Watch",
    description: "Cuenta tus días de sobriedad, mira llegar cada hito y lleva tu progreso en la pantalla de inicio, el escritorio del Mac y tu muñeca. Sin cuenta, anuncios ni suscripción.",
    crumb: "App de sobriedad"
  },
  jsonLd: (ctx) => [appLd(ctx), faqLd(t(ctx, FAQ))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `
<section class="hero stage">
  <div class="dotfield" aria-hidden="true"></div>
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${T("<b>Committed</b> for iPhone, Mac and Apple Watch", "<b>Committed</b> para iPhone, Mac y Apple Watch")}</p>
      <h1 class="display">${T("Every day counts.", "Cada día cuenta.")}</h1>
      <p class="lede">${T("A private sobriety tracker that counts your days, lights up every milestone, and keeps your progress where you’ll see it: your Home Screen, your Mac desktop and your wrist.", "Un contador de sobriedad privado que cuenta tus días, ilumina cada hito y pone tu progreso donde lo vas a ver: la pantalla de inicio, el escritorio del Mac y tu muñeca.")}</p>
      <div class="button-row">
        ${storeButton(ctx, "app-hero")}
        <a class="button button-secondary" href="${ctx.link("calculator")}">${T("Try the free calculator", "Prueba la calculadora gratis")}</a>
      </div>
      <ul class="hero-meta">
        <li>${T("Free to use", "Gratis")}</li>
        <li>${T("No account or ads", "Sin cuenta ni anuncios")}</li>
        <li>${T("One-time unlock, no subscription", "Pago único, sin suscripción")}</li>
      </ul>
    </div>
    ${heroComposition(ctx)}
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head">
      <p class="eyebrow">${T("<b>Look how far</b> you’ve come", "<b>Mira todo</b> lo que has avanzado")}</p>
      <h2 class="title">${T("Three ways to see your time.", "Tres maneras de ver tu tiempo.")}</h2>
      <p class="lede">${T("Every commitment can switch between three views. They all tell the truth about the same days; pick the one that feels like yours.", "Cada compromiso puede cambiar entre tres vistas. Las tres cuentan los mismos días; elige la que sientas tuya.")}</p>
    </div>
    <div class="grid-3 views-grid">
      <figure class="card stage">
        ${phone(ctx, "matrix", { crop: true })}
        <figcaption><h3>${T("Matrix", "Matriz")}</h3><p>${T("One dot for every day you chose. Milestones glow warm, and today is ringed.", "Un punto por cada día que elegiste. Los hitos brillan cálidos y el día de hoy lleva un anillo.")}</p></figcaption>
      </figure>
      <figure class="card stage">
        ${phone(ctx, "sky", { crop: true })}
        <figcaption><h3>${T("Your Sky", "Tu cielo")}</h3><p>${T("Each milestone becomes a star in a constellation that climbs as you go. Drag to look back.", "Cada hito se vuelve una estrella de una constelación que sube contigo. Desliza para mirar atrás.")}</p></figcaption>
      </figure>
      <figure class="card stage">
        <div class="ledger-card">${ledger(ctx)}</div>
        <figcaption><h3>${T("Ledger", "Registro")}</h3><p>${T("The plain record: years, months and days, set in big, quiet numerals.", "La cuenta sencilla: años, meses y días, en números grandes y tranquilos.")}</p></figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section stage">
  <div class="shell split">
    <div>
      <p class="eyebrow">${T("<b>Progress</b> at a glance", "<b>Tu progreso</b> de un vistazo")}</p>
      <h2 class="title">${T("Your count, without opening the app.", "Tu cuenta, sin abrir la app.")}</h2>
      <p class="lede">${T("Six widget styles for the iPhone Home Screen and the Mac desktop, plus Lock Screen widgets and watch complications. Pick the commitment each one shows.", "Seis estilos de widget para la pantalla de inicio del iPhone y el escritorio del Mac, además de widgets para la pantalla bloqueada y complicaciones para el reloj. Elige qué compromiso muestra cada uno.")}</p>
      <div class="button-row"><a class="button button-secondary" href="${ctx.link("widgets")}">${T("See every widget", "Ver todos los widgets")}</a></div>
    </div>
    <div class="widget-stack" style="justify-content:center">
      ${widget.minimal(ctx)}
      ${widget.constellation(ctx, SAMPLES.social)}
      ${widget.two(ctx)}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head">
      <p class="eyebrow">${T("<b>With you</b> everywhere", "<b>Contigo</b> en todas partes")}</p>
      <h2 class="title">${T("Native on every Apple device you carry.", "Nativa en cada dispositivo Apple que llevas contigo.")}</h2>
      <p class="lede">${T("Not a web wrapper. Committed is built for each device, and iCloud Sync keeps them in step through your own iCloud account.", "No es una web empaquetada. Committed está hecha para cada dispositivo, y la sincronización con iCloud los mantiene al día a través de tu propia cuenta de iCloud.")}</p>
    </div>
    <div class="platforms">
      <a class="card" href="${ctx.link("iphone")}"><span class="feature-mark">${icons.phone}</span><h3>iPhone</h3><p>${T("The full app: every view, milestones, Home Screen and Lock Screen widgets, Meetings and Resources.", "La app completa: todas las vistas, hitos, widgets de pantalla de inicio y de pantalla bloqueada, Reuniones y Recursos.")}</p><span class="req">iOS ${ctx.config.app.requirements.ios}+</span></a>
      <a class="card" href="${ctx.link("mac")}"><span class="feature-mark">${icons.mac}</span><h3>Mac</h3><p>${T("A native Mac app with desktop widgets, in sync with your iPhone.", "Una app nativa para Mac con widgets de escritorio, sincronizada con tu iPhone.")}</p><span class="req">macOS ${ctx.config.app.requirements.macos}+</span></a>
      <a class="card" href="${ctx.link("watch")}"><span class="feature-mark">${icons.watch}</span><h3>Apple Watch</h3><p>${T("Your commitments and milestones on your wrist, and your count on your watch face.", "Tus compromisos e hitos en tu muñeca, y tu cuenta en la esfera.")}</p><span class="req">watchOS ${ctx.config.app.requirements.watchos}+</span></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>
      <p class="eyebrow">${T("<b>Milestones</b> that mean something", "<b>Hitos</b> que significan algo")}</p>
      <h2 class="title">${T("From day one to year sixty.", "Del día uno al año sesenta.")}</h2>
      <p class="lede">${T("Committed marks 1, 7, 14, 21, 30, 60, 90 and 100 days, then 6, 9, 18, 30 and 42 months, then every anniversary. Months are real calendar months, so your six-month day lands on the date you expect.", "Committed marca 1, 7, 14, 21, 30, 60, 90 y 100 días, luego 6, 9, 18, 30 y 42 meses, y después cada aniversario. Los meses son meses reales del calendario, así que tus seis meses llegan el día que esperas.")}</p>
      <p class="muted">${T("Add your own milestones too: a birthday, a trip, a date that matters to you.", "Añade también tus propios hitos: un cumpleaños, un viaje, una fecha que te importe.")}</p>
      <div class="button-row"><a class="button button-secondary" href="${ctx.link("milestones")}">${T("Find your milestone dates", "Calcula las fechas de tus hitos")}</a></div>
    </div>
    <div>
      ${featureList([
        { icon: "stack", title: T("More than one commitment", "Más de un compromiso"), text: T("Track drinking and nicotine side by side, or anything else you’ve committed to.", "Lleva el alcohol y la nicotina lado a lado, o cualquier otro compromiso.") },
        { icon: "lock", title: T("Hidden commitments", "Compromisos ocultos"), text: T("Keep private ones behind Face ID on iPhone and Touch ID on Mac.", "Protege los privados con Face ID en el iPhone y Touch ID en el Mac.") },
        { icon: "people", title: T("Meetings and Resources", "Reuniones y Recursos"), text: T("Open AA, NA, SMART Recovery, Al-Anon and other groups’ own meeting finders, and free helplines for your country.", "Abre los buscadores de reuniones de AA, NA, SMART Recovery, Al-Anon y otros grupos, y líneas de ayuda gratuitas de tu país.") },
        { icon: "palette", title: T("Eight themes", "Ocho temas"), text: T("Mint, Dreamy, Sea, Amethyst, Graphite, Rose, Copper and Moss, all dark and calm.", "Mint, Dreamy, Sea, Amethyst, Graphite, Rose, Copper y Moss, todos oscuros y tranquilos.") },
        { icon: "access", title: T("Made for everyone", "Hecha para todos"), text: T("VoiceOver throughout, larger text sizes, higher-contrast options and reduced-motion versions of every view.", "VoiceOver en todo, textos más grandes, opciones de mayor contraste y versiones con menos movimiento de cada vista.") }
      ])}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>
      <p class="eyebrow">${T("<b>Private</b> by design", "<b>Privada</b> desde el diseño")}</p>
      <h2 class="title">${T("Nobody else needs to know your date.", "Nadie más necesita saber tu fecha.")}</h2>
      <p class="lede">${T("No account to create, nothing to sign in to, no analytics, ads or tracking. Your commitments stay on your devices and, if you choose, in your own iCloud, where the developer can’t read them.", "No hay cuenta que crear ni nada en qué iniciar sesión, ni analíticas, anuncios o rastreo. Tus compromisos se quedan en tus dispositivos y, si quieres, en tu propio iCloud, donde el desarrollador no puede leerlos.")}</p>
      <p><a href="${ctx.link("privacy")}">${T("Read the privacy policy", "Lee la política de privacidad")}</a></p>
    </div>
    <div class="card"><p class="eyebrow">${T("App Store privacy label", "Etiqueta de privacidad del App Store")}</p><p class="title-s" style="margin:0">${T("Data Not Collected", "Datos no recopilados")}</p><p class="muted" style="margin-top:12px">${T("The developer does not collect any data from this app. The one exception is feedback you choose to send from Settings.", "El desarrollador no recopila ningún dato de esta app. La única excepción son los comentarios que tú decidas enviar desde Configuración.")}</p></div>
  </div>
</section>

<section class="section" id="pricing">
  <div class="shell">
    <div class="section-head">
      <p class="eyebrow">${T("<b>Free</b> to use", "<b>Gratis</b>")}</p>
      <h2 class="title">${T("Track for free. Unlock everything once.", "Lleva la cuenta gratis. Desbloquea todo una vez.")}</h2>
    </div>
    ${pricing(ctx, "app-pricing")}
  </div>
</section>

<section class="section">
  <div class="shell-narrow">
    <h2 class="title-s">${T("Questions", "Preguntas")}</h2>
    ${faq(t(ctx, FAQ))}
  </div>
</section>

<section class="cta-band stage">
  <div class="shell">
    <h2 class="title">${T("Start counting today.", "Empieza a contar hoy.")}</h2>
    <p class="lede">${T("Free on the App Store for iPhone, Mac and Apple Watch.", "Gratis en el App Store para iPhone, Mac y Apple Watch.")}</p>
    <div class="button-row">${storeButton(ctx, "app-footer")}</div>
  </div>
</section>`;
  }
};
