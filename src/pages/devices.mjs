import { L, t } from "../lib/util.mjs";
import { storeButton } from "../lib/layout.mjs";
import { heroComposition, phone, ledger, widget, watch, watchPhoto, featureList, pricing, faq, faqLd, appLd, artworkOr, SAMPLES } from "../lib/components.mjs";

const req = (ctx) => ctx.config.app.requirements;

// ---------------------------------------------------------------------------------------------------
const iphone = {
  id: "iphone",
  campaign: "iphone",
  updated: "2026-11-25",
  en: {
    path: "sobriety-tracker-iphone/",
    title: "Sobriety Tracker for iPhone | Committed",
    description: "Track sober days on iPhone with Committed. Three views, every milestone, Home Screen and Lock Screen widgets. Free to use, with an optional one-time Lifetime Unlock.",
    crumb: "iPhone"
  },
  es: {
    path: "es/app-sobriedad-iphone/",
    title: "App de sobriedad para iPhone | Committed",
    description: "Lleva tus días de sobriedad en el iPhone con Committed. Tres vistas, todos los hitos y widgets para la pantalla de inicio y la pantalla bloqueada. Gratis, con un Desbloqueo de por vida opcional.",
    crumb: "iPhone"
  },
  jsonLd: (ctx) => [appLd(ctx, { "@type": "MobileApplication", operatingSystem: `iOS ${req(ctx).ios} or later` })],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `
<section class="hero stage">
  <div class="dotfield" aria-hidden="true"></div>
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${T("<b>Committed</b> for iPhone", "<b>Committed</b> para iPhone")}</p>
      <h1 class="display">${T("A sobriety tracker that lives on your Home Screen.", "Un contador de sobriedad en tu pantalla de inicio.")}</h1>
      <p class="lede">${T("See your days the moment you unlock your phone. Open the app for Matrix, Your Sky and Ledger, every milestone, and help when you want it.", "Mira tus días en cuanto desbloqueas el teléfono. Abre la app para ver Matriz, Tu cielo y Registro, cada hito y ayuda cuando la quieras.")}</p>
      <div class="button-row">${storeButton(ctx, "iphone")}<a class="button button-secondary" href="#pricing">${T("What’s free", "Qué es gratis")}</a></div>
      <ul class="hero-meta"><li>iOS ${req(ctx).ios}+</li><li>${T("English and Spanish", "Español e inglés")}</li><li>${T("No account", "Sin cuenta")}</li></ul>
    </div>
    ${heroComposition(ctx)}
  </div>
</section>

<section class="section">
  <div class="shell split">
    ${phone(ctx, "matrix")}
    <div>
      <p class="eyebrow"><b>${T("Matrix", "Matriz")}</b></p>
      <h2 class="title">${T("Every day sober becomes a dot.", "Cada día sin beber se vuelve un punto.")}</h2>
      <p class="lede">${T("Your whole run as a field of days, with milestones glowing warm. Long stretches gather into weeks and months so the field always fits.", "Todo tu camino como un campo de días, con los hitos brillando cálidos. Los tramos largos se agrupan en semanas y meses para que el campo siempre quepa.")}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split reverse">
    ${phone(ctx, "sky")}
    <div>
      <p class="eyebrow"><b>${T("Your Sky", "Tu cielo")}</b></p>
      <h2 class="title">${T("Watch your days become a constellation.", "Mira tus días convertirse en una constelación.")}</h2>
      <p class="lede">${T("Each milestone lights a star. Drag along the horizon to look back, and in 3.1 the milestones you made fly in as shooting stars.", "Cada hito enciende una estrella. Desliza por el horizonte para mirar atrás, y en la 3.1 los hitos que creaste llegan como estrellas fugaces.")}</p>
    </div>
  </div>
</section>

<section class="section stage">
  <div class="shell split">
    <div class="card" style="max-width:420px;justify-self:center;width:100%">${ledger(ctx)}</div>
    <div>
      <p class="eyebrow"><b>${T("Ledger", "Registro")}</b></p>
      <h2 class="title">${T("Or just the numbers.", "O solo los números.")}</h2>
      <p class="lede">${T("Years, months and days, in big, quiet type.", "Años, meses y días, en letra grande y tranquila.")}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>
      <p class="eyebrow">${T("<b>Widgets</b>", "<b>Widgets</b>")}</p>
      <h2 class="title">${T("Your streak, one glance away.", "Tu racha, a un vistazo.")}</h2>
      <p class="lede">${T("Six Home Screen styles, from a single number to a constellation, plus Lock Screen widgets that sit under the clock.", "Seis estilos para la pantalla de inicio, de un solo número a una constelación, además de widgets para la pantalla bloqueada bajo el reloj.")}</p>
      <div class="button-row"><a class="button button-secondary" href="${ctx.link("widgets")}">${T("See every widget", "Ver todos los widgets")}</a></div>
    </div>
    <div class="widget-stack stage" style="justify-content:center;padding:28px;border-radius:var(--radius-l)">${widget.minimal(ctx)}${widget.numeral(ctx)}${widget.two(ctx)}</div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head"><h2 class="title">${T("Everything else on iPhone", "Todo lo demás en el iPhone")}</h2></div>
    ${featureList([
      { icon: "people", title: T("Meetings and Resources", "Reuniones y Recursos"), text: T("Meetings opens each group’s own finder, near you or online. Resources gathers free helplines and reading for the country you pick, and up to three people you trust, one tap away. They stay on your iPhone.", "Reuniones abre el buscador de cada grupo, cerca de ti o en línea. Recursos reúne líneas de ayuda gratuitas y lecturas del país que elijas, y hasta tres personas de confianza a un toque. Se quedan en tu iPhone.") },
      { icon: "flag", title: T("Milestones and your own goals", "Hitos y tus propias metas"), text: T("Built-in milestones from day one through year sixty, plus milestones you set yourself.", "Hitos incluidos desde el día uno hasta el año sesenta, más los que tú definas.") },
      { icon: "stack", title: T("Several commitments", "Varios compromisos"), text: T("Swipe between them. Pin one to the top, or hide one behind Face ID with a long press.", "Desliza entre ellos. Fija uno arriba u oculta otro con Face ID manteniéndolo presionado.") },
      { icon: "cloud", title: T("iCloud Sync", "Sincronización con iCloud"), text: T("Change something on your iPhone and it shows up on your Mac and Apple Watch.", "Cambia algo en tu iPhone y aparece en tu Mac y tu Apple Watch.") },
      { icon: "access", title: T("Accessible", "Accesible"), text: T("VoiceOver, larger text, higher contrast and reduced motion throughout.", "VoiceOver, texto más grande, más contraste y menos movimiento en toda la app.") }
    ])}
  </div>
</section>

<section class="section" id="pricing">
  <div class="shell">
    <div class="section-head"><p class="eyebrow">${T("<b>Free</b> to use", "<b>Gratis</b>")}</p><h2 class="title">${T("Track for free. Unlock everything once.", "Lleva la cuenta gratis. Desbloquea todo una vez.")}</h2></div>
    ${pricing(ctx, "iphone-pricing")}
    <div class="button-row">${storeButton(ctx, "iphone-pricing")}</div>
  </div>
</section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const MAC_FAQ = L(
  [
    { q: "Is there a Committed app for Mac?", a: "Yes. Committed has been a native Mac app since version 3.0. It needs macOS 15.2 or later and comes with the same App Store download as the iPhone app." },
    { q: "Do I have to buy it again for Mac?", a: "No. The Mac app is free to download, and if you bought Lifetime Unlock on iPhone, Restore purchase on the Mac unlocks it there too." },
    { q: "Does the Mac stay in sync with my iPhone?", a: "With iCloud Sync on, yes: whatever you change on one device shows up on the other, through your own private iCloud account." },
    { q: "Can I put my count on the Mac desktop?", a: "Yes. The same widget styles as iPhone work on the Mac desktop and in Notification Center. Widgets are part of Lifetime Unlock." }
  ],
  [
    { q: "¿Hay una app de Committed para Mac?", a: "Sí. Committed es una app nativa para Mac desde la versión 3.0. Requiere macOS 15.2 o posterior y viene con la misma descarga del App Store que la app para iPhone." },
    { q: "¿Tengo que volver a comprarla para Mac?", a: "No. La app para Mac se descarga gratis, y si compraste el Desbloqueo de por vida en el iPhone, Restaurar compra en el Mac también lo desbloquea ahí." },
    { q: "¿El Mac se mantiene sincronizado con mi iPhone?", a: "Con la sincronización con iCloud activada, sí: lo que cambies en un dispositivo aparece en el otro, a través de tu propia cuenta privada de iCloud." },
    { q: "¿Puedo poner mi cuenta en el escritorio del Mac?", a: "Sí. Los mismos estilos de widget del iPhone funcionan en el escritorio del Mac y en el Centro de notificaciones. Los widgets forman parte del Desbloqueo de por vida." }
  ]
);

const mac = {
  id: "mac",
  campaign: "mac",
  updated: "2026-11-25",
  en: {
    path: "sobriety-tracker-mac/",
    title: "Sobriety Tracker for Mac | Committed",
    description: "Committed is a native sobriety tracker for Mac, with desktop widgets and iCloud Sync with your iPhone. macOS 15.2 or later. Free to use, no subscription.",
    crumb: "Mac"
  },
  es: {
    path: "es/app-sobriedad-mac/",
    title: "Contador de sobriedad para Mac | Committed",
    description: "Committed es un contador de sobriedad nativo para Mac, con widgets de escritorio y sincronización con iCloud con tu iPhone. macOS 15.2 o posterior. Gratis y sin suscripción.",
    crumb: "Mac"
  },
  jsonLd: (ctx) => [appLd(ctx, { operatingSystem: `macOS ${req(ctx).macos} or later` }), faqLd(t(ctx, MAC_FAQ))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    const desktop = `<div class="desktop-stage stage" role="img" aria-label="${T("Committed widgets on a Mac desktop", "Widgets de Committed en el escritorio de un Mac")}">
      <div class="desktop-bar" aria-hidden="true"><span></span></div>
      <div class="desktop-widgets" aria-hidden="true">
        <div class="widget-row">${widget.constellation(ctx, SAMPLES.alcohol, "medium")}</div>
        <div class="widget-row">${widget.numeral(ctx)}${widget.minimal(ctx, SAMPLES.social)}</div>
        <div class="widget-row">${widget.two(ctx)}</div>
      </div>
    </div>`;
    return `
<section class="hero stage">
  <div class="dotfield" aria-hidden="true"></div>
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${T("<b>Committed</b> for Mac", "<b>Committed</b> para Mac")}</p>
      <h1 class="display">${T("A sobriety tracker for your Mac.", "Un contador de sobriedad para tu Mac.")}</h1>
      <p class="lede">${T("A native Mac app with desktop widgets, in sync with your iPhone. Keep your count beside your work, and open the app for every view and milestone.", "Una app nativa para Mac con widgets de escritorio, sincronizada con tu iPhone. Ten tu cuenta junto a tu trabajo y abre la app para ver cada vista y cada hito.")}</p>
      <div class="button-row">${storeButton(ctx, "mac", { mac: true, label: T("Download on the Mac App Store", "Descargar en el Mac App Store") })}</div>
      <ul class="hero-meta"><li>macOS ${req(ctx).macos}+</li><li>${T("Same download as iPhone", "La misma descarga que en iPhone")}</li><li>${T("One unlock for every device", "Un desbloqueo para todos tus dispositivos")}</li></ul>
    </div>
    ${artworkOr(ctx, "assets/mac/committed-mac-hero.webp", T("The Committed Mac app showing Matrix: 4 years, 4 days sober from alcohol, with sample commitments in the sidebar", "La app Committed para Mac mostrando Matriz: 4 años y 4 días sin alcohol, con compromisos de ejemplo en la barra lateral"), desktop, { eager: true, className: "mac-window", width: 1600, height: 1031 })}
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>
      <p class="eyebrow">${T("<b>Desktop</b> widgets", "<b>Widgets</b> de escritorio")}</p>
      <h2 class="title">${T("Your count, beside your work.", "Tu cuenta, junto a tu trabajo.")}</h2>
      <p class="lede">${T("Place Committed widgets on the desktop or in Notification Center. The Mac gets the same styles as iPhone: Constellation, Numeral, Minimal, Chronicle, and two or four commitments at once.", "Coloca widgets de Committed en el escritorio o en el Centro de notificaciones. El Mac tiene los mismos estilos que el iPhone: Constelación, Numérico, Mínimo, Crónica y dos o cuatro compromisos a la vez.")}</p>
      <p class="muted">${T("Control-click the desktop and choose Edit Widgets to add one.", "Haz clic con la tecla Control en el escritorio y elige Editar widgets para añadir uno.")}</p>
    </div>
    <div class="widget-stack" style="justify-content:center">${widget.chronicle(ctx)}${widget.constellation(ctx, SAMPLES.nicotine)}${widget.two(ctx)}</div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head"><p class="eyebrow">${T("<b>Made</b> for the Mac", "<b>Hecha</b> para el Mac")}</p><h2 class="title">${T("Not a phone app on a big screen.", "No es una app de teléfono en una pantalla grande.")}</h2></div>
    ${featureList([
      { icon: "mac", title: T("A real Mac window", "Una ventana de Mac de verdad"), text: T("Matrix, Your Sky and Ledger laid out for a big display, with your commitments a click away.", "Matriz, Tu cielo y Registro pensados para una pantalla grande, con tus compromisos a un clic.") },
      { icon: "cloud", title: T("In sync with your iPhone", "Sincronizada con tu iPhone"), text: T("Turn on iCloud Sync and changes on one device show up on the other.", "Activa la sincronización con iCloud y los cambios en un dispositivo aparecen en el otro.") },
      { icon: "lock", title: T("Touch ID for private commitments", "Touch ID para compromisos privados"), text: T("Hidden commitments open with Touch ID on Macs that have it.", "Los compromisos ocultos se abren con Touch ID en los Mac que lo tienen.") },
      { icon: "people", title: T("Meetings and Resources", "Reuniones y Recursos"), text: T("Find a meeting or a helpline from your desk.", "Busca una reunión o una línea de ayuda desde tu escritorio.") },
      { icon: "shield", title: T("Private", "Privada"), text: T("No account, analytics, ads or tracking, on the Mac as everywhere else.", "Sin cuenta, analíticas, anuncios ni rastreo, en el Mac como en todas partes.") }
    ])}
  </div>
</section>

<section class="section" id="pricing">
  <div class="shell">
    <div class="section-head"><h2 class="title">${T("One purchase, every device.", "Una compra, todos tus dispositivos.")}</h2></div>
    ${pricing(ctx, "mac-pricing")}
  </div>
</section>

<section class="section">
  <div class="shell-narrow"><h2 class="title-s">${T("Committed on Mac: questions", "Committed en Mac: preguntas")}</h2>${faq(t(ctx, MAC_FAQ))}</div>
</section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const watchPage = {
  id: "watch",
  campaign: "watch",
  updated: "2026-11-25",
  en: {
    path: "apple-watch-sobriety-counter/",
    title: "Apple Watch Sobriety Counter | Committed",
    description: "See your sober days on Apple Watch with Committed. Lifetime Unlock includes the Watch app and complications. Requires watchOS 11.0 or later; no subscription.",
    ogDescription: "Keep your count and milestones on your Apple Watch with Committed.",
    crumb: "Apple Watch"
  },
  es: {
    path: "es/contador-sobriedad-apple-watch/",
    title: "Contador de sobriedad para Apple Watch | Committed",
    description: "Mira tus días de sobriedad en el Apple Watch con Committed. El Desbloqueo de por vida incluye la app y las complicaciones. Requiere watchOS 11.0 o posterior; sin suscripción.",
    crumb: "Apple Watch"
  },
  jsonLd: (ctx) => [appLd(ctx, { operatingSystem: `watchOS ${req(ctx).watchos} or later (with iPhone)` })],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `
<section class="hero stage">
  <div class="dotfield" aria-hidden="true"></div>
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${T("<b>Committed</b> for Apple Watch", "<b>Committed</b> para Apple Watch")}</p>
      <h1 class="display">${T("Your count, on your wrist.", "Tu cuenta, en tu muñeca.")}</h1>
      <p class="lede">${T("Put your sober days on your watch face, or raise your wrist and open Committed to see every commitment and the next milestone.", "Pon tus días de sobriedad en la esfera, o levanta la muñeca y abre Committed para ver cada compromiso y el próximo hito.")}</p>
      <div class="button-row">${storeButton(ctx, "watch")}<a class="button button-secondary" href="${ctx.link("calculator")}">${T("Use the free calculator", "Usa la calculadora gratis")}</a></div>
      <p class="fineprint">${T(`Apple Watch support is part of Lifetime Unlock, a one-time purchase in the app. Requires watchOS ${req(ctx).watchos} or later and an iPhone with iOS ${req(ctx).ios} or later.`, `El Apple Watch forma parte del Desbloqueo de por vida, una compra única dentro de la app. Requiere watchOS ${req(ctx).watchos} o posterior y un iPhone con iOS ${req(ctx).ios} o posterior.`)}</p>
    </div>
    <figure>${watchPhoto(ctx, { eager: true })}</figure>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div style="display:flex;gap:28px;align-items:center;justify-content:center;flex-wrap:wrap">${watch(ctx)}<div class="stage" style="display:grid;gap:14px;padding:22px;border-radius:var(--radius-m)">${widget.circular(ctx)}${widget.rectangular(ctx, SAMPLES.alcohol90)}</div></div>
    <div>
      <p class="eyebrow">${T("<b>Complications</b>", "<b>Complicaciones</b>")}</p>
      <h2 class="title">${T("The face you already wear, with your count on it.", "La esfera que ya usas, con tu cuenta.")}</h2>
      <p class="lede">${T("Circular, rectangular, inline and corner complications fit the faces you already use. Pick which commitment each one follows.", "Complicaciones circulares, rectangulares, en línea y de esquina que encajan en las esferas que ya usas. Elige qué compromiso sigue cada una.")}</p>
      <p class="muted">${T("Edit a watch face, choose a complication slot, and pick Committed. The slots available depend on the face.", "Edita una esfera, elige un espacio para complicación y selecciona Committed. Los espacios disponibles dependen de la esfera.")} <a href="https://support.apple.com/guide/watch/customize-the-watch-face-apda6559ad78/watchos">${T("Apple’s guide to editing watch faces", "Guía de Apple para editar esferas")}</a></p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head"><p class="eyebrow">${T("<b>The Watch app</b>", "<b>La app del reloj</b>")}</p><h2 class="title">${T("The same commitment, easier to check.", "El mismo compromiso, más fácil de consultar.")}</h2></div>
    ${featureList([
      { icon: "watch", title: T("Every commitment", "Cada compromiso"), text: T("Open the app to see each commitment, its time and its milestones.", "Abre la app para ver cada compromiso, su tiempo y sus hitos.") },
      { icon: "flag", title: T("The next milestone", "El próximo hito"), text: T("Know how many days are left before the next one.", "Sabe cuántos días faltan para el siguiente.") },
      { icon: "cloud", title: T("Kept up to date by your iPhone", "Al día gracias a tu iPhone"), text: T("Your watch gets its information from Committed on your iPhone.", "Tu reloj recibe la información de Committed en tu iPhone.") }
    ])}
    <p class="fineprint" style="margin-top:28px">${T(`Price: the iPhone app is free to use with no time limit. Apple Watch support is included with Lifetime Unlock ($${ctx.config.app.price} in the US, one time).`, `Precio: la app para iPhone es gratis y sin límite de tiempo. El Apple Watch está incluido en el Desbloqueo de por vida (14,99 USD en EE. UU., pago único).`)} <a href="${ctx.link("iphone", "#pricing")}">${T("See everything included", "Ver todo lo incluido")}</a></p>
  </div>
</section>`;
  }
};

