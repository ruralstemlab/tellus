import { SubmissionStatus } from './experience.enums';

export interface SubmissionFile {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
}

export interface Submission {
  id: string;

  activityId: string;
  experienceId: string;
  studentId: string;

  response?: unknown;

  files?: SubmissionFile[];

  attemptNumber: number;

  isCorrection: boolean;
  correctedFrom?: string;

  status: SubmissionStatus;

  score?: number;
  maxScore?: number;

  evaluatedBy?: string;
  evaluatedAt?: unknown;

  createdAt: unknown;
  updatedAt: unknown;
  submittedAt?: unknown;
}