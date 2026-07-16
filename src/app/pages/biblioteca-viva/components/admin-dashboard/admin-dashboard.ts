import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { ProfileService } from '../../../../core/services/profile.service';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { Project } from '../../models/project.model';

interface DashboardStats {
  pending: number;
  published: number;
  developers: number;
  institutions: number;
}

interface DeveloperInfo {
  name: string;
  email: string;
  projectTitle: string;
  projectId: string;
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
    const pending$ = this.projectService
      .getProjects('pending')
      .pipe(map(projects => projects.length));

    const published$ = this.projectService
      .getProjects('published')
      .pipe(map(projects => projects.length));

    const developers$ = this.userService.getDevelopersCount();

    const institutions$ = this.userService.getInstitutionsCount();

    return combineLatest([pending$, published$, developers$, institutions$]).pipe(
      map(([pending, published, developers, institutions]) => ({
        pending,
        published,
        developers,
        institutions
      }))
    );
  }

  private loadDevelopersList(): Observable<DeveloperInfo[]> {
    return this.userService.getUsers().pipe(
      map(users => users.filter(u => u.role === 'student' || u.role === 'teacher')),
      switchMap(users => {
        return this.projectService.getProjects('published').pipe(
          map(projects => {
            const projectMap = new Map<string, Project>();
            projects.forEach(p => {
              if (p.studentEmail) {
                projectMap.set(p.studentEmail, p);
              }
            });
            return users.map(user => {
              const project = projectMap.get(user.email);
              return {
                name: user.name || user.email || 'Sin nombre',
                email: user.email,
                projectTitle: project ? project.title : 'Sin proyecto',
                projectId: project ? project.id || '' : ''
              };
            });
          })
        );
      })
    );
  }

  toggleDevelopers(): void {
    this.showDevelopers = !this.showDevelopers;
    if (this.showDevelopers) {
      this.showConvocatorias = false;
    }
  }

  toggleConvocatorias(): void {
    this.showConvocatorias = !this.showConvocatorias;
    if (this.showConvocatorias) {
      this.showDevelopers = false;
    }
  }

  crearConvocatoria(): void {
    alert('Funcionalidad "Crear Convocatoria" en desarrollo. Próximamente podrás gestionar convocatorias desde aquí.');
  }
}