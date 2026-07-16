export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  studentName: string;
  studentEmail: string;
  institution: string;
  grade: string;
  status: 'pending' | 'approved' | 'published' | 'rejected';
  htmlContent: string;
  storagePath?: string;
  rating?: number;
  ratingCount?: number;
  featured?: boolean;
  featuredAt?: Date;
  views?: number;
  votes?: number;
  reviewedBy?: string;
  reviewedAt?: Date;
  publishedAt?: Date;
  uploadedAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewNotes?: string;
}