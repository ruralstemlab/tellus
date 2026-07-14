import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss'
})
export class GaleriaComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getPublished().subscribe(data => {
      this.projects = data;
    });
  }

  // Método para generar la URL de vista previa del HTML
  getHtmlUrl(htmlContent: string | undefined): string {
    if (!htmlContent) {
      return 'about:blank';
    }
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
  }
}