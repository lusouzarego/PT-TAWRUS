// Plano semanal: cada dia foca em uma parte do corpo.
// Formato padrão: 40 s de exercício, 20 s de transição/descanso.
// Edite à vontade: a lista de cada bloco usa os ids de lib/exercises.ts.

export type DayKey = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

export type DayPlan = {
  key: DayKey;
  name: string;
  focus: string;
  emoji: string;
  warmup: string[];
  circuit: string[];
  rounds: number;
  cooldown: string[];
};

export const WORK_SECONDS = 40;
export const REST_SECONDS = 20;

export const DAY_ORDER: DayKey[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export const week: Record<DayKey, DayPlan> = {
  seg: {
    key: "seg",
    name: "Segunda",
    focus: "Braços & ombros (sculpt)",
    emoji: "💪",
    warmup: ["circulos-braco", "polichinelo-sem-salto", "inchworm", "cactus"],
    circuit: ["desenv", "tri_coice", "rosca", "elev_lat", "remada", "tri_oh", "around", "cruc_inv"],
    rounds: 3,
    cooldown: ["alongamento-triceps-ombro", "postura-crianca", "cobra"],
  },
  ter: {
    key: "ter",
    name: "Terça",
    focus: "Pernas & posterior",
    emoji: "🦵",
    warmup: ["marcha-joelho-alto", "circulos-quadril", "agachamento-livre", "avanco-rotacao"],
    circuit: ["agach", "stiff", "afundo_lat", "step_up", "bulgaro", "stiff_uni", "agach_pulso", "afundo"],
    rounds: 3,
    cooldown: ["alongamento-quadriceps", "alongamento-posterior", "alongamento-figura-4"],
  },
  qua: {
    key: "qua",
    name: "Quarta",
    focus: "Total body funcional",
    emoji: "🔥",
    warmup: ["polichinelo-sem-salto", "inchworm", "avanco-rotacao", "circulos-braco"],
    circuit: ["afundo_combo", "remada_combo", "agach_combo", "flexao_remada", "stiff_combo", "braco_combo", "explosivo", "swing"],
    rounds: 3,
    cooldown: ["postura-crianca", "torcao-deitada", "alongamento-posterior"],
  },
  qui: {
    key: "qui",
    name: "Quinta",
    focus: "Glúteos",
    emoji: "🍑",
    warmup: ["circulos-quadril", "mob_quadril", "agachamento-livre", "gato-vaca"],
    circuit: ["ponte", "hip_thrust", "coice4", "hidrante", "ext_pe", "agach_sumo", "afundo_rev", "ostra"],
    rounds: 3,
    cooldown: ["alongamento-figura-4", "postura-crianca", "torcao-deitada"],
  },
  sex: {
    key: "sex",
    name: "Sexta",
    focus: "Pilates Mat: core & postura",
    emoji: "🧘‍♀️",
    warmup: ["gato-vaca", "circulos-quadril", "bird_dog"],
    circuit: [
      "the-hundred",
      "abdominal",
      "single-leg-stretch",
      "criss-cross",
      "core_pilates",
      "prancha",
      "swimming",
      "elev_ywt",
      "abertura",
      "rotacao",
    ],
    rounds: 2,
    cooldown: ["cobra", "postura-crianca", "torcao-deitada"],
  },
  sab: {
    key: "sab",
    name: "Sábado",
    focus: "Pilates sculpt: glúteos & braços",
    emoji: "✨",
    warmup: ["polichinelo-sem-salto", "circulos-quadril", "circulos-braco"],
    circuit: ["hinge_ajo", "platter", "leg_opens", "tri_pulso", "prone_leg", "remada_uni", "ponte_uni", "elev_front"],
    rounds: 2,
    cooldown: ["alongamento-posterior", "alongamento-figura-4", "postura-crianca"],
  },
  dom: {
    key: "dom",
    name: "Domingo",
    focus: "Descanso ativo: mobilidade",
    emoji: "🌿",
    warmup: [],
    circuit: [
      "gato-vaca",
      "mob_quadril",
      "avanco-rotacao",
      "cobra",
      "alongamento-figura-4",
      "alongamento-posterior",
      "torcao-deitada",
      "postura-crianca",
    ],
    rounds: 1,
    cooldown: [],
  },
};
