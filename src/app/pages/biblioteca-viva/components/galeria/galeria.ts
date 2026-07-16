import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
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

  // 🔥 Método para ver proyecto (lo que sea que haga tu botón)
  // Si no quieres que haga nada, solo comenta el (click) en el HTML
  verProyecto(project: Project): void {
    // Ejemplo: navegar a la vista del proyecto o abrir en nueva pestaña
    // router.navigate(['/biblioteca-viva/proyecto', project.id]);
    console.log('Ver proyecto:', project.title);
    // Si no tienes ruta, muestra un alert
    alert('Funcionalidad "Ver proyecto" en desarrollo. Próximamente podrás ver los detalles de cada app.');
  }
}