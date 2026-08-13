// ============================================================
// TELLUS LEARNING — BARREL DE MODELOS
// ============================================================


// ============================================================
// ENUMS Y TIPOS
// ============================================================

export type {
  ExperienceStatus,
  ExperienceStructureType,
  ExperienceApproach,
  ExperienceTechRequirement,
  ExperienceDifficulty,
  MomentType,
  ActivityType,
  SubmissionStatus,
  FeedbackType,
  FeedbackVisibility,
  EvaluationStatus,
  ResourceType,
  StageType,
} from './experience.enums';


// ============================================================
// EXPERIENCE
// ============================================================

export type {
  Experience,
  LearningObjective,
} from './experience.model';


// ============================================================
// MOMENT
// ============================================================

export type {
  Moment,
} from './moment.model';


// ============================================================
// ACTIVITY
// ============================================================

export type {
  Activity,
  ActivityOption,
  ActivityConfig,
  ActivityContent,
  VideoActivityContent,
  QuestionnaireActivityContent,
  QuestionnaireQuestion,
  PreinformeActivityContent,
  PreinformeField,
  LabPhysicalActivityContent,
  TrialField,
  SimulationActivityContent,
  DataAnalysisActivityContent,
  EvaluationActivityContent,
  ReflectionActivityContent,
  ReflectionQuestion,
} from './activity.model';


// ============================================================
// SUBMISSION
// ============================================================

export type {
  Submission,
  SubmissionFile,
} from './submission.model';


// ============================================================
// PROGRESS
// ============================================================

export type {
  Progress,
} from './progress.model';


// ============================================================
// STAGE — LEGACY
// ============================================================

export type {
  Stage,
} from './stage.model';


// ============================================================
// EVALUATION
// ============================================================

export type {
  Evaluation,
} from './evaluation.model';


// ============================================================
// FEEDBACK
// ============================================================

export type {
  Feedback,
} from './feedback.model';


// ============================================================
// RESOURCE
// ============================================================

export type {
  Resource,
} from './resource.model';