import { MomentType } from './experience.enums';

export interface Moment {
  id: string;

  experienceId: string;

  order: number;

  title: string;

  subtitle?: string;

  description?: string;

  type: MomentType;

  /**
   * Imagen principal del momento.
   *
   * Ejemplo:
   * /assets/tellus-learning/agua/momento-01-territorio.png
   */
  image?: string;

  objectiveIds?: string[];

  activityIds: string[];

  resourceIds?: string[];

  estimatedDurationMinutes?: number;

  isOptional?: boolean;

  published?: boolean;

  createdAt: unknown;

  updatedAt: unknown;
}