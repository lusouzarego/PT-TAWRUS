// Frase do dia do Cool Moms Club: autocuidado materno, culpa, exemplo para os filhos e a
// rede de apoio de quem é mãe longe do Brasil. Frases originais, inspiradas em temas de
// textos sobre autocuidado materno (UNICEF Brasil, estudos sobre maternidade migrante etc.).
// Uma por dia, na ordem da lista; depois do fim, recomeça.
const TIMEZONE = "Europe/Rome";

export const FRASES: string[] = [
  "Cuidar de você é uma das formas mais bonitas de cuidar de quem você ama.",
  "Mãe descansada tem mais paciência, mais colo e mais riso. Isso também é treino.",
  "Seus filhos aprendem a se cuidar olhando como você se cuida.",
  "Ninguém serve água de um copo vazio. Hoje você enche o seu.",
  "40 minutos para você não tiram nada de ninguém. Devolvem muito para todos.",
  "Você não precisa esperar o esgotamento para merecer um tempo só seu.",
  "Longe de casa, a gente aprende que família também é a que a gente escolhe. Bem-vinda ao clube.",
  "A culpa vai aparecer. Deixa ela sentada no sofá e vai treinar mesmo assim.",
  "Força não é dar conta de tudo sozinha. Força é pedir ajuda quando precisa.",
  "Hoje o treino é seu, o corpo é seu e a conquista também é sua.",
  "Saudade do Brasil se cura um pouquinho quando a gente encontra outras brasileiras no caminho.",
  "Seu corpo carregou, acolheu e sustenta uma família. Ele merece cuidado, não cobrança.",
  "Não é sobre voltar a ser quem você era antes. É sobre gostar de quem você está se tornando.",
  "Um treino feito no meio do caos vale mais do que o treino perfeito que nunca acontece.",
  "Quando a mãe está bem, a casa inteira respira melhor.",
  "Você ensina amor-próprio com exemplo, não com discurso.",
  "Dez minutos já contam. Um passo já conta. Você já conta.",
  "Maternidade não é sacrifício sem fim. É amor que inclui você também.",
  "Hoje você treina pela mulher que você é, e não só pela mãe que você é.",
  "Começar cansada também é começar. O importante é aparecer.",
  "Em outro país, com outra língua, você continua sendo a casa dos seus filhos. Cuide bem dessa casa.",
  "Não existe mãe perfeita. Existe mãe presente, inclusive para si mesma.",
  "Seu bem-estar não é luxo. É o que mantém tudo de pé.",
  "Cada check-in é um recado para você mesma: eu também sou prioridade.",
  "Os filhos não precisam de uma mãe que dá conta de tudo. Precisam de uma mãe feliz.",
  "Respira fundo. Você está fazendo muito mais do que imagina.",
  "Treinar é um jeito de dizer ao seu corpo: obrigada por tudo que você faz.",
  "Rede de apoio também se constrói. Cada mãe aqui é um fio dessa rede.",
  "Pausa não é preguiça. É manutenção da mulher incrível que você é.",
  "A versão de você que se cuida é a que tem mais energia para brincar no chão da sala.",
  "Mãe também precisa de colo. Às vezes ele vem em forma de comunidade.",
  "Você não está atrasada. Você está no seu tempo, e ele é suficiente.",
  "Quem cuida de todo mundo também merece alguém que a lembre de se cuidar. Hoje somos nós.",
  "Corpo forte, cabeça leve, coração em paz: um treino de cada vez.",
  "Seus filhos vão lembrar da mãe que ria, não da casa sempre arrumada.",
  "O tempo que você investe em você volta multiplicado para a sua família.",
  "Entre fraldas, escola e trabalho, você ainda escolheu se cuidar. Isso é gigante.",
  "Não compare o seu capítulo 1 com o capítulo 20 de ninguém.",
  "Ser estrangeira ensina coragem. Use essa coragem no treino de hoje.",
  "Amar os filhos e amar a si mesma não competem. Um alimenta o outro.",
  "Hoje, a meta é simples: terminar o treino e se orgulhar disso.",
  "Toda grande mudança começa com uma mãe que decidiu não se deixar por último.",
  "Você pode ser abrigo para os outros e casa para si mesma.",
  "Treinar com os filhos olhando é ensinar saúde sem dizer uma palavra.",
  "Seja gentil com você. Você está aprendendo a ser mãe e a viver num país novo ao mesmo tempo.",
  "Cansada e mesmo assim aqui. Isso tem nome: força de mãe.",
  "A gente não para de ser mãe para se cuidar. A gente se cuida para continuar sendo inteira.",
  "Quando uma mãe se fortalece, ela fortalece todas as outras ao redor.",
  "Seu sorriso no fim do treino é o melhor exemplo que você pode dar hoje.",
  "Você não precisa de mais tempo. Precisa de um tempo que seja seu. Ele começa agora.",
  "Do Brasil para a Itália, levamos o jeito de abraçar. Hoje o abraço é em você.",
  "Movimento é remédio para o corpo e para o coração apertado de saudade.",
  "Disciplina é amor-próprio em forma de rotina.",
  "Os dias são longos, mas os anos são curtos. Cuide de quem vai viver todos eles: você.",
  "Você é o exemplo de mulher que seus filhos vão levar para a vida.",
  "Um corpo cuidado aguenta melhor as noites mal dormidas. Bora treinar.",
  "Celebre o pequeno: o treino feito, a água bebida, o minuto de silêncio conquistado.",
  "Ninguém precisa saber o quanto foi difícil chegar até aqui hoje. Mas a gente sabe, e tem orgulho de você.",
  "Mãe que se cuida não é egoísta. É sábia.",
  "A mulher que existia antes dos filhos ainda está aí. Hoje ela também treina.",
  "Juntas somos mais fortes, mesmo a milhares de quilômetros de casa.",
  "Você é a prova de que dá para recomeçar quantas vezes for preciso.",
];

/** Frase do dia (muda à meia-noite da Itália). */
export function fraseDoDia(date: Date = new Date()): string {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(date).split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return FRASES[dayNumber % FRASES.length];
}
