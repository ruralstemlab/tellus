import { SubmissionStatus } from './experience.enums';

// ============================================================
// ARCHIVOS ADJUNTOS
// ============================================================

export interface SubmissionFile {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
}

// ============================================================
// EVIDENCIAS DEL ESTUDIANTE
// ============================================================

export interface VideoEvidence {
  watched: boolean;

  answers?: {
    questionId: string;
    answer: string | number | boolean;
  }[];
}

export interface QuestionnaireEvidence {
  answers: {
    questionId: string;
    answer: string | number | boolean;
  }[];
}

export interface PreinformeEvidence {
  hypothesis: string;

  predictedDistance: number;

  predictedTime: number;

  factors: string[];
}

export interface LabPhysicalEvidence {
  trials: TrialData[];
}

export interface TrialData {
  trialNumber: number;

  ball: string;

  distance: number;

  time: number;

  angle: number;

  observations?: string;
}

export interface SimulationEvidence {
  results: SimulationResults;

  config: Record<string, unknown>;
}

export interface SimulationResults {
  distance: number;

  time: number;

  maxHeight: number;

  trajectory: {
    x: number;
    y: number;
  }[];
}

export interface DataAnalysisEvidence {
  answers: {
    questionId: string;
    answer: string | number | boolean;
  }[];
}

export interface EvaluationEvidence {
  answers: {
    questionId: string;
    answer: string | number | boolean;
  }[];

  score?: number;
}

export interface ReflectionEvidence {
  answers: {
    questionId: string;
    text: string;
  }[];
}

// ============================================================
// UNIÓN DISCRIMINADA DE EVIDENCIAS
// ============================================================

export type EvidenceContent =
  | {
      type: 'video';
      data: VideoEvidence;
    }
  | {
      type: 'questionnaire';
      data: QuestionnaireEvidence;
    }
  | {
      type: 'preinforme';
      data: PreinformeEvidence;
    }
  | {
      type: 'lab_physical';
      data: LabPhysicalEvidence;
    }
  | {
      type: 'simulation';
      data: SimulationEvidence;
    }
  | {
      type: 'data_analysis';
      data: DataAnalysisEvidence;
    }
  | {
      type: 'evaluation';
      data: EvaluationEvidence;
    }
  | {
      type: 'reflection';
      data: ReflectionEvidence;
    };

// ============================================================
// SUBMISSION
// ============================================================

export interface Submission {
  id: string;

  // ----------------------------------------------------------
  // Relación pedagógica
  // ----------------------------------------------------------

  activityId: string;

  experienceId: string;

  momentId: string;

  studentId: string;

  // ----------------------------------------------------------
  // Evidencia
  // ----------------------------------------------------------

  content: EvidenceContent;

  files?: SubmissionFile[];

  // ----------------------------------------------------------
  // Estado
  // ----------------------------------------------------------

  status: SubmissionStatus;

  // ----------------------------------------------------------
  // Intentos y correcciones
  // ----------------------------------------------------------

  attemptNumber: number;

  isCorrection: boolean;

  correctedFrom?: string;

  // ----------------------------------------------------------
  // Evaluación
  // ----------------------------------------------------------

  score?: number;

  maxScore?: number;

  feedback?: string;

  evaluatedBy?: string;

  evaluatedAt?: unknown;

  // ----------------------------------------------------------
  // Auditoría
  // ----------------------------------------------------------

  createdAt: unknown;

  updatedAt: unknown;

  submittedAt?: unknown;
}