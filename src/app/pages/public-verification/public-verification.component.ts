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

        <!-- Contenedor del certificado (vista y PDF) -->
        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">

              <!-- ========== MARCO PRINCIPAL ========== -->
              <div class="cert-border">

                <!-- ========== FONDO TEXTURADO ========== -->
                <div class="cert-bg"></div>

                <!-- ========== MATRAZ (icono superior izquierdo) ========== -->
                <div class="icon-flask">
                  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e8f5e9" stop-opacity="0.6"/>
                        <stop offset="100%" stop-color="#a5d6a7" stop-opacity="0.2"/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <!-- Matraz -->
                    <path d="M40 10 L60 10 L70 50 L80 80 Q80 110 50 110 Q20 110 20 80 L30 50 Z" fill="url(#flaskGrad)" stroke="#2e7d32" stroke-width="2" filter="url(#glow)"/>
                    <!-- Hojas dentro -->
                    <path d="M45 40 Q55 30 65 40 Q55 50 45 40" fill="#388e3c" opacity="0.8"/>
                    <path d="M40 50 Q50 40 60 50 Q50 60 40 50" fill="#43a047" opacity="0.9"/>
                    <!-- Partículas luminosas -->
                    <circle cx="30" cy="30" r="2" fill="#66bb6a" opacity="0.6"/>
                    <circle cx="70" cy="25" r="1.5" fill="#81c784" opacity="0.5"/>
                    <circle cx="25" cy="60" r="1.5" fill="#a5d6a7" opacity="0.4"/>
                    <circle cx="75" cy="55" r="2" fill="#66bb6a" opacity="0.5"/>
                  </svg>
                </div>

                <!-- ========== SELLO (superior derecho) ========== -->
                <div class="seal-premium">
                  <div class="seal-circle">
                    <div class="seal-inner">
                      <span class="seal-text">ECOSISTEMA</span>
                      <span class="seal-text-bold">TELLUS</span>
                      <div class="seal-ribbons"></div>
                    </div>
                  </div>
                </div>

                <!-- ========== ENCABEZADO CENTRAL ========== -->
                <div class="cert-header">
                  <div class="org-name">
                    <span class="rural">Rural</span>
                    <span class="steam">
                      <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                    </span>
                    <span class="lab">Lab</span>
                  </div>
                  <div class="org-country">
                    <span class="line-left"></span>
                    COLOMBIA
                    <span class="line-right"></span>
                  </div>
                  <div class="org-slogan">INVESTIGA • INNOVA • TRANSFORMA</div>
                </div>

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

                <!-- ========== RECONOCIMIENTO ========== -->
                <div class="cert-recognition">
                  <span class="laurel-left">🏛️</span>
                  RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA
                  <span class="laurel-right">🏛️</span>
                </div>

                <!-- ========== FECHA ========== -->
                <div class="cert-date">
                  Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong>
                </div>

                <!-- ========== COLUMNA IZQUIERDA (ID, código, QR) ========== -->
                <div class="cert-left-column">
                  <div class="cert-id-block">
                    <span class="label">ID DE CERTIFICADO</span>
                    <span class="value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                  </div>
                  <div class="cert-code-block">
                    <span class="label">CÓDIGO DE VERIFICACIÓN</span>
                    <span class="value">{{ credential.verificationCode || 'A1B2-C3D4-E5F6' }}</span>
                  </div>
                  <div class="qr-code">
                    <!-- Simulación de QR (en realidad deberías generar un QR con librería) -->
                    <svg viewBox="0 0 100 100" width="80" height="80">
                      <rect width="100" height="100" fill="white"/>
                      <path d="M10 10 h30 v30 h-30 z M10 60 h30 v30 h-30 z M60 10 h30 v30 h-30 z M60 60 h15 v15 h-15 z M80 60 h10 v10 h-10 z M60 80 h10 v10 h-10 z M80 80 h10 v10 h-10 z" fill="#1a2e1a"/>
                    </svg>
                  </div>
                  <div class="verify-link">
                    <span>VERIFICA ESTE CERTIFICADO EN</span>
                    <span class="url">tellus.ruralsteamlab.com/verificar</span>
                  </div>
                </div>

                <!-- ========== MARCA DE AGUA (derecha) ========== -->
                <div class="watermark">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#2e7d32" stroke-width="1" opacity="0.08"/>
                    <path d="M70 40 L130 40 L150 80 L160 120 Q160 160 100 160 Q40 160 40 120 L50 80 Z" fill="none" stroke="#2e7d32" stroke-width="1.5" opacity="0.06"/>
                    <text x="100" y="110" font-family="Georgia" font-size="18" fill="#2e7d32" opacity="0.06" text-anchor="middle">RURAL STEAM LAB</text>
                    <text x="100" y="135" font-family="Georgia" font-size="12" fill="#2e7d32" opacity="0.06" text-anchor="middle">COLOMBIA</text>
                  </svg>
                </div>

                <!-- ========== FIRMAS ========== -->
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

              </div> <!-- fin cert-border -->
            </div> <!-- fin certificate -->
          </div> <!-- fin certificate-wrapper -->
        </div> <!-- fin certificate-preview -->

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
         CERTIFICADO PREMIUM - DISEÑO HORIZONTAL
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
        padding: 20px;
        border-radius: 8px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #1a2e1a;
        overflow: hidden;
      }

      /* ========== MARCO DOBLE CON ESQUINAS ========== */
      .cert-border {
        position: relative;
        border: 2px solid #c0a86a;
        border-radius: 12px;
        padding: 30px 35px 25px 35px;
        background: #fffcf8;
        box-shadow: inset 0 0 30px rgba(192, 168, 106, 0.05);
        min-height: 480px;
        display: flex;
        flex-direction: column;
      }
      .cert-border::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 6px;
        right: 6px;
        bottom: 6px;
        border: 1px solid #c0a86a;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0.3;
      }

      /* Esquinas ornamentales (simuladas con pseudo-elementos) */
      .cert-border::after {
        content: '';
        position: absolute;
        top: -8px;
        left: -8px;
        width: 40px;
        height: 40px;
        border-top: 4px solid #2e7d32;
        border-left: 4px solid #2e7d32;
        border-radius: 12px 0 0 0;
        box-shadow: -2px -2px 8px rgba(46, 125, 50, 0.1);
        background: linear-gradient(135deg, rgba(46,125,50,0.05) 0%, transparent 70%);
      }
      /* Las otras esquinas se pueden agregar con más pseudo-elementos o usar un SVG */
      /* Por simplicidad, usamos un div decorativo */
      .cert-border .corner-tr {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 40px;
        height: 40px;
        border-top: 4px solid #2e7d32;
        border-right: 4px solid #2e7d32;
        border-radius: 0 12px 0 0;
        box-shadow: 2px -2px 8px rgba(46, 125, 50, 0.1);
        background: linear-gradient(225deg, rgba(46,125,50,0.05) 0%, transparent 70%);
      }
      .cert-border .corner-bl {
        position: absolute;
        bottom: -8px;
        left: -8px;
        width: 40px;
        height: 40px;
        border-bottom: 4px solid #2e7d32;
        border-left: 4px solid #2e7d32;
        border-radius: 0 0 0 12px;
        box-shadow: -2px 2px 8px rgba(46, 125, 50, 0.1);
        background: linear-gradient(45deg, rgba(46,125,50,0.05) 0%, transparent 70%);
      }
      .cert-border .corner-br {
        position: absolute;
        bottom: -8px;
        right: -8px;
        width: 40px;
        height: 40px;
        border-bottom: 4px solid #2e7d32;
        border-right: 4px solid #2e7d32;
        border-radius: 0 0 12px 0;
        box-shadow: 2px 2px 8px rgba(46, 125, 50, 0.1);
        background: linear-gradient(315deg, rgba(46,125,50,0.05) 0%, transparent 70%);
      }

      /* Fondo texturizado (papel algodón) */
      .cert-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
          radial-gradient(circle at 20% 30%, rgba(200, 200, 200, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(200, 200, 200, 0.02) 0%, transparent 50%);
        pointer-events: none;
        opacity: 0.5;
      }

      /* ========== MATRAZ (icono) ========== */
      .icon-flask {
        position: absolute;
        top: 10px;
        left: 15px;
        width: 70px;
        height: 80px;
        z-index: 2;
      }
      .icon-flask svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 4px 8px rgba(46, 125, 50, 0.1));
      }

      /* ========== SELLO PREMIUM ========== */
      .seal-premium {
        position: absolute;
        top: 10px;
        right: 15px;
        z-index: 2;
        width: 80px;
        height: 80px;
      }
      .seal-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #f7e9c8, #d4af37);
        border: 3px solid #b8942a;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 6px;
      }
      .seal-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 7px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #3a2a0a;
        font-weight: 600;
        line-height: 1.2;
      }
      .seal-text {
        font-size: 7px;
        letter-spacing: 1px;
      }
      .seal-text-bold {
        font-size: 9px;
        font-weight: 800;
        color: #2a1a00;
        letter-spacing: 1.5px;
        margin: 2px 0;
      }
      .seal-ribbons {
        width: 30px;
        height: 6px;
        background: linear-gradient(to right, #2e7d32, #43a047, #2e7d32);
        border-radius: 2px;
        margin-top: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      /* ========== ENCABEZADO CENTRAL ========== */
      .cert-header {
        text-align: center;
        margin-bottom: 6px;
        margin-top: 0;
        position: relative;
        z-index: 1;
      }
      .org-name {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: 1px;
        font-family: 'Georgia', serif;
        color: #1a3a1a;
      }
      .org-name .rural { color: #1a3a1a; }
      .org-name .steam { font-weight: 800; }
      .org-name .s { color: #1976d2; }
      .org-name .t { color: #00bcd4; }
      .org-name .e { color: #fdd835; }
      .org-name .a { color: #f57c00; }
      .org-name .m { color: #388e3c; }
      .org-name .lab { color: #1a3a1a; }

      .org-country {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 8px;
        color: #2a4a2a;
        margin: 4px 0;
      }
      .org-country .line-left,
      .org-country .line-right {
        width: 60px;
        height: 1px;
        background: #2a4a2a;
        opacity: 0.3;
      }

      .org-slogan {
        font-size: 0.75rem;
        letter-spacing: 4px;
        color: #1a3a1a;
        font-weight: 500;
        text-transform: uppercase;
        opacity: 0.7;
        margin-top: 2px;
      }

      /* ========== TÍTULO ========== */
      .cert-title {
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 6px;
        text-transform: uppercase;
        color: #1a2e1a;
        margin: 10px 0 6px 0;
        opacity: 0.8;
        text-align: center;
        position: relative;
        z-index: 1;
      }

      /* ========== NOMBRE ========== */
      .cert-student-name {
        font-size: 2.8rem;
        font-weight: 700;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #0a1a0a;
        text-align: center;
        letter-spacing: 2px;
        margin: 2px 0 0 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.02);
        position: relative;
        z-index: 1;
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
        max-width: 80%;
        margin: 4px auto 8px auto;
        line-height: 1.5;
        font-family: 'Georgia', serif;
        position: relative;
        z-index: 1;
      }

      /* ========== RECONOCIMIENTO ========== */
      .cert-recognition {
        font-size: 1.0rem;
        font-weight: 700;
        color: #1a2e1a;
        text-align: center;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 8px 0 6px 0;
        padding: 4px 10px;
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        display: inline-block;
        align-self: center;
        position: relative;
        z-index: 1;
      }
      .cert-recognition .laurel-left,
      .cert-recognition .laurel-right {
        font-size: 1.2rem;
        margin: 0 10px;
        opacity: 0.6;
      }

      /* ========== FECHA ========== */
      .cert-date {
        font-size: 0.9rem;
        color: #2a3a2a;
        text-align: center;
        margin: 4px 0 10px 0;
        position: relative;
        z-index: 1;
      }

      /* ========== COLUMNA IZQUIERDA ========== */
      .cert-left-column {
        position: absolute;
        left: 20px;
        top: 90px;
        bottom: 40px;
        width: 160px;
        border-right: 1px solid rgba(212, 175, 55, 0.2);
        padding-right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
        z-index: 1;
      }
      .cert-left-column .label {
        font-size: 0.55rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #5a7a5a;
        display: block;
      }
      .cert-left-column .value {
        font-size: 0.75rem;
        font-weight: 700;
        color: #1a2e1a;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-all;
      }
      .cert-left-column .qr-code {
        margin: 6px 0;
        display: flex;
        justify-content: center;
      }
      .cert-left-column .qr-code svg {
        width: 60px;
        height: 60px;
        border: 1px solid #e0e0e0;
        background: white;
        border-radius: 4px;
      }
      .cert-left-column .verify-link {
        font-size: 0.5rem;
        color: #5a7a5a;
        text-align: center;
        margin-top: 4px;
      }
      .cert-left-column .verify-link .url {
        font-weight: 700;
        color: #1a2e1a;
        display: block;
        font-size: 0.6rem;
        word-break: break-all;
      }

      /* ========== MARCA DE AGUA (derecha) ========== */
      .watermark {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 180px;
        height: 180px;
        opacity: 0.15;
        pointer-events: none;
        z-index: 0;
      }
      .watermark svg {
        width: 100%;
        height: 100%;
      }

      /* ========== FIRMAS ========== */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid rgba(212, 175, 55, 0.15);
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
        gap: 10px;
      }
      .signature {
        text-align: center;
        flex: 1;
        min-width: 140px;
      }
      .sign-line.gold {
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, #d4af37, #b8942a);
        margin: 0 auto 4px auto;
        border-radius: 2px;
        box-shadow: 0 1px 4px rgba(212, 175, 55, 0.2);
      }
      .sign-name {
        font-size: 0.75rem;
        font-weight: 700;
        color: #1a2e1a;
        letter-spacing: 0.5px;
      }
      .sign-role {
        font-size: 0.55rem;
        color: #5a7a5a;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* ==========================================================
         BOTONES Y RESPONSIVE
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

      /* Responsive */
      @media (max-width: 850px) {
        .cert-left-column {
          position: relative;
          left: auto;
          top: auto;
          width: 100%;
          border-right: none;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          padding: 0;
          margin: 10px 0;
        }
        .cert-left-column > div {
          flex: 1 0 45%;
          text-align: center;
        }
        .cert-left-column .qr-code {
          flex: 0 0 100%;
        }
        .watermark { display: none; }
        .icon-flask { width: 40px; height: 50px; top: 5px; left: 8px; }
        .seal-premium { width: 50px; height: 50px; top: 5px; right: 8px; }
        .seal-circle { width: 50px; height: 50px; }
        .seal-text { font-size: 5px; }
        .seal-text-bold { font-size: 6px; }
        .org-name { font-size: 1.6rem; }
        .cert-student-name { font-size: 2rem; }
        .cert-project-name { font-size: 1.4rem; }
        .cert-text { max-width: 100%; }
        .cert-border { padding: 20px 15px; }
        .cert-signatures { flex-direction: column; align-items: center; }
        .signature { min-width: auto; width: 100%; }
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