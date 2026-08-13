import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

import {
  MOVIMIENTO_PARABOLICO_MOCK,
} from '../tellus-learning/data/movimiento-parabolico.mock';

import {
  Activity,
  Moment,
  Submission,
  Progress,
} from '../tellus-learning/models';


@Component({
  selector: 'app-mi-aula',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    Navbar,
    Footer,
  ],

  templateUrl: './mi-aula.html',

  styleUrls: ['./mi-aula.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class MiAula implements OnInit {

  // ============================================================
  // SERVICIOS
  // ============================================================

  private readonly profileService =
    inject(ProfileService);

  private readonly router =
    inject(Router);


  // ============================================================
  // USUARIO
  // ============================================================

  readonly profile =
    signal<UserProfile | null>(null);

  readonly userName =
    computed(
      () =>
        this.profile()?.name ||
        'Santiago'
    );


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experience =
    MOVIMIENTO_PARABOLICO_MOCK.experience;

  readonly moments =
    MOVIMIENTO_PARABOLICO_MOCK.moments;

  readonly activities =
    MOVIMIENTO_PARABOLICO_MOCK.activities;


  // ============================================================
  // TEXTOS
  // ============================================================

  readonly experienceTitle =
    computed(
      () => this.experience.title
    );

  readonly experienceDescription =
    computed(
      () => this.experience.description
    );


  // ============================================================
  // ESTADO DEL ESTUDIANTE
  // ============================================================

  readonly submissions =
    signal<Submission[]>([]);

  readonly interactions =
    signal<Set<string>>(
      new Set<string>()
    );


  // ============================================================
  // MOMENTOS ORDENADOS
  // ============================================================

  readonly orderedMoments =
    computed(
      () =>
        [...this.moments].sort(
          (a, b) =>
            a.order - b.order
        )
    );


  // ============================================================
  // ACTIVIDADES REQUERIDAS
  // ============================================================

  readonly requiredActivities =
    computed(
      () =>
        this.activities.filter(
          activity =>
            activity.config
              .requiredForCompletion
        )
    );


  // ============================================================
  // ACTIVIDADES COMPLETADAS
  // ============================================================

  readonly completedActivityIds =
    computed(() => {

      const completed =
        new Set<string>();


      // --------------------------------------------------------
      // SUBMISSIONS
      // --------------------------------------------------------

      for (
        const submission
        of this.submissions()
      ) {

        if (
          submission.status ===
            'submitted' ||
          submission.status ===
            'evaluated' ||
          submission.status ===
            'returned'
        ) {

          completed.add(
            submission.activityId
          );

        }

      }


      // --------------------------------------------------------
      // INTERACCIONES
      // --------------------------------------------------------

      for (
        const interactionId
        of this.interactions()
      ) {

        completed.add(
          interactionId
        );

      }


      return [
        ...completed
      ];

    });


  // ============================================================
  // MOMENTOS COMPLETADOS
  // ============================================================

  readonly completedMomentIds =
    computed(() => {

      const completedActivities =
        new Set(
          this.completedActivityIds()
        );

      const completedMoments:
        string[] = [];


      for (
        const moment
        of this.orderedMoments()
      ) {

        const momentActivities =
          this.activities.filter(
            activity =>
              activity.momentId ===
                moment.id &&
              activity.config
                .requiredForCompletion
          );


        if (
          momentActivities.length === 0
        ) {
          continue;
        }


        const allCompleted =
          momentActivities.every(
            activity =>
              completedActivities.has(
                activity.id
              )
          );


        if (allCompleted) {

          completedMoments.push(
            moment.id
          );

        }

      }


      return completedMoments;

    });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment =
    computed(() => {

      const completed =
        new Set(
          this.completedMomentIds()
        );


      return (
        this.orderedMoments().find(
          moment =>
            !completed.has(
              moment.id
            )
        )
        ??
        this.orderedMoments()[0]
        ??
        null
      );

    });


  // ============================================================
  // PROGRESO
  // ============================================================

  readonly progress =
    computed<Progress>(() => {

      const totalMoments =
        this.orderedMoments().length;

      const completedMomentsCount =
        this.completedMomentIds()
          .length;

      const totalRequiredActivities =
        this.requiredActivities()
          .length;

      const completedRequiredActivitiesCount =
        this.completedActivityIds()
          .filter(
            activityId =>
              this.requiredActivities()
                .some(
                  activity =>
                    activity.id ===
                    activityId
                )
          )
          .length;


      const progressPercentage =
        totalMoments > 0
          ? Math.round(
              (
                completedMomentsCount /
                totalMoments
              ) * 100
            )
          : 0;


      const activityProgressPercentage =
        totalRequiredActivities > 0
          ? Math.round(
              (
                completedRequiredActivitiesCount /
                totalRequiredActivities
              ) * 100
            )
          : 0;


      const lastSubmission =
        this.submissions()
          .at(-1);


      return {

        experienceId:
          this.experience.id,

        studentId:
          this.profile()?.uid ||
          'unknown',

        currentMomentId:
          this.currentMoment()?.id ??
          null,

        completedMomentIds:
          this.completedMomentIds(),

        completedActivityIds:
          this.completedActivityIds(),

        lastActivityId:
          lastSubmission?.activityId ??
          null,

        lastUpdatedAt:
          new Date(),

        totalMoments,

        completedMomentsCount,

        progressPercentage,

        totalRequiredActivities,

        completedRequiredActivitiesCount,

        activityProgressPercentage,

      };

    });


  // ============================================================
  // DATOS DE VISTA
  // ============================================================

  readonly completedMomentsCount =
    computed(
      () =>
        this.progress()
          .completedMomentsCount
    );


  readonly totalMoments =
    computed(
      () =>
        this.progress()
          .totalMoments
    );


  readonly progressPercentage =
    computed(
      () =>
        this.progress()
          .progressPercentage
    );


  readonly progressLabel =
    computed(
      () =>
        `${this.completedMomentsCount()} de ${this.totalMoments()} momentos completados`
    );


  // ============================================================
  // MOMENTO ACTUAL — TEXTO
  // ============================================================

  readonly currentMomentTitle =
    computed(
      () =>
        this.currentMoment()?.title ??
        'Comenzar experiencia'
    );


  readonly currentMomentDescription =
    computed(
      () =>
        this.currentMoment()?.description ??
        'Inicia la experiencia de aprendizaje.'
    );


  // ============================================================
  // ICONOS DEL CICLO
  // ============================================================

  readonly momentIcons:
    Record<string, string> = {

      motivacion: '💡',

      exploracion: '🔎',

      prediccion: '🎯',

      experimentacion: '🎮',

      construccion: '🧠',

      analisis_evaluacion: '📊',

      reflexion: '🌎',

    };


  // ============================================================
  // ICONO DEL MOMENTO
  // ============================================================

  getMomentIcon(
    moment: Moment
  ): string {

    const type =
      String(moment.type);

    return (
      this.momentIcons[type]
      ??
      this.getFallbackIcon(
        moment.order
      )
    );

  }


  private getFallbackIcon(
    order: number
  ): string {

    const icons = [
      '💡',
      '🔎',
      '🎯',
      '🎮',
      '🧠',
      '📊',
      '🌎',
    ];

    return (
      icons[order - 1] ??
      '🌱'
    );

  }


  // ============================================================
  // ESTADOS VISUALES
  // ============================================================

  isCompleted(
    moment: Moment
  ): boolean {

    return this.progress()
      .completedMomentIds
      .includes(moment.id);

  }


  isCurrent(
    moment: Moment
  ): boolean {

    return (
      this.progress()
        .currentMomentId ===
      moment.id
    );

  }


  isLocked(
    moment: Moment
  ): boolean {

    return (
      !this.isCompleted(moment) &&
      !this.isCurrent(moment)
    );

  }


  // ============================================================
  // NAVEGACIÓN
  // ============================================================

  onContinue(): void {

    const moment =
      this.currentMoment();

    if (!moment) {
      return;
    }


    this.router.navigate([
      '/experiencia',
      this.experience.id,
      'momento',
      moment.id,
    ]);

  }


  goToMoment(
    momentId: string
  ): void {

    const moment =
      this.moments.find(
        item =>
          item.id === momentId
      );


    if (
      !moment ||
      this.isLocked(moment)
    ) {
      return;
    }


    this.router.navigate([
      '/experiencia',
      this.experience.id,
      'momento',
      momentId,
    ]);

  }


  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {

    this.profileService
      .profile$
      .subscribe(
        profile => {

          this.profile.set(
            profile
          );

        }
      );

  }


  // ============================================================
  // TRACK BY
  // ============================================================

  trackByMomentId(
    _index: number,
    moment: Moment
  ): string {

    return moment.id;

  }

}