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
  Moment,
} from '../models/moment.model';


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

  readonly acknowledged =
    signal<boolean>(false);


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experienceData =
    computed(() => {

      const id =
        this.experienceId();

      if (!id) {
        return undefined;
      }

      return getExperienceById(id);

    });


  readonly experience =
    computed(() => {

      return (
        this.experienceData()
          ?.experience
        ?? null
      );

    });


  // ============================================================
  // MOMENTOS
  // ============================================================

  readonly moments =
    computed(() => {

      return (
        this.experienceData()
          ?.moments
        ?? []
      );

    });


  // ============================================================
  // ACTIVIDADES
  // ============================================================

  readonly activities =
    computed(() => {

      return (
        this.experienceData()
          ?.activities
        ?? []
      );

    });


  readonly currentActivities =
    computed(() => {

      const moment =
        this.currentMoment();

      if (!moment) {
        return [];
      }

      const ids =
        moment.activityIds
        ?? [];

      return this.activities()
        .filter(activity =>
          ids.includes(activity.id)
        );

    });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment =
    computed(() => {

      const allMoments =
        this.moments();

      const id =
        this.momentId();

      return (

        allMoments.find(
          moment =>
            moment.id === id
        )

        ??

        allMoments.find(
          moment =>
            moment.order === 1
        )

        ??

        allMoments[0]

        ??

        null

      );

    });


  // ============================================================
  // MOMENTO ANTERIOR
  // ============================================================

  readonly previousMoment =
    computed(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          moment =>
            moment.order ===
            current.order - 1
        )
        ?? null
      );

    });


  // ============================================================
  // MOMENTO SIGUIENTE
  // ============================================================

  readonly nextMoment =
    computed(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          moment =>
            moment.order ===
            current.order + 1
        )
        ?? null
      );

    });


  // ============================================================
  // PROGRESO
  // ============================================================

  readonly currentOrder =
    computed(() => {

      return (
        this.currentMoment()?.order
        ?? 1
      );

    });


  readonly totalMoments =
    computed(() => {

      return this.moments().length;

    });


  readonly progressPercentage =
    computed(() => {

      const total =
        this.totalMoments();

      if (!total) {
        return 0;
      }

      return Math.round(
        (
          (
            this.currentOrder() - 1
          )
          /
          total
        ) * 100
      );

    });


  readonly progressLabel =
    computed(() => {

      const total =
        this.totalMoments();

      if (!total) {
        return 'Sin momentos';
      }

      return (
        `Momento ${this.currentOrder()} de ${total}`
      );

    });


  // ============================================================
  // INFORMACIÓN PRINCIPAL
  // ============================================================

  readonly currentMomentTitle =
    computed(() => {

      return (
        this.currentMoment()?.title
        ?? 'Comienza tu experiencia'
      );

    });


  readonly currentMomentDescription =
    computed(() => {

      return (
        this.currentMoment()?.description
        ??
        'Explora, observa y construye tus primeras ideas.'
      );

    });


  // ============================================================
  // IMAGEN
  // ============================================================

  readonly currentMomentImage =
    computed(() => {

      const moment =
        this.currentMoment();

      const experience =
        this.experience();

      return (
        moment?.image
        ??
        this.getExperienceImage(
          experience
        )
        ??
        ''
      );

    });


  // ============================================================
  // DATOS PARA EL HTML ACTUAL
  // ============================================================

  getDuration(): number {

    return (
      this.currentMoment()
        ?.estimatedDurationMinutes

      ??

      (this.experience() as any)
        ?.estimatedDurationMinutes

      ??

      15
    );

  }


  getSubject(): string {

    const experience =
      this.experience();

    if (!experience) {
      return 'Ciencias Naturales';
    }

    return (

      (experience as any)
        ?.subject

      ??

      (experience as any)
        ?.area

      ??

      'Ciencias Naturales'

    );

  }


  getGradeLevel(): string {

    const experience =
      this.experience();

    if (!experience) {
      return '8.º a 11.º';
    }

    return (

      (experience as any)
        ?.gradeLevel

      ??

      (experience as any)
        ?.grades

      ??

      '8.º a 11.º'

    );

  }


  // ============================================================
  // TEMA VISUAL
  // ============================================================

  readonly experienceTheme =
    computed(() => {

      const experience =
        this.experience();

      const id =
        String(
          (experience as any)?.id
          ?? ''
        ).toLowerCase();

      const title =
        String(
          (experience as any)?.title
          ?? ''
        ).toLowerCase();


      // AGUA

      if (
        id.includes('agua') ||
        id.includes('water') ||
        id.includes('territorio') ||
        title.includes('agua')
      ) {

        return 'water';

      }


      // MOVIMIENTO PARABÓLICO

      if (
        id.includes('parabol') ||
        id.includes('proyectil') ||
        title.includes('parab')
      ) {

        return 'parabolic';

      }


      // CIRCUITOS

      if (
        id.includes('circuit') ||
        id.includes('electric') ||
        title.includes('circuit')
      ) {

        return 'circuits';

      }


      // FLUIDOS

      if (
        id.includes('fluido') ||
        id.includes('fluid') ||
        title.includes('fluido')
      ) {

        return 'fluids';

      }


      // ENERGÍA

      if (
        id.includes('energia') ||
        id.includes('energy') ||
        title.includes('energ')
      ) {

        return 'energy';

      }


      return 'default';

    });


  // ============================================================
  // NOMBRE DEL TEMA
  // ============================================================

  readonly experienceThemeLabel =
    computed(() => {

      const labels:
        Record<string, string> = {

        water:
          'AGUA Y TERRITORIO',

        parabolic:
          'MOVIMIENTO PARABÓLICO',

        circuits:
          'CIRCUITOS ELÉCTRICOS',

        fluids:
          'MECÁNICA DE FLUIDOS',

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


  // ============================================================
  // ICONO DE EXPERIENCIA
  // ============================================================

  readonly experienceIcon =
    computed(() => {

      const icons:
        Record<string, string> = {

        water:
          '💧',

        parabolic:
          '🏹',

        circuits:
          '⚡',

        fluids:
          '🌊',

        energy:
          '🔋',

        default:
          '🌱',

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
  // ICONOS DE MOMENTOS
  // ============================================================

  readonly momentIcons:
    Record<string, string> = {

      motivacion:
        '💡',

      exploracion:
        '🔎',

      prediccion:
        '🎯',

      experimentacion:
        '🧪',

      construccion:
        '🧠',

      analisis_evaluacion:
        '📊',

      reflexion:
        '🌎',

    };


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
      .subscribe(params => {

        this.experienceId.set(
          params.get(
            'experienceId'
          )
          ?? ''
        );

        this.momentId.set(
          params.get(
            'momentId'
          )
          ?? ''
        );

        this.acknowledged.set(
          false
        );

      });

  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }


  // ============================================================
  // IMAGEN DE EXPERIENCIA
  // ============================================================

  private getExperienceImage(
    experience: any
  ): string {

    if (!experience) {
      return '';
    }

    return (
      experience.coverUrl
      ??
      experience.coverImage
      ??
      experience.thumbnailUrl
      ??
      experience.thumbnail
      ??
      ''
    );

  }


  // ============================================================
  // ICONO DEL MOMENTO
  // ============================================================

  getMomentIcon(
    moment: Moment
  ): string {

    return (
      this.momentIcons[
        String(moment.type)
      ]
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
      '🧪',
      '🧠',
      '📊',
      '🌎',

    ];

    return (
      icons[order - 1]
      ??
      '🌱'
    );

  }


  // ============================================================
  // ICONO DE ACTIVIDAD
  // ============================================================

  getActivityIcon(
    type: unknown
  ): string {

    const value =
      String(
        type ?? ''
      ).toLowerCase();


    if (
      value.includes('video')
    ) {
      return '▶️';
    }


    if (
      value.includes('simulation') ||
      value.includes('simul')
    ) {
      return '🎮';
    }


    if (
      value.includes('question') ||
      value.includes('quiz')
    ) {
      return '❓';
    }


    if (
      value.includes('reflection')
    ) {
      return '🌱';
    }


    if (
      value.includes('analysis') ||
      value.includes('data')
    ) {
      return '📊';
    }


    if (
      value.includes('experiment') ||
      value.includes('lab')
    ) {
      return '🧪';
    }


    if (
      value.includes('preinforme')
    ) {
      return '🎯';
    }


    return '✦';

  }


  // ============================================================
  // TIPO DE ACTIVIDAD
  // ============================================================

  getActivityTypeLabel(
    activity: any
  ): string {

    const type =
      String(
        activity?.type
        ?? ''
      ).toLowerCase();


    const labels:
      Record<string, string> = {

      video:
        'DESCUBRE',

      reflection:
        'REFLEXIONA',

      data_analysis:
        'INVESTIGA',

      simulation:
        'EXPERIMENTA',

      questionnaire:
        'RESPONDE',

      preinforme:
        'PREDICE',

      lab_physical:
        'COMPRUEBA',

      question:
        'PIENSA',

      experiment:
        'COMPRUEBA',

      open:
        'EXPLORA',

      problem:
        'RESUELVE',

    };


    return (
      labels[type]
      ??
      'EXPLORA'
    );

  }


  // ============================================================
  // ESTADOS
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
  // PRIMER / ÚLTIMO
  // ============================================================

  isFirstMoment(): boolean {

    return (
      this.currentOrder() === 1
    );

  }


  isLastMoment(): boolean {

    return (
      this.currentOrder()
      ===
      this.totalMoments()
    );

  }


  // ============================================================
  // REGISTRAR OBSERVACIÓN
  // ============================================================

  acknowledgeChallenge(): void {

    this.acknowledged.set(
      true
    );

  }


  // ============================================================
  // ABRIR ACTIVIDAD
  // ============================================================

  openActivity(
    activity: any
  ): void {

    if (!activity?.id) {
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
      'actividad',
      activity.id,
    ]);

  }


  // ============================================================
  // VOLVER AL AULA
  // ============================================================

  backToClassroom(): void {

    this.router.navigate([
      '/mi-aula',
    ]);

  }


  // ============================================================
  // CONTINUAR
  // ============================================================

  continue(): void {

    const next =
      this.nextMoment();

    if (!next) {

      this.router.navigate([
        '/mi-aula',
      ]);

      return;

    }

    this.router.navigate([
      '/experiencia',
      this.experienceId(),
      'momento',
      next.id,
    ]);

  }


  // ============================================================
  // IR A MOMENTO
  // ============================================================

  goToMoment(
    momentId: string
  ): void {

    const target =
      this.moments().find(
        moment =>
          moment.id === momentId
      );

    if (!target) {
      return;
    }

    if (
      this.isLocked(target)
    ) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      this.experienceId(),
      'momento',
      target.id,
    ]);

  }


  // ============================================================
  // TRACK
  // ============================================================

  trackByMomentId(
    _index: number,
    moment: Moment
  ): string {

    return moment.id;

  }


  trackByActivityId(
    _index: number,
    activity: any
  ): string {

    return activity.id;

  }

}