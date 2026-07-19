export interface Vote {
  id?: string; // ID compuesto: `${projectId}_${userId}`
  projectId: string;
  userId: string;
  rating: number; // 1-5
  createdAt: Date;
}