// ---------------------------------------------------------------------------------------------------
const WIDGET_FAQ = L(
  [
    { q: "Are Committed widgets free?", a: "Widgets are part of Lifetime Unlock, a one-time purchase in the app ($14.99 in the US). Before you unlock, a widget you add shows how to unlock it instead of your count." },
    { q: "Can a widget show a different commitment?", a: "Yes. Touch and hold a widget, choose Edit Widget, and pick the commitment it shows. Two Commitments and Four Commitments let you pick which ones, or show your top ones." },
    { q: "Do widgets work on the Lock Screen?", a: "Yes. Rectangular, circular and inline widgets sit on the iPhone Lock Screen, and the same shapes work as Apple Watch complications." },
    { q: "Do widgets show my count without opening the app?", a: "Yes. Widgets update on their own through the day, and the count turns over at midnight." }
  ],
  [
    { q: "¿Los widgets de Committed son gratis?", a: "Los widgets forman parte del Desbloqueo de por vida, una compra única dentro de la app (14,99 USD en EE. UU.). Antes de desbloquear, un widget que añadas muestra cómo desbloquearlo en lugar de tu cuenta." },
    { q: "¿Un widget puede mostrar otro compromiso?", a: "Sí. Mantén presionado el widget, elige Editar widget y escoge el compromiso que muestra. Dos compromisos y Cuatro compromisos te dejan elegir cuáles o mostrar los principales." },
    { q: "¿Funcionan en la pantalla bloqueada?", a: "Sí. Los widgets rectangulares, circulares y en línea van en la pantalla bloqueada del iPhone, y las mismas formas funcionan como complicaciones del Apple Watch." },
    { q: "¿Los widgets muestran mi cuenta sin abrir la app?", a: "Sí. Los widgets se actualizan solos a lo largo del día, y la cuenta cambia a medianoche." }
  ]
);

