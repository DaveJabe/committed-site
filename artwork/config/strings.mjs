// Every word the artwork prints, in English and Spanish. App words (unit names, "Next star", "Since",
// milestone names, the demo commitments) match the app's own catalogs (CommittedKit Localizable.xcstrings
// and ScreenshotSeeder.swift) so the artwork never says something the app wouldn't. Marketing lines
// follow the creative brief: Every day counts · Look how far you've come · Progress at a glance · With
// you everywhere.
//
// Product claims here are limited to what project memory (product-facts-verified) records as checked
// against the 3.1 source. Widgets, Watch, sync and extra themes need the Lifetime Unlock, so no line
// pairs them with "free".

const en = {
  // Demo commitments (ScreenshotSeeder.swift)
  'demo.alcohol': 'Alcohol',
  'demo.nicotine': 'Nicotine',
  'demo.sugar': 'Sugar',
  'demo.gambling': 'Gambling',
  'demo.firstNewYear': "First sober New Year's",
  'demo.wedding': "Brother's wedding",
  'prefix.soberFrom': 'Sober from',
  'prefix.freeFrom': 'Free from',
  'prefix.noMore': 'No more',

  // App words
  'app.nextStar': (m, d) => `Next star · ${m} in ${d}d`,
  'app.since': (d) => `Since ${d}`,
  'app.milestoneCountdown': (d, m) => `${d}d → ${m}`,
  'app.today': 'today',
  'app.aDay': 'a day',
  'app.milestone': 'milestone',

  // Directions (headline with the emphasized run in **…**)
  'field.eyebrow': 'Every day counts',
  'field.headline': 'Every day sober becomes a **dot**.',
  'sky.eyebrow': "Look how far you've come",
  'sky.headline': 'Watch your days become a **constellation**.',
  'glance.eyebrow': 'Progress at a glance',
  'glance.headline': 'Your streak, **one glance away**.',
  'everywhere.eyebrow': 'With you everywhere',
  'everywhere.headline': 'iPhone, Mac and **Apple Watch**.',
  'newyear.eyebrow': 'A new year, day by day',
  'newyear.headline': 'Make this the year **every day counts**.',
  'press.headline': 'A private, beautiful sobriety tracker for iPhone, Mac and Apple Watch.',

  // Short lines for App Store creative assets (Apple: "a short phrase that enhances your visual")
  'field.short': 'Every day **counts**.',
  'sky.short': "Look how far **you've come**.",
  'glance.short': 'Progress **at a glance**.',
  'everywhere.short': 'With you **everywhere**.',
  'newyear.short': 'A new year, **day by day**.',

  // Short claims (verified: see product-facts-verified in project memory)
  'claim.private': 'Private by design. No ads, no tracking.',
  'claim.price': 'Free download · optional one-time Lifetime Unlock · no subscription',
  'claim.platforms': 'iPhone · Mac · Apple Watch',
  'claim.styles': 'Matrix · Sky · Ledger',
  'claim.widgets': 'Home Screen, desktop and Lock Screen widgets',
  'cta.appStore': 'Download on the App Store',

  // Open Graph cards (one per site page)
  'og.calculator': 'Sobriety calculator',
  'og.calculator.sub': 'How long have you been sober? Count every day, privately.',
  'og.product': 'Every day counts.',
  'og.product.sub': 'A private sobriety tracker for iPhone, Mac and Apple Watch.',
  'og.whats-new': 'What’s new in Committed 3.1',
  'og.whats-new.sub': 'Meetings, helplines, people you trust and shooting stars.',
  'og.about': 'About Committed',
  'og.about.sub': 'An independent, private sobriety tracker, made with care.',
  'og.progress-image': 'Make your progress image',
  'og.progress-image.sub': 'Matrix, Sky or Ledger, ready to share. Your date stays on your device.',
  'og.milestones': 'Sobriety milestone calculator',
  'og.milestones.sub': 'See the date of every milestone: 30 days, 90 days, a year and beyond.',
  'og.countdown': 'Countdown to your start date',
  'og.countdown.sub': 'Count down the days to day one.',
  'og.money-saved': 'Money saved calculator',
  'og.money-saved.sub': 'See what quitting puts back in your pocket.',
  'og.iphone': 'Sobriety tracker for iPhone',
  'og.iphone.sub': 'Matrix, Sky and Ledger. Widgets one glance away.',
  'og.mac': 'Sobriety tracker for Mac',
  'og.mac.sub': 'A native Mac app with desktop widgets.',
  'og.watch': 'Sobriety counter for Apple Watch',
  'og.watch.sub': 'Your streak on your wrist and watch face.',
  'og.widgets': 'Sobriety widgets',
  'og.widgets.sub': 'Progress at a glance on your Home Screen, desktop and wrist.',
  'og.tools': 'Free, private sobriety tools',
  'og.tools.sub': 'Calculators and a progress image maker. Nothing you enter leaves your device.',
  'og.press': 'Press kit',
  'og.press.sub': 'Screenshots, icons, artwork and facts about Committed.',
};

