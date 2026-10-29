
export interface Project {
  id?: string;

  // Edición del concurso. Campo opcional para compatibilidad histórica.
  edition?: string;

  title: string;
  description: string;
  category: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  institution: string;

  // Información del archivo HTML
  htmlFileName: string;
  htmlSize: number;
  htmlLines: number;
  htmlContent: string;
  storagePath?: string;

  uploadedAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;
  votes?: number;
  views?: number;
}
