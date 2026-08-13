import { ActivityType } from './experience.enums';

// ============================================================
// OPCIONES DE ACTIVIDAD
// ============================================================

export interface ActivityOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// ============================================================
// CONFIGURACIÓN DE ACTIVIDAD
// ============================================================

export interface ActivityConfig {
  /**
   * La actividad genera una Submission.
   * Ejemplo: preinforme, laboratorio, reflexión.
   */
  requiresSubmission: boolean;

  /**
   * La actividad es necesaria para completar el momento.
   *
   * Importante:
   * una actividad puede requerir Submission pero no ser
   * indispensable para cerrar el momento.
   */
  requiredForCompletion: boolean;

  /**
   * La actividad tiene evaluación.
   */
  graded: boolean;

  /**
   * Evaluación automática.
   */
  autoEvaluate?: boolean;

  /**
   * Puntaje máximo.
   */
  maxScore?: number;

  /**
   * Número máximo de intentos.
   */
  maxAttempts?: number;

  /**
   * Permite múltiples intentos.
   */
  allowsMultipleAttempts: boolean;

  /**
   * Configuración específica de cuestionarios.
   */
  options?: ActivityOption[];

  /**
   * Identificador de simulador.
   *
   * Ejemplo:
   * 'road-to-glory'
   */
  simulatorId?: string;

  /**
   * Configuración adicional específica
   * de una actividad.
   */
  settings?: Record<string, unknown>;
}

// ============================================================
// CONTENIDO ESPECÍFICO DE ACTIVIDADES
// ============================================================

export interface VideoActivityContent {
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  guidingQuestions?: string[];
}

export interface QuestionnaireActivityContent {
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireQuestion {
  id: string;
  type:
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'long_answer'
    | 'numeric';
  text: string;
  options?: string[];
  points?: number;
  hint?: string;
}

export interface PreinformeActivityContent {
  instructions: string;
  fields: PreinformeField[];
}

export interface PreinformeField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'checkbox';
  options?: string[];
  placeholder?: string;
  required: boolean;
  hint?: string;
  unit?: string;
}

export interface LabPhysicalActivityContent {
  instructions: string;

  trialsConfig: {
    minTrials: number;
    maxTrials: number;
    defaultTrials: number;
  };

  fields: TrialField[];
}

export interface TrialField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'text_observation';
  unit?: string;
  required: boolean;
  hint?: string;
}

export interface SimulationActivityContent {
  simulatorId: string;
  instructions: string;
  config?: Record<string, unknown>;
}

export interface DataAnalysisActivityContent {
  instructions?: string;
  questions: QuestionnaireQuestion[];

  /**
   * IDs de actividades cuyos datos
   * serán utilizados en el análisis.
   */
  dataSources?: string[];
}

export interface EvaluationActivityContent {
  instructions?: string;
  questions: QuestionnaireQuestion[];
}

export interface ReflectionActivityContent {
  instructions?: string;
  questions: ReflectionQuestion[];

  minWords?: number;
  maxWords?: number;
}

export interface ReflectionQuestion {
  id: string;
  text: string;
  required?: boolean;
}

// ============================================================
// UNIÓN DISCRIMINADA DE CONTENIDO
// ============================================================

export type ActivityContent =
  | {
      type: 'video';
      data: VideoActivityContent;
    }
  | {
      type: 'questionnaire';
      data: QuestionnaireActivityContent;
    }
  | {
      type: 'preinforme';
      data: PreinformeActivityContent;
    }
  | {
      type: 'lab_physical';
      data: LabPhysicalActivityContent;
    }
  | {
      type: 'simulation';
      data: SimulationActivityContent;
    }
  | {
      type: 'data_analysis';
      data: DataAnalysisActivityContent;
    }
  | {
      type: 'evaluation';
      data: EvaluationActivityContent;
    }
  | {
      type: 'reflection';
      data: ReflectionActivityContent;
    };

// ============================================================
// ACTIVIDAD TELLUS
// ============================================================

export interface Activity {
  id: string;

  /**
   * Experiencia a la que pertenece.
   */
  experienceId: string;

  /**
   * Momento del ciclo de aprendizaje.
   *
   * Reemplaza stageId de la arquitectura anterior.
   */
  momentId: string;

  /**
   * Orden dentro del momento.
   */
  order: number;

  /**
   * Nombre visible para el estudiante.
   */
  title: string;

  /**
   * Descripción breve.
   */
  description?: string;

  /**
   * Tipo pedagógico de actividad.
   */
  type: ActivityType;

  /**
   * Objetivos de aprendizaje relacionados.
   */
  objectiveIds?: string[];

  /**
   * Recursos asociados.
   */
  resourceIds?: string[];

  /**
   * Configuración funcional.
   */
  config: ActivityConfig;

  /**
   * Contenido específico según el tipo.
   */
  content: ActivityContent;

  /**
   * Duración estimada en minutos.
   */
  estimatedDurationMinutes?: number;

  /**
   * Actividad opcional.
   *
   * Una actividad opcional puede aportar evidencia
   * sin bloquear el avance del momento.
   */
  isOptional?: boolean;

  /**
   * Publicación de la actividad.
   */
  published?: boolean;

  /**
   * Auditoría.
   */
  createdAt: unknown;
  updatedAt: unknown;
}