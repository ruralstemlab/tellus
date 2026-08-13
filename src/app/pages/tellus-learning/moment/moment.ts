import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
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
  MOVIMIENTO_PARABOLICO_MOCK,
} from '../data/movimiento-parabolico.mock';


@Component({
  selector: 'app-moment',
  standalone: true,

  imports: [
    CommonModule,
    Navbar,
    Footer,
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


  // ============================================================
  // DATOS TELLUS LEARNING
  // ============================================================

  readonly experience =
    MOVIMIENTO_PARABOLICO_MOCK.experience;

  readonly moments =
    MOVIMIENTO_PARABOLICO_MOCK.moments;

  readonly activities =
    MOVIMIENTO_PARABOLICO_MOCK.activities;


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly momentId = signal<string>(
    this.route.snapshot.paramMap.get('momentId')
      ?? 'moment-motivacion'
  );


  readonly currentMoment = computed(() => {

    return (
      this.moments.find(
        moment => moment.id === this.momentId()
      )
      ?? this.moments[0]
      ?? null
    );

  });


  // ============================================================
  // ACTIVIDADES DEL MOMENTO
  // ============================================================

  readonly currentActivities = computed(() => {

    const moment = this.currentMoment();

    if (!moment) {
      return [];
    }

    return this.activities.filter(
      activity => moment.activityIds.includes(activity.id)
    );

  });


  // ============================================================
  // MOMENTO ANTERIOR
  // ============================================================

  readonly previousMoment = computed(() => {

    const current = this.currentMoment();

    if (!current) {
      return null;
    }

    return (
      this.moments.find(
        moment => moment.order === current.order - 1
      )
      ?? null
    );

  });


  // ============================================================
  // MOMENTO SIGUIENTE
  // ============================================================

  readonly nextMoment = computed(() => {

    const current = this.currentMoment();

    if (!current) {
      return null;
    }

    return (
      this.moments.find(
        moment => moment.order === current.order + 1
      )
      ?? null
    );

  });


  // ============================================================
  // ESTADO DE LA ACTIVIDAD
  // ============================================================

  readonly acknowledged = signal(false);


  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {

    /*
     * IMPORTANTE:
     *
     * Angular reutiliza MomentComponent cuando cambia solamente
     * :momentId dentro de la misma ruta.
     *
     * Por eso NO debemos depender únicamente de snapshot.
     *
     * Escuchamos los cambios de paramMap para actualizar
     * correctamente el momento actual.
     */

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {

        const id =
          params.get('momentId');

        if (!id) {
          return;
        }

        this.momentId.set(id);

        /*
         * Cada nuevo momento comienza nuevamente pendiente.
         */
        this.acknowledged.set(false);

      });

  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


  // ============================================================
  // ACTIVIDAD
  // ============================================================

  acknowledgeChallenge(): void {

    this.acknowledged.set(true);

  }


  // ============================================================
  // NAVEGACIÓN
  // ============================================================

  backToClassroom(): void {

    this.router.navigate([
      '/mi-aula'
    ]);

  }


  continue(): void {

    const next = this.nextMoment();

    /*
     * Si estamos en el último momento,
     * regresamos a Mi Aula.
     */
    if (!next) {

      this.router.navigate([
        '/mi-aula'
      ]);

      return;
    }


    /*
     * Navegamos al siguiente momento.
     *
     * Angular reutilizará MomentComponent,
     * pero ngOnInit está escuchando paramMap,
     * por lo que momentId se actualizará correctamente.
     */

    this.router.navigate([
      '/experiencia',
      this.experience.id,
      'momento',
      next.id,
    ]);

  }


  // ============================================================
  // IR DIRECTAMENTE A UN MOMENTO
  // ============================================================

  goToMoment(momentId: string): void {

    const target =
      this.moments.find(
        moment => moment.id === momentId
      );

    if (!target) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      this.experience.id,
      'momento',
      target.id,
    ]);

  }


  // ============================================================
  // ESTADO
  // ============================================================

  isFirstMoment(): boolean {

    return (
      this.currentMoment()?.order === 1
    );

  }


  isLastMoment(): boolean {

    return (
      this.currentMoment()?.order === this.moments.length
    );

  }


  // ============================================================
  // TRACK BY
  // ============================================================

  trackByMomentId(
    _index: number,
    moment: { id: string }
  ): string {

    return moment.id;

  }

}