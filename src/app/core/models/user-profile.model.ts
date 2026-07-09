export interface UserProfile {

  uid: string;

  name: string;

  email: string;

  role: 'teacher' | 'student' | 'admin';

  school: string;

  photoURL: string;

  active: boolean;

  createdAt: Date;

}