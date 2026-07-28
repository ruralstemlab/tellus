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

      <!-- Certificado Tellus V3.0 - Solo ajuste de fuentes -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">

              <!-- FONDO TEXTURADO -->
              <div class="cert-bg"></div>

              <!-- MARCA DE AGUA (la misma que funcionaba) -->
              <div class="watermark">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M75 50 L125 50 L145 90 L155 130 Q155 170 100 170 Q45 170 45 130 L55 90 Z" fill="none" stroke="#1B5E20" stroke-width="1" opacity="0.04"/>
                  <text x="100" y="140" font-family="Georgia, serif" font-size="16" fill="#1B5E20" opacity="0.03" text-anchor="middle" letter-spacing="3">TELLUS</text>
                </svg>
              </div>

              <!-- ENCABEZADO -->
              <div class="cert-header">
                <div class="logo-flask">
                  <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flaskGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
                        <stop offset="100%" stop-color="#e8f5e9" stop-opacity="0.2"/>
                      </linearGradient>
                    </defs>
                    <path d="M30 10 L50 10 L58 40 L68 70 Q68 95 40 95 Q12 95 12 70 L22 40 Z" fill="url(#flaskGlass)" stroke="#1B5E20" stroke-width="1.5"/>
                    <path d="M38 30 Q48 20 58 30 Q48 40 38 30" fill="#1B5E20" opacity="0.7"/>
                    <path d="M32 40 Q42 30 52 40 Q42 50 32 40" fill="#2E7D32" opacity="0.8"/>
                    <circle cx="20" cy="22" r="1.5" fill="#1B5E20" opacity="0.3"/>
                    <circle cx="60" cy="20" r="1.5" fill="#1B5E20" opacity="0.2"/>
                    <circle cx="16" cy="50" r="1.5" fill="#1B5E20" opacity="0.2"/>
                    <circle cx="64" cy="48" r="1.5" fill="#1B5E20" opacity="0.2"/>
                  </svg>
                </div>

                <!-- ===== Rural STEAM Lab - AHORA MÁS GRANDE ===== -->
                <div class="org-name">
                  <span class="rural">Rural</span>
                  <span class="steam">
                    <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                  </span>
                  <span class="lab">Lab</span>
                </div>

                <div class="seal-minimal">
                  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="#C8A24A" stroke-width="1.5"/>
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#C8A24A" stroke-width="0.5" opacity="0.5"/>
                    <text x="40" y="34" font-family="Georgia, serif" font-size="8" fill="#1B5E20" text-anchor="middle" letter-spacing="1.5" font-weight="600">TELLUS</text>
                    <text x="40" y="48" font-family="Georgia, serif" font-size="6" fill="#666" text-anchor="middle" letter-spacing="1">ECOSISTEMA</text>
                    <rect x="18" y="60" width="14" height="2" fill="#1B5E20" opacity="0.4"/>
                    <rect x="48" y="60" width="14" height="2" fill="#1B5E20" opacity="0.4"/>
                  </svg>
                </div>
              </div>

              <div class="header-divider"></div>

              <!-- ===== NOMBRE DEL PARTICIPANTE - MÁS PEQUEÑO Y EN UNA LÍNEA ===== -->
              <div class="cert-student-name">{{ project.studentName || 'Nombre del Participante' }}</div>
              <div class="gold-line"></div>

              <!-- ===== NOMBRE DEL PROYECTO ===== -->
              <div class="cert-project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>
              <div class="gold-line-short"></div>

              <!-- ===== DESCRIPCIÓN ===== -->
              <div class="cert-description">
                ha desarrollado y publicado exitosamente el proyecto
                <span class="light-text">en el Ecosistema Tellus, demostrando creatividad, compromiso, pensamiento científico y espíritu de innovación.</span>
              </div>

              <!-- ===== RECONOCIMIENTO ===== -->
              <div class="recognition-band">
                <div class="recognition-line"></div>
                <span class="recognition-text">{{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}</span>
                <div class="recognition-line"></div>
              </div>

              <!-- ===== FECHA ===== -->
              <div class="cert-date">
                Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong>
              </div>

              <!-- ===== COLUMNA IZQUIERDA ===== -->
              <div class="tech-info">
                <div class="tech-item">
                  <span class="tech-label">ID de Certificado</span>
                  <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="tech-item">
                  <span class="tech-label">Código de Verificación</span>
                  <span class="tech-value">{{ credential.verificationCode || '2BD2643-454A-4043' }}</span>
                </div>
                <div class="tech-item verify-link">
                  <span class="tech-label">VERIFICAR EN</span>
                  <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                </div>
              </div>

              <!-- ===== FIRMAS ===== -->
              <div class="cert-signatures">
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Henson Alberto Medina Castillo</div>
                  <div class="sign-role">Liderazgo Tecnológico y Desarrollo</div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Uberto Manuel Gómez López</div>
                  <div class="sign-role">Liderazgo Académico e Investigación</div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Diana Marcela Alfonso Montañez</div>
                  <div class="sign-role">Liderazgo de Implementación y Calidad</div>
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
         CERTIFICADO V3.0 - CON AJUSTE DE FUENTES (sin sombras extra)
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 30px 30px;
        border-radius: 12px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 1000px;
      }
      .certificate {
        position: relative;
        background: #FAF8F2;
        padding: 20px 25px 18px 25px;
        border-radius: 6px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #1B5E20;
        overflow: hidden;
        min-height: 460px;
        display: flex;
        flex-direction: column;
        border: 0.8px solid rgba(200, 162, 74, 0.2);
        border-width: 0.8px 1.2px 1.2px 0.8px;
        box-shadow: inset 0 0 0 1px rgba(200, 162, 74, 0.05);
      }

      /* ===== FONDO TEXTURADO ===== */
      .cert-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
          radial-gradient(circle at 20% 30%, rgba(200, 200, 200, 0.02) 0%, transparent 60%),
          repeating-linear-gradient(45deg, rgba(200,200,200,0.015) 0px, rgba(200,200,200,0.015) 1px, transparent 1px, transparent 4px);
        pointer-events: none;
        opacity: 0.6;
        z-index: 0;
      }

      /* ===== MARCA DE AGUA ===== */
      .watermark {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 150px;
        height: 150px;
        opacity: 0.06;
        pointer-events: none;
        z-index: 0;
      }
      .watermark svg {
        width: 100%;
        height: 100%;
      }

      /* ==========================================================
         ENCABEZADO - CON FUENTES AJUSTADAS
      ========================================================= */
      .cert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 6px 0;
        position: relative;
        z-index: 1;
      }
      .logo-flask {
        width: 50px;
        height: 60px;
        flex-shrink: 0;
        opacity: 0.7;
      }
      .logo-flask svg {
        width: 100%;
        height: 100%;
      }

      /* ===== TÍTULO INSTITUCIONAL (más grande) ===== */
      .org-name {
        font-size: 2.8rem;          /* antes 1.6rem */
        font-weight: 700;
        letter-spacing: 1.5px;
        font-family: 'Cinzel', 'Georgia', serif;
        color: #1B5E20;
        text-align: center;
        flex: 1;
        opacity: 0.8;
        text-transform: uppercase;
        line-height: 1.1;
      }
      .org-name .rural { color: #1B5E20; }
      .org-name .steam { font-weight: 800; }
      .org-name .s { color: #1976d2; }
      .org-name .t { color: #00bcd4; }
      .org-name .e { color: #fdd835; }
      .org-name .a { color: #f57c00; }
      .org-name .m { color: #388e3c; }
      .org-name .lab { color: #1B5E20; }

      .seal-minimal {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        opacity: 0.5;
      }
      .seal-minimal svg {
        width: 100%;
        height: 100%;
      }

      .header-divider {
        border: none;
        border-top: 0.8px solid rgba(200, 162, 74, 0.15);
        margin: 0 0 8px 0;
        position: relative;
        z-index: 1;
      }

      /* ==========================================================
         NOMBRE DEL PARTICIPANTE (más pequeño y en una línea)
      ========================================================= */
      .cert-student-name {
        font-size: 2rem;            /* antes 72px ≈ 4.5rem */
        font-weight: 400;
        font-family: 'Cormorant Garamond', 'Georgia', serif;
        color: #1B5E20;
        text-align: center;
        letter-spacing: 1px;
        margin: 4px 0 0 0;
        line-height: 1.2;
        position: relative;
        z-index: 1;
        font-style: italic;
        opacity: 0.95;
        white-space: nowrap;         /* <-- una sola línea */
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 85%;
        margin-left: auto;
        margin-right: auto;
      }
      .gold-line {
        width: 120px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 0 auto 8px auto;
        border-radius: 2px;
        opacity: 0.6;
      }

      /* ==========================================================
         NOMBRE DEL PROYECTO
      ========================================================= */
      .cert-project-name {
        font-size: 2.2rem;          /* ajustado para armonía */
        font-weight: 400;
        color: #1B5E20;
        text-align: center;
        font-style: italic;
        margin: 2px 0 0 0;
        position: relative;
        z-index: 1;
        opacity: 0.85;
        font-family: 'Cormorant Garamond', 'Georgia', serif;
      }
      .gold-line-short {
        width: 80px;
        height: 1.5px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 0 auto 6px auto;
        border-radius: 2px;
        opacity: 0.4;
      }

      /* ==========================================================
         DESCRIPCIÓN
      ========================================================= */
      .cert-description {
        font-size: 0.9rem;
        color: #666;
        text-align: center;
        max-width: 70%;
        margin: 6px auto 8px auto;
        line-height: 1.5;
        font-family: 'Georgia', serif;
        position: relative;
        z-index: 1;
      }
      .cert-description .light-text {
        color: #999;
        font-size: 0.85rem;
      }

      /* ==========================================================
         RECONOCIMIENTO
      ========================================================= */
      .recognition-band {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: 6px 0 6px 0;
        position: relative;
        z-index: 1;
      }
      .recognition-line {
        width: 40px;
        height: 0.8px;
        background: #C8A24A;
        opacity: 0.3;
      }
      .recognition-text {
        font-size: 0.8rem;
        font-weight: 600;
        color: #1B5E20;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-family: 'Georgia', serif;
        opacity: 0.7;
      }

      /* ==========================================================
         FECHA
      ========================================================= */
      .cert-date {
        font-size: 0.8rem;
        color: #666;
        text-align: center;
        margin: 2px 0 10px 0;
        position: relative;
        z-index: 1;
        letter-spacing: 0.5px;
      }

      /* ==========================================================
         COLUMNA IZQUIERDA
      ========================================================= */
      .tech-info {
        position: absolute;
        left: 20px;
        top: 100px;
        bottom: 50px;
        width: 140px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        z-index: 1;
        border-right: 0.8px solid rgba(200, 162, 74, 0.1);
        padding-right: 12px;
      }
      .tech-item {
        text-align: left;
        padding: 2px 0;
      }
      .tech-label {
        font-size: 0.45rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #999;
        display: block;
        font-weight: 500;
      }
      .tech-value {
        font-size: 0.65rem;
        font-weight: 600;
        color: #1B5E20;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-all;
        line-height: 1.2;
        opacity: 0.8;
      }
      .tech-value.url {
        font-size: 0.55rem;
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #1B5E20;
        opacity: 0.6;
      }
      .verify-link {
        margin-top: 2px;
      }

      /* ==========================================================
         FIRMAS (sin sombras extra)
      ========================================================= */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: auto;
        padding-top: 10px;
        border-top: 0.8px solid rgba(200, 162, 74, 0.1);
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
        gap: 8px;
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 130px;
        position: relative;
      }
      .sign-line.gold {
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, #C8A24A, #d4af37);
        margin: 0 auto 4px auto;
        border-radius: 2px;
        opacity: 0.4;
        /* sin box-shadow */
      }
      .sign-name {
        font-size: 0.7rem;
        font-weight: 700;
        color: #1B5E20;
        letter-spacing: 0.3px;
        opacity: 0.8;
      }
      .sign-role {
        font-size: 0.5rem;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
      }

      /* ==========================================================
         RESPONSIVE
      ========================================================= */
      @media (max-width: 850px) {
        .tech-info {
          position: relative;
          left: auto;
          top: auto;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          border-right: none;
          padding-right: 0;
          margin: 6px 0;
        }
        .tech-item {
          flex: 1 0 45%;
          text-align: center;
        }
        .watermark { display: none; }
        .logo-flask { width: 35px; height: 45px; }
        .seal-minimal { width: 40px; height: 40px; }
        .org-name { font-size: 2.2rem; }
        .cert-student-name { font-size: 1.6rem; white-space: normal; max-width: 95%; }
        .cert-project-name { font-size: 1.8rem; }
        .cert-description { max-width: 100%; font-size: 0.8rem; }
        .certificate { padding: 15px; }
        .cert-signatures { flex-direction: column; align-items: center; }
        .signature { min-width: auto; width: 100%; }
        .recognition-text { font-size: 0.65rem; letter-spacing: 0.5px; }
        .recognition-line { width: 20px; }
        .header-divider { margin: 0; }
        .tech-label { font-size: 0.4rem; }
        .tech-value { font-size: 0.55rem; }
      }

      @media (max-width: 600px) {
        .org-name { font-size: 1.6rem; }
        .cert-student-name { font-size: 1.3rem; }
        .cert-project-name { font-size: 1.4rem; }
        .cert-description { font-size: 0.7rem; }
        .recognition-text { font-size: 0.5rem; }
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
  //  MÉTODO downloadPDF (el mismo que funcionaba)
  // ================================================================
  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }
    try {
      const container = document.getElementById('certificate-container');
      if (!container) throw new Error('Contenedor no encontrado');

      const canvas = await html2canvas(container, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F2',
        width: container.scrollWidth,
        height: container.scrollHeight
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