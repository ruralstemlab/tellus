import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit {

  /**
   * Pestaña activa
   */
  activeTab: 'pending' | 'all' = 'pending';

  /**
   * Estado de carga
   */
  loading = false;

  /**
   * Todos los proyectos
   */
  allProjects: Project[] = [];

  /**
   * Solo proyectos pendientes
   */
  pendingProjects: Project[] = [];

  /**
   * Notas de revisión
   */
  reviewNotes: Record<string, string> = {};

  constructor(
    private readonly projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Carga todos los proyectos
   */
  loadProjects(): void {

    this.loading = true;

    this.projectService.getProjects().subscribe({

      next: (projects) => {

        this.allProjects = projects;

        this.pendingProjects = projects.filter(
          project => project.status === 'pending'
        );

        this.loading = false;

      },

      error: (error) => {

        console.error('Error cargando proyectos:', error);

        this.loading = false;

      }

    });

  }

  /**
   * Cambiar pestaña
   */
  setTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  /**
   * Clase CSS según estado
   */
  getStatusClass(status: string): string {

    switch (status) {

      case 'pending':
        return 'status-pending';

      case 'approved':
        return 'status-approved';

      case 'published':
        return 'status-published';

      case 'rejected':
        return 'status-rejected';

      default:
        return '';

    }

  }

  /**
   * Texto del estado
   */
  getStatusLabel(status: string): string {

    switch (status) {

      case 'pending':
        return 'Pendiente';

      case 'approved':
        return 'Aprobado';

      case 'published':
        return 'Publicado';

      case 'rejected':
        return 'Rechazado';

      default:
        return status;

    }

  }

  /**
   * Visualizar aplicación HTML
   */
  viewProject(project: Project): void {

    if (!project.htmlContent) {

      alert('Este proyecto no tiene contenido HTML.');

      return;

    }

    const blob = new Blob(
      [project.htmlContent],
      { type: 'text/html' }
    );

    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 5000);

  }

  /**
   * Aprobar proyecto
   */
  approve(project: Project): void {

    this.updateProjectStatus(
      project,
      'approved',
      'Proyecto aprobado'
    );

  }

  /**
   * Publicar proyecto
   */
  publish(project: Project): void {

    this.updateProjectStatus(
      project,
      'published',
      'Proyecto publicado'
    );

  }

  /**
   * Rechazar proyecto
   */
  reject(project: Project): void {

    this.updateProjectStatus(
      project,
      'rejected',
      'Proyecto rechazado'
    );

  }

  /**
   * Actualiza el estado del proyecto
   */
  private updateProjectStatus(

    project: Project,

    status: 'approved' | 'published' | 'rejected',

    successMessage: string

  ): void {

    if (!project.id) {
      return;
    }

    const note = this.reviewNotes[project.id] || '';

    this.projectService.updateStatus(
      project.id,
      status,
      note
    ).subscribe({

      next: () => {

        alert(successMessage);

        delete this.reviewNotes[project.id!];

        this.loadProjects();

      },

      error: (error) => {

        console.error(error);

        alert('Ocurrió un error al actualizar el proyecto.');

      }

    });

  }

}