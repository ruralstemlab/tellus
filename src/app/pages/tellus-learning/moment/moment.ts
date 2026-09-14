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

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Navbar } from '../../../components/navbar/navbar';
import { Footer } from '../../../components/footer/footer';

import {
  getExperienceById,
} from '../data/experience-registry';

import {
  Experience,
} from '../models/experience.model';

import {
  Moment,
} from '../models/moment.model';

import {
  Activity,
} from '../models/activity.model';


@Component({
  selector: 'app-moment',

  standalone: true,

  imports: [
    CommonModule,
    Navbar,
    Footer,
  ],

  templateUrl: './moment.html',

  styleUrls: [
    './moment.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class MomentComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // INYECCIONES
  // ============================================================

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroy$ =
    new Subject<void>();


  // ============================================================
  // RUTA
  // ============================================================

  readonly experienceId =
    signal<string>('');

  readonly momentId =
    signal<string>('');


  // ============================================================
  // ESTADO
  // ============================================================

  readonly response =
    signal<string>('');

  readonly saved =
    signal<boolean>(false);


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experienceData =
    computed(() => {

      const id =
        this.experienceId();

      if (!id) {
        return null;
      }

      return getExperienceById(id);
    });


  readonly experience =
    computed<Experience | null>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return null;
      }

      return data.experience as Experience;
    });


  // ============================================================
  // MOMENTOS
  // ============================================================

  readonly moments =
    computed<Moment[]>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return [];
      }

      return [
        ...data.moments,
      ]
        .sort(
          (
            a: Moment,
            b: Moment,
          ) =>
            a.order -
            b.order
        ) as Moment[];
    });


  // ============================================================
  // ACTIVIDADES
  // ============================================================

  readonly activities =
    computed<Activity[]>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return [];
      }

      return [
        ...data.activities,
      ]
        .sort(
          (
            a: Activity,
            b: Activity,
          ) =>
            a.order -
            b.order
        ) as Activity[];
    });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment =
    computed<Moment | null>(() => {

      const id =
        this.momentId();

      const allMoments =
        this.moments();

      return (
        allMoments.find(
          (
            moment: Moment
          ) =>
            moment.id === id
        )
        ??
        allMoments.find(
          (
            moment: Moment
          ) =>
            moment.order === 1
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

  readonly currentActivities =
    computed<Activity[]>(() => {

      const moment =
        this.currentMoment();

      if (!moment) {
        return [];
      }

      const ids =
        moment.activityIds ?? [];

      return this.activities()
        .filter(
          (
            activity: Activity
          ) =>
            ids.includes(
              activity.id
            )
        )
        .sort(
          (
            a: Activity,
            b: Activity,
          ) =>
            a.order -
            b.order
        );
    });


  // ============================================================
  // ACTIVIDAD PRINCIPAL
  // ============================================================

  readonly primaryActivity =
    computed<Activity | null>(() => {

      return (
        this.currentActivities()[0]
        ??
        null
      );
    });


  // ============================================================
  // PREGUNTA
  // ============================================================

  readonly primaryQuestion =
    computed<string>(() => {

      const activity =
        this.primaryActivity();

      if (!activity) {
        return '';
      }

      if (
        activity.content?.type ===
        'questionnaire'
      ) {

        const questions =
          activity.content.data?.questions;

        if (
          Array.isArray(
            questions
          )
          &&
          questions.length > 0
        ) {

          return (
            questions[0]?.text
            ??
            ''
          );
        }
      }

      return (
        activity.description
        ??
        ''
      );
    });


  // ============================================================
  // PISTA
  // ============================================================

  readonly primaryHint =
    computed<string>(() => {

      const activity =
        this.primaryActivity();

      if (!activity) {
        return '';
      }

      if (
        activity.content?.type ===
        'questionnaire'
      ) {

        const questions =
          activity.content.data?.questions;

        if (
          Array.isArray(
            questions
          )
          &&
          questions.length > 0
        ) {

          return (
            questions[0]?.hint
            ??
            ''
          );
        }
      }

      return '';
    });


  // ============================================================
  // ANTERIOR
  // ============================================================

  readonly previousMoment =
    computed<Moment | null>(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          (
            moment: Moment
          ) =>
            moment.order ===
            current.order - 1
        )
        ??
        null
      );
    });


  // ============================================================
  // SIGUIENTE
  // ============================================================

  readonly nextMoment =
    computed<Moment | null>(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          (
            moment: Moment
          ) =>
            moment.order ===
            current.order + 1
        )
        ??
        null
      );
    });


  // ============================================================
  // PROGRESO
  // ============================================================

  readonly currentOrder =
    computed<number>(() => {

      return (
        this.currentMoment()?.order
        ??
        1
      );
    });


  readonly totalMoments =
    computed<number>(() => {

      return this.moments().length;
    });


  readonly progressPercentage =
    computed<number>(() => {

      const total =
        this.totalMoments();

      const current =
        this.currentOrder();

      if (
        total <= 0
      ) {
        return 0;
      }

      return Math.round(
        (
          current /
          total
        ) *
        100
      );
    });


  readonly progressLabel =
    computed<string>(() => {

      return (
        `Momento ${this.currentOrder()} de ${this.totalMoments()}`
      );
    });


  // ============================================================
  // CONTENIDO
  // ============================================================

  readonly currentMomentTitle =
    computed<string>(() => {

      return (
        this.currentMoment()?.title
        ??
        'Experiencia de aprendizaje'
      );
    });


  readonly currentMomentSubtitle =
    computed<string>(() => {

      return (
        this.currentMoment()?.subtitle
        ??
        ''
      );
    });


  readonly currentMomentDescription =
    computed<string>(() => {

      return (
        this.currentMoment()?.description
        ??
        ''
      );
    });


  readonly currentMomentImage =
    computed<string>(() => {

      const moment =
        this.currentMoment();

      if (
        moment?.image
      ) {

        return moment.image;
      }

      const experience =
        this.experience();

      if (
        experience?.coverUrl
      ) {

        return experience.coverUrl;
      }

      if (
        experience?.thumbnailUrl
      ) {

        return experience.thumbnailUrl;
      }

      return '';
    });


  // ============================================================
  // IDENTIDAD VISUAL
  // ============================================================

  readonly experienceTheme =
    computed<string>(() => {

      const experience =
        this.experience();

      if (!experience) {
        return 'default';
      }

      const id =
        experience.id
          .toLowerCase();

      const title =
        experience.title
          .toLowerCase();


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


  readonly experienceThemeLabel =
    computed<string>(() => {

      const labels:
        Record<string, string> = {

        water:
          'AGUA Y TERRITORIO',

        parabolic:
          'MOVIMIENTO PARABÓLICO',

        programming:
          'CREADORES STEAM CON IA',

        circuits:
          'CIRCUITOS ELÉCTRICOS',

        chemistry:
          'QUÍMICA EN NUESTRO ENTORNO',

        energy:
          'ENERGÍA',

        default:
          'TELLUS LEARNING',
      };


      const theme =
        this.experienceTheme();

      return (
        labels[theme]
        ??
        labels['default']
      );
    });


  readonly experienceIcon =
    computed<string>(() => {

      const icons:
        Record<string, string> = {

        water:
          '≈',

        parabolic:
          '⌁',

        programming:
          '◇',

        circuits:
          'ϟ',

        chemistry:
          '◈',

        energy:
          '✦',

        default:
          '·',
      };


      const theme =
        this.experienceTheme();

      return (
        icons[theme]
        ??
        icons['default']
      );
    });


  // ============================================================
  // ACTIVIDAD
  // ============================================================

  getActivityIcon(
    type: unknown
  ): string {

    const value =
      String(
        type ?? ''
      ).toLowerCase();


    if (
      value.includes(
        'simulation'
      ) ||
      value.includes(
        'simul'
      )
    ) {

      return 'LAB';
    }


    if (
      value.includes(
        'question'
      ) ||
      value.includes(
        'quiz'
      )
    ) {

      return 'IDEA';
    }


    if (
      value.includes(
        'reflection'
      ) ||
      value.includes(
        'reflex'
      )
    ) {

      return 'REF';
    }


    if (
      value.includes(
        'analysis'
      ) ||
      value.includes(
        'data'
      )
    ) {

      return 'DATA';
    }


    if (
      value.includes(
        'experiment'
      ) ||
      value.includes(
        'lab'
      )
    ) {

      return 'LAB';
    }


    if (
      value.includes(
        'predict'
      ) ||
      value.includes(
        'preinforme'
      )
    ) {

      return 'PRED';
    }


    return 'ACT';
  }


  // ============================================================
  // RESPUESTA
  // ============================================================

  onResponseChange(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLTextAreaElement)
    ) {

      return;
    }

    this.response.set(
      target.value
    );

    this.saved.set(
      false
    );
  }


  // ============================================================
  // GUARDAR
  // ============================================================

  saveDraft(): void {

    const value =
      this.response()
        .trim();

    if (!value) {
      return;
    }

    this.saved.set(
      true
    );
  }


  // ============================================================
  // ENFOCAR RESPUESTA
  // ============================================================

  focusResponse(): void {

    const element =
      document.getElementById(
        'moment-response'
      );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    window.setTimeout(
      () => {

        if (
          element instanceof
          HTMLTextAreaElement
        ) {

          element.focus();
        }

      },
      450
    );
  }


  // ============================================================
  // JUEGO DE EXPLORACIÓN — MOMENTO 2
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

      const game =
        this.explorationGame();

      if (!game) {
        return [];
      }

      const placed =
        this.placedFactors();

      return (
        game.factors ?? []
      ).filter(
        (factor: any) =>
          !Object.prototype.hasOwnProperty.call(
            placed,
            factor.id
          )
      );
    });

  readonly placedFactorEntries =
    computed<any[]>(() => {

      const game =
        this.explorationGame();

      if (!game) {
        return [];
      }

      const placed =
        this.placedFactors();

      return Object.entries(
        placed
      ).map(
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

  selectFactor(
    factorId: string
  ): void {

    this.selectedFactorId.set(
      factorId
    );
  }

  dragFactor(
    event: DragEvent,
    factorId: string
  ): void {

    event.dataTransfer?.setData(
      'text/plain',
      factorId
    );

    this.selectedFactorId.set(
      factorId
    );
  }

  allowDrop(
    event: DragEvent
  ): void {

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

    if (!factorId) {
      return;
    }

    this.placeFactor(
      factorId,
      zoneId
    );
  }

  placeFactor(
    factorId: string,
    zoneId: string
  ): void {

    const game =
      this.explorationGame();

    if (!game) {
      return;
    }

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

    if (
      correctZone === zoneId
    ) {

      const nextPlaced = {
        ...placed,
        [factorId]: zoneId,
      };

      const points =
        Number(
          game.pointsPerCorrectAnswer
        )
        ||
        0;

      const target =
        Number(
          game.targetScore
        )
        ||
        100;

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

      if (
        nextScore >= target
      ) {

        this.explorationCompleted.set(
          true
        );

        this.explorationFeedback.set(
          game.completion?.message
          ??
          '¡Exploración completada!'
        );
      }

      this.selectedFactorId.set(
        null
      );

      return;
    }

    this.explorationFeedback.set(
      'Aún no. Analiza nuevamente qué efecto directo puede tener este factor sobre la trayectoria.'
    );
  }

  resetExplorationGame(): void {

    this.selectedFactorId.set(
      null
    );

    this.placedFactors.set(
      {}
    );

    this.explorationScore.set(
      0
    );

    this.explorationCompleted.set(
      false
    );

    this.explorationFeedback.set(
      ''
    );
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
  // DESAFÍO DE PREDICCIÓN — MOMENTO 3
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

    if (
      this.predictionSubmitted()
    ) {
      return;
    }

    this.selectedPredictionOption.set(
      optionId
    );

    this.predictionFeedback.set(
      ''
    );
  }

  submitPrediction(): void {

    const challenge =
      this.predictionChallenge();

    const selected =
      this.selectedPredictionOption();

    if (
      !challenge
      ||
      !selected
      ||
      this.predictionSubmitted()
    ) {
      return;
    }

    const correctAnswer =
      String(
        challenge.correctAnswer
        ??
        ''
      );

    const isCorrect =
      selected === correctAnswer;

    this.predictionAttempts.update(
      value => value + 1
    );

    this.predictionSubmitted.set(
      true
    );

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

      return;
    }

    this.predictionFeedback.set(
      challenge.feedback?.incorrect
      ??
      'Aún no. Revisa la información anterior, vuelve a pensar tu predicción e inténtalo nuevamente.'
    );
  }

  retryPrediction(): void {

    this.selectedPredictionOption.set(
      null
    );

    this.predictionSubmitted.set(
      false
    );

    this.predictionCorrect.set(
      false
    );

    this.predictionFeedback.set(
      ''
    );
  }

  resetPrediction(): void {

    this.selectedPredictionOption.set(
      null
    );

    this.predictionSubmitted.set(
      false
    );

    this.predictionCorrect.set(
      false
    );

    this.predictionAttempts.set(
      0
    );

    this.predictionFeedback.set(
      ''
    );
  }


  // ============================================================
  // SIMULADOR — MOMENTO 4
  // ============================================================

  readonly simulatorLoaded =
    signal<boolean>(false);

  onSimulatorLoaded(): void {
    this.simulatorLoaded.set(true);
  }


  // ============================================================
  // ROAD TO GLORY — RECEPTOR DE postMessage
  // ============================================================

  readonly roadToGloryReady =
    signal<boolean>(false);

  readonly roadToGloryResult =
    signal<any | null>(null);

  readonly roadToGloryProgress =
    signal<any | null>(null);

  /**
   * Handler que se ejecuta cuando el simulador envía un mensaje.
   * Debe ser una propiedad para poder removerlo correctamente.
   */
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

      // El simulador avisó que está listo
      if (
        data.type ===
        'tellus:road-to-glory:ready'
      ) {

        this.roadToGloryReady.set(true);

        this.simulatorLoaded.set(true);

        return;
      }

      // Progreso (puntos / goles en tiempo real)
      if (
        data.type ===
        'tellus:road-to-glory:progress'
      ) {

        this.roadToGloryProgress.set(data);

        return;
      }

      // Resultado final de la evaluación ICFES
      if (
        data.type ===
        'tellus:road-to-glory:result'
      ) {

        this.roadToGloryResult.set(data);

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

        return;
      }
    };


  // ============================================================
  // CONSTRUCCIÓN — MOMENTO 5
  // ============================================================

  readonly constructionExample =
    computed<any | null>(() => {

      const activity =
        this.currentActivities().find(
          (a: Activity) =>
            a.id ===
            'act-construccion-ejemplo-resuelto'
        );

      if (!activity) {
        return null;
      }

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

      if (!activity) {
        return [];
      }

      const content =
        activity.content;

      if (
        !content ||
        content.type !== 'questionnaire'
      ) {
        return [];
      }

      const questions =
        content.data?.questions;

      return (
        Array.isArray(questions)
        ?
        questions
        :
        []
      );
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

      if (total <= 0) {
        return 0;
      }

      return Math.round(
        (
          this.challengeSolvedCount() /
          total
        ) *
        100
      );
    });

  readonly challengeCompleted =
    computed<boolean>(() => {

      const total =
        this.challengeTotal();

      return (
        total > 0
        &&
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

    if (
      this.challengeSubmitted()
    ) {
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
      !question
      ||
      selected === null
      ||
      this.challengeSubmitted()
    ) {
      return;
    }

    const isCorrect =
      selected ===
      question.correctIndex;

    this.challengeSubmitted.set(
      true
    );

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
        value => {

          const total =
            this.challengeTotal();

          return Math.min(
            total,
            value + 1
          );
        }
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

    this.selectedChallengeOption.set(
      null
    );

    this.challengeSubmitted.set(
      false
    );

    this.challengeCorrect.set(
      false
    );

    this.challengeFeedback.set(
      ''
    );
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

    this.selectedChallengeOption.set(
      null
    );

    this.challengeSubmitted.set(
      false
    );

    this.challengeCorrect.set(
      false
    );

    this.challengeFeedback.set(
      ''
    );
  }

  resetChallenge(): void {

    this.challengeSolvedCount.set(
      0
    );

    this.challengeQuestionIndex.set(
      0
    );

    this.selectedChallengeOption.set(
      null
    );

    this.challengeSubmitted.set(
      false
    );

    this.challengeCorrect.set(
      false
    );

    this.challengeFeedback.set(
      ''
    );
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

    if (!url) {
      return;
    }

    this.lightboxImage.set(url);
    this.lightboxAlt.set(alt);
    this.lightboxOpen.set(true);

    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {

    this.lightboxOpen.set(false);
    this.lightboxImage.set('');
    this.lightboxAlt.set('');

    document.body.style.overflow = '';
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

    // Momento 2: el juego de exploración debe completarse.
    if (
      current.order === 2 &&
      this.explorationGame()
    ) {
      return this.explorationCompleted();
    }

    // Momento 3: el desafío de predicción debe responderse correctamente.
    if (
      current.order === 3 &&
      this.predictionChallenge()
    ) {
      return this.predictionCorrect();
    }

    // Momento 4: el simulador debe estar cargado.
    if (current.order === 4) {
      return this.simulatorLoaded();
    }

    // Momento 5: los 5 problemas deben estar resueltos.
    if (
      current.order === 5 &&
      this.challengeTotal() > 0
    ) {
      return this.challengeCompleted();
    }

    // Los momentos que no requieren entrega pueden continuar.
    if (!activity) {
      return true;
    }

    if (
      activity.config?.requiresSubmission
      !==
      true
    ) {
      return true;
    }

    return (
      this.response()
        .trim()
        .length > 0
    );
  }


  // ============================================================
  // CONTINUAR
  // ============================================================

  continue(): void {

    const activity =
      this.primaryActivity();


    if (
      !this.canContinue()
    ) {

      if (
        this.currentOrder() === 3
        &&
        this.predictionChallenge()
      ) {
        return;
      }

      if (
        activity?.config?.requiresSubmission
        ===
        true
      ) {
        this.focusResponse();
      }

      return;
    }


    if (
      this.response()
        .trim()
        .length > 0
    ) {

      this.saveDraft();
    }


    const next =
      this.nextMoment();


    if (!next) {

      this.router.navigate([
        '/mi-aula',
      ]);

      return;
    }


    this.goToMoment(
      next.id
    );
  }


  // ============================================================
  // NAVEGACIÓN A MOMENTO
  // ============================================================

  goToMoment(
    targetMomentId: string
  ): void {

    const target =
      this.moments().find(
        (
          moment: Moment
        ) =>
          moment.id ===
          targetMomentId
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
      '/mi-aula',
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

    // 🆕 Escuchar mensajes del simulador Road to Glory
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

          this.experienceId.set(
            params.get(
              'experienceId'
            )
            ??
            ''
          );

          this.momentId.set(
            params.get(
              'momentId'
            )
            ??
            ''
          );

          this.response.set(
            ''
          );

          this.saved.set(
            false
          );

          this.resetPrediction();

          this.simulatorLoaded.set(false);

          this.roadToGloryReady.set(false);

          this.roadToGloryResult.set(null);

          this.roadToGloryProgress.set(null);

          this.resetChallenge();

          this.closeLightbox();
        }
      );
  }


  ngOnDestroy(): void {

    // 🆕 Remover el listener al salir
    window.removeEventListener(
      'message',
      this.onSimulatorMessage,
      false
    );

    this.destroy$.next();

    this.destroy$.complete();
  }

}