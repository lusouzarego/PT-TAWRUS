// Armazenamento dos assinantes no Upstash Redis (via REST, sem dependências).
// Na Vercel: Storage → Create → Upstash Redis → conectar ao projeto pt-tawrus.
// A integração cria KV_REST_API_URL e KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_*).
// Sem essas variáveis, usa memória (só para testes locais; não persiste na Vercel).

export type Status = "pending" | "active" | "expired" | "rejected" | "removed";

export type Member = {
  id: number;
  name: string;
  username?: string;
  status: Status;
  requestedAt: number;
  approvedAt?: number;
  /** Fim do acesso (ms desde 1970). */
  expiresAt?: number;
  /** Já recebeu o aviso de "vence em 3 dias" deste período. */
  reminded?: boolean;
};

const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasStore = () => Boolean(url() && token());

const memory = new Map<string, string>();
const memorySets = new Map<string, Set<string>>();
const mset = (k: string) => memorySets.get(k) ?? memorySets.set(k, new Set()).get(k)!;

async function redis(command: (string | number)[]): Promise<unknown> {
  if (!hasStore()) {
    const [cmd, key, value] = command as string[];
    switch (cmd) {
      case "GET": return memory.get(key) ?? null;
      case "SET": memory.set(key, value); return "OK";
      case "SADD": { const s = mset(key); const had = s.has(value); s.add(value); return had ? 0 : 1; }
      case "SMEMBERS": return [...mset(key)];
      case "SCARD": return mset(key).size;
      default: throw new Error(`memória: comando ${cmd} não suportado`);
    }
  }
  const res = await fetch(url()!, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result;
}

const key = (id: number) => `pt:member:${id}`;

export async function getMember(id: number): Promise<Member | null> {
  const raw = (await redis(["GET", key(id)])) as string | null;
  return raw ? (JSON.parse(raw) as Member) : null;
}

export async function saveMember(m: Member): Promise<void> {
  await redis(["SET", key(m.id), JSON.stringify(m)]);
  await redis(["SADD", "pt:members", String(m.id)]);
}

export async function listMembers(): Promise<Member[]> {
  const ids = (await redis(["SMEMBERS", "pt:members"])) as string[];
  const all = await Promise.all(ids.map((id) => getMember(Number(id))));
  return all.filter((m): m is Member => Boolean(m));
}

export const DAY_MS = 24 * 60 * 60 * 1000;
export const PERIOD_DAYS = 30;

/** Aprova ou renova por 30 dias, somando ao que ainda falta se estiver ativo. */
export function extend(m: Member, now = Date.now()): Member {
  const base = m.status === "active" && m.expiresAt && m.expiresAt > now ? m.expiresAt : now;
  return { ...m, status: "active", approvedAt: m.approvedAt ?? now, expiresAt: base + PERIOD_DAYS * DAY_MS, reminded: false };
}

export const isActive = (m: Member | null, now = Date.now()) =>
  Boolean(m && m.status === "active" && m.expiresAt && m.expiresAt > now);

// ── Check-ins (treinos concluídos) ────────────────────────────────────────
/** Registra o check-in do dia (data no fuso da Itália) e devolve o total de treinos feitos. */
export async function addCheckin(id: number, date: string): Promise<number> {
  await redis(["SADD", `pt:checkins:${id}`, date]);
  return Number(await redis(["SCARD", `pt:checkins:${id}`]));
}
