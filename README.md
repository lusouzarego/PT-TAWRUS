# PT Tawrus · Treino do dia no Telegram

Bot de Telegram que **todo dia às 5h** (horário da Itália) manda o treino do dia, com as
imagens dos exercícios e um botão que abre um **timer de 40 s** dentro do próprio Telegram.

Treinos em casa: funcional, Pilates Mat e sculpt com peso leve, no máximo 1 hora.

## Como funciona

```
05:00 Itália  Vercel Cron ──▶ /api/cron ──▶ Telegram: fotos + resumo + botão "▶️ Abrir timer"
                                                              │
                                    Mini App (public/index.html) ◀┘
                                    timer 40s · som · vibração · tela acesa
```

| Peça | Arquivo | O que faz |
|---|---|---|
| Catálogo | `lib/exercises.ts` + `lib/instagram.generated.ts` | 74 exercícios da sua pasta "Exercícios" do Instagram + aquecimento, alongamento e Pilates de core |
| Plano da semana | `lib/plan.ts` | Foco de cada dia, aquecimento, circuito, rodadas e alongamento |
| Envio diário | `api/cron.ts` | Agendado às 03:00 e 04:00 UTC; só envia o que cair às 05:00 em Roma (resolve horário de verão) |
| Comandos | `api/webhook.ts` | `/start`, `/hoje`, `/semana`, `/dia qui` |
| Timer | `public/index.html` | Mini App do Telegram com o timer |

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

### Timer (Mini App)

- **▶** inicia os 40 s. Bipes nos últimos 3 segundos e um alarme no fim, que **para sozinho**
  e já deixa o próximo exercício pronto para você apertar ▶ de novo.
- **Modo contínuo** (opcional): descansa 20 s e começa o próximo exercício sozinho.
- **Como fazer cada exercício:** 35 exercícios têm fotos de demonstração que se alternam
  (1 · início → 2 · fim) e o passo a passo aberto. Os que não têm foto abrem direto o reel
  do Instagram. Todos têm um botão **▶️ YouTube** com a busca do vídeo explicativo.
- O timer fica fixo no rodapé, então dá para ver as fotos e apertar ▶ sem rolar a tela.
- **🎬 Vídeo salvo** abre o reel do Instagram ali mesmo, sem sair do timer (o vídeo continua
  tocando enquanto o timer roda). Também tem o passo a passo e os outros vídeos que você
  salvou do mesmo exercício.
- Vibra no fim (haptic do Telegram), mantém a tela acesa durante o exercício e permite
  ver o treino de outros dias.
- ⚠️ No iPhone o som respeita a chave de silencioso. A vibração funciona mesmo assim.

## Suas referências do Instagram

A pasta "Exercícios" dos seus salvos (99 posts, 336 exercícios) foi exportada para
`data/instagram-exercicios.json`. O script `npm run importar` agrupa as variações de cada
exercício e gera `lib/instagram.generated.ts` com nome, dica, passo a passo, equipamento e os
links dos reels.

- Exercícios de academia (leg press, polia, máquinas, spinning…) ficam de fora: o treino é em casa.
- Kettlebell vira halter; banco, sofá e step viram cadeira.
- Para atualizar: exporte de novo, substitua o JSON e rode `npm run importar`.

Na mensagem das 5h, o nome de cada exercício é um link para o reel. No timer, o vídeo abre
dentro do próprio Mini App. Se um reel não permitir incorporação, use "Abrir no Instagram".

Rode `npm run semana` para ver a semana inteira e conferir se todos os ids existem.

## Colocar no ar

O projeto `pt-tawrus` já está na Vercel, ligado a este repositório (branch `main`).

1. **Criar o bot:** no Telegram, fale com [@BotFather](https://t.me/BotFather), mande `/newbot`,
   escolha um nome (ex.: PT Tawrus) e um usuário terminado em `bot`. Guarde o token.
2. **Variáveis na Vercel:** abra o projeto, vá em *Settings → Environment Variables* e adicione:
   - `TELEGRAM_BOT_TOKEN`: o token do BotFather
   - `CRON_SECRET`: uma senha longa que você inventa (só letras e números)

   Depois vá em *Deployments*, abra os três pontinhos do último deploy e clique em **Redeploy**.
3. **Ligar o bot:** abra no navegador
   `https://<seu-projeto>.vercel.app/api/setup?key=<CRON_SECRET>`.
   Deve aparecer "✅ Bot ligado".
4. **Seu chat id:** mande `/start` para o bot. Ele responde com um número. Adicione
   `TELEGRAM_CHAT_ID` com esse número na Vercel e faça **Redeploy** de novo.
5. **Testar:** mande `/hoje` para o bot e toque em "▶️ Abrir timer do treino".

Pronto: às 05:00 (Itália) todo dia o treino chega sozinho, inclusive na troca de horário de
verão/inverno. No plano gratuito (Hobby) da Vercel o envio pode chegar em qualquer minuto
entre 05:00 e 05:59. No plano Pro chega no minuto exato.

### Fotos de demonstração

As fotos vêm da [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), que é
domínio público. O mapa entre os nossos exercícios e os de lá fica em `lib/demos.ts`. Para
adicionar um exercício: coloque no mapa, rode `npm run baixar-demos` e depois
`python3 scripts/juntar-demos.py` (gera a imagem lado a lado usada no álbum das 5h).

## Desenvolvimento

```bash
npm install
npm run typecheck   # checa os tipos
npm run importar    # regenera o catálogo a partir do JSON do Instagram
npm run semana      # imprime o plano da semana (e valida os ids)
npm run enviar-hoje -- qui   # manda o treino de quinta agora (precisa das variáveis)
npx vercel dev      # roda API + Mini App localmente
```

## Próximas ideias

- Encaminhar um reel novo para o bot e ele adicionar ao catálogo.
- Rodízio de exercícios entre semanas (variações A/B) para não repetir sempre o mesmo.
- Registrar treinos feitos (✅ no fim do timer) e mandar um resumo semanal no domingo.
