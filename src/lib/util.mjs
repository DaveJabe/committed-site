export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Picks the current language's string. Strings may contain trusted inline HTML written in this repo. */
export function t(ctx, strings) {
  return strings[ctx.lang] ?? strings.en;
}

/** Builds an object with both languages from parallel arguments, for brevity in page files. */
export const L = (en, es) => ({ en, es });
