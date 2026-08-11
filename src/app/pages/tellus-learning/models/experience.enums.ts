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

export type StageType =
  | 'motivacion'
  | 'exploracion'
  | 'prediccion'
  | 'experimentacion'
  | 'analisis'
  | 'creacion'
  | 'actividad'
  | 'evaluacion'
  | 'reflexion'
  | 'cierre'
  | 'custom';

export type ActivityType =
  | 'quiz'
  | 'open'
  | 'simulation'
  | 'evidence'
  | 'reflection'
  | 'external';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'evaluated'
  | 'returned';

export type FeedbackType =
  | 'teacher'
  | 'system';

export type EvaluationStatus =
  | 'in_progress'
  | 'completed';

export type ResourceType =
  | 'document'
  | 'video'
  | 'image'
  | 'link'
  | 'simulation'
  | 'download';

export type FeedbackVisibility =
  | 'student'
  | 'teacher'
  | 'private';