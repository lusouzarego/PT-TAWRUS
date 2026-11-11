// Grupo da comunidade (COMUNIDADE_CHAT_ID).
//
// Bots do Telegram não conseguem colocar alguém num grupo diretamente: o caminho oficial é
// um link de convite. Então, ao aprovar ou renovar uma assinante, o bot cria um link só dela
// (vale para 1 pessoa, por 7 dias) e manda com o botão "Entrar no grupo".
// Quando a assinatura vence ou é removida, o bot tira a pessoa do grupo (sem bloquear:
// ela pode voltar com um convite novo quando renovar).
//
// Para funcionar, o bot precisa ser ADMINISTRADOR do grupo com as permissões
// "Convidar utenti tramite link" (adicionar membros) e "Bloccare utenti" (remover membros).
import { ownerId } from "./access";
import { tg } from "./telegram";

export const communityId = () => process.env.COMUNIDADE_CHAT_ID || "";

const IN_GROUP = new Set(["creator", "administrator", "member", "restricted"]);

async function isInGroup(group: string, userId: number): Promise<boolean> {
  try {
    const m = await tg<{ status: string; is_member?: boolean }>("getChatMember", { chat_id: group, user_id: userId });
    return IN_GROUP.has(m.status) && (m.status !== "restricted" || m.is_member !== false);
  } catch {
    return false;
  }
}

/**
 * Manda para a assinante o convite do grupo (se ela ainda não estiver lá).
 * Devolve o que aconteceu, para a dona ver no aviso de aprovação.
 */
export async function inviteToCommunity(userId: number, name: string): Promise<"sem_grupo" | "ja_no_grupo" | "convidada" | "erro"> {
  const group = communityId();
  if (!group) return "sem_grupo";
  if (await isInGroup(group, userId)) return "ja_no_grupo";
  try {
    const link = await tg<{ invite_link: string }>("createChatInviteLink", {
      chat_id: group,
      name: `Assinante ${userId}`.slice(0, 32),
      member_limit: 1,
      expire_date: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    });
    await tg("sendMessage", {
      chat_id: userId,
      parse_mode: "HTML",
      text:
        `💚 ${name ? `${name}, este` : "Este"} é o seu convite para o <b>grupo do Cool Moms Club</b>, ` +
        "onde as mães compartilham os check-ins e se apoiam.\n\n" +
        "O link é só seu e vale por 7 dias. Se expirar, mande /comunidade que eu envio outro.",
      reply_markup: { inline_keyboard: [[{ text: "💚 Entrar no grupo", url: link.invite_link }]] },
    });
    return "convidada";
  } catch (e) {
    console.error(e);
    await tg("sendMessage", {
      chat_id: ownerId(),
      text:
        "⚠️ Não consegui criar o convite do grupo. Confira se o bot é administrador do grupo " +
        "com a permissão de convidar pessoas via link.",
    }).catch(() => {});
    return "erro";
  }
}

/** Tira a pessoa do grupo sem bloquear (ban + unban). Silencioso se ela nem estava lá. */
export async function removeFromCommunity(userId: number): Promise<boolean> {
  const group = communityId();
  if (!group || !(await isInGroup(group, userId))) return false;
  try {
    await tg("banChatMember", { chat_id: group, user_id: userId, revoke_messages: false });
    await tg("unbanChatMember", { chat_id: group, user_id: userId, only_if_banned: true });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const inviteNote: Record<string, string> = {
  sem_grupo: "",
  ja_no_grupo: " · já está no grupo",
  convidada: " · convite do grupo enviado",
  erro: " · ⚠️ convite do grupo falhou",
};
