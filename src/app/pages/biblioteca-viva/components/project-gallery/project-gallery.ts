import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../core/models/project.model';

// Mapa de iconos por categoría
const categoryIcons: Record<string, string> = {
  'Juego': '🎮',
  'Educación': '📚',
  'Matemáticas': '➗',
  'Física': '⚛️',
  'Química': '🧪',
  'Biología': '🧬',
  'Programación': '💻',
  'IA': '🤖',
  'Electrónica': '🔌',
  'Finanzas': '💰',
  'Salud': '🏥',
  'Emprendimiento': '🚀',
  'Arte': '🎨',
  'Turismo': '🌍',
  'Otro': '💡'
};

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || '📁';
}

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-gallery.html',
  styleUrls: ['./project-gallery.scss']
})
export class ProjectGalleryComponent implements OnInit, OnDestroy {
  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLElement>;

  projects$: Observable<Project[]>;
  allProjects: Project[] = [];
  visibleProjects: Project[] = [];
  viewMode: 'slider' | 'grid' = 'slider';
  currentIndex = 0;
  isLoading = true;

  // Variables para drag
  private isDragging = false;
  private startX = 0;
  private currentX = 0;
  private dragOffset = 0;
  private subscription = new Subscription();

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {
    this.projects$ = this.projectService.getProjects('published').pipe(
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.projects$.subscribe(projects => {
        this.allProjects = projects;
        this.visibleProjects = projects.slice(0, 8);
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Navegación
  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  next(): void {
    if (this.currentIndex < this.visibleProjects.length - 1) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  private updateSlider(): void {
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      const cardWidth = 324;
      const offset = this.currentIndex * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;
    }
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'slider' ? 'grid' : 'slider';
    if (this.viewMode === 'slider') {
      this.currentIndex = 0;
      this.updateSlider();
    }
  }

  // 🔥 NUEVO: Abrir proyecto en nueva pestaña (igual que el admin panel)
  verProyecto(project: Project): void {
    if (!project.htmlContent) {
      alert('Este proyecto no tiene contenido HTML.');
      return;
    }
    const blob = new Blob([project.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // Eventos de drag (mouse)
  onMouseDown(event: MouseEvent): void {
    if (this.viewMode !== 'slider') return;
    this.isDragging = true;
    this.startX = event.clientX;
    this.currentX = this.startX;
    this.dragOffset = 0;
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      track.style.transition = 'none';
    }
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.viewMode !== 'slider') return;
    this.currentX = event.clientX;
    const delta = this.currentX - this.startX;
    this.dragOffset = delta;
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      const cardWidth = 324;
      const baseOffset = this.currentIndex * cardWidth;
      track.style.transform = `translateX(-${baseOffset + delta}px)`;
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging || this.viewMode !== 'slider') return;
    this.isDragging = false;
    const delta = this.currentX - this.startX;
    const cardWidth = 324;
    const threshold = 50;
    if (Math.abs(delta) > threshold) {
      if (delta < 0 && this.currentIndex < this.visibleProjects.length - 1) {
        this.currentIndex++;
      } else if (delta > 0 && this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    this.updateSlider();
  }

  // Eventos táctiles
  onTouchStart(event: TouchEvent): void {
    if (this.viewMode !== 'slider') return;
    const touch = event.touches[0];
    this.isDragging = true;
    this.startX = touch.clientX;
    this.currentX = this.startX;
    this.dragOffset = 0;
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      track.style.transition = 'none';
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || this.viewMode !== 'slider') return;
    const touch = event.touches[0];
    this.currentX = touch.clientX;
    const delta = this.currentX - this.startX;
    this.dragOffset = delta;
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      const cardWidth = 324;
      const baseOffset = this.currentIndex * cardWidth;
      track.style.transform = `translateX(-${baseOffset + delta}px)`;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging || this.viewMode !== 'slider') return;
    this.isDragging = false;
    const delta = this.currentX - this.startX;
    const cardWidth = 324;
    const threshold = 50;
    if (Math.abs(delta) > threshold) {
      if (delta < 0 && this.currentIndex < this.visibleProjects.length - 1) {
        this.currentIndex++;
      } else if (delta > 0 && this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
    const track = this.sliderTrack?.nativeElement;
    if (track) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    this.updateSlider();
  }

  // Wheel horizontal
  onWheel(event: WheelEvent): void {
    if (this.viewMode !== 'slider') return;
    const delta = event.deltaY;
    if (Math.abs(delta) > 20) {
      if (delta > 0 && this.currentIndex < this.visibleProjects.length - 1) {
        this.currentIndex++;
      } else if (delta < 0 && this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.updateSlider();
    }
  }

  // Utilerías
  getIcon(category: string): string {
    return getCategoryIcon(category);
  }

  getMedal(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  }

  getBadges(project: Project): string[] {
    const badges: string[] = [];
    if (project.featured) badges.push('💎 Destacado');
    const date = project.publishedAt || project.uploadedAt;
    if (date) {
      const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) badges.push('🆕 Nuevo');
    }
    return badges;
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id!;
  }
}