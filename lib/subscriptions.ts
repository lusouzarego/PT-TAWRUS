// Rotina diária dos vencimentos (chamada pelo cron das 5h na Itália):
// - 3 dias antes: lembrete para a assinante
// - no vencimento: pausa o acesso, avisa a assinante e manda à dona o botão de renovar
import { ownerId } from "./access";
import { DAY_MS, hasStore, listMembers, saveMember } from "./store";
import { tg } from "./telegram";

const fmt = (ms?: number) =>
  ms ? new Date(ms).toLocaleDateString("pt-BR", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit" }) : "-";

export async function checkExpirations(now = Date.now()): Promise<{ reminded: number; expired: number }> {
  if (!hasStore()) return { reminded: 0, expired: 0 };
  let reminded = 0, expired = 0;
  for (const m of await listMembers()) {
    if (m.status !== "active" || !m.expiresAt) continue;
    if (m.expiresAt <= now) {
      await saveMember({ ...m, status: "expired" });
      await tg("sendMessage", {
        chat_id: m.id,
        text: "⏰ Sua assinatura do Cool Moms Club venceu. Mande /start para pedir a renovação.",
      }).catch(() => {});
      await tg("sendMessage", {
        chat_id: ownerId(),
        parse_mode: "HTML",
        text: `🔴 Assinatura vencida: ${m.name}${m.username ? ` (@${m.username})` : ""} · id <code>${m.id}</code>`,
        reply_markup: { inline_keyboard: [[{ text: "🔁 Renovar 30 dias", callback_data: `rn:${m.id}` }]] },
      });
      expired++;
    } else if (!m.reminded && m.expiresAt - now <= 3 * DAY_MS) {
      await saveMember({ ...m, reminded: true });
      await tg("sendMessage", {
        chat_id: m.id,
        text: `💪 Sua assinatura do Cool Moms Club vence em ${fmt(m.expiresAt)}. Para continuar, mande /start para ver os dados de pagamento e envie aqui o comprovante.`,
      }).catch(() => {});
      reminded++;
    }
  }
  return { reminded, expired };
}
