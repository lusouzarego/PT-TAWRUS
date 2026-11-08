// Alternativa local ao /api/setup: npm run set-webhook
// Precisa de TELEGRAM_BOT_TOKEN e APP_URL no ambiente.
import { setupBot } from "../lib/telegram";

setupBot().then((url) => console.log(`Webhook configurado em ${url}`));
