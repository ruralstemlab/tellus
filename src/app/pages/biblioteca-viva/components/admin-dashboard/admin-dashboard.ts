import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../../../core/services/user.service';

interface DashboardStats {
  pending: number;
  published: number;
  users: number;          // ← Cambiado de 'developers' a 'users'
  institutions: number;
}

interface DeveloperInfo {
  name: string;
  institution: string;
  projectCount: number;
  lastPublished: Date | null;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
  profile$: Observable<UserProfile | null>;
  stats$: Observable<DashboardStats>;
  showDevelopers = false;
  showConvocatorias = false;
  developersList$: Observable<DeveloperInfo[]>;

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) {
    this.profile$ = this.profileService.profile$;
    this.stats$ = this.loadStats().pipe(shareReplay(1));
    this.developersList$ = this.loadDevelopersList();
  }

  private loadStats(): Observable<DashboardStats> {
    const pending$ = this.projectService.getProjects('pending').pipe(map(p => p.length));
    const published$ = this.projectService.getProjects('published').pipe(map(p => p.length));
    const users$ = this.userService.getUsers().pipe(map(u => u.length));
    const institutions$ = this.userService.getUsers().pipe(
      map(users => new Set(users.map(u => u.institution).filter(Boolean)).size)
    );
    return combineLatest([pending$, published$, users$, institutions$]).pipe(
      map(([pending, published, users, institutions]) => ({
        pending,
        published,
        users,
        institutions
      }))
    );
  }

  private loadDevelopersList(): Observable<DeveloperInfo[]> {
    return combineLatest([
      this.userService.getUsers(),
      this.projectService.getProjects()
    ]).pipe(
      map(([users, projects]) => {
        const developers = users.filter(u => u.role === 'student' || u.role === 'teacher');
        const userProjects = new Map<string, any[]>();
        projects.forEach(p => {
          if (p.studentEmail) {
            const list = userProjects.get(p.studentEmail) || [];
            list.push(p);
            userProjects.set(p.studentEmail, list);
          }
        });
        return developers.map(user => {
          const projs = userProjects.get(user.email) || [];
          const publishedProjs = projs.filter(p => p.status === 'published');
          const lastPub = publishedProjs.length > 0
            ? publishedProjs.reduce((a, b) => a.updatedAt > b.updatedAt ? a : b).updatedAt
            : null;
          return {
            name: user.name || user.email || 'Sin nombre',
            institution: user.institution || 'No especificada',
            projectCount: publishedProjs.length,
            lastPublished: lastPub
          };
        });
      })
    );
  }

  toggleDevelopers(): void {
    this.showDevelopers = !this.showDevelopers;
    if (this.showDevelopers) this.showConvocatorias = false;
  }

  toggleConvocatorias(): void {
    this.showConvocatorias = !this.showConvocatorias;
    if (this.showConvocatorias) this.showDevelopers = false;
  }

  crearConvocatoria(): void {
    alert('Funcionalidad "Crear Convocatoria" en desarrollo.');
  }
}