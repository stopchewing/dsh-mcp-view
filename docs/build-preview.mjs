/**
 * docs/build-preview.mjs
 *
 * Builds docs/preview.html from docs/preview.template.html + docs/preview-data.json.
 * The generated file is used only to render the README screenshots with headless
 * Chrome (see README «Development»); it is gitignored.
 *
 * Pure Node UTF-8 I/O — no shell encoding pitfalls.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(here, "preview.template.html"), "utf8");
const data = JSON.parse(readFileSync(join(here, "preview-data.json"), "utf8"));

// "now-5m" / "now-2h" / "now-1d" markers → fresh ISO timestamps so the
// relative "used X ago" hints in the screenshots never go stale.
const NOW_UNITS = { m: 60_000, h: 3_600_000, d: 86_400_000 };
function resolveMarker(value) {
  if (typeof value !== "string") return value;
  const match = /^now-(\d+)([mhd])$/.exec(value);
  if (!match) return value;
  return new Date(Date.now() - Number(match[1]) * NOW_UNITS[match[2]]).toISOString();
}
for (const server of data.servers ?? []) {
  server.lastUsedAt = resolveMarker(server.lastUsedAt);
  for (const tool of server.tools ?? []) tool.lastUsedAt = resolveMarker(tool.lastUsedAt);
}

// Escape "<" so tool descriptions can never break out of the inline <script>.
const safe = JSON.stringify(data).replaceAll("<", "\\u003c");

if (!template.includes("__DATA__")) {
  throw new Error("preview.template.html has no __DATA__ placeholder");
}

const html = template.replace("__DATA__", safe);
writeFileSync(join(here, "preview.html"), html, "utf8");
console.log(`docs/preview.html written (${html.length} bytes)`);
