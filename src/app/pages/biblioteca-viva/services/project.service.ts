
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
   * Convierte un documento de Firestore a Project.
   * Los campos Timestamp se convierten a Date.
   * Los demás campos, incluida edition, se conservan.
   */
  private mapProject(
    docSnap: QueryDocumentSnapshot<DocumentData>
  ): Project {

    const data = docSnap.data();

    const toDate = (value: any): any => {
      if (value instanceof Timestamp) {
        return value.toDate();
      }
      return value;
    };

    const project = {
      id: docSnap.id,
      ...data,
      uploadedAt: toDate(data['uploadedAt']),
      updatedAt: toDate(data['updatedAt']),
      submittedAt: toDate(data['submittedAt']),
    } as unknown as Project;

    console.log(
      '✅ mapProject: fecha convertida =>',
      project.uploadedAt
    );

    return project;
  }

  /**
   * Crea un proyecto nuevo.
   * addDoc genera un ID independiente para cada envío.
   * No sobrescribe los documentos existentes.
   */
  createProject(
    project: Omit<Project, 'id' | 'uploadedAt' | 'updatedAt'>
  ): Observable<DocumentReference> {

    const now = new Date();

    // Conserva la edición enviada por el formulario.
    // Si no existe, clasifica el nuevo envío como HTML 2.0.
    const projectWithEdition =
      project as typeof project & { edition?: string };

    const data = {
      ...projectWithEdition,
      edition: projectWithEdition.edition ?? 'html-2-0',
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
   * Actualiza un proyecto existente.
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
   * Actualiza el estado de un proyecto existente.
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
   * Obtiene los proyectos publicados.
   */
  getPublished(): Observable<Project[]> {

    const q = query(
      this.getCollection(),
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          docSnap => this.mapProject(docSnap)
        )
      )
    );
  }

  /**
   * Obtiene un proyecto por ID.
   */
  getProject(
    id: string
  ): Observable<Project | undefined> {

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
   * Obtiene todos los proyectos,
   * opcionalmente filtrados por estado.
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
      map(snapshot =>
        snapshot.docs.map(
          docSnap => this.mapProject(docSnap)
        )
      )
    );
  }
}
