import { Injectable } from '@angular/core';
import {
  collection,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Institution } from '../models/institution.model';
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class InstitutionService {
  private collectionName = 'institutions';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapInstitutionFromQuery(docSnap: QueryDocumentSnapshot<DocumentData>): Institution {
    const data = docSnap.data();
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      name: data['name'] || '',
      municipality: data['municipality'] || '',
      department: data['department'] || '',
      country: data['country'] || '',
      active: data['active'] ?? true,
      logoUrl: data['logoUrl'] || '',
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  }

  private mapInstitutionFromDoc(docSnap: DocumentSnapshot<DocumentData>): Institution | null {
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    if (!data) return null;
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      name: data['name'] || '',
      municipality: data['municipality'] || '',
      department: data['department'] || '',
      country: data['country'] || '',
      active: data['active'] ?? true,
      logoUrl: data['logoUrl'] || '',
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  }

  getInstitutions(): Observable<Institution[]> {
    const q = query(this.getCollection(), orderBy('name', 'asc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapInstitutionFromQuery(doc)))
    );
  }

  getActiveInstitutions(): Observable<Institution[]> {
    const q = query(
      this.getCollection(),
      where('active', '==', true),
      orderBy('name', 'asc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapInstitutionFromQuery(doc)))
    );
  }

  getInstitution(id: string): Observable<Institution | null> {
    const ref = doc(db, this.collectionName, id);
    return from(getDoc(ref)).pipe(
      map(docSnap => this.mapInstitutionFromDoc(docSnap))
    );
  }

  getInstitutionsCount(): Observable<number> {
    const q = query(this.getCollection(), where('active', '==', true));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.size)
    );
  }
}