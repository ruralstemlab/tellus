export interface AnswerKeyOption {
  optionId: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface AnswerKey {
  id: string;

  activityId: string;

  type: 'single-choice' | 'multiple-choice' | 'numeric' | 'text';

  correctOptionId?: string;

  correctOptionIds?: string[];

  correctValue?: number;

  acceptedAnswers?: string[];

  options?: AnswerKeyOption[];

  explanation?: string;

  createdAt: unknown;
  updatedAt: unknown;
}