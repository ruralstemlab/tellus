import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialService } from '../../../../../core/services/credential.service';
import { OrganizationService } from '../../../../../core/services/organization.service';
import { ProjectService } from '../../../../../core/services/project.service';
import { Credential } from '../../../../../core/models/credential.model';
import { Organization } from '../../../../../core/models/organization.model';
import { Project } from '../../../../../core/models/project.model';

@Component({
  selector: 'app-credentials-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credentials-admin.component.html',
  styleUrls: ['./credentials-admin.component.scss']
})
export class CredentialsAdminComponent implements OnInit, OnDestroy {
  credentials: Credential[] = [];
  organizations: Organization[] = [];
  publishedProjects: Project[] = [];
  selectedProject: Project | null = null;

  isLoading = false;
  isEmitting = false;

  filterStatus: string = 'all';
  searchTerm: string = '';

  recognitionOptions = [
    { value: 'Mejor Diseño', icon: '🎨', selected: false },
    { value: 'Innovación', icon: '💡', selected: false },
    { value: 'Inteligencia Artificial', icon: '🤖', selected: false },
    { value: 'Impacto Social', icon: '🌍', selected: false },
    { value: 'Excelencia Técnica', icon: '⚡', selected: false },
    { value: 'Mención Honorífica', icon: '🏅', selected: false },
    { value: 'Premio del Público', icon: '👥', selected: false }
  ];

  showEmitModal = false;
  previewCredential: any = null;
  modalError = '';

  private subscription = new Subscription();

  constructor(
    private credentialService: CredentialService,
    private organizationService: OrganizationService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadData(): void {
    this.isLoading = true;
    combineLatest([
      this.credentialService.getCredentials(),
      this.organizationService.getActiveOrganizations(),
      this.projectService.getProjects('published')
    ]).subscribe({
      next: ([credentials, organizations, projects]) => {
        this.credentials = credentials;
        this.organizations = organizations;
        this.publishedProjects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredCredentials(): Credential[] {
    let list = this.credentials;
    if (this.filterStatus !== 'all') {
      list = list.filter(c => c.status === this.filterStatus);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.credentialNumber.toLowerCase().includes(term) ||
        c.userId.toLowerCase().includes(term)
      );
    }
    return list;
  }

  get filteredProjects(): Project[] {
    const credentialedIds = this.credentials
      .filter(c => c.status === 'issued' || c.status === 'sent' || c.status === 'viewed')
      .map(c => c.projectId)
      .filter(Boolean);
    // ✅ CORREGIDO: verificar que p.id existe antes de usar includes
    return this.publishedProjects.filter(p => p.id && !credentialedIds.includes(p.id));
  }

  openEmitModal(project?: Project): void {
    if (!project) {
      this.selectedProject = null;
      this.showEmitModal = true;
      this.modalError = 'Selecciona un proyecto de la lista para emitir una credencial.';
      this.previewCredential = null;
      this.recognitionOptions.forEach(opt => opt.selected = false);
      return;
    }
    this.selectedProject = project;
    this.recognitionOptions.forEach(opt => opt.selected = false);
    this.modalError = '';
    this.previewCredential = null;
    this.showEmitModal = true;
    this.generatePreview();
  }

  toggleRecognition(value: string): void {
    const option = this.recognitionOptions.find(o => o.value === value);
    if (option) {
      option.selected = !option.selected;
      this.generatePreview();
    }
  }

  get selectedRecognitions(): string[] {
    return this.recognitionOptions.filter(o => o.selected).map(o => o.value);
  }

  generatePreview(): void {
    if (!this.selectedProject) return;
    const recognitions = this.selectedRecognitions;
    const recognitionText = recognitions.length > 0
      ? recognitions.join(' · ')
      : 'Sin reconocimientos';
    this.previewCredential = {
      title: `Diploma de Participación - ${this.selectedProject.title}`,
      studentName: this.selectedProject.studentName,
      studentEmail: this.selectedProject.studentEmail,
      institution: this.selectedProject.institution,
      category: this.selectedProject.category,
      recognition: recognitionText,
      issueDate: new Date(),
      projectTitle: this.selectedProject.title
    };
  }

  emitCredential(): void {
    if (!this.selectedProject) {
      this.modalError = 'No hay proyecto seleccionado.';
      return;
    }

    this.isEmitting = true;
    this.modalError = '';

    const credentialData: Partial<Credential> = {
      title: `Diploma de Participación - ${this.selectedProject.title}`,
      description: this.selectedProject.description || '',
      userId: this.selectedProject.studentEmail || '',
      projectId: this.selectedProject.id,
      organizationId: this.selectedProject.institution || 'default-org',
      institutionId: this.selectedProject.institution || 'default-inst',
      credentialType: 'certificate',
      credentialCategory: 'concurso',
      recognition: this.selectedRecognitions.join(' · ') || 'Participación',
      issueDate: new Date(),
      templateId: 'default-template',
      isPublic: true,
      status: 'issued'
    };

    this.credentialService.createCredential(credentialData).subscribe({
      next: (id) => {
        this.credentialService.issueCredential(id).subscribe({
          next: () => {
            this.isEmitting = false;
            this.showEmitModal = false;
            alert('✅ Credencial emitida correctamente');
            this.loadData();
          },
          error: (err) => {
            this.isEmitting = false;
            this.modalError = 'Error al emitir: ' + err.message;
          }
        });
      },
      error: (err) => {
        this.isEmitting = false;
        this.modalError = 'Error al crear: ' + err.message;
      }
    });
  }

  closeModal(): void {
    this.showEmitModal = false;
    this.selectedProject = null;
    this.previewCredential = null;
    this.modalError = '';
  }

  revokeCredential(id: string): void {
    if (!id) {
      console.warn('ID de credencial no válido');
      return;
    }
    if (!confirm('¿Revocar esta credencial?')) return;
    this.credentialService.revokeCredential(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error al revocar:', err)
    });
  }

  viewCredential(cred: Credential): void {
    if (!cred.id) {
      alert('La credencial no tiene ID.');
      return;
    }
    this.credentialService.getCredential(cred.id).subscribe({
      next: (credential) => {
        if (credential) {
          // Aquí puedes abrir un modal o navegar a la vista
          console.log('Credencial:', credential);
          alert('Ver credencial: ' + credential.title);
        } else {
          alert('Credencial no encontrada.');
        }
      },
      error: (err) => console.error('Error al obtener credencial:', err)
    });
  }

  getOrganizationName(id: string): string {
    const org = this.organizations.find(o => o.id === id);
    return org ? org.name : 'Desconocida';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'certificate': 'Certificado',
      'diploma': 'Diploma',
      'badge': 'Insignia',
      'award': 'Premio',
      'mention': 'Mención',
      'accreditation': 'Acreditación',
      'participation': 'Participación'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'draft': 'Borrador',
      'issued': 'Emitida',
      'sent': 'Enviada',
      'viewed': 'Vista',
      'revoked': 'Revocada',
      'expired': 'Expirada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'issued': return 'status-issued';
      case 'sent': return 'status-sent';
      case 'viewed': return 'status-viewed';
      case 'revoked': return 'status-revoked';
      case 'expired': return 'status-expired';
      default: return 'status-draft';
    }
  }
}