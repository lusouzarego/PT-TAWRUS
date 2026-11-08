import { buildWorkout, workoutText } from "./workout";
import { DAY_ORDER, week, type DayKey } from "./plan";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ${name} não configurada`);
  return v;
}

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}

function appUrl(): string {
  return env("APP_URL").replace(/\/$/, "");
}

/** Botão que abre o Mini App (timer) já no dia certo. */
function timerButton(day: DayKey) {
  return {
    inline_keyboard: [[{ text: "▶️ Abrir timer do treino", web_app: { url: `${appUrl()}/?day=${day}` } }]],
  };
}

/** Envia o treino do dia: fotos dos exercícios + resumo com botão do timer. */
export async function sendWorkout(chatId: string | number, day: DayKey): Promise<void> {
  const w = buildWorkout(day);

  // Fotos: só exercícios que já têm imagem, sem repetir, no máximo 10 (limite do Telegram).
  const seen = new Set<string>();
  const photos = w.blocks
    .flatMap((b) => b.exercises)
    .filter((e) => e.image && !seen.has(e.id) && seen.add(e.id))
    .slice(0, 10)
    .map((e) => ({ type: "photo", media: `${appUrl()}${e.image}`, caption: e.name }));

  if (photos.length === 1) {
    await tg("sendPhoto", { chat_id: chatId, photo: photos[0].media, caption: photos[0].caption });
  } else if (photos.length > 1) {
    await tg("sendMediaGroup", { chat_id: chatId, media: photos });
  }

  await tg("sendMessage", {
    chat_id: chatId,
    text: workoutText(w),
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: timerButton(day),
  });
}

export function weekText(): string {
  return [
    "<b>📅 Semana de treinos</b>",
    "",
    ...DAY_ORDER.map((k) => `${week[k].emoji} <b>${week[k].name}</b>: ${week[k].focus}`),
    "",
    "Use /hoje ou /dia qui (seg, ter, qua, qui, sex, sab, dom).",
  ].join("\n");
}
