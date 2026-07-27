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

      <!-- Certificado Oficial (vista previa y PDF unificados) -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <!-- Contenedor del certificado (se usa tanto para vista como para PDF) -->
        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">
              <!-- Encabezado con STEAM multicolor -->
              <div class="cert-header">
                <div class="org-name">
                  Rural 
                  <span class="steam-color">
                    <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                  </span>
                  Lab
                </div>
                <div class="org-country">Colombia</div>
                <div class="org-slogan">INVESTIGA · INNOVA · TRANSFORMA</div>
              </div>

              <hr class="cert-divider">

              <div class="cert-title">CERTIFICA QUE</div>

              <div class="cert-student-name">{{ project.studentName || 'Nombre del Participante' }}</div>

              <div class="cert-description">
                ha desarrollado y publicado exitosamente el proyecto
              </div>

              <div class="cert-project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>

              <div class="cert-text">
                en el <strong>Ecosistema Tellus</strong>, demostrando creatividad, compromiso, pensamiento científico y espíritu de innovación.
              </div>

              <div class="cert-recognition">
                {{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}
              </div>

              <div class="cert-date">
                Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong>
              </div>

              <!-- Firmas -->
              <div class="cert-signatures">
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Henson Alberto Medina Castillo</div>
                  <div class="sign-role">Liderazgo Tecnológico y Desarrollo</div>
                </div>
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Uberto Manuel Gómez López</div>
                  <div class="sign-role">Liderazgo Académico e Investigación</div>
                </div>
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Diana Marcela Alfonso Montañez</div>
                  <div class="sign-role">Liderazgo de Implementación y Calidad</div>
                </div>
              </div>

              <!-- ID y Código -->
              <div class="cert-footer">
                <div class="cert-id">
                  <span class="label">ID de Certificado</span>
                  <span class="value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="cert-code">
                  <span class="label">Código de Verificación</span>
                  <span class="value">{{ credential.verificationCode || 'A1B2-C3D4-E5F6' }}</span>
                </div>
              </div>

              <!-- Pie -->
              <div class="cert-bottom">
                <span>VERIFICA ESTE CERTIFICADO EN</span>
                <span class="url">tellus.ruralsteamlab.com/verificar</span>
                <span>ECOSISTEMA TELLUS</span>
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
         CONTENEDOR PRINCIPAL (fondo oscuro)
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
        max-width: 820px;
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
         CERTIFICADO OFICIAL (vista previa)
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .certificate-wrapper {
        background: #ffffff;
        padding: 30px 20px;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        width: 100%;
        max-width: 750px;
      }
      .certificate {
        border: 3px double #1a2e1a;
        border-radius: 8px;
        padding: 30px 35px;
        background: #fffcf9;
        text-align: center;
        font-family: Georgia, 'Times New Roman', serif;
        color: #1a2e1a;
      }

      /* --- Encabezado --- */
      .cert-header .org-name {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
      }
      .org-name .steam-color {
        font-weight: 800;
      }
      .org-name .s { color: #1976d2; }  /* Azul */
      .org-name .t { color: #00bcd4; }  /* Celeste */
      .org-name .e { color: #fdd835; }  /* Amarillo */
      .org-name .a { color: #f57c00; }  /* Naranja */
      .org-name .m { color: #388e3c; }  /* Verde */

      .cert-header .org-country {
        font-size: 0.9rem;
        color: #5a7a5a;
        letter-spacing: 8px;
        text-transform: uppercase;
        font-weight: 600;
        margin-top: 2px;
      }
      .cert-header .org-slogan {
        font-size: 0.8rem;
        color: #2a4a2a;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-weight: 500;
        margin-top: 6px;
        border-top: 1px solid #d4c8b0;
        padding-top: 6px;
        display: inline-block;
        padding-left: 20px;
        padding-right: 20px;
      }

      .cert-divider {
        border: none;
        border-top: 2px solid #1a2e1a;
        margin: 12px 0 20px 0;
        width: 60%;
      }

      .cert-title {
        font-size: 1.6rem;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        margin: 8px 0 16px 0;
      }

      .cert-student-name {
        font-size: 2.6rem;
        font-weight: 700;
        color: #0a1a0a;
        letter-spacing: 1px;
        margin: 8px 0;
      }

      .cert-description {
        font-size: 1.1rem;
        color: #2a3a2a;
        margin: 16px 0 8px 0;
        line-height: 1.6;
      }

      .cert-project-name {
        font-size: 1.8rem;
        font-weight: 700;
        font-style: italic;
        margin: 6px 0 12px 0;
        border-bottom: 1px solid #d4c8b0;
        padding-bottom: 10px;
        display: inline-block;
      }

      .cert-text {
        font-size: 1.0rem;
        color: #3a4a3a;
        margin: 12px 0 8px 0;
      }

      .cert-recognition {
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 18px 0 12px 0;
        padding: 8px 20px;
        border: 1px solid #1a2e1a;
        display: inline-block;
      }

      .cert-date {
        font-size: 1.0rem;
        color: #3a4a3a;
        margin: 16px 0 20px 0;
      }

      /* --- Firmas --- */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin: 24px 0 20px 0;
        padding-top: 16px;
        border-top: 1px solid #d4c8b0;
        flex-wrap: wrap;
        gap: 20px;
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 140px;
      }
      .sign-line {
        width: 160px;
        height: 1px;
        border-bottom: 2px solid #1a2e1a;
        margin: 0 auto 6px;
      }
      .sign-name {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .sign-role {
        font-size: 0.65rem;
        color: #5a7a5a;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* --- ID y Código --- */
      .cert-footer {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin: 16px 0 12px 0;
        padding-top: 12px;
        border-top: 1px solid #d4c8b0;
        flex-wrap: wrap;
      }
      .cert-id, .cert-code {
        text-align: center;
      }
      .cert-footer .label {
        font-size: 0.65rem;
        color: #5a7a5a;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: block;
      }
      .cert-footer .value {
        font-size: 0.95rem;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        display: block;
        margin-top: 2px;
      }

      /* --- Pie --- */
      .cert-bottom {
        font-size: 0.8rem;
        color: #5a7a5a;
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid #d4c8b0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .cert-bottom .url {
        font-weight: 700;
        color: #1a2e1a;
        letter-spacing: 0.5px;
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
        .certificate-wrapper {
          padding: 15px 10px;
        }
        .certificate {
          padding: 20px 15px;
        }
        .cert-header .org-name {
          font-size: 1.6rem;
        }
        .cert-title {
          font-size: 1.2rem;
        }
        .cert-student-name {
          font-size: 2rem;
        }
        .cert-project-name {
          font-size: 1.4rem;
        }
        .sign-line {
          width: 100px;
        }
        .cert-footer {
          gap: 20px;
        }
        .cert-bottom {
          flex-direction: column;
          text-align: center;
        }
        .cert-signatures {
          flex-direction: column;
          align-items: center;
        }
        .signature {
          min-width: auto;
          width: 100%;
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

  // ================================================================
  //  MÉTODOS AUXILIARES PARA EL CERTIFICADO
  // ================================================================
  getFormattedDate(dateValue: any): string {
    if (!dateValue) return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const date = new Date(dateValue);
    return `${date.getDate().toString().padStart(2, '0')} de ${date.toLocaleString('es-ES', { month: 'long' })} de ${date.getFullYear()}`;
  }

  getCertId(credential: Credential, project: Project): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const suffix = project.id?.slice(0, 6).toUpperCase() || '000001';
    return `RSL-${year}-${month}${day}-${suffix}`;
  }

  // ================================================================
  //  GENERAR PDF (capturando el mismo contenedor visible)
  // ================================================================
  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }
    try {
      console.log('📄 [PublicVerification] Generando certificado oficial...');
      const container = document.getElementById('certificate-container');
      if (!container) throw new Error('Contenedor no encontrado');

      // Capturar el contenedor (escala alta)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificado-${this.project.title.replace(/\s+/g, '-')}.pdf`);

      console.log('✅ [PublicVerification] PDF descargado');
    } catch (error) {
      console.error('❌ [PublicVerification] Error al generar PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  }
}