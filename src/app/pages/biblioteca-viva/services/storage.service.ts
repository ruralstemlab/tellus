import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult, StorageReference } from 'firebase/storage';
import { Observable, from, switchMap } from 'rxjs';
import { storage } from '../../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor() {}

  uploadHTMLFile(projectId: string, file: File): Observable<string> {
    const path = `projects/${projectId}/index.html`;
    const storageRef: StorageReference = ref(storage, path);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap((result: UploadResult) => from(getDownloadURL(result.ref)))
    );
  }

  getDownloadURL(projectId: string): Observable<string> {
    const path = `projects/${projectId}/index.html`;
    const storageRef: StorageReference = ref(storage, path);
    return from(getDownloadURL(storageRef));
  }

  deleteHTMLFile(projectId: string): Observable<void> {
    const path = `projects/${projectId}/index.html`;
    const storageRef: StorageReference = ref(storage, path);
    return from(deleteObject(storageRef));
  }
}