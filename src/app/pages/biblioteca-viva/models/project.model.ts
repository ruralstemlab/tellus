export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  institution: string;
  htmlFileName: string;
  htmlSize: number;
  htmlLines: number;
  storagePath: string;
  uploadedAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;
  votes?: number;
  views?: number;
  // Propiedades que pide admin-panel y galeria:
  submittedAt?: Date; // Si no está en Firestore, lo podemos calcular a partir de uploadedAt
  htmlContent?: string; // No se guarda en Firestore, se usa para vista previa en base64
}