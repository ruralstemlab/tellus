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
import { Evaluation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private readonly collectionName = 'evaluations';

  private readonly evaluationsCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Evaluation | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Evaluation;
  }

  async getAll(): Promise<Evaluation[]> {
    const evaluationsQuery = query(
      this.evaluationsCollection,
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(evaluationsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Evaluation[];
  }

  async getBySubmissionId(
    submissionId: string,
  ): Promise<Evaluation[]> {
    const evaluationsQuery = query(
      this.evaluationsCollection,
      where('submissionId', '==', submissionId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(evaluationsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Evaluation[];
  }

  async getByStudentId(
    studentId: string,
  ): Promise<Evaluation[]> {
    const evaluationsQuery = query(
      this.evaluationsCollection,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(evaluationsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Evaluation[];
  }

  async getByActivityId(
    activityId: string,
  ): Promise<Evaluation[]> {
    const evaluationsQuery = query(
      this.evaluationsCollection,
      where('activityId', '==', activityId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(evaluationsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Evaluation[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Evaluation[]> {
    const evaluationsQuery = query(
      this.evaluationsCollection,
      where('experienceId', '==', experienceId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(evaluationsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Evaluation[];
  }

  async create(
    evaluation: Omit<Evaluation, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.evaluationsCollection,
      evaluation,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Evaluation, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
