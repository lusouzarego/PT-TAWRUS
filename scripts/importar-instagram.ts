// Converte data/instagram-exercicios.json (exportação da pasta "Exercícios" do Instagram)
// em lib/instagram.generated.ts, que entra no catálogo de exercícios.
//
//   npm run importar
//
// Para atualizar: substitua o JSON por uma exportação nova e rode de novo.

import fs from "node:fs";
import path from "node:path";

type Row = {
  post: number;
  exercicio_id: string;
  exercicio_base: string;
  familia: string;
  grupo_muscular: string;
  nome_no_post: string;
  parte_do_corpo: string;
  estilo: string;
  equipamento: string;
  dica: string;
  passo_a_passo: string;
  repetido_em_posts: number;
  autor: string;
  link: string;
};

const ROOT = path.join(__dirname, "..");
const rows: Row[] = JSON.parse(fs.readFileSync(path.join(ROOT, "data/instagram-exercicios.json"), "utf8"));

// Coisas de academia ou que não são um exercício (treino é em casa).
const EXCLUIR = new Set([
  "leg_press", "maquina_perna", "puxada", "spinning", "hiperext", "pes_posicao", "aula_sculpt",
]);

// Nomes mais curtos para caber no card do timer (o resto vira "variações").
const NOMES: Record<string, string> = {
  agach: "Agachamento",
  afundo: "Afundo",
  stiff: "Stiff",
  desenv: "Desenvolvimento de ombros",
  rosca: "Rosca bíceps",
  abdominal: "Abdominal (V-up, roll up, infra)",
  prancha: "Prancha",
  braco_combo: "Combo de braços",
  remada_combo: "Remada combinada",
  remada_alt: "Remada alternada",
  crucifixo: "Crucifixo",
  tri_oh: "Tríceps francês",
  tri_coice: "Tríceps coice",
  tri_pulso: "Pulsos de tríceps",
  tri_lado: "Tríceps deitada de lado",
  tri_testa: "Tríceps testa",
  coice4: "Coice em quatro apoios",
  ext_pe: "Coice em pé",
  ostra: "Ostra (clamshell)",
  leg_opens: "Abertura de pernas deitada",
  platter: "Servir a bandeja",
  cactus: "Cactus (goal post)",
  explosivo: "Thruster / slam",
  swing: "Swing com halter",
  core_pilates: "Core Pilates",
  abertura: "Aberturas de braço Pilates",
  abd_sent: "Abdução sentada com miniband",
  abd_pe: "Abdução em pé",
  rotacao: "Lenhador / halo",
  bulgaro: "Agachamento búlgaro",
  agach_pulso: "Agachamento com pulsos",
  afundo_rev: "Afundo reverso",
  afundo_cruz: "Afundo cruzado (curtsy)",
  around: "Around the world",
  step_up: "Subida na cadeira (step-up)",
  hidrante: "Hidrante (fire hydrant)",
  hip_thrust: "Elevação pélvica (hip thrust)",
  leg_reach: "Leg reach",
  kneel_stand: "Levantar do ajoelhado",
  stiff_b: "Stiff em B-stance",
};

// Em casa: kettlebell → halter, banco/sofá/step → cadeira; máquinas são ignoradas.
function equipamento(raw: string): string[] {
  const out = new Set<string>();
  for (const part of raw.toLowerCase().split("+").map((s) => s.trim())) {
    if (/halter|kettlebell|anilha|garrafa|medicine/.test(part)) out.add("halteres");
    if (/tapete/.test(part)) out.add("tapete");
    if (/miniband|superband/.test(part)) out.add("miniband");
    if (/caneleira|tornozeleira/.test(part)) out.add("caneleira");
    if (/cadeira|banco|sofá|step/.test(part)) out.add("cadeira");
  }
  return out.size ? [...out] : ["nenhum"];
}

function maisComum<T>(values: T[]): T {
  const count = new Map<T, number>();
  for (const v of values) count.set(v, (count.get(v) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

const grupos = new Map<string, Row[]>();
for (const r of rows) {
  if (EXCLUIR.has(r.exercicio_id)) continue;
  grupos.set(r.exercicio_id, [...(grupos.get(r.exercicio_id) ?? []), r]);
}

const exercicios = [...grupos.entries()].map(([id, rs]) => {
  const first = rs[0];
  const refs: { link: string; author: string; title: string }[] = [];
  for (const r of rs) {
    if (!refs.some((x) => x.link === r.link)) refs.push({ link: r.link, author: r.autor, title: r.nome_no_post });
  }
  return {
    id,
    name: NOMES[id] ?? first.exercicio_base,
    equipment: equipamento(maisComum(rs.map((r) => r.equipamento))),
    cue: first.dica,
    steps: first.passo_a_passo.split("|").map((s) => s.trim().replace(/^\d+\.\s*/, "")).filter(Boolean),
    bodyPart: maisComum(rs.map((r) => r.parte_do_corpo)),
    style: maisComum(rs.map((r) => r.estilo)),
    muscle: first.grupo_muscular,
    variations: [...new Set(rs.map((r) => r.nome_no_post))],
    refs,
  };
});

exercicios.sort((a, b) => b.refs.length - a.refs.length);

const out =
  "// GERADO por scripts/importar-instagram.ts a partir de data/instagram-exercicios.json.\n" +
  "// Não edite à mão: mude o JSON ou o script e rode `npm run importar`.\n" +
  'import type { Exercise } from "./exercises";\n\n' +
  `export const instagramExercises: Exercise[] = ${JSON.stringify(exercicios, null, 2)};\n`;

fs.writeFileSync(path.join(ROOT, "lib/instagram.generated.ts"), out);
console.log(`${exercicios.length} exercícios gerados de ${rows.length} linhas (${EXCLUIR.size} tipos de academia ignorados).`);
