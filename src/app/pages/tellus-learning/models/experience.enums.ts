// ============================================================
// TELLUS LEARNING — ENUMS Y TIPOS BASE
// ============================================================


// ============================================================
// EXPERIENCIAS
// ============================================================

export type ExperienceStatus =
  | 'draft'
  | 'review'
  | 'published'
  | 'pilot'
  | 'archived'
  | 'deprecated';

export type ExperienceStructureType =
  | 'lineal'
  | 'ramificada'
  | 'abierta'
  | 'hibrida';

export type ExperienceApproach =
  | 'experimental'
  | 'creativa'
  | 'investigativa'
  | 'proyectual'
  | 'colaborativa'
  | 'reflexiva'
  | 'ludica';

export type ExperienceTechRequirement =
  | 'ninguno'
  | 'internet'
  | 'dispositivo'
  | 'simulador';

export type ExperienceDifficulty =
  | 'introductorio'
  | 'basico'
  | 'intermedio'
  | 'avanzado';


// ============================================================
// MOMENTOS — CICLO CIRCULAR TELLUS
// ============================================================

export type MomentType =
  | 'motivacion'
  | 'exploracion'
  | 'prediccion'
  | 'experimentacion'
  | 'construccion'
  | 'analisis_evaluacion'
  | 'reflexion';


// ============================================================
// ACTIVIDADES
// ============================================================

export type ActivityType =
  | 'video'
  | 'questionnaire'
  | 'preinforme'
  | 'lab_physical'
  | 'simulation'
  | 'data_analysis'
  | 'evaluation'
  | 'reflection'

  // Compatibilidad con arquitectura anterior
  | 'quiz'
  | 'open'
  | 'evidence'
  | 'external';


// ============================================================
// SUBMISSIONS
// ============================================================

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'evaluated'
  | 'returned';


// ============================================================
// FEEDBACK
// ============================================================

export type FeedbackType =
  | 'teacher'
  | 'system';

export type FeedbackVisibility =
  | 'student'
  | 'teacher'
  | 'private';


// ============================================================
// EVALUACIÓN
// ============================================================

export type EvaluationStatus =
  | 'in_progress'
  | 'completed';


// ============================================================
// RECURSOS
// ============================================================

export type ResourceType =
  | 'document'
  | 'video'
  | 'image'
  | 'link'
  | 'simulation'
  | 'download';


// ============================================================
// COMPATIBILIDAD LEGACY
// ============================================================

/**
 * @deprecated Usar MomentType.
 */
export type StageType = MomentType;