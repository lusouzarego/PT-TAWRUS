// Mostra o plano da semana no terminal e valida os ids: npm run semana
import { DAY_ORDER } from "../lib/plan";
import { buildWorkout, workoutText } from "../lib/workout";

for (const day of DAY_ORDER) {
  console.log(workoutText(buildWorkout(day)).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));
  console.log("─".repeat(40));
}
