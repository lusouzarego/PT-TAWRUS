// Liga o bot ao site. Abra no navegador uma vez, depois de configurar as variáveis:
//   https://pt-tawrus.vercel.app/api/setup?key=<CRON_SECRET>
import { appUrl, setupBot } from "../lib/telegram";

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<title>${title}</title><body style="font:16px/1.5 system-ui;max-width:520px;margin:40px auto;padding:0 16px">` +
      `<h1 style="font-size:22px">${title}</h1>${body}</body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );

export async function GET(request: Request): Promise<Response> {
  const key = new URL(request.url).searchParams.get("key");
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return page("Acesso negado", "<p>Use <code>/api/setup?key=</code> seguido do valor de CRON_SECRET.</p>", 401);
  }
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return page("Falta o token", "<p>Adicione TELEGRAM_BOT_TOKEN na Vercel e faça Redeploy.</p>", 400);
  }
  try {
    const url = await setupBot();
    const chat = process.env.TELEGRAM_CHAT_ID
      ? "<p>✅ TELEGRAM_CHAT_ID configurado: o treino chega todo dia às 5h (Itália).</p>"
      : "<p>Próximo passo: mande <b>/start</b> para o bot no Telegram, copie o número que ele responder " +
        "para TELEGRAM_CHAT_ID na Vercel e faça Redeploy.</p>";
    return page("✅ Bot ligado", `<p>Webhook: <code>${url}</code></p><p>Timer: <a href="${appUrl()}">${appUrl()}</a></p>${chat}`);
  } catch (err) {
    return page("Erro", `<p>${String((err as Error).message).replace(/</g, "&lt;")}</p>`, 500);
  }
}
