import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './galeria.html',
  styleUrls: ['./galeria.scss']
})
export class GaleriaComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  showApproved = false;

  constructor(private readonly projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        const statuses = this.showApproved ? ['published', 'approved'] : ['published'];
        this.projects = projects.filter(p => statuses.includes(p.status));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        this.loading = false;
      }
    });
  }

  toggleApproved(): void {
    this.showApproved = !this.showApproved;
    this.loadProjects();
  }

  getStars(rating: number): string {
    const full = Math.round(rating || 0);
    const empty = 5 - full;
    return '⭐'.repeat(full) + '☆'.repeat(empty);
  }

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
}