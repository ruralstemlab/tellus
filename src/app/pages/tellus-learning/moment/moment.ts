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

    // Momento 3: el desafío de predicción debe responderse
    // correctamente antes de desbloquear el siguiente momento.
    if (
      current.order === 3 &&
      this.predictionChallenge()
    ) {
      return this.predictionCorrect();
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
        }
      );
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }

}