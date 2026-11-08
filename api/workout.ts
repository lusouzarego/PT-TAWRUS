// Usado pelo Mini App: GET /api/workout?day=qui (sem day = hoje).
import { buildWorkout, dayKeyFor, isDayKey } from "../lib/workout";

export function GET(request: Request): Response {
  const param = new URL(request.url).searchParams.get("day");
  const day = isDayKey(param) ? param : dayKeyFor();
  return Response.json(buildWorkout(day), {
    headers: { "cache-control": "no-store" },
  });
}
