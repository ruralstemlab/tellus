import {
  FeedbackType,
  FeedbackVisibility,
} from './experience.enums';

export interface Feedback {
  id: string;

  submissionId: string;

  studentId: string;

  authorId: string;

  type: FeedbackType;

  visibility: FeedbackVisibility;

  message: string;

  strengths?: string[];

  improvementSuggestions?: string[];

  createdAt: unknown;
  updatedAt: unknown;
}