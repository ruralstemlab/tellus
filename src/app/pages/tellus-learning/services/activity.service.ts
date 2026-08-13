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
import { Activity } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly collectionName = 'activities';

  private readonly activitiesCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Activity | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Activity;
  }

  async getAll(): Promise<Activity[]> {
    const activitiesQuery = query(
      this.activitiesCollection,
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(activitiesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Activity[];
  }

  // ============================================================
  // TELLUS LEARNING — NUEVA ARQUITECTURA
  // ============================================================

  async getByMomentId(
    momentId: string,
  ): Promise<Activity[]> {
    const activitiesQuery = query(
      this.activitiesCollection,
      where('momentId', '==', momentId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(activitiesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Activity[];
  }

  async getByExperienceId(
    experienceId: string,
  ): Promise<Activity[]> {
    const activitiesQuery = query(
      this.activitiesCollection,
      where('experienceId', '==', experienceId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(activitiesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Activity[];
  }

  // ============================================================
  // LEGACY
  // ============================================================
  //
  // Se mantiene temporalmente durante la migración de
  // Stage → Moment.
  //
  // No utilizar en código nuevo.
  // ============================================================

  /**
   * @deprecated Usar getByMomentId().
   */
  async getByStageId(
    stageId: string,
  ): Promise<Activity[]> {
    const activitiesQuery = query(
      this.activitiesCollection,
      where('stageId', '==', stageId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(activitiesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Activity[];
  }

  // ============================================================
  // CRUD
  // ============================================================

  async create(
    activity: Omit<Activity, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.activitiesCollection,
      activity,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Activity, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}