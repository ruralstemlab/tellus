import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ProjectService } from '../../../../core/services/project.service';
import { VoteService } from '../../../../core/services/vote.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { Project } from '../../../../core/models/project.model';

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
  viewMode: 'slider' | 'grid' = 'slider';
  currentIndex = 0;
  isLoading = true;

  showApproved = true;

  userVotes: Record<string, number> = {};
  isAuthenticated = false;
  private userId: string | null = null;

  private isDragging = false;
  private startX = 0;
  private currentX = 0;
  private dragOffset = 0;
  private subscription = new Subscription();

  constructor(
    private projectService: ProjectService,
    private voteService: VoteService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.projects$ = this.projectService.getProjects('published').pipe(
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.user$.subscribe(async user => {
        this.isAuthenticated = !!user;
        this.userId = user?.uid || null;
        if (this.isAuthenticated) {
          await this.loadUserVotes();
        } else {
          this.userVotes = {};
          this.cdr.detectChanges();
        }
      })
    );

    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects('published').subscribe({
      next: (projects) => {
        this.allProjects = projects;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        this.isLoading = false;
      }
    });
  }

  toggleApproved(): void {
    this.showApproved = !this.showApproved;
    this.loadProjects();
    this.currentIndex = 0;
  }

  private async loadUserVotes(): Promise<void> {
    if (!this.userId) return;
    try {
      const votes = await firstValueFrom(this.voteService.getUserVotes(this.userId));
      if (votes) {
        this.userVotes = {};
        votes.forEach(v => {
          this.userVotes[v.projectId] = v.rating;
        });
        this.cdr.detectChanges();
      }
    } catch (err) {
      console.error('Error cargando votos:', err);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  next(): void {
    if (this.currentIndex < this.allProjects.length - 1) {
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

  // ✅ Ranking: ordena por SCORE = rating * ratingCount (total de estrellas acumuladas)
  getRankedProjects(): Project[] {
    return [...this.allProjects].sort((a, b) => {
      const scoreA = (a.rating || 0) * (a.ratingCount || 0);
      const scoreB = (b.rating || 0) * (b.ratingCount || 0);
      return scoreB - scoreA;
    });
  }

  getRankMedal(project: Project, index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  }

  async votar(project: Project, rating: number, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.isAuthenticated) {
      this.showNotification('Inicia sesión para votar', 'warning');
      return;
    }
    if (this.userVotes[project.id!] === rating) {
      this.showNotification('Ya votaste con esta calificación', 'info');
      return;
    }

    try {
      await this.voteService.vote(project.id!, rating);
      const updatedProject = { ...project };
      const freshProject = await firstValueFrom(this.projectService.getProject(project.id!));
      if (freshProject) {
        Object.assign(updatedProject, freshProject);
      }
      this.userVotes[project.id!] = rating;

      const updateArray = (arr: Project[]) => {
        const index = arr.findIndex(p => p.id === project.id);
        if (index !== -1) arr[index] = updatedProject;
        return arr;
      };
      this.allProjects = updateArray([...this.allProjects]);
      this.cdr.detectChanges();

      this.showNotification('¡Voto registrado!', 'success');
    } catch (err) {
      console.error('Error al votar:', err);
      this.showNotification('Error al votar. Inténtalo de nuevo.', 'error');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const colors = {
      success: '#4cff9c',
      error: '#ff5252',
      warning: '#ffc107',
      info: '#6495ed'
    };
    const bg = colors[type] || '#fff';
    const textColor = type === 'warning' || type === 'info' ? '#fff' : '#04140d';
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: ${bg};
      color: ${textColor};
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transform = 'translateX(-50%) translateY(20px)';
      div.style.transition = 'all 0.3s ease';
      setTimeout(() => div.remove(), 400);
    }, 3000);
  }

  verProyecto(project: Project): void {
    if (!project.htmlContent) {
      this.showNotification('Este proyecto no tiene contenido HTML.', 'warning');
      return;
    }
    const blob = new Blob([project.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // Drag handlers (sin cambios)
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
      if (delta < 0 && this.currentIndex < this.allProjects.length - 1) {
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
      if (delta < 0 && this.currentIndex < this.allProjects.length - 1) {
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

  onWheel(event: WheelEvent): void {
    if (this.viewMode !== 'slider') return;
    const delta = event.deltaY;
    if (Math.abs(delta) > 20) {
      if (delta > 0 && this.currentIndex < this.allProjects.length - 1) {
        this.currentIndex++;
      } else if (delta < 0 && this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.updateSlider();
    }
  }

  getIcon(category: string): string {
    return getCategoryIcon(category);
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