const es = {
  'demo.alcohol': 'Alcohol',
  'demo.nicotine': 'Nicotina',
  'demo.sugar': 'Azúcar',
  'demo.gambling': 'Apuestas',
  'demo.firstNewYear': 'Primer Año Nuevo sobrio',
  'demo.wedding': 'La boda de mi hermano',
  'prefix.soberFrom': 'Sin',
  'prefix.freeFrom': 'Libre de',
  'prefix.noMore': 'No más',

  'app.nextStar': (m, d) => `Próxima estrella · ${m} en ${d}d`,
  'app.since': (d) => `Desde ${d}`,
  'app.milestoneCountdown': (d, m) => `${d}d → ${m}`,
  'app.today': 'hoy',
  'app.aDay': 'un día',
  'app.milestone': 'hito',

  'field.eyebrow': 'Cada día cuenta',
  'field.headline': 'Cada día sobrio se convierte en un **punto**.',
  'sky.eyebrow': 'Mira cuánto has avanzado',
  'sky.headline': 'Observa cómo tus días forman una **constelación**.',
  'glance.eyebrow': 'Tu progreso de un vistazo',
  'glance.headline': 'Tu racha, **a un vistazo**.',
  'everywhere.eyebrow': 'Contigo en todas partes',
  'everywhere.headline': 'iPhone, Mac y **Apple Watch**.',
  'newyear.eyebrow': 'Un año nuevo, día a día',
  'newyear.headline': 'Haz de este el año en que **cada día cuenta**.',
  'press.headline': 'Un contador de sobriedad privado y bonito para iPhone, Mac y Apple Watch.',

  'field.short': 'Cada día **cuenta**.',
  'sky.short': 'Mira cuánto **has avanzado**.',
  'glance.short': 'Tu progreso **de un vistazo**.',
  'everywhere.short': 'Contigo **en todas partes**.',
  'newyear.short': 'Un año nuevo, **día a día**.',

  'claim.private': 'Privado por diseño. Sin anuncios ni rastreo.',
  'claim.price': 'Descarga gratis · desbloqueo de por vida opcional, pago único · sin suscripción',
  'claim.platforms': 'iPhone · Mac · Apple Watch',
  'claim.styles': 'Matriz · Tu cielo · Registro',
  'claim.widgets': 'Widgets en la pantalla de inicio, el escritorio y la pantalla bloqueada',
  'cta.appStore': 'Descárgala en el App Store',

  'og.calculator': 'Calculadora de sobriedad',
  'og.calculator.sub': '¿Cuánto tiempo llevas sobrio? Cuenta cada día, en privado.',
  'og.product': 'Cada día cuenta.',
  'og.product.sub': 'Un contador de sobriedad privado para iPhone, Mac y Apple Watch.',
  'og.whats-new': 'Novedades de Committed 3.1',
  'og.whats-new.sub': 'Reuniones, líneas de ayuda, personas de confianza y estrellas fugaces.',
  'og.about': 'Acerca de Committed',
  'og.about.sub': 'Un contador de sobriedad independiente y privado, hecho con cuidado.',
  'og.progress-image': 'Crea tu imagen de progreso',
  'og.progress-image.sub': 'Matriz, Tu cielo o Registro, lista para compartir. Tu fecha se queda en tu dispositivo.',
  'og.milestones': 'Calculadora de hitos de sobriedad',
  'og.milestones.sub': 'Mira la fecha de cada hito: 30 días, 90 días, un año y más.',
  'og.countdown': 'Cuenta regresiva a tu fecha de inicio',
  'og.countdown.sub': 'Cuenta los días que faltan para el día uno.',
  'og.money-saved': 'Calculadora de dinero ahorrado',
  'og.money-saved.sub': 'Mira cuánto dinero recuperas al dejarlo.',
  'og.iphone': 'Contador de sobriedad para iPhone',
  'og.iphone.sub': 'Matriz, Tu cielo y Registro. Widgets a un vistazo.',
  'og.mac': 'Contador de sobriedad para Mac',
  'og.mac.sub': 'Una app nativa para Mac con widgets de escritorio.',
  'og.watch': 'Contador de sobriedad para Apple Watch',
  'og.watch.sub': 'Tu racha en tu muñeca y en tu carátula.',
  'og.widgets': 'Widgets de sobriedad',
  'og.widgets.sub': 'Tu progreso de un vistazo en la pantalla de inicio, el escritorio y tu muñeca.',
  'og.tools': 'Herramientas de sobriedad gratis y privadas',
  'og.tools.sub': 'Calculadoras y un creador de imágenes de progreso. Nada de lo que escribes sale de tu dispositivo.',
  'og.press': 'Kit de prensa',
  'og.press.sub': 'Capturas, íconos, ilustraciones y datos sobre Committed.',
};

const units = {
  en: {
    days: ['day', 'days'],
    weeks: ['week', 'weeks'],
    months: ['month', 'months'],
    years: ['year', 'years'],
  },
  es: {
    days: ['día', 'días'],
    weeks: ['semana', 'semanas'],
    months: ['mes', 'meses'],
    years: ['año', 'años'],
  },
};

const monthsShort = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
};

export const LOCALES = ['en', 'es'];

export function strings(locale) {
  const table = locale === 'es' ? es : en;
  const t = (key, ...args) => {
    const v = table[key];
    if (v === undefined) throw new Error(`missing ${locale} string: ${key}`);
    return typeof v === 'function' ? v(...args) : v;
  };
  const unitWord = (n, kind) => units[locale][kind][n === 1 ? 0 : 1];
  return {
    locale,
    t,
    unitWord,
    // "1 Year" / "1 año", the app's milestone title form (capitalized in English, as the app shows it).
    unitCount: (n, kind) => {
      const w = unitWord(n, kind);
      return `${n} ${locale === 'en' ? w[0].toUpperCase() + w.slice(1) : w}`;
    },
    number: (n) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US').format(n),
    // The app's `.medium` date style: "Dec 31, 2022" / "31 dic 2022".
    date: (t) => {
      const d = new Date(t);
      const m = monthsShort[locale][d.getUTCMonth()];
      return locale === 'es'
        ? `${d.getUTCDate()} ${m} ${d.getUTCFullYear()}`
        : `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    },
  };
}

/** `**word**` → <em>word</em>, after escaping, for headlines with one emphasized run. */
export function emphasize(text) {
  return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>');
}

export function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
