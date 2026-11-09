// Ficha técnica de cada exercício, escrita para acompanhar a ilustração da personagem:
// "inicio" descreve o quadro 1, "movimento" leva do quadro 1 ao quadro 2,
// "atencao" traz os pontos que mais erram e "respira" quando soltar o ar.
// É o que o timer mostra no lugar de vídeos externos.

export type Tecnica = {
  inicio: string[];
  movimento: string[];
  atencao: string[];
  respira?: string;
};

const SOLTA_NA_FORCA = "Solte o ar na fase de força e puxe o ar ao voltar.";

export const TECNICA: Record<string, Tecnica> = {
  // ── Aquecimento ─────────────────────────────────────────────────────
  "circulos-braco": {
    inicio: ["Em pé, pés na largura do quadril, joelhos destravados.", "Braços abertos na linha dos ombros (90° com o tronco), palmas para baixo."],
    movimento: ["Faça círculos pequenos (do tamanho de uma laranja) para frente.", "Na metade do tempo, inverta para trás."],
    atencao: ["Ombros longe das orelhas.", "Braços não caem abaixo da linha dos ombros."],
    respira: "Respiração solta e contínua.",
  },
  "polichinelo-sem-salto": {
    inicio: ["Em pé, pés juntos, braços ao lado do corpo."],
    movimento: ["Leve uma perna para o lado com a ponta do pé no chão enquanto os dois braços sobem em V acima da cabeça.", "Volte ao centro e repita para o outro lado, em ritmo constante."],
    atencao: ["Sem impacto: um pé sempre no chão.", "Abdômen firme, costelas fechadas quando os braços sobem."],
    respira: "Respiração solta e contínua.",
  },
  inchworm: {
    inicio: ["Em pé, incline o tronco à frente dobrando os joelhos o quanto precisar, até as mãos tocarem o chão."],
    movimento: ["Caminhe com as mãos para frente até a prancha alta: mãos sob os ombros, corpo em linha reta.", "Caminhe com as mãos de volta em direção aos pés e suba enrolando a coluna."],
    atencao: ["Na prancha, quadril na linha dos ombros (nem alto, nem caído).", "Pode dobrar os joelhos à vontade para alcançar o chão."],
    respira: "Solte o ar enquanto caminha para a prancha.",
  },
  cactus: {
    inicio: ["Em pé, braços abertos em W: cotovelos na altura dos ombros e dobrados a 90°, palmas para frente."],
    movimento: ["Feche os antebraços à frente do rosto, juntando cotovelos e mãos, sem deixar os cotovelos caírem.", "Abra de volta ao W, apertando as escápulas uma na outra."],
    atencao: ["Cotovelos sempre na altura dos ombros.", "Pescoço longo, ombros longe das orelhas."],
    respira: "Solte o ar ao fechar, puxe ao abrir.",
  },
  "marcha-joelho-alto": {
    inicio: ["Em pé, coluna alta, cotovelos dobrados a 90° como na corrida."],
    movimento: ["Suba um joelho até a altura do quadril (coxa paralela ao chão) com o braço oposto à frente.", "Desça e alterne, num ritmo de marcha animada."],
    atencao: ["Não incline o tronco para trás para subir o joelho.", "Apoie o pé de leve, sem bater."],
    respira: "Respiração solta e contínua.",
  },
  "circulos-quadril": {
    inicio: ["Em pé, pés um pouco mais abertos que o quadril, mãos na cintura, joelhos destravados."],
    movimento: ["Desenhe círculos grandes com o quadril, como se girasse um bambolê.", "Na metade do tempo, inverta o sentido."],
    atencao: ["Os ombros ficam praticamente parados, quem gira é a bacia.", "Círculos lentos e amplos."],
    respira: "Respiração solta e contínua.",
  },
  "agachamento-livre": {
    inicio: ["Em pé, pés na largura dos ombros, pontas levemente para fora.", "Braços estendidos à frente na altura dos ombros."],
    movimento: ["Leve o quadril para trás e para baixo, como se fosse sentar, até onde for confortável.", "Suba empurrando o chão com o pé inteiro e estenda o quadril no topo."],
    atencao: ["Joelhos apontam na direção dos pés (sem cair para dentro).", "Peito aberto, calcanhares no chão."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  "avanco-rotacao": {
    inicio: ["Dê um passo à frente e desça no avanço: joelho da frente a 90°, sobre o tornozelo, joelho de trás perto do chão.", "Mãos unidas à frente do peito."],
    movimento: ["Abra os braços e gire o tronco para o lado da perna da frente, olhando para a mão de trás.", "Volte ao centro, suba e troque de perna."],
    atencao: ["Quem gira é o tronco: quadril e joelho da frente ficam parados.", "Joelho da frente não passa para dentro."],
    respira: "Solte o ar ao girar.",
  },

  // ── Braços & ombros ─────────────────────────────────────────────────
  desenv: {
    inicio: ["Em pé, pés na largura do quadril, glúteo e abdômen firmes.", "Halteres na altura dos ombros, cotovelos abaixo dos punhos, palmas para frente."],
    movimento: ["Empurre os halteres para cima até os braços quase estenderem acima da cabeça.", "Desça devagar até os halteres voltarem à altura das orelhas."],
    atencao: ["Não arqueie a lombar: costelas fechadas.", "Ombros longe das orelhas no topo."],
    respira: "Solte o ar ao empurrar para cima.",
  },
  tri_coice: {
    inicio: ["Joelhos levemente dobrados, tronco inclinado à frente a ~45°, coluna neutra.", "Cotovelos colados ao corpo e dobrados a 90°, braço paralelo ao tronco."],
    movimento: ["Estenda os antebraços para trás até os braços ficarem retos e contraia o tríceps por 1 segundo.", "Volte devagar até 90°."],
    atencao: ["Só o antebraço se move: o cotovelo não desce.", "Sem balançar o halter."],
    respira: "Solte o ar ao estender.",
  },
  rosca: {
    inicio: ["Em pé, pés na largura do quadril, braços estendidos ao lado do corpo, palmas para frente."],
    movimento: ["Dobre os cotovelos levando os halteres até a altura dos ombros.", "Desça devagar até estender os braços de novo (conte 3 na descida)."],
    atencao: ["Cotovelos colados na lateral do corpo o tempo todo.", "Não balance o tronco para ajudar."],
    respira: "Solte o ar ao subir.",
  },
  elev_lat: {
    inicio: ["Em pé, halteres ao lado do corpo, cotovelos levemente dobrados (uns 15°)."],
    movimento: ["Eleve os braços para os lados até a linha dos ombros, cotovelos guiando o movimento.", "Desça devagar, sem deixar o peso cair."],
    atencao: ["Não suba acima da linha dos ombros.", "Ombros baixos, pescoço relaxado; peso leve."],
    respira: "Solte o ar ao subir.",
  },
  remada: {
    inicio: ["Joelhos levemente dobrados, quadril para trás, tronco inclinado a ~45°, coluna neutra.", "Braços estendidos, halteres abaixo dos ombros."],
    movimento: ["Puxe os halteres em direção às costelas, levando os cotovelos para trás e junto ao corpo.", "Aperte as escápulas no topo e desça devagar."],
    atencao: ["O tronco não sobe enquanto você puxa.", "Pescoço alinhado: olhe para o chão à frente dos pés."],
    respira: "Solte o ar ao puxar.",
  },
  tri_oh: {
    inicio: ["Em pé, abdômen firme, halteres atrás da cabeça com os cotovelos dobrados apontando para o teto."],
    movimento: ["Estenda os braços para cima até os halteres ficarem acima da cabeça.", "Volte dobrando só os cotovelos, devagar."],
    atencao: ["Cotovelos para frente e perto da cabeça (não abrem para os lados).", "Costelas fechadas, sem arquear a lombar."],
    respira: "Solte o ar ao estender.",
  },
  around: {
    inicio: ["Em pé, braços estendidos à frente das coxas, halteres leves, palmas para frente."],
    movimento: ["Faça um arco grande para os lados, com os braços quase estendidos, até os halteres se encontrarem acima da cabeça.", "Volte pelo mesmo arco, devagar."],
    atencao: ["Peso leve: o movimento é lento e controlado.", "Ombros longe das orelhas, sem arquear a lombar."],
    respira: "Puxe o ar ao subir, solte ao descer.",
  },
  cruc_inv: {
    inicio: ["Joelhos levemente dobrados, tronco inclinado a ~45°, coluna neutra.", "Braços pendurados sob os ombros, cotovelos levemente dobrados, palmas uma de frente para a outra."],
    movimento: ["Abra os braços para os lados até a linha dos ombros, como asas.", "Aperte as escápulas no topo e desça devagar."],
    atencao: ["O ângulo dos cotovelos não muda.", "Peso leve: quem trabalha é a parte de trás do ombro."],
    respira: "Solte o ar ao abrir.",
  },

  // ── Pernas & posterior ──────────────────────────────────────────────
  agach: {
    inicio: ["Pés na largura dos ombros, pontas levemente para fora.", "Halter na vertical junto ao peito (goblet), cotovelos para baixo."],
    movimento: ["Leve o quadril para trás e para baixo até as coxas ficarem paralelas ao chão (ou o mais fundo que mantiver a postura).", "Suba empurrando o chão com o pé inteiro."],
    atencao: ["Joelhos apontam na direção dos pés.", "Peito aberto e calcanhares no chão."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  stiff: {
    inicio: ["Em pé, pés na largura do quadril, joelhos levemente dobrados (uns 15°).", "Halteres à frente das coxas."],
    movimento: ["Empurre o quadril para trás deslizando os halteres rente às pernas até o meio da canela.", "Suba levando o quadril à frente e contraia o glúteo no topo."],
    atencao: ["Coluna reta do começo ao fim: quem dobra é o quadril.", "O ângulo do joelho não muda (não vira agachamento)."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  afundo_lat: {
    inicio: ["Pés juntos, halter na vertical junto ao peito."],
    movimento: ["Dê um passo largo para o lado e sente o quadril para trás, dobrando essa perna; a outra fica estendida.", "Empurre o chão com a perna dobrada e volte ao centro. Alterne os lados."],
    atencao: ["Joelho dobrado alinhado com o pé.", "Os dois pés apontam para frente e ficam inteiros no chão."],
    respira: "Solte o ar ao voltar ao centro.",
  },
  step_up: {
    inicio: ["De frente para uma cadeira firme (encostada na parede), halteres ao lado do corpo.", "Um pé inteiro sobre o assento, joelho a ~90°."],
    movimento: ["Incline levemente o tronco e suba empurrando o calcanhar de cima até estender a perna; o outro joelho sobe à frente.", "Desça devagar e repita. Troque de perna na metade."],
    atencao: ["A força vem da perna de cima: não dê impulso com a de baixo.", "Joelho de cima alinhado com o pé."],
    respira: "Solte o ar ao subir.",
  },
  bulgaro: {
    inicio: ["De costas para a cadeira, peito do pé de trás apoiado no assento.", "Pé da frente um passo grande à frente, halteres ao lado do corpo."],
    movimento: ["Desça reto até a coxa da frente ficar quase paralela ao chão, com o tronco levemente inclinado à frente.", "Suba empurrando o calcanhar da frente. Troque de perna na metade."],
    atencao: ["Joelho da frente alinhado com o pé.", "Quadril nivelado, sem girar."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  stiff_uni: {
    inicio: ["Em pé sobre uma perna, joelho levemente dobrado, halter na mão do lado oposto."],
    movimento: ["Incline o tronco à frente enquanto a perna livre vai para trás, até o tronco e a perna formarem uma linha quase paralela ao chão.", "Volte empurrando o chão com o calcanhar de apoio. Troque de lado na metade."],
    atencao: ["Quadril nivelado: a pelve não abre para o lado.", "Se perder o equilíbrio, apoie a mão livre numa cadeira."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  agach_pulso: {
    inicio: ["Pés na largura dos ombros, halteres apoiados nos ombros.", "Desça até o agachamento, coxas quase paralelas ao chão."],
    movimento: ["Suba só uns 10 cm e desça de novo: pulsos curtos e rítmicos lá embaixo.", "Mantenha os 40 s ali, sem subir totalmente."],
    atencao: ["Peito alto e peso nos calcanhares.", "Joelhos apontam na direção dos pés."],
    respira: "Respiração curta e contínua, sem prender o ar.",
  },
  afundo: {
    inicio: ["Em pé, pés na largura do quadril, halteres ao lado do corpo."],
    movimento: ["Dê um passo à frente e desça até os dois joelhos ficarem a 90°, o de trás perto do chão.", "Empurre o pé da frente e volte. Alterne as pernas."],
    atencao: ["Joelho da frente sobre o tornozelo, alinhado com o pé.", "Tronco reto, sem inclinar para frente."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },

  // ── Total body ──────────────────────────────────────────────────────
  afundo_combo: {
    inicio: ["Em pé, halteres ao lado do corpo, palmas para frente."],
    movimento: ["Desça no afundo (os dois joelhos a 90°) e, lá embaixo, faça uma rosca levando os halteres aos ombros.", "Desça os halteres, suba do afundo e alterne a perna."],
    atencao: ["Costelas alinhadas sobre a pelve: o tronco não inclina.", "Cotovelos colados ao corpo na rosca."],
    respira: "Solte o ar na rosca e ao subir.",
  },
  remada_combo: {
    inicio: ["Tronco inclinado a ~45°, joelhos levemente dobrados, coluna neutra, halteres pendurados."],
    movimento: ["Faça a remada levando os cotovelos para trás.", "Suba o tronco e, já em pé, faça uma rosca. Desça os halteres, incline de novo e repita."],
    atencao: ["Ombros longe das orelhas na remada.", "Não use impulso do tronco para a rosca."],
    respira: "Solte o ar ao puxar e ao subir na rosca.",
  },
  agach_combo: {
    inicio: ["Pés na largura dos ombros, halteres apoiados nos ombros, cotovelos à frente.", "Desça no agachamento."],
    movimento: ["Suba do agachamento e, sem parar, empurre os halteres acima da cabeça.", "Traga os halteres de volta aos ombros enquanto desce no próximo agachamento."],
    atencao: ["Cotovelos sob os punhos ao empurrar.", "Costelas fechadas no topo, sem arquear a lombar."],
    respira: "Solte o ar ao subir e empurrar.",
  },
  flexao_remada: {
    inicio: ["Prancha com as mãos nos halteres sob os ombros, pés mais afastados que o quadril (ou joelhos no chão)."],
    movimento: ["Faça uma flexão: cotovelos a ~45° do corpo, peito em direção ao chão.", "Lá em cima, puxe um halter até a costela, apoie e puxe o outro."],
    atencao: ["Quadril parado: não gira quando você rema.", "Corpo em linha reta, abdômen firme."],
    respira: "Solte o ar ao subir da flexão e ao remar.",
  },
  stiff_combo: {
    inicio: ["Joelhos levemente dobrados, quadril para trás, halteres no meio da canela (posição baixa do stiff)."],
    movimento: ["Mantendo o tronco inclinado, faça uma remada levando os cotovelos para trás.", "Desça os halteres, suba do stiff contraindo o glúteo e repita."],
    atencao: ["Coluna neutra em todo o movimento.", "Sem impulso: a remada é com as costas, não com o tronco."],
    respira: "Solte o ar ao puxar e ao subir.",
  },
  braco_combo: {
    inicio: ["Em pé, braços estendidos, halteres ao lado do corpo."],
    movimento: ["Faça uma rosca até os ombros.", "Gire as palmas para frente e empurre os halteres acima da cabeça. Desça pelo mesmo caminho."],
    atencao: ["Sem balançar o tronco.", "Costelas fechadas no topo; peso leve a moderado."],
    respira: "Solte o ar ao empurrar para cima.",
  },
  explosivo: {
    inicio: ["Pés na largura dos ombros, halteres nos ombros, desça no agachamento."],
    movimento: ["Suba com força e use esse impulso para empurrar os halteres acima da cabeça (thruster).", "Traga os halteres aos ombros e já desça no próximo agachamento."],
    atencao: ["Quem gera a força são as pernas: os braços só completam.", "Mantenha o ritmo sem perder a postura; descanse se precisar."],
    respira: "Solte o ar com força ao empurrar.",
  },
  swing: {
    inicio: ["Pés um pouco mais abertos que o quadril, segure um halter pela ponta com as duas mãos.", "Quadril para trás, joelhos levemente dobrados, halter entre as pernas."],
    movimento: ["Projete o quadril para frente com força, contraindo o glúteo: o halter sobe até a altura do peito.", "Deixe o halter descer entre as pernas levando o quadril para trás e repita."],
    atencao: ["A força vem do quadril, não dos braços.", "Coluna neutra na descida; não agache."],
    respira: "Solte o ar quando o quadril vai à frente.",
  },

  // ── Glúteos ─────────────────────────────────────────────────────────
  mob_quadril: {
    inicio: ["Quatro apoios: mãos sob os ombros, joelhos sob o quadril, abdômen firme."],
    movimento: ["Leve um joelho para frente, abra para o lado, leve para trás e estenda: desenhe um círculo grande.", "Faça uns 10 círculos e troque de lado (inverta o sentido no fim)."],
    atencao: ["Tronco parado: não gire o quadril para o lado.", "Lombar neutra, sem afundar."],
    respira: "Respiração lenta e contínua.",
  },
  ponte: {
    inicio: ["Deitada de barriga para cima, joelhos dobrados, pés no chão na largura do quadril, a um palmo do glúteo.", "Braços ao lado do corpo."],
    movimento: ["Eleve o quadril contraindo o glúteo até alinhar joelhos, quadril e ombros. Segure 1 segundo.", "Desça devagar, vértebra por vértebra, sem relaxar totalmente embaixo."],
    atencao: ["Empurre com os calcanhares.", "No topo, costelas fechadas: não arqueie a lombar."],
    respira: "Solte o ar ao subir.",
  },
  hip_thrust: {
    inicio: ["Parte de baixo das escápulas apoiada no sofá, pés na largura do quadril.", "Halter sobre o quadril, segurado com as duas mãos."],
    movimento: ["Empurre o quadril para cima até o tronco ficar paralelo ao chão, canelas na vertical; contraia o glúteo 1 segundo.", "Desça controlando até o quadril quase tocar o chão."],
    atencao: ["Queixo levemente para o peito, olhar para frente.", "Joelhos alinhados com os pés, sem abrir ou fechar."],
    respira: "Solte o ar ao subir.",
  },
  coice4: {
    inicio: ["Quatro apoios: mãos sob os ombros, joelhos sob o quadril, abdômen firme."],
    movimento: ["Com o joelho dobrado a 90°, empurre a sola do pé em direção ao teto até a coxa ficar na linha do quadril.", "Volte devagar sem apoiar o joelho. Troque de lado na metade."],
    atencao: ["Suba só até onde a lombar não arqueia.", "Quadril nivelado, sem girar."],
    respira: "Solte o ar ao subir a perna.",
  },
  hidrante: {
    inicio: ["Quatro apoios com a miniband acima dos joelhos, abdômen firme."],
    movimento: ["Abra um joelho para o lado, dobrado a 90°, até a altura do quadril.", "Desça devagar sem encostar. Troque de lado na metade."],
    atencao: ["Tronco parado: não incline para o lado oposto.", "Peso distribuído nas mãos e no joelho de apoio."],
    respira: "Solte o ar ao abrir.",
  },
  ext_pe: {
    inicio: ["Em pé, mãos no encosto de uma cadeira, miniband nos tornozelos.", "Tronco levemente inclinado à frente, joelho de apoio destravado."],
    movimento: ["Leve uma perna estendida para trás, até onde a lombar não arqueia, e contraia o glúteo.", "Volte devagar mantendo a tensão na banda. Troque de lado na metade."],
    atencao: ["Quadril de frente para a cadeira, sem girar.", "Movimento curto e controlado, sem chutar."],
    respira: "Solte o ar ao levar a perna para trás.",
  },
  agach_sumo: {
    inicio: ["Pés bem abertos (1,5x a largura dos ombros), pontas para fora a ~45°.", "Halter pendurado entre as pernas, segurado com as duas mãos."],
    movimento: ["Desça reto, joelhos abrindo na direção dos pés, até as coxas ficarem paralelas ao chão.", "Suba apertando glúteos e parte interna das coxas."],
    atencao: ["Joelhos não fecham para dentro.", "Tronco alto, halter perto do corpo."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  afundo_rev: {
    inicio: ["Em pé, pés na largura do quadril, halteres ao lado do corpo."],
    movimento: ["Dê um passo longo para trás e desça até os dois joelhos ficarem a 90°.", "Empurre o calcanhar da frente para voltar. Alterne as pernas."],
    atencao: ["O peso fica na perna da frente.", "Tronco reto, joelho da frente alinhado com o pé."],
    respira: "Puxe o ar ao descer, solte ao subir.",
  },
  ostra: {
    inicio: ["Deitada de lado, cabeça apoiada no braço, miniband acima dos joelhos.", "Joelhos dobrados a ~45°, quadris e ombros empilhados."],
    movimento: ["Mantendo os pés juntos, abra o joelho de cima contra a banda.", "Feche devagar. Troque de lado na metade."],
    atencao: ["A pelve não gira para trás quando o joelho abre.", "Movimento pequeno e controlado vale mais que amplitude."],
    respira: "Solte o ar ao abrir.",
  },
  bird_dog: {
    inicio: ["Quatro apoios: mãos sob os ombros, joelhos sob o quadril, coluna neutra."],
    movimento: ["Estenda o braço e a perna opostos até ficarem alinhados com o tronco, paralelos ao chão. Segure 2 segundos.", "Volte e alterne os lados."],
    atencao: ["Quadril não gira: imagine um copo d'água na lombar.", "Pescoço alinhado, olhar para o tapete."],
    respira: "Solte o ar ao estender.",
  },

  // ── Pilates ─────────────────────────────────────────────────────────
  "the-hundred": {
    inicio: ["Deitada de barriga para cima, pernas em mesa (joelhos e quadril a 90°).", "Cabeça e ombros fora do tapete, braços estendidos ao lado do corpo, a um palmo do chão."],
    movimento: ["Bata os braços para cima e para baixo em movimentos curtos e rápidos.", "Para progredir, estenda as pernas a ~45°."],
    atencao: ["Lombar colada no tapete o tempo todo.", "Olhar para o umbigo, pescoço sem tensão."],
    respira: "Puxe o ar em 5 batidas e solte em 5 batidas.",
  },
  abdominal: {
    inicio: ["Deitada de barriga para cima, pernas estendidas, braços estendidos acima da cabeça."],
    movimento: ["Suba tronco e pernas ao mesmo tempo, levando as mãos em direção aos pés (V-up).", "Desça devagar até voltar à posição inicial."],
    atencao: ["Lombar sem arquear na descida.", "Versão mais fácil: joelhos dobrados ou só o tronco sobe."],
    respira: "Solte o ar ao subir.",
  },
  "single-leg-stretch": {
    inicio: ["Deitada, cabeça e ombros fora do tapete.", "Abrace um joelho junto ao peito e estenda a outra perna a ~45°."],
    movimento: ["Troque as pernas: a estendida dobra e vem ao peito, a outra estende.", "Alterne em ritmo constante."],
    atencao: ["Lombar colada no tapete.", "Perna estendida mais alta se a lombar sair do chão."],
    respira: "Puxe o ar em uma troca, solte na outra.",
  },
  "criss-cross": {
    inicio: ["Deitada, mãos atrás da cabeça, cotovelos abertos.", "Cabeça e ombros fora do tapete, pernas em mesa."],
    movimento: ["Gire o tronco levando o ombro em direção ao joelho oposto, enquanto a outra perna estende a ~45°.", "Troque de lado devagar."],
    atencao: ["Quem gira é o tronco, não o cotovelo.", "Não puxe a cabeça com as mãos."],
    respira: "Solte o ar ao girar.",
  },
  core_pilates: {
    inicio: ["Sentada, joelhos dobrados, pés no chão, mãos apoiadas atrás do quadril com os dedos para frente."],
    movimento: ["Eleve o quadril até formar uma mesa: joelhos a 90°, tronco paralelo ao chão.", "Segure 2 segundos e desça devagar sem sentar totalmente."],
    atencao: ["Ombros longe das orelhas, peito aberto.", "Glúteo contraído no topo."],
    respira: "Solte o ar ao subir.",
  },
  prancha: {
    inicio: ["Prancha nos antebraços: cotovelos sob os ombros, pernas estendidas, corpo em linha reta."],
    movimento: ["Gire o corpo para a prancha lateral, apoiada em um antebraço, mão livre na cintura.", "Volte ao centro e gire para o outro lado."],
    atencao: ["Quadril alto na lateral, sem cair.", "Abdômen firme e pescoço alinhado."],
    respira: "Respire sem prender o ar.",
  },
  swimming: {
    inicio: ["Deitada de bruços, braços estendidos à frente, pernas estendidas.", "Eleve um pouco braços, peito e pernas do tapete."],
    movimento: ["Bata braços e pernas opostos para cima e para baixo, em movimentos curtos, como na natação.", "Ritmo constante durante todo o tempo."],
    atencao: ["Olhar para o tapete, pescoço longo.", "Abdômen ativo para proteger a lombar."],
    respira: "Puxe o ar em 5 batidas, solte em 5.",
  },
  elev_ywt: {
    inicio: ["Deitada de bruços, testa perto do tapete, braços estendidos em Y (diagonal acima da cabeça), polegares para cima."],
    movimento: ["Eleve os braços do chão apertando as escápulas e segure 1 segundo.", "Dobre os cotovelos puxando-os para trás em W, apertando as costas, e volte ao Y."],
    atencao: ["Pescoço neutro: não levante a cabeça.", "Ombros longe das orelhas."],
    respira: "Solte o ar ao elevar.",
  },
  abertura: {
    inicio: ["Deitada de lado, joelhos dobrados a 90°, cabeça apoiada numa almofada.", "Braços estendidos à frente do peito, palmas juntas."],
    movimento: ["Abra o braço de cima em um arco, girando o peito para o teto e acompanhando a mão com o olhar.", "Volte devagar e repita. Troque de lado na metade."],
    atencao: ["Os joelhos ficam juntos e no chão.", "Gire só até onde for confortável."],
    respira: "Puxe o ar ao abrir, solte ao fechar.",
  },
  rotacao: {
    inicio: ["Pés mais abertos que os ombros, segure um halter com as duas mãos ao lado do joelho, joelhos dobrados."],
    movimento: ["Leve o halter em diagonal até acima do ombro oposto, girando o tronco e o pé de trás (lenhador).", "Volte pelo mesmo caminho, devagar. Troque de lado na metade."],
    atencao: ["Braços quase estendidos, a força vem do tronco.", "Coluna longa, abdômen firme."],
    respira: "Solte o ar ao subir.",
  },
  hinge_ajo: {
    inicio: ["Ajoelhada, joelhos na largura do quadril, miniband acima dos joelhos.", "Coluna longa, braços estendidos à frente."],
    movimento: ["Leve o quadril para trás em direção aos calcanhares, inclinando o tronco em bloco.", "Volte empurrando o quadril à frente e contraia o glúteo."],
    atencao: ["Coluna reta: quem dobra é o quadril.", "Mantenha os joelhos afastados contra a banda."],
    respira: "Solte o ar ao voltar.",
  },
  platter: {
    inicio: ["Em pé, cotovelos dobrados a 90° colados na cintura, palmas para cima, halteres leves."],
    movimento: ["Abra os antebraços para os lados, como quem serve uma bandeja, mantendo os cotovelos colados.", "Volte devagar ao centro."],
    atencao: ["Os cotovelos não saem da cintura.", "Ombros baixos, peito aberto."],
    respira: "Solte o ar ao abrir.",
  },
  leg_opens: {
    inicio: ["Deitada de barriga para cima, pernas estendidas para o teto, miniband acima dos joelhos ou nos tornozelos."],
    movimento: ["Abra as pernas em V contra a banda, devagar.", "Feche controlando, sem deixar a banda puxar."],
    atencao: ["Lombar colada no tapete.", "Se doer a lombar, dobre um pouco os joelhos."],
    respira: "Solte o ar ao abrir.",
  },
  tri_pulso: {
    inicio: ["Tronco inclinado à frente, joelhos levemente dobrados.", "Braços estendidos para trás ao lado do quadril, palmas para cima ou para dentro."],
    movimento: ["Faça pulsos curtos subindo e descendo os braços estendidos uns 5 cm.", "Mantenha os 40 s sem dobrar os cotovelos."],
    atencao: ["Cotovelos travados: o movimento vem do ombro.", "Ombros longe das orelhas, coluna neutra."],
    respira: "Respiração curta e contínua.",
  },
  prone_leg: {
    inicio: ["Deitada de bruços, testa sobre as mãos, pernas estendidas."],
    movimento: ["Eleve uma perna estendida poucos centímetros do tapete, contraindo o glúteo.", "Desça devagar e alterne."],
    atencao: ["Quadril colado no tapete.", "Movimento pequeno: subir demais arqueia a lombar."],
    respira: "Solte o ar ao subir.",
  },
  remada_uni: {
    inicio: ["Um joelho e a mão do mesmo lado apoiados no assento da cadeira, o outro pé no chão.", "Halter na mão livre, braço estendido, coluna paralela ao chão."],
    movimento: ["Puxe o cotovelo em direção ao quadril, rente ao corpo.", "Desça estendendo o braço. Troque de lado na metade."],
    atencao: ["O tronco não gira para ajudar.", "Pescoço alinhado, ombro longe da orelha."],
    respira: "Solte o ar ao puxar.",
  },
  ponte_uni: {
    inicio: ["Deitada de barriga para cima, um pé no chão perto do glúteo, a outra perna estendida para o alto em diagonal."],
    movimento: ["Empurre o calcanhar de apoio e eleve o quadril até alinhar joelho, quadril e ombros.", "Desça devagar. Troque de lado na metade."],
    atencao: ["Pelve nivelada: o lado da perna no ar não cai.", "Costelas fechadas no topo."],
    respira: "Solte o ar ao subir.",
  },
  elev_front: {
    inicio: ["Em pé, halteres à frente das coxas, palmas para trás."],
    movimento: ["Eleve os braços à frente, quase estendidos, até a altura dos ombros.", "Desça devagar."],
    atencao: ["Não passe da altura dos ombros.", "Sem balançar o tronco; peso leve."],
    respira: "Solte o ar ao subir.",
  },

  // ── Alongamento e mobilidade ────────────────────────────────────────
  "alongamento-triceps-ombro": {
    inicio: ["Em pé, cruze um braço estendido à frente do peito e puxe com o outro braço pelo cotovelo."],
    movimento: ["Depois leve o mesmo braço atrás da cabeça, cotovelo para o teto, e empurre o cotovelo com a outra mão.", "Troque de lado na metade."],
    atencao: ["Ombros baixos, sem forçar a ponto de doer.", "Cabeça reta, sem empurrar com o braço."],
    respira: "Respiração lenta; solte o ar para alongar mais.",
  },
  "postura-crianca": {
    inicio: ["Ajoelhada, sente sobre os calcanhares, coluna alta."],
    movimento: ["Leve o tronco à frente e estenda os braços no tapete, testa apoiada.", "Fique ali soltando o peso do quadril nos calcanhares."],
    atencao: ["Afaste os joelhos se a barriga ou o quadril pedirem espaço.", "Ombros relaxados."],
    respira: "Respire fundo e devagar, enchendo as costas de ar.",
  },
  cobra: {
    inicio: ["Deitada de bruços, mãos ao lado do peito, cotovelos colados ao corpo."],
    movimento: ["Empurre o chão e eleve o peito, estendendo os braços até onde a lombar ficar confortável.", "Segure alguns segundos e desça devagar."],
    atencao: ["Ombros longe das orelhas, pescoço longo.", "Quadril e pernas no tapete."],
    respira: "Puxe o ar ao subir, solte ao descer.",
  },
  "alongamento-quadriceps": {
    inicio: ["Em pé, uma mão apoiada na parede."],
    movimento: ["Dobre um joelho e segure o pé atrás, levando o calcanhar em direção ao glúteo.", "Segure e troque de lado na metade."],
    atencao: ["Joelhos juntos, apontando para o chão.", "Quadril levemente à frente, sem arquear a lombar."],
    respira: "Respiração lenta e profunda.",
  },
  "alongamento-posterior": {
    inicio: ["Sentada, pernas estendidas e juntas, coluna alta, pontas dos pés para o teto."],
    movimento: ["Leve o peito em direção às coxas, mãos indo em direção aos pés.", "Fique onde sentir alongar, sem forçar."],
    atencao: ["Incline a partir do quadril, sem arredondar muito as costas.", "Pode dobrar levemente os joelhos."],
    respira: "Solte o ar para descer um pouco mais.",
  },
  "alongamento-figura-4": {
    inicio: ["Deitada de barriga para cima, joelhos dobrados, pés no chão.", "Cruze um tornozelo sobre o joelho oposto, formando um 4."],
    movimento: ["Tire o pé de apoio do chão e puxe a coxa de baixo em direção ao peito.", "Segure e troque de lado na metade."],
    atencao: ["Cabeça e ombros relaxados no tapete.", "Empurre de leve o joelho cruzado para longe para alongar mais."],
    respira: "Respiração lenta e profunda.",
  },
  "torcao-deitada": {
    inicio: ["Deitada de barriga para cima, braços abertos em T, joelhos dobrados e juntos."],
    movimento: ["Deixe os dois joelhos caírem para um lado enquanto o olhar vai para o lado oposto.", "Troque de lado na metade."],
    atencao: ["Os dois ombros ficam no tapete.", "Deixe a gravidade trabalhar, sem forçar."],
    respira: "Solte o ar e relaxe mais a cada respiração.",
  },
  "gato-vaca": {
    inicio: ["Quatro apoios: mãos sob os ombros, joelhos sob o quadril."],
    movimento: ["Gato: arredonde a coluna, empurre o chão e leve o olhar ao umbigo.", "Vaca: afunde a barriga, abra o peito e olhe à frente. Alterne devagar."],
    atencao: ["Movimento de vértebra em vértebra, da bacia até a cabeça.", "Braços estendidos, sem travar os cotovelos."],
    respira: "Solte o ar no gato, puxe o ar na vaca.",
  },
};

export const respiracaoPadrao = SOLTA_NA_FORCA;
