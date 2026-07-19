export interface Convocatoria {
  id?: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  prizes: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}