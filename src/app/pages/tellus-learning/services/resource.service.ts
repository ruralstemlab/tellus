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
import { Resource } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private readonly collectionName = 'resources';

  private readonly resourcesCollection = collection(
    db,
    this.collectionName,
  );

  async getById(id: string): Promise<Resource | null> {
    const reference = doc(db, this.collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Resource;
  }

  async getAll(): Promise<Resource[]> {
    const resourcesQuery = query(
      this.resourcesCollection,
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(resourcesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Resource[];
  }

  async getByCreatorId(createdBy: string): Promise<Resource[]> {
    const resourcesQuery = query(
      this.resourcesCollection,
      where('createdBy', '==', createdBy),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(resourcesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Resource[];
  }

  async getByType(type: Resource['type']): Promise<Resource[]> {
    const resourcesQuery = query(
      this.resourcesCollection,
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(resourcesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Resource[];
  }

  async create(
    resource: Omit<Resource, 'id'>,
  ): Promise<string> {
    const reference = await addDoc(
      this.resourcesCollection,
      resource,
    );

    return reference.id;
  }

  async update(
    id: string,
    changes: Partial<Omit<Resource, 'id'>>,
  ): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await updateDoc(reference, changes);
  }

  async delete(id: string): Promise<void> {
    const reference = doc(db, this.collectionName, id);

    await deleteDoc(reference);
  }
}
