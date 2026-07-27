import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  increment,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Credential } from '../models/credential.model';
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private collectionName = 'credentials';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private mapCredential(docSnap: QueryDocumentSnapshot<DocumentData>): Credential {
    const data = docSnap.data();
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      credentialNumber: data['credentialNumber'] || '',
      verificationCode: data['verificationCode'] || '',
      uuid: data['uuid'] || '',
      userId: data['userId'] || '',
      projectId: data['projectId'] || '',
      organizationId: data['organizationId'] || '',
      institutionId: data['institutionId'] || '',
      credentialType: data['credentialType'] || 'certificate',
      credentialCategory: data['credentialCategory'] || 'concurso',
      recognition: data['recognition'] || '',
      title: data['title'] || '',
      description: data['description'] || '',
      grade: data['grade'] || '',
      level: data['level'] || '',
      points: data['points'] || 0,
      issueDate: toDate(data['issueDate']),
      expirationDate: data['expirationDate'] ? toDate(data['expirationDate']) : null,
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
      deletedAt: data['deletedAt'] ? toDate(data['deletedAt']) : null,
      status: data['status'] || 'draft',
      isPublic: data['isPublic'] || false,
      isVerified: data['isVerified'] || false,
      signatories: data['signatories'] || [],
      pdfUrl: data['pdfUrl'] || '',
      htmlUrl: data['htmlUrl'] || '',
      thumbnailUrl: data['thumbnailUrl'] || '',
      qrCodeUrl: data['qrCodeUrl'] || '',
      emailSent: data['emailSent'] || false,
      emailSentAt: toDate(data['emailSentAt']),
      emailError: data['emailError'] || null,
      emailAttempts: data['emailAttempts'] || 0,
      viewedAt: toDate(data['viewedAt']),
      auditLog: data['auditLog'] || [],
      templateId: data['templateId'] || '',
      templateVersion: data['templateVersion'] || 1,
      customFields: data['customFields'] || {},
    };
  }

  getCredentials(): Observable<Credential[]> {
    const q = query(this.getCollection(), orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapCredential(doc)))
    );
  }

  getCredentialByUuid(uuid: string): Observable<Credential | null> {
    const q = query(this.getCollection(), where('uuid', '==', uuid));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) return null;
        return this.mapCredential(snapshot.docs[0]);
      })
    );
  }

  getUserCredentials(userId: string): Observable<Credential[]> {
    const q = query(
      this.getCollection(),
      where('userId', '==', userId),
      orderBy('issueDate', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapCredential(doc)))
    );
  }

  getPublicUserCredentials(userId: string): Observable<Credential[]> {
    const q = query(
      this.getCollection(),
      where('userId', '==', userId),
      where('isPublic', '==', true),
      orderBy('issueDate', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapCredential(doc)))
    );
  }

  getCredential(id: string): Observable<Credential | null> {
    const ref = doc(db, this.collectionName, id);
    return from(getDoc(ref)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) return null;
        return this.mapCredential(docSnap as QueryDocumentSnapshot<DocumentData>);
      })
    );
  }

  createCredential(data: Partial<Credential>): Observable<string> {
    const now = new Date();
    const credentialData = {
      ...data,
      verificationCode: this.generateUUID(),
      uuid: this.generateUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      emailSent: false,
      isPublic: false,
      isVerified: false,
      auditLog: [
        {
          action: 'created',
          userId: data.userId || '',
          timestamp: now,
          ip: '',
          userAgent: '',
          details: 'Credencial creada en borrador'
        }
      ]
    };
    return from(addDoc(this.getCollection(), credentialData)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateCredential(id: string, data: Partial<Credential>): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    return from(updateDoc(ref, updateData));
  }

  issueCredential(id: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const now = new Date();
    return from(updateDoc(ref, {
      status: 'issued',
      issueDate: now,
      updatedAt: now,
      isVerified: true,
      auditLog: [
        {
          action: 'issued',
          userId: '',
          timestamp: now,
          ip: '',
          userAgent: '',
          details: 'Credencial emitida'
        }
      ]
    }));
  }

  revokeCredential(id: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const now = new Date();
    return from(updateDoc(ref, {
      status: 'revoked',
      updatedAt: now,
      isVerified: false,
      auditLog: [
        {
          action: 'revoked',
          userId: '',
          timestamp: now,
          ip: '',
          userAgent: '',
          details: 'Credencial revocada'
        }
      ]
    }));
  }

  deleteCredential(id: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const now = new Date();
    return from(updateDoc(ref, {
      deletedAt: now,
      status: 'deleted',
      updatedAt: now
    }));
  }

  countCredentialsByOrganization(organizationId: string): Observable<number> {
    const q = query(
      this.getCollection(),
      where('organizationId', '==', organizationId),
      where('status', '==', 'issued')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.size)
    );
  }

  countCredentialsByType(type: string): Observable<number> {
    const q = query(
      this.getCollection(),
      where('credentialType', '==', type),
      where('status', '==', 'issued')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.size)
    );
  }

  // ==========================================================
  //  ✅ GESTIÓN DE ESTADO DE CORREO
  // ==========================================================

  markEmailSent(id: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    return from(updateDoc(ref, {
      emailSent: true,
      emailSentAt: new Date(),
      emailError: null,
      emailAttempts: 0
    }));
  }

  markEmailFailed(id: string, error: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    return from(updateDoc(ref, {
      emailSent: false,
      emailError: error,
      emailAttempts: increment(1)
    }));
  }
}