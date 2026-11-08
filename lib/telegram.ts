import { createHash } from "node:crypto";
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

/** URL pública: APP_URL, ou o domínio de produção que a própria Vercel informa. */
export function appUrl(): string {
  const explicit = process.env.APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  throw new Error("Configure APP_URL (ex.: https://pt-tawrus.vercel.app)");
}

/**
 * Segredo que o Telegram manda no header do webhook. Se TELEGRAM_WEBHOOK_SECRET não
 * existir, é derivado do token do bot, assim não precisa de mais uma variável.
 */
export function webhookSecret(): string {
  return (
    process.env.TELEGRAM_WEBHOOK_SECRET ||
    createHash("sha256").update(`webhook:${env("TELEGRAM_BOT_TOKEN")}`).digest("hex").slice(0, 48)
  );
}

/** Liga o bot a este site (webhook) e registra os comandos do menu. */
export async function setupBot(): Promise<string> {
  const url = `${appUrl()}/api/webhook`;
  await tg("setWebhook", { url, secret_token: webhookSecret(), allowed_updates: ["message"] });
  await tg("setMyCommands", {
    commands: [
      { command: "start", description: "Começar e ver o treino de hoje" },
      { command: "hoje", description: "Treino de hoje" },
      { command: "semana", description: "Plano da semana" },
      { command: "dia", description: "Treino de um dia: /dia qui" },
    ],
  });
  // Botão fixo ao lado do campo de mensagem que abre o timer (para qualquer pessoa).
  await tg("setChatMenuButton", {
    menu_button: { type: "web_app", text: "🏋️ Timer", web_app: { url: appUrl() } },
  });
  return url;
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

  // Álbum: ilustrações da personagem (início → fim), circuito primeiro, sem repetir,
  // no máximo 10 (limite do Telegram).
  const seen = new Set<string>();
  const ordered = [...w.blocks].sort((x, y) => Number(y.title === "Circuito") - Number(x.title === "Circuito"));
  const photos = ordered
    .flatMap((b) => b.exercises)
    .map((e) => ({ e, img: e.illustration ?? e.image }))
    .filter(({ e, img }) => img && !seen.has(e.id) && seen.add(e.id))
    .slice(0, 10)
    .map(({ e, img }) => ({ type: "photo", media: `${appUrl()}${img}`, caption: e.name }));

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
