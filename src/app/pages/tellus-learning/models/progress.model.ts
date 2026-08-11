export interface Progress {
  id: string;

  experienceId: string;
  studentId: string;

  completedStageIds: string[];

  completedActivityIds: string[];

  currentStageId?: string;

  currentActivityId?: string;

  totalActivities: number;

  completedActivities: number;

  progressPercentage: number;

  averageScore?: number;

  lastSubmissionId?: string;

  lastEvaluationId?: string;

  updatedAt: unknown;
}