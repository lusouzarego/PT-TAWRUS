// Registra o webhook e os comandos do bot: npm run set-webhook
// Precisa de TELEGRAM_BOT_TOKEN, APP_URL e TELEGRAM_WEBHOOK_SECRET no ambiente.
import { tg } from "../lib/telegram";

(async () => {
  const url = `${process.env.APP_URL!.replace(/\/$/, "")}/api/webhook`;
  await tg("setWebhook", {
    url,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message"],
  });
  await tg("setMyCommands", {
    commands: [
      { command: "hoje", description: "Treino de hoje" },
      { command: "semana", description: "Plano da semana" },
      { command: "dia", description: "Treino de um dia: /dia qui" },
    ],
  });
  console.log(`Webhook configurado em ${url}`);
})();
