export interface Credential {
  id?: string;

  // Datos de identificación
  credentialNumber: string;
  verificationCode: string;
  uuid: string;

  // Relaciones
  userId: string;
  projectId: string;
  organizationId: string;
  institutionId: string;

  // Tipo y categoría
  credentialType: string; // 'certificate' | 'diploma' | 'badge' | ...
  credentialCategory: string;

  // Contenido
  recognition: string;
  title: string;
  description: string;
  grade: string;
  level: string;
  points: number;

  // Fechas
  issueDate: Date | null;
  expirationDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  // Estado y visibilidad
  status: 'draft' | 'issued' | 'sent' | 'viewed' | 'revoked' | 'expired' | 'deleted';
  isPublic: boolean;
  isVerified: boolean;

  // Documentos
  signatories: string[];
  pdfUrl: string;
  htmlUrl: string;
  thumbnailUrl: string;
  qrCodeUrl: string;

  // ✅ Estado del correo (Sprint 6)
  emailSent: boolean;
  emailSentAt: Date | null;
  emailError: string | null;
  emailAttempts: number;

  // Auditoría
  viewedAt: Date | null;
  auditLog: any[];
  templateId: string;
  templateVersion: number;
  customFields: Record<string, any>;
}