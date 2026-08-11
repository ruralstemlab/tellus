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
import { Feedback } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly collectionName = 'feedback';

  private readonly feedbackCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Feedback | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Feedback;
  }

  async getAll(): Promise<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(feedbackQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Feedback[];
  }

  async getBySubmissionId(
    submissionId: string,
  ): Promise<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      where('submissionId', '==', submissionId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(feedbackQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Feedback[];
  }

  async getByStudentId(
    studentId: string,
  ): Promise<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(feedbackQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Feedback[];
  }

  async getByAuthorId(
    authorId: string,
  ): Promise<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(feedbackQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Feedback[];
  }

  async create(
    feedback: Omit<Feedback, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.feedbackCollection,
      feedback,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Feedback, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
