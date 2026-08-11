import { StageType } from './experience.enums';

export interface Stage {
  id: string;

  experienceId: string;

  order: number;

  title: string;
  subtitle?: string;
  description?: string;

  type: StageType;

  objectiveIds?: string[];

  activityIds: string[];

  resourceIds?: string[];

  estimatedDurationMinutes?: number;

  isOptional?: boolean;

  createdAt: unknown;
  updatedAt: unknown;
}