const widgetsPage = {
  id: "widgets",
  campaign: "widgets",
  updated: "2026-11-25",
  en: {
    path: "sobriety-widgets/",
    title: "Sobriety Counter Widgets for iPhone and Mac | Committed",
    description: "Sobriety counter widgets for the iPhone Home Screen and Lock Screen, the Mac desktop and Apple Watch: a constellation, a big number, your start date, or two commitments at once.",
    crumb: "Widgets"
  },
  es: {
    path: "es/widgets-sobriedad/",
    title: "Widgets de sobriedad para iPhone y Mac | Committed",
    description: "Widgets de contador de sobriedad para la pantalla de inicio y la pantalla bloqueada del iPhone, el escritorio del Mac y el Apple Watch: una constelación, un número grande, tu fecha de inicio o dos compromisos a la vez.",
    crumb: "Widgets"
  },
  jsonLd: (ctx) => [appLd(ctx), faqLd(t(ctx, WIDGET_FAQ))],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    const item = (html, name, size, text) => `<figure class="widget-item"><div class="widget-frame">${html}</div><figcaption><b>${name}</b> <span class="faint">${size}</span><br>${text}</figcaption></figure>`;
    return `
<section class="hero stage">
  <div class="dotfield" aria-hidden="true"></div>
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${T("<b>Progress</b> at a glance", "<b>Tu progreso</b> de un vistazo")}</p>
      <h1 class="display">${T("Sobriety widgets for every screen.", "Widgets de sobriedad para cada pantalla.")}</h1>
      <p class="lede">${T("Committed puts your count on the iPhone Home Screen and Lock Screen, the Mac desktop and your watch face, in six styles that match the app.", "Committed pone tu cuenta en la pantalla de inicio y la pantalla bloqueada del iPhone, el escritorio del Mac y la esfera del reloj, en seis estilos a juego con la app.")}</p>
      <div class="button-row">${storeButton(ctx, "widgets")}</div>
      <ul class="hero-meta"><li>${T("Home Screen", "Pantalla de inicio")}</li><li>${T("Lock Screen", "Pantalla bloqueada")}</li><li>${T("Mac desktop", "Escritorio del Mac")}</li><li>Apple Watch</li></ul>
    </div>
    ${heroComposition(ctx)}
  </div>
</section>

<section class="section stage">
  <div class="shell">
    <div class="section-head"><h2 class="title">${T("Six Home Screen and desktop styles", "Seis estilos para la pantalla de inicio y el escritorio")}</h2><p class="lede">${T("Shown with sample commitments.", "Con compromisos de ejemplo.")}</p></div>
    <div class="widget-gallery">
      ${item(widget.constellation(ctx), T("Constellation", "Constelación"), T("small, medium, large", "pequeño, mediano, grande"), T("A night sky where every milestone is a star you light up.", "Un cielo nocturno donde cada hito es una estrella que enciendes."))}
      ${item(widget.numeral(ctx), T("Numeral", "Numérico"), T("small, medium", "pequeño, mediano"), T("The number, the unit, and progress toward the next milestone.", "El número, la unidad y el progreso hacia el próximo hito."))}
      ${item(widget.minimal(ctx), T("Minimal", "Mínimo"), T("small", "pequeño"), T("Just the number, nothing else.", "Solo el número, nada más."))}
      ${item(widget.chronicle(ctx), T("Chronicle", "Crónica"), T("small", "pequeño"), T("The name, your start date and your current count.", "El nombre, tu fecha de inicio y tu cuenta actual."))}
      ${item(widget.two(ctx), T("Two Commitments", "Dos compromisos"), T("medium", "mediano"), T("Two at once: pick which, or show your top two.", "Dos a la vez: elige cuáles o muestra los dos principales."))}
      ${item(widget.constellation(ctx, SAMPLES.nicotine, "medium"), T("Four Commitments", "Cuatro compromisos"), T("large", "grande"), T("Four at once on a large widget. (Pictured: a medium Constellation.)", "Cuatro a la vez en un widget grande. (En la imagen: una Constelación mediana.)"))}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div class="stage lock-stage" style="border-radius:var(--radius-l);padding:40px 28px;display:grid;gap:16px;justify-items:center">
      <div class="lock-time" aria-hidden="true">9:41</div>
      <div style="display:flex;gap:14px;align-items:center">${widget.circular(ctx)}${widget.rectangular(ctx, SAMPLES.alcohol90)}</div>
    </div>
    <div>
      <p class="eyebrow">${T("<b>Lock Screen</b> and Apple Watch", "<b>Pantalla bloqueada</b> y Apple Watch")}</p>
      <h2 class="title">${T("Under the clock, and on your wrist.", "Bajo el reloj y en tu muñeca.")}</h2>
      <p class="lede">${T("A ring that fills toward your next milestone, a line of text, or a card with your count. The same shapes work as Apple Watch complications, with a corner one for the watch.", "Un anillo que se llena hacia tu próximo hito, una línea de texto o una tarjeta con tu cuenta. Las mismas formas funcionan como complicaciones del Apple Watch, con una de esquina para el reloj.")}</p>
      <p><a href="${ctx.link("watch")}">${T("Committed on Apple Watch", "Committed en Apple Watch")}</a></p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split reverse">
    ${phone(ctx, "widgets")}
    <div>
      <p class="eyebrow">${T("<b>How to add one</b>", "<b>Cómo añadir uno</b>")}</p>
      <h2 class="title-s">${T("On iPhone", "En el iPhone")}</h2>
      <ol class="steps muted"><li>${T("Touch and hold an empty part of the Home Screen until the apps jiggle.", "Mantén presionada una zona vacía de la pantalla de inicio hasta que las apps se muevan.")}</li><li>${T("Tap Edit, then Add Widget, and search for Committed.", "Toca Editar, luego Añadir widget, y busca Committed.")}</li><li>${T("Pick a style and size, then tap Add Widget.", "Elige un estilo y un tamaño, y toca Añadir widget.")}</li></ol>
      <h2 class="title-s" style="margin-top:28px">${T("On Mac", "En el Mac")}</h2>
      <ol class="steps muted"><li>${T("Control-click the desktop and choose Edit Widgets.", "Haz clic con la tecla Control en el escritorio y elige Editar widgets.")}</li><li>${T("Find Committed and drag a widget onto the desktop.", "Busca Committed y arrastra un widget al escritorio.")}</li></ol>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell-narrow"><h2 class="title-s">${T("Widget questions", "Preguntas sobre los widgets")}</h2>${faq(t(ctx, WIDGET_FAQ))}</div>
</section>

<section class="cta-band stage"><div class="shell"><h2 class="title">${T("Put your count where you’ll see it.", "Pon tu cuenta donde la vas a ver.")}</h2><div class="button-row">${storeButton(ctx, "widgets-footer")}</div></div></section>`;
  }
};

export default [iphone, mac, watchPage, widgetsPage];
