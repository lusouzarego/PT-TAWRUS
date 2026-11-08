// Baixa as fotos de demonstração do mapa em lib/demos.ts: npm run baixar-demos
import fs from "node:fs";
import path from "node:path";
import { DEMOS } from "../lib/demos";

const BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const OUT = path.join(__dirname, "..", "public/img/exercicios");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let baixadas = 0;
  for (const [id, demo] of Object.entries(DEMOS)) {
    for (const i of [0, 1]) {
      const file = path.join(OUT, `${id}-${i}.jpg`);
      if (fs.existsSync(file)) continue;
      const res = await fetch(`${BASE}/${demo}/${i}.jpg`);
      if (!res.ok) throw new Error(`${demo}/${i}.jpg: HTTP ${res.status}`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      baixadas++;
    }
  }
  console.log(`${baixadas} fotos novas, ${Object.keys(DEMOS).length} exercícios com demonstração.`);
})();
