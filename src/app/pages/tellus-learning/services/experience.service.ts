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
} from 'firebase/firestore';

import { db } from '../../../../environments/firebase.config';
import { Experience } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly collectionName = 'experiences';

  private readonly experiencesCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Experience | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Experience;
  }

  async getAll(): Promise<Experience[]> {
    const experiencesQuery = query(
      this.experiencesCollection,
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(experiencesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Experience[];
  }

  async create(
    experience: Omit<Experience, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.experiencesCollection,
      experience,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Experience, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}