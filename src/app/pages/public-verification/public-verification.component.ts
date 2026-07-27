import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
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

      <!-- Certificado (fondo + overlay minimalista) -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate" #certificate>

              <!-- Fondo (imagen 4K opcional) -->
              <img
                src="assets/images/certificate-background.webp"
                alt="Fondo certificado Tellus"
                class="certificate-bg"
                (load)="onBackgroundLoaded()"
                (error)="onBackgroundError()"
              >

              <!-- Overlay con contenido dinámico -->
              <div class="certificate-overlay">

                <!-- MATRAZ PREMIUM (SVG) -->
                <div class="logo-container">
                  <svg width="140" height="180" viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                        <stop offset="35%" stop-color="#d8ffd8"/>
                        <stop offset="100%" stop-color="#8fdc6d"/>
                      </linearGradient>
                      <linearGradient id="outline" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#8cff00"/>
                        <stop offset="100%" stop-color="#1d5d16"/>
                      </linearGradient>
                      <radialGradient id="glow">
                        <stop offset="0%" stop-color="#baff8d" stop-opacity="1"/>
                        <stop offset="100%" stop-color="#5bbf28" stop-opacity="0"/>
                      </radialGradient>
                      <filter id="shadow">
                        <feGaussianBlur stdDeviation="8"/>
                      </filter>
                    </defs>
                    <ellipse cx="160" cy="370" rx="95" ry="25" fill="url(#glow)" filter="url(#shadow)" opacity="0.8"/>
                    <circle cx="135" cy="40" r="12" fill="#7dff00"/>
                    <circle cx="180" cy="22" r="18" fill="#7dff00"/>
                    <circle cx="205" cy="52" r="8" fill="#7dff00"/>
                    <rect x="142" y="60" width="36" height="45" rx="8" fill="url(#glass)" stroke="url(#outline)" stroke-width="6"/>
                    <path d="M142 100 L115 185 C95 240 72 275 72 320 C72 375 112 410 160 410 C208 410 248 375 248 320 C248 275 225 240 205 185 L178 100 Z" fill="url(#glass)" stroke="url(#outline)" stroke-width="8"/>
                    <path d="M120 125 C105 170 98 210 98 300" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.45"/>
                    <path d="M110 260 C70 205 75 145 155 150 C165 215 150 280 110 260 Z" fill="#42c321"/>
                    <path d="M210 260 C250 205 245 145 165 150 C155 215 170 280 210 260 Z" fill="#6bdc39"/>
                    <path d="M160 310 L128 175" stroke="#1b5e20" stroke-width="3"/>
                    <path d="M160 310 L192 175" stroke="#1b5e20" stroke-width="3"/>
                    <path d="M160 315 L160 185" stroke="#1b5e20" stroke-width="6" stroke-linecap="round"/>
                    <circle cx="60" cy="180" r="2" fill="#78ff5d"/>
                    <circle cx="250" cy="160" r="3" fill="#78ff5d"/>
                    <circle cx="260" cy="220" r="2" fill="#9cff80"/>
                    <circle cx="55" cy="250" r="2" fill="#9cff80"/>
                    <circle cx="75" cy="320" r="2" fill="#78ff5d"/>
                    <circle cx="245" cy="330" r="2" fill="#78ff5d"/>
                  </svg>
                </div>

                <!-- NOMBRE DEL PARTICIPANTE -->
                <div class="student-name">
                  {{ project.studentName || 'Nombre del Participante' }}
                </div>

                <!-- NOMBRE DEL PROYECTO -->
                <div class="project-name">
                  “{{ project.title || 'Nombre del Proyecto' }}”
                </div>

                <!-- RECONOCIMIENTO -->
                <div class="recognition">
                  {{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}
                </div>

                <!-- FECHA -->
                <div class="date">
                  {{ getFormattedDate(credential.issueDate) }}
                </div>

                <!-- ===== SECCIÓN TÉCNICA MINIMALISTA ===== -->
                <div class="tech-section">
                  <div class="tech-item">
                    <span class="tech-label">ID DE CERTIFICADO</span>
                    <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                  </div>
                  <div class="tech-divider"></div>
                  <div class="tech-item">
                    <span class="tech-label">CÓDIGO DE VERIFICACIÓN</span>
                    <span class="tech-value">{{ credential.verificationCode || '2BD2643-454A-4043' }}</span>
                  </div>
                  <div class="tech-divider"></div>
                  <div class="tech-item">
                    <span class="tech-label">VERIFICAR EN</span>
                    <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- BOTONES -->
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
      .error-state .error-icon { font-size: 48px; display: block; margin-bottom: 16px; }
      .error-state h2 { font-size: 24px; margin: 8px 0; }
      .error-state p { color: rgba(255, 255, 255, 0.6); }

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
         CERTIFICADO (fondo + overlay)
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 24px 24px;
        border-radius: 12px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 1000px;
      }
      .certificate {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 11;
        background: #FAF8F2;
        border-radius: 4px;
        overflow: hidden;
      }

      .certificate-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        z-index: 0;
      }

      .certificate-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
      }

      /* ===== MATRAZ ===== */
      .logo-container {
        position: absolute;
        left: 4%;
        top: 6%;
        width: 12%;
        max-width: 100px;
        opacity: 0.85;
      }
      .logo-container svg {
        width: 100%;
        height: auto;
        display: block;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.04));
      }

      /* ===== NOMBRE DEL PARTICIPANTE ===== */
      .student-name {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 4.5vw;
        font-weight: 400;
        font-style: italic;
        color: #1B5E20;
        text-align: center;
        letter-spacing: 1px;
        width: 70%;
        line-height: 1.1;
      }

      /* ===== PROYECTO ===== */
      .project-name {
        position: absolute;
        left: 50%;
        top: 55%;
        transform: translate(-50%, -50%);
        font-family: 'Georgia', serif;
        font-size: 3vw;
        font-weight: 400;
        font-style: italic;
        color: #1B5E20;
        text-align: center;
        width: 60%;
        line-height: 1.2;
      }

      /* ===== RECONOCIMIENTO ===== */
      .recognition {
        position: absolute;
        left: 50%;
        top: 68%;
        transform: translate(-50%, -50%);
        font-family: 'Georgia', serif;
        font-size: 1.2vw;
        font-weight: 600;
        color: #1B5E20;
        text-align: center;
        letter-spacing: 2px;
        text-transform: uppercase;
        width: 50%;
        opacity: 0.8;
      }

      /* ===== FECHA ===== */
      .date {
        position: absolute;
        left: 50%;
        top: 76%;
        transform: translate(-50%, -50%);
        font-family: 'Georgia', serif;
        font-size: 1vw;
        color: #666;
        text-align: center;
        letter-spacing: 0.5px;
      }

      /* ===== SECCIÓN TÉCNICA MINIMALISTA ===== */
      .tech-section {
        position: absolute;
        left: 6%;
        top: 30%;
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 14%;
        z-index: 2;
      }
      .tech-item {
        text-align: left;
        padding: 2px 0;
      }
      .tech-label {
        font-size: 0.5vw;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #999;
        display: block;
        font-weight: 500;
      }
      .tech-value {
        font-size: 0.7vw;
        font-weight: 600;
        color: #1B5E20;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-word;
        line-height: 1.3;
        opacity: 0.8;
      }
      .tech-value.url {
        font-size: 0.55vw;
        font-weight: 600;
        color: #1B5E20;
        opacity: 0.6;
      }
      .tech-divider {
        border: none;
        border-top: 0.5px solid rgba(200, 162, 74, 0.15);
        margin: 2px 0;
      }

      /* ==========================================================
         RESPONSIVE
      ========================================================= */
      @media (max-width: 850px) {
        .logo-container { width: 18%; left: 3%; top: 4%; }
        .student-name { font-size: 6vw; top: 38%; }
        .project-name { font-size: 4vw; top: 54%; }
        .recognition { font-size: 1.8vw; top: 67%; width: 60%; }
        .date { font-size: 1.6vw; top: 74%; }
        .tech-section { left: 4%; width: 20%; top: 28%; }
        .tech-label { font-size: 0.8vw; }
        .tech-value { font-size: 1.2vw; }
        .tech-value.url { font-size: 1vw; }
      }

      @media (max-width: 600px) {
        .tech-section { left: 4%; width: 25%; top: 25%; }
        .tech-label { font-size: 1vw; }
        .tech-value { font-size: 1.5vw; }
        .tech-value.url { font-size: 1.2vw; }
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
    `
  ]
})
export class PublicVerificationComponent implements OnInit {
  @ViewChild('certificate') certificateRef!: ElementRef<HTMLDivElement>;

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

  onBackgroundLoaded(): void {
    // Se puede usar si se necesita notificar que la imagen cargó
  }

  onBackgroundError(): void {
    console.warn('⚠️ No se pudo cargar el fondo. Usando color de fondo.');
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

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

  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const container = document.getElementById('certificate-container');
      if (!container) throw new Error('Contenedor no encontrado');

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F2',
        width: container.scrollWidth,
        height: container.scrollHeight,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificado-${this.project.title.replace(/\s+/g, '-')}.pdf`);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  }
}