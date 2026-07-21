import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../../../core/models/project.model';
import { InstitutionService } from '../../../../core/services/institution.service';
import { Institution } from '../../../../core/models/institution.model';

interface InstitutionView {
  id: string;
  name: string;
  location: string;
  full: string;
}

@Component({
  selector: 'app-participar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participar.html',
  styleUrls: ['./participar.scss']
})
export class ParticiparComponent {
  project: Omit<
    Project,
    | 'id'
    | 'uploadedAt'
    | 'updatedAt'
    | 'htmlFileName'
    | 'htmlSize'
    | 'htmlLines'
    | 'htmlContent'
    | 'storagePath'
    | 'status'
    | 'votes'
    | 'views'
    | 'rating'
    | 'ratingCount'
    | 'featured'
    | 'featuredAt'
    | 'reviewedBy'
    | 'reviewedAt'
    | 'publishedAt'
    | 'submittedAt'
    | 'reviewNotes'
  > = {
    title: '',
    description: '',
    category: '',
    studentName: '',
    studentEmail: '',
    grade: '',
    institution: ''
  };

  categories = [
    { name: 'Juego', icon: '🎮' },
    { name: 'Educación', icon: '📚' },
    { name: 'Simulador', icon: '🧪' },
    { name: 'Finanzas', icon: '💰' },
    { name: 'Emprendimiento', icon: '🚀' },
    { name: 'Otro', icon: '💡' }
  ];

  institutions$: Observable<InstitutionView[]>;

  selectedFile: File | null = null;
  fileInfo: {
    name: string;
    size: number;
    lastModified: Date;
    lines: number;
    chars: number;
    content: string;
    fullContent?: string;
  } | null = null;

  warnings: string[] = [];
  isSubmitting = false;
  maxFileSize = 2 * 1024 * 1024;

  constructor(
    private projectService: ProjectService,
    private institutionService: InstitutionService,
    private router: Router
  ) {
    this.institutions$ = this.institutionService.getActiveInstitutions().pipe(
      map((insts: Institution[]) => insts.map(inst => ({
        id: inst.id,
        name: inst.name,
        location: inst.municipality + (inst.department ? ', ' + inst.department : ''),
        full: inst.name + ' – ' + inst.municipality
      })))
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.fileInfo = null;
      this.warnings = [];
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;
    this.warnings = [];

    if (!file.name.toLowerCase().endsWith('.html') && !file.type.includes('html')) {
      this.warnings.push('El archivo debe ser HTML (extensión .html)');
      input.value = '';
      this.selectedFile = null;
      this.fileInfo = null;
      return;
    }

    if (file.name.toLowerCase() !== 'index.html') {
      this.warnings.push('El archivo debe llamarse exactamente "index.html"');
    }

    if (file.size === 0) {
      this.warnings.push('El archivo está vacío');
    }

    if (file.size > this.maxFileSize) {
      this.warnings.push(`El archivo excede el tamaño máximo de ${this.maxFileSize / 1024 / 1024} MB`);
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      if (!content) {
        this.warnings.push('No se pudo leer el contenido del archivo');
        return;
      }
      const lines = content.split('\n').length;
      const chars = content.length;

      this.fileInfo = {
        name: file.name,
        size: file.size,
        lastModified: new Date(file.lastModified),
        lines,
        chars,
        content: content.slice(0, 500) + (chars > 500 ? '...' : ''),
        fullContent: content
      };

      this.validateHTML(content);
    };
    reader.readAsText(file);
  }

  private validateHTML(content: string): void {
    const trimmed = content.trim().toLowerCase();
    if (!trimmed.startsWith('<!doctype html>')) {
      this.warnings.push('El archivo debería comenzar con <!DOCTYPE html>');
    }
    if (!/<html/i.test(content)) this.warnings.push('Falta la etiqueta <html>');
    if (!/<head/i.test(content)) this.warnings.push('Falta la etiqueta <head>');
    if (!/<body/i.test(content)) this.warnings.push('Falta la etiqueta <body>');
  }

  seleccionarInstitucion(inst: InstitutionView): void {
    this.project.institution = inst.full;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    if (!this.selectedFile || !this.fileInfo || !this.fileInfo.fullContent) {
      alert('Debes seleccionar un archivo HTML válido');
      return;
    }

    this.isSubmitting = true;

    const projectData = {
      ...this.project,
      htmlFileName: this.selectedFile.name,
      htmlSize: this.selectedFile.size,
      htmlLines: this.fileInfo.lines,
      htmlContent: this.fileInfo.fullContent,
      storagePath: '',
      status: 'pending' as const
    };

    this.projectService.createProject(projectData).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Proyecto enviado correctamente. Queda pendiente de revisión.');
        this.router.navigate(['/biblioteca-viva']);
      },
      error: (err: Error) => {
        console.error('Error al crear proyecto en Firestore:', err);
        this.isSubmitting = false;
        alert('Error al crear el proyecto. Inténtalo de nuevo.');
      }
    });
  }

  private validateForm(): boolean {
    const errors: string[] = [];
    if (!this.project.title.trim()) errors.push('El nombre del proyecto es obligatorio');
    if (!this.project.description.trim()) errors.push('La descripción es obligatoria');
    if (!this.project.category) errors.push('Debes seleccionar una categoría');
    if (!this.project.studentName.trim()) errors.push('El nombre del estudiante es obligatorio');
    if (!this.project.studentEmail.trim()) {
      errors.push('El correo electrónico es obligatorio');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.project.studentEmail)) {
      errors.push('El correo electrónico no es válido');
    }
    if (!this.project.grade.trim()) errors.push('El grado es obligatorio');
    if (!this.project.institution) errors.push('Debes seleccionar una institución');
    if (!this.selectedFile) errors.push('Debes seleccionar un archivo index.html');

    if (this.warnings.some(w => w.includes('Falta la etiqueta <html>') || w.includes('vacío') || w.includes('excede el tamaño'))) {
      errors.push('El archivo HTML tiene problemas críticos: ' + this.warnings.join(', '));
    }

    if (errors.length > 0) {
      alert('Por favor corrige los siguientes errores:\n- ' + errors.join('\n- '));
      return false;
    }
    return true;
  }
}