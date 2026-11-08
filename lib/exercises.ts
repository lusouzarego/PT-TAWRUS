// Catálogo de exercícios.
//
// A maior parte vem da sua pasta "Exercícios" do Instagram (lib/instagram.generated.ts,
// gerado por `npm run importar`). Aqui ficam só os complementos que não estavam lá:
// aquecimento, alongamento e os clássicos de Pilates Mat para o core.

import { demoFrames } from "./demos";
import { instagramExercises } from "./instagram.generated";

export type Equipment = "nenhum" | "tapete" | "halteres" | "miniband" | "caneleira" | "cadeira";

export type Reference = { link: string; author: string; title: string };

export type Exercise = {
  id: string;
  name: string;
  equipment: string[];
  /** Dica curta de execução. */
  cue: string;
  /** Passo a passo (aparece no timer). */
  steps?: string[];
  /** Parte do corpo, estilo e músculo (vindos do Instagram). */
  bodyPart?: string;
  style?: string;
  muscle?: string;
  /** Como o exercício apareceu nos posts salvos. */
  variations?: string[];
  /** Posts/reels de referência. O primeiro é o vídeo mostrado no timer. */
  refs?: Reference[];
  /** Foto opcional, caminho a partir de /public (JPG/PNG/WebP). */
  image?: string;
  /** Fotos de demonstração [início, fim], preenchidas a partir de lib/demos.ts. */
  frames?: string[];
  /** Busca no YouTube para o botão de vídeo explicativo (padrão: nome do exercício). */
  youtube?: string;
};

const complementos: Exercise[] = [
  // ── Aquecimento / mobilidade ────────────────────────────────────────────
  { id: "polichinelo-sem-salto", name: "Polichinelo sem salto", equipment: ["nenhum"], cue: "Alterne as pernas para o lado enquanto os braços sobem. Ritmo constante." },
  { id: "marcha-joelho-alto", name: "Marcha com joelho alto", equipment: ["nenhum"], cue: "Joelho na altura do quadril, abdômen firme, braços acompanhando." },
  { id: "circulos-quadril", name: "Círculos de quadril", equipment: ["nenhum"], cue: "Mãos na cintura, círculos amplos. Inverta o sentido na metade." },
  { id: "circulos-braco", name: "Círculos de braço", equipment: ["nenhum"], cue: "Braços estendidos na linha dos ombros, círculos pequenos para frente e para trás." },
  { id: "gato-vaca", name: "Gato-vaca", equipment: ["tapete"], cue: "Em quatro apoios: arredonde a coluna na expiração, estenda na inspiração." },
  { id: "inchworm", name: "Inchworm", equipment: ["nenhum"], cue: "Desça as mãos até o chão, caminhe até a prancha e volte." },
  { id: "avanco-rotacao", name: "Avanço com rotação torácica", equipment: ["nenhum"], cue: "No avanço, gire o tronco para o lado da perna da frente. Alterne." },
  { id: "agachamento-livre", name: "Agachamento livre (aquecimento)", equipment: ["nenhum"], cue: "Sem peso, ritmo tranquilo: quadril para trás, peito aberto." },
  { id: "mountain-climber", name: "Mountain climber", equipment: ["tapete"], cue: "Em prancha alta, traga os joelhos ao peito alternando, quadril estável." },

  // ── Pilates Mat: core ───────────────────────────────────────────────────
  { id: "the-hundred", youtube: "pilates the hundred tutorial", name: "The Hundred", equipment: ["tapete"], cue: "Cabeça e ombros elevados, pernas em mesa ou estendidas, bata os braços: inspira 5, expira 5." },
  { id: "single-leg-stretch", youtube: "pilates single leg stretch tutorial", name: "Single leg stretch", equipment: ["tapete"], cue: "Abraça um joelho e estende a outra perna, alternando. Lombar no chão." },
  { id: "double-leg-stretch", youtube: "pilates double leg stretch tutorial", name: "Double leg stretch", equipment: ["tapete"], cue: "Estenda braços e pernas juntos, depois recolha abraçando os joelhos." },
  { id: "criss-cross", youtube: "pilates criss cross tutorial", name: "Criss cross", equipment: ["tapete"], cue: "Leve o ombro em direção ao joelho oposto, devagar e controlado." },
  { id: "dead-bug", youtube: "dead bug exercício como fazer", name: "Dead bug", equipment: ["tapete"], cue: "Estenda braço e perna opostos sem tirar a lombar do chão." },
  { id: "swimming", youtube: "pilates swimming exercício", name: "Swimming", equipment: ["tapete"], cue: "De bruços, braços e pernas elevados, alterne batendo como natação." },
  { id: "toe-taps", youtube: "pilates toe taps tutorial", name: "Toe taps", equipment: ["tapete"], cue: "Pernas em mesa, toque um pé de cada vez no chão sem arquear." },
  { id: "leg-circles", youtube: "pilates leg circles tutorial", name: "Leg circles", equipment: ["tapete"], cue: "Perna estendida para cima, círculos controlados. Troque de perna na metade." },
  { id: "teaser", youtube: "pilates teaser tutorial", name: "Teaser", equipment: ["tapete"], cue: "Forme um V com o corpo, braços paralelos às pernas. Suba e desça com controle." },

  // ── Desaquecimento / alongamento ────────────────────────────────────────
  { id: "postura-crianca", name: "Postura da criança", equipment: ["tapete"], cue: "Sente nos calcanhares e estenda os braços à frente. Respire fundo." },
  { id: "alongamento-figura-4", name: "Alongamento figura 4", equipment: ["tapete"], cue: "Deitada, tornozelo sobre o joelho oposto, puxe a perna de baixo. Troque na metade." },
  { id: "alongamento-posterior", name: "Alongamento de posterior", equipment: ["tapete"], cue: "Sentada, pernas estendidas, leve o peito em direção às coxas." },
  { id: "cobra", name: "Cobra", equipment: ["tapete"], cue: "De bruços, empurre o chão e abra o peito, ombros longe das orelhas." },
  { id: "torcao-deitada", name: "Torção deitada", equipment: ["tapete"], cue: "Joelhos para um lado, olhar para o outro. Troque na metade." },
  { id: "alongamento-triceps-ombro", name: "Alongamento de tríceps e ombro", equipment: ["nenhum"], cue: "Um braço cruzado à frente, depois o cotovelo atrás da cabeça. Alterne." },
  { id: "alongamento-quadriceps", name: "Alongamento de quadríceps", equipment: ["nenhum"], cue: "Em pé, segure o pé atrás do corpo, joelhos juntos. Troque na metade." },
];

export const exercises: Record<string, Exercise> = Object.fromEntries(
  [...instagramExercises, ...complementos].map((e) => [e.id, { ...e, frames: e.frames ?? demoFrames(e.id) }]),
);
