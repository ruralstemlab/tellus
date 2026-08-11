import { EvaluationStatus } from './experience.enums';

export interface EvaluationCriterion {
  id: string;

  name: string;

  description?: string;

  score: number;

  maxScore: number;

  feedback?: string;
}

export interface Evaluation {
  id: string;

  submissionId: string;

  activityId: string;

  experienceId: string;

  studentId: string;

  evaluatorId?: string;

  status: EvaluationStatus;

  score: number;

  maxScore: number;

  percentage?: number;

  criteria?: EvaluationCriterion[];

  generalComment?: string;

  evaluatedAt?: unknown;

  createdAt: unknown;
  updatedAt: unknown;
}