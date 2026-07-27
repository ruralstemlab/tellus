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

  // ================================================================
  //  GENERAR PDF DEL DIPLOMA (VERSIÓN PREMIUM TELLUS)
  // ================================================================
  async downloadPDF(project: Project, credential: Credential): Promise<void> {
    try {
      this.showNotification('📄 Generando PDF premium...', 'info');

      // Fechas seguras
      const issueDate = credential.issueDate ? new Date(credential.issueDate) : new Date();
      const formattedDate = issueDate.toLocaleDateString('es-ES');
      const year = issueDate.getFullYear();

      // 1. Crear un contenedor temporal con el diseño premium
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.background = '#fcf9f3';
      container.style.padding = '20px';
      container.style.fontFamily = 'Georgia, serif';
      container.style.borderRadius = '24px';
      container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)';

      container.innerHTML = `
        <div style="border: 2px solid #d4af37; border-radius: 16px; padding: 28px 32px; background: rgba(255,255,255,0.92); text-align: center; position: relative;">
          <!-- Encabezado -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(212,175,55,0.2); margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
              <span style="font-size: 1.1rem; font-weight: 700; color: #1a2e1a; letter-spacing: 0.5px; font-family: 'Georgia', serif;">Rural STEAM Lab</span>
              <span style="font-size: 0.65rem; color: #5a7a5a; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">🌱 Colombia</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(212,175,55,0.08); padding: 4px 14px 4px 10px; border-radius: 40px; border: 1px solid rgba(212,175,55,0.15);">
              <span style="font-size: 0.9rem;">🏆</span>
              <span style="font-size: 0.7rem; font-weight: 600; color: #5a4a2a; text-transform: uppercase; letter-spacing: 0.5px;">${project.category || 'Concurso'}</span>
            </div>
          </div>

          <!-- Línea decorativa -->
          <div style="width: 80px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 0 auto 16px; border-radius: 2px;"></div>

          <!-- Título -->
          <h1 style="font-size: 2rem; font-weight: 700; color: #1a2e1a; margin: 4px 0 8px; font-family: 'Georgia', serif; letter-spacing: 1px;">Diploma de Participación</h1>

          <!-- Reconocimiento -->
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 1rem; color: #d4af37; font-weight: 600; padding: 4px 16px; border: 1px solid rgba(212,175,55,0.15); border-radius: 40px; background: rgba(212,175,55,0.04); margin-bottom: 16px;">
            <span style="font-size: 1rem;">⭐</span> ${credential.recognition || 'Participación'}
          </div>

          <!-- Destinatario -->
          <div style="margin: 12px 0 8px;">
            <span style="display: block; font-size: 0.7rem; color: #8a7a6a; text-transform: uppercase; letter-spacing: 2px; font-weight: 500;">Otorgado a</span>
            <span style="display: block; font-size: 2.4rem; font-weight: 700; color: #1a2e1a; font-family: 'Georgia', serif; letter-spacing: 1px; line-height: 1.2;">${project.studentName || 'Estudiante'}</span>
          </div>

          <!-- Proyecto -->
          <div style="margin: 8px 0 16px;">
            <span style="display: block; font-size: 0.7rem; color: #8a7a6a; text-transform: uppercase; letter-spacing: 2px; font-weight: 500;">Por su proyecto</span>
            <span style="font-size: 1.1rem; font-weight: 600; color: #2a3a2a; font-style: italic;">“${project.title || ''}”</span>
          </div>

          <!-- Detalles -->
          <div style="display: flex; justify-content: center; gap: 24px; margin: 16px 0 8px; flex-wrap: wrap;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span style="font-size: 1.2rem;">🏫</span>
              <span style="font-size: 0.6rem; text-transform: uppercase; color: #8a7a6a; letter-spacing: 1px; font-weight: 500;">Institución</span>
              <span style="font-size: 0.8rem; font-weight: 500; color: #1a2a1a;">${project.institution || ''}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span style="font-size: 1.2rem;">📅</span>
              <span style="font-size: 0.6rem; text-transform: uppercase; color: #8a7a6a; letter-spacing: 1px; font-weight: 500;">Fecha</span>
              <span style="font-size: 0.8rem; font-weight: 500; color: #1a2a1a;">${formattedDate}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span style="font-size: 1.2rem;">🔑</span>
              <span style="font-size: 0.6rem; text-transform: uppercase; color: #8a7a6a; letter-spacing: 1px; font-weight: 500;">Código</span>
              <span style="font-size: 0.85rem; font-weight: 600; color: #2a4a2a; background: rgba(76,255,156,0.04); padding: 2px 8px; border-radius: 4px; font-family: 'Courier New', monospace;">${credential.verificationCode?.substring(0, 8) || 'N/A'}</span>
            </div>
          </div>

          <!-- Línea decorativa corta -->
          <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 20px auto 16px; border-radius: 2px;"></div>

          <!-- Firmas y Sello -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 8px; padding-top: 12px; gap: 16px; flex-wrap: wrap; border-top: 1px solid rgba(212,175,55,0.08);">
            <div style="text-align: center; flex: 1; min-width: 80px;">
              <div style="width: 100px; height: 1px; border-bottom: 2px solid #1a2e1a; margin: 0 auto 4px; opacity: 0.6;"></div>
              <span style="font-size: 0.6rem; color: #8a7a6a; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">Firma del Director</span>
            </div>
            <div style="text-align: center; flex: 0 0 auto; margin: 0 8px;">
              <div style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #d4af37; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; background: rgba(212,175,55,0.04);">
                <span style="font-size: 1.6rem;">🌿</span>
              </div>
              <span style="font-size: 0.6rem; color: #8a7a6a; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">Sello Oficial</span>
            </div>
            <div style="text-align: center; flex: 1; min-width: 80px;">
              <div style="width: 100px; height: 1px; border-bottom: 2px solid #1a2e1a; margin: 0 auto 4px; opacity: 0.6;"></div>
              <span style="font-size: 0.6rem; color: #8a7a6a; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">Firma del Rector</span>
            </div>
          </div>

          <!-- Pie de página -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(212,175,55,0.08); font-size: 0.7rem; color: #8a7a6a; letter-spacing: 0.5px;">
            <span style="font-weight: 500; color: #1a2e1a;">Tellus · Biblioteca Viva</span>
            <span style="font-weight: 300; color: #8a7a6a;">${year}</span>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Esperamos un tick para que el DOM se pinte
      await new Promise(resolve => setTimeout(resolve, 100));

      // 2. Capturar con html2canvas (alta calidad)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        height: container.scrollHeight,
        backgroundColor: '#fcf9f3'
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

      this.showNotification('✅ PDF premium descargado correctamente.', 'success');

    } catch (error) {
      console.error('Error al generar PDF premium:', error);
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