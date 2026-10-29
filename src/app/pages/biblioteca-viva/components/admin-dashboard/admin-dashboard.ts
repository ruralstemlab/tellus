
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Observable,
  combineLatest,
} from 'rxjs';
import {
  map,
  shareReplay,
} from 'rxjs/operators';

import { ProfileService } from '../../../../core/services/profile.service';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { Project } from '../../../../core/models/project.model';
import { auth } from '../../../../../environments/firebase.config';

interface DashboardStats {
  pending: number;
  published: number;
  users: number;
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
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboardComponent {
  profile$: Observable<UserProfile | null>;
  stats$: Observable<DashboardStats>;
  developersList$: Observable<DeveloperInfo[]>;

  showDevelopers = false;
  showConvocatorias = false;
  showProjects = false;

  projects: Project[] = [];
  loadingProjects = false;
  deletingProjectId: string | null = null;

  get displayName(): string {
    const profile = this.profileService.currentProfile;

    if (profile?.name) return profile.name;
    if (profile?.email) return profile.email;

    const user = auth.currentUser;

    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email;

    return 'Administrador';
  }

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly institutionService: InstitutionService
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

    const users$ = this.userService
      .getUsers()
      .pipe(map(users => users.length));

    const institutions$ = this.institutionService
      .getInstitutions()
      .pipe(map(institutions => institutions.length));

    return combineLatest([
      pending$,
      published$,
      users$,
      institutions$,
    ]).pipe(
      map(([pending, published, users, institutions]) => ({
        pending,
        published,
        users,
        institutions,
      }))
    );
  }

  private loadDevelopersList(): Observable<DeveloperInfo[]> {
    return combineLatest([
      this.userService.getUsers(),
      this.projectService.getAllProjects(),
    ]).pipe(
      map(([users, projects]) => {
        const developers = users.filter(
          user =>
            user.role === 'student' ||
            user.role === 'teacher'
        );

        const userProjects = new Map<string, Project[]>();

        projects.forEach(project => {
          if (!project.studentEmail) return;

          const list =
            userProjects.get(project.studentEmail) || [];

          list.push(project);
          userProjects.set(project.studentEmail, list);
        });

        return developers.map(user => {
          const userProjectsList =
            userProjects.get(user.email) || [];

          const publishedProjects = userProjectsList.filter(
            project => project.status === 'published'
          );

          const lastPublished =
            publishedProjects.length > 0
              ? publishedProjects.reduce((latest, current) => {
                  const latestTime =
                    latest.updatedAt instanceof Date
                      ? latest.updatedAt.getTime()
                      : 0;

                  const currentTime =
                    current.updatedAt instanceof Date
                      ? current.updatedAt.getTime()
                      : 0;

                  return currentTime > latestTime
                    ? current
                    : latest;
                }).updatedAt
              : null;

          return {
            name: user.name || user.email || 'Sin nombre',
            institution: user.institution || 'No especificada',
            projectCount: publishedProjects.length,
            lastPublished,
          };
        });
      })
    );
  }

  toggleDevelopers(): void {
    this.showDevelopers = !this.showDevelopers;

    if (this.showDevelopers) {
      this.showConvocatorias = false;
      this.showProjects = false;
    }
  }

  toggleConvocatorias(): void {
    this.showConvocatorias = !this.showConvocatorias;

    if (this.showConvocatorias) {
      this.showDevelopers = false;
      this.showProjects = false;
    }
  }

  toggleProjects(): void {
    this.showProjects = !this.showProjects;

    if (this.showProjects) {
      this.showDevelopers = false;
      this.showConvocatorias = false;
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.loadingProjects = true;

    this.projectService.getAllProjects().subscribe({
      next: projects => {
        this.projects = projects;
        this.loadingProjects = false;
      },
      error: error => {
        console.error(
          'Error al cargar las aplicaciones:',
          error
        );

        this.loadingProjects = false;
        alert('No se pudieron cargar las aplicaciones.');
      },
    });
  }

  deleteApplication(project: Project): void {
    if (!project.id) {
      alert(
        'No se puede eliminar: falta el ID del proyecto.'
      );
      return;
    }

    if (this.deletingProjectId) {
      return;
    }

    const confirmed = confirm(
      `¿Eliminar definitivamente esta aplicación?\n\n` +
      `Título: ${project.title || 'Sin título'}\n` +
      `Autor: ${project.studentName || 'No especificado'}\n` +
      `ID: ${project.id}\n\n` +
      'Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    const projectId = project.id;
    this.deletingProjectId = projectId;

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.projects = this.projects.filter(
          item => item.id !== projectId
        );

        this.deletingProjectId = null;

        alert('Aplicación eliminada correctamente.');
      },
      error: error => {
        console.error(
          'Error al eliminar la aplicación:',
          error
        );

        this.deletingProjectId = null;

        alert(
          'No se pudo eliminar la aplicación. ' +
          'Verifica las reglas y permisos de Firestore.'
        );
      },
    });
  }

  crearConvocatoria(): void {
    alert(
      'Funcionalidad "Crear Convocatoria" en desarrollo.'
    );
  }
}
