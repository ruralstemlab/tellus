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
  //  GENERAR PDF DEL CERTIFICADO (VERSIÓN OFICIAL - ESTILO IMAGEN)
  // ================================================================
  async downloadPDF(project: Project, credential: Credential): Promise<void> {
    try {
      this.showNotification('📄 Generando certificado oficial...', 'info');

      // Fechas seguras
      const issueDate = credential.issueDate ? new Date(credential.issueDate) : new Date();
      const formattedDate = issueDate.toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      // ID de certificado (usar credentialNumber o generar uno)
      const certId = credential.credentialNumber || `RSL-${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}${String(issueDate.getDate()).padStart(2, '0')}-${String(project.id?.slice(0, 6) || '000001').toUpperCase()}`;

      // Código de verificación (tomar los primeros 14 caracteres con guiones)
      const verifCode = credential.verificationCode || 'A1B2-C3D4-E5F6';

      // Reconocimiento (si no hay, usar texto genérico)
      const recognition = credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA';

      // 1. Crear un contenedor temporal con el diseño de certificado oficial
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '900px';
      container.style.background = '#ffffff';
      container.style.padding = '40px 50px';
      container.style.fontFamily = 'Georgia, "Times New Roman", serif';
      container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';

      container.innerHTML = `
        <div style="border: 3px double #1a2e1a; border-radius: 8px; padding: 30px 40px; background: #fffcf9; text-align: center;">

          <!-- Encabezado: Rural STEAM Lab + eslogan -->
          <div style="margin-bottom: 12px;">
            <div style="font-size: 2.2rem; font-weight: 700; color: #1a2e1a; letter-spacing: 3px; text-transform: uppercase; font-family: 'Georgia', serif;">
              Rural STEAM Lab
            </div>
            <div style="font-size: 0.9rem; color: #5a7a5a; letter-spacing: 8px; text-transform: uppercase; font-weight: 600; margin-top: 2px;">
              Colombia
            </div>
            <div style="font-size: 0.8rem; color: #2a4a2a; letter-spacing: 3px; text-transform: uppercase; font-weight: 500; margin-top: 6px; border-top: 1px solid #d4c8b0; padding-top: 6px; display: inline-block; padding-left: 20px; padding-right: 20px;">
              INVESTIGA · INNOVA · TRANSFORMA
            </div>
          </div>

          <!-- Línea divisoria -->
          <hr style="border: none; border-top: 2px solid #1a2e1a; margin: 12px 0 20px 0; width: 60%;">

          <!-- Título principal: CERTIFICA QUE -->
          <div style="font-size: 1.6rem; font-weight: 700; color: #1a2e1a; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 16px 0;">
            CERTIFICA QUE
          </div>

          <!-- Nombre del participante -->
          <div style="font-size: 2.6rem; font-weight: 700; color: #0a1a0a; font-family: 'Georgia', serif; letter-spacing: 1px; margin: 8px 0;">
            ${project.studentName || 'Nombre del Participante'}
          </div>

          <!-- Texto de logro -->
          <div style="font-size: 1.1rem; color: #2a3a2a; margin: 16px 0 8px 0; line-height: 1.6;">
            ha desarrollado y publicado exitosamente el proyecto
          </div>

          <!-- Nombre del proyecto -->
          <div style="font-size: 1.8rem; font-weight: 700; color: #1a2e1a; font-style: italic; font-family: 'Georgia', serif; margin: 6px 0 12px 0; border-bottom: 1px solid #d4c8b0; padding-bottom: 10px; display: inline-block;">
            "${project.title || 'Nombre del Proyecto'}"
          </div>

          <div style="font-size: 1.0rem; color: #3a4a3a; margin: 12px 0 8px 0;">
            en el <strong>Ecosistema Tellus</strong>, demostrando creatividad, compromiso, pensamiento científico y espíritu de innovación.
          </div>

          <!-- Reconocimiento oficial -->
          <div style="font-size: 1.1rem; font-weight: 700; color: #1a2e1a; letter-spacing: 2px; text-transform: uppercase; margin: 18px 0 12px 0; padding: 8px 20px; border: 1px solid #1a2e1a; display: inline-block;">
            ${recognition}
          </div>

          <!-- Fecha de emisión -->
          <div style="font-size: 1.0rem; color: #3a4a3a; margin: 16px 0 20px 0;">
            Emitido el <strong>${formattedDate}</strong>
          </div>

          <!-- Firmas (tres líneas) -->
          <div style="display: flex; justify-content: space-around; align-items: flex-end; margin: 24px 0 20px 0; padding-top: 16px; border-top: 1px solid #d4c8b0;">
            <div style="text-align: center; flex: 1;">
              <div style="width: 160px; height: 1px; border-bottom: 2px solid #1a2e1a; margin: 0 auto 6px;"></div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #1a2e1a; letter-spacing: 0.5px;">Henson Alberto Medina Castillo</div>
              <div style="font-size: 0.65rem; color: #5a7a5a; text-transform: uppercase; letter-spacing: 1px;">Liderazgo Tecnológico y Desarrollo</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 160px; height: 1px; border-bottom: 2px solid #1a2e1a; margin: 0 auto 6px;"></div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #1a2e1a; letter-spacing: 0.5px;">Uberto Manuel Gómez López</div>
              <div style="font-size: 0.65rem; color: #5a7a5a; text-transform: uppercase; letter-spacing: 1px;">Liderazgo Académico e Investigación</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 160px; height: 1px; border-bottom: 2px solid #1a2e1a; margin: 0 auto 6px;"></div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #1a2e1a; letter-spacing: 0.5px;">Diana Marcela Alfonso Montañez</div>
              <div style="font-size: 0.65rem; color: #5a7a5a; text-transform: uppercase; letter-spacing: 1px;">Liderazgo de Implementación y Calidad</div>
            </div>
          </div>

          <!-- ID y Código de verificación (dos columnas) -->
          <div style="display: flex; justify-content: center; gap: 40px; margin: 16px 0 12px 0; padding-top: 12px; border-top: 1px solid #d4c8b0;">
            <div style="text-align: center;">
              <div style="font-size: 0.65rem; color: #5a7a5a; text-transform: uppercase; letter-spacing: 1px;">ID de Certificado</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a2e1a; font-family: 'Courier New', monospace;">${certId}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 0.65rem; color: #5a7a5a; text-transform: uppercase; letter-spacing: 1px;">Código de Verificación</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a2e1a; font-family: 'Courier New', monospace; letter-spacing: 1px;">${verifCode}</div>
            </div>
          </div>

          <!-- Pie: URL y Ecosistema Tellus -->
          <div style="font-size: 0.8rem; color: #5a7a5a; margin-top: 14px; padding-top: 10px; border-top: 1px solid #d4c8b0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500;">VERIFICA ESTE CERTIFICADO EN</span>
            <span style="font-weight: 700; color: #1a2e1a; letter-spacing: 0.5px;">tellus.ruralsteamlab.com/verificar</span>
            <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">ECOSISTEMA TELLUS</span>
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
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight
      });
      document.body.removeChild(container);

      // 3. Generar PDF en orientación vertical (retrato)
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificado-${project.title?.replace(/\s+/g, '-') || 'certificado'}.pdf`);

      this.showNotification('✅ Certificado oficial descargado correctamente.', 'success');

    } catch (error) {
      console.error('Error al generar certificado:', error);
      this.showNotification('❌ Error al generar el certificado. Intenta de nuevo.', 'error');
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