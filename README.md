# Cool Moms Club · Treino do dia no Telegram

_Projeto PT Tawrus (repositório PT-TAWRUS, Vercel pt-tawrus, bot @pt_tawrus_bot)._

Bot de Telegram que **todo dia às 5h (horário da Itália)** manda o treino do dia, com as
ilustrações dos exercícios e um botão que abre um **timer de 40 s** dentro do próprio Telegram.

Treinos em casa: funcional, Pilates Mat e sculpt com peso leve, no máximo 1 hora.

> ⚠️ **Este repositório é público.** Nunca coloque aqui o valor do token do bot, do chat id
> ou do `CRON_SECRET`. Os valores ficam só na Vercel e no seu arquivo privado de acessos.

---

## Acessos e contas

| O quê | Onde | Observação |
|---|---|---|
| Bot do Telegram | [@pt_tawrus_bot](https://t.me/pt_tawrus_bot) (nome exibido: "Cool Moms Club") | Criado no [@BotFather](https://t.me/BotFather). Para gerar um token novo: `/mybots` → Cool Moms Club → *API Token* → *Revoke* |
| Código | [github.com/lusouzarego/PT-TAWRUS](https://github.com/lusouzarego/PT-TAWRUS) | Branch `main` = versão no ar |
| Hospedagem | Vercel → projeto **pt-tawrus** (conta lusouzarego, plano Hobby) | Publica sozinho a cada push na `main` |
| Site / timer | [pt-tawrus.vercel.app](https://pt-tawrus.vercel.app) | O Mini App do timer |
| Webhook do bot | `https://pt-tawrus.vercel.app/api/webhook` | Já registrado no Telegram |
| Ilustrações | Canva → design **"Página de exercícios do app Tawrus"** (68 páginas) | Personagem de referência no Canva: `MAHaZrNo8IY` (camiseta Cool Moms Club, legging marrom, tênis branco sem marca) |

### Variáveis de ambiente (Vercel)

Ficam em **Vercel → pt-tawrus → Settings → Environment Variables**
(atalho: `vercel.com/lusouzaregos-projects/pt-tawrus/settings/environment-variables`),
no ambiente **Production**. Depois de mudar qualquer uma, faça **Deployments → ⋯ → Redeploy**.

| Key | Obrigatória | Value (onde encontrar) |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | sim | Token do @pt_tawrus_bot, dado pelo @BotFather. **Valor no arquivo privado de acessos.** |
| `TELEGRAM_CHAT_ID` | sim | Seu chat id no Telegram (o bot responde com ele quando você manda `/start`). **Valor no arquivo privado de acessos.** |
| `CRON_SECRET` | sim | Senha que você inventou ao configurar. Protege o envio das 5h e o link `/api/setup`. **Anote no arquivo privado de acessos.** |
| `APP_URL` | não | Se vazio, usa `https://pt-tawrus.vercel.app` automaticamente |
| `TELEGRAM_WEBHOOK_SECRET` | não | Se vazio, é calculado a partir do token |
| `PRECO_MENSAL` | não | Valor mostrado na assinatura. Padrão: `€9,90` |
| `PAGAMENTO_SATISPAY` | recomendada | Seu número/ID do Satispay, mostrado para quem pede acesso. **Valor só na Vercel** |
| `PAGAMENTO_IBAN` | recomendada | Seu IBAN para transferência. **Valor só na Vercel** |
| `PAGAMENTO_TITULAR` | recomendada | Nome do titular da conta. **Valor só na Vercel** |
| `COMUNIDADE_CHAT_ID` | opcional | ID do grupo da comunidade no Telegram (mande `/id` dentro do grupo). Liga o "Compartilhar na comunidade" do check-in |
| `KV_REST_API_URL` e `KV_REST_API_TOKEN` | sim, para assinaturas | Criadas automaticamente ao conectar o **Upstash Redis** (Vercel → Storage). Guardam os assinantes |

Se esquecer o `CRON_SECRET`: crie um novo na Vercel (Secret não pode ser lido de volta), faça Redeploy e pronto.

---

## Como funciona

```
05:00 Itália  Vercel Cron ──▶ /api/cron ──▶ Telegram: álbum de ilustrações + resumo + botão "▶️ Abrir timer"
                                                                   │
                                         Mini App (public/index.html) ◀┘
                                         timer 40s · som · vibração · tela acesa
```

| Peça | Arquivo | O que faz |
|---|---|---|
| Catálogo | `lib/exercises.ts` + `lib/instagram.generated.ts` | 74 exercícios da pasta "Exercícios" do Instagram + aquecimento, alongamento e Pilates de core |
| Plano da semana | `lib/plan.ts` | Foco de cada dia, aquecimento, circuito, rodadas e alongamento |
| Ilustrações | `public/img/ilustracoes/` + `data/ilustracoes.json` | 68 ilustrações da personagem com a roupa Cool Moms Club (1 · início → 2 · fim). A versão antiga (top preto) está listada em `data/ilustracoes-v1.json` |
| Envio diário | `api/cron.ts` (03:00 UTC) + `api/cron-inverno.ts` (04:00 UTC) + `vercel.json` | Só envia o que cair às 05:00 em Roma (resolve o horário de verão). Ver em Vercel → Settings → Cron Jobs |
| Comandos e assinatura | `api/webhook.ts` + `lib/store.ts` + `lib/subscriptions.ts` | Acesso por assinatura com aprovação da dona (ver seção *Assinaturas*) |
| Ligar o bot | `api/setup.ts` | `pt-tawrus.vercel.app/api/setup?key=<CRON_SECRET>` registra webhook e comandos |
| Timer | `public/index.html` | Mini App do Telegram |

### Semana

| Dia | Foco | Formato |
|---|---|---|
| Segunda 💪 | Braços & ombros (sculpt) | 8 exercícios × 3 rodadas |
| Terça 🦵 | Pernas & posterior | 8 × 3 |
| Quarta 🔥 | Total body funcional | 8 × 3 |
| Quinta 🍑 | Glúteos | 8 × 3 |
| Sexta 🧘‍♀️ | Pilates Mat: core & postura | 10 × 2 |
| Sábado ✨ | Pilates sculpt: glúteos & braços | 8 × 2 |
| Domingo 🌿 | Descanso ativo: mobilidade | 8 × 1 |

Cada treino dura ~30–35 min (aquecimento + circuito + alongamento, 40 s de exercício e
20 s de transição). Para alongar, aumente `rounds` em `lib/plan.ts`. Com 4 rodadas fica em ~40 min.

No plano gratuito (Hobby) da Vercel o envio pode chegar em qualquer minuto entre 05:00 e 05:59.

### Timer (Mini App)

- **▶** inicia os 40 s. Bipes nos últimos 3 segundos e, no fim, o som do PT Tawrus (sino de ringue +
  batida, `public/sons/pt-tawrus.mp3`); **para sozinho** e deixa o próximo exercício pronto.
- **Modo contínuo** (opcional): descansa 20 s e começa o próximo sozinho.
- Cada exercício mostra a **ilustração da personagem** e a **ficha técnica** (`lib/tecnica.ts`):
  **1 · Posição inicial** e **2 · Movimento** (os mesmos números dos quadros da ilustração),
  **⚠️ Atenção** (ângulos, ombros, lombar) e **🌬️ Respiração**.
- **Sem vídeos externos** no app nem no bot (direitos autorais). Os reels do Instagram ficam só
  como referência interna em `data/instagram-exercicios.json`.
- **Vídeos próprios:** grave o vídeo curto do exercício (só a execução, de preferência sem som,
  MP4 vertical ou horizontal, até ~5 MB), salve em `public/videos/<id>.mp4` e adicione
  `"<id>": "/videos/<id>.mp4"` em `data/videos.json`. O timer passa a mostrar o vídeo em loop,
  com o botão **🖼️ Ver ilustração**.
- Timer fixo no rodapé, vibração no fim e tela acesa durante o exercício.
- ⚠️ No iPhone o som respeita a chave de silencioso. A vibração funciona mesmo assim.

---

## Assinaturas

**Cool Moms Club**: comunidade de mães brasileiras na Itália. Assinatura de **€9,90 por mês**,
paga por **Satispay** ou **IBAN**, com **aprovação manual** da dona pelo Telegram.

1. A pessoa manda `/start` → recebe a apresentação, o preço, os dados de pagamento (das variáveis
   `PAGAMENTO_*`) e o aviso de privacidade.
2. Ela paga e **envia a foto ou o PDF do comprovante no bot** → a dona recebe o comprovante
   encaminhado com **✅ Aprovar 30 dias** / **❌ Recusar**.
3. Aprovada, a pessoa recebe boas-vindas, o treino de hoje e o timer. Pode usar `/hoje`, `/semana`,
   `/dia`, `/assinatura` e o botão 🏋️ Timer. O envio automático das 5h é só da dona.
4. 3 dias antes do vencimento ela recebe um lembrete. No vencimento o acesso pausa e a dona recebe
   **🔁 Renovar 30 dias** (renovar soma 30 dias ao que ainda faltava).
5. Comandos da dona: `/assinantes`, `/renovar <id>`, `/remover <id>`.

Ninguém vê reels do Instagram nem links do YouTube (conteúdo de outros criadores): só as
ilustrações, a ficha técnica e, no futuro, os vídeos próprios. O timer só abre pelo Telegram, para quem tem acesso (confere o `initData` assinado).

**Banco de assinantes:** Vercel → pt-tawrus → **Storage** → **Create Database** → **Upstash
(Redis)** → plano gratuito → conectar ao projeto → Redeploy. Sem ele, quem não é a dona recebe
"em configuração" e a dona é avisada.

## Check-in do treino

No fim do treino, a tela "Treino concluído" tem **📷 Tirar foto agora** (abre a câmera frontal
direto) e **🖼️ Escolher da galeria**. Com a foto, o timer monta um card (foto + "✅ TREINO CONCLUÍDO"
+ treino + data + selo COOL MOMS CLUB). **↺ Trocar a foto** volta para essa escolha.

- **💚 Compartilhar com o Cool Moms Club:** o bot manda o card na conversa privada dela e posta no
  grupo (`COMUNIDADE_CHAT_ID`) com "Fulana concluiu o treino de hoje! Mandem um ❤️🔥". As reações
  são as do próprio Telegram. Se o grupo ainda não estiver ligado, o card vai só para a conversa e
  o app avisa.
- **🔒 Enviar só pra mim:** só a conversa privada (diário de treinos).
- Nos dois casos aparece a contagem "🔥 Nº treino concluído" (guardada no Redis, uma vez por dia).
  Se o envio falhar, o app mostra o motivo na própria tela.

**Dias feitos:** ao terminar o último exercício, o dia fica marcado na semana (✓ e riscado nos botões
Seg…Dom). A marcação fica na nuvem do Telegram de cada pessoa (CloudStorage), então vale em qualquer
aparelho, e zera na semana seguinte. Abrir um dia feito mostra a tela de concluído; **↺ Reabrir o
treino** começa de novo.

**Ligar a comunidade:** crie um grupo no Telegram → adicione o @pt_tawrus_bot como **administrador**
→ mande `/id` no grupo → coloque o número em `COMUNIDADE_CHAT_ID` na Vercel → Redeploy.
No grupo o bot não responde às conversas, só posta os check-ins.

## Manutenção

### Se o bot parar de responder
1. Confira as variáveis na Vercel e faça Redeploy.
2. Abra `https://pt-tawrus.vercel.app/api/setup?key=<CRON_SECRET>` — deve aparecer "✅ Bot ligado".

### Se o token vazar ou você trocar o token
1. No @BotFather: `/mybots` → Cool Moms Club → *API Token* → *Revoke current token*.
2. Atualize `TELEGRAM_BOT_TOKEN` na Vercel e faça Redeploy.
3. Abra o link `/api/setup?key=<CRON_SECRET>` de novo.

### Referências do Instagram
A pasta "Exercícios" dos salvos (99 posts, 336 exercícios) está em `data/instagram-exercicios.json`.
`npm run importar` gera `lib/instagram.generated.ts`. Exercícios de academia ficam de fora;
kettlebell vira halter; banco, sofá e step viram cadeira.

### Ilustração para um exercício novo
Gere no Canva com a personagem de referência (`MAHaZrNo8IY`), salve o JPG em
`public/img/ilustracoes/<id>.jpg` e adicione a linha em `data/ilustracoes.json`.

### Som de notificação no Telegram
O mesmo som (`public/sons/pt-tawrus.mp3`, 4,6 s, composição original) pode ser o som de notificação
da conversa: segure o áudio que o bot mandou → *Salvar para notificações* → perfil do bot →
Notificações → Som → "PT Tawrus".

## Desenvolvimento

```bash
npm install
npm run typecheck            # checa os tipos
npm run importar             # regenera o catálogo a partir do JSON do Instagram
npm run semana               # imprime o plano da semana (e valida os ids)
npm run enviar-hoje -- qui   # manda o treino de quinta agora (precisa das variáveis no ambiente)
npm run set-webhook          # registra webhook e comandos (precisa de TELEGRAM_BOT_TOKEN e APP_URL)
```

## Próximas ideias

- Encaminhar um reel novo para o bot e ele adicionar ao catálogo.
- Rodízio de exercícios entre semanas (variações A/B).
- Registrar treinos feitos e mandar um resumo semanal no domingo.
