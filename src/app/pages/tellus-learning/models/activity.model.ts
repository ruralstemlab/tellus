import { ActivityType } from './experience.enums';

export interface ActivityOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface ActivityConfig {
  autoEvaluate?: boolean;
  maxAttempts?: number;
  requiresSubmission?: boolean;
  graded?: boolean;
  maxScore?: number;

  options?: ActivityOption[];

  simulatorId?: string;

  settings?: Record<string, unknown>;
}

export interface Activity {
  id: string;

  experienceId: string;
  stageId: string;

  order: number;

  title: string;
  description?: string;

  type: ActivityType;

  objectiveIds?: string[];

  resourceIds?: string[];

  config?: ActivityConfig;

  estimatedDurationMinutes?: number;

  isOptional?: boolean;

  createdAt: unknown;
  updatedAt: unknown;
}