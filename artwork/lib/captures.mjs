// Genuine Mac captures: the frames the Mac app's Screenshot Studio (Debug menu) renders, 2880 × 1800.
// Imported once with scripts/import-mac-captures.mjs into artwork/captures/mac/{en,es}/NN-name.png.
//
// Frames 01, 02, 05 and 06 draw the app window at the same place under their headline, so the bare
// window can be cut out of them for uses where a composed headline would clash (the website's Mac page
// already has its own headline; editors often want the window alone). Frame 03 overlaps the window with
// an iPhone and frame 04 is the desktop, so they are only ever used whole.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './page.mjs';

export const MAC_FRAME = { width: 2880, height: 1800 };
/** The window's rectangle in the Studio frame layout, measured from the 3.1 captures. */
export const MAC_WINDOW = { x: 260, y: 244, width: 2360, height: 1520, radius: 28 };
export const WINDOW_FRAMES = ['01-matrix', '02-sky', '05-themes', '06-private'];

export const macCaptureDir = (locale) => join(ROOT, 'artwork/captures/mac', locale);
export function macCaptures(locale) {
  const dir = macCaptureDir(locale);
  return existsSync(dir) ? readdirSync(dir).filter((f) => /^\d\d-[a-z-]+\.png$/.test(f)).sort() : [];
}

const pixel = (file, x, y) =>
  execFileSync('convert', [file, '-format', `%[fx:int(255*(r+g+b)/3)]`, '-crop', `1x1+${x}+${y}`, 'info:'], { encoding: 'utf8' }).trim() * 1;

/**
 * Fails loudly if the window is not where MAC_WINDOW says (a Studio layout change), rather than
 * cutting a wrong rectangle: the window's hairline border is brighter than the backdrop just outside it.
 */
export function assertWindowAt(file) {
  const { x, y, width, height } = MAC_WINDOW;
  const midY = y + Math.round(height / 2);
  const midX = x + Math.round(width / 2);
  const checks = [
    [pixel(file, x + 1, midY), pixel(file, x - 6, midY)],
    [pixel(file, x + width - 2, midY), pixel(file, x + width + 5, midY)],
    [pixel(file, midX, y + 1), pixel(file, midX, y - 6)],
  ];
  for (const [inside, outside] of checks) {
    if (inside < outside + 12) throw new Error(`${file}: the app window is not at ${JSON.stringify(MAC_WINDOW)}; measure it again`);
  }
}

/**
 * ImageMagick arguments that cut the window out of a Studio frame. With `transparent`, the corners
 * outside the window's rounded rectangle become transparent; otherwise they keep the frame's backdrop.
 */
export function windowCropArgs(file, { transparent = false } = {}) {
  assertWindowAt(file);
  const { x, y, width: w, height: h, radius: r } = MAC_WINDOW;
  const crop = [file, '-crop', `${w}x${h}+${x}+${y}`, '+repage'];
  if (!transparent) return crop;
  return [
    ...crop, '-alpha', 'set',
    '(', '-size', `${w}x${h}`, 'xc:none', '-fill', 'white', '-draw', `roundrectangle 0,0 ${w - 1},${h - 1} ${r},${r}`, ')',
    '-compose', 'DstIn', '-composite',
  ];
}
