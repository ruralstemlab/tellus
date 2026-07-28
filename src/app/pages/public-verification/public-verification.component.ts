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

      <!-- Certificado Tellus V3.0 - Rediseño de diseño -->
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

              <!-- MARCA DE AGUA -->
              <div class="watermark">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M75 50 L125 50 L145 90 L155 130 Q155 170 100 170 Q45 170 45 130 L55 90 Z" fill="none" stroke="#1B5E20" stroke-width="1" opacity="0.04"/>
                  <text x="100" y="140" font-family="Georgia, serif" font-size="16" fill="#1B5E20" opacity="0.03" text-anchor="middle" letter-spacing="3">TELLUS</text>
                </svg>
              </div>

              <!-- ========== ENCABEZADO (rediseñado) ========== -->
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

                <div class="org-name">
                  <span class="rural">Rural</span>
                  <span class="steam">
                    <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                  </span>
                  <span class="lab">Lab</span>
                </div>

                <!-- ===== NUEVO: subtítulo y lema ===== -->
                <div class="org-subtitle">COLOMBIA</div>
                <div class="org-motto">INVESTIGA · INNOVA · TRANSFORMA</div>

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

              <!-- ========== NOMBRE DEL PARTICIPANTE (protagonista) ========== -->
              <div class="cert-student-name">{{ project.studentName || 'Nombre del Participante' }}</div>
              <div class="gold-line"></div>

              <!-- ========== PROYECTO ========== -->
              <div class="cert-project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>
              <div class="gold-line-short"></div>

              <!-- ========== DESCRIPCIÓN ========== -->
              <div class="cert-description">
                ha desarrollado y publicado exitosamente el proyecto
                <span class="light-text">en el Ecosistema Tellus, demostrando creatividad, compromiso, pensamiento científico y espíritu de innovación.</span>
              </div>

              <!-- ========== RECONOCIMIENTO ========== -->
              <div class="recognition-band">
                <div class="recognition-line"></div>
                <span class="recognition-text">{{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}</span>
                <div class="recognition-line"></div>
              </div>

              <!-- ========== FECHA ========== -->
              <div class="cert-date">
                Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong>
              </div>

              <!-- ========== COLUMNA IZQUIERDA ========== -->
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

              <!-- ==========================================================
                   FIRMAS - AHORA CON ESPACIO GARANTIZADO
              ========================================================== -->
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
         CERTIFICADO - DISEÑO REDISEÑADO (con firmas visibles)
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 15px 15px;
        border-radius: 12px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 1000px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .certificate {
        position: relative;
        background: #FAF8F2;
        padding: 18px 22px 15px 22px;
        border-radius: 6px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #1B5E20;
        overflow: hidden;
        width: 100%;
        aspect-ratio: 1.414 / 1; /* A4 horizontal */
        display: flex;
        flex-direction: column;
        border: 0.8px solid rgba(200, 162, 74, 0.2);
        box-shadow: inset 0 0 0 1px rgba(200, 162, 74, 0.05);
        min-height: 0; /* Evita desbordamiento */
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
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 120px;
        height: 120px;
        opacity: 0.06;
        pointer-events: none;
        z-index: 0;
      }
      .watermark svg {
        width: 100%;
        height: 100%;
      }

      /* ==========================================================
         ENCABEZADO - REDISEÑADO
      ========================================================= */
      .cert-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0 12px 0;
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
        flex-shrink: 0;
      }

      .logo-flask {
        width: 45px;
        height: 55px;
        flex-shrink: 0;
        opacity: 0.7;
      }
      .logo-flask svg {
        width: 100%;
        height: 100%;
      }

      .org-name {
        flex: 1;
        text-align: center;
        font-family: 'Cinzel', serif;
        font-size: 2.6rem;
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: 0.5px;
        text-transform: none;
        color: #1B5E20;
      }
      .org-name .rural { color: #1B5E20; }
      .org-name .lab { color: #1B5E20; }
      .org-name .steam {
        font-weight: 700;
        letter-spacing: 1px;
      }
      .org-name .s { color: #1976D2; }
      .org-name .t { color: #00BCD4; }
      .org-name .e { color: #FDD835; }
      .org-name .a { color: #FB8C00; }
      .org-name .m { color: #43A047; }

      .org-subtitle {
        text-align: center;
        font-size: 0.7rem;
        letter-spacing: 6px;
        margin-top: 2px;
        color: #777;
        font-family: 'Inter', sans-serif;
        width: 100%;
      }
      .org-motto {
        text-align: center;
        font-size: 0.65rem;
        letter-spacing: 2.5px;
        margin-top: 4px;
        color: #999;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        width: 100%;
      }

      .seal-minimal {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
        opacity: 0.5;
        margin-left: 8px;
      }
      .seal-minimal svg {
        width: 100%;
        height: 100%;
      }

      .header-divider {
        border: none;
        border-top: 0.6px solid rgba(200, 162, 74, 0.2);
        margin: 0 0 10px 0;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }

      /* ==========================================================
         NOMBRE DEL PARTICIPANTE (protagonista)
      ========================================================= */
      .cert-student-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.4rem;
        font-style: italic;
        font-weight: 600;
        color: #1B5E20;
        text-align: center;
        line-height: 1.1;
        letter-spacing: 0.5px;
        margin: 6px auto 4px;
        max-width: 80%;
        white-space: normal;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }
      .gold-line {
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 0 auto 6px auto;
        border-radius: 2px;
        opacity: 0.6;
        flex-shrink: 0;
      }

      /* ==========================================================
         PROYECTO
      ========================================================= */
      .cert-project-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.2rem;
        font-style: italic;
        font-weight: 600;
        color: #2E7D32;
        text-align: center;
        margin: 10px 0 4px;
        line-height: 1.2;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }
      .gold-line-short {
        width: 70px;
        height: 1.5px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 0 auto 6px auto;
        border-radius: 2px;
        opacity: 0.4;
        flex-shrink: 0;
      }

      /* ==========================================================
         DESCRIPCIÓN
      ========================================================= */
      .cert-description {
        max-width: 68%;
        margin: 6px auto 8px;
        text-align: center;
        font-size: 0.85rem;
        line-height: 1.5;
        color: #555;
        font-family: 'Georgia', serif;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }
      .cert-description .light-text {
        color: #999;
        font-size: 0.8rem;
      }

      /* ==========================================================
         RECONOCIMIENTO
      ========================================================= */
      .recognition-band {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin: 10px 0 6px;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
      }
      .recognition-line {
        width: 35px;
        height: 0.5px;
        background: #C8A24A;
        opacity: 0.3;
      }
      .recognition-text {
        font-size: 0.8rem;
        font-weight: 700;
        color: #C8A24A;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        font-family: 'Georgia', serif;
        opacity: 0.8;
      }

      /* ==========================================================
         FECHA
      ========================================================= */
      .cert-date {
        font-size: 0.85rem;
        color: #666;
        text-align: center;
        margin-top: 6px;
        margin-bottom: 6px;
        position: relative;
        z-index: 1;
        letter-spacing: 0.5px;
        font-family: 'Georgia', serif;
        flex-shrink: 0;
      }

      /* ==========================================================
         COLUMNA IZQUIERDA (técnica)
      ========================================================= */
      .tech-info {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        z-index: 1;
        border-right: 0.5px solid rgba(200, 162, 74, 0.1);
        padding-right: 10px;
      }
      .tech-item {
        text-align: left;
        padding: 1px 0;
      }
      .tech-label {
        font-size: 0.4rem;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: #999;
        display: block;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
      }
      .tech-value {
        font-size: 0.55rem;
        font-weight: 600;
        color: #1B5E20;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-all;
        line-height: 1.2;
        opacity: 0.8;
      }
      .tech-value.url {
        font-size: 0.5rem;
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #1B5E20;
        opacity: 0.6;
      }
      .verify-link {
        margin-top: 1px;
      }

      /* ==========================================================
         FIRMAS - CON ESPACIO SUFICIENTE
      ========================================================= */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: auto;      /* Empuja las firmas hacia abajo */
        padding-top: 10px;
        border-top: 0.5px solid rgba(200, 162, 74, 0.12);
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
        gap: 8px;
        flex-shrink: 0;
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 100px;
        position: relative;
      }
      .sign-line.gold {
        width: 60px;
        height: 1.5px;
        background: linear-gradient(90deg, #C8A24A, #d4af37);
        margin: 0 auto 4px auto;
        border-radius: 2px;
        opacity: 0.4;
      }
      .sign-name {
        font-size: 0.65rem;
        font-weight: 700;
        color: #1B5E20;
        letter-spacing: 0.3px;
        opacity: 0.85;
        font-family: 'Inter', sans-serif;
      }
      .sign-role {
        font-size: 0.5rem;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        margin-top: 1px;
      }

      /* ==========================================================
         RESPONSIVE
      ========================================================= */
      @media (max-width: 850px) {
        .certificate-wrapper {
          padding: 10px;
        }
        .certificate {
          aspect-ratio: auto;
          min-height: 400px;
          padding: 15px;
        }
        .tech-info {
          position: relative;
          left: auto;
          top: auto;
          transform: none;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px 10px;
          border-right: none;
          padding-right: 0;
          margin: 4px 0;
        }
        .tech-item {
          flex: 1 0 45%;
          text-align: center;
          padding: 1px 0;
        }
        .watermark { display: none; }
        .logo-flask { width: 35px; height: 45px; }
        .seal-minimal { width: 40px; height: 40px; }
        .org-name { font-size: 2rem; }
        .cert-student-name { font-size: 2.6rem; max-width: 95%; }
        .cert-project-name { font-size: 1.8rem; }
        .cert-description { max-width: 95%; font-size: 0.8rem; }
        .recognition-text { font-size: 0.7rem; letter-spacing: 1.5px; }
        .recognition-line { width: 20px; }
        .org-subtitle { font-size: 0.6rem; letter-spacing: 4px; }
        .org-motto { font-size: 0.55rem; letter-spacing: 2px; }
        .cert-date { font-size: 0.8rem; }
        .sign-name { font-size: 0.6rem; }
        .sign-role { font-size: 0.45rem; }
        .sign-line.gold { width: 50px; }
        .cert-signatures { gap: 6px; }
      }

      @media (max-width: 600px) {
        .org-name { font-size: 1.4rem; }
        .cert-student-name { font-size: 2rem; }
        .cert-project-name { font-size: 1.4rem; }
        .cert-description { font-size: 0.7rem; }
        .recognition-text { font-size: 0.55rem; letter-spacing: 1px; }
        .sign-name { font-size: 0.55rem; }
        .sign-role { font-size: 0.4rem; }
        .certificate { padding: 10px; }
        .tech-label { font-size: 0.35rem; }
        .tech-value { font-size: 0.5rem; }
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
  //  MÉTODO downloadPDF - FORMATO A4 HORIZONTAL CON FIRMAS VISIBLES
  // ================================================================
  async downloadPDF(): Promise<void> {
    if (!this.credential || !this.project) {
      alert('No hay datos para generar el PDF.');
      return;
    }
    try {
      const container = document.getElementById('certificate-container');
      if (!container) throw new Error('Contenedor no encontrado');

      // Capturar el contenedor con alta resolución
      const canvas = await html2canvas(container, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F2',
        width: container.scrollWidth,
        height: container.scrollHeight
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Tamaño A4 horizontal en mm (297x210) con márgenes de 5 mm
      const pdfWidth = 287;
      const pdfHeight = 200;

      // Calcular factor de escala para que la imagen quepa exactamente en la página
      const scaleX = pdfWidth / canvasWidth;
      const scaleY = pdfHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY); // Escala para que quepa completa

      const finalWidth = canvasWidth * scale;
      const finalHeight = canvasHeight * scale;

      // Centrar la imagen
      const offsetX = (pdfWidth - finalWidth) / 2;
      const offsetY = (pdfHeight - finalHeight) / 2;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Añadir la imagen escalada y centrada
      pdf.addImage(imgData, 'JPEG', offsetX, offsetY, finalWidth, finalHeight);

      pdf.save(`Certificado-${this.project.title.replace(/\s+/g, '-')}.pdf`);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  }
}