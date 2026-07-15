import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Project } from '../models/project.model';
import { db } from '../../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private collectionName = 'projects';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  // Crear proyecto con htmlContent
  createProject(project: Omit<Project, 'id' | 'uploadedAt' | 'updatedAt'>): Observable<DocumentReference> {
    const now = new Date();
    const data = {
      ...project,
      uploadedAt: now,
      updatedAt: now,
      status: project.status || 'pending',
      votes: 0,
      views: 0,
      // Aseguramos que htmlContent esté presente
      htmlContent: project.htmlContent || '',
    };
    const col = this.getCollection();
    return from(addDoc(col, data));
  }

  updateProject(id: string, data: Partial<Project>): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    return from(updateDoc(ref, { ...data, updatedAt: new Date() }));
  }

  // Método para actualizar el estado (usado en admin-panel)
  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected' | 'published', reviewNotes?: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const updateData: any = { status, updatedAt: new Date() };
    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }
    return from(updateDoc(ref, updateData));
  }

  // Obtener proyectos publicados (para galería)
  getPublished(): Observable<Project[]> {
    const col = this.getCollection();
    const q = query(col, where('status', '==', 'published'), orderBy('updatedAt', 'desc'));
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          return { id: docSnap.id, ...data } as Project;
        })
      )
    );
  }

  // Obtener un proyecto por ID
  getProject(id: string): Observable<Project | undefined> {
    const ref = doc(db, this.collectionName, id);
    return from(getDoc(ref)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          return { id: docSnap.id, ...data } as Project;
        }
        return undefined;
      })
    );
  }

  // Obtener proyectos por estado (para admin)
  getProjects(status?: string): Observable<Project[]> {
    const col = this.getCollection();
    const constraints = status
      ? [where('status', '==', status), orderBy('uploadedAt', 'desc')]
      : [orderBy('uploadedAt', 'desc')];
    const q = query(col, ...constraints);
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          return { id: docSnap.id, ...data } as Project;
        })
      )
    );
  }
}