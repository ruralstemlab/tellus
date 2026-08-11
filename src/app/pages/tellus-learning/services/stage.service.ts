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
import { Stage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private readonly collectionName = 'stages';

  private readonly stagesCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Stage | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Stage;
  }

  async getAll(): Promise<Stage[]> {
    const stagesQuery = query(
      this.stagesCollection,
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(stagesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Stage[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Stage[]> {
    const stagesQuery = query(
      this.stagesCollection,
      where('experienceId', '==', experienceId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(stagesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Stage[];
  }

  async create(
    stage: Omit<Stage, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.stagesCollection,
      stage,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Stage, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
