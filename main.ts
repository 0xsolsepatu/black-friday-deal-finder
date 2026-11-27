// Bargain Beacon — the hand-in program (Node 22, standard library only).
// It copies app/ and screenshots/ from beside this file to /output (or
// $MAKEFUN_OUTPUT_DIR outside the grader) and writes /output/dossier.json
// with buildDossier from the vendored make.fun library. The library file
// is the kit's copy, unchanged: the scorer rebuilds the dossier itself
// and compares the two byte for byte.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots of 256 KiB, app/
// at most 993 files/directories and 16 MiB, dossier text at most 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
