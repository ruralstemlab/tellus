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
  styleUrl: './admin-panel.scss'
})
export class AdminPanelComponent implements OnInit {
  // ---------- Propiedades ----------
  pendingProjects: Project[] = [];
  allProjects: Project[] = [];
  reviewNotes: { [id: string]: string } = {};
  activeTab: 'pending' | 'all' = 'pending';
  loading = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // ---------- Cargar datos ----------
  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.allProjects = data;
        this.pendingProjects = data.filter(p => p.status === 'pending');
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar proyectos', err);
        this.loading = false;
      }
    });
  }

  // ---------- Acciones ----------
  approve(project: Project): void {
    if (project.status === 'published') return;
    const notes = this.reviewNotes[project.id!] || 'Aprobado por administrador.';
    this.projectService.updateStatus(project.id!, 'approved', notes).subscribe({
      next: () => {
        alert('✅ Proyecto aprobado. Ahora puede publicarse.');
        this.loadProjects();
      },
      error: (err: any) => alert('Error al aprobar: ' + err.message)
    });
  }

  reject(project: Project): void {
    if (project.status === 'published') return;
    const notes = this.reviewNotes[project.id!] || 'Rechazado por incumplir reglas.';
    this.projectService.updateStatus(project.id!, 'rejected', notes).subscribe({
      next: () => {
        alert('❌ Proyecto rechazado.');
        this.loadProjects();
      },
      error: (err: any) => alert('Error al rechazar: ' + err.message)
    });
  }

  publish(project: Project): void {
    if (project.status === 'published' || project.status === 'rejected') return;
    this.projectService.updateStatus(project.id!, 'published', this.reviewNotes[project.id!] || '').subscribe({
      next: () => {
        alert('🚀 Proyecto publicado en Biblioteca Viva.');
        this.loadProjects();
      },
      error: (err: any) => alert('Error al publicar: ' + err.message)
    });
  }

  // ---------- Helpers para el template ----------
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-approved',
      published: 'status-published',
      rejected: 'status-rejected'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      published: 'Publicado',
      rejected: 'Rechazado'
    };
    return map[status] || status;
  }

  // ---------- Método para codificar HTML a Base64 ----------
  getHtmlBase64(htmlContent: string | undefined): string {
    if (!htmlContent) {
      return '#';
    }
    try {
      return 'data:text/html;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(htmlContent)));
    } catch (e) {
      return '#';
    }
  }
}