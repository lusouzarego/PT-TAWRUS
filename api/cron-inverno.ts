// Segundo horário do envio diário (04:00 UTC = 05:00 na Itália no inverno).
// O api/cron.ts só envia quando é 05:00 em Roma, então só um dos dois manda a mensagem.
export { GET } from "./cron";
