import { exercises, type Exercise } from "./exercises";
import { DAY_ORDER, REST_SECONDS, WORK_SECONDS, week, type DayKey } from "./plan";

export const TIMEZONE = "Europe/Rome";

export type Block = {
  title: string;
  rounds: number;
  exercises: Exercise[];
};

export type Workout = {
  day: DayKey;
  name: string;
  focus: string;
  emoji: string;
  workSeconds: number;
  restSeconds: number;
  estimatedMinutes: number;
  blocks: Block[];
};

const JS_DAY_TO_KEY: DayKey[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

/** Dia da semana no fuso da Itália (o cron roda em UTC). */
export function dayKeyFor(date: Date = new Date()): DayKey {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, weekday: "short" })
    .format(date)
    .toLowerCase();
  const map: Record<string, DayKey> = {
    sun: "dom", mon: "seg", tue: "ter", wed: "qua", thu: "qui", fri: "sex", sat: "sab",
  };
  return map[weekday] ?? JS_DAY_TO_KEY[date.getDay()];
}

export function isDayKey(value: unknown): value is DayKey {
  return typeof value === "string" && (DAY_ORDER as string[]).includes(value);
}

function resolve(ids: string[]): Exercise[] {
  return ids.map((id) => {
    const ex = exercises[id];
    if (!ex) throw new Error(`Exercício "${id}" não existe em lib/exercises.ts`);
    return ex;
  });
}

export function buildWorkout(day: DayKey): Workout {
  const plan = week[day];
  const blocks: Block[] = [
    { title: "Aquecimento", rounds: 1, exercises: resolve(plan.warmup) },
    { title: "Circuito", rounds: plan.rounds, exercises: resolve(plan.circuit) },
    { title: "Desaquecimento", rounds: 1, exercises: resolve(plan.cooldown) },
  ].filter((b) => b.exercises.length > 0);

  const slots = blocks.reduce((sum, b) => sum + b.exercises.length * b.rounds, 0);
  const estimatedMinutes = Math.round((slots * (WORK_SECONDS + REST_SECONDS)) / 60);

  return {
    day,
    name: plan.name,
    focus: plan.focus,
    emoji: plan.emoji,
    workSeconds: WORK_SECONDS,
    restSeconds: REST_SECONDS,
    estimatedMinutes,
    blocks,
  };
}

/** Texto do resumo do treino (HTML do Telegram). */
export function workoutText(w: Workout): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = [
    `${w.emoji} <b>${esc(w.name)}: ${esc(w.focus)}</b>`,
    `⏱ ~${w.estimatedMinutes} min · ${w.workSeconds}s por exercício`,
    "",
  ];
  for (const b of w.blocks) {
    lines.push(`<b>${esc(b.title)}</b>${b.rounds > 1 ? ` (${b.rounds}x)` : ""}`);
    b.exercises.forEach((e, i) => {
      const link = e.refs?.[0]?.link;
      lines.push(`${i + 1}. ${link ? `<a href="${esc(link)}">${esc(e.name)}</a>` : esc(e.name)}`);
    });
    lines.push("");
  }
  lines.push("Toque no nome para ver o vídeo, ou abra o timer aqui embaixo. 👇");
  return lines.join("\n");
}
