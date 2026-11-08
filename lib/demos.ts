// Fotos de demonstração (posição inicial → final) da Free Exercise DB,
// domínio público (Unlicense): https://github.com/yuhonas/free-exercise-db
//
// Mapa: id do nosso exercício → id na Free Exercise DB.
// Só entram exercícios em que a foto mostra o mesmo movimento.
// Depois de mudar o mapa, rode `npm run baixar-demos` para baixar as fotos
// para public/img/exercicios/<id>-0.jpg e <id>-1.jpg.

export const DEMOS: Record<string, string> = {
  // Braços e ombros
  desenv: "Dumbbell_Shoulder_Press",
  tri_coice: "Tricep_Dumbbell_Kickback",
  rosca: "Dumbbell_Bicep_Curl",
  elev_lat: "Side_Lateral_Raise",
  elev_front: "Front_Dumbbell_Raise",
  remada: "Bent_Over_Two-Dumbbell_Row",
  remada_uni: "One-Arm_Dumbbell_Row",
  tri_oh: "Standing_Dumbbell_Triceps_Extension",
  cruc_inv: "Seated_Bent-Over_Rear_Delt_Raise",
  // Pernas e glúteos
  agach: "Goblet_Squat",
  agach_sumo: "Plie_Dumbbell_Squat",
  stiff: "Stiff-Legged_Dumbbell_Deadlift",
  afundo: "Dumbbell_Lunges",
  afundo_rev: "Dumbbell_Rear_Lunge",
  step_up: "Dumbbell_Step_Ups",
  bulgaro: "Split_Squat_with_Dumbbells",
  ponte: "Butt_Lift_Bridge",
  ponte_uni: "Single_Leg_Glute_Bridge",
  hip_thrust: "Barbell_Hip_Thrust",
  coice4: "Glute_Kickback",
  // Total body
  swing: "One-Arm_Kettlebell_Swings",
  explosivo: "Kettlebell_Thruster",
  flexao_remada: "Alternating_Renegade_Row",
  "mountain-climber": "Mountain_Climbers",
  // Core
  prancha: "Plank",
  abdominal: "Jackknife_Sit-Up",
  "dead-bug": "Dead_Bug",
  // Aquecimento, mobilidade e alongamento
  "circulos-braco": "Arm_Circles",
  inchworm: "Inchworm",
  "agachamento-livre": "Bodyweight_Squat",
  mob_quadril: "Hip_Circles_prone",
  "gato-vaca": "Cat_Stretch",
  "postura-crianca": "Childs_Pose",
  "alongamento-triceps-ombro": "Triceps_Stretch",
  "alongamento-posterior": "Seated_Floor_Hamstring_Stretch",
};

export const demoFrames = (id: string): string[] | undefined =>
  DEMOS[id] ? [`/img/exercicios/${id}-0.jpg`, `/img/exercicios/${id}-1.jpg`] : undefined;
