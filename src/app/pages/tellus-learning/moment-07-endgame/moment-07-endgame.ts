import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LearningStateService } from '../services/learning-state.service';
import { ProfileService } from '../../../core/services/profile.service';

interface EndgameRadarMetric {
  id: string;
  label: string;
  value: number;
}

interface EndgameAchievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface EndgameMomentResult {
  order: number;
  icon: string;
  title: string;
  score: number | null;
  completed: boolean;
}


@Component({
  selector: 'app-moment-07-endgame',

  standalone: true,

  imports: [
    CommonModule,
  ],

  templateUrl: './moment-07-endgame.html',

  styleUrls: [
    './moment-07-endgame.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class Moment07Endgame
  implements OnInit, OnDestroy {


  // ============================================================
  // SERVICIOS
  // ============================================================

  private readonly learningState =
    inject(LearningStateService);

  private readonly profileService =
    inject(ProfileService);

  private readonly router =
    inject(Router);


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experienceId =
    signal<string>('exp-movimiento-parabolico');


  readonly experienceTitle =
    signal<string>('Movimiento Parabólico');


  // ============================================================
  // USUARIO
  // ============================================================

  readonly userName =
    signal<string>('Estudiante');


  readonly heroVariant =
    signal<'alumno' | 'alumna'>('alumno');


  // ============================================================
  // AUDIO
  // ============================================================

  readonly musicEnabled =
    signal<boolean>(false);

  private audio: HTMLAudioElement | null =
    null;


  // ============================================================
  // DATOS
  // ============================================================

  readonly radar =
    signal<EndgameRadarMetric[]>([]);


  readonly moments =
    signal<EndgameMomentResult[]>([]);


  readonly achievements =
    signal<EndgameAchievement[]>([]);


  // ============================================================
  // COORDENADAS DEL RADAR
  // ============================================================

  radarPointX(
    metric: EndgameRadarMetric,
    index: number
  ): number {

    const total =
      this.radar().length || 1;

    const angle =
      (-Math.PI / 2) +
      (
        index *
        2 *
        Math.PI /
        total
      );

    const value =
      Math.max(
        0,
        Math.min(
          100,
          metric.value
        )
      );

    const radius =
      37 *
      (
        value /
        100
      );

    return (
      50 +
      radius *
      Math.cos(angle)
    );
  }


  radarPointY(
    metric: EndgameRadarMetric,
    index: number
  ): number {

    const total =
      this.radar().length || 1;

    const angle =
      (-Math.PI / 2) +
      (
        index *
        2 *
        Math.PI /
        total
      );

    const value =
      Math.max(
        0,
        Math.min(
          100,
          metric.value
        )
      );

    const radius =
      37 *
      (
        value /
        100
      );

    return (
      50 +
      radius *
      Math.sin(angle)
    );
  }


  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  readonly totalActivities =
    signal<number>(0);

  readonly totalEvidence =
    signal<number>(0);

  readonly totalAttempts =
    signal<number>(0);

  readonly completedMissions =
    signal<number>(0);

  readonly totalMissions =
    signal<number>(7);


  // ============================================================
  // RESULTADO FINAL
  // ============================================================

  readonly finalScore =
    signal<number>(0);


  readonly rank =
    computed<string>(() => {

      const score =
        this.finalScore();

      if (score >= 95) {
        return 'Científico del Movimiento';
      }

      if (score >= 85) {
        return 'Investigador del Movimiento';
      }

      if (score >= 70) {
        return 'Explorador Científico';
      }

      return 'Explorador en Formación';

    });


  readonly profileTitle =
    computed<string>(() => {

      const radar =
        this.radar();

      if (!radar.length) {
        return 'Explorador Científico';
      }

      const strongest =
        [...radar]
          .sort(
            (a, b) =>
              b.value - a.value
          )[0];

      switch (strongest.id) {

        case 'prediction':
          return 'Estratega de Precisión';

        case 'experimentation':
          return 'Explorador Experimental';

        case 'simulation':
          return 'Dominador de Trayectorias';

        case 'analysis':
          return 'Cazador de Evidencias';

        case 'system':
          return 'Analista de Sistemas';

        default:
          return 'Explorador Científico';
      }

    });


  // ============================================================
  // IMAGEN DEL HERO
  // ============================================================

  readonly heroImage =
    computed<string>(() => {

      return this.heroVariant() === 'alumna'

        ? '/assets/tellus-learning/movimiento-parabolico/momento-07-movimiento-parabolico-alumna.png'

        : '/assets/tellus-learning/movimiento-parabolico/momento-07-movimiento-parabolico-alumno.png';

    });


  // ============================================================
  // PORCENTAJE RADAR
  // ============================================================

  radarPoints(): string {

    const metrics =
      this.radar();

    if (!metrics.length) {
      return '';
    }

    const center =
      50;

    const radius =
      37;

    const total =
      metrics.length;

    return metrics
      .map(
        (metric, index) => {

          const angle =
            (
              -Math.PI / 2
            )
            +
            (
              index *
              2 *
              Math.PI /
              total
            );

          const value =
            Math.max(
              0,
              Math.min(
                100,
                metric.value
              )
            );

          const r =
            radius *
            (
              value /
              100
            );

          const x =
            center +
            r *
            Math.cos(angle);

          const y =
            center +
            r *
            Math.sin(angle);

          return `${x},${y}`;

        }
      )
      .join(' ');

  }


  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  readonly achievementCount =
    computed<number>(() =>
      this.achievements()
        .filter(
          item =>
            item.unlocked
        )
        .length
    );


  readonly completionPercentage =
    computed<number>(() => {

      const completed =
        this.moments()
          .filter(
            item =>
              item.completed
          )
          .length;

      return Math.round(
        (
          completed /
          7
        ) *
        100
      );

    });


  // ============================================================
  // INICIO
  // ============================================================

  ngOnInit(): void {

    this.profileService
      .profile$
      .subscribe(
        profile => {

          if (!profile) {
            return;
          }

          this.userName.set(
            profile.name?.trim()
              || 'Estudiante'
          );

        }
      );


    this.learningState.load(
      this.experienceId()
    );


    this.buildEndgame();

  }


  // ============================================================
  // CONSTRUIR ENDGAME
  // ============================================================

  private buildEndgame(): void {

    try {

      const m1 =
        this.learningState
          .getMoment<any>('m1')
          ?? {};

      const m2 =
        this.learningState
          .getMoment<any>('m2')
          ?? {};

      const m3 =
        this.learningState
          .getMoment<any>('m3')
          ?? {};

      const m4 =
        this.learningState
          .getMoment<any>('m4')
          ?? {};

      const m5 =
        this.learningState
          .getMoment<any>('m5')
          ?? {};

      const m6 =
        this.learningState
          .getMoment<any>('m6')
          ?? {};


      // ========================================================
      // PERSONAJE
      // ========================================================

      const variant =
        m6.heroVariant ??
        'alumno';

      this.heroVariant.set(
        variant === 'alumna'
          ? 'alumna'
          : 'alumno'
      );


      // ========================================================
      // ACTIVIDADES
      // ========================================================

      const activities =
        this.countActivities(
          m1,
          m2,
          m3,
          m4,
          m5,
          m6
        );

      this.totalActivities.set(
        activities
      );


      // ========================================================
      // EVIDENCIAS
      // ========================================================

      const evidence =
        this.countEvidence(
          m1,
          m2,
          m3,
          m4,
          m5,
          m6
        );

      this.totalEvidence.set(
        evidence
      );


      // ========================================================
      // INTENTOS
      // ========================================================

      const attempts =
        this.countAttempts(
          m3,
          m4,
          m5,
          m6
        );

      this.totalAttempts.set(
        attempts
      );


      // ========================================================
      // MISIONES
      // ========================================================

      const missions =
        this.countMissions(
          m2,
          m3,
          m4,
          m5,
          m6
        );

      this.completedMissions.set(
        missions
      );


      // ========================================================
      // MOMENTOS
      // ========================================================

      this.moments.set(
        this.buildMoments(
          m1,
          m2,
          m3,
          m4,
          m5,
          m6
        )
      );


      // ========================================================
      // RADAR
      // ========================================================

      this.radar.set(
        this.buildRadar(
          m1,
          m2,
          m3,
          m4,
          m5,
          m6
        )
      );


      // ========================================================
      // LOGROS
      // ========================================================

      this.achievements.set(
        this.buildAchievements(
          m1,
          m2,
          m3,
          m4,
          m5,
          m6
        )
      );


      // ========================================================
      // PUNTUACIÓN
      // ========================================================

      this.finalScore.set(
        this.calculateFinalScore(
          this.radar()
        )
      );

    } catch (error) {

      console.error(
        '[Tellus Endgame] Error construyendo el resumen:',
        error
      );

      // Valores por defecto para no romper la vista
      this.radar.set([]);
      this.moments.set([]);
      this.achievements.set([]);
      this.finalScore.set(0);
      this.totalActivities.set(0);
      this.totalEvidence.set(0);
      this.totalAttempts.set(0);
      this.completedMissions.set(0);

    }

  }


  // ============================================================
  // RADAR
  // ============================================================

  private buildRadar(
    m1: any,
    m2: any,
    m3: any,
    m4: any,
    m5: any,
    m6: any
  ): EndgameRadarMetric[] {

    const prediction =
      this.numberOrNull(
        m3?.predictionScore
      )
      ??
      this.booleanScore(
        m3?.isCorrect
      )
      ??
      0;


    const experimentation =
      this.numberOrNull(
        m4?.roadToGlory?.percentage
      )
      ??
      0;


    const simulation =
      this.numberOrNull(
        m4?.roadToGlory?.percentage
      )
      ??
      0;


    const analysis =
      this.calculateEvidenceScore(
        m6
      );


    const system =
      m6?.act7_completed === true
        ? 100
        : 0;


    const modelling =
      this.calculateModelScore(
        m5
      );


    return [

      {
        id: 'prediction',
        label: 'Predicción',
        value: prediction,
      },

      {
        id: 'experimentation',
        label: 'Experimentación',
        value: experimentation,
      },

      {
        id: 'simulation',
        label: 'Simulación',
        value: simulation,
      },

      {
        id: 'modelling',
        label: 'Modelación',
        value: modelling,
      },

      {
        id: 'analysis',
        label: 'Análisis',
        value: analysis,
      },

      {
        id: 'system',
        label: 'Pensamiento sistémico',
        value: system,
      },

    ];

  }


  // ============================================================
  // MOMENTOS
  // ============================================================

  private buildMoments(
    m1: any,
    m2: any,
    m3: any,
    m4: any,
    m5: any,
    m6: any
  ): EndgameMomentResult[] {

    return [

      {
        order: 1,
        icon: '🎯',
        title: 'Motivación',
        score: this.hasData(m1)
          ? 100
          : null,
        completed: this.hasData(m1),
      },

      {
        order: 2,
        icon: '🔎',
        title: 'Exploración',
        score: this.hasData(m2)
          ? 100
          : null,
        completed: this.hasData(m2),
      },

      {
        order: 3,
        icon: '🔮',
        title: 'Predicción',
        score:
          this.booleanScore(
            m3?.isCorrect
          ),
        completed:
          !!m3?.selectedOption,
      },

      {
        order: 4,
        icon: '🧪',
        title: 'Experimentación',
        score:
          this.numberOrNull(
            m4?.roadToGlory?.percentage
          ),
        completed:
          !!m4?.roadToGlory,
      },

      {
        order: 5,
        icon: '🧠',
        title: 'Construcción',
        score:
          this.calculateModelScore(
            m5
          ),
        completed:
          this.hasData(m5),
      },

      {
        order: 6,
        icon: '📊',
        title: 'Análisis',
        score:
          this.calculateEvidenceScore(
            m6
          ),
        completed:
          !!m6?.act7_completed
          ||
          this.countEvidence(
            m6
          ) >= 5,
      },

      {
        order: 7,
        icon: '🏆',
        title: 'Endgame',
        score: null,
        completed: true,
      },

    ];

  }


  // ============================================================
  // LOGROS
  // ============================================================

  private buildAchievements(
    m1: any,
    m2: any,
    m3: any,
    m4: any,
    m5: any,
    m6: any
  ): EndgameAchievement[] {

    return [

      {
        id: 'first-launch',
        icon: '🎯',
        title: 'Primer lanzamiento',
        description:
          'Completaste tu primera predicción.',
        unlocked:
          !!m3?.selectedOption,
      },

      {
        id: 'scientist',
        icon: '🧪',
        title: 'Científico en acción',
        description:
          'Completaste la experimentación.',
        unlocked:
          !!m4?.roadToGlory,
      },

      {
        id: 'builder',
        icon: '🧠',
        title: 'Constructor del modelo',
        description:
          'Construiste una explicación del fenómeno.',
        unlocked:
          this.hasData(m5),
      },

      {
        id: 'trajectory',
        icon: '🚀',
        title: 'Dominador de la trayectoria',
        description:
          'Utilizaste la simulación para investigar el movimiento.',
        unlocked:
          !!m4?.roadToGlory,
      },

      {
        id: 'evidence',
        icon: '📊',
        title: 'Cazador de evidencias',
        description:
          'Analizaste resultados experimentales y simulados.',
        unlocked:
          this.calculateEvidenceScore(m6) > 0,
      },

      {
        id: 'maximum-range',
        icon: '🎯',
        title: 'Alcance máximo',
        description:
          'Superaste la misión final.',
        unlocked:
          m6?.act7_completed === true,
      },

      {
        id: 'systems',
        icon: '🧠',
        title: 'Pensamiento sistémico',
        description:
          'Relacionaste variables dentro del sistema.',
        unlocked:
          m6?.act7_completed === true,
      },

    ];

  }


  // ============================================================
  // PUNTUACIÓN FINAL
  // ============================================================

  private calculateFinalScore(
    radar: EndgameRadarMetric[]
  ): number {

    const valid =
      radar.filter(
        item =>
          item.value > 0
      );

    if (!valid.length) {
      return 0;
    }

    return Math.round(
      valid.reduce(
        (
          total,
          item
        ) =>
          total + item.value,
        0
      ) /
      valid.length
    );

  }


  // ============================================================
  // CONTADORES
  // ============================================================

  private countActivities(
    ...moments: any[]
  ): number {

    return moments.reduce(
      (
        total,
        moment
      ) =>
        total +
        Object.keys(
          moment ?? {}
        ).length,
      0
    );

  }


  private countEvidence(
    ...moments: any[]
  ): number {

    let count =
      0;

    for (
      const moment
      of moments
    ) {

      if (
        this.hasData(
          moment
        )
      ) {

        count++;

      }

    }

    return count;

  }


  private countAttempts(
    ...moments: any[]
  ): number {

    return moments.reduce(
      (
        total,
        moment
      ) =>
        total +
        Number(
          moment?.attempts ??
          moment?.predictionAttempts ??
          0
        ),
      0
    );

  }


  private countMissions(
    ...moments: any[]
  ): number {

    let count =
      0;

    for (
      const moment
      of moments
    ) {

      if (
        moment?.act7_completed === true
      ) {

        count++;

      }

    }

    return count;

  }


  // ============================================================
  // UTILIDADES
  // ============================================================

  private hasData(
    value: any
  ): boolean {

    if (!value) {
      return false;
    }

    return (
      Object.keys(value)
        .some(
          key =>
            key !== 'completedAt'
        )
    );

  }


  private numberOrNull(
    value: unknown
  ): number | null {

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : null;

  }


  private booleanScore(
    value: unknown
  ): number | null {

    if (
      typeof value !== 'boolean'
    ) {
      return null;
    }

    return value
      ? 100
      : 0;

  }


  private calculateEvidenceScore(
    m6: any
  ): number {

    const keys =
      Object.keys(
        m6 ?? {}
      );

    const evidence =
      keys.filter(
        key =>
          key.startsWith(
            'act'
          )
      );

    if (!evidence.length) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (
          evidence.length /
          7
        ) *
        100
      )
    );

  }


  private calculateModelScore(
    m5: any
  ): number {

    if (!this.hasData(m5)) {
      return 0;
    }

    const numeric =
      Object.values(
        m5
      )
      .filter(
        value =>
          typeof value === 'number'
      ) as number[];

    if (!numeric.length) {
      return 100;
    }

    return Math.min(
      100,
      Math.round(
        numeric.reduce(
          (
            a,
            b
          ) =>
            a + b,
          0
        ) /
        numeric.length
      )
    );

  }


  // ============================================================
  // AUDIO
  // ============================================================

  toggleMusic(): void {

    if (!this.audio) {

      this.audio =
        new Audio(
          '/assets/audio/tellus-epic-victory.mp3'
        );

      this.audio.loop =
        true;

      this.audio.volume =
        0.35;

    }

    if (
      this.musicEnabled()
    ) {

      this.audio.pause();

      this.musicEnabled.set(
        false
      );

      return;
    }

    this.audio
      .play()
      .then(
        () =>
          this.musicEnabled.set(
            true
          )
      )
      .catch(
        error =>
          console.warn(
            '[Tellus] No se pudo iniciar la música:',
            error
          )
      );

  }


  // ============================================================
  // NAVEGACIÓN
  // ============================================================

  viewEvidence(): void {

    // Más adelante:
    // navegación a un visor consolidado
    // de evidencias de la experiencia.

    console.log(
      '[Tellus] Ver evidencias'
    );

  }


  backToClassroom(): void {

    this.router.navigate([
      '/mi-aula',
    ]);

  }


  ngOnDestroy(): void {

    if (this.audio) {

      this.audio.pause();

      this.audio.src = '';

      this.audio = null;

    }

  }

}