// Runs the date tests in several time zones, including ones with unusual offsets and DST rules.
import { spawnSync } from "node:child_process";
const zones = ["UTC", "America/Los_Angeles", "America/New_York", "America/St_Johns", "Europe/London", "Europe/Madrid", "America/Mexico_City", "America/Santiago", "Australia/Lord_Howe", "Pacific/Auckland", "Pacific/Kiritimati", "Pacific/Pago_Pago", "Asia/Kathmandu"];
let failed = false;
for (const zone of zones) {
  const run = spawnSync(process.execPath, ["--test", "tests/dates.test.cjs"], { env: { ...process.env, TZ: zone }, encoding: "utf8" });
  const ok = run.status === 0;
  console.log(`${ok ? "ok  " : "FAIL"} ${zone}`);
  if (!ok) { failed = true; console.log(run.stdout.split("\n").filter((l) => /not ok|expected|actual|Error/.test(l)).join("\n")); }
}
process.exit(failed ? 1 : 0);
