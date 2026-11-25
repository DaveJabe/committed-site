import { L, t, esc } from "../lib/util.mjs";
import { storeButton, appStoreUrl } from "../lib/layout.mjs";
import { appLd } from "../lib/components.mjs";

// Release notes, from Committed/Features/LaunchNotes/CommittedLaunchNotes.swift and the App Store history.
const RELEASES = [
  {
    version: "3.1",
    date: L("November 2026 · iPhone and Apple Watch (Mac 3.1 coming soon)", "Noviembre de 2026 · iPhone y Apple Watch (la 3.1 para Mac llegará pronto)"),
    title: L("What’s new in 3.1", "Novedades de la versión 3.1"),
    items: L(
      [
        ["Find a meeting", "Meetings opens each group’s own finder, near you or online: AA, NA, SMART Recovery, Al-Anon and more."],
        ["Helplines and reading", "Resources gathers free helplines and a few pages to read, for the country you pick."],
        ["The people you trust", "On iPhone, add up to three people and call or message them from Resources. They stay on your phone."],
        ["Shooting stars", "In Your Sky, the milestones you made fly in one at a time as shooting stars."],
        ["Fixes and polish", "Pin or hide a commitment with a long press, see all of a long note, and many small fixes."]
      ],
      [
        ["Buscar reunión", "Reuniones abre el buscador de cada grupo, cerca de ti o en línea: AA, NA, SMART Recovery, Al-Anon y más."],
        ["Líneas de ayuda y lecturas", "Recursos reúne líneas de ayuda gratuitas y algunas páginas para leer, del país que elijas."],
        ["Tus personas de confianza", "En el iPhone, agrega hasta tres personas y llámalas o escríbeles desde Recursos. Se quedan en tu teléfono."],
        ["Estrellas fugaces", "En Tu cielo, los hitos que creaste llegan uno a uno como estrellas fugaces."],
        ["Correcciones y mejoras", "Fija u oculta un compromiso manteniéndolo presionado, ve una nota larga entera, y muchas pequeñas correcciones."]
      ]
    )
  },
  {
    version: "3.0",
    date: L("November 14, 2026", "14 de noviembre de 2026"),
    title: L("Version 3 is here", "La versión 3 ya está aquí"),
    items: L(
      [
        ["Committed on your Mac", "A native Mac app with desktop widgets, in sync with your iPhone."],
        ["Your data on every device", "Turn on iCloud Sync and whatever you change on one device shows up on the others."],
        ["Better Spanish", "Every screen reviewed so it reads naturally."],
        ["Count down to day one", "Set a start date in the future and Committed counts the days down to it, with a quiet reminder on your lock screen when day one arrives."],
        ["Refinements", "A cleaner calendar for picking dates, plus fixes and polish throughout."]
      ],
      [
        ["Committed en tu Mac", "Una app nativa para Mac con widgets de escritorio, sincronizada con tu iPhone."],
        ["Tus datos en todos tus dispositivos", "Activa Sincronización con iCloud y lo que cambies en un dispositivo aparece en los demás."],
        ["Mejor español", "Revisamos cada pantalla para que suene natural."],
        ["Cuenta atrás hasta el día uno", "Fija una fecha de inicio en el futuro y Committed cuenta los días que faltan, con un aviso discreto en tu pantalla de bloqueo cuando llega el día uno."],
        ["Mejoras", "Un calendario más limpio para elegir fechas, además de correcciones y mejoras en general."]
      ]
    )
  },
  {
    version: "2.1",
    date: L("July 14, 2026", "14 de julio de 2026"),
    title: L("Made for everyone", "Hecho para todos"),
    items: L(
      [
        ["Made for everyone", "Full VoiceOver support, larger text sizes, and higher-contrast options throughout the app."],
        ["Fixes and polish", "Smoother date picking, better Spanish, and a fix for a crash when opening milestone reminders."]
      ],
      [
        ["Hecho para todos", "Compatibilidad completa con VoiceOver, tamaños de texto más grandes y opciones de mayor contraste en toda la app."],
        ["Correcciones y mejoras", "Selección de fecha más fluida, mejor español y una corrección para un fallo al abrir los recordatorios de hitos."]
      ]
    )
  },
  {
    version: "2.0",
    date: L("July 11, 2026", "11 de julio de 2026"),
    title: L("Version 2 is here", "La versión 2 ya está aquí"),
    items: L(
      [
        ["A reimagined home", "Swipe through your commitments and tap any one to open its full-screen view."],
        ["Milestones front and center", "See every milestone you’ve reached, and add custom ones of your own."],
        ["Feedback in a tap", "Share an idea or report a bug right from Settings, no email required."]
      ],
      [
        ["Una pantalla principal renovada", "Desliza entre tus compromisos y toca cualquiera para abrir su vista a pantalla completa."],
        ["Hitos en primer plano", "Mira cada hito que alcanzaste y agrega los tuyos."],
        ["Comentarios con un toque", "Comparte una idea o reporta un error desde Configuración, sin necesidad de correo."]
      ]
    )
  },
  {
    version: "1.0",
    date: L("July 3, 2026", "3 de julio de 2026"),
    title: L("Committed launches", "Llega Committed"),
    items: L([["First release", "Committed arrives on the App Store for iPhone."]], [["Primera versión", "Committed llega al App Store para iPhone."]])
  }
];

