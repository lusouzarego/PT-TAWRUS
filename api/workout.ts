// Usado pelo Mini App: GET /api/workout?day=qui (sem day = hoje).
// Só responde para quem abriu o timer pelo Telegram e tem acesso (dona ou assinante ativa).
// O Mini App manda o initData assinado pelo Telegram no header X-Telegram-Init-Data.
import { hasAccess, isOwner, userFromInitData } from "../lib/access";
import { buildWorkout, dayKeyFor, isDayKey, withoutInstagram } from "../lib/workout";

export async function GET(request: Request): Promise<Response> {
  const userId = userFromInitData(request.headers.get("x-telegram-init-data"));
  if (!userId) {
    return Response.json({ error: "abra_pelo_telegram" }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  if (!(await hasAccess(userId))) {
    return Response.json({ error: "sem_acesso" }, { status: 403, headers: { "cache-control": "no-store" } });
  }
  const param = new URL(request.url).searchParams.get("day");
  const day = isDayKey(param) ? param : dayKeyFor();
  const workout = buildWorkout(day);
  return Response.json(isOwner(userId) ? workout : withoutInstagram(workout), {
    headers: { "cache-control": "no-store" },
  });
}
