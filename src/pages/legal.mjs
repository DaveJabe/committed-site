import { readFileSync } from "node:fs";
import { L, t } from "../lib/util.mjs";

const content = (name) => readFileSync(new URL(`../content/${name}.html`, import.meta.url), "utf8");

const support = {
  id: "support",
  updated: "2026-11-25",
  lightMode: true,
  en: { path: "support.html", title: "Support | Committed", description: "Help with Committed: restoring your purchase, iCloud Sync, hidden commitments, widgets, Apple Watch and the Mac app.", crumb: "Support" },
  es: { path: "es/soporte.html", title: "Soporte | Committed", description: "Ayuda con Committed: restaurar tu compra, sincronización con iCloud, compromisos ocultos, widgets, Apple Watch y la app para Mac.", crumb: "Soporte" },
  render(ctx) {
    const email = ctx.config.app.supportEmail;
    const T = (en, es) => t(ctx, { en, es });
    const qa = t(ctx, L(
      [
        ["How do I restore my purchase?", "Open Committed, open the Lifetime Unlock screen, and tap <strong>Restore purchase</strong>. Make sure you’re signed in with the Apple Account you used to buy it. The same purchase unlocks Committed on your iPhone, Mac and Apple Watch."],
        ["How does iCloud Sync work?", "Turn on <strong>iCloud Sync</strong> in Settings and whatever you change on one device shows up on your others, through your own private iCloud account. The developer can’t see what’s in your iCloud. iCloud Sync is part of Lifetime Unlock."],
        ["I had an iCloud backup in an older version. Where did it go?", "Versions before iCloud Sync could keep one backup copy in your iCloud. If you have one, the app can restore it, and <strong>Delete Old Backup</strong> removes it."],
        ["How do I add a widget?", "On iPhone, touch and hold the Home Screen or Lock Screen, tap Edit, then add a Committed widget. On Mac, Control-click the desktop and choose Edit Widgets. Widgets are part of Lifetime Unlock."],
        ["How do I put Committed on my Apple Watch?", "Install Committed on your watch from the Watch app on your iPhone, then edit a watch face and choose a Committed complication. The Watch app and complications are part of Lifetime Unlock and need watchOS 11.0 or later."],
        ["How do hidden commitments stay private?", "Hidden commitments are protected by Face ID on iPhone and Touch ID on Mac. The app never receives your biometric data."],
        ["Does Committed collect my data?", `No. Committed has no analytics or tracking and collects no personal data. The only thing we receive is feedback you choose to send. The <a href="${ctx.link("privacy")}">privacy policy</a> has the details.`]
      ],
      [
        ["¿Cómo restauro mi compra?", "Abre Committed, abre la pantalla del Desbloqueo de por vida y toca <strong>Restaurar compra</strong>. Asegúrate de usar la misma cuenta de Apple con la que compraste. La misma compra desbloquea Committed en tu iPhone, tu Mac y tu Apple Watch."],
        ["¿Cómo funciona la sincronización con iCloud?", "Activa <strong>Sincronización con iCloud</strong> en Configuración y lo que cambies en un dispositivo aparece en los demás, a través de tu propia cuenta privada de iCloud. El desarrollador no puede ver lo que hay en tu iCloud. La sincronización con iCloud forma parte del Desbloqueo de por vida."],
        ["Tenía una copia en iCloud de una versión anterior. ¿Dónde está?", "Las versiones anteriores a la sincronización podían guardar una copia en tu iCloud. Si la tienes, la app puede restaurarla, y <strong>Eliminar copia anterior</strong> la borra."],
        ["¿Cómo añado un widget?", "En el iPhone, mantén presionada la pantalla de inicio o la pantalla bloqueada, toca Editar y añade un widget de Committed. En el Mac, haz clic con la tecla Control en el escritorio y elige Editar widgets. Los widgets forman parte del Desbloqueo de por vida."],
        ["¿Cómo pongo Committed en mi Apple Watch?", "Instala Committed en el reloj desde la app Watch del iPhone, edita una esfera y elige una complicación de Committed. La app y las complicaciones de Apple Watch forman parte del Desbloqueo de por vida y requieren watchOS 11.0 o posterior."],
        ["¿Cómo se mantienen privados los compromisos ocultos?", "Los compromisos ocultos se protegen con Face ID en el iPhone y Touch ID en el Mac. La app nunca recibe tus datos biométricos."],
        ["¿Committed recopila mis datos?", `No. Committed no usa analíticas ni rastreo y no recopila datos personales. Lo único que recibimos son los comentarios que tú decidas enviar. La <a href="${ctx.link("privacy")}">política de privacidad</a> tiene los detalles.`]
      ]
    ));
    return `<article class="prose shell-narrow">
  <p class="eyebrow"><b>Committed</b></p>
  <h1>${T("Support", "Soporte")}</h1>
  <p>${T(`Need help? Use <strong>Send Feedback</strong> in the app’s Settings, or email <a href="mailto:${email}">${email}</a>. I usually reply within one or two business days.`, `¿Necesitas ayuda? Usa <strong>Enviar comentarios</strong> en la Configuración de la app o escribe a <a href="mailto:${email}">${email}</a>. Suelo responder en uno o dos días hábiles.`)}</p>
  ${qa.map(([q, a]) => `<h2>${q}</h2><p>${a}</p>`).join("\n  ")}
</article>`;
  }
};

const privacy = {
  id: "privacy",
  updated: "2026-11-23",
  lightMode: true,
  en: { path: "privacy.html", title: "Privacy Policy | Committed", description: "Committed keeps your data on your device and, if you choose, in your own private iCloud. It never sells or shares it.", crumb: "Privacy Policy" },
  es: { path: "es/privacidad.html", title: "Política de Privacidad | Committed", description: "Committed guarda tus datos en tu dispositivo y, si lo eliges, en tu propio iCloud privado. Nunca los vende ni los comparte.", crumb: "Política de privacidad" },
  render(ctx) {
    // The policy text is kept verbatim from the published page; only its links go through the base path.
    return `<article class="prose shell-narrow">\n${content(`privacy.${ctx.lang}`).replaceAll("{{base}}", ctx.config.basePath)}\n</article>`;
  }
};

export default [support, privacy];
