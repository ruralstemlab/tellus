import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit {
  // Propiedades para la vista
  activeTab: 'pending' | 'all' = 'pending';
  loading = false;
  
  // Listas de proyectos
  projects: Project[] = [];
  pendingProjects: Project[] = [];
  allProjects: Project[] = [];

  // Notas de revisión por proyecto (objeto con id como clave)
  reviewNotes: { [key: string]: string } = {};

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (data: Project[]) => {
        this.allProjects = data;
        this.pendingProjects = data.filter(p => p.status === 'pending');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.loading = false;
      }
    });
  }

  // Cambiar pestaña
  setTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'published': return 'status-published';
      default: return '';
    }
  }

  // Obtener etiqueta legible del estado
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'published': return 'Publicado';
      default: return status;
    }
  }

  // Ver el HTML del proyecto en una nueva ventana
  viewProject(project: Project): void {
    if (project.htmlContent) {
      const blob = new Blob([project.htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      alert('Este proyecto no tiene contenido HTML.');
    }
  }

  // Aprobar proyecto (cambia a 'approved')
  approve(project: Project): void {
    if (!project.id) return;
    const note = this.reviewNotes[project.id] || '';
    this.projectService.updateStatus(project.id, 'approved', note).subscribe({
      next: () => {
        alert('Proyecto aprobado');
        this.loadProjects();
        delete this.reviewNotes[project.id!];
      },
      error: (err) => {
        console.error('Error al aprobar:', err);
        alert('Error al aprobar el proyecto');
      }
    });
  }

  // Publicar proyecto (cambia a 'published')
  publish(project: Project): void {
    if (!project.id) return;
    this.projectService.updateStatus(project.id, 'published').subscribe({
      next: () => {
        alert('Proyecto publicado');
        this.loadProjects();
      },
      error: (err) => {
        console.error('Error al publicar:', err);
        alert('Error al publicar el proyecto');
      }
    });
  }

  // Rechazar proyecto
  reject(project: Project): void {
    if (!project.id) return;
    const note = this.reviewNotes[project.id] || '';
    this.projectService.updateStatus(project.id, 'rejected', note).subscribe({
      next: () => {
        alert('Proyecto rechazado');
        this.loadProjects();
        delete this.reviewNotes[project.id!];
      },
      error: (err) => {
        console.error('Error al rechazar:', err);
        alert('Error al rechazar el proyecto');
      }
    });
  }
}