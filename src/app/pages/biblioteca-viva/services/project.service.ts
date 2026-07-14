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
  deleteDoc,
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

  createProject(project: Omit<Project, 'id' | 'uploadedAt' | 'updatedAt'>): Observable<DocumentReference> {
    const now = new Date();
    const data = {
      ...project,
      uploadedAt: now,
      updatedAt: now,
      status: project.status || 'pending',
      votes: 0,
      views: 0,
      // Asignamos submittedAt igual a uploadedAt si no viene
      submittedAt: project.submittedAt || now,
    };
    const col = this.getCollection();
    return from(addDoc(col, data));
  }

  updateProject(id: string, data: Partial<Project>): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    return from(updateDoc(ref, { ...data, updatedAt: new Date() }));
  }

  // Nuevo método: actualizar el estado del proyecto (aprobado, rechazado, publicado)
  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected' | 'published', reviewNotes?: string): Observable<void> {
    const ref = doc(db, this.collectionName, id);
    const updateData: any = { status, updatedAt: new Date() };
    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }
    return from(updateDoc(ref, updateData));
  }

  // Obtener proyectos publicados (para la galería)
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

  // Método adicional para obtener HTML en base64 (para vista previa en admin-panel)
  // Este método no usa Firestore, solo devuelve el contenido que ya está en el objeto Project
  // Si necesitas cargar el contenido desde Storage, tendrías que usar StorageService.
  // Pero aquí lo dejamos como un helper.
  getHtmlBase64(htmlContent: string): string {
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  }

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