const whatsNew = {
  id: "whats-new",
  campaign: "whats-new",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "whats-new/", title: "What’s New in Committed 3.1 | Release Notes", description: "Release notes for Committed: Meetings and Resources in 3.1, the native Mac app and iCloud Sync in 3.0, and every version before.", crumb: "What’s new" },
  es: { path: "es/novedades/", title: "Novedades de Committed 3.1 | Notas de la versión", description: "Notas de la versión de Committed: Reuniones y Recursos en la 3.1, la app nativa para Mac y la sincronización con iCloud en la 3.0, y cada versión anterior.", crumb: "Novedades" },
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `<section class="prose" style="padding-bottom:0"><div class="shell">
  <p class="eyebrow"><b>Committed</b> ${T("release notes", "notas de la versión")}</p>
  <h1>${T("What’s new", "Novedades")}</h1>
  <p class="lede">${T("Every version of Committed, newest first. Updates are free for everyone.", "Cada versión de Committed, de la más reciente a la más antigua. Las actualizaciones son gratis para todos.")}</p>
</div></section>
<section class="section" style="padding-top:40px"><div class="shell">
  ${RELEASES.map((release) => `<article class="release" id="v${release.version.replace(".", "-")}">
    <div class="release-meta"><p class="version">${release.version}</p><p>${esc(t(ctx, release.date))}</p></div>
    <div><h2>${esc(t(ctx, release.title))}</h2><ul>${t(ctx, release.items).map(([title, text]) => `<li><b>${esc(title)}</b><span>${esc(text)}</span></li>`).join("")}</ul></div>
  </article>`).join("\n  ")}
  <div class="button-row">${storeButton(ctx, "whats-new")}</div>
</div></section>`;
  }
};

