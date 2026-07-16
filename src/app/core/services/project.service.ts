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
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private collectionName = 'projects';

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private mapProject(docSnap: QueryDocumentSnapshot<DocumentData>): Project {
    const data = docSnap.data();
    const toDate = (value: any): any => {
      if (value instanceof Timestamp) return value.toDate();
      return value;
    };
    return {
      id: docSnap.id,
      title: data['title'] || '',
      description: data['description'] || '',
      category: data['category'] || '',
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
  }

  createProject(project: Omit<Project, 'id' | 'uploadedAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'featured' | 'views' | 'votes'>): Observable<DocumentReference> {
    const now = new Date();
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
    };
    return from(addDoc(this.getCollection(), data));
  }

  updateProject(id: string, data: Partial<Project>): Observable<void> {
    return from(updateDoc(doc(db, this.collectionName, id), { ...data, updatedAt: new Date() }));
  }

  updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'published',
    reviewNotes?: string,
    rating?: number,
    featured?: boolean
  ): Observable<void> {
    const updateData: any = { status, updatedAt: new Date(), reviewedAt: new Date() };
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (rating !== undefined && rating > 0) {
      updateData.rating = rating;
      updateData.ratingCount = 1;
    }
    if (featured !== undefined) {
      updateData.featured = featured;
      if (featured) updateData.featuredAt = new Date();
    }
    if (status === 'published') updateData.publishedAt = new Date();
    return from(updateDoc(doc(db, this.collectionName, id), updateData));
  }

  getProjects(status?: string): Observable<Project[]> {
    const constraints = status
      ? [where('status', '==', status), orderBy('uploadedAt', 'desc')]
      : [orderBy('uploadedAt', 'desc')];
    const q = query(this.getCollection(), ...constraints);
    return from(getDocs(q)).pipe(map(snapshot => snapshot.docs.map(doc => this.mapProject(doc))));
  }

  getProject(id: string): Observable<Project | undefined> {
    return from(getDoc(doc(db, this.collectionName, id))).pipe(
      map(docSnap => {
        if (!docSnap.exists()) return undefined;
        return this.mapProject(docSnap as QueryDocumentSnapshot<DocumentData>);
      })
    );
  }

  getAllProjects(): Observable<Project[]> {
    const q = query(this.getCollection(), orderBy('updatedAt', 'desc'));
    return from(getDocs(q)).pipe(map(snapshot => snapshot.docs.map(doc => this.mapProject(doc))));
  }

  getFeaturedProjects(): Observable<Project[]> {
    const q = query(
      this.getCollection(),
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('featuredAt', 'desc')
    );
    return from(getDocs(q)).pipe(map(snapshot => snapshot.docs.map(doc => this.mapProject(doc))));
  }
}