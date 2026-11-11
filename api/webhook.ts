// Webhook do Telegram com controle de acesso por assinatura.
//
// Dona (TELEGRAM_CHAT_ID): acesso total + aprova pedidos.
// Outras pessoas: /start envia um pedido de acesso; a dona recebe botões ✅ Aprovar / ❌ Recusar.
// Aprovadas têm 30 dias de acesso (/hoje, /semana, /dia, timer). O cron avisa 3 dias antes
// e pausa no vencimento; a dona renova com um toque.
//
// Comandos da dona: /assinantes, /renovar <id>, /remover <id>, /convidar <id>.
// Aprovar/renovar manda o convite do grupo da comunidade; remover tira a pessoa do grupo.
import { hasAccess, isOwner, ownerId } from "../lib/access";
import { communityId, inviteNote, inviteToCommunity, removeFromCommunity } from "../lib/comunidade";
import { appUrl, sendWorkout, tg, webhookSecret, weekText } from "../lib/telegram";
import { dayKeyFor, isDayKey } from "../lib/workout";
import { week } from "../lib/plan";
import {
  DAY_MS, addCheckin, extend, getMember, getPendingPhoto, hasStore, isActive, listMembers, saveMember,
  setPendingPhoto, type Member,
} from "../lib/store";
import { TIMEZONE } from "../lib/workout";

type User = { id: number; first_name?: string; last_name?: string; username?: string };
type Update = {
  message?: {
    message_id: number;
    chat: { id: number; type?: string };
    from?: User;
    text?: string;
    caption?: string;
    photo?: { file_id: string }[];
    document?: unknown;
  };
  callback_query?: { id: string; from: User; data?: string; message?: { chat: { id: number }; message_id: number } };
};

const HELP =
  "Comandos:\n" +
  "/hoje: treino de hoje\n" +
  "/semana: plano da semana\n" +
  "/dia qui: treino de um dia (seg, ter, qua, qui, sex, sab, dom)\n" +
  "/comunidade: convite para o grupo do Cool Moms Club\n" +
  "📸 Check-in: mande a foto do fim do treino aqui na conversa (📎 → Câmera)\n\n" +
  "O botão 🏋️ Timer, ao lado do campo de mensagem, abre o timer a qualquer momento.";

// Assinatura: valor e dados de pagamento vêm das variáveis da Vercel (o repositório é público).
//   PRECO_MENSAL (padrão "€9,90"), PAGAMENTO_SATISPAY, PAGAMENTO_IBAN, PAGAMENTO_TITULAR
const price = () => process.env.PRECO_MENSAL || "€9,90";
function paymentText(): string {
  const lines = [`💳 <b>Assinatura: ${esc(price())} por mês</b>`, "", "Formas de pagamento:"];
  const satispay = process.env.PAGAMENTO_SATISPAY;
  const iban = process.env.PAGAMENTO_IBAN;
  const holder = process.env.PAGAMENTO_TITULAR;
  lines.push(`• <b>Satispay</b>${satispay ? `: <code>${esc(satispay)}</code>` : ""}`);
  lines.push(`• <b>Transferência (IBAN)</b>${iban ? `: <code>${esc(iban)}</code>` : ""}`);
  if (holder) lines.push(`  Titular: ${esc(holder)}`);
  if (!satispay && !iban) lines.push("", "A administradora vai te mandar os dados para o pagamento.");
  lines.push("", "Depois de pagar, <b>envie aqui a foto ou o PDF do comprovante</b> 📎. Assim que for confirmado, seu acesso é liberado.");
  return lines.join("\n");
}

const PRIVACY =
  "🔒 Para gerenciar a sua assinatura guardamos apenas o seu nome e @ do Telegram. " +
  "Você pode pedir para apagar a qualquer momento.";

const DISCLAIMER =
  "⚠️ Os treinos são sugestões gerais. Consulte um profissional de saúde antes de começar " +
  "e respeite os seus limites.";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fullName = (u: User) => [u.first_name, u.last_name].filter(Boolean).join(" ") || "Sem nome";
