// Check-in do treino concluído (estilo GymRats).
// POST /api/checkin  { image: "data:image/jpeg;base64,...", share: boolean, day: "qui" }
// Header X-Telegram-Init-Data: initData do Mini App (identifica e autoriza a pessoa).
//
// - Sempre: o card volta para a conversa privada da pessoa com o bot (o diário dela).
// - share=true e COMUNIDADE_CHAT_ID configurado: o card também vai para o grupo do Cool Moms Club,
//   onde as outras participantes reagem com ❤️🔥.
import { hasAccess, webAppUser } from "../lib/access";
import { week } from "../lib/plan";
import { addCheckin, hasStore } from "../lib/store";
import { TIMEZONE, isDayKey } from "../lib/workout";

const MAX_BYTES = 3_000_000;

async function sendPhoto(chatId: string | number, photo: Buffer, caption: string) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", caption);
  form.append("photo", new Blob([new Uint8Array(photo)], { type: "image/jpeg" }), "checkin.jpg");
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: "POST", body: form });
  const data = (await res.json()) as { ok: boolean; description?: string };
  if (!data.ok) throw new Error(`Telegram sendPhoto: ${data.description}`);
}

export async function POST(request: Request): Promise<Response> {
  const user = webAppUser(request.headers.get("x-telegram-init-data"));
  if (!user) return Response.json({ error: "abra_pelo_telegram" }, { status: 401 });
  if (!(await hasAccess(user.id))) return Response.json({ error: "sem_acesso" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { image?: string; share?: boolean; day?: string } | null;
  const m = body?.image?.match(/^data:image\/(jpeg|png);base64,(.+)$/);
  if (!m) return Response.json({ error: "imagem_invalida" }, { status: 400 });
  const photo = Buffer.from(m[2], "base64");
  if (photo.length > MAX_BYTES) return Response.json({ error: "imagem_grande" }, { status: 413 });

  const plan = isDayKey(body?.day) ? week[body!.day as keyof typeof week] : null;
  const what = plan ? `${plan.name} · ${plan.focus}` : "Treino do dia";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
  // A contagem é um extra: se o banco falhar, o card vai do mesmo jeito.
  const total = hasStore() ? await addCheckin(user.id, today).catch((e) => (console.error(e), 0)) : 0;
  const streak = total ? `\n🔥 ${total}º treino concluído` : "";

  try {
    await sendPhoto(user.id, photo, `✅ Check-in: ${what}${streak}\n\nSó você vê esta mensagem. 💚`);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "telegram_privado" }, { status: 502 });
  }

  const group = process.env.COMUNIDADE_CHAT_ID;
  let shared = false;
  if (body?.share && group) {
    const name = user.first_name || "Uma cool mom";
    try {
      await sendPhoto(group, photo, `💪 ${name} concluiu o treino de hoje!\n${what}${streak}\n\nMandem um ❤️🔥 pra ela!`);
      shared = true;
    } catch (e) {
      // O card já está na conversa dela; só o grupo falhou (ex.: bot fora do grupo ou sem permissão).
      console.error(e);
    }
  }
  return Response.json({ ok: true, total, shared, community: Boolean(group) });
}
