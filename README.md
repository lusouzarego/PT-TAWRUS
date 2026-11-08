# PT Tawrus · Treino do dia no Telegram

Bot de Telegram que **todo dia às 5h (horário da Itália)** manda o treino do dia, com as
ilustrações dos exercícios e um botão que abre um **timer de 40 s** dentro do próprio Telegram.

Treinos em casa: funcional, Pilates Mat e sculpt com peso leve, no máximo 1 hora.

> ⚠️ **Este repositório é público.** Nunca coloque aqui o valor do token do bot, do chat id
> ou do `CRON_SECRET`. Os valores ficam só na Vercel e no seu arquivo privado de acessos.

---

## Acessos e contas

| O quê | Onde | Observação |
|---|---|---|
| Bot do Telegram | [@pt_tawrus_bot](https://t.me/pt_tawrus_bot) (nome: "PT - Tawrus") | Criado no [@BotFather](https://t.me/BotFather). Para gerar um token novo: `/mybots` → PT - Tawrus → *API Token* → *Revoke* |
| Código | [github.com/lusouzarego/PT-TAWRUS](https://github.com/lusouzarego/PT-TAWRUS) | Branch `main` = versão no ar |
| Hospedagem | Vercel → projeto **pt-tawrus** (conta lusouzarego, plano Hobby) | Publica sozinho a cada push na `main` |
| Site / timer | [pt-tawrus.vercel.app](https://pt-tawrus.vercel.app) | O Mini App do timer |
| Webhook do bot | `https://pt-tawrus.vercel.app/api/webhook` | Já registrado no Telegram |
| Ilustrações | Canva → design **"Página de exercícios do app Tawrus"** (68 páginas) | Personagem de referência no Canva: `MAHaVxgNAsk` |

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
| Ilustrações | `public/img/ilustracoes/` + `data/ilustracoes.json` | 68 ilustrações da personagem (1 · início → 2 · fim) |
| Envio diário | `api/cron.ts` + `vercel.json` | Agendado às 03:00 e 04:00 UTC; só envia o que cair às 05:00 em Roma (resolve o horário de verão) |
| Comandos | `api/webhook.ts` | `/start`, `/hoje`, `/semana`, `/dia qui` |
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

- **▶** inicia os 40 s. Bipes nos últimos 3 segundos e alarme no fim; **para sozinho** e deixa
  o próximo exercício pronto.
- **Modo contínuo** (opcional): descansa 20 s e começa o próximo sozinho.
- Cada exercício mostra a **ilustração da personagem**, o **passo a passo** e os botões
  **🎬 Vídeo salvo** (reel do Instagram), **Instagram ↗** e **▶️ YouTube**.
- Timer fixo no rodapé, vibração no fim e tela acesa durante o exercício.
- ⚠️ No iPhone o som respeita a chave de silencioso. A vibração funciona mesmo assim.

---

## Manutenção

### Se o bot parar de responder
1. Confira as variáveis na Vercel e faça Redeploy.
2. Abra `https://pt-tawrus.vercel.app/api/setup?key=<CRON_SECRET>` — deve aparecer "✅ Bot ligado".

### Se o token vazar ou você trocar o token
1. No @BotFather: `/mybots` → PT - Tawrus → *API Token* → *Revoke current token*.
2. Atualize `TELEGRAM_BOT_TOKEN` na Vercel e faça Redeploy.
3. Abra o link `/api/setup?key=<CRON_SECRET>` de novo.

### Referências do Instagram
A pasta "Exercícios" dos salvos (99 posts, 336 exercícios) está em `data/instagram-exercicios.json`.
`npm run importar` gera `lib/instagram.generated.ts`. Exercícios de academia ficam de fora;
kettlebell vira halter; banco, sofá e step viram cadeira.

### Ilustração para um exercício novo
Gere no Canva com a personagem de referência (`MAHaVxgNAsk`), salve o JPG em
`public/img/ilustracoes/<id>.jpg` e adicione a linha em `data/ilustracoes.json`.

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