const fmtDate = (ms?: number) =>
  ms ? new Date(ms).toLocaleDateString("pt-BR", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric" }) : "-";
const who = (m: Member) => `${esc(m.name)}${m.username ? ` (@${esc(m.username)})` : ""} · id <code>${m.id}</code>`;

const send = (chatId: number, text: string, extra: Record<string, unknown> = {}) =>
  tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });

const approveButtons = (id: number) => ({
  inline_keyboard: [[
    { text: "✅ Aprovar 30 dias", callback_data: `ap:${id}` },
    { text: "❌ Recusar", callback_data: `rj:${id}` },
  ]],
});
const renewButton = (id: number) => ({ inline_keyboard: [[{ text: "🔁 Renovar 30 dias", callback_data: `rn:${id}` }]] });

async function welcome(chatId: number, name?: string) {
  await send(
    chatId,
    `Oi${name ? `, ${esc(name)}` : ""}! 💪 Bem-vinda ao Cool Moms Club: treinos em casa de até 1 hora, ` +
      `com timer de 40 s por exercício.\n\n` +
      (communityId()
        ? "💚 <b>Grupo do Cool Moms Club:</b> é lá que as mães compartilham os check-ins e se apoiam. " +
          "Toque em <b>Entrar no grupo</b> no convite que te mandei, ou mande /comunidade a qualquer momento " +
          "para receber um link novo.\n\n"
        : "") +
      `${DISCLAIMER}\n\nAqui vai o treino de hoje 👇\n\n${HELP}`,
    { reply_markup: { inline_keyboard: [[{ text: "▶️ Abrir timer", web_app: { url: appUrl() } }]] } },
  );
}

// ── Pedido de acesso ──────────────────────────────────────────────────────
async function requestAccess(from: User, chatId: number) {
  const existing = await getMember(from.id);
  if (existing?.status === "pending") {
    await send(chatId, `⏳ Seu pedido já foi enviado.\n\n${paymentText()}`);
    return;
  }
  const m: Member = {
    ...(existing ?? { requestedAt: Date.now() }),
    id: from.id,
    name: fullName(from),
    username: from.username,
    status: existing?.status === "expired" ? "expired" : "pending",
    requestedAt: Date.now(),
  } as Member;
  if (m.status !== "expired") m.status = "pending";
  await saveMember(m);

  const renewal = existing?.status === "expired";
  await send(
    chatId,
    renewal
      ? `🔁 Sua assinatura do Cool Moms Club venceu.\n\n${paymentText()}`
      : `👋 Oi${from.first_name ? `, ${esc(from.first_name)}` : ""}! Bem-vinda ao <b>Cool Moms Club</b> 💚\n` +
          "A comunidade de mães brasileiras na Itália: treinos em casa de até 1 hora, com ilustração de cada " +
          "exercício, passo a passo e timer.\n\n" +
          `${paymentText()}\n\n${PRIVACY}`,
  );
  await send(
    ownerId(),
    `${renewal ? "🔁 Pedido de renovação" : "🔔 Novo pedido de acesso"}\n${who(m)}`,
    { reply_markup: renewal ? renewButton(m.id) : approveButtons(m.id) },
  );
}

// ── Comprovante de pagamento ──────────────────────────────────────────────
async function receipt(from: User, chatId: number, messageId: number) {
  let m = await getMember(from.id);
  if (!m) {
    m = { id: from.id, name: fullName(from), username: from.username, status: "pending", requestedAt: Date.now() };
    await saveMember(m);
  }
  await tg("forwardMessage", { chat_id: ownerId(), from_chat_id: chatId, message_id: messageId });
  const renewal = isActive(m) || m.status === "expired";
  await send(ownerId(), `🧾 Comprovante recebido de ${who(m)}`, {
    reply_markup: renewal ? renewButton(m.id) : approveButtons(m.id),
  });
  await send(chatId, "🧾 Comprovante recebido! Assim que a administradora confirmar o pagamento, você recebe uma mensagem. 💚");
}

