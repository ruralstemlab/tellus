
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
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
import { db } from '../../../../environments/firebase.config';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly collectionName = 'projects';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapProject(
    docSnap: QueryDocumentSnapshot<DocumentData>
  ): Project {
    const data = docSnap.data();

    const toDate = (value: unknown): Date | undefined => {
      if (value instanceof Timestamp) return value.toDate();
      if (value instanceof Date) return value;
      return undefined;
    };

    return {
      id: docSnap.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? '',

      edition:
        data['edition'] ??
        data['contestEdition'] ??
        data['editionId'] ??
        '',
      contestEdition:
        data['contestEdition'] ??
        data['edition'] ??
        data['editionId'] ??
        '',
      editionId: data['editionId'] ?? '',

      studentName: data['studentName'] ?? '',
      studentEmail: data['studentEmail'] ?? '',
      institution: data['institution'] ?? '',
      grade: data['grade'] ?? '',
      status: data['status'] ?? 'pending',

      htmlContent: data['htmlContent'] ?? '',
      htmlFileName: data['htmlFileName'] ?? '',
      htmlSize: Number(data['htmlSize'] ?? 0),
      htmlLines: Number(data['htmlLines'] ?? 0),
      storagePath: data['storagePath'] ?? '',

      rating: Number(data['rating'] ?? 0),
      ratingCount: Number(data['ratingCount'] ?? 0),
      featured: Boolean(data['featured'] ?? false),
      featuredAt: toDate(data['featuredAt']),
      views: Number(data['views'] ?? 0),
      votes: Number(data['votes'] ?? 0),

      reviewedBy: data['reviewedBy'] ?? '',
      reviewedAt: toDate(data['reviewedAt']),
      publishedAt: toDate(data['publishedAt']),
      uploadedAt: toDate(data['uploadedAt']) ?? new Date(0),
      updatedAt: toDate(data['updatedAt']) ?? new Date(0),
      submittedAt: toDate(data['submittedAt']),
      reviewNotes: data['reviewNotes'] ?? '',
    };
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

    const data = {
      ...project,
      edition:
        project.edition ||
        project.contestEdition ||
        project.editionId ||
        '',
      contestEdition:
        project.contestEdition ||
        project.edition ||
        project.editionId ||
        '',
      uploadedAt: now,
      updatedAt: now,
      status: project.status || 'pending',
      rating: 0,
      ratingCount: 0,
      featured: false,
      views: 0,
      votes: 0,
      htmlContent: project.htmlContent || '',
      htmlFileName: project.htmlFileName || '',
      htmlSize: project.htmlSize || 0,
      htmlLines: project.htmlLines || 0,
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
    status: 'pending' | 'approved' | 'published' | 'rejected',
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
      map((snapshot) =>
        snapshot.docs.map((docSnap) => this.mapProject(docSnap))
      )
    );
  }

  getProject(id: string): Observable<Project | undefined> {
    return from(
      getDoc(doc(db, this.collectionName, id))
    ).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) return undefined;

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
      map((snapshot) =>
        snapshot.docs.map((docSnap) => this.mapProject(docSnap))
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
      map((snapshot) =>
        snapshot.docs.map((docSnap) => this.mapProject(docSnap))
      )
    );
  }
}
