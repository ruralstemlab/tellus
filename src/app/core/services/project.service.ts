
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Project } from '../models/project.model';
import { db } from '../../../environments/firebase.config';

type ProjectEditionFields = {
  edition?: string;
  contestEdition?: string;
  editionId?: string;
  contestEditionLabel?: string;
};

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly collectionName = 'projects';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapProject(
    docSnap: QueryDocumentSnapshot<DocumentData>
  ): Project {
    const data = docSnap.data();

    console.log('[TELLUS HTML 2.0]', {
      id: docSnap.id,
      status: data['status'],
      edition: data['edition'],
      contestEdition: data['contestEdition'],
      editionId: data['editionId'],
      contestEditionLabel: data['contestEditionLabel'],
    });

    const toDate = (value: unknown): any => {
      if (value instanceof Timestamp) {
        return value.toDate();
      }
      return value;
    };

    const mapped = {
      id: docSnap.id,
      title: data['title'] || '',
      description: data['description'] || '',
      category: data['category'] || '',

      edition:
        data['edition'] ||
        data['contestEdition'] ||
        data['editionId'] ||
        '',

      contestEdition:
        data['contestEdition'] ||
        data['edition'] ||
        data['editionId'] ||
        '',

      editionId: data['editionId'] || '',
      contestEditionLabel: data['contestEditionLabel'] || '',

      studentName: data['studentName'] || '',
      studentEmail: data['studentEmail'] || '',
      institution: data['institution'] || '',
      grade: data['grade'] || '',
      status: data['status'] || 'pending',
      htmlContent: data['htmlContent'] || '',
      storagePath: data['storagePath'] || '',

      rating: data['rating'] || 0,
      ratingCount: data['ratingCount'] || 0,
      featured: data['featured'] || false,
      featuredAt: toDate(data['featuredAt']),
      views: data['views'] || 0,
      votes: data['votes'] || 0,

      reviewedBy: data['reviewedBy'] || '',
      reviewedAt: toDate(data['reviewedAt']),
      publishedAt: toDate(data['publishedAt']),
      uploadedAt: toDate(data['uploadedAt']),
      updatedAt: toDate(data['updatedAt']),
      submittedAt: toDate(data['submittedAt']),
      reviewNotes: data['reviewNotes'] || '',
    };

    return mapped as Project;
  }

  createProject(
    project: Omit<
      Project,
      | 'id'
      | 'uploadedAt'
      | 'updatedAt'
      | 'rating'
      | 'ratingCount'
      | 'featured'
      | 'views'
      | 'votes'
    >
  ): Observable<DocumentReference> {
    const now = new Date();
    const projectWithEdition =
      project as typeof project & ProjectEditionFields;

    const data = {
      ...project,
      uploadedAt: now,
      updatedAt: now,
      status: project.status || 'pending',
      rating: 0,
      ratingCount: 0,
      featured: false,
      views: 0,
      votes: 0,
      htmlContent: project.htmlContent || '',

      edition:
        projectWithEdition.edition ||
        projectWithEdition.contestEdition ||
        projectWithEdition.editionId ||
        '',

      contestEdition:
        projectWithEdition.contestEdition ||
        projectWithEdition.edition ||
        projectWithEdition.editionId ||
        '',

      editionId: projectWithEdition.editionId || '',
    };

    return from(addDoc(this.getCollection(), data));
  }

  updateProject(
    id: string,
    data: Partial<Project>
  ): Observable<void> {
    return from(
      updateDoc(doc(db, this.collectionName, id), {
        ...data,
        updatedAt: new Date(),
      })
    );
  }

  updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'published',
    reviewNotes?: string,
    rating?: number,
    featured?: boolean
  ): Observable<void> {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
      reviewedAt: new Date(),
    };

    if (reviewNotes !== undefined) {
      updateData['reviewNotes'] = reviewNotes;
    }

    if (rating !== undefined && rating > 0) {
      updateData['rating'] = rating;
      updateData['ratingCount'] = 1;
    }

    if (featured !== undefined) {
      updateData['featured'] = featured;

      if (featured) {
        updateData['featuredAt'] = new Date();
      }
    }

    if (status === 'published') {
      updateData['publishedAt'] = new Date();
    }

    return from(
      updateDoc(doc(db, this.collectionName, id), updateData)
    );
  }

  getProjects(status?: string): Observable<Project[]> {
    const constraints = status
      ? [
          where('status', '==', status),
          orderBy('uploadedAt', 'desc'),
        ]
      : [orderBy('uploadedAt', 'desc')];

    const projectsQuery = query(
      this.getCollection(),
      ...constraints
    );

    return from(getDocs(projectsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(docSnap => this.mapProject(docSnap))
      )
    );
  }

  getProject(id: string): Observable<Project | undefined> {
    return from(
      getDoc(doc(db, this.collectionName, id))
    ).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          return undefined;
        }

        return this.mapProject(
          docSnap as QueryDocumentSnapshot<DocumentData>
        );
      })
    );
  }

  getAllProjects(): Observable<Project[]> {
    const projectsQuery = query(
      this.getCollection(),
      orderBy('updatedAt', 'desc')
    );

    return from(getDocs(projectsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(docSnap => this.mapProject(docSnap))
      )
    );
  }

  getFeaturedProjects(): Observable<Project[]> {
    const projectsQuery = query(
      this.getCollection(),
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('featuredAt', 'desc')
    );

    return from(getDocs(projectsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(docSnap => this.mapProject(docSnap))
      )
    );
  }

  /**
   * Elimina un proyecto por su ID único de Firestore.
   * La autorización efectiva depende de las reglas de Firestore.
   */
  deleteProject(id: string): Observable<void> {
    if (!id?.trim()) {
      throw new Error(
        'El identificador del proyecto es obligatorio.'
      );
    }

    return from(
      deleteDoc(doc(db, this.collectionName, id))
    );
  }
}
