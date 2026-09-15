// ============================================================
// TELLUS LEARNING — MODELO DE ESTADO DE APRENDIZAJE
// ============================================================
//
// Este modelo captura la evidencia necesaria para reconstruir
// cómo aprendió el estudiante a lo largo de la experiencia.
//
// Regla de diseño:
//   No guardamos todo lo que hizo.
//   Guardamos lo que permite reconstruir su razonamiento.
//
// ============================================================


// ============================================================
// CADA MOMENTO
// ============================================================

export interface M1State {
  initialExplanation?: string;
  completedAt?: string;
}

export interface M2State {
  placedFactors?: Record<string, string>;
  score?: number;
  completed?: boolean;
  completedAt?: string;
}

export interface M3State {
  selectedOption?: string;
  isCorrect?: boolean;
  attempts?: number;
  hypothesis?: string;
  predictedDistance?: number;
  predictedTime?: number;
  factors?: string;
  completedAt?: string;
}

export interface M4LabTrial {
  object?: string;
  distance?: number;
  time?: number;
  angle?: number;
  observations?: string;
}

export interface M4RoadToGloryAnswer {
  questionNumber?: number;
  questionText?: string;
  selected?: string;
  correct?: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface M4RoadToGloryState {
  studentName?: string;
  score?: number;
  percentage?: number;
  level?: string;
  levelMessage?: string;
  correct?: number;
  total?: number;
  bonusApplied?: boolean;
  gamePoints?: number;
  gameGoals?: number;
  attemptsLeft?: number;
  answers?: M4RoadToGloryAnswer[];
  completedAt?: string;
}

export interface M4State {
  lab?: {
    trials?: M4LabTrial[];
    completedAt?: string;
  };
  roadToGlory?: M4RoadToGloryState;
  completedAt?: string;
}

export interface M5Response {
  questionId?: string;
  questionText?: string;
  selectedIndex?: number;
  correctIndex?: number;
  isCorrect?: boolean;
}

export interface M5State {
  solvedCount?: number;
  totalQuestions?: number;
  responses?: M5Response[];
  completedAt?: string;
}

export interface M6ActivityRecord {
  activityId: string;
  responses?: Record<string, unknown>;
  evidenceType?: string;
  completedAt?: string;
}

export interface M6State {
  currentActivityIndex?: number;
  activities?: Record<string, M6ActivityRecord>;
  completedAt?: string;
}


// ============================================================
// ESTADO COMPLETO
// ============================================================

export interface LearningState {
  /**
   * Identificador de la experiencia.
   * Ejemplo: 'exp-movimiento-parabolico'
   */
  experienceId: string;

  /**
   * Identificador del estudiante (opcional por ahora).
   * Cuando integremos con autenticación, se poblará.
   */
  studentId?: string;

  /**
   * Estado por momento del ciclo de aprendizaje.
   */
  moments: {
    m1?: M1State;
    m2?: M2State;
    m3?: M3State;
    m4?: M4State;
    m5?: M5State;
    m6?: M6State;
  };

  /**
   * Marca de la última actualización.
   */
  updatedAt?: string;

  /**
   * Versión del esquema. Útil para migraciones futuras.
   */
  version: number;
}


// ============================================================
// ESTADO INICIAL
// ============================================================

export const LEARNING_STATE_VERSION = 1;

export function createEmptyLearningState(
  experienceId: string
): LearningState {
  return {
    experienceId,
    moments: {},
    updatedAt: new Date().toISOString(),
    version: LEARNING_STATE_VERSION,
  };
}


// ============================================================
// CLAVES DE MOMENTO
// ============================================================

export type MomentKey =
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5'
  | 'm6';