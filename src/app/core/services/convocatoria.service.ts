import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Convocatoria } from '../models/convocatoria.model';
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class ConvocatoriaService {
  private collectionName = 'convocatorias';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapConvocatoria(docSnap: QueryDocumentSnapshot<DocumentData>): Convocatoria {
    const data = docSnap.data();
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      title: data['title'] || '',
      description: data['description'] || '',
      startDate: toDate(data['startDate']),
      endDate: toDate(data['endDate']),
      active: data['active'] || false,
      prizes: data['prizes'] || [],
      imageUrl: data['imageUrl'] || '',
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  }

  getActiveConvocatorias(): Observable<Convocatoria[]> {
    const q = query(
      this.getCollection(),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapConvocatoria(doc)))
    );
  }

  getAllConvocatorias(): Observable<Convocatoria[]> {
    const q = query(this.getCollection(), orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => this.mapConvocatoria(doc)))
    );
  }

  createConvocatoria(convocatoria: Omit<Convocatoria, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const now = new Date();
    const data = {
      ...convocatoria,
      createdAt: now,
      updatedAt: now,
    };
    return from(addDoc(this.getCollection(), data)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateConvocatoria(id: string, data: Partial<Convocatoria>): Observable<void> {
    return from(updateDoc(doc(db, this.collectionName, id), { ...data, updatedAt: new Date() }));
  }
}