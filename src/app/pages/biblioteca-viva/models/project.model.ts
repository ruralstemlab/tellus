
export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;

  // Edición del concurso
  edition?: string;
  contestEdition?: string;
  editionId?: string;

  // Datos del estudiante
  studentName: string;
  studentEmail: string;
  institution: string;
  grade: string;

  // Estado
  status: 'pending' | 'approved' | 'published' | 'rejected';

  // Archivo HTML
  htmlContent: string;
  htmlFileName: string;
  htmlSize: number;
  htmlLines: number;
  storagePath?: string;

  // Calificación y participación
  rating: number;
  ratingCount: number;
  featured: boolean;
  featuredAt?: Date;
  views: number;
  votes: number;

  // Revisión y publicación
  reviewedBy?: string;
  reviewedAt?: Date;
  publishedAt?: Date;
  uploadedAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewNotes?: string;
}