const about = {
  id: "about",
  campaign: "about",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "about/", title: "About Committed | An Independent Sobriety Tracker", description: "Committed is an independent, privacy-first sobriety and commitment tracker for iPhone, Mac and Apple Watch: no account, no ads, no subscription.", crumb: "About" },
  es: { path: "es/acerca/", title: "Acerca de Committed | Un contador de sobriedad independiente", description: "Committed es un contador de sobriedad y de compromisos independiente y privado para iPhone, Mac y Apple Watch: sin cuenta, sin anuncios, sin suscripción.", crumb: "Acerca de" },
  jsonLd: (ctx) => [{ "@context": "https://schema.org", "@type": "AboutPage", name: ctx.page[ctx.lang].title, url: ctx.abs(ctx.page[ctx.lang].path), about: appLd(ctx) }],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    return `<article class="prose shell-narrow">
  <p class="eyebrow"><b>${T("About", "Acerca de")}</b> Committed</p>
  <h1>${T("A quiet place to keep count.", "Un lugar tranquilo para llevar la cuenta.")}</h1>
  <p class="lede">${T("Committed is a sobriety and personal commitment tracker made by one independent developer. It does one thing carefully: it counts the days you’ve kept, and shows you how far you’ve come.", "Committed es un contador de sobriedad y de compromisos personales hecho por un desarrollador independiente. Hace una sola cosa con cuidado: cuenta los días que has cumplido y te muestra todo lo que has avanzado.")}</p>

  <h2>${T("What we believe", "Lo que creemos")}</h2>
  <p><strong>${T("Every day counts.", "Cada día cuenta.")}</strong> ${T("A day is a calendar day, counted the same way on every device, and a month is a real month. A milestone should arrive on the date you expect.", "Un día es un día del calendario, contado igual en cada dispositivo, y un mes es un mes de verdad. Un hito debe llegar el día que esperas.")}</p>
  <p><strong>${T("Your date is yours.", "Tu fecha es tuya.")}</strong> ${T("There’s no account and nothing to sign in to. Committed doesn’t collect analytics, show ads or track you. If you turn on iCloud Sync, your data travels through your own iCloud, which the developer can’t read.", "No hay cuenta ni nada en qué iniciar sesión. Committed no recopila analíticas, no muestra anuncios ni te rastrea. Si activas la sincronización con iCloud, tus datos viajan por tu propio iCloud, que el desarrollador no puede leer.")}</p>
  <p><strong>${T("Pay once, if at all.", "Paga una vez, si quieres.")}</strong> ${T("Counting one commitment is free, forever. A single Lifetime Unlock adds the extras on every device. There will never be a subscription to keep your own history.", "Contar un compromiso es gratis, para siempre. Un único Desbloqueo de por vida añade lo demás en todos tus dispositivos. Nunca habrá una suscripción para conservar tu propia historia.")}</p>
  <p><strong>${T("Made with care, for everyone.", "Hecha con cuidado, para todos.")}</strong> ${T("Committed is native on iPhone, Mac and Apple Watch, works with VoiceOver and larger text, and speaks English and Spanish.", "Committed es nativa en iPhone, Mac y Apple Watch, funciona con VoiceOver y texto grande, y habla español e inglés.")}</p>

  <h2>${T("What Committed is not", "Lo que Committed no es")}</h2>
  <p>${T("Committed is a tracker, not treatment, and it isn’t affiliated with any fellowship. Its Meetings and Resources screens link to recovery groups’ own meeting finders and to free helplines, so help is close when you want it.", "Committed es un contador, no un tratamiento, y no está afiliada a ningún grupo. Sus pantallas Reuniones y Recursos enlazan a los buscadores de reuniones de cada grupo y a líneas de ayuda gratuitas, para que la ayuda esté cerca cuando la quieras.")}</p>

  <h2>${T("Who makes it", "Quién la hace")}</h2>
  <p>${T(`Committed is designed and built by ${esc(ctx.config.app.developer)}, an independent developer. Questions and ideas are always welcome through Send Feedback in the app or the <a href="${ctx.link("support")}">support page</a>. Writing about Committed? See the <a href="${ctx.link("press")}">press kit</a>.`, `Committed la diseña y construye ${esc(ctx.config.app.developer)}, un desarrollador independiente. Las preguntas e ideas siempre son bienvenidas desde Enviar comentarios en la app o la <a href="${ctx.link("support")}">página de soporte</a>. ¿Escribes sobre Committed? Consulta el <a href="${ctx.link("press")}">kit de prensa</a>.`)}</p>
  <div class="button-row">${storeButton(ctx, "about")}<a class="button button-secondary" href="${ctx.link("whats-new")}">${T("What’s new", "Novedades")}</a></div>
</article>`;
  }
};

