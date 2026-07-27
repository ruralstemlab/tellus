import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id?: string;
  name: string;
  legalName: string;
  taxId: string;
  type: 'school' | 'university' | 'company' | 'government' | 'ngo' | 'other';
  logoUrl: string;
  website: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  signatories: {
    userId: string;
    name: string;
    role: string;
    position: string;
    isActive: boolean;
  }[];
  settings: {
    defaultTemplateId: string;
    verificationUrl: string;
    emailFooter: string;
  };
  createdAt: Date;
  updatedAt: Date;
}