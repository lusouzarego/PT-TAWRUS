// Webhook do Telegram: comandos /start, /hoje, /semana, /dia <seg..dom>.
import { sendWorkout, tg, webhookSecret, weekText } from "../lib/telegram";
import { dayKeyFor, isDayKey } from "../lib/workout";

type Update = { message?: { chat: { id: number }; text?: string } };

export async function POST(request: Request): Promise<Response> {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret()) {
    return new Response("unauthorized", { status: 401 });
  }

  const update = (await request.json()) as Update;
  const msg = update.message;
  if (!msg?.text) return Response.json({ ok: true });

  const chatId = msg.chat.id;
  const allowed = process.env.TELEGRAM_CHAT_ID;
  const [cmd, arg] = msg.text.trim().toLowerCase().split(/\s+/);

  if (cmd === "/start") {
    await tg("sendMessage", {
      chat_id: chatId,
      parse_mode: "HTML",
      text:
        `Oi! 👋 Seu chat id é <code>${chatId}</code>.\n` +
        `Coloque esse número em TELEGRAM_CHAT_ID na Vercel (e faça Redeploy) para receber o treino todo dia às 5h.\n\n` +
        weekText(),
    });
    return Response.json({ ok: true });
  }

  // Os demais comandos só respondem para você.
  if (allowed && String(chatId) !== allowed) return Response.json({ ok: true });

  if (cmd === "/hoje") {
    await sendWorkout(chatId, dayKeyFor());
  } else if (cmd === "/dia" && isDayKey(arg)) {
    await sendWorkout(chatId, arg);
  } else if (cmd === "/semana" || cmd === "/dia") {
    await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: weekText() });
  }
  return Response.json({ ok: true });
}