// ── Check-in pela conversa ────────────────────────────────────────────────
// No Android o Telegram não deixa o timer usar a câmera. Então quem tem acesso pode tirar a
// foto aqui na conversa (📎 → Câmera) e o bot pergunta o que fazer com ela.
async function photoFromMember(from: User, chatId: number, messageId: number, fileId: string, owner: boolean) {
  await setPendingPhoto(from.id, { fileId, messageId, at: Date.now() });
  const rows = [
    [{ text: "💚 Compartilhar com o Cool Moms Club", callback_data: "ci:share" }],
    [{ text: "🔒 Guardar só pra mim (check-in)", callback_data: "ci:me" }],
  ];
  if (!owner) rows.push([{ text: "🧾 É comprovante de pagamento", callback_data: "ci:pay" }]);
  await send(chatId, "📸 Recebi sua foto! É o check-in do treino de hoje?", {
    reply_to_message_id: messageId,
    reply_markup: { inline_keyboard: rows },
  });
}

async function checkinCallback(cb: NonNullable<Update["callback_query"]>, action: string) {
  const answer = (text: string) => tg("answerCallbackQuery", { callback_query_id: cb.id, text });
  const user = cb.from;
  if (!isOwner(user.id) && !(await hasAccess(user.id)) && action !== "pay") return answer("Seu acesso não está ativo.");
  const p = await getPendingPhoto(user.id);
  if (!p) return answer("Não achei a foto. Mande de novo, por favor.");
  const done = (text: string) =>
    cb.message
      ? tg("editMessageText", { chat_id: cb.message.chat.id, message_id: cb.message.message_id, parse_mode: "HTML", text })
      : send(user.id, text);

  if (action === "pay") {
    await answer("Enviando o comprovante");
    await done("🧾 Ok, enviei como comprovante de pagamento.");
    return receipt(user, user.id, p.messageId);
  }

  const plan = week[dayKeyFor()];
  const what = `${plan.name} · ${plan.focus}`;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
  const total = hasStore() ? await addCheckin(user.id, today).catch(() => 0) : 0;
  const streak = total ? `\n🔥 ${total}º treino concluído` : "";

  let shared = false;
  const group = communityId();
  if (action === "share" && group) {
    try {
      await tg("sendPhoto", {
        chat_id: group,
        photo: p.fileId,
        caption: `💪 ${user.first_name || "Uma cool mom"} concluiu o treino de hoje!\n✅ ${what}${streak}\n\nMandem um ❤️🔥 pra ela!`,
      });
      shared = true;
    } catch (e) {
      console.error(e);
    }
  }
  await answer(shared ? "Compartilhado! 💚" : "Check-in salvo ✅");
  await done(
    `✅ <b>Check-in: ${esc(what)}</b>${streak}\n\n` +
      (shared
        ? "Compartilhado no grupo do Cool Moms Club 💚"
        : action === "share"
        ? group
          ? "Salvo aqui, mas não consegui postar no grupo. Já avisei a administradora."
          : "Salvo aqui. O grupo do Cool Moms Club ainda não está ligado."
        : "Salvo aqui, só você vê. 💚"),
  );
  if (action === "share" && group && !shared) {
    await send(ownerId(), "⚠️ Não consegui postar um check-in no grupo. Confira se o bot é administrador do grupo.");
  }
}

// ── Botões da dona ────────────────────────────────────────────────────────
async function handleCallback(cb: NonNullable<Update["callback_query"]>) {
  const answer = (text: string) => tg("answerCallbackQuery", { callback_query_id: cb.id, text });
  const [kind, sub] = (cb.data || "").split(":");
  if (kind === "ci") return checkinCallback(cb, sub);
  if (!isOwner(cb.from.id)) return answer("Só a administradora pode fazer isso.");
  const [action, raw] = (cb.data || "").split(":");
  const m = await getMember(Number(raw));
  if (!m) return answer("Pessoa não encontrada.");

  let note: string;
  if (action === "ap" || action === "rn") {
    const updated = extend(m);
    await saveMember(updated);
    note = `✅ ${action === "ap" ? "Aprovado" : "Renovado"} até ${fmtDate(updated.expiresAt)}`;
    await send(
      m.id,
      action === "ap"
        ? `🎉 Seu acesso ao Cool Moms Club foi aprovado! Válido até ${fmtDate(updated.expiresAt)}.`
        : `🎉 Assinatura renovada! Acesso válido até ${fmtDate(updated.expiresAt)}.`,
    );
    // Convite do grupo logo depois da aprovação (antes do treino, que manda várias fotos).
    note += inviteNote[await inviteToCommunity(m.id, m.name.split(" ")[0])];
    if (action === "ap") {
      await welcome(m.id, m.name.split(" ")[0]);
      await sendWorkout(m.id, dayKeyFor());
    }
  } else if (action === "rj") {
    await saveMember({ ...m, status: "rejected" });
    note = "❌ Recusado";
    await send(m.id, "Seu pedido de acesso ao Cool Moms Club não foi aprovado desta vez.");
  } else {
    return answer("Ação desconhecida.");
  }

  await answer(note);
  if (cb.message) {
    await tg("editMessageText", {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      parse_mode: "HTML",
      text: `${who(m)}\n${note}`,
    });
  }
}

