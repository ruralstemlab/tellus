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

      <!-- Certificado Tellus - Premium A4 Horizontal -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>

        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate">

              <!-- ========== FONDO PREMIUM ========== -->
              <div class="cert-bg">
                <!-- Ondas sutiles -->
                <div class="waves">
                  <svg viewBox="0 0 1200 800" preserveAspectRatio="none" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                    <path d="M0,200 C300,100 500,400 800,200 C1000,100 1100,300 1200,200 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.02"/>
                    <path d="M0,350 C200,250 400,500 700,300 C900,200 1050,400 1200,300 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.015"/>
                    <path d="M0,500 C250,400 450,650 750,450 C950,350 1100,550 1200,450 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.01"/>
                  </svg>
                </div>
                <!-- Partículas -->
                <div class="particles">
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>

              <!-- ========== MARCA DE AGUA (refinada) ========== -->
              <div class="watermark">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#1B5E20" stop-opacity="0.06"/>
                      <stop offset="100%" stop-color="#1B5E20" stop-opacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <path d="M75 40 L125 40 L145 80 L155 120 Q155 160 100 160 Q45 160 45 120 L55 80 Z" fill="none" stroke="url(#wmGrad)" stroke-width="2"/>
                  <text x="100" y="140" font-family="Cinzel, serif" font-size="16" fill="#1B5E20" opacity="0.04" text-anchor="middle" letter-spacing="4">TELLUS</text>
                  <!-- Partículas en la marca de agua -->
                  <circle cx="80" cy="70" r="3" fill="#1B5E20" opacity="0.03"/>
                  <circle cx="120" cy="80" r="2" fill="#1B5E20" opacity="0.02"/>
                </svg>
              </div>

              <!-- ========== ENCABEZADO (con matraz premium) ========== -->
              <div class="cert-header">
                <div class="logo-flask">
                  <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flaskGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                        <stop offset="50%" stop-color="#d8ffd8" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#8fdc6d" stop-opacity="0.1"/>
                      </linearGradient>
                      <linearGradient id="flaskOutline" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#8cff00"/>
                        <stop offset="100%" stop-color="#1d5d16"/>
                      </linearGradient>
                      <filter id="flaskGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <!-- Resplandor base -->
                    <ellipse cx="40" cy="85" rx="30" ry="10" fill="#4cff9c" opacity="0.15" filter="url(#flaskGlow)"/>
                    <!-- Matraz -->
                    <path d="M30 10 L50 10 L58 40 L68 70 Q68 95 40 95 Q12 95 12 70 L22 40 Z" fill="url(#flaskGlass)" stroke="url(#flaskOutline)" stroke-width="1.8" filter="url(#flaskGlow)"/>
                    <!-- Reflejo -->
                    <path d="M35 15 L45 15 L52 40 L60 65 Q60 75 40 75 Q20 75 20 65 L28 40 Z" fill="#ffffff" opacity="0.15"/>
                    <!-- Hojas -->
                    <path d="M38 30 Q48 20 58 30 Q48 40 38 30" fill="#388e3c" opacity="0.85"/>
                    <path d="M32 40 Q42 30 52 40 Q42 50 32 40" fill="#43a047" opacity="0.9"/>
                    <!-- Tallo -->
                    <path d="M40 50 L40 30" stroke="#1B5E20" stroke-width="1.5" opacity="0.4"/>
                    <!-- Partículas -->
                    <circle cx="20" cy="22" r="2.5" fill="#66bb6a" opacity="0.6"/>
                    <circle cx="60" cy="20" r="2" fill="#81c784" opacity="0.5"/>
                    <circle cx="16" cy="50" r="2" fill="#a5d6a7" opacity="0.4"/>
                    <circle cx="64" cy="48" r="2.5" fill="#66bb6a" opacity="0.5"/>
                  </svg>
                </div>

                <div class="org-name">
                  <span class="rural">Rural</span>
                  <span class="steam">
                    <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                  </span>
                  <span class="lab">Lab</span>
                </div>

                <div class="org-subtitle">COLOMBIA</div>
                <div class="org-motto">INVESTIGA · INNOVA · TRANSFORMA</div>

                <!-- ===== SELLO PREMIUM (rediseñado) ===== -->
                <div class="seal-premium">
                  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#f7e9c8"/>
                        <stop offset="50%" stop-color="#d4af37"/>
                        <stop offset="100%" stop-color="#b8942a"/>
                      </linearGradient>
                      <filter id="sealShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.15"/>
                      </filter>
                    </defs>
                    <circle cx="40" cy="40" r="36" fill="url(#sealGold)" stroke="#8a6d1b" stroke-width="2" filter="url(#sealShadow)"/>
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/>
                    <text x="40" y="32" font-family="Cinzel, serif" font-size="8" fill="#3a2a0a" text-anchor="middle" letter-spacing="1.5" font-weight="700">ECOSISTEMA</text>
                    <text x="40" y="48" font-family="Cinzel, serif" font-size="10" fill="#2a1a00" text-anchor="middle" letter-spacing="2" font-weight="800">TELLUS</text>
                    <!-- Cintas -->
                    <rect x="15" y="64" width="18" height="4" rx="2" fill="#1B5E20" opacity="0.8"/>
                    <rect x="47" y="64" width="18" height="4" rx="2" fill="#1B5E20" opacity="0.8"/>
                    <!-- Bisel -->
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#fff" stroke-width="0.5" opacity="0.2"/>
                  </svg>
                </div>
              </div>

              <div class="header-divider"></div>

              <!-- ========== NOMBRE DEL PARTICIPANTE ========== -->
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

              <!-- ========== COLUMNA IZQUIERDA (técnica, elegante) ========== -->
              <div class="tech-info">
                <div class="tech-item">
                  <span class="tech-label">ID de Certificado</span>
                  <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-item">
                  <span class="tech-label">Código de Verificación</span>
                  <span class="tech-value">{{ credential.verificationCode || '2BD2643-454A-4043' }}</span>
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
                <div class="tech-item verify-link">
                  <span class="tech-label">Verificar en</span>
                  <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                </div>
              </div>

              <!-- ========== FIRMAS ========== -->
              <div class="cert-signatures">
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Henson Alberto Medina Castillo</div>
                  <div class="sign-role">Director General</div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Uberto Manuel Gómez López</div>
                  <div class="sign-role">Director Académico</div>
                </div>
                <div class="signature">
                  <div class="sign-line gold"></div>
                  <div class="sign-name">Diana Marcela Alfonso Montañez</div>
                  <div class="sign-role">Directora de Operaciones</div>
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
         CERTIFICADO - FORMATO A4 HORIZONTAL (1.414:1)
      ========================================================= */
      .certificate-preview {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 20px 20px;
        border-radius: 16px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 1000px;
        aspect-ratio: 1.414 / 1;  /* A4 horizontal: 297/210 ≈ 1.414 */
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .certificate {
        position: relative;
        background: #FAF8F2;
        padding: 20px 30px 18px 30px;
        border-radius: 8px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #1B5E20;
        overflow: hidden;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 0.8px solid rgba(200, 162, 74, 0.25);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 0 40px rgba(200, 162, 74, 0.03);
      }

      /* ===== FONDO PREMIUM ===== */
      .cert-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .waves {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
      }
      .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .particles span {
        position: absolute;
        display: block;
        width: 4px;
        height: 4px;
        background: #1B5E20;
        border-radius: 50%;
        opacity: 0.04;
        animation: float 20s infinite alternate ease-in-out;
      }
      .particles span:nth-child(1) { top: 10%; left: 20%; animation-duration: 18s; }
      .particles span:nth-child(2) { top: 30%; left: 80%; animation-duration: 22s; }
      .particles span:nth-child(3) { top: 50%; left: 10%; animation-duration: 25s; }
      .particles span:nth-child(4) { top: 70%; left: 90%; animation-duration: 20s; }
      .particles span:nth-child(5) { top: 20%; left: 60%; animation-duration: 19s; }
      .particles span:nth-child(6) { top: 60%; left: 30%; animation-duration: 23s; }
      .particles span:nth-child(7) { top: 80%; left: 50%; animation-duration: 21s; }
      .particles span:nth-child(8) { top: 40%; left: 70%; animation-duration: 17s; }
      .particles span:nth-child(9) { top: 15%; left: 40%; animation-duration: 24s; }
      .particles span:nth-child(10) { top: 75%; left: 15%; animation-duration: 20s; }
      .particles span:nth-child(11) { top: 45%; left: 50%; animation-duration: 22s; }
      .particles span:nth-child(12) { top: 85%; left: 75%; animation-duration: 18s; }

      @keyframes float {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(30px, -30px) scale(1.5); }
      }

      /* ===== MARCA DE AGUA ===== */
      .watermark {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 130px;
        height: 130px;
        opacity: 0.15;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 15px 0;
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
        flex-shrink: 0;
      }

      .logo-flask {
        width: 45px;
        height: 55px;
        flex-shrink: 0;
        opacity: 0.85;
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
        color: #888;
        font-family: 'Inter', sans-serif;
        width: 100%;
        font-weight: 400;
      }
      .org-motto {
        text-align: center;
        font-size: 0.65rem;
        letter-spacing: 2.5px;
        margin-top: 4px;
        color: #aaa;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        width: 100%;
        font-weight: 300;
      }

      .seal-premium {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        margin-left: 8px;
        opacity: 0.8;
      }
      .seal-premium svg {
        width: 100%;
        height: 100%;
      }

      .header-divider {
        border: none;
        border-top: 0.5px solid rgba(200, 162, 74, 0.25);
        margin: 0 0 12px 0;
        position: relative;
        z-index: 1;
        width: 50%;
        align-self: center;
        flex-shrink: 0;
      }

      /* ==========================================================
         NOMBRE DEL PARTICIPANTE
      ========================================================= */
      .cert-student-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.5rem;
        font-style: italic;
        font-weight: 600;
        color: #1B5E20;
        text-align: center;
        line-height: 1.1;
        letter-spacing: 0.5px;
        margin: 8px auto 6px;
        max-width: 75%;
        white-space: normal;
        position: relative;
        z-index: 1;
      }
      .gold-line {
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        margin: 0 auto 6px auto;
        border-radius: 2px;
        opacity: 0.5;
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
        margin: 10px 0 6px;
        line-height: 1.2;
        position: relative;
        z-index: 1;
      }
      .gold-line-short {
        width: 70px;
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
        max-width: 65%;
        margin: 8px auto 10px;
        text-align: center;
        font-size: 0.9rem;
        line-height: 1.6;
        color: #555;
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
        gap: 14px;
        margin: 14px 0 10px;
        position: relative;
        z-index: 1;
      }
      .recognition-line {
        width: 35px;
        height: 0.5px;
        background: linear-gradient(90deg, transparent, #C8A24A, transparent);
        opacity: 0.4;
      }
      .recognition-text {
        font-size: 0.85rem;
        font-weight: 700;
        color: #C8A24A;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        font-family: 'Georgia', serif;
        opacity: 0.85;
      }

      /* ==========================================================
         FECHA
      ========================================================= */
      .cert-date {
        font-size: 0.9rem;
        color: #666;
        text-align: center;
        margin-top: 8px;
        margin-bottom: 4px;
        position: relative;
        z-index: 1;
        letter-spacing: 0.5px;
        font-family: 'Georgia', serif;
      }

      /* ==========================================================
         COLUMNA IZQUIERDA (técnica)
      ========================================================= */
      .tech-info {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        z-index: 1;
        border-right: 0.5px solid rgba(200, 162, 74, 0.15);
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
        font-size: 0.6rem;
        font-weight: 600;
        color: #1B5E20;
        font-family: 'Courier New', monospace;
        display: block;
        word-break: break-all;
        line-height: 1.2;
        opacity: 0.8;
      }
      .tech-value.status {
        color: #2E7D32;
        font-weight: 700;
        opacity: 1;
        letter-spacing: 0.5px;
      }
      .tech-value.url {
        font-size: 0.5rem;
        font-family: 'Courier New', monospace;
        font-weight: 500;
        color: #1B5E20;
        opacity: 0.5;
      }
      .verify-link {
        margin-top: 1px;
      }
      .tech-divider {
        border: none;
        border-top: 0.3px solid rgba(200, 162, 74, 0.1);
        margin: 1px 0;
      }

      /* ==========================================================
         FIRMAS
      ========================================================= */
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: auto;
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
        min-width: 110px;
        position: relative;
      }
      .sign-line.gold {
        width: 70px;
        height: 1.5px;
        background: linear-gradient(90deg, #C8A24A, #d4af37);
        margin: 0 auto 4px auto;
        border-radius: 2px;
        opacity: 0.4;
      }
      .sign-name {
        font-size: 0.7rem;
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
          aspect-ratio: auto;
          padding: 15px;
        }
        .certificate {
          padding: 15px;
          min-height: 400px;
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
        .tech-divider { display: none; }
        .watermark { display: none; }
        .logo-flask { width: 35px; height: 45px; }
        .seal-premium { width: 40px; height: 40px; }
        .org-name { font-size: 2rem; }
        .cert-student-name { font-size: 2.6rem; max-width: 95%; }
        .cert-project-name { font-size: 1.8rem; }
        .cert-description { max-width: 95%; font-size: 0.8rem; }
        .recognition-text { font-size: 0.7rem; letter-spacing: 1.5px; }
        .recognition-line { width: 20px; }
        .header-divider { width: 70%; }
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