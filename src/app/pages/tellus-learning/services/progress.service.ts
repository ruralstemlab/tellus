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
import { Progress } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly collectionName = 'progress';

  private readonly progressCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Progress | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Progress;
  }

  async getAll(): Promise<Progress[]> {
    const progressQuery = query(
      this.progressCollection,
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(progressQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Progress[];
  }

  async getByStudentId(
    studentId: string,
  ): Promise<Progress[]> {
    const progressQuery = query(
      this.progressCollection,
      where('studentId', '==', studentId),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(progressQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Progress[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Progress[]> {
    const progressQuery = query(
      this.progressCollection,
      where('experienceId', '==', experienceId),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(progressQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Progress[];
  }

  async getByStudentAndExperience(
    studentId: string,
    experienceId: string,
  ): Promise<Progress | null> {
    const progressQuery = query(
      this.progressCollection,
      where('studentId', '==', studentId),
      where('experienceId', '==', experienceId),
    );

    const snapshot = await getDocs(progressQuery);

    if (snapshot.empty) {
      return null;
    }

    const document = snapshot.docs[0];

    return {
      id: document.id,
      ...document.data(),
    } as Progress;
  }

  async create(
    progress: Omit<Progress, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.progressCollection,
      progress,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Progress, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
