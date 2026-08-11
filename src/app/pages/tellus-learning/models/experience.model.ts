import {
  ExperienceApproach,
  ExperienceDifficulty,
  ExperienceStatus,
  ExperienceStructureType,
  ExperienceTechRequirement,
} from './experience.enums';

export interface LearningObjective {
  id: string;
  description: string;
}

export interface Experience {
  id: string;

  title: string;
  subtitle?: string;
  description: string;

  subject: string;
  gradeLevel?: string;
  curriculumArea?: string;

  purpose: string;
  challenge: string;

  learningObjectives: LearningObjective[];

  structureType: ExperienceStructureType;
  approaches: ExperienceApproach[];

  techRequirement: ExperienceTechRequirement;
  difficulty: ExperienceDifficulty;

  estimatedDurationMinutes?: number;

  thumbnailUrl?: string;
  coverUrl?: string;

  stageIds: string[];

  status: ExperienceStatus;

  createdBy: string;

  createdAt: unknown;
  updatedAt: unknown;

  publishedAt?: unknown;
}