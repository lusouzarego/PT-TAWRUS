// Envia o treino agora (teste): npm run enviar-hoje [-- qui]
// Precisa de TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID e APP_URL no ambiente.
import { sendWorkout } from "../lib/telegram";
import { dayKeyFor, isDayKey } from "../lib/workout";

const arg = process.argv[2];
const day = isDayKey(arg) ? arg : dayKeyFor();
sendWorkout(process.env.TELEGRAM_CHAT_ID!, day).then(() => console.log(`Enviado: ${day}`));
