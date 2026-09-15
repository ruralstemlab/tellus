export interface EndgameRadarMetric {
  id: string;
  label: string;
  value: number;
}

export interface EndgameAchievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface EndgameMomentResult {
  order: number;
  icon: string;
  title: string;
  score: number | null;
  completed: boolean;
}

export interface EndgameStats {
  totalActivities: number;
  totalEvidence: number;
  totalAttempts: number;
  completedMissions: number;
  totalMissions: number;
  achievements: number;
  totalAchievements: number;
}

export interface EndgameResult {
  score: number;
  rank: string;
  profileTitle: string;
  radar: EndgameRadarMetric[];
  moments: EndgameMomentResult[];
  stats: EndgameStats;
  achievements: EndgameAchievement[];
  heroVariant: 'alumno' | 'alumna';
  experienceTitle: string;
}