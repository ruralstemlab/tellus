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
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Organization } from '../models/organization.model';
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private collectionName = 'organizations';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapOrganization(docSnap: QueryDocumentSnapshot<DocumentData>): Organization {
    const data = docSnap.data();
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      name: data['name'] || '',
      legalName: data['legalName'] || '',
      taxId: data['taxId'] || '',
      type: data['type'] || 'school',
      logoUrl: data['logoUrl'] || '',
      website: data['website'] || '',
      email: data['email'] || '',
      phone: data['phone'] || '',
      address: data['address'] || {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      signatories: data['signatories'] || [],
      settings: data['settings'] || {
        defaultTemplateId: '',
        verificationUrl: '',
        emailFooter: ''
      },
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  }

  getOrganizations(): Observable<Organization[]> {
    const q = query(this.getCollection(), orderBy('name', 'asc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapOrganization(doc)))
    );
  }

  getActiveOrganizations(): Observable<Organization[]> {
    const q = query(this.getCollection(), orderBy('name', 'asc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapOrganization(doc)))
    );
  }

  getOrganization(id: string): Observable<Organization | null> {
    const ref = doc(db, this.collectionName, id);
    return from(getDoc(ref)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) return null;
        return this.mapOrganization(docSnap as QueryDocumentSnapshot<DocumentData>);
      })
    );
  }

  createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const now = new Date();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    return from(addDoc(this.getCollection(), docData)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateOrganization(id: string, data: Partial<Organization>): Observable<void> {
    return from(updateDoc(doc(db, this.collectionName, id), { ...data, updatedAt: new Date() }));
  }

  deleteOrganization(id: string): Observable<void> {
    return from(deleteDoc(doc(db, this.collectionName, id)));
  }
}