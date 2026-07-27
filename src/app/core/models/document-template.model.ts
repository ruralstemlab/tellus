import { Timestamp } from 'firebase/firestore';

export interface DocumentTemplate {
  id?: string;
  name: string;
  type: 'certificate' | 'diploma' | 'badge' | 'award' | 'mention' | 'accreditation' | 'participation';
  organizationId: string;
  version: number;
  isActive: boolean;
  htmlContent: string;
  cssContent: string;
  styles: {
    backgroundColor: string;
    fontFamily: string;
    color: string;
    textAlign: string;
    layout: string;
  };
  placeholders: {
    name: string;
    type: 'text' | 'date' | 'image' | 'qr';
    description: string;
    defaultValue: string;
  }[];
  preview: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}