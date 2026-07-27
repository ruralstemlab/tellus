import { Timestamp } from 'firebase/firestore';

export interface AuditLog {
  id?: string;
  collection: string;
  documentId: string;
  action: 'created' | 'updated' | 'deleted' | 'issued' | 'revoked' | 'sent' | 'viewed' | 'downloaded';
  userId: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  before?: any;
  after?: any;
  details: string;
}