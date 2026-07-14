import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyAAdXrwRUOUEYi7BprbOJW2-TymARfrdSI',
  authDomain: 'tellus-2d8ea.firebaseapp.com',
  projectId: 'tellus-2d8ea',
  storageBucket: 'tellus-2d8ea.firebasestorage.app',
  messagingSenderId: '451436204192',
  appId: '1:451436204192:web:54ebdf2bf48d51c07cb9c5',
  measurementId: 'G-H691ECG2L5',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);