// ── Comandos da dona ──────────────────────────────────────────────────────
async function ownerCommand(cmd: string, arg: string | undefined, chatId: number): Promise<boolean> {
  if (cmd === "/assinantes") {
    const list = (await listMembers()).sort((a, b) => (a.expiresAt ?? 0) - (b.expiresAt ?? 0));
    if (!list.length) {
      await send(chatId, "Ainda não há assinantes nem pedidos.");
      return true;
    }
    const icon: Record<string, string> = { active: "🟢", pending: "⏳", expired: "🔴", rejected: "⚪️", removed: "⚫️" };
    const lines = list.map((m) => {
      const active = isActive(m);
      const status = m.status === "active" && !active ? "expired" : m.status;
      const until = status === "active" ? ` · até ${fmtDate(m.expiresAt)}` : status === "expired" ? ` · venceu ${fmtDate(m.expiresAt)}` : "";
      return `${icon[status] ?? "•"} ${who(m)}${until}`;
    });
    await send(chatId, `<b>Assinantes</b> (${list.filter((m) => isActive(m)).length} ativos)\n\n${lines.join("\n")}\n\n/renovar &lt;id&gt; · /remover &lt;id&gt;`);
    return true;
  }
  if (cmd === "/convidar") {
    const m = arg ? await getMember(Number(arg)) : null;
    if (!m || !isActive(m)) {
      await send(chatId, "Use /convidar &lt;id&gt; com o id de uma assinante ativa (veja em /assinantes).");
      return true;
    }
    const r = await inviteToCommunity(m.id, m.name.split(" ")[0]);
    const txt = { sem_grupo: "O grupo ainda não está configurado (COMUNIDADE_CHAT_ID).", ja_no_grupo: "já está no grupo.", convidada: "convite enviado. 💚", erro: "não consegui criar o convite." }[r];
    await send(chatId, r === "sem_grupo" ? txt : `${who(m)}: ${txt}`);
    return true;
  }
  if (cmd === "/renovar" || cmd === "/remover") {
    const m = arg ? await getMember(Number(arg)) : null;
    if (!m) {
      await send(chatId, `Use ${cmd} &lt;id&gt; (veja os ids em /assinantes).`);
      return true;
    }
    if (cmd === "/renovar") {
      const u = extend(m);
      await saveMember(u);
      await send(m.id, `🎉 Assinatura renovada! Acesso válido até ${fmtDate(u.expiresAt)}.`);
      const inv = await inviteToCommunity(m.id, m.name.split(" ")[0]);
      await send(chatId, `✅ ${who(u)} renovado até ${fmtDate(u.expiresAt)}${inviteNote[inv]}`);
    } else {
      await saveMember({ ...m, status: "removed" });
      const out = await removeFromCommunity(m.id);
      await send(chatId, `⚫️ ${who(m)} removido${out ? " (e retirado do grupo)" : ""}.`);
    }
    return true;
  }
  return false;
}

