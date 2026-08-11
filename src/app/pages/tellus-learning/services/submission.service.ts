import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../../../environments/firebase.config';
import { Submission } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private readonly collectionName = 'submissions';

  private readonly submissionsCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Submission | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Submission;
  }

  async getAll(): Promise<Submission[]> {
    const submissionsQuery = query(
      this.submissionsCollection,
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(submissionsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Submission[];
  }

  async getByStudentId(studentId: string): Promise<Submission[]> {
    const submissionsQuery = query(
      this.submissionsCollection,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(submissionsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Submission[];
  }

  async getByActivityId(activityId: string): Promise<Submission[]> {
    const submissionsQuery = query(
      this.submissionsCollection,
      where('activityId', '==', activityId),
      orderBy('attemptNumber', 'asc'),
    );

    const snapshot = await getDocs(submissionsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Submission[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Submission[]> {
    const submissionsQuery = query(
      this.submissionsCollection,
      where('experienceId', '==', experienceId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(submissionsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Submission[];
  }

  async create(
    submission: Omit<Submission, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.submissionsCollection,
      submission,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Submission, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
