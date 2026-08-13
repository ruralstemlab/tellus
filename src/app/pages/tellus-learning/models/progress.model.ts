// ============================================================
// TELLUS LEARNING — PROGRESS
// ============================================================
//
// Progress NO se persiste inicialmente en Firestore.
// Se calcula a partir de:
//
//   Moments + Activities + Submissions + Interactions
//
// mediante calculateProgress().
//
// Este modelo representa únicamente el estado derivado
// que necesita la interfaz.
// ============================================================

export interface Progress {
  // ----------------------------------------------------------
  // Contexto
  // ----------------------------------------------------------

  experienceId: string;

  studentId: string;

  // ----------------------------------------------------------
  // Momento actual
  // ----------------------------------------------------------

  currentMomentId: string | null;

  // ----------------------------------------------------------
  // Momentos completados
  // ----------------------------------------------------------

  completedMomentIds: string[];

  // ----------------------------------------------------------
  // Actividades completadas
  // ----------------------------------------------------------

  completedActivityIds: string[];

  // ----------------------------------------------------------
  // Última actividad registrada
  // ----------------------------------------------------------

  lastActivityId: string | null;

  lastUpdatedAt: Date;

  // ----------------------------------------------------------
  // Progreso pedagógico principal
  // ----------------------------------------------------------

  totalMoments: number;

  completedMomentsCount: number;

  progressPercentage: number;

  // ----------------------------------------------------------
  // Progreso secundario de actividades
  // ----------------------------------------------------------

  totalRequiredActivities: number;

  completedRequiredActivitiesCount: number;

  activityProgressPercentage: number;
}