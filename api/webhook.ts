// Webhook do Telegram com controle de acesso por assinatura.
//
// Dona (TELEGRAM_CHAT_ID): acesso total + aprova pedidos.
// Outras pessoas: /start envia um pedido de acesso; a dona recebe botões ✅ Aprovar / ❌ Recusar.
// Aprovadas têm 30 dias de acesso (/hoje, /semana, /dia, timer). O cron avisa 3 dias antes
// e pausa no vencimento; a dona renova com um toque.
//
// Comandos da dona: /assinantes, /renovar <id>, /remover <id>.
import { hasAccess, isOwner, ownerId } from "../lib/access";
import { appUrl, sendWorkout, tg, webhookSecret, weekText } from "../lib/telegram";
import { dayKeyFor, isDayKey } from "../lib/workout";
import { DAY_MS, extend, getMember, hasStore, isActive, listMembers, saveMember, type Member } from "../lib/store";

type User = { id: number; first_name?: string; last_name?: string; username?: string };
type Update = {
  message?: { chat: { id: number; type?: string }; from?: User; text?: string };
  callback_query?: { id: string; from: User; data?: string; message?: { chat: { id: number }; message_id: number } };
};

const HELP =
  "Comandos:\n" +
  "/hoje: treino de hoje\n" +
  "/semana: plano da semana\n" +
  "/dia qui: treino de um dia (seg, ter, qua, qui, sex, sab, dom)\n\n" +
  "O botão 🏋️ Timer, ao lado do campo de mensagem, abre o timer a qualquer momento.";

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
      `com timer de 40 s por exercício.\n\n${DISCLAIMER}\n\nAqui vai o treino de hoje 👇\n\n${HELP}`,
    { reply_markup: { inline_keyboard: [[{ text: "▶️ Abrir timer", web_app: { url: appUrl() } }]] } },
  );
}

// ── Pedido de acesso ──────────────────────────────────────────────────────
async function requestAccess(from: User, chatId: number) {
  const existing = await getMember(from.id);
  if (existing?.status === "pending") {
    await send(chatId, "⏳ Seu pedido de acesso já foi enviado. Você recebe uma mensagem assim que for aprovado.");
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
      ? "🔁 Sua assinatura venceu. Avisei a administradora que você quer renovar; assim que for confirmado, o acesso volta."
      : "👋 Oi! O Cool Moms Club é por assinatura. Seu pedido de acesso foi enviado e você recebe uma mensagem assim que for aprovado.",
  );
  await send(
    ownerId(),
    `${renewal ? "🔁 Pedido de renovação" : "🔔 Novo pedido de acesso"}\n${who(m)}`,
    { reply_markup: renewal ? renewButton(m.id) : approveButtons(m.id) },
  );
}

// ── Botões da dona ────────────────────────────────────────────────────────
async function handleCallback(cb: NonNullable<Update["callback_query"]>) {
  const answer = (text: string) => tg("answerCallbackQuery", { callback_query_id: cb.id, text });
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
    if (action === "ap") {
      await welcome(m.id, m.name.split(" ")[0]);
      await sendWorkout(m.id, dayKeyFor(), { instagram: false });
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
  if (cmd === "/renovar" || cmd === "/remover") {
    const m = arg ? await getMember(Number(arg)) : null;
    if (!m) {
      await send(chatId, `Use ${cmd} &lt;id&gt; (veja os ids em /assinantes).`);
      return true;
    }
    if (cmd === "/renovar") {
      const u = extend(m);
      await saveMember(u);
      await send(chatId, `✅ ${who(u)} renovado até ${fmtDate(u.expiresAt)}`);
      await send(m.id, `🎉 Assinatura renovada! Acesso válido até ${fmtDate(u.expiresAt)}.`);
    } else {
      await saveMember({ ...m, status: "removed" });
      await send(chatId, `⚫️ ${who(m)} removido.`);
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
    if (!msg?.text || !msg.from) return Response.json({ ok: true });
    const chatId = msg.chat.id;
    const from = msg.from;
    const [rawCmd, arg] = msg.text.trim().toLowerCase().split(/\s+/);
    const cmd = rawCmd.split("@")[0]; // em grupos: "/hoje@pt_tawrus_bot"
    const owner = isOwner(from.id);

    if (cmd === "/id") {
      await send(chatId, `Seu id: <code>${from.id}</code>`);
      return Response.json({ ok: true });
    }
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
    const opts = { instagram: owner };
    if (cmd === "/start") {
      await welcome(chatId, from.first_name);
      await sendWorkout(chatId, dayKeyFor(), opts);
    } else if (cmd === "/hoje") {
      await sendWorkout(chatId, dayKeyFor(), opts);
    } else if (cmd === "/dia" && isDayKey(arg)) {
      await sendWorkout(chatId, arg, opts);
    } else if (cmd === "/semana" || cmd === "/dia") {
      await send(chatId, weekText());
    } else if (cmd === "/assinatura" && !owner) {
      const m = await getMember(from.id);
      const left = m?.expiresAt ? Math.ceil((m.expiresAt - Date.now()) / DAY_MS) : 0;
      await send(chatId, `Sua assinatura vale até ${fmtDate(m?.expiresAt)} (${left} dia${left === 1 ? "" : "s"}).`);
    } else {
      await send(chatId, owner ? `${HELP}\n\nAdministração: /assinantes, /renovar &lt;id&gt;, /remover &lt;id&gt;` : `${HELP}\n/assinatura: até quando vale o seu acesso`);
    }
  } catch (err) {
    // 200 mesmo com erro, para o Telegram não reenviar a mesma mensagem sem parar.
    console.error(err);
  }
  return Response.json({ ok: true });
}
