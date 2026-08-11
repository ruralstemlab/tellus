export interface UserProfile {
  uid: string;

  name: string;

  email: string;

  role: 'teacher' | 'student' | 'admin';

  /**
   * Institución educativa del usuario.
   * Se mantiene como texto para compatibilidad con Biblioteca Viva.
   */
  institution?: string;

  /**
   * Campo heredado.
   * Se mantiene opcional para no romper perfiles existentes.
   */
  school?: string;

  photoURL: string;

  active: boolean;

  createdAt: Date;
}