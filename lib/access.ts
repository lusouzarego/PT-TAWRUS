import { createHmac, timingSafeEqual } from "node:crypto";
import { getMember, isActive } from "./store";

/** A dona do bot (TELEGRAM_CHAT_ID): sempre tem acesso e aprova os outros. */
export const ownerId = () => Number(process.env.TELEGRAM_CHAT_ID || 0);
export const isOwner = (id: number) => ownerId() !== 0 && id === ownerId();

export async function hasAccess(id: number): Promise<boolean> {
  return isOwner(id) || isActive(await getMember(id));
}

export type WebAppUser = { id: number; first_name?: string; last_name?: string; username?: string };

/**
 * Confere a assinatura do initData que o Telegram entrega ao Mini App e devolve o id
 * de quem abriu o timer. https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function userFromInitData(initData: string | null, maxAgeSec = 24 * 60 * 60): number | null {
  return webAppUser(initData, maxAgeSec)?.id ?? null;
}

/** Usuária do Mini App, se o initData for válido (assinado pelo bot e recente). */
export function webAppUser(initData: string | null, maxAgeSec = 24 * 60 * 60): WebAppUser | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const dataCheck = [...params.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(dataCheck).digest("hex");
  const a = Buffer.from(expected, "hex"), b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const authDate = Number(params.get("auth_date") || 0);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;
  try {
    const user = JSON.parse(params.get("user") || "null") as WebAppUser | null;
    return user?.id ? user : null;
  } catch {
    return null;
  }
}
