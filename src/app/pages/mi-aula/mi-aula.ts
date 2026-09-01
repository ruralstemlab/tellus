import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

import {
  getAllExperiences,
} from '../tellus-learning/data/experience-registry';

import {
  Experience,
  Moment,
} from '../tellus-learning/models';


@Component({
  selector: 'app-mi-aula',

  standalone: true,

  imports: [
    CommonModule,
    Navbar,
    Footer,
  ],

  templateUrl: './mi-aula.html',

  styleUrls: [
    './mi-aula.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class MiAula {

  // ============================================================
  // INYECCIONES
  // ============================================================

  private readonly router =
    inject(Router);


  // ============================================================
  // USUARIO
  // ============================================================

  readonly userName =
    signal('Estudiante');


  // ============================================================
  // EXPERIENCIAS
  // ============================================================

  readonly experiences =
    getAllExperiences();


  // ============================================================
  // EXPERIENCIA SELECCIONADA
  // ============================================================

  readonly selectedExperienceId =
    signal<string>(
      this.experiences[0]?.experience.id
      ?? ''
    );


  // ============================================================
  // EXPERIENCIA ACTUAL
  // ============================================================

  readonly experience =
    computed(() => {

      const selectedId =
        this.selectedExperienceId();

      return (
        this.experiences.find(
          item =>
            item.experience.id ===
            selectedId
        )
        ?? null
      );

    });


  // ============================================================
  // MOMENTOS
  // ============================================================

  readonly moments =
    computed(() => {

      return (
        this.experience()?.moments
        ?? []
      );

    });


  // ============================================================
  // ACTIVIDADES
  // ============================================================

  readonly activities =
    computed(() => {

      return (
        this.experience()?.activities
        ?? []
      );

    });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment =
    computed(() => {

      const moments =
        this.moments();

      return (
        moments.find(
          moment =>
            moment.order === 1
        )
        ?? moments[0]
        ?? null
      );

    });


  // ============================================================
  // SELECCIONAR EXPERIENCIA
  // ============================================================

  selectExperience(
    experienceId: string,
  ): void {

    const exists =
      this.experiences.some(
        item =>
          item.experience.id ===
          experienceId
      );

    if (!exists) {
      return;
    }

    this.selectedExperienceId.set(
      experienceId
    );

  }


  // ============================================================
  // COMENZAR EXPERIENCIA
  // ============================================================

  onContinue(): void {

    const experience =
      this.experience();

    const firstMoment =
      this.moments()[0];

    if (
      !experience ||
      !firstMoment
    ) {

      console.warn(
        'No se puede iniciar la experiencia.'
      );

      return;
    }

    this.router.navigate([
      '/experiencia',
      experience.experience.id,
      'momento',
      firstMoment.id,
    ]);

  }


  // ============================================================
  // IR A UN MOMENTO
  // ============================================================

  goToMoment(
    momentId: string,
  ): void {

    const experience =
      this.experience();

    if (!experience) {
      return;
    }

    const moment =
      experience.moments.find(
        item =>
          item.id === momentId
      );

    if (!moment) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      experience.experience.id,
      'momento',
      moment.id,
    ]);

  }


  // ============================================================
  // MOMENTOS ORDENADOS
  // ============================================================

  orderedMoments(): Moment[] {

    return [
      ...this.moments()
    ].sort(
      (a, b) =>
        a.order - b.order
    );

  }


  // ============================================================
  // ICONO DEL MOMENTO
  // ============================================================

  getMomentIcon(
    moment: Moment,
  ): string {

    const icons: Record<string, string> = {

      motivacion: '💡',

      exploracion: '🔎',

      prediccion: '🎯',

      experimentacion: '🧪',

      construccion: '🧠',

      analisis_evaluacion: '📊',

      reflexion: '🌎',

    };

    return (
      icons[moment.type]
      ?? '🌱'
    );

  }


  // ============================================================
  // EXPERIENCIA — ICONO
  // ============================================================

  getExperienceIcon(
    experience: Experience,
  ): string {

    if (
      experience.id ===
      'agua-territorio'
    ) {
      return '💧';
    }

    if (
      experience.id ===
      'exp-movimiento-parabolico'
    ) {
      return '🏹';
    }

    return '🌱';

  }


  // ============================================================
  // EXPERIENCIA — TEMA
  // ============================================================

  getExperienceTheme(
    experience: Experience,
  ): string {

    if (
      experience.id ===
      'agua-territorio'
    ) {
      return 'water';
    }

    if (
      experience.id ===
      'exp-movimiento-parabolico'
    ) {
      return 'parabolic';
    }

    return 'default';

  }


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  isCurrent(
    moment: Moment,
  ): boolean {

    return (
      moment.order ===
      this.currentMoment()?.order
    );

  }


  // ============================================================
  // MOMENTO COMPLETADO
  // ============================================================

  isCompleted(
    moment: Moment,
  ): boolean {

    const currentOrder =
      this.currentMoment()?.order
      ?? 1;

    return (
      moment.order <
      currentOrder
    );

  }


  // ============================================================
  // MOMENTO BLOQUEADO
  // ============================================================

  isLocked(
    moment: Moment,
  ): boolean {

    const currentOrder =
      this.currentMoment()?.order
      ?? 1;

    return (
      moment.order >
      currentOrder + 1
    );

  }


  // ============================================================
  // TÍTULO DEL MOMENTO
  // ============================================================

  currentMomentTitle(): string {

    return (
      this.currentMoment()?.title
      ?? 'Comienza tu experiencia'
    );

  }


  // ============================================================
  // DESCRIPCIÓN
  // ============================================================

  currentMomentDescription(): string {

    return (
      this.currentMoment()?.description
      ?? 'Selecciona una experiencia para comenzar.'
    );

  }


  // ============================================================
  // PROGRESO
  // ============================================================

  progressPercentage(): number {

    const total =
      this.moments().length;

    if (!total) {
      return 0;
    }

    const current =
      this.currentMoment()?.order
      ?? 1;

    return Math.round(
      ((current - 1) / total) * 100
    );

  }


  // ============================================================
  // ETIQUETA PROGRESO
  // ============================================================

  progressLabel(): string {

    const current =
      this.currentMoment()?.order
      ?? 1;

    const total =
      this.moments().length;

    if (!total) {
      return 'Sin momentos';
    }

    if (current === 1) {
      return 'Primer momento';
    }

    return `Momento ${current} de ${total}`;

  }


  // ============================================================
  // TRACK BY EXPERIENCIA
  // ============================================================

  trackByExperienceId(
    _index: number,
    item: {
      experience: Experience;
    },
  ): string {

    return item.experience.id;

  }


  // ============================================================
  // TRACK BY MOMENTO
  // ============================================================

  trackByMomentId(
    _index: number,
    moment: Moment,
  ): string {

    return moment.id;

  }

}