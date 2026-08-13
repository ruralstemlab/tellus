import { MomentType } from './experience.enums';

export interface Moment {
  id: string;

  experienceId: string;

  order: number;

  title: string;
  subtitle?: string;
  description?: string;

  type: MomentType;

  objectiveIds?: string[];

  activityIds: string[];

  resourceIds?: string[];

  estimatedDurationMinutes?: number;

  isOptional?: boolean;

  published?: boolean;

  createdAt: unknown;
  updatedAt: unknown;
}