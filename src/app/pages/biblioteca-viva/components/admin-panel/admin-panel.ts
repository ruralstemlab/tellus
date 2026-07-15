import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  activeTab: 'pending' | 'all' = 'pending';
  loading = true;
  allProjects: Project[] = [];
  pendingProjects: Project[] = [];
  reviewNotes: Record<string, string> = {};

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        // Convertir Timestamps a Date manualmente
        const converted = projects.map(p => ({
          ...p,
          uploadedAt: this.toDate(p.uploadedAt),
          updatedAt: this.toDate(p.updatedAt)
        }));

        this.allProjects = converted;
        this.pendingProjects = converted.filter(p => p.status === 'pending');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private toDate(value: any): Date | any {
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
      return value.toDate();
    }
    return value;
  }

  setTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-approved',
      published: 'status-published',
      rejected: 'status-rejected'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      published: 'Publicado',
      rejected: 'Rechazado'
    };
    return labels[status] || status;
  }

  viewProject(project: Project): void {
    if (!project.htmlContent) {
      alert('Este proyecto no tiene contenido.');
      return;
    }
    const blob = new Blob([project.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  approve(project: Project): void {
    this.updateStatus(project, 'approved', 'Proyecto aprobado');
  }

  publish(project: Project): void {
    this.updateStatus(project, 'published', 'Proyecto publicado');
  }

  reject(project: Project): void {
    this.updateStatus(project, 'rejected', 'Proyecto rechazado');
  }

  private updateStatus(
    project: Project,
    status: 'approved' | 'published' | 'rejected',
    message: string
  ): void {
    if (!project.id) return;
    const note = this.reviewNotes[project.id] || '';
    this.projectService.updateStatus(project.id, status, note).subscribe({
      next: () => {
        alert(message);
        delete this.reviewNotes[project.id!];
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar.');
      }
    });
  }
}