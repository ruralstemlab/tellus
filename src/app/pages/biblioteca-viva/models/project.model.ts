export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  institution: string;
  // Ya no usamos storagePath ni htmlFileName (pero los mantenemos por compatibilidad)
  htmlFileName: string;
  htmlSize: number;
  htmlLines: number;
  htmlContent: string; // ← NUEVO: contenido completo del HTML
  storagePath?: string; // Opcional, ya no se usa
  uploadedAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;
  votes?: number;
  views?: number;
}