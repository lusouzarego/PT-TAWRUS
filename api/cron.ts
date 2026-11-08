// Disparado pela Vercel Cron às 03:00 UTC (aqui) e 04:00 UTC (api/cron-inverno.ts).
// 5h na Itália = 03:00 UTC no horário de verão (CEST) e 04:00 UTC no inverno (CET).
// Os dois horários são agendados e só envia o que cair às 5h em Roma.
import { sendWorkout } from "../lib/telegram";
import { TIMEZONE, dayKeyFor } from "../lib/workout";

function hourInRome(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, hour: "2-digit", hour12: false }).format(date),
  );
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const now = new Date();
  const hour = hourInRome(now);
  if (hour !== 5) return Response.json({ ok: true, skipped: true, hourInRome: hour });

  const day = dayKeyFor(now);
  await sendWorkout(process.env.TELEGRAM_CHAT_ID!, day);
  return Response.json({ ok: true, day });
}
