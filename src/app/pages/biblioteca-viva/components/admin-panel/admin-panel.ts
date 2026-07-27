import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { CredentialService } from '../../../../core/services/credential.service';
import { Credential } from '../../../../core/models/credential.model';
import { EmailService, CredentialEmailData } from '../../../../core/services/email.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit {
  // ============================
  //  ESTADO DE PESTAÑAS
  // ============================
  activeTab: 'pending' | 'published' = 'pending';
  loading = true;

  // ============================
  //  DATOS PRINCIPALES
  // ============================
  allProjects: Project[] = [];
  pendingProjects: Project[] = [];
  publishedProjects: Project[] = [];
  credentials: Credential[] = [];
  credentialMap = new Map<string, Credential>();

  reviewNotes: Record<string, string> = {};

  // ============================
  //  CONTADORES
  // ============================
  get pendingCount(): number { return this.pendingProjects.length; }
  get publishedCount(): number { return this.publishedProjects.length; }
  get issuedCount(): number { return this.credentials.filter(c => c.status === 'issued' || c.status === 'sent').length; }
  get pendingEmissionCount(): number { return this.publishedProjects.filter(p => !this.hasCredential(p.id)).length; }

  // ============================
  //  MODAL DE EMISIÓN
  // ============================
  showEmitModal = false;
  selectedProjectForEmit: Project | null = null;
  recognitionOptions = [
    { value: 'Mejor Diseño', icon: '🎨', selected: false },
    { value: 'Innovación', icon: '💡', selected: false },
    { value: 'Inteligencia Artificial', icon: '🤖', selected: false },
    { value: 'Impacto Social', icon: '🌍', selected: false },
    { value: 'Excelencia Técnica', icon: '⚡', selected: false },
    { value: 'Mención Honorífica', icon: '🏅', selected: false },
    { value: 'Premio del Público', icon: '👥', selected: false }
  ];
  isEmitting = false;
  modalError = '';
  previewCredential: any = null;
  showFullPreview = false;

  // ============================
  //  MODAL DE VISUALIZACIÓN
  // ============================
  showViewCredentialModal = false;
  selectedCredentialForView: Credential | null = null;
  selectedProjectForView: Project | null = null;

  // ============================
  //  NOTIFICACIONES
  // ============================
  notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  constructor(
    private projectService: ProjectService,
    private credentialService: CredentialService,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ============================
  //  CARGA DE DATOS
  // ============================
  loadData(): void {
    this.loading = true;
    this.cdr.detectChanges();

    combineLatest([
      this.projectService.getProjects(),
      this.credentialService.getCredentials()
    ]).subscribe({
      next: ([projects, credentials]) => {
        const converted = projects.map(p => ({
          ...p,
          uploadedAt: this.toDate(p.uploadedAt),
          updatedAt: this.toDate(p.updatedAt)
        }));

        this.allProjects = converted;
        this.pendingProjects = converted.filter(p => p.status === 'pending');
        this.publishedProjects = converted.filter(p => p.status === 'published');

        this.credentials = credentials;
        this.credentialMap = new Map();
        credentials.forEach(c => {
          if (c.projectId) this.credentialMap.set(c.projectId, c);
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
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

  // ============================
  //  UTILIDADES
  // ============================
  hasCredential(projectId?: string): boolean {
    if (!projectId) return false;
    return this.credentialMap.has(projectId);
  }

  getCredentialForProject(projectId?: string): Credential | undefined {
    if (!projectId) return undefined;
    return this.credentialMap.get(projectId);
  }

  setTab(tab: 'pending' | 'published'): void {
    this.activeTab = tab;
  }

  // ============================
  //  ACCIONES: PENDIENTES
  // ============================
  viewProject(project: Project): void {
    if (!project.htmlContent) {
      this.showNotification('Este proyecto no tiene contenido HTML.', 'error');
      return;
    }
    const blob = new Blob([project.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  publishProject(project: Project): void {
    if (!project.id) return;
    const note = this.reviewNotes[project.id] || '';
    this.projectService.updateStatus(project.id, 'published', note).subscribe({
      next: () => {
        this.showNotification('✅ Proyecto publicado correctamente.', 'success');
        delete this.reviewNotes[project.id!];
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Error al publicar el proyecto.', 'error');
      }
    });
  }

  requestChanges(project: Project): void {
    if (!project.id) return;
    const note = this.reviewNotes[project.id] || '';
    if (!note.trim()) {
      this.showNotification('Por favor, escribe un comentario indicando los cambios solicitados.', 'error');
      return;
    }
    this.projectService.updateStatus(project.id, 'rejected', note).subscribe({
      next: () => {
        this.showNotification('🔄 Cambios solicitados al desarrollador.', 'info');
        delete this.reviewNotes[project.id!];
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Error al solicitar cambios.', 'error');
      }
    });
  }

  // ============================
  //  ACCIONES: PUBLICADAS
  // ============================
  viewPublishedProject(project: Project): void {
    this.viewProject(project);
  }

  // ============================
  //  EMITIR CREDENCIAL (con correo automático)
  // ============================
  openEmitModal(project: Project): void {
    this.selectedProjectForEmit = project;
    this.recognitionOptions.forEach(opt => opt.selected = false);
    this.modalError = '';
    this.previewCredential = null;
    this.showFullPreview = false;
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
    if (!this.selectedProjectForEmit) return;
    const recognitions = this.selectedRecognitions;
    const recognitionText = recognitions.length > 0
      ? recognitions.join(' · ')
      : 'Sin reconocimientos';

    this.previewCredential = {
      title: `Diploma de Participación - ${this.selectedProjectForEmit.title}`,
      studentName: this.selectedProjectForEmit.studentName,
      studentEmail: this.selectedProjectForEmit.studentEmail,
      institution: this.selectedProjectForEmit.institution,
      category: this.selectedProjectForEmit.category,
      recognition: recognitionText,
      issueDate: new Date(),
      projectTitle: this.selectedProjectForEmit.title
    };
  }

  toggleFullPreview(): void {
    this.showFullPreview = !this.showFullPreview;
  }

  emitCredential(): void {
    if (!this.selectedProjectForEmit) {
      this.modalError = 'No hay proyecto seleccionado.';
      return;
    }

    this.isEmitting = true;
    this.modalError = '';

    const credentialData: Partial<Credential> = {
      title: `Diploma de Participación - ${this.selectedProjectForEmit.title}`,
      description: this.selectedProjectForEmit.description || '',
      userId: this.selectedProjectForEmit.studentEmail || '',
      projectId: this.selectedProjectForEmit.id,
      organizationId: this.selectedProjectForEmit.institution || 'default-org',
      institutionId: this.selectedProjectForEmit.institution || 'default-inst',
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

            // Obtener la credencial completa para enviar correo
            this.credentialService.getCredential(id).subscribe({
              next: (cred) => {
                if (cred && this.selectedProjectForEmit) {
                  const emailData: CredentialEmailData = {
                    toEmail: this.selectedProjectForEmit.studentEmail || 'hensonmedina2@gmail.com',
                    toName: this.selectedProjectForEmit.studentName || 'Estudiante',
                    projectTitle: this.selectedProjectForEmit.title || 'Proyecto',
                    credentialNumber: cred.credentialNumber || '',
                    verificationCode: cred.verificationCode || '',
                    verificationUrl: `https://tellus.ruralsteamlab.com/verificar/${cred.uuid}`,
                    issueDate: new Date().toLocaleDateString('es-ES'),
                    recognition: cred.recognition || 'Participación',
                    institution: this.selectedProjectForEmit.institution || 'Institución'
                  };

                  if (!this.selectedProjectForEmit.studentEmail) {
                    this.showNotification('⚠️ El proyecto no tiene email. Se usará el correo de fallback.', 'info');
                  }

                  this.emailService.sendCredentialEmail(emailData)
                    .then(success => {
                      if (success) {
                        this.credentialService.markEmailSent(cred.id!).subscribe();
                        this.showNotification('✅ Credencial emitida y correo enviado.', 'success');
                      } else {
                        this.credentialService.markEmailFailed(cred.id!, 'Error al enviar correo').subscribe();
                        this.showNotification('⚠️ Credencial emitida, pero el correo no pudo enviarse.', 'error');
                      }
                    })
                    .catch(err => {
                      this.credentialService.markEmailFailed(cred.id!, err.message).subscribe();
                      this.showNotification('⚠️ Credencial emitida, pero el correo falló.', 'error');
                    });
                } else {
                  this.showNotification('✅ Credencial emitida correctamente.', 'success');
                }
              },
              error: () => {
                this.showNotification('✅ Credencial emitida, pero no se pudo obtener el detalle.', 'info');
              }
            });

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
    this.selectedProjectForEmit = null;
    this.previewCredential = null;
    this.modalError = '';
    this.isEmitting = false;
    this.showFullPreview = false;
  }

  // ============================
  //  VER CREDENCIAL (con estado del correo)
  // ============================
  viewCredential(project: Project): void {
    const credential = this.getCredentialForProject(project.id);
    if (!credential) {
      this.showNotification('No se encontró la credencial para este proyecto.', 'error');
      return;
    }
    this.selectedProjectForView = project;
    this.selectedCredentialForView = credential;
    this.showViewCredentialModal = true;
  }

  closeViewCredentialModal(): void {
    this.showViewCredentialModal = false;
    this.selectedProjectForView = null;
    this.selectedCredentialForView = null;
  }

  // ============================
  //  REENVIAR CORREO
  // ============================
  async resendEmail(): Promise<void> {
    if (!this.selectedProjectForView || !this.selectedCredentialForView) {
      this.showNotification('No hay proyecto o credencial seleccionada.', 'error');
      return;
    }

    const project = this.selectedProjectForView;
    const cred = this.selectedCredentialForView;

    const emailData: CredentialEmailData = {
      toEmail: project.studentEmail || 'hensonmedina2@gmail.com',
      toName: project.studentName || 'Estudiante',
      projectTitle: project.title || 'Proyecto',
      credentialNumber: cred.credentialNumber || '',
      verificationCode: cred.verificationCode || '',
      verificationUrl: `https://tellus.ruralsteamlab.com/verificar/${cred.uuid}`,
      issueDate: new Date().toLocaleDateString('es-ES'),
      recognition: cred.recognition || 'Participación',
      institution: project.institution || 'Institución'
    };

    if (!project.studentEmail) {
      this.showNotification('⚠️ El proyecto no tiene email. Se usará el correo de fallback.', 'info');
    }

    this.showNotification('📧 Reenviando correo...', 'info');

    const success = await this.emailService.sendCredentialEmail(emailData);
    if (success) {
      this.credentialService.markEmailSent(cred.id!).subscribe();
      this.showNotification('✅ Correo reenviado correctamente.', 'success');
      this.loadData();
    } else {
      this.credentialService.markEmailFailed(cred.id!, 'Error al reenviar').subscribe();
      this.showNotification('❌ Error al reenviar el correo.', 'error');
    }
  }

  // ============================
  //  GENERAR PDF DEL DIPLOMA
  // ============================
  async downloadPDF(project: Project, credential: Credential): Promise<void> {
    try {
      // Mostrar notificación de carga
      this.showNotification('📄 Generando PDF...', 'info');

      // 1. Crear un contenedor temporal con el diploma
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.background = '#fdf8f0';
      container.style.padding = '30px';
      container.style.fontFamily = 'Georgia, serif';
      container.innerHTML = `
        <div style="border: 3px double #b8944a; border-radius: 12px; padding: 30px; background: #fffcf5; text-align: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0d5c0; padding-bottom: 8px; margin-bottom: 16px;">
            <span style="font-weight: 600; letter-spacing: 1px; color: #5a4a30;">Rural STEAM Lab</span>
            <span style="background: #f0e6d0; padding: 2px 12px; border-radius: 20px; color: #5a4a30;">🏆 ${project.category || ''}</span>
          </div>
          <h1 style="font-size: 32px; font-weight: 700; color: #2a1f0c; margin: 8px 0;">Diploma de Participación</h1>
          <p style="font-size: 18px; color: #5a4a30; font-style: italic; padding: 8px 0; border-top: 1px solid #e0d5c0; border-bottom: 1px solid #e0d5c0;">
            ${credential.recognition || 'Sin reconocimientos'}
          </p>
          <div style="margin: 20px 0;">
            <span style="display: block; font-size: 12px; color: #8a7a60; text-transform: uppercase; letter-spacing: 2px;">Otorgado a</span>
            <span style="display: block; font-size: 36px; font-weight: 700; color: #1a1005; font-family: 'Georgia', serif;">${project.studentName || ''}</span>
          </div>
          <div style="display: flex; justify-content: space-around; margin: 16px 0; font-size: 14px; color: #5a4a30;">
            <div><span style="display: block; font-size: 11px; text-transform: uppercase; color: #8a7a60;">Proyecto</span><strong>${project.title || ''}</strong></div>
            <div><span style="display: block; font-size: 11px; text-transform: uppercase; color: #8a7a60;">Institución</span><strong>${project.institution || ''}</strong></div>
            <div><span style="display: block; font-size: 11px; text-transform: uppercase; color: #8a7a60;">Fecha</span><strong>${new Date().toLocaleDateString('es-ES')}</strong></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; border-top: 1px solid #e0d5c0; padding-top: 16px;">
            <div style="text-align: center;">
              <div style="width: 120px; height: 1px; border-bottom: 2px solid #2a1f0c; margin: 0 auto 4px;"></div>
              <span style="font-size: 11px; color: #8a7a60; letter-spacing: 1px;">Firma del Director</span>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">📜</div>
              <span style="font-size: 11px; color: #8a7a60; letter-spacing: 1px;">Sello</span>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #8a7a60; letter-spacing: 1px;">Código de verificación</div>
              <div style="font-size: 12px; font-family: monospace; color: #2a1f0c; font-weight: bold;">${credential.verificationCode?.substring(0, 8) || 'N/A'}</div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // 2. Capturar con html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        height: 600
      });
      document.body.removeChild(container);

      // 3. Generar PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Diploma-${project.title?.replace(/\s+/g, '-') || 'credential'}.pdf`);

      this.showNotification('✅ PDF descargado correctamente.', 'success');

    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.showNotification('❌ Error al generar el PDF. Intenta de nuevo.', 'error');
    }
  }

  // ============================
  //  SISTEMA DE NOTIFICACIONES
  // ============================
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.notification = { message, type };
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notification = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  closeNotification(): void {
    this.notification = null;
  }
}