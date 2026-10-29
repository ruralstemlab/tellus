
export interface Project {
  id?: string;

  // Edición del concurso.
  // Se conservan ambos campos para compatibilidad histórica.
  edition?: string;
  contestEdition?: string;

  title: string;
  description: string;
  category: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  institution: string;

  // Información del archivo HTML.
  htmlFileName: string;
  htmlSize: number;
  htmlLines: number;
  htmlContent: string;
  storagePath?: string;

  // Fechas del proyecto.
  uploadedAt: Date;
  updatedAt: Date;
  submittedAt?: Date;

  // Estado de revisión.
  status: 'pending' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;

  // Interacción y publicación.
  votes?: number;
  views?: number;
  rating?: number;
  ratingCount?: number;
  featured?: boolean;
  featuredAt?: Date;
  publishedAt?: Date;

  // Información de revisión.
  reviewedBy?: string;
  reviewedAt?: Date;
}