// The press kit download is assembled by the artwork pipeline into press/; the page links whatever is there.
const press = {
  id: "press",
  campaign: "press",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "press/", title: "Press Kit | Committed Sobriety Tracker", description: "Press kit for Committed: app icon, images of iPhone, Mac, Apple Watch and widgets, descriptions, pricing, platforms, release notes and contact.", crumb: "Press kit" },
  es: { path: "es/prensa/", title: "Kit de prensa | Committed", description: "Kit de prensa de Committed: icono, imágenes de iPhone, Mac, Apple Watch y widgets, descripciones, precio, plataformas, novedades y contacto.", crumb: "Kit de prensa" },
  scripts: ["js/press.js"],
  render(ctx) {
    const T = (en, es) => t(ctx, { en, es });
    const { app } = ctx.config;
    const short = T(
      "Committed counts your sober days and shows them in three distinctive ways: Matrix, a field of days; Your Sky, a night sky of milestones; and Ledger, a plain record. It lives on your iPhone, Mac and Apple Watch, with widgets for every screen. No account, no ads, no subscription, and no data collected.",
      "Committed cuenta tus días de sobriedad y te los muestra de tres maneras: Matriz, un campo de días; Tu cielo, un cielo nocturno con tus hitos; y Registro, una cuenta sencilla. Está en tu iPhone, tu Mac y tu Apple Watch, con widgets para cada pantalla. Sin cuenta, sin anuncios, sin suscripción y sin recopilar datos."
    );
    const long = T(
      [
        "Committed is a sobriety and personal commitment tracker made by an independent developer, for people who want to see how far they’ve come without handing their history to anyone.",
        "Every commitment gets three views. Matrix lays out each day as a point in a growing field. Your Sky turns milestones into a night sky, and in version 3.1 the milestones you set fly in as shooting stars. Ledger is the plain record of years, months and days. Built-in milestones mark the moments that matter, from the first day onward, and you can add your own.",
        "Committed is native on iPhone, Mac and Apple Watch. Widgets put your count on the Home Screen, the Lock Screen and the Mac desktop, and complications put it on your watch face. Optional iCloud Sync keeps every device up to date through your own iCloud account. A countdown mode counts down to a start date you’ve planned, such as the new year.",
        "Version 3.1 adds a Meetings finder that opens each fellowship’s own meeting search (AA, NA, SMART Recovery, Al-Anon and more), a Resources screen with free helplines for your country, and on iPhone, up to three people you trust, one tap away. They stay on your phone.",
        "Committed doesn’t collect your data. There’s no account, no analytics, no ads and no tracking, and its App Store privacy label reads “Data Not Collected”. It’s free to use for one commitment. A one-time Lifetime Unlock adds more commitments, widgets, the Apple Watch app, iCloud Sync and every theme. Committed is available in English and Spanish."
      ],
      [
        "Committed es un contador de sobriedad y de compromisos personales hecho por un desarrollador independiente, para quien quiere ver todo lo que ha avanzado sin entregar su historia a nadie.",
        "Cada compromiso tiene tres vistas. Matriz muestra cada día como un punto en un campo que crece. Tu cielo convierte tus hitos en un cielo nocturno, y en la versión 3.1 los hitos que creaste llegan como estrellas fugaces. Registro es la cuenta sencilla de años, meses y días. Los hitos incluidos marcan los momentos importantes desde el primer día, y puedes añadir los tuyos.",
        "Committed es nativo en iPhone, Mac y Apple Watch. Los widgets llevan tu cuenta a la pantalla de inicio, a la pantalla bloqueada y al escritorio del Mac, y las complicaciones la ponen en tu esfera. La sincronización opcional con iCloud mantiene al día todos tus dispositivos a través de tu propia cuenta de iCloud. El modo cuenta atrás cuenta los días que faltan para una fecha de inicio que hayas planeado, como el año nuevo.",
        "La versión 3.1 añade Reuniones, que abre el buscador de reuniones de cada grupo (AA, NA, SMART Recovery, Al-Anon y más), una pantalla de Recursos con líneas de ayuda gratuitas para tu país y, en el iPhone, hasta tres personas de confianza a un toque. Se quedan en tu teléfono.",
        "Committed no recopila tus datos. No hay cuenta, ni analíticas, ni anuncios, ni rastreo, y su etiqueta de privacidad en el App Store dice «Datos no recopilados». Es gratis para un compromiso. El Desbloqueo de por vida, un pago único, añade más compromisos, widgets, la app de Apple Watch, la sincronización con iCloud y todos los temas. Committed está disponible en español e inglés."
      ]
    );
    const facts = T(
      [
        ["App name", app.storeName],
        ["Developer", `${app.developer} (independent)`],
        ["Current version", "3.1 on iPhone and Apple Watch (November 2026). Mac: 3.0, with 3.1 in review."],
        ["Platforms", `iPhone (iOS ${app.requirements.ios} or later), Mac (macOS ${app.requirements.macos} or later), Apple Watch (watchOS ${app.requirements.watchos} or later). One universal download.`],
        ["Languages", "English, Spanish"],
        ["Price", `Free to download and use. Lifetime Unlock: $${app.price} US, one-time in-app purchase, covering iPhone, Mac and Apple Watch. No subscription.`],
        ["Free", "One commitment, all three views, built-in milestones plus one custom milestone, countdown to a future start, Meetings and Resources, the Mint theme"],
        ["Lifetime Unlock", "More commitments and custom milestones, every widget, the Apple Watch app and complications, iCloud Sync, all eight themes, hidden commitments behind Face ID or Touch ID"],
        ["Privacy", "No account, analytics, advertising or tracking. App Store privacy label: Data Not Collected. The only data the developer receives is feedback a person chooses to send."],
        ["Accessibility", "VoiceOver, larger text sizes, higher-contrast options and reduced-motion versions of each view"],
        ["Category", "Lifestyle"]
      ],
      [
        ["Nombre", app.storeName],
        ["Desarrollador", `${app.developer} (independiente)`],
        ["Versión actual", "3.1 en iPhone y Apple Watch (noviembre de 2026). Mac: 3.0, con la 3.1 en revisión."],
        ["Plataformas", `iPhone (iOS ${app.requirements.ios} o posterior), Mac (macOS ${app.requirements.macos} o posterior), Apple Watch (watchOS ${app.requirements.watchos} o posterior). Una sola descarga universal.`],
        ["Idiomas", "Español, inglés"],
        ["Precio", "Descarga y uso gratis. Desbloqueo de por vida: 14,99 USD en EE. UU. (varía por país), compra única dentro de la app para iPhone, Mac y Apple Watch. Sin suscripción."],
        ["Gratis", "Un compromiso, las tres vistas, los hitos incluidos y un hito propio, cuenta atrás hasta una fecha futura, Reuniones y Recursos, el tema Mint"],
        ["Desbloqueo de por vida", "Más compromisos e hitos propios, todos los widgets, la app y las complicaciones de Apple Watch, sincronización con iCloud, los ocho temas, compromisos ocultos con Face ID o Touch ID"],
        ["Privacidad", "Sin cuenta, analíticas, publicidad ni rastreo. Etiqueta del App Store: Datos no recopilados. Lo único que recibe el desarrollador son los comentarios que alguien decida enviar."],
        ["Accesibilidad", "VoiceOver, tamaños de texto más grandes, opciones de mayor contraste y versiones con menos movimiento de cada vista"],
        ["Categoría", "Estilo de vida"]
      ]
    );
    const images = [
      { file: "icons/icon-512.png", full: "icon-1024.png", label: T("App icon, 1024 × 1024 PNG", "Icono, PNG de 1024 × 1024") },
      { file: `assets/committed-matrix${ctx.lang === "es" ? "-es" : ""}.webp`, label: T("iPhone, Matrix", "iPhone, Matriz") },
      { file: `assets/committed-sky${ctx.lang === "es" ? "-es" : ""}.webp`, label: T("iPhone, Your Sky", "iPhone, Tu cielo") },
      { file: `assets/committed-widgets${ctx.lang === "es" ? "-es" : ""}.webp`, label: T("iPhone Home Screen widgets", "Widgets en la pantalla de inicio del iPhone") },
      { file: "assets/committed-watch-960.webp", full: "assets/committed-watch-1440.webp", label: T("Apple Watch complication", "Complicación de Apple Watch") }
    ];
    const kit = [ctx.lang === "es" ? "press/committed-press-kit-es.zip" : null, "press/committed-press-kit.zip"].filter(Boolean).find((path) => ctx.hasAsset(path));
    return `<section class="prose" style="padding-bottom:24px"><div class="shell">
  <p class="eyebrow"><b>${T("Press", "Prensa")}</b></p>
  <h1>${T("Committed press kit", "Kit de prensa de Committed")}</h1>
  <p class="lede">${T("Everything you need to write about Committed: descriptions, facts, images and release notes. Images may be used in coverage of Committed.", "Todo lo que necesitas para escribir sobre Committed: descripciones, datos, imágenes y novedades. Las imágenes pueden usarse en notas sobre Committed.")}</p>
  <div class="button-row">
    ${kit ? `<a class="button button-primary" href="${ctx.asset(kit)}" download>${T("Download the press kit (ZIP)", "Descargar el kit de prensa (ZIP)")}</a>` : ""}
    <a class="button button-secondary" href="${esc(appStoreUrl(ctx, "press"))}">${T("View on the App Store", "Ver en el App Store")}</a>
    <a class="button button-secondary" href="mailto:${app.supportEmail}">${T("Contact the developer", "Contactar al desarrollador")}</a>
  </div>
</div></section>

<section class="section" style="padding-top:48px"><div class="shell split" style="align-items:start">
  <div>
    <h2 class="title-s">${T("Short description", "Descripción corta")}</h2>
    <div class="copy-block"><p data-copy-source>${esc(short)}</p><button class="button button-secondary button-small copy-button" type="button" data-copy hidden>${T("Copy", "Copiar")}</button></div>
    <h2 class="title-s" style="margin-top:40px">${T("Long description", "Descripción larga")}</h2>
    <div class="copy-block"><div data-copy-source>${long.map((p) => `<p>${esc(p)}</p>`).join("")}</div><button class="button button-secondary button-small copy-button" type="button" data-copy hidden>${T("Copy", "Copiar")}</button></div>
  </div>
  <div>
    <h2 class="title-s">${T("Key facts", "Datos clave")}</h2>
    <table class="fact-table"><tbody>${facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
      <tr><th scope="row">App Store</th><td><a href="https://apps.apple.com/app/id${app.appStoreId}">apps.apple.com/app/id${app.appStoreId}</a></td></tr>
      <tr><th scope="row">${T("Contact", "Contacto")}</th><td><a href="mailto:${app.supportEmail}">${app.supportEmail}</a></td></tr>
    </tbody></table>
  </div>
</div></section>

<section class="section"><div class="shell">
  <div class="section-head"><h2 class="title-s">${T("Images", "Imágenes")}</h2><p class="muted">${T("Genuine screenshots with sample commitments. The press kit download adds higher-resolution files and promotional renditions drawn from the app’s own designs with sample data.", "Capturas reales con compromisos de ejemplo. La descarga del kit añade archivos en mayor resolución e imágenes promocionales creadas a partir de los diseños de la app con datos de ejemplo.")}</p></div>
  <div class="download-grid">
    ${images.map((image) => `<figure><div class="thumb stage"><img src="${ctx.asset(image.file)}" alt="${esc(image.label)}" loading="lazy" decoding="async"></div><figcaption><span>${esc(image.label)}</span><a href="${ctx.asset(image.full || image.file)}" download>${T("Download", "Descargar")}</a></figcaption></figure>`).join("")}
  </div>
</div></section>

<section class="section"><div class="shell-narrow prose" style="padding:0">
  <h2>${T("Recent releases", "Versiones recientes")}</h2>
  <p>${T("3.1 adds Meetings, Resources with free helplines, up to three trusted people on iPhone, and shooting stars in Your Sky. 3.0 brought the native Mac app with desktop widgets, iCloud Sync, a countdown to a future start date, and a full Spanish review.", "La 3.1 añade Reuniones, Recursos con líneas de ayuda gratuitas, hasta tres personas de confianza en el iPhone y estrellas fugaces en Tu cielo. La 3.0 trajo la app nativa para Mac con widgets de escritorio, la sincronización con iCloud, la cuenta atrás hasta una fecha futura y una revisión completa del español.")} <a href="${ctx.link("whats-new")}">${T("All release notes", "Todas las notas de la versión")}</a></p>
  <h2>${T("A note for writers", "Una nota para periodistas")}</h2>
  <p>${T("Committed is a tracker, not treatment. It doesn’t claim to keep anyone sober, and it isn’t affiliated with AA, NA, SMART Recovery or any other fellowship; the Meetings screen links to their own public finders.", "Committed es un contador, no un tratamiento. No afirma mantener sobrio a nadie y no está afiliada a AA, NA, SMART Recovery ni a ningún otro grupo; la pantalla Reuniones enlaza a sus propios buscadores públicos.")}</p>
</div></section>`;
  }
};

export default [whatsNew, about, press];
