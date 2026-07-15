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
  Timestamp,
} from 'firebase/firestore';

import { Observable, from, map } from 'rxjs';

import { Project } from '../models/project.model';
import { db } from '../../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private collectionName = 'projects';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  /**
   * 🔥 Convierte un documento de Firestore a un objeto Project
   * con los campos Timestamp transformados a Date.
   */
  private mapProject(docSnap: QueryDocumentSnapshot<DocumentData>): Project {
    const data = docSnap.data();

    const toDate = (value: any): any => {
      if (value instanceof Timestamp) {
        return value.toDate();
      }
      return value;
    };

    // Construir el objeto y hacer cast con 'unknown' para evitar errores de tipo
    const project = {
      id: docSnap.id,
      ...data,
      uploadedAt: toDate(data['uploadedAt']),
      updatedAt: toDate(data['updatedAt']),
      submittedAt: toDate(data['submittedAt']),
    } as unknown as Project;

    console.log('✅ mapProject: fecha convertida =>', project.uploadedAt);
    return project;
  }

  /**
   * Crear proyecto
   */
  createProject(
    project: Omit<Project, 'id' | 'uploadedAt' | 'updatedAt'>
  ): Observable<DocumentReference> {

    const now = new Date();

    const data = {
      ...project,
      uploadedAt: now,
      updatedAt: now,
      status: project.status || 'pending',
      votes: 0,
      views: 0,
      htmlContent: project.htmlContent || '',
    };

    return from(
      addDoc(this.getCollection(), data)
    );

  }

  /**
   * Actualizar proyecto
   */
  updateProject(
    id: string,
    data: Partial<Project>
  ): Observable<void> {

    return from(
      updateDoc(
        doc(db, this.collectionName, id),
        {
          ...data,
          updatedAt: new Date()
        }
      )
    );

  }

  /**
   * Actualizar estado
   */
  updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'published',
    reviewNotes?: string
  ): Observable<void> {

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }

    return from(
      updateDoc(
        doc(db, this.collectionName, id),
        updateData
      )
    );

  }

  /**
   * Proyectos publicados
   */
  getPublished(): Observable<Project[]> {

    const q = query(
      this.getCollection(),
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(docSnap => this.mapProject(docSnap));
      })
    );

  }

  /**
   * Obtener un proyecto por ID
   */
  getProject(id: string): Observable<Project | undefined> {

    return from(
      getDoc(doc(db, this.collectionName, id))
    ).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          return undefined;
        }
        const data = docSnap.data();
        const toDate = (value: any): any => {
          if (value instanceof Timestamp) {
            return value.toDate();
          }
          return value;
        };
        return {
          id: docSnap.id,
          ...data,
          uploadedAt: toDate(data['uploadedAt']),
          updatedAt: toDate(data['updatedAt']),
          submittedAt: toDate(data['submittedAt']),
        } as unknown as Project;
      })
    );

  }

  /**
   * Obtener todos los proyectos (con filtro opcional por estado)
   */
  getProjects(status?: string): Observable<Project[]> {

    const constraints = status
      ? [
          where('status', '==', status),
          orderBy('uploadedAt', 'desc')
        ]
      : [
          orderBy('uploadedAt', 'desc')
        ];

    const q = query(
      this.getCollection(),
      ...constraints
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(docSnap => this.mapProject(docSnap));
      })
    );

  }

}