export async function POST(request: Request): Promise<Response> {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret()) {
    return new Response("unauthorized", { status: 401 });
  }
  const update = (await request.json()) as Update;

  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return Response.json({ ok: true });
    }

    const msg = update.message;
    if (!msg?.from) return Response.json({ ok: true });

    // Fotos e PDFs na conversa privada.
    const privateChat = msg.chat.type === "private" || msg.chat.type === undefined;
    if (!msg.text && (msg.photo || msg.document) && privateChat) {
      const owner = isOwner(msg.from.id);
      const member = owner || (await hasAccess(msg.from.id));
      // Quem tem acesso e manda FOTO: check-in (com opção "é comprovante" para quem renova).
      if (member && msg.photo?.length) {
        await photoFromMember(msg.from, msg.chat.id, msg.message_id, msg.photo[msg.photo.length - 1].file_id, owner);
        return Response.json({ ok: true });
      }
      // Quem ainda não tem acesso (ou manda PDF): comprovante para a dona com os botões.
      if (!owner) await receipt(msg.from, msg.chat.id, msg.message_id);
      return Response.json({ ok: true });
    }
    if (!msg.text) return Response.json({ ok: true });
    const chatId = msg.chat.id;
    const from = msg.from;
    const [rawCmd, arg] = msg.text.trim().toLowerCase().split(/\s+/);
    const cmd = rawCmd.split("@")[0]; // em grupos: "/hoje@pt_tawrus_bot"
    const owner = isOwner(from.id);

    const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
    if (cmd === "/id") {
      await send(chatId, isGroup ? `ID deste grupo: <code>${chatId}</code>` : `Seu id: <code>${from.id}</code>`);
      return Response.json({ ok: true });
    }
    // No grupo da comunidade o bot só posta os check-ins; não responde às conversas.
    if (isGroup) return Response.json({ ok: true });
    if (owner && (await ownerCommand(cmd, arg, chatId))) return Response.json({ ok: true });

    if (!owner && !(await hasAccess(from.id))) {
      if (!hasStore()) {
        await send(chatId, "O Cool Moms Club ainda está sendo configurado. Tente de novo em breve.");
        await send(ownerId(), `⚠️ ${esc(fullName(from))} tentou entrar, mas o banco de assinantes (Upstash Redis) ainda não está configurado.`);
        return Response.json({ ok: true });
      }
      const m = await getMember(from.id);
      if (m?.status === "active" && m.expiresAt && m.expiresAt <= Date.now()) {
        await saveMember({ ...m, status: "expired" });
      }
      if (m?.status === "removed" && cmd !== "/start") {
        await send(chatId, "Seu acesso ao Cool Moms Club foi encerrado. Mande /start para pedir de novo.");
        return Response.json({ ok: true });
      }
      await requestAccess(from, chatId);
      return Response.json({ ok: true });
    }

    // Tem acesso: dona ou assinante ativa.
    if (cmd === "/start") {
      await welcome(chatId, from.first_name);
      await sendWorkout(chatId, dayKeyFor());
    } else if (cmd === "/hoje") {
      await sendWorkout(chatId, dayKeyFor());
    } else if (cmd === "/dia" && isDayKey(arg)) {
      await sendWorkout(chatId, arg);
    } else if (cmd === "/semana" || cmd === "/dia") {
      await send(chatId, weekText());
    } else if (cmd === "/comunidade") {
      if (!communityId()) {
        await send(chatId, "O grupo do Cool Moms Club ainda está sendo preparado. Assim que estiver pronto, você recebe o convite. 💚");
      } else if (owner) {
        await send(chatId, "Você é a dona do grupo. 😉 As assinantes recebem o convite ao serem aprovadas, ou mandando /comunidade.");
      } else {
        const r = await inviteToCommunity(from.id, from.first_name || "");
        if (r === "ja_no_grupo") await send(chatId, "Você já está no grupo do Cool Moms Club. 💚");
        if (r === "erro") await send(chatId, "Não consegui gerar o convite agora. Já avisei a administradora. 💚");
      }
    } else if (cmd === "/assinatura" && !owner) {
      const m = await getMember(from.id);
      const left = m?.expiresAt ? Math.ceil((m.expiresAt - Date.now()) / DAY_MS) : 0;
      await send(chatId, `Sua assinatura vale até ${fmtDate(m?.expiresAt)} (${left} dia${left === 1 ? "" : "s"}).`);
    } else {
      await send(chatId, owner ? `${HELP}\n\nAdministração: /assinantes, /renovar &lt;id&gt;, /remover &lt;id&gt;, /convidar &lt;id&gt;` : `${HELP}\n/assinatura: até quando vale o seu acesso`);
    }
  } catch (err) {
    // 200 mesmo com erro, para o Telegram não reenviar a mesma mensagem sem parar.
    console.error(err);
  }
  return Response.json({ ok: true });
}
