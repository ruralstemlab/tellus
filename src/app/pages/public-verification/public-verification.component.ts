import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialService } from '../../core/services/credential.service';
import { Credential } from '../../core/models/credential.model';
import { ProjectService } from '../biblioteca-viva/services/project.service';
import { Project } from '../biblioteca-viva/models/project.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-public-verification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verification-container">
      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Verificando credencial...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error && !loading" class="error-state">
        <span class="error-icon">🔍</span>
        <h2>{{ errorTitle || 'Credencial no encontrada' }}</h2>
        <p>{{ error }}</p>
        <button class="btn-secondary" (click)="goHome()">Volver al inicio</button>
      </div>

      <!-- Diploma Premium -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <div class="diploma-preview" id="diploma-container">
          <div class="diploma">
            <!-- Fondo decorativo -->
            <div class="diploma-bg"></div>
            <div class="diploma-border">
              <div class="diploma-inner">
                <!-- Encabezado -->
                <div class="diploma-header">
                  <div class="org">
                    <span class="org-name">Rural STEAM Lab</span>
                    <span class="org-tag">🌱 Colombia</span>
                  </div>
                  <div class="badge">
                    <span class="badge-icon">🏆</span>
                    <span class="badge-text">{{ project.category || 'Concurso' }}</span>
                  </div>
                </div>

                <!-- Línea decorativa -->
                <div class="decorative-line"></div>

                <!-- Título -->
                <h1 class="diploma-title">Diploma de Participación</h1>

                <!-- Reconocimiento -->
                <div class="diploma-recognition" *ngIf="credential.recognition">
                  <span class="rec-icon">⭐</span>
                  {{ credential.recognition }}
                </div>

                <!-- Destinatario -->
                <div class="diploma-recipient">
                  <span class="label">Otorgado a</span>
                  <span class="name">{{ project.studentName }}</span>
                </div>

                <!-- Proyecto -->
                <div class="diploma-project">
                  <span class="label">Por su proyecto</span>
                  <span class="project-name">“{{ project.title }}”</span>
                </div>

                <!-- Detalles -->
                <div class="diploma-details">
                  <div class="detail-item">
                    <span class="detail-icon">🏫</span>
                    <span class="detail-label">Institución</span>
                    <span class="detail-value">{{ project.institution }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📅</span>
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">{{ credential.issueDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">🔑</span>
                    <span class="detail-label">Código</span>
                    <span class="detail-value code">{{ credential.verificationCode?.substring(0, 8) || 'N/A' }}</span>
                  </div>
                </div>

                <!-- Línea decorativa -->
                <div class="decorative-line short"></div>

                <!-- Firmas -->
                <div class="diploma-footer">
                  <div class="signature">
                    <div class="sign-line"></div>
                    <span class="sign-label">Firma del Director</span>
                  </div>
                  <div class="seal">
                    <div class="seal-circle">
                      <span class="seal-icon">🌿</span>
                    </div>
                    <span class="seal-label">Sello Oficial</span>
                  </div>
                  <div class="signature">
                    <div class="sign-line"></div>
                    <span class="sign-label">Firma del Rector</span>
                  </div>
                </div>

                <!-- Pie -->
                <div class="diploma-footer-bottom">
                  <span class="footer-org">Tellus · Biblioteca Viva</span>
                  <span class="footer-year">{{ credential.issueDate | date:'yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="btn-primary" (click)="downloadPDF()">📥 Descargar diploma (PDF)</button>
          <button class="btn-secondary" (click)="goHome()">🏠 Ir a Tellus</button>
        </div>

        <div class="footer-text">
          <span>🌿 Verifica esta credencial en cualquier momento en tellus.ruralsteamlab.com/verificar</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* ==========================================================
         CONTENEDOR PRINCIPAL
      ========================================================= */
      .verification-container {
        min-height: 100vh;
        background: linear-gradient(145deg, #0a0a1a 0%, #1a1a3e 100%);
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: #fff;
      }

      /* ==========================================================
         LOADING & ERROR
      ========================================================= */
      .loading-state,
      .error-state {
        text-align: center;
        padding: 40px;
      }
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top-color: #4cff9c;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .error-state .error-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }
      .error-state h2 {
        font-size: 24px;
        margin: 8px 0;
      }
      .error-state p {
        color: rgba(255, 255, 255, 0.6);
      }

      /* ==========================================================
         HEADER
      ========================================================= */
      .credential-found {
        max-width: 720px;
        width: 100%;
      }
      .header {
        text-align: center;
        margin-bottom: 28px;
      }
      .verified-badge {
        display: inline-block;
        background: rgba(76, 255, 156, 0.12);
        border: 1px solid rgba(76, 255, 156, 0.2);
        padding: 4px 16px;
        border-radius: 40px;
        font-size: 13px;
        color: #4cff9c;
        margin-bottom: 8px;
        backdrop-filter: blur(4px);
      }
      .header h1 {
        font-size: 32px;
        margin: 4px 0;
        background: linear-gradient(135deg, #4cff9c 0%, #28a745 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
      }
      .header .subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 300;
      }

      /* ==========================================================
         DIPLOMA – PREMIUM
      ========================================================= */
      .diploma-preview {
        margin: 20px 0;
      }
      .diploma {
        position: relative;
        background: #fcf9f3;
        padding: 20px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
        max-width: 600px;
        margin: 0 auto;
        overflow: hidden;
        transition: transform 0.3s ease;
      }
      .diploma:hover {
        transform: scale(1.01);
      }
      .diploma-bg {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse at 20% 30%, rgba(76, 255, 156, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(255, 215, 0, 0.02) 0%, transparent 50%);
        pointer-events: none;
      }
      .diploma-border {
        position: relative;
        border: 2px solid #d4af37;
        border-radius: 16px;
        padding: 28px 32px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.04);
        backdrop-filter: blur(2px);
      }
      .diploma-inner {
        text-align: center;
        position: relative;
        z-index: 1;
      }

      /* --- Encabezado --- */
      .diploma-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 8px;
      }
      .org {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
      .org-name {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a2e1a;
        letter-spacing: 0.5px;
        font-family: 'Georgia', serif;
      }
      .org-tag {
        font-size: 0.65rem;
        color: #5a7a5a;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 500;
      }
      .badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(212, 175, 55, 0.08);
        padding: 4px 14px 4px 10px;
        border-radius: 40px;
        border: 1px solid rgba(212, 175, 55, 0.15);
      }
      .badge-icon {
        font-size: 0.9rem;
      }
      .badge-text {
        font-size: 0.7rem;
        font-weight: 600;
        color: #5a4a2a;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* --- Línea decorativa --- */
      .decorative-line {
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #d4af37, transparent);
        margin: 0 auto 16px;
        border-radius: 2px;
      }
      .decorative-line.short {
        width: 60px;
        margin: 20px auto 16px;
      }

      /* --- Título --- */
      .diploma-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1a2e1a;
        margin: 4px 0 8px;
        font-family: 'Georgia', serif;
        letter-spacing: 1px;
        background: linear-gradient(180deg, #1a2e1a 0%, #2a4a2a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* --- Reconocimiento --- */
      .diploma-recognition {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 1rem;
        color: #d4af37;
        font-weight: 600;
        padding: 4px 16px;
        border: 1px solid rgba(212, 175, 55, 0.15);
        border-radius: 40px;
        background: rgba(212, 175, 55, 0.04);
        margin-bottom: 16px;
      }
      .rec-icon {
        font-size: 1rem;
      }

      /* --- Destinatario --- */
      .diploma-recipient {
        margin: 12px 0 8px;
      }
      .diploma-recipient .label {
        display: block;
        font-size: 0.7rem;
        color: #8a7a6a;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 500;
      }
      .diploma-recipient .name {
        display: block;
        font-size: 2.4rem;
        font-weight: 700;
        color: #1a2e1a;
        font-family: 'Georgia', serif;
        letter-spacing: 1px;
        line-height: 1.2;
        background: linear-gradient(135deg, #1a2e1a 0%, #2a5a2a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* --- Proyecto --- */
      .diploma-project {
        margin: 8px 0 16px;
      }
      .diploma-project .label {
        display: block;
        font-size: 0.7rem;
        color: #8a7a6a;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 500;
      }
      .diploma-project .project-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2a3a2a;
        font-style: italic;
      }

      /* --- Detalles --- */
      .diploma-details {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin: 16px 0 8px;
        flex-wrap: wrap;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      .detail-icon {
        font-size: 1.2rem;
      }
      .detail-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        color: #8a7a6a;
        letter-spacing: 1px;
        font-weight: 500;
      }
      .detail-value {
        font-size: 0.8rem;
        font-weight: 500;
        color: #1a2a1a;
      }
      .detail-value.code {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #2a4a2a;
        background: rgba(76, 255, 156, 0.04);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
      }

      /* --- Firmas --- */
      .diploma-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 8px;
        padding-top: 12px;
        gap: 16px;
        flex-wrap: wrap;
        border-top: 1px solid rgba(212, 175, 55, 0.08);
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 80px;
      }
      .sign-line {
        width: 100px;
        height: 1px;
        border-bottom: 2px solid #1a2e1a;
        margin: 0 auto 4px;
        opacity: 0.6;
      }
      .sign-label {
        font-size: 0.6rem;
        color: #8a7a6a;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 500;
      }
      .seal {
        text-align: center;
        flex: 0 0 auto;
        margin: 0 8px;
      }
      .seal-circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #d4af37;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 4px;
        background: rgba(212, 175, 55, 0.04);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.04);
      }
      .seal-icon {
        font-size: 1.6rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
      }
      .seal-label {
        font-size: 0.6rem;
        color: #8a7a6a;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 500;
      }

      /* --- Pie --- */
      .diploma-footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid rgba(212, 175, 55, 0.08);
        font-size: 0.7rem;
        color: #8a7a6a;
        letter-spacing: 0.5px;
      }
      .footer-org {
        font-weight: 500;
        color: #1a2e1a;
      }
      .footer-year {
        font-weight: 300;
        color: #8a7a6a;
      }

      /* ==========================================================
         BOTONES
      ========================================================= */
      .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 20px;
      }
      .btn-primary,
      .btn-secondary {
        padding: 12px 28px;
        border: none;
        border-radius: 40px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        text-decoration: none;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .btn-primary {
        background: linear-gradient(135deg, #4cff9c 0%, #28a745 100%);
        color: #0a0a1a;
        box-shadow: 0 4px 20px rgba(76, 255, 156, 0.2);
      }
      .btn-primary:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 30px rgba(76, 255, 156, 0.3);
      }
      .btn-secondary {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.6);
      }
      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .footer-text {
        margin-top: 24px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.2);
        text-align: center;
      }

      /* ==========================================================
         RESPONSIVE
      ========================================================= */
      @media (max-width: 600px) {
        .verification-container {
          padding: 20px 12px;
        }
        .diploma {
          padding: 12px;
        }
        .diploma-border {
          padding: 20px 16px;
        }
        .diploma-title {
          font-size: 1.6rem;
        }
        .diploma-recipient .name {
          font-size: 1.8rem;
        }
        .diploma-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .org {
          align-items: center;
          text-align: center;
        }
        .diploma-details {
          flex-direction: column;
          gap: 10px;
        }
        .diploma-footer {
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .sign-line {
          width: 80px;
        }
        .actions {
          flex-direction: column;
        }
        .btn-primary,
        .btn-secondary {
          width: 100%;
          text-align: center;
        }
        .seal-circle {
          width: 40px;
          height: 40px;
        }
        .seal-icon {
          font-size: 1.2rem;
        }
      }
    `
  ]
})
export class PublicVerificationComponent implements OnInit {
  credential: Credential | null = null;
  project: Project | null = null;
  loading = true;
  error = '';
  errorTitle = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private credentialService: CredentialService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    console.log('🔍 [PublicVerification] UUID recibido:', uuid);
    if (!uuid) {
      this.error = 'No se especificó un código de verificación.';
      this.errorTitle = 'Código faltante';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    this.loadCredential(uuid);
  }

  private loadCredential(uuid: string): void {
    console.log('🔍 [PublicVerification] Buscando credencial con UUID:', uuid);
    this.credentialService.getCredentialByUuid(uuid)
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('❌ [PublicVerification] Error en la petición:', err);
          this.error = '⚠️ Error de conexión. Verifica tu internet e intenta de nuevo.';
          this.errorTitle = 'Error de conexión';
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (cred) => {
          console.log('📄 [PublicVerification] Credencial obtenida:', cred);
          if (!cred) {
            this.error = '❌ Credencial no encontrada. Verifica el código.';
            this.errorTitle = 'No encontrada';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }
          this.credential = cred;
          console.log('✅ [PublicVerification] Credencial cargada, projectId:', cred.projectId);
          this.loadProject(cred.projectId);
        },
        error: (err) => {
          console.error('❌ [PublicVerification] Error al verificar:', err);
          this.error = '⚠️ Error al verificar la credencial. Intenta de nuevo.';
          this.errorTitle = 'Error interno';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private loadProject(projectId: string): void {
    if (!projectId) {
      console.warn('⚠️ [PublicVerification] No hay projectId');
      this.error = 'La credencial no tiene un proyecto asociado.';
      this.errorTitle = 'Proyecto faltante';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    console.log('🔍 [PublicVerification] Buscando proyecto con ID:', projectId);
    this.projectService.getProject(projectId)
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('❌ [PublicVerification] Error al obtener proyecto:', err);
          this.error = '⚠️ Error al cargar el proyecto asociado.';
          this.errorTitle = 'Error al cargar proyecto';
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (project) => {
          console.log('📄 [PublicVerification] Proyecto obtenido:', project);
          if (!project) {
            console.warn('⚠️ [PublicVerification] Proyecto no encontrado con ID:', projectId);
            this.error = 'El proyecto asociado a esta credencial ya no existe.';
            this.errorTitle = 'Proyecto eliminado';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }
          this.project = project;
          this.loading = false;
          console.log('✅ [PublicVerification] Carga completada');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ [PublicVerification] Error al cargar proyecto:', err);
          this.error = '⚠️ Error al cargar el proyecto asociado.';
          this.errorTitle = 'Error al cargar proyecto';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }
    try {
      console.log('📄 [PublicVerification] Generando PDF...');
      const container = document.getElementById('diploma-container');
      if (!container) throw new Error('Contenedor no encontrado');
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fcf9f3'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Diploma-${this.project.title.replace(/\s+/g, '-')}.pdf`);
      console.log('✅ [PublicVerification] PDF descargado');
    } catch (error) {
      console.error('❌ [PublicVerification] Error al generar PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  }
}