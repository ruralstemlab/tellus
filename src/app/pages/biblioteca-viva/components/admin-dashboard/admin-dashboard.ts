import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
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

  // Control de secciones expandidas
  showDevelopers = false;
  showConvocatorias = false;

  // Lista de developers con sus proyectos
  developersList$: Observable<DeveloperInfo[]>;

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) {
    this.profile$ = this.profileService.profile$;
    this.stats$ = this.loadStats().pipe(shareReplay(1));

    // Cargar lista de developers con proyectos
    this.developersList$ = this.loadDevelopersList();
  }

  /**
   * Carga las estadísticas combinando datos de ProjectService y UserService
   */
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

  /**
   * Carga la lista de developers (usuarios con rol student/teacher) y sus proyectos
   */
  private loadDevelopersList(): Observable<DeveloperInfo[]> {
    // Primero obtenemos todos los usuarios
    return this.userService.getUsers().pipe(
      // Filtramos solo estudiantes y docentes (developers)
      map(users => users.filter(u => u.role === 'student' || u.role === 'teacher')),
      // Obtenemos todos los proyectos publicados
      switchMap(users => {
        return this.projectService.getProjects('published').pipe(
          map(projects => {
            // Creamos un mapa de proyectos por usuario (studentEmail)
            const projectMap = new Map<string, Project>();
            projects.forEach(p => {
              if (p.studentEmail) {
                projectMap.set(p.studentEmail, p);
              }
            });
            // Construimos la lista de developers con su proyecto
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

  // Métodos para alternar secciones
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

  // Acción para crear convocatoria (por ahora solo navega)
  crearConvocatoria(): void {
    // TODO: Navegar a una ruta de creación de convocatoria o abrir modal
    alert('Funcionalidad "Crear Convocatoria" en desarrollo. Próximamente podrás gestionar convocatorias desde aquí.');
    // this.router.navigate(['/biblioteca-viva/convocatorias/nueva']);
  }
}