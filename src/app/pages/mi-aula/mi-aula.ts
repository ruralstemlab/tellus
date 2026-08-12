import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Interfaces locales (se pueden mover a models/ más adelante)
interface CycleStep {
  number: number;
  title: string;
  description: string;
}

interface Experience {
  id: string;
  name: string;
  description: string;
  currentStage: {
    name: string;
    description: string;
  };
  progress: number; // 0-100
  completedStages: number;
  totalStages: number;
  nextAchievement: {
    title: string;
    description: string;
    progress: number; // 0-100
  };
  cycleSteps: CycleStep[];
}

@Component({
  selector: 'app-mi-aula',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-aula.html',
  styleUrls: ['./mi-aula.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiAula implements OnInit {

  // ============================================================
  // DATOS DE USUARIO (mock)
  // ============================================================
  userName = signal('Santiago');

  // ============================================================
  // DATOS DE LA EXPERIENCIA (mock)
  // ============================================================
  private experienceData: Experience = {
    id: 'exp-mov-parabolico',
    name: 'Movimiento Parabólico',
    description: 'Investiga, experimenta y comprende cómo los objetos se mueven en el aire.',
    currentStage: {
      name: 'Motivación',
      description: 'Descubre el reto y lo que vas a lograr.'
    },
    progress: 18,
    completedStages: 1,
    totalStages: 7,
    nextAchievement: {
      title: '¡Científico en acción!',
      description: 'Completa el laboratorio físico y registra tus datos.',
      progress: 25
    },
    cycleSteps: [
      { number: 1, title: 'Reflexión', description: 'Piensa en lo aprendido y cómo aplicarlo.' },
      { number: 2, title: 'Motivación', description: 'Despierta tu curiosidad.' },
      { number: 3, title: 'Explorar, experimenta, analiza y mejora.', description: 'Laboratorio físico: Realiza el experimento y registra tus datos.' },
      { number: 4, title: 'Construcción del modelo', description: 'Entiende y representa el movimiento.' },
      { number: 5, title: 'Road to Glory', description: 'Experimenta en el laboratorio virtual.' }
    ]
  };

  // Señales reactivas
  experience = signal<Experience>(this.experienceData);
  progress = computed(() => this.experience().progress);
  progressPercent = computed(() => `${this.progress()}%`);

  // Para animación de entrada
  isLoaded = signal(false);

  ngOnInit(): void {
    // Simular carga de datos
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);

    // En el futuro: conectar con ExperienceService y ProgressService
    // this.experienceService.getCurrentExperience().subscribe(...)
  }

  // ============================================================
  // ACCIONES
  // ============================================================

  /** Simula continuar a la siguiente etapa */
  continueToNextStage(): void {
    // Lógica de navegación o actualización de etapa
    // Ejemplo: this.router.navigate(['/tellus-learning/exp/mov-parabolico/stage/2']);
    console.log('Continuar a siguiente etapa');
    // Aquí podrías disparar un evento o actualizar el progreso
    this.simulateProgressUpdate(5);
  }

  /** Simula actualización de progreso (para demo) */
  private simulateProgressUpdate(increment: number): void {
    const current = this.experience().progress;
    const newProgress = Math.min(current + increment, 100);
    this.experience.update(exp => ({
      ...exp,
      progress: newProgress,
      completedStages: Math.min(exp.completedStages + 1, exp.totalStages),
      nextAchievement: {
        ...exp.nextAchievement,
        progress: Math.min(exp.nextAchievement.progress + 10, 100)
      }
    }));
  }

  /** Maneja clic en "Continuar" (puede redirigir o abrir modal) */
  onContinue(): void {
    this.continueToNextStage();
  }
}
