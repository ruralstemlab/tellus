import {
  ExperienceApproach,
  ExperienceDifficulty,
  ExperienceStatus,
  ExperienceStructureType,
  ExperienceTechRequirement,
} from './experience.enums';

// ============================================================
// OBJETIVOS DE APRENDIZAJE
// ============================================================

export interface LearningObjective {
  id: string;
  description: string;
}

// ============================================================
// EXPERIENCIA DE APRENDIZAJE TELLUS
// ============================================================

export interface Experience {
  id: string;

  // ----------------------------------------------------------
  // Identidad
  // ----------------------------------------------------------

  title: string;
  subtitle?: string;
  description: string;

  // ----------------------------------------------------------
  // Contexto curricular
  // ----------------------------------------------------------

  subject: string;
  gradeLevel?: string;
  curriculumArea?: string;

  // ----------------------------------------------------------
  // Propósito pedagógico
  // ----------------------------------------------------------

  purpose: string;
  challenge: string;

  learningObjectives: LearningObjective[];

  // ----------------------------------------------------------
  // Diseño de la experiencia
  // ----------------------------------------------------------

  structureType: ExperienceStructureType;

  approaches: ExperienceApproach[];

  // ----------------------------------------------------------
  // Requisitos tecnológicos
  // ----------------------------------------------------------

  techRequirement: ExperienceTechRequirement;

  difficulty: ExperienceDifficulty;

  estimatedDurationMinutes?: number;

  // ----------------------------------------------------------
  // Identidad visual
  // ----------------------------------------------------------

  thumbnailUrl?: string;
  coverUrl?: string;

  // ----------------------------------------------------------
  // Publicación y ciclo de vida
  // ----------------------------------------------------------

  status: ExperienceStatus;

  // ----------------------------------------------------------
  // Autoría
  // ----------------------------------------------------------

  createdBy: string;

  // ----------------------------------------------------------
  // Auditoría
  // ----------------------------------------------------------

  createdAt: unknown;
  updatedAt: unknown;

  publishedAt?: unknown;
}