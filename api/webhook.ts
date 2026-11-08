// Webhook do Telegram. Aberto para qualquer pessoa que conversar com o bot:
//   /start  boas-vindas + treino de hoje com o botão do timer
//   /hoje   treino de hoje        /dia qui  treino de um dia        /semana  plano da semana
// O envio automático das 5h (api/cron.ts) continua só para TELEGRAM_CHAT_ID.
import { appUrl, sendWorkout, tg, webhookSecret, weekText } from "../lib/telegram";
import { dayKeyFor, isDayKey } from "../lib/workout";

type Update = { message?: { chat: { id: number }; from?: { first_name?: string }; text?: string } };

const HELP =
  "Comandos:\n" +
  "/hoje: treino de hoje\n" +
  "/semana: plano da semana\n" +
  "/dia qui: treino de um dia (seg, ter, qua, qui, sex, sab, dom)\n\n" +
  "O botão 🏋️ Timer, ao lado do campo de mensagem, abre o timer a qualquer momento.";

export async function POST(request: Request): Promise<Response> {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret()) {
    return new Response("unauthorized", { status: 401 });
  }

  const update = (await request.json()) as Update;
  const msg = update.message;
  if (!msg?.text) return Response.json({ ok: true });

  const chatId = msg.chat.id;
  // Em grupos o comando vem como "/hoje@pt_tawrus_bot".
  const [rawCmd, arg] = msg.text.trim().toLowerCase().split(/\s+/);
  const cmd = rawCmd.split("@")[0];

  try {
    if (cmd === "/start") {
      const nome = msg.from?.first_name ? `, ${msg.from.first_name}` : "";
      await tg("sendMessage", {
        chat_id: chatId,
        text:
          `Oi${nome}! 💪 Eu sou o PT Tawrus: treinos em casa de até 1 hora, ` +
          `com timer de 40 s por exercício.\n\nAqui vai o treino de hoje 👇\n\n${HELP}`,
        reply_markup: {
          inline_keyboard: [[{ text: "▶️ Abrir timer", web_app: { url: appUrl() } }]],
        },
      });
      await sendWorkout(chatId, dayKeyFor());
    } else if (cmd === "/hoje") {
      await sendWorkout(chatId, dayKeyFor());
    } else if (cmd === "/dia" && isDayKey(arg)) {
      await sendWorkout(chatId, arg);
    } else if (cmd === "/semana" || cmd === "/dia") {
      await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: weekText() });
    } else if (cmd === "/id") {
      await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: `Seu chat id: <code>${chatId}</code>` });
    } else {
      await tg("sendMessage", { chat_id: chatId, text: HELP });
    }
  } catch (err) {
    // Responde 200 mesmo com erro, para o Telegram não ficar reenviando a mesma mensagem.
    console.error(err);
  }
  return Response.json({ ok: true });
}
