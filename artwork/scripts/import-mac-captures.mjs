// Imports the Mac Screenshot Studio frames into artwork/captures/mac/{en,es}/, flattened (App Store
// screenshots may not carry an alpha channel) and stripped of metadata:
//
//   node artwork/scripts/import-mac-captures.mjs <folder with Mac_<N>_<Name>_<en|es>.png files>
//
// Mac_1_Matrix_en.png becomes artwork/captures/mac/en/01-matrix.png. Files may carry a prefix
// (e.g. an upload id followed by a dash); anything not matching the pattern is ignored.
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { MAC_FRAME, macCaptureDir } from '../lib/captures.mjs';

const from = process.argv[2];
if (!from) {
  console.error('usage: node artwork/scripts/import-mac-captures.mjs <folder>');
  process.exit(1);
}
let count = 0;
for (const f of readdirSync(from).sort()) {
  const m = f.match(/Mac_(\d+)_([A-Za-z]+)_(en|es)\.png$/);
  if (!m) continue;
  const [, n, name, locale] = m;
  const src = join(from, f);
  const size = execFileSync('identify', ['-format', '%wx%h', src], { encoding: 'utf8' }).trim();
  if (size !== `${MAC_FRAME.width}x${MAC_FRAME.height}`) throw new Error(`${f}: ${size}, expected ${MAC_FRAME.width}x${MAC_FRAME.height}`);
  mkdirSync(macCaptureDir(locale), { recursive: true });
  const dest = join(macCaptureDir(locale), `${n.padStart(2, '0')}-${name.toLowerCase()}.png`);
  execFileSync('convert', [src, '-background', '#000', '-alpha', 'remove', '-alpha', 'off', '-strip', `PNG24:${dest}`]);
  console.log(`${f} → ${dest}`);
  count++;
}
if (!count) console.error('no Mac_<N>_<Name>_<en|es>.png files found');
