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

      <!-- Certificado Premium -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">

              <!-- ===== FONDO PREMIUM ===== -->
              <div class="bg-premium"></div>

              <!-- ===== MARCA DE AGUA ===== -->
              <div class="watermark">
                <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" width="180" height="240">
                  <path d="M100 30 L200 30 L220 90 L240 150 Q240 280 150 280 Q60 280 60 150 L80 90 Z" fill="none" stroke="#1E5631" stroke-width="2"/>
                  <path d="M130 100 Q160 70 190 100 Q160 130 130 100" fill="#1E5631" opacity="0.6"/>
                  <path d="M115 130 Q150 100 185 130 Q150 160 115 130" fill="#1E5631" opacity="0.8"/>
                  <circle cx="70" cy="70" r="4" fill="#1E5631" opacity="0.5"/>
                  <circle cx="230" cy="80" r="3" fill="#1E5631" opacity="0.5"/>
                </svg>
              </div>

              <!-- ===== ENCABEZADO ===== -->
              <div class="cert-header">
                <div class="org">
                  <span class="org-name">
                    Rural <span class="steam-multicolor"><span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span></span> Lab
                  </span>
                  <span class="org-country">COLOMBIA</span>
                  <span class="org-slogan">INVESTIGA · INNOVA · TRANSFORMA</span>
                </div>
                <div class="header-line"></div>
              </div>

              <!-- ===== CUERPO ===== -->
              <div class="cert-body">

                <div class="certifies">CERTIFICA QUE</div>

                <div class="student-name">{{ project.studentName || 'Nombre del Participante' }}</div>

                <div class="project-label">ha desarrollado y publicado exitosamente el proyecto</div>

                <div class="project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>
                <div class="project-line"></div>

                <div class="project-text">
                  en el <strong>Ecosistema Tellus</strong>, demostrando creatividad, pensamiento científico, innovación y compromiso con la transformación digital de la educación.
                </div>

                <div class="recognition">{{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}</div>

              </div>

              <!-- ===== SECCIÓN TÉCNICA ===== -->
              <div class="tech-section">
                <div class="tech-item">
                  <span class="tech-label">ID de Certificado</span>
                  <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">Código de Verificación</span>
                  <span class="tech-value">{{ credential.verificationCode || 'A1B2-C3D4-E5F6' }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">Estado</span>
                  <span class="tech-value status">VERIFICADO</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">Emitido</span>
                  <span class="tech-value">{{ getFormattedDate(credential.issueDate) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">Verificar en</span>
                  <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                </div>
              </div>

              <!-- ===== FIRMAS ===== -->
              <div class="signatures">
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Henson Alberto Medina Castillo</div>
                  <div class="sign-role">Director General</div>
                </div>
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Uberto Manuel Gómez López</div>
                  <div class="sign-role">Director Académico</div>
                </div>
                <div class="signature">
                  <div class="sign-line"></div>
                  <div class="sign-name">Diana Marcela Alfonso Montañez</div>
                  <div class="sign-role">Directora de Operaciones</div>
                </div>
              </div>

              <!-- ===== PIE ===== -->
              <div class="cert-footer">
                <span>Documento verificable digitalmente</span>
                <span class="footer-url">tellus.ruralsteamlab.com/verificar</span>
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

      .loading-state, .error-state {
        text-align: center;
        padding: 40px;
      }
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255,255,255,0.1);
        border-top-color: #4cff9c;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .error-state .error-icon { font-size: 48px; display: block; margin-bottom: 16px; }
      .error-state h2 { font-size: 24px; margin: 8px 0; }
      .error-state p { color: rgba(255,255,255,0.6); }

      .credential-found {
        max-width: 1100px;
        width: 100%;
      }
      .header {
        text-align: center;
        margin-bottom: 28px;
      }
      .verified-badge {
        display: inline-block;
        background: rgba(76,255,156,0.12);
        border: 1px solid rgba(76,255,156,0.2);
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
        color: rgba(255,255,255,0.3);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 300;
      }

      /* ==========================================================
         CERTIFICADO PREMIUM
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 30px;
        border-radius: 16px;
        box-shadow: 0 18px 45px rgba(0,0,0,0.08);
        width: 100%;
        max-width: 1050px;
      }
      .certificate {
        position: relative;
        background: #FAF8F2;
        padding: 45px 55px 35px 55px;
        border-radius: 8px;
        border: 1px solid #D8C9A6;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #202124;
        overflow: hidden;
        min-height: 500px;
        aspect-ratio: 16 / 9;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* ===== FONDO PREMIUM ===== */
      .bg-premium {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
          radial-gradient(circle at 20% 30%, rgba(200,200,200,0.03) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(200,200,200,0.03) 0%, transparent 60%),
          repeating-linear-gradient(45deg, rgba(200,200,200,0.01) 0px, rgba(200,200,200,0.01) 2px, transparent 2px, transparent 8px);
        pointer-events: none;
        z-index: 0;
      }

      /* ===== MARCA DE AGUA ===== */
      .watermark {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 180px;
        height: 240px;
        opacity: 0.04;
        pointer-events: none;
        z-index: 0;
      }
      .watermark svg {
        width: 100%;
        height: 100%;
      }

      /* ==========================================================
         ENCABEZADO
      ========================================================= */
      .cert-header {
        text-align: center;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }
      .org {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      .org-name {
        font-family: 'Cinzel', serif;
        font-size: 34px;
        font-weight: 700;
        letter-spacing: 4px;
        color: #1E5631;
        text-transform: uppercase;
      }
      .org-name .steam-multicolor {
        font-weight: 700;
        display: inline-block;
      }
      .org-name .steam-multicolor .s { color: #1976d2; }
      .org-name .steam-multicolor .t { color: #00bcd4; }
      .org-name .steam-multicolor .e { color: #fdd835; }
      .org-name .steam-multicolor .a { color: #f57c00; }
      .org-name .steam-multicolor .m { color: #388e3c; }

      .org-country {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 10px;
        color: #666;
        text-transform: uppercase;
        margin-top: 2px;
      }
      .org-slogan {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 3px;
        color: #999;
        text-transform: uppercase;
        margin-top: 2px;
      }
      .header-line {
        width: 80px;
        height: 1px;
        background: #C8A24A;
        margin: 14px auto 0 auto;
        opacity: 0.4;
      }

      /* ==========================================================
         CUERPO CENTRAL
      ========================================================= */
      .cert-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        z-index: 1;
        gap: 4px;
        padding: 6px 0;
      }

      .certifies {
        font-family: 'Cinzel', serif;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 6px;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 2px;
      }

      .student-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 58px;
        font-weight: 600;
        font-style: italic;
        color: #1E5631;
        line-height: 1.1;
        letter-spacing: 1px;
        margin: 2px 0;
      }

      .project-label {
        font-family: 'Inter', sans-serif;
        font-size: 17px;
        font-weight: 400;
        color: #666;
        margin-top: 2px;
      }

      .project-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 34px;
        font-weight: 600;
        font-style: italic;
        color: #2E7D32;
        margin: 2px 0 0 0;
        line-height: 1.2;
      }

      .project-line {
        width: 80px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 4px auto 6px auto;
        opacity: 0.5;
      }

      .project-text {
        font-family: 'Inter', sans-serif;
        font-size: 17px;
        font-weight: 400;
        color: #666;
        max-width: 80%;
        line-height: 1.5;
        margin: 2px 0;
      }
      .project-text strong {
        color: #1E5631;
        font-weight: 600;
      }

      .recognition {
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 3px;
        color: #C8A24A;
        text-transform: uppercase;
        margin-top: 4px;
        padding: 0 20px;
      }

      /* ==========================================================
         SECCIÓN TÉCNICA
      ========================================================= */
      .tech-section {
        position: absolute;
        left: 35px;
        top: 50%;
        transform: translateY(-50%);
        width: 120px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-right: 1px solid rgba(216,201,166,0.3);
        padding-right: 14px;
      }
      .tech-item {
        text-align: left;
        padding: 2px 0;
      }
      .tech-label {
        font-family: 'Inter', sans-serif;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: #999;
        display: block;
        font-weight: 500;
      }
      .tech-value {
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-size: 11px;
        font-weight: 500;
        color: #202124;
        display: block;
        word-break: break-word;
        line-height: 1.2;
        opacity: 0.8;
      }
      .tech-value.status {
        color: #2E7D32;
        font-weight: 600;
        opacity: 1;
      }
      .tech-value.url {
        font-size: 9px;
        opacity: 0.5;
        font-weight: 400;
      }
      .tech-divider {
        border: none;
        border-top: 0.5px solid rgba(216,201,166,0.2);
        margin: 1px 0;
      }

      /* ==========================================================
         FIRMAS
      ========================================================= */
      .signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        padding-top: 14px;
        border-top: 1px solid rgba(216,201,166,0.3);
        position: relative;
        z-index: 1;
        gap: 20px;
        margin-top: 6px;
        flex-shrink: 0;
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 120px;
      }
      .sign-line {
        width: 80px;
        height: 1.5px;
        background: linear-gradient(90deg, #C8A24A, #d4af37);
        margin: 0 auto 4px auto;
        opacity: 0.4;
        border-radius: 2px;
      }
      .sign-name {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: #202124;
        letter-spacing: 0.3px;
        opacity: 0.8;
      }
      .sign-role {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 400;
      }

      /* ==========================================================
         PIE
      ========================================================= */
      .cert-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid rgba(216,201,166,0.15);
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        color: #999;
        position: relative;
        z-index: 1;
        margin-top: 2px;
        letter-spacing: 0.3px;
        flex-shrink: 0;
      }
      .cert-footer .footer-url {
        font-weight: 500;
        color: #1E5631;
        letter-spacing: 0.5px;
        opacity: 0.6;
      }

      /* ==========================================================
         RESPONSIVE
      ========================================================= */
      @media (max-width: 900px) {
        .certificate { padding: 35px 30px 25px 30px; min-height: 400px; }
        .tech-section { left: 18px; width: 90px; }
        .tech-value { font-size: 9px; }
        .tech-label { font-size: 7px; }
        .student-name { font-size: 44px; }
        .project-name { font-size: 28px; }
        .org-name { font-size: 28px; letter-spacing: 3px; }
        .project-text { font-size: 15px; max-width: 90%; }
        .certifies { font-size: 15px; }
        .recognition { font-size: 13px; }
        .sign-name { font-size: 12px; }
        .sign-role { font-size: 9px; }
        .sign-line { width: 60px; }
        .watermark { width: 120px; height: 160px; }
        .org-country { font-size: 11px; letter-spacing: 7px; }
        .org-slogan { font-size: 10px; letter-spacing: 2px; }
        .project-label { font-size: 15px; }
      }

      @media (max-width: 700px) {
        .tech-section { display: none; }
        .certificate { padding: 25px 18px 18px 18px; min-height: 320px; }
        .student-name { font-size: 34px; }
        .project-name { font-size: 22px; }
        .org-name { font-size: 22px; letter-spacing: 2px; }
        .project-text { font-size: 13px; max-width: 100%; }
        .certifies { font-size: 12px; letter-spacing: 3px; }
        .recognition { font-size: 11px; letter-spacing: 1px; }
        .signatures { flex-direction: column; align-items: center; gap: 8px; }
        .signature { width: 100%; }
        .sign-line { width: 60px; }
        .cert-footer { flex-direction: column; gap: 4px; text-align: center; font-size: 10px; }
        .watermark { display: none; }
        .header-line { margin: 10px auto 0 auto; }
        .org-country { font-size: 10px; letter-spacing: 5px; }
        .org-slogan { font-size: 9px; letter-spacing: 2px; }
        .project-label { font-size: 13px; }
        .cert-header { margin-bottom: 4px; }
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
      .btn-primary, .btn-secondary {
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
        box-shadow: 0 4px 20px rgba(76,255,156,0.2);
      }
      .btn-primary:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 30px rgba(76,255,156,0.3);
      }
      .btn-secondary {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.6);
      }
      .btn-secondary:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.15);
      }
      .footer-text {
        margin-top: 24px;
        font-size: 12px;
        color: rgba(255,255,255,0.2);
        text-align: center;
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
    this.credentialService.getCredentialByUuid(uuid)
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error(err);
          this.error = '⚠️ Error de conexión. Verifica tu internet e intenta de nuevo.';
          this.errorTitle = 'Error de conexión';
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (cred) => {
          if (!cred) {
            this.error = '❌ Credencial no encontrada. Verifica el código.';
            this.errorTitle = 'No encontrada';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }
          this.credential = cred;
          this.loadProject(cred.projectId);
        },
        error: (err) => {
          console.error(err);
          this.error = '⚠️ Error al verificar la credencial. Intenta de nuevo.';
          this.errorTitle = 'Error interno';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private loadProject(projectId: string): void {
    if (!projectId) {
      this.error = 'La credencial no tiene un proyecto asociado.';
      this.errorTitle = 'Proyecto faltante';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    this.projectService.getProject(projectId)
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error(err);
          this.error = '⚠️ Error al cargar el proyecto asociado.';
          this.errorTitle = 'Error al cargar proyecto';
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (project) => {
          if (!project) {
            this.error = 'El proyecto asociado a esta credencial ya no existe.';
            this.errorTitle = 'Proyecto eliminado';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }
          this.project = project;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
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

  getFormattedDate(dateValue: any): string {
    if (!dateValue) return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const date = new Date(dateValue);
    return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
  }

  getCertId(credential: Credential, project: Project): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const suffix = project.id?.slice(0, 6).toUpperCase() || '000001';
    return `RSL-${year}-${month}${day}-${suffix}`;
  }

  // ================================================================
  //  MÉTODO downloadPDF DEFINITIVO (con clonación y eliminación de elementos problemáticos)
  // ================================================================
  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }

    try {
      const container = document.getElementById('certificate-container');
      if (!container) throw new Error('Contenedor no encontrado');

      // Clonar el contenedor para no afectar el DOM original
      const clone = container.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = container.offsetWidth + 'px';
      clone.style.height = container.offsetHeight + 'px';
      clone.style.backgroundColor = '#FAF8F2';
      clone.style.zIndex = '-9999';
      document.body.appendChild(clone);

      // Eliminar elementos con dimensiones cero (causan el error createPattern)
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          (el as HTMLElement).style.display = 'none';
        }
      });

      // Asegurar que la marca de agua tenga dimensiones válidas
      const watermark = clone.querySelector('.watermark') as HTMLElement;
      if (watermark) {
        watermark.style.width = '180px';
        watermark.style.height = '240px';
        const svg = watermark.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '180');
          svg.setAttribute('height', '240');
        }
      }

      // Capturar el clon
      const canvas = await html2canvas(clone, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F2',
        width: clone.scrollWidth,
        height: clone.scrollHeight,
        allowTaint: false
      });

      // Remover el clon del DOM
      document.body.removeChild(clone);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas generado con dimensiones cero');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificado-${this.project.title.replace(/\s+/g, '-')}.pdf`);

      console.log('✅ PDF descargado correctamente');

    } catch (error) {
      console.error('❌ Error en downloadPDF:', error);
      alert('Error al generar el PDF. Detalles: ' + (error as Error).message);
    }
  }
}