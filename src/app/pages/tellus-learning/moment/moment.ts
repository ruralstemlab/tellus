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
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Navbar } from '../../../components/navbar/navbar';
import { Footer } from '../../../components/footer/footer';
import { Moment07Endgame } from '../moment-07-endgame/moment-07-endgame';

import { getExperienceById } from '../data/experience-registry';
import { Experience } from '../models/experience.model';
import { Moment } from '../models/moment.model';
import { Activity } from '../models/activity.model';
import { LearningStateService } from '../services/learning-state.service';


// ============================================================
// TIPOS AUXILIARES — MOMENTO 6
// ============================================================

interface AnalysisResponses {
  act1_now?: string;
  act1_change?: string;

  act2_match?: number;
  act2_evidence?: string;

  act3_prediction?: string[];
  act3_velocity?: number;
  act3_angle?: number;
  act3_cause?: string;

  act4_choice?: string;

  act5_chips?: string[];
  act5_explain?: string;

  act6_learn?: string;

  act7_velocity?: string;
  act7_angle?: string;
  act7_gravity?: string;
  act7_height?: string;
  act7_completed?: boolean;
}


@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Footer,
    Moment07Endgame,
  ],
  templateUrl: './moment.html',
  styleUrls: ['./moment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MomentComponent implements OnInit, OnDestroy {

  // ============================================================
  // INYECCIONES
  // ============================================================

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly learningState = inject(LearningStateService);


  // ============================================================
  // HERO — VARIANTE M6
  // ============================================================

  readonly heroVariant = signal<'alumno' | 'alumna' | null>(null);

  setHeroVariant(variant: 'alumno' | 'alumna'): void {
    this.heroVariant.set(variant);

    const experienceId = this.experienceId();

    if (experienceId) {
      this.learningState.patchMoment(experienceId, 'm6', {
        heroVariant: variant,
      });
    }
  }


  // ============================================================
  // RUTA
  // ============================================================

  readonly experienceId = signal<string>('');
  readonly momentId = signal<string>('');


  // ============================================================
  // ESTADO
  // ============================================================

  readonly response = signal<string>('');
  readonly saved = signal<boolean>(false);


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experienceData = computed(() => {
    const id = this.experienceId();

    if (!id) return null;

    return getExperienceById(id);
  });

  readonly experience = computed<Experience | null>(() => {
    const data = this.experienceData();

    if (!data) return null;

    return data.experience as Experience;
  });


  // ============================================================
  // MOMENTOS
  // ============================================================

  readonly moments = computed<Moment[]>(() => {
    const data = this.experienceData();

    if (!data) return [];

    return [...data.moments]
      .sort(
        (a: Moment, b: Moment) =>
          a.order - b.order
      ) as Moment[];
  });


  // ============================================================
  // ACTIVIDADES
  // ============================================================

  readonly activities = computed<Activity[]>(() => {
    const data = this.experienceData();

    if (!data) return [];

    return [...data.activities]
      .sort(
        (a: Activity, b: Activity) =>
          a.order - b.order
      ) as Activity[];
  });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment = computed<Moment | null>(() => {
    const id = this.momentId();
    const allMoments = this.moments();

    return (
      allMoments.find(
        (moment: Moment) => moment.id === id
      )
      ??
      allMoments.find(
        (moment: Moment) => moment.order === 1
      )
      ??
      allMoments[0]
      ??
      null
    );
  });


  // ============================================================
  // ACTIVIDADES DEL MOMENTO
  // ============================================================

  readonly currentActivities = computed<Activity[]>(() => {
    const moment = this.currentMoment();

    if (!moment) return [];

    const ids = moment.activityIds ?? [];

    return this.activities()
      .filter(
        (activity: Activity) =>
          ids.includes(activity.id)
      )
      .sort(
        (a: Activity, b: Activity) =>
          a.order - b.order
      );
  });


  // ============================================================
  // ACTIVIDAD PRINCIPAL
  // ============================================================

  readonly primaryActivity = computed<Activity | null>(() => {
    return this.currentActivities()[0] ?? null;
  });


  // ============================================================
  // PREGUNTA
  // ============================================================

  readonly primaryQuestion = computed<string>(() => {
    const activity = this.primaryActivity();

    if (!activity) return '';

    if (activity.content?.type === 'questionnaire') {
      const questions = activity.content.data?.questions;

      if (Array.isArray(questions) && questions.length > 0) {
        return questions[0]?.text ?? '';
      }
    }

    return activity.description ?? '';
  });


  // ============================================================
  // PISTA
  // ============================================================

  readonly primaryHint = computed<string>(() => {
    const activity = this.primaryActivity();

    if (!activity) return '';

    if (activity.content?.type === 'questionnaire') {
      const questions = activity.content.data?.questions;

      if (Array.isArray(questions) && questions.length > 0) {
        return questions[0]?.hint ?? '';
      }
    }

    return '';
  });


  // ============================================================
  // ANTERIOR
  // ============================================================

  readonly previousMoment = computed<Moment | null>(() => {
    const current = this.currentMoment();

    if (!current) return null;

    return (
      this.moments().find(
        (moment: Moment) =>
          moment.order === current.order - 1
      )
      ??
      null
    );
  });


  // ============================================================
  // SIGUIENTE
  // ============================================================

  readonly nextMoment = computed<Moment | null>(() => {
    const current = this.currentMoment();

    if (!current) return null;

    return (
      this.moments().find(
        (moment: Moment) =>
          moment.order === current.order + 1
      )
      ??
      null
    );
  });


  // ============================================================
  // PROGRESO
  // ============================================================

  readonly currentOrder = computed<number>(() => {
    return this.currentMoment()?.order ?? 1;
  });

  readonly totalMoments = computed<number>(() => {
    return this.moments().length;
  });

  readonly progressPercentage = computed<number>(() => {
    const total = this.totalMoments();
    const current = this.currentOrder();

    if (total <= 0) return 0;

    return Math.round(
      (current / total) * 100
    );
  });

  readonly progressLabel = computed<string>(() => {
    return `Momento ${this.currentOrder()} de ${this.totalMoments()}`;
  });


  // ============================================================
  // CONTENIDO
  // ============================================================

  readonly currentMomentTitle = computed<string>(() => {
    return (
      this.currentMoment()?.title
      ??
      'Experiencia de aprendizaje'
    );
  });

  readonly currentMomentSubtitle = computed<string>(() => {
    return this.currentMoment()?.subtitle ?? '';
  });

  readonly currentMomentDescription = computed<string>(() => {
    return this.currentMoment()?.description ?? '';
  });

  readonly currentMomentImage = computed<string>(() => {
    const moment = this.currentMoment();

    if (moment?.order === 6) {
      const variant = this.heroVariant();

      if (variant === 'alumna') {
        return '/assets/tellus-learning/movimiento-parabolico/momento-06-movimiento-parabolico-alumna.png';
      }

      if (variant === 'alumno') {
        return '/assets/tellus-learning/movimiento-parabolico/momento-06-movimiento-parabolico-alumno.png';
      }

      return '/assets/tellus-learning/movimiento-parabolico/momento-06-movimiento-parabolico-alumno.png';
    }

    if (moment?.image) {
      return moment.image;
    }

    const experience = this.experience();

    if (experience?.coverUrl) {
      return experience.coverUrl;
    }

    if (experience?.thumbnailUrl) {
      return experience.thumbnailUrl;
    }

    return '';
  });


  // ============================================================
  // IDENTIDAD VISUAL
  // ============================================================

  readonly experienceTheme = computed<string>(() => {
    const experience = this.experience();

    if (!experience) return 'default';

    const id = experience.id.toLowerCase();
    const title = experience.title.toLowerCase();

    if (
      id.includes('agua') ||
      id.includes('water') ||
      title.includes('agua') ||
      title.includes('territorio')
    ) {
      return 'water';
    }

    if (
      id.includes('parabol') ||
      id.includes('proyectil') ||
      title.includes('parab')
    ) {
      return 'parabolic';
    }

    if (
      id.includes('creadores') ||
      id.includes('steam') ||
      id.includes('ia') ||
      title.includes('creadores') ||
      title.includes('ia')
    ) {
      return 'programming';
    }

    if (
      id.includes('circuit') ||
      id.includes('electric') ||
      title.includes('circuit')
    ) {
      return 'circuits';
    }

    if (
      id.includes('quim') ||
      title.includes('quim')
    ) {
      return 'chemistry';
    }

    if (
      id.includes('energia') ||
      id.includes('energy') ||
      title.includes('energ')
    ) {
      return 'energy';
    }

    return 'default';
  });

  readonly experienceThemeLabel = computed<string>(() => {
    const labels: Record<string, string> = {
      water: 'AGUA Y TERRITORIO',
      parabolic: 'MOVIMIENTO PARABÓLICO',
      programming: 'CREADORES STEAM CON IA',
      circuits: 'CIRCUITOS ELÉCTRICOS',
      chemistry: 'QUÍMICA EN NUESTRO ENTORNO',
      energy: 'ENERGÍA',
      default: 'TELLUS LEARNING',
    };

    const theme = this.experienceTheme();

    return labels[theme] ?? labels['default'];
  });

  readonly experienceIcon = computed<string>(() => {
    const icons: Record<string, string> = {
      water: '≈',
      parabolic: '⌁',
      programming: '◇',
      circuits: 'ϟ',
      chemistry: '◈',
      energy: '✦',
      default: '·',
    };

    const theme = this.experienceTheme();

    return icons[theme] ?? icons['default'];
  });


  // ============================================================
  // ACTIVIDAD
  // ============================================================

  getActivityIcon(type: unknown): string {
    const value = String(type ?? '').toLowerCase();

    if (
      value.includes('simulation') ||
      value.includes('simul')
    ) {
      return 'LAB';
    }

    if (
      value.includes('question') ||
      value.includes('quiz')
    ) {
      return 'IDEA';
    }

    if (
      value.includes('reflection') ||
      value.includes('reflex')
    ) {
      return 'REF';
    }

    if (
      value.includes('analysis') ||
      value.includes('data')
    ) {
      return 'DATA';
    }

    if (
      value.includes('experiment') ||
      value.includes('lab')
    ) {
      return 'LAB';
    }

    if (
      value.includes('predict') ||
      value.includes('preinforme')
    ) {
      return 'PRED';
    }

    return 'ACT';
  }


  // ============================================================
  // RESPUESTA
  // ============================================================

  onResponseChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    this.response.set(target.value);
    this.saved.set(false);
  }


  // ============================================================
  // GUARDAR
  // ============================================================

  saveDraft(): void {
    const value = this.response().trim();

    if (!value) return;

    this.saved.set(true);
    this.persistResponse();
  }


  // ============================================================
  // PERSISTIR RESPUESTA SEGÚN MOMENTO
  // ============================================================

  private persistResponse(): void {
    const moment = this.currentMoment();
    const experienceId = this.experienceId();

    if (!moment || !experienceId) {
      return;
    }

    const value = this.response().trim();

    if (moment.order === 1 && value) {
      this.learningState.patchMoment(
        experienceId,
        'm1',
        {
          initialExplanation: value,
        }
      );

      return;
    }
  }


  // ============================================================
  // ENFOCAR RESPUESTA
  // ============================================================

  focusResponse(): void {
    const element = document.getElementById(
      'moment-response'
    );

    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    window.setTimeout(() => {
      if (element instanceof HTMLTextAreaElement) {
        element.focus();
      }
    }, 450);
  }


  // ============================================================
  // MOMENTO 2 — EXPLORACIÓN
  // ============================================================

  readonly selectedFactorId =
    signal<string | null>(null);

  readonly placedFactors =
    signal<Record<string, string>>({});

  readonly explorationScore =
    signal<number>(0);

  readonly explorationCompleted =
    signal<boolean>(false);

  readonly explorationFeedback =
    signal<string>('');


  readonly explorationGame =
    computed<any | null>(() => {
      const activity =
        this.currentActivities()[0];

      const config =
        activity?.config as any;

      return (
        config?.settings?.explorationGame
        ??
        null
      );
    });


  readonly availableFactors =
    computed<any[]>(() => {
      const game = this.explorationGame();

      if (!game) return [];

      const placed =
        this.placedFactors();

      return (game.factors ?? []).filter(
        (factor: any) =>
          !Object.prototype.hasOwnProperty.call(
            placed,
            factor.id
          )
      );
    });


  readonly placedFactorEntries =
    computed<any[]>(() => {
      const game = this.explorationGame();

      if (!game) return [];

      const placed =
        this.placedFactors();

      return Object.entries(placed).map(
        ([factorId, zoneId]) => {
          const factor =
            (game.factors ?? []).find(
              (item: any) =>
                item.id === factorId
            );

          const zone =
            (game.zones ?? []).find(
              (item: any) =>
                item.id === zoneId
            );

          return {
            factor,
            zone,
            zoneId,
            label: factor?.label ?? '',
          };
        }
      );
    });


  selectFactor(factorId: string): void {
    this.selectedFactorId.set(factorId);
  }


  dragFactor(
    event: DragEvent,
    factorId: string
  ): void {
    event.dataTransfer?.setData(
      'text/plain',
      factorId
    );

    this.selectedFactorId.set(factorId);
  }


  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }


  dropFactor(
    event: DragEvent,
    zoneId: string
  ): void {
    event.preventDefault();

    const factorId =
      event.dataTransfer?.getData(
        'text/plain'
      )
      ??
      this.selectedFactorId();

    if (!factorId) return;

    this.placeFactor(
      factorId,
      zoneId
    );
  }


  placeFactor(
    factorId: string,
    zoneId: string
  ): void {
    const game = this.explorationGame();

    if (!game) return;

    const placed =
      this.placedFactors();

    if (
      Object.prototype.hasOwnProperty.call(
        placed,
        factorId
      )
    ) {
      return;
    }

    const correctZone =
      game.answers?.[factorId];

    if (correctZone === zoneId) {
      const nextPlaced = {
        ...placed,
        [factorId]: zoneId,
      };

      const points =
        Number(
          game.pointsPerCorrectAnswer
        ) || 0;

      const target =
        Number(
          game.targetScore
        ) || 100;

      const nextScore =
        Math.min(
          target,
          this.explorationScore() + points
        );

      this.placedFactors.set(
        nextPlaced
      );

      this.explorationScore.set(
        nextScore
      );

      this.explorationFeedback.set(
        '¡Correcto! Ese factor puede influir de esa manera.'
      );

      if (nextScore >= target) {
        this.explorationCompleted.set(
          true
        );

        this.explorationFeedback.set(
          game.completion?.message
          ??
          '¡Exploración completada!'
        );
      }

      this.selectedFactorId.set(null);

      return;
    }

    this.explorationFeedback.set(
      'Aún no. Analiza nuevamente qué efecto directo puede tener este factor sobre la trayectoria.'
    );
  }


  resetExplorationGame(): void {
    this.selectedFactorId.set(null);
    this.placedFactors.set({});
    this.explorationScore.set(0);
    this.explorationCompleted.set(false);
    this.explorationFeedback.set('');
  }


  isFactorPlaced(
    factorId: string
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      this.placedFactors(),
      factorId
    );
  }


  // ============================================================
  // MOMENTO 3 — PREDICCIÓN
  // ============================================================

  readonly selectedPredictionOption =
    signal<string | null>(null);

  readonly predictionSubmitted =
    signal<boolean>(false);

  readonly predictionCorrect =
    signal<boolean>(false);

  readonly predictionAttempts =
    signal<number>(0);

  readonly predictionFeedback =
    signal<string>('');


  readonly predictionChallenge =
    computed<any | null>(() => {
      const activity =
        this.primaryActivity();

      const config =
        activity?.config as any;

      return (
        config?.settings?.predictionChallenge
        ??
        null
      );
    });


  readonly isPredictionMoment =
    computed<boolean>(() => {
      return (
        this.currentOrder() === 3
        &&
        !!this.predictionChallenge()
      );
    });


  readonly canSubmitPrediction =
    computed<boolean>(() => {
      return (
        !!this.selectedPredictionOption()
        &&
        !this.predictionSubmitted()
      );
    });


  selectPredictionOption(
    optionId: string
  ): void {
    if (this.predictionSubmitted()) {
      return;
    }

    this.selectedPredictionOption.set(
      optionId
    );

    this.predictionFeedback.set('');
  }


  submitPrediction(): void {
    const challenge =
      this.predictionChallenge();

    const selected =
      this.selectedPredictionOption();

    if (
      !challenge ||
      !selected ||
      this.predictionSubmitted()
    ) {
      return;
    }

    const correctAnswer =
      String(
        challenge.correctAnswer ?? ''
      );

    const isCorrect =
      selected === correctAnswer;

    this.predictionAttempts.update(
      value => value + 1
    );

    this.predictionSubmitted.set(true);
    this.predictionCorrect.set(
      isCorrect
    );

    if (isCorrect) {
      this.predictionFeedback.set(
        challenge.feedback?.correct
        ??
        challenge.completion?.message
        ??
        '¡Correcto! Tu predicción coincide con el comportamiento esperado.'
      );

      this.persistM3();

      return;
    }

    this.predictionFeedback.set(
      challenge.feedback?.incorrect
      ??
      'Aún no. Revisa la información anterior, vuelve a pensar tu predicción e inténtalo nuevamente.'
    );

    this.persistM3();
  }


  retryPrediction(): void {
    this.selectedPredictionOption.set(null);
    this.predictionSubmitted.set(false);
    this.predictionCorrect.set(false);
    this.predictionFeedback.set('');
  }


  resetPrediction(): void {
    this.selectedPredictionOption.set(null);
    this.predictionSubmitted.set(false);
    this.predictionCorrect.set(false);
    this.predictionAttempts.set(0);
    this.predictionFeedback.set('');
  }


  private persistM3(): void {
    const experienceId =
      this.experienceId();

    if (!experienceId) return;

    this.learningState.patchMoment(
      experienceId,
      'm3',
      {
        selectedOption:
          this.selectedPredictionOption(),

        isCorrect:
          this.predictionCorrect(),

        attempts:
          this.predictionAttempts(),
      }
    );
  }


  // ============================================================
  // MOMENTO 4 — SIMULADOR
  // ============================================================

  readonly simulatorLoaded =
    signal<boolean>(false);

  readonly roadToGloryReady =
    signal<boolean>(false);

  readonly roadToGloryResult =
    signal<any | null>(null);

  readonly roadToGloryProgress =
    signal<any | null>(null);


  onSimulatorLoaded(): void {
    this.simulatorLoaded.set(true);
  }


  private readonly onSimulatorMessage =
    (event: MessageEvent): void => {

      const data =
        event.data as any;

      if (
        !data ||
        typeof data !== 'object' ||
        data.source !== 'rural-steam-lab'
      ) {
        return;
      }

      console.log(
        '[Tellus] Mensaje del simulador:',
        data
      );

      if (
        data.type ===
        'tellus:road-to-glory:ready'
      ) {
        this.roadToGloryReady.set(true);
        this.simulatorLoaded.set(true);

        return;
      }

      if (
        data.type ===
        'tellus:road-to-glory:progress'
      ) {
        this.roadToGloryProgress.set(data);

        return;
      }

      if (
        data.type ===
        'tellus:road-to-glory:result'
      ) {
        this.roadToGloryResult.set(data);

        this.persistM4RoadToGlory(data);

        console.log(
          '[Tellus] Nota del simulador:',
          data.score
        );

        console.log(
          '[Tellus] Estudiante:',
          data.studentName
        );

        console.log(
          '[Tellus] Respuestas:',
          data.answers
        );
      }
    };


  private persistM4RoadToGlory(
    data: any
  ): void {
    const experienceId =
      this.experienceId();

    if (!experienceId) return;

    this.learningState.patchMoment(
      experienceId,
      'm4',
      {
        roadToGlory: {
          studentName:
            data.studentName,

          score:
            data.score,

          percentage:
            data.percentage,

          level:
            data.level,

          levelMessage:
            data.levelMessage,

          correct:
            data.correct,

          total:
            data.total,

          bonusApplied:
            data.bonusApplied,

          gamePoints:
            data.gamePoints,

          gameGoals:
            data.gameGoals,

          attemptsLeft:
            data.attemptsLeft,

          answers:
            data.answers,

          completedAt:
            new Date().toISOString(),
        },
      }
    );
  }


  // ============================================================
  // MOMENTO 5 — CONSTRUCCIÓN
  // ============================================================

  readonly constructionExample =
    computed<any | null>(() => {

      const activity =
        this.currentActivities().find(
          (a: Activity) =>
            a.id ===
            'act-construccion-ejemplo-resuelto'
        );

      if (!activity) return null;

      const config =
        activity.config as any;

      const settings =
        config?.settings ?? {};

      return {
        title:
          activity.title,

        description:
          activity.description,

        imageUrl:
          settings.imageUrl ?? '',

        imageAlt:
          settings.imageAlt ?? '',
      };
    });


  readonly challengeSolvedCount =
    signal<number>(0);

  readonly challengeQuestionIndex =
    signal<number>(0);

  readonly selectedChallengeOption =
    signal<number | null>(null);

  readonly challengeSubmitted =
    signal<boolean>(false);

  readonly challengeCorrect =
    signal<boolean>(false);

  readonly challengeFeedback =
    signal<string>('');


  readonly challengeImage =
    computed<string>(() => {

      const activity =
        this.currentActivities().find(
          (a: Activity) =>
            a.id ===
            'act-construccion-desafio'
        );

      const config =
        activity?.config as any;

      return (
        config?.settings?.imageUrl
        ??
        ''
      );
    });


  readonly challengeQuestions =
    computed<any[]>(() => {

      const activity =
        this.currentActivities().find(
          (a: Activity) =>
            a.id ===
            'act-construccion-desafio'
        );

      if (!activity) return [];

      const content =
        activity.content;

      if (
        !content ||
        content.type !==
          'questionnaire'
      ) {
        return [];
      }

      const questions =
        content.data?.questions;

      return Array.isArray(questions)
        ? questions
        : [];
    });


  readonly challengeTotal =
    computed<number>(() => {
      return this.challengeQuestions().length;
    });


  readonly currentChallengeQuestion =
    computed<any | null>(() => {
      return (
        this.challengeQuestions()[
          this.challengeQuestionIndex()
        ]
        ??
        null
      );
    });


  readonly challengeProgress =
    computed<number>(() => {
      return this.challengeSolvedCount();
    });


  readonly challengeProgressPercent =
    computed<number>(() => {
      const total =
        this.challengeTotal();

      if (total <= 0) return 0;

      return Math.round(
        (
          this.challengeSolvedCount()
          /
          total
        ) * 100
      );
    });


  readonly challengeCompleted =
    computed<boolean>(() => {
      const total =
        this.challengeTotal();

      return (
        total > 0 &&
        this.challengeSolvedCount() >= total
      );
    });


  readonly isConstructionMoment =
    computed<boolean>(() => {
      return (
        this.currentOrder() === 5
        &&
        !!this.constructionExample()
        &&
        this.challengeTotal() > 0
      );
    });


  getOptionLetter(
    index: number
  ): string {
    return String.fromCharCode(
      65 + index
    );
  }


  selectChallengeOption(
    index: number
  ): void {
    if (this.challengeSubmitted()) {
      return;
    }

    this.selectedChallengeOption.set(
      index
    );
  }


  submitChallengeAnswer(): void {
    const question =
      this.currentChallengeQuestion();

    const selected =
      this.selectedChallengeOption();

    if (
      !question ||
      selected === null ||
      this.challengeSubmitted()
    ) {
      return;
    }

    const isCorrect =
      selected ===
      question.correctIndex;

    this.challengeSubmitted.set(true);
    this.challengeCorrect.set(
      isCorrect
    );

    if (isCorrect) {
      this.challengeFeedback.set(
        question.feedback?.correct
        ??
        '¡Correcto! Has aplicado bien el modelo.'
      );

      this.challengeSolvedCount.update(
        value =>
          Math.min(
            this.challengeTotal(),
            value + 1
          )
      );

      return;
    }

    this.challengeFeedback.set(
      question.feedback?.incorrect
      ??
      'Todavía no. Revisa los datos y vuelve a intentarlo.'
    );
  }


  retryChallenge(): void {
    this.selectedChallengeOption.set(null);
    this.challengeSubmitted.set(false);
    this.challengeCorrect.set(false);
    this.challengeFeedback.set('');
  }


  nextChallengeQuestion(): void {
    const nextIndex =
      this.challengeQuestionIndex() + 1;

    if (
      nextIndex >=
      this.challengeTotal()
    ) {
      return;
    }

    this.challengeQuestionIndex.set(
      nextIndex
    );

    this.selectedChallengeOption.set(null);
    this.challengeSubmitted.set(false);
    this.challengeCorrect.set(false);
    this.challengeFeedback.set('');
  }


  resetChallenge(): void {
    this.challengeSolvedCount.set(0);
    this.challengeQuestionIndex.set(0);
    this.selectedChallengeOption.set(null);
    this.challengeSubmitted.set(false);
    this.challengeCorrect.set(false);
    this.challengeFeedback.set('');
  }


  // ============================================================
  // LIGHTBOX — MOMENTO 5
  // ============================================================

  readonly lightboxImage =
    signal<string>('');

  readonly lightboxAlt =
    signal<string>('');

  readonly lightboxOpen =
    signal<boolean>(false);


  openLightbox(
    url: string,
    alt: string
  ): void {
    if (!url) return;

    this.lightboxImage.set(url);
    this.lightboxAlt.set(alt);
    this.lightboxOpen.set(true);

    document.body.style.overflow =
      'hidden';
  }


  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.lightboxImage.set('');
    this.lightboxAlt.set('');

    document.body.style.overflow =
      '';
  }


  // ============================================================
  // ============================================================
  // MOMENTO 6 — ANÁLISIS Y EVALUACIÓN
  // ============================================================
  // ============================================================


  readonly analysisActivities =
    signal<Array<{
      id: string;
      icon: string;
      title: string;
      subtitle: string;
      evidence: string;
    }>>([
      {
        id: 'before-now',
        icon: '🕰️',
        title: 'Antes y ahora',
        subtitle:
          'Compara lo que pensabas al inicio con lo que piensas hoy.',
        evidence:
          'Cambio conceptual',
      },

      {
        id: 'prediction-evidence',
        icon: '🔮',
        title: '¿Le pegaste?',
        subtitle:
          'Tu predicción frente a tu resultado real.',
        evidence:
          'Uso de evidencia',
      },

      {
        id: 'cause-effect',
        icon: '⚡',
        title: 'Si cambio esto...',
        subtitle:
          'Mueve las variables y descubre qué causan.',
        evidence:
          'Causa y efecto',
      },

      {
        id: 'quantities',
        icon: '📏',
        title: '¿Cuánto cambió?',
        subtitle:
          'Interpreta magnitudes y escalas.',
        evidence:
          'Cantidades y escalas',
      },

      {
        id: 'real-virtual',
        icon: '🧪',
        title: 'Real vs virtual',
        subtitle:
          'Compara el laboratorio con la simulación.',
        evidence:
          'Modelo vs realidad',
      },

      {
        id: 'icfes-review',
        icon: '🎯',
        title: 'Vuelve a tu reto',
        subtitle:
          'Revisa tu evaluación ICFES.',
        evidence:
          'Metacognición',
      },

      {
        id: 'system',
        icon: '🌐',
        title: 'Construye el sistema',
        subtitle:
          'Configura las variables para alcanzar el objetivo.',
        evidence:
          'Pensamiento sistémico',
      },
    ]);


  readonly analysisCurrentActivityIndex =
    signal<number>(0);


  readonly analysisResponses =
    signal<AnalysisResponses>({});


  readonly analysisCompleted =
    signal<boolean>(false);


  readonly analysisCurrentActivity =
    computed(() =>
      this.analysisActivities()[
        this.analysisCurrentActivityIndex()
      ]
      ??
      null
    );


  readonly analysisCurrentActivityNumber =
    computed(() =>
      this.analysisCurrentActivityIndex() + 1
    );


  readonly analysisTotalActivities =
    computed(() =>
      this.analysisActivities().length
    );


  readonly analysisIsLastActivity =
    computed(() =>
      this.analysisCurrentActivityIndex()
      ===
      this.analysisTotalActivities() - 1
    );


  readonly analysisProgressPercent =
    computed(() => {
      const total =
        this.analysisTotalActivities();

      if (total <= 0) return 0;

      return Math.round(
        (
          (
            this.analysisCurrentActivityIndex()
            + 1
          )
          /
          total
        ) * 100
      );
    });


  readonly analysisEvidenceCount =
    computed(() => {

      const responses =
        this.analysisResponses();

      const keys =
        Object.keys(responses);

      const activityIds = [
        'act1_',
        'act2_',
        'act3_',
        'act4_',
        'act5_',
        'act6_',
        'act7_',
      ];

      let count = 0;

      activityIds.forEach(
        prefix => {

          const has =
            keys.some(k => {

              const value =
                (responses as any)[k];

              return (
                k.startsWith(prefix)
                &&
                value !== ''
                &&
                value !== null
                &&
                value !== undefined
                &&
                (
                  !Array.isArray(value)
                  ||
                  value.length > 0
                )
              );
            });

          if (has) {
            count++;
          }
        }
      );

      return count;
    });


  readonly analysisAllComplete =
    computed(() =>
      this.analysisEvidenceCount() >= 7
    );


  // ============================================================
  // AYUDAS DE EVIDENCIA
  // ============================================================

  private readonly analysisActivityPrefixes:
    Record<string, string> = {

      'before-now':
        'act1_',

      'prediction-evidence':
        'act2_',

      'cause-effect':
        'act3_',

      quantities:
        'act4_',

      'real-virtual':
        'act5_',

      'icfes-review':
        'act6_',

      system:
        'act7_',
    };


  analysisActivityHasEvidence(
    activityId: string
  ): boolean {

    const prefix =
      this.analysisActivityPrefixes[
        activityId
      ];

    if (!prefix) return false;

    const responses =
      this.analysisResponses();

    const keys =
      Object.keys(responses);

    return keys.some(k => {

      const value =
        (responses as any)[k];

      return (
        k.startsWith(prefix)
        &&
        value !== ''
        &&
        value !== null
        &&
        value !== undefined
        &&
        (
          !Array.isArray(value)
          ||
          value.length > 0
        )
      );
    });
  }


  readonly analysisMissingActivities =
    computed<string[]>(() => {

      return this.analysisActivities()
        .filter(
          act =>
            !this.analysisActivityHasEvidence(
              act.id
            )
        )
        .map(
          act => act.title
        );
    });


  goToAnalysisActivity(
    index: number
  ): void {

    if (
      index < 0 ||
      index >=
        this.analysisTotalActivities()
    ) {
      return;
    }

    this.analysisCurrentActivityIndex.set(
      index
    );
  }


  // ============================================================
  // DATOS DEL LEARNING STATE
  // ============================================================

  readonly analysisM1Explanation =
    computed<string>(() => {

      const m1 =
        this.learningState.getMoment<any>(
          'm1'
        );

      return (
        m1?.initialExplanation
        ??
        ''
      );
    });


  readonly analysisPredictionLabel =
    computed<string>(() => {

      const m3 =
        this.learningState.getMoment<any>(
          'm3'
        );

      const option =
        m3?.selectedOption;

      if (!option) return '—';

      const map: Record<string, string> = {
        'option-a':
          'A · Llegará más lejos',

        'option-b':
          'B · La trayectoria será igual',

        'option-c':
          'C · Solo cambiará la altura',

        'option-d':
          'D · La gravedad desaparecerá',
      };

      return (
        map[option]
        ??
        option
      );
    });


  readonly analysisM4Score =
    computed<number | null>(() => {

      const m4 =
        this.learningState.getMoment<any>(
          'm4'
        );

      return (
        m4?.roadToGlory?.score
        ??
        null
      );
    });


  readonly analysisM4Level =
    computed<string | null>(() => {

      const m4 =
        this.learningState.getMoment<any>(
          'm4'
        );

      return (
        m4?.roadToGlory?.level
        ??
        null
      );
    });


  readonly analysisM4Percentage =
    computed<number | null>(() => {

      const m4 =
        this.learningState.getMoment<any>(
          'm4'
        );

      return (
        m4?.roadToGlory?.percentage
        ??
        null
      );
    });


  readonly analysisM4Answers =
    computed<any[]>(() => {

      const m4 =
        this.learningState.getMoment<any>(
          'm4'
        );

      return (
        m4?.roadToGlory?.answers
        ??
        []
      );
    });


  // ============================================================
  // ACTIVIDAD 2 — FEEDBACK DINÁMICO DEL SLIDER
  // ============================================================

  readonly analysisSliderLevel =
    computed<
      'low' |
      'mid' |
      'high'
    >(() => {

      const v =
        Number(
          this.analysisResponses()
            .act2_match
        )
        ||
        50;

      if (v < 34) {
        return 'low';
      }

      if (v < 67) {
        return 'mid';
      }

      return 'high';
    });


  readonly analysisSliderFeedback =
    computed<string>(() => {

      const level =
        this.analysisSliderLevel();

      if (level === 'low') {
        return '🔍 Tu predicción y el resultado fueron muy distintos. ¿Qué aprendiste de esa diferencia?';
      }

      if (level === 'mid') {
        return '⚖️ Estuvieron cerca, pero no del todo. ¿Qué variable faltó considerar?';
      }

      return '🎯 ¡Tu predicción fue muy acertada! ¿En qué te basaste para acertar?';
    });


  // ============================================================
  // ACTIVIDAD 3 — CHIPS DE PREDICCIÓN
  // ============================================================

  readonly analysisPredictionChips = [
    {
      value: 'higher',
      icon: '⬆️',
      label: 'Subirá más',
    },

    {
      value: 'farther',
      icon: '➡️',
      label: 'Llegará más lejos',
    },

    {
      value: 'faster',
      icon: '⏱️',
      label: 'Tardará más tiempo',
    },

    {
      value: 'curved',
      icon: '〰️',
      label: 'Se curvará diferente',
    },
  ];


  // ============================================================
  // ACTIVIDAD 4 — MAGNITUDES
  // ============================================================

  readonly analysisMagnitudeOptions = [
    {
      value: 'less',
      icon: '⬇️',
      label: 'Menos',
    },

    {
      value: 'same',
      icon: '➡️',
      label: 'Igual',
    },

    {
      value: 'more',
      icon: '⬆️',
      label: 'Más',
    },
  ];


  // ============================================================
  // ACTIVIDAD 5 — CHIPS DE DIFERENCIAS
  // ============================================================

  readonly analysisDifferenceChips = [
    {
      value: 'medicion',
      icon: '📏',
      label: 'Medición',
      tooltip:
        'Los instrumentos no son perfectos',
    },

    {
      value: 'condiciones',
      icon: '🌦️',
      label: 'Condiciones reales',
      tooltip:
        'Viento, temperatura, humedad',
    },

    {
      value: 'modelo',
      icon: '📐',
      label: 'Modelo ideal',
      tooltip:
        'La simulación ignora algunas fuerzas',
    },

    {
      value: 'error',
      icon: '⚠️',
      label: 'Error experimental',
      tooltip:
        'Pequeños errores acumulados',
    },
  ];


  // ============================================================
  // ACTIVIDAD 6 — PREGUNTAS CLICKEABLES
  // ============================================================

  readonly analysisSelectedQuestion =
    signal<number | null>(null);


  readonly analysisSelectedQuestionData =
    computed<any | null>(() => {

      const idx =
        this.analysisSelectedQuestion();

      if (idx === null) {
        return null;
      }

      return (
        this.analysisM4Answers()[idx]
        ??
        null
      );
    });


  selectAnalysisQuestion(
    index: number
  ): void {

    this.analysisSelectedQuestion.update(
      prev =>
        prev === index
          ? null
          : index
    );
  }


  // ============================================================
  // ACTIVIDAD 7 — MISIÓN ALCANCE MÁXIMO
  // ============================================================

  readonly analysisVelocityOptions = [
    {
      value: 'baja',
      label: 'Baja',
    },

    {
      value: 'media',
      label: 'Media',
    },

    {
      value: 'alta',
      label: 'Alta',
    },
  ];


  readonly analysisAngleOptions = [
    {
      value: '30',
      label: '30°',
    },

    {
      value: '45',
      label: '45°',
    },

    {
      value: '60',
      label: '60°',
    },

    {
      value: '90',
      label: '90°',
    },
  ];


  readonly analysisGravityOptions = [
    {
      value: 'baja',
      label: 'Baja',
    },

    {
      value: 'normal',
      label: 'Normal',
    },

    {
      value: 'alta',
      label: 'Alta',
    },
  ];


  readonly analysisHeightOptions = [
    {
      value: 'baja',
      label: 'Baja',
    },

    {
      value: 'media',
      label: 'Media',
    },

    {
      value: 'alta',
      label: 'Alta',
    },
  ];


  // ============================================================
  // MISIÓN — ESTADO
  // ============================================================

  readonly analysisMissionCompleted =
    signal<boolean>(false);

  readonly analysisMissionFeedback =
    signal<string>('');

  readonly analysisMissionFeedbackTitle =
    signal<string>('');

  readonly analysisMissionAttempts =
    signal<number>(0);


  readonly analysisMissionReady =
    computed<boolean>(() => {

      const r =
        this.analysisResponses();

      return !!(
        r.act7_velocity &&
        r.act7_angle &&
        r.act7_gravity &&
        r.act7_height
      );
    });


  // ============================================================
  // MISIÓN — COMPROBAR
  // ============================================================

  checkMission(): void {

    if (!this.analysisMissionReady()) {
      return;
    }

    const r =
      this.analysisResponses();

    const correct =
      r.act7_velocity === 'alta' &&
      r.act7_angle === '45' &&
      r.act7_gravity === 'baja' &&
      r.act7_height === 'alta';


    // ----------------------------------------------------------
    // Registrar intento
    // ----------------------------------------------------------

    this.analysisMissionAttempts.update(
      value => value + 1
    );


    // ----------------------------------------------------------
    // MISIÓN CORRECTA
    // ----------------------------------------------------------

    if (correct) {

      this.analysisMissionCompleted.set(
        true
      );

      this.analysisMissionFeedback.set(
        ''
      );

      this.analysisMissionFeedbackTitle.set(
        ''
      );


      const experienceId =
        this.experienceId();


      if (experienceId) {

        this.learningState.patchMoment(
          experienceId,
          'm6',
          {
            act7_velocity:
              'alta',

            act7_angle:
              '45',

            act7_gravity:
              'baja',

            act7_height:
              'alta',

            act7_completed:
              true,
          }
        );


        this.learningState.completeMoment(
          experienceId,
          'm6'
        );
      }


      return;
    }


    // ----------------------------------------------------------
    // ANALIZAR QUÉ FALLÓ
    // ----------------------------------------------------------

    const fails: string[] = [];


    if (
      r.act7_velocity !== 'alta'
    ) {
      fails.push('velocidad');
    }


    if (
      r.act7_angle !== '45'
    ) {
      fails.push('angulo');
    }


    if (
      r.act7_gravity !== 'baja'
    ) {
      fails.push('gravedad');
    }


    if (
      r.act7_height !== 'alta'
    ) {
      fails.push('altura');
    }


    // ----------------------------------------------------------
    // TÍTULOS SEGÚN INTENTOS
    // ----------------------------------------------------------

    const titles = [
      '',

      '🔍 Casi lo tienes, sigue pensando',

      '💡 Buen intento, revisa los detalles',

      '🧠 Piensa como científico',

      '📚 Vamos paso a paso, tú puedes',
    ];


    const titleIndex =
      Math.min(
        this.analysisMissionAttempts(),
        4
      );


    this.analysisMissionFeedbackTitle.set(
      titles[titleIndex]
    );


    // ----------------------------------------------------------
    // FALLA UNA VARIABLE
    // ----------------------------------------------------------

    if (fails.length === 1) {

      const solo =
        fails[0];


      if (solo === 'velocidad') {

        this.analysisMissionFeedback.set(
          'Un cohete con poca potencia no llega a la Luna. El proyectil necesita más energía inicial para recorrer más distancia antes de caer. Eres el hijo de Newton: piensa en la relación velocidad → alcance. Prueba con una velocidad mayor.'
        );

        return;
      }


      if (solo === 'angulo') {

        this.analysisMissionFeedback.set(
          'Hay un ángulo perfecto para cada objetivo. Ni muy bajo ni muy alto: el ángulo que mejor equilibra altura y distancia. Galileo lo descubrió hace siglos. Confía en tu intuición y busca ese punto medio. Prueba con otro ángulo.'
        );

        return;
      }


      if (solo === 'gravedad') {

        this.analysisMissionFeedback.set(
          'La gravedad tira del proyectil hacia abajo. Si fuera más débil, ¿tardaría más o menos en caer? Piensa en un astronauta saltando en la Luna: cae lentamente. Menos gravedad = más tiempo en el aire = más distancia. Ajusta esta variable.'
        );

        return;
      }


      if (solo === 'altura') {

        this.analysisMissionFeedback.set(
          'Empezar más arriba es como tener una ventaja inicial. El proyectil ya tiene metros recorridos gratis antes de despegar. Como cuando tiras una pelota desde una colina en lugar del suelo. Sube un poco más la altura inicial.'
        );

        return;
      }
    }


    // ----------------------------------------------------------
    // FALLAN DOS VARIABLES
    // ----------------------------------------------------------

    if (fails.length === 2) {

      this.analysisMissionFeedback.set(
        `Vas por buen camino pero necesitas ajustar dos cosas: ${fails.join(' y ')}. Piensa en cada variable de a una: ¿qué efecto tiene cada una sobre el alcance? Eres perfectamente capaz de resolverlo.`
      );

      return;
    }


    // ----------------------------------------------------------
    // FALLAN TRES O MÁS
    // ----------------------------------------------------------

    if (fails.length >= 3) {

      this.analysisMissionFeedback.set(
        'Vamos paso a paso, como un verdadero científico. Primero pregúntate: ¿qué necesita un proyectil para llegar lejos? Más energía, el ángulo correcto, menos resistencia y una ventaja inicial. Revisa cada variable pensando en su efecto. Confío en ti.'
      );

      return;
    }
  }


  // ============================================================
  // MISIÓN — REINTENTAR
  // ============================================================

  retryMission(): void {

    this.analysisMissionCompleted.set(
      false
    );

    this.analysisMissionFeedback.set(
      ''
    );

    this.analysisMissionFeedbackTitle.set(
      ''
    );

    this.analysisMissionAttempts.set(
      0
    );


    // ----------------------------------------------------------
    // LIMPIAR CONFIGURACIÓN LOCAL
    // ----------------------------------------------------------

    this.analysisResponses.update(
      prev => {

        const next: any = {
          ...prev,
        };

        delete next.act7_velocity;
        delete next.act7_angle;
        delete next.act7_gravity;
        delete next.act7_height;

        return next as AnalysisResponses;
      }
    );


    // ----------------------------------------------------------
    // LIMPIAR ESTADO PERSISTIDO DE M6
    // ----------------------------------------------------------

    const experienceId =
      this.experienceId();


    if (experienceId) {

      this.learningState.patchMoment(
        experienceId,
        'm6',
        {
          act7_completed:
            false,
        }
      );
    }
  }


  // ============================================================
  // IR A REFLEXIÓN
  // ============================================================

  goToReflection(): void {

    const next =
      this.nextMoment();


    if (next) {

      this.goToMoment(
        next.id
      );

      return;
    }


    this.router.navigate(
      ['/mi-aula']
    );
  }


  // ============================================================
  // MINI-SIMULADOR FÍSICA — ACTIVIDAD 3
  // ============================================================

  private readonly analysisMiniPhysics =
    computed(() => {

      const responses =
        this.analysisResponses();

      const v =
        Number(
          responses.act3_velocity
        )
        ||
        20;

      const angle =
        Number(
          responses.act3_angle
        )
        ||
        45;

      const g =
        9.81;

      const rad =
        (
          angle *
          Math.PI
        )
        /
        180;

      const vx =
        v *
        Math.cos(rad);

      const vy =
        v *
        Math.sin(rad);

      const tFlight =
        (
          2 *
          vy
        )
        /
        g;

      const range =
        vx *
        tFlight;

      const maxH =
        (
          vy *
          vy
        )
        /
        (
          2 *
          g
        );

      return {
        v,
        angle,
        vx,
        vy,
        tFlight,
        range,
        maxH,
      };
    });


  readonly analysisMiniRange =
    computed(() =>
      Math.round(
        this.analysisMiniPhysics().range *
        10
      ) / 10
    );


  readonly analysisMiniMaxHeight =
    computed(() =>
      Math.round(
        this.analysisMiniPhysics().maxH *
        10
      ) / 10
    );


  readonly analysisMiniTrajectoryPath =
    computed<string>(() => {

      const p =
        this.analysisMiniPhysics();

      const scaleX =
        360 /
        Math.max(
          p.range,
          10
        );

      const scaleY =
        160 /
        Math.max(
          p.maxH,
          5
        );

      let path = '';


      for (
        let i = 0;
        i <= 30;
        i++
      ) {

        const t =
          (
            i / 30
          ) *
          p.tFlight;

        const x =
          p.vx *
          t *
          scaleX
          +
          20;

        const y =
          180
          -
          p.vy *
          t *
          scaleY
          +
          (
            0.5 *
            9.81 *
            t *
            t
          ) *
          scaleY;


        path +=
          (
            i === 0
              ? `M ${x.toFixed(1)} ${y.toFixed(1)}`
              : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
          );
      }


      return path;
    });


  readonly analysisMiniTrajectoryPathPrevious =
    computed<string>(() => {

      const v =
        20;

      const angle =
        45;

      const g =
        9.81;

      const rad =
        (
          angle *
          Math.PI
        )
        /
        180;

      const vx =
        v *
        Math.cos(rad);

      const vy =
        v *
        Math.sin(rad);

      const tFlight =
        (
          2 *
          vy
        )
        /
        g;


      const scaleX =
        360 /
        Math.max(
          this.analysisMiniPhysics().range,
          10
        );

      const scaleY =
        160 /
        Math.max(
          this.analysisMiniPhysics().maxH,
          5
        );


      let path = '';


      for (
        let i = 0;
        i <= 30;
        i++
      ) {

        const t =
          (
            i / 30
          ) *
          tFlight;

        const x =
          vx *
          t *
          scaleX
          +
          20;

        const y =
          180
          -
          vy *
          t *
          scaleY
          +
          (
            0.5 *
            g *
            t *
            t
          ) *
          scaleY;


        path +=
          (
            i === 0
              ? `M ${x.toFixed(1)} ${y.toFixed(1)}`
              : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
          );
      }


      return path;
    });


  // ============================================================
  // MÉTODOS DEL WIZARD — M6
  // ============================================================

  onAnalysisResponseChange(
    key: string,
    event: Event
  ): void {

    const target =
      event.target;

    let value: any = '';


    if (
      target instanceof
      HTMLInputElement
    ) {

      value =
        target.type === 'range'
          ? Number(target.value)
          : target.value;

    } else if (
      target instanceof
      HTMLTextAreaElement
    ) {

      value =
        target.value;
    }


    this.analysisResponses.update(
      prev => {

        const next: any = {
          ...prev,
        };

        next[key] =
          value;

        return next as AnalysisResponses;
      }
    );
  }


  onAnalysisAppend(
    key: string,
    text: string
  ): void {

    this.analysisResponses.update(
      prev => {

        const current =
          (prev as any)[key]
          ||
          '';

        const next: any = {
          ...prev,
        };

        next[key] =
          current +
          text;

        return next as AnalysisResponses;
      }
    );
  }


  onAnalysisChoice(
    key: string,
    value: string
  ): void {

    this.analysisResponses.update(
      prev => {

        const next: any = {
          ...prev,
        };

        next[key] =
          next[key] === value
            ? ''
            : value;

        return next as AnalysisResponses;
      }
    );
  }


  onAnalysisChipToggle(
    key: string,
    value: string
  ): void {

    this.analysisResponses.update(
      prev => {

        const current: string[] =
          Array.isArray(
            (prev as any)[key]
          )
            ? (prev as any)[key]
            : [];


        const next =
          current.includes(value)
            ? current.filter(
                v => v !== value
              )
            : [
                ...current,
                value,
              ];


        const updated: any = {
          ...prev,
        };

        updated[key] =
          next;

        return updated as AnalysisResponses;
      }
    );
  }


  analysisChipSelected(
    key: string,
    value: string
  ): boolean {

    const list =
      (this.analysisResponses() as any)[
        key
      ];

    return (
      Array.isArray(list)
      &&
      list.includes(value)
    );
  }


  nextAnalysisActivity(): void {

    if (
      this.analysisIsLastActivity()
    ) {
      return;
    }

    this.analysisCurrentActivityIndex.update(
      v => v + 1
    );
  }


  prevAnalysisActivity(): void {

    if (
      this.analysisCurrentActivityIndex() <= 0
    ) {
      return;
    }

    this.analysisCurrentActivityIndex.update(
      v => v - 1
    );
  }


  finishAnalysis(): void {

    const experienceId =
      this.experienceId();

    if (!experienceId) {
      return;
    }


    this.learningState.patchMoment(
      experienceId,
      'm6',
      {
        activities:
          this.analysisResponses(),
      }
    );


    this.learningState.completeMoment(
      experienceId,
      'm6'
    );


    this.analysisCompleted.set(
      true
    );


    const next =
      this.nextMoment();


    if (next) {

      this.goToMoment(
        next.id
      );

    } else {

      this.router.navigate(
        ['/mi-aula']
      );
    }
  }


  // ============================================================
  // PUEDE CONTINUAR
  // ============================================================

  canContinue(): boolean {

    const current =
      this.currentMoment();

    if (!current) {
      return false;
    }


    const activity =
      this.primaryActivity();


    if (
      current.order === 2 &&
      this.explorationGame()
    ) {

      return this.explorationCompleted();
    }


    if (
      current.order === 3 &&
      this.predictionChallenge()
    ) {

      return this.predictionCorrect();
    }


    if (current.order === 4) {
      return this.simulatorLoaded();
    }


    if (
      current.order === 5 &&
      this.challengeTotal() > 0
    ) {

      return this.challengeCompleted();
    }


    if (current.order === 6) {

      return (
        this.analysisMissionCompleted()
        ||
        this.analysisEvidenceCount() >= 5
      );
    }


    if (!activity) {
      return true;
    }


    if (
      activity.config?.requiresSubmission !==
      true
    ) {
      return true;
    }


    return (
      this.response().trim().length > 0
    );
  }


  // ============================================================
  // CONTINUAR
  // ============================================================

  continue(): void {

    const activity =
      this.primaryActivity();


    if (!this.canContinue()) {

      if (
        this.currentOrder() === 3 &&
        this.predictionChallenge()
      ) {
        return;
      }


      if (
        activity?.config?.requiresSubmission ===
        true
      ) {
        this.focusResponse();
      }


      return;
    }


    if (
      this.response().trim().length > 0
    ) {
      this.saveDraft();
    }


    this.persistCurrentMomentCompletion();


    const next =
      this.nextMoment();


    if (!next) {

      this.router.navigate(
        ['/mi-aula']
      );

      return;
    }


    this.goToMoment(
      next.id
    );
  }


  // ============================================================
  // MARCAR MOMENTO COMO COMPLETADO
  // ============================================================

  private persistCurrentMomentCompletion(): void {

    const moment =
      this.currentMoment();

    const experienceId =
      this.experienceId();


    if (
      !moment ||
      !experienceId
    ) {
      return;
    }


    if (moment.order === 1) {

      this.learningState.completeMoment(
        experienceId,
        'm1'
      );

      return;
    }


    if (moment.order === 2) {

      this.learningState.patchMoment(
        experienceId,
        'm2',
        {
          placedFactors:
            this.placedFactors(),

          score:
            this.explorationScore(),

          completed:
            this.explorationCompleted(),
        }
      );


      this.learningState.completeMoment(
        experienceId,
        'm2'
      );

      return;
    }


    if (moment.order === 3) {

      this.persistM3();


      this.learningState.completeMoment(
        experienceId,
        'm3'
      );

      return;
    }


    if (moment.order === 4) {

      this.learningState.completeMoment(
        experienceId,
        'm4'
      );

      return;
    }


    if (moment.order === 5) {

      this.learningState.patchMoment(
        experienceId,
        'm5',
        {
          solvedCount:
            this.challengeSolvedCount(),

          totalQuestions:
            this.challengeTotal(),
        }
      );


      this.learningState.completeMoment(
        experienceId,
        'm5'
      );

      return;
    }
  }


  // ============================================================
  // NAVEGACIÓN A MOMENTO
  // ============================================================

  goToMoment(
    targetMomentId: string
  ): void {

    const target =
      this.moments().find(
        (moment: Moment) =>
          moment.id === targetMomentId
      );


    if (!target) {
      return;
    }


    if (
      target.order >
      this.currentOrder() + 1
    ) {
      return;
    }


    if (
      target.order ===
      this.currentOrder() + 1
      &&
      !this.canContinue()
    ) {
      return;
    }


    const experienceId =
      this.experienceId();


    if (!experienceId) {
      return;
    }


    this.router.navigate([
      '/experiencia',
      experienceId,
      'momento',
      target.id,
    ]);
  }


  // ============================================================
  // VOLVER
  // ============================================================

  backToClassroom(): void {
    this.router.navigate([
      '/mi-aula'
    ]);
  }


  // ============================================================
  // ESTADOS DEL TIMELINE
  // ============================================================

  isCurrent(
    moment: Moment
  ): boolean {

    return (
      moment.id ===
      this.currentMoment()?.id
    );
  }


  isCompleted(
    moment: Moment
  ): boolean {

    return (
      moment.order <
      this.currentOrder()
    );
  }


  isLocked(
    moment: Moment
  ): boolean {

    return (
      moment.order >
      this.currentOrder()
    );
  }


  // ============================================================
  // UTILIDADES
  // ============================================================

  getDuration(): number {

    return (
      this.currentMoment()
        ?.estimatedDurationMinutes
      ??
      15
    );
  }


  getSubject(): string {

    return (
      this.experience()?.subject
      ??
      'STEAM'
    );
  }


  getGradeLevel(): string {

    return (
      this.experience()?.gradeLevel
      ??
      ''
    );
  }


  trackByMomentId(
    _index: number,
    moment: Moment
  ): string {

    return moment.id;
  }


  trackByActivityId(
    _index: number,
    activity: Activity
  ): string {

    return activity.id;
  }


  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {

    window.addEventListener(
      'message',
      this.onSimulatorMessage,
      false
    );


    this.route.paramMap
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe(
        params => {

          const experienceId =
            params.get(
              'experienceId'
            )
            ??
            '';


          this.experienceId.set(
            experienceId
          );


          this.momentId.set(
            params.get(
              'momentId'
            )
            ??
            ''
          );


          // ----------------------------------------------------
          // CARGAR LEARNING STATE
          // ----------------------------------------------------

          this.learningState.load(
            experienceId
          );


          // ----------------------------------------------------
          // RECUPERAR M6
          // ----------------------------------------------------

          const m6 =
            this.learningState.getMoment<any>(
              'm6'
            );


          this.heroVariant.set(
            m6?.heroVariant
            ??
            null
          );


          if (m6?.activities) {

            this.analysisResponses.set(
              m6.activities as AnalysisResponses
            );

          } else {

            this.analysisResponses.set(
              {}
            );
          }


          this.analysisCurrentActivityIndex.set(
            0
          );


          this.analysisCompleted.set(
            false
          );


          this.analysisSelectedQuestion.set(
            null
          );


          // ----------------------------------------------------
          // MISIÓN M6
          // ----------------------------------------------------
          // Restauramos las respuestas previas (act7_*) para
          // que el usuario las vea al volver. NO marcamos la
          // misión como completada automáticamente: siempre
          // arranca interactiva y el usuario decide si la rehace.

          if (
            m6?.act7_velocity ||
            m6?.act7_angle ||
            m6?.act7_gravity ||
            m6?.act7_height
          ) {

            const currentResponses =
              (this.analysisResponses() as any) || {};

            this.analysisResponses.set({
              ...currentResponses,
              act7_velocity: m6.act7_velocity ?? '',
              act7_angle:    m6.act7_angle    ?? '',
              act7_gravity:  m6.act7_gravity  ?? '',
              act7_height:   m6.act7_height   ?? '',
            } as AnalysisResponses);

          }


          this.analysisMissionCompleted.set(
            false
          );


          this.analysisMissionFeedback.set(
            ''
          );


          this.analysisMissionFeedbackTitle.set(
            ''
          );


          this.analysisMissionAttempts.set(
            0
          );


          // ----------------------------------------------------
          // RECUPERAR M1
          // ----------------------------------------------------

          const m1 =
            this.learningState.getMoment<any>(
              'm1'
            );


          this.response.set(
            m1?.initialExplanation
            ??
            ''
          );


          this.saved.set(
            false
          );


          // ----------------------------------------------------
          // RECUPERAR M3
          // ----------------------------------------------------

          const m3 =
            this.learningState.getMoment<any>(
              'm3'
            );


          if (m3) {

            this.selectedPredictionOption.set(
              m3.selectedOption
              ??
              null
            );


            this.predictionCorrect.set(
              m3.isCorrect
              ??
              false
            );


            this.predictionSubmitted.set(
              !!m3.selectedOption
            );


            this.predictionAttempts.set(
              m3.attempts
              ??
              0
            );

          } else {

            this.resetPrediction();
          }


          // ----------------------------------------------------
          // SIMULADOR
          // ----------------------------------------------------

          this.simulatorLoaded.set(
            false
          );


          this.roadToGloryReady.set(
            false
          );


          this.roadToGloryResult.set(
            null
          );


          this.roadToGloryProgress.set(
            null
          );


          // ----------------------------------------------------
          // MOMENTO 5
          // ----------------------------------------------------

          this.resetChallenge();


          // ----------------------------------------------------
          // LIGHTBOX
          // ----------------------------------------------------

          this.closeLightbox();
        }
      );
  }


  ngOnDestroy(): void {

    window.removeEventListener(
      'message',
      this.onSimulatorMessage,
      false
    );


    this.destroy$.next();
    this.destroy$.complete();
  }
}