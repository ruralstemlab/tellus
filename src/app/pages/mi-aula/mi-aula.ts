import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

import {
  getAllExperiences,
} from '../tellus-learning/data/experience-registry';

import {
  Experience,
  Moment,
} from '../tellus-learning/models';


// ============================================================
// TIPO DE UNA ENTRADA DEL REGISTRO DE EXPERIENCIAS
// ============================================================

type ExperienceEntry =
  ReturnType<typeof getAllExperiences>[number];


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
export class MiAula implements OnInit {


  // ============================================================
  // INYECCIONES
  // ============================================================

  private readonly router =
    inject(Router);

  private readonly profileService =
    inject(ProfileService);


  // ============================================================
  // USUARIO
  // ============================================================

  readonly profile =
    signal<UserProfile | null>(null);


  readonly userName =
    computed(() => {

      const profile =
        this.profile();

      const name =
        profile?.name?.trim();

      return (
        name ||
        'Estudiante'
      );

    });


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
      this.experiences[0]
        ?.experience.id
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
          (item: ExperienceEntry) =>
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
          (moment: Moment) =>
            moment.order === 1
        )
        ??
        moments[0]
        ??
        null
      );

    });


  // ============================================================
  // CARGA DEL PERFIL
  // ============================================================

  ngOnInit(): void {

    this.profileService
      .profile$
      .subscribe(profile => {

        this.profile.set(
          profile
        );

      });

  }


  // ============================================================
  // SELECCIONAR EXPERIENCIA
  // ============================================================

  selectExperience(
    experienceId: string,
  ): void {

    const exists =
      this.experiences.some(
        (item: ExperienceEntry) =>
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
  // ENTRAR A UNA EXPERIENCIA
  // ============================================================

  enterExperience(
    experienceId: string,
  ): void {

    const selected =
      this.experiences.find(
        (item: ExperienceEntry) =>
          item.experience.id ===
          experienceId
      );

    if (!selected) {

      console.warn(
        'No se encontró la experiencia:',
        experienceId
      );

      return;
    }

    const firstMoment =
      [...selected.moments]
        .sort(
          (a: Moment, b: Moment) =>
            a.order - b.order
        )[0];

    if (!firstMoment) {

      console.warn(
        'La experiencia no tiene momentos:',
        experienceId
      );

      return;
    }

    this.router.navigate([
      '/experiencia',
      experienceId,
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
        (item: Moment) =>
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
      ...this.moments(),
    ].sort(
      (a: Moment, b: Moment) =>
        a.order - b.order
    );

  }


  // ============================================================
  // ICONO DEL MOMENTO
  // ============================================================

  getMomentIcon(
    moment: Moment,
  ): string {

    const icons:
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

    return (
      icons[moment.type]
      ??
      '🌱'
    );

  }


  // ============================================================
  // EXPERIENCIA — ICONO
  // ============================================================

  getExperienceIcon(
    experience: Experience,
  ): string {

    const icons:
      Record<string, string> = {

      'agua-territorio':
        '💧',

      'exp-movimiento-parabolico':
        '🚀',

      'creadores-steam-ia':
        '🤖',

      'circuitos-electricos':
        '⚡',

      'quimica-entorno':
        '🧪',

    };

    return (
      icons[experience.id]
      ??
      '🌱'
    );

  }


  // ============================================================
  // EXPERIENCIA — TEMA VISUAL
  // ============================================================

  getExperienceTheme(
    experience: Experience,
  ): string {

    const themes:
      Record<string, string> = {

      'agua-territorio':
        'water',

      'exp-movimiento-parabolico':
        'parabolic',

      'creadores-steam-ia':
        'programming',

      'circuitos-electricos':
        'circuits',

      'quimica-entorno':
        'chemistry',

    };

    return (
      themes[experience.id]
      ??
      'default'
    );

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
      (
        (current - 1)
        /
        total
      ) * 100
    );

  }


  // ============================================================
  // ETIQUETA DE PROGRESO
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

    return (
      `Momento ${current} de ${total}`
    );

  }


  // ============================================================
  // TRACK BY EXPERIENCIA
  // ============================================================

  trackByExperienceId(
    _index: number,
    item: ExperienceEntry,
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