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

      <!-- Certificado Premium Tellus V2.0 -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <!-- Contenedor del certificado -->
        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">

              <!-- ========== FONDO TEXTURADO ========== -->
              <div class="cert-bg"></div>

              <!-- ========== MARCA DE AGUA (derecha) ========== -->
              <div class="watermark">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#2e7d32" stop-opacity="0.04"/>
                      <stop offset="100%" stop-color="#1a3a1a" stop-opacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="none" stroke="url(#wmGrad)" stroke-width="1.5"/>
                  <path d="M75 50 L125 50 L145 90 L155 130 Q155 170 100 170 Q45 170 45 130 L55 90 Z" fill="none" stroke="url(#wmGrad)" stroke-width="2"/>
                  <text x="100" y="130" font-family="Georgia, serif" font-size="18" fill="#2e7d32" opacity="0.04" text-anchor="middle">RURAL STEAM LAB</text>
                  <text x="100" y="155" font-family="Georgia, serif" font-size="12" fill="#2e7d32" opacity="0.04" text-anchor="middle" letter-spacing="4">COLOMBIA</text>
                  <!-- Partículas sutiles -->
                  <circle cx="60" cy="60" r="2" fill="#2e7d32" opacity="0.03"/>
                  <circle cx="140" cy="70" r="1.5" fill="#2e7d32" opacity="0.02"/>
                  <circle cx="80" cy="140" r="2" fill="#2e7d32" opacity="0.03"/>
                </svg>
              </div>

              <!-- ========== ENCABEZADO ========== -->
              <div class="cert-header">
                <!-- Logo (matraz) -->
                <div class="logo-flask">
                  <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flaskGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                        <stop offset="100%" stop-color="#e8f5e9" stop-opacity="0.3"/>
                      </linearGradient>
                      <linearGradient id="flaskShine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                      </linearGradient>
                      <filter id="flaskGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <!-- Matraz -->
                    <path d="M30 10 L50 10 L58 40 L68 70 Q68 95 40 95 Q12 95 12 70 L22 40 Z" fill="url(#flaskGlass)" stroke="#2e7d32" stroke-width="1.8" filter="url(#flaskGlow)"/>
                    <!-- Brillo -->
                    <path d="M35 15 L45 15 L52 40 L60 65 Q60 75 40 75 Q20 75 20 65 L28 40 Z" fill="url(#flaskShine)" opacity="0.2"/>
                    <!-- Hojas dentro -->
                    <path d="M38 30 Q48 20 58 30 Q48 40 38 30" fill="#388e3c" opacity="0.85"/>
                    <path d="M32 40 Q42 30 52 40 Q42 50 32 40" fill="#43a047" opacity="0.9"/>
                    <!-- Partículas -->
                    <circle cx="20" cy="22" r="2.5" fill="#66bb6a" opacity="0.6"/>
                    <circle cx="60" cy="20" r="2" fill="#81c784" opacity="0.5"/>
                    <circle cx="16" cy="50" r="2" fill="#a5d6a7" opacity="0.4"/>
                    <circle cx="64" cy="48" r="2.5" fill="#66bb6a" opacity="0.5"/>
                    <circle cx="45" cy="10" r="1.5" fill="#a5d6a7" opacity="0.7"/>
                    <circle cx="25" cy="15" r="1.5" fill="#81c784" opacity="0.4"/>
                  </svg>
                </div>

                <!-- Nombre institucional -->
                <div class="org-name">
                  <span class="rural">Rural</span>
                  <span class="steam">
                    <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                  </span>
                  <span class="lab">Lab</span>
                </div>

                <!-- Sello medalla -->
                <div class="seal-medal">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#f7e9c8"/>
                        <stop offset="50%" stop-color="#d4af37"/>
                        <stop offset="100%" stop-color="#b8942a"/>
                      </linearGradient>
                      <filter id="medalShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.15"/>
                      </filter>
                    </defs>
                    <!-- Círculo exterior -->
                    <circle cx="50" cy="50" r="45" fill="url(#medalGrad)" stroke="#8a6d1b" stroke-width="2" filter="url(#medalShadow)"/>
                    <!-- Círculo interior (relieve) -->
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/>
                    <!-- Texto -->
                    <text x="50" y="40" font-family="Georgia, serif" font-size="8" fill="#3a2a0a" text-anchor="middle" letter-spacing="1.5" font-weight="600">ECOSISTEMA</text>
                    <text x="50" y="56" font-family="Georgia, serif" font-size="10" fill="#2a1a00" text-anchor="middle" letter-spacing="2" font-weight="800">TELLUS</text>
                    <!-- Cintas debajo -->
                    <rect x="20" y="70" width="22" height="5" rx="2" fill="#2e7d32" opacity="0.8"/>
                    <rect x="58" y="70" width="22" height="5" rx="2" fill="#2e7d32" opacity="0.8"/>
                    <!-- Bisel sutil -->
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" stroke-width="0.5" opacity="0.3"/>
                  </svg>
                </div>
              </div>

              <!-- ========== LÍNEA DECORATIVA FINA ========== -->
              <div class="header-divider"></div>

              <!-- ========== TÍTULO ========== -->
              <div class="cert-title">CERTIFICA QUE</div>

              <!-- ========== NOMBRE DEL PARTICIPANTE ========== -->
              <div class="cert-student-name">{{ project.studentName || 'Nombre del Participante' }}</div>
              <div class="gold-line"></div>

              <!-- ========== DESCRIPCIÓN ========== -->
              <div class="cert-description">
                ha desarrollado y publicado exitosamente el proyecto
              </div>

              <!-- ========== NOMBRE DEL PROYECTO ========== -->
              <div class="cert-project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>
              <div class="gold-line-short"></div>

              <!-- ========== TEXTO DESCRIPTIVO ========== -->
              <div class="cert-text">
                en el <strong>Ecosistema Tellus</strong>, demostrando creatividad, compromiso, pensamiento científico y espíritu de innovación.
              </div>

              <!-- ========== BANDA DE RECONOCIMIENTO ========== -->
              <div class="recognition-band">
                <svg class="laurel-left" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2 Q10 0 5 5 Q2 10 8 15 Q12 18 18 16 Q14 12 16 8 Q18 5 20 2" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                  <path d="M20 2 Q30 0 35 5 Q38 10 32 15 Q28 18 22 16 Q26 12 24 8 Q22 5 20 2" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                  <circle cx="20" cy="2" r="1.5" fill="#d4af37" opacity="0.6"/>
                </svg>
                <span class="recognition-text">RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA</span>
                <svg class="laurel-right" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2 Q10 0 5 5 Q2 10 8 15 Q12 18 18 16 Q14 12 16 8 Q18 5 20 2" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                  <path d="M20 2 Q30 0 35 5 Q38 10 32 15 Q28 18 22 16 Q26 12 24 8 Q22 5 20 2" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                  <circle cx="20" cy="2" r="1.5" fill="#d4af37" opacity="0.6"/>
                </svg>
              </div>

              <!-- ========== FECHA ========== -->
              <div class="cert-date">
                Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong>
              </div>

              <!-- ========== COLUMNA IZQUIERDA (tarjeta tecnológica) ========== -->
              <div class="tech-card">
                <div class="tech-item">
                  <span class="tech-label">ID DE CERTIFICADO</span>
                  <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">CÓDIGO DE VERIFICACIÓN</span>
                  <span class="tech-value">{{ credential.verificationCode || 'A1B2-C3D4-E5F6' }}</span>
                </div>
                <div class="tech-divider"></div>
                <!-- QR Code premium -->
                <div class="qr-premium">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1a3a1a"/>
                        <stop offset="100%" stop-color="#2e7d32"/>
                      </linearGradient>
                    </defs>
                    <!-- Fondo blanco con esquinas redondeadas -->
                    <rect x="5" y="5" width="90" height="90" rx="8" fill="white" stroke="#e0e0e0" stroke-width="0.5"/>
                    <!-- Patrón QR simplificado (simulación) -->
                    <rect x="15" y="15" width="20" height="20" rx="3" fill="url(#qrGrad)"/>
                    <rect x="15" y="40" width="10" height="20" rx="2" fill="url(#qrGrad)"/>
                    <rect x="30" y="40" width="10" height="10" rx="2" fill="url(#qrGrad)"/>
                    <rect x="45" y="15" width="15" height="15" rx="2" fill="url(#qrGrad)"/>
                    <rect x="45" y="35" width="15" height="25" rx="2" fill="url(#qrGrad)"/>
                    <rect x="65" y="15" width="20" height="20" rx="3" fill="url(#qrGrad)"/>
                    <rect x="65" y="40" width="10" height="20" rx="2" fill="url(#qrGrad)"/>
                    <rect x="80" y="40" width="10" height="10" rx="2" fill="url(#qrGrad)"/>
                    <rect x="15" y="65" width="20" height="15" rx="2" fill="url(#qrGrad)"/>
                    <rect x="40" y="65" width="15" height="15" rx="2" fill="url(#qrGrad)"/>
                    <rect x="60" y="65" width="30" height="15" rx="2" fill="url(#qrGrad)"/>
                    <rect x="15" y="85" width="10" height="5" rx="1" fill="url(#qrGrad)"/>
                    <rect x="30" y="85" width="20" height="5" rx="1" fill="url(#qrGrad)"/>
                    <rect x="65" y="85" width="20" height="5" rx="1" fill="url(#qrGrad)"/>
                    <!-- Logo Tellus en el centro del QR -->
                    <circle cx="50" cy="50" r="8" fill="white" stroke="#d4af37" stroke-width="1.5"/>
                    <text x="50" y="53" font-family="Georgia, serif" font-size="6" fill="#1a3a1a" text-anchor="middle" font-weight="700">T</text>
                  </svg>
                </div>
                <div class="tech-item verify-link">
                  <span class="tech-label">VERIFICA ESTE CERTIFICADO EN</span>
                  <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                </div>
              </div>

              <!-- ========== FIRMAS ========== -->
              <div class="cert-signatures">
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Henson Alberto Medina Castillo</div>
                  <div class="sign-role">Liderazgo Tecnológico y Desarrollo</div>
                  <div class="sign-micro"></div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Uberto Manuel Gómez López</div>
                  <div class="sign-role">Liderazgo Académico e Investigación</div>
                  <div class="sign-micro"></div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Diana Marcela Alfonso Montañez</div>
                  <div class="sign-role">Liderazgo de Implementación y Calidad</div>
                  <div class="sign-micro"></div>
                </div>
              </div>

              <!-- ========== MICRODETALLES (hexágonos, líneas, etc.) ========== -->
              <div class="micro-left">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="20 2 38 12 38 28 20 38 2 28 2 12" fill="none" stroke="#2e7d32" stroke-width="0.5" opacity="0.08"/>
                  <circle cx="20" cy="20" r="4" fill="none" stroke="#2e7d32" stroke-width="0.3" opacity="0.05"/>
                </svg>
              </div>
              <div class="micro-right">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="20 2 38 12 38 28 20 38 2 28 2 12" fill="none" stroke="#2e7d32" stroke-width="0.5" opacity="0.08"/>
                  <circle cx="20" cy="20" r="4" fill="none" stroke="#2e7d32" stroke-width="0.3" opacity="0.05"/>
                </svg>
              </div>

            </div> <!-- fin certificate -->
          </div> <!-- fin certificate-wrapper -->
        </div> <!-- fin certificate-preview -->

        <!-- ========== BOTONES ========== -->
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
         CERTIFICADO PREMIUM V2.0 - HORIZONTAL
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .certificate-wrapper {
        background: #fcf9f3;
        padding: 30px 30px;
        border-radius: 16px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 1000px;
      }
      .certificate {
        position: relative;
        background: #fcf9f3;
        padding: 25px 30px 20px 30px;
        border-radius: 8px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #1a2e1a;
        overflow: hidden;
        min-height: 480px;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(192, 168, 106, 0.15);
        box-shadow: inset 0 0 40px rgba(255, 255, 255, 0.3);
      }

      /* ========== FONDO TEXTURADO ========== */
      .cert-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
          radial-gradient(circle at 20% 30%, rgba(200, 200, 200, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(200, 200, 200, 0.03) 0%, transparent 60%),
          repeating-linear-gradient(45deg, rgba(200,200,200,0.02) 0px, rgba(200,200,200,0.02) 2px, transparent 2px, transparent 6px);
        pointer-events: none;
        opacity: 0.6;
        z-index: 0;
      }

      /* ========== MARCA DE AGUA ========== */
      .watermark {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 200px;
        height: 200px;
        opacity: 0.15;
        pointer-events: none;
        z-index: 0;
      }
      .watermark svg {
        width: 100%;
        height: 100%;
      }

      /* ========== ENCABEZADO ========== */
      .cert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 8px 0;
        position: relative;
        z-index: 1;
      }
      .logo-flask {
        width: 65px;
        height: 80px;
        flex-shrink: 0;
      }
      .logo-flask svg {
        width: 100%;
        height: 100%;
      }
      .org-name {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: 1px;
        font-family: 'Georgia', serif;
        color: #1a3a1a;
        text-align: center;
        flex: 1;
      }
      .org-name .rural { color: #1a3a1a; }
      .org-name .steam { font-weight: 800; }
      .org-name .s { color: #1976d2; }
      .org-name .t { color: #00bcd4; }
      .org-name .e { color: #fdd835; }
      .org-name .a { color: #f57c00; }
      .org-name .m { color: #388e3c; }
      .org-name .lab { color: #1a3a1a; }

      .seal-medal {
        width: 70px;
        height: 70px;
        flex-shrink: 0;
      }
      .seal-medal svg {
        width: 100%;
        height: 100%;
      }

      .header-divider {
        border: none;
        border-top: 1px solid rgba(192, 168, 106, 0.15);
        margin: 2px 0 10px 0;
        position: relative;
        z-index: 1;
      }

      /* ========== TÍTULO ========== */
      .cert-title {
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 8px;
        text-transform: uppercase;
        color: #1a2e1a;
        margin: 6px 0 4px 0;
        opacity: 0.7;
        text-align: center;
        position: relative;
        z-index: 1;
      }

      /* ========== NOMBRE ========== */
      .cert-student-name {
        font-size: 2.8rem;
        font-weight: 400;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #0a1a0a;
        text-align: center;
        letter-spacing: 2px;
        margin: 0 0 2px 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.02);
        position: relative;
        z-index: 1;
        font-style: italic;
      }
      .gold-line {
        width: 120px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #d4af37, transparent);
        margin: 0 auto 4px auto;
        border-radius: 2px;
      }

      /* ========== DESCRIPCIÓN ========== */
      .cert-description {
        font-size: 1rem;
        color: #2a3a2a;
        text-align: center;
        margin: 6px 0 2px 0;
        font-family: 'Georgia', serif;
        position: relative;
        z-index: 1;
      }

      /* ========== PROYECTO ========== */
      .cert-project-name {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a3a1a;
        text-align: center;
        font-style: italic;
        margin: 2px 0 2px 0;
        position: relative;
        z-index: 1;
      }
      .gold-line-short {
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #d4af37, transparent);
        margin: 0 auto 6px auto;
        border-radius: 2px;
      }

      /* ========== TEXTO DESCRIPTIVO ========== */
      .cert-text {
        font-size: 0.9rem;
        color: #3a4a3a;
        text-align: center;
        max-width: 70%;
        margin: 4px auto 8px auto;
        line-height: 1.5;
        font-family: 'Georgia', serif;
        position: relative;
        z-index: 1;
      }

      /* ========== BANDA DE RECONOCIMIENTO ========== */
      .recognition-band {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: 6px 0 4px 0;
        position: relative;
        z-index: 1;
      }
      .recognition-band .laurel-left,
      .recognition-band .laurel-right {
        width: 40px;
        height: 20px;
        flex-shrink: 0;
      }
      .recognition-band .recognition-text {
        font-size: 0.9rem;
        font-weight: 700;
        color: #1a2e1a;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 2px 14px;
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        font-family: 'Georgia', serif;
      }

      /* ========== FECHA ========== */
      .cert-date {
        font-size: 0.9rem;
        color: #2a3a2a;
        text-align: center;
        margin: 2px 0 8px 0;
        position: relative;
        z-index: 1;
      }

      /* ========== COLUMNA IZQUIERDA (tarjeta tecnológica) ========== */
      .tech-card {
        position: absolute;
        left: 18px;
        top: 110px;
        bottom: 50px;
        width: 155px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(2px);
        border-radius: 12px;
        padding: 12px 10px;
        border: 1px solid rgba(192, 168, 106, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        gap: 4px;
        z-index: 1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
      }
      .tech-item {
        text-align: center;
        padding: 2px 0;
      }
      .tech-label {
        font-size: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #5a7a5a;
        display: block;
        font-weight: 500;
      }
      .tech-value {
        font-size: 0.7rem;
        font-weight: 700;
        color: #1a2e1a;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-all;
        line-height: 1.2;
      }
      .tech-value.url {
        font-size: 0.55rem;
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #1a3a1a;
      }
      .tech-divider {
        border: none;
        border-top: 1px solid rgba(192, 168, 106, 0.1);
        margin: 2px 0;
      }
      .qr-premium {
        display: flex;
        justify-content: center;
        margin: 2px 0;
      }
      .qr-premium svg {
        width: 65px;
        height: 65px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        background: white;
      }
      .verify-link {
        margin-top: 2px;
      }

      /* ========== FIRMAS ========== */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: auto;
        padding-top: 10px;
        border-top: 1px solid rgba(192, 168, 106, 0.1);
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
        background: linear-gradient(90deg, #d4af37, #b8942a);
        margin: 0 auto 4px auto;
        border-radius: 2px;
        box-shadow: 0 1px 4px rgba(212, 175, 55, 0.15);
      }
      .sign-name {
        font-size: 0.7rem;
        font-weight: 700;
        color: #1a2e1a;
        letter-spacing: 0.3px;
      }
      .sign-role {
        font-size: 0.5rem;
        color: #5a7a5a;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
      }
      .sign-micro {
        width: 20px;
        height: 1px;
        background: #d4af37;
        margin: 4px auto 0 auto;
        opacity: 0.2;
      }

      /* ========== MICRODETALLES ========== */
      .micro-left {
        position: absolute;
        left: 8px;
        bottom: 8px;
        opacity: 0.08;
        z-index: 0;
        width: 30px;
        height: 30px;
      }
      .micro-right {
        position: absolute;
        right: 8px;
        bottom: 8px;
        opacity: 0.08;
        z-index: 0;
        width: 30px;
        height: 30px;
      }

      /* ==========================================================
         RESPONSIVE (ajustes para móviles)
      ========================================================= */
      @media (max-width: 850px) {
        .tech-card {
          position: relative;
          left: auto;
          top: auto;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          background: none;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
          margin: 6px 0;
        }
        .tech-item {
          flex: 1 0 45%;
          text-align: center;
        }
        .tech-divider {
          display: none;
        }
        .qr-premium {
          flex: 0 0 100%;
          justify-content: center;
        }
        .watermark { display: none; }
        .logo-flask { width: 40px; height: 50px; }
        .seal-medal { width: 50px; height: 50px; }
        .org-name { font-size: 1.6rem; }
        .cert-student-name { font-size: 2rem; }
        .cert-project-name { font-size: 1.4rem; }
        .cert-text { max-width: 100%; }
        .certificate { padding: 15px; }
        .cert-signatures { flex-direction: column; align-items: center; }
        .signature { min-width: auto; width: 100%; }
        .recognition-band .recognition-text { font-size: 0.7rem; letter-spacing: 1px; }
        .recognition-band .laurel-left,
        .recognition-band .laurel-right { width: 25px; }
        .micro-left, .micro-right { display: none; }
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
        backgroundColor: '#fcf9f3',
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