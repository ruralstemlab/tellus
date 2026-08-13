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
import { Moment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MomentService {
  private readonly collectionName = 'moments';

  private readonly momentsCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Moment | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Moment;
  }

  async getAll(): Promise<Moment[]> {
    const momentsQuery = query(
      this.momentsCollection,
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(momentsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Moment[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Moment[]> {
    const momentsQuery = query(
      this.momentsCollection,
      where('experienceId', '==', experienceId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(momentsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Moment[];
  }

  async create(
    moment: Omit<Moment, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.momentsCollection,
      moment,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Moment, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}