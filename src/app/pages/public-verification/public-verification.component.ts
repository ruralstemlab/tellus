import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Verificando credencial...</p>
      </div>
      <div *ngIf="error && !loading" class="error-state">
        <span class="error-icon">🔍</span>
        <h2>{{ errorTitle || 'Credencial no encontrada' }}</h2>
        <p>{{ error }}</p>
        <button class="btn-secondary" (click)="goHome()">Volver al inicio</button>
      </div>
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab · Biblioteca Viva</p>
        </div>
        <div class="certificate-preview" id="certificate-container">
          <div class="certificate-wrapper">
            <div class="certificate" #certificate>
              <div class="cert-bg">
                <svg class="waves" viewBox="0 0 1200 800" preserveAspectRatio="none">
                  <path d="M0,200 C300,100 500,400 800,200 C1000,100 1100,300 1200,200 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.02"/>
                  <path d="M0,350 C200,250 400,500 700,300 C900,200 1050,400 1200,300 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.015"/>
                  <path d="M0,500 C250,400 450,650 750,450 C950,350 1100,550 1200,450 L1200,800 L0,800 Z" fill="#1B5E20" opacity="0.01"/>
                </svg>
                <div class="particles">
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                </div>
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>
              </div>
              <div class="watermark">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M75 40 L125 40 L145 80 L155 120 Q155 160 100 160 Q45 160 45 120 L55 80 Z" fill="none" stroke="#1B5E20" stroke-width="1.5" opacity="0.04"/>
                  <path d="M95 70 Q105 60 115 70 Q105 80 95 70" fill="#1B5E20" opacity="0.03"/>
                  <path d="M88 80 Q98 70 108 80 Q98 90 88 80" fill="#1B5E20" opacity="0.03"/>
                  <circle cx="80" cy="60" r="3" fill="#1B5E20" opacity="0.02"/>
                  <circle cx="120" cy="55" r="2" fill="#1B5E20" opacity="0.02"/>
                  <text x="100" y="190" font-family="Georgia, serif" font-size="12" fill="#1B5E20" opacity="0.03" text-anchor="middle" letter-spacing="3">TELLUS</text>
                </svg>
              </div>
              <div class="left-column">
                <div class="tech-block">
                  <span class="tech-label">ID DEL CERTIFICADO</span>
                  <span class="tech-value">{{ credential.credentialNumber || getCertId(credential, project) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-block">
                  <span class="tech-label">CÓDIGO DE VERIFICACIÓN</span>
                  <span class="tech-value">{{ credential.verificationCode || 'AB21-CD84-EF55' }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-block">
                  <span class="tech-label">ESTADO</span>
                  <span class="tech-value status">VERIFICADO</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-block">
                  <span class="tech-label">EMITIDO</span>
                  <span class="tech-value">{{ getFormattedDate(credential.issueDate) }}</span>
                </div>
                <div class="tech-divider"></div>
                <div class="tech-block">
                  <span class="tech-label">VERIFICAR EN</span>
                  <span class="tech-value url">tellus.ruralsteamlab.com/verificar</span>
                </div>
              </div>
              <div class="center-column">
                <div class="logo-area">
                  <div class="logo-icon">
                    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                          <stop offset="50%" stop-color="#d8ffd8" stop-opacity="0.4"/>
                          <stop offset="100%" stop-color="#8fdc6d" stop-opacity="0.2"/>
                        </linearGradient>
                      </defs>
                      <path d="M30 10 L50 10 L58 40 L68 70 Q68 95 40 95 Q12 95 12 70 L22 40 Z" fill="url(#glass)" stroke="#1B5E20" stroke-width="1.8"/>
                      <path d="M38 30 Q48 20 58 30 Q48 40 38 30" fill="#1B5E20" opacity="0.6"/>
                      <path d="M32 40 Q42 30 52 40 Q42 50 32 40" fill="#1B5E20" opacity="0.7"/>
                      <circle cx="20" cy="22" r="2" fill="#1B5E20" opacity="0.3"/>
                      <circle cx="60" cy="20" r="2" fill="#1B5E20" opacity="0.2"/>
                      <circle cx="16" cy="50" r="2" fill="#1B5E20" opacity="0.2"/>
                      <circle cx="64" cy="48" r="2" fill="#1B5E20" opacity="0.2"/>
                    </svg>
                  </div>
                  <div class="org-name">
                    <span class="rural">Rural</span>
                    <span class="steam">
                      <span class="s">S</span><span class="t">T</span><span class="e">E</span><span class="a">A</span><span class="m">M</span>
                    </span>
                    <span class="lab">Lab</span>
                  </div>
                  <div class="org-country">COLOMBIA</div>
                  <div class="org-slogan">INVESTIGA • INNOVA • TRANSFORMA</div>
                </div>
                <div class="certifies">CERTIFICA QUE</div>
                <div class="student-name">{{ project.studentName || 'Nombre del Participante' }}</div>
                <div class="description">ha desarrollado y publicado exitosamente el proyecto</div>
                <div class="project-name">“{{ project.title || 'Nombre del Proyecto' }}”</div>
                <div class="project-text">en el <strong>Ecosistema Tellus</strong>, demostrando creatividad, pensamiento científico, innovación y compromiso con la transformación digital de la educación.</div>
                <div class="recognition-band">
                  <span class="laurel">🏛️</span>
                  <span class="recognition-text">{{ credential.recognition || 'RECONOCIMIENTO OFICIAL DE INNOVACIÓN EDUCATIVA' }}</span>
                  <span class="laurel">🏛️</span>
                </div>
                <div class="date">Emitido el <strong>{{ getFormattedDate(credential.issueDate) }}</strong></div>
              </div>
              <div class="right-column">
                <div class="medal" [ngClass]="getMedalClass(credential.recognition)">
                  <div class="medal-inner">
                    <span class="medal-icon">
                      <ng-container *ngIf="getMedalLevel(credential.recognition) === 'gold'">🥇</ng-container>
                      <ng-container *ngIf="getMedalLevel(credential.recognition) === 'silver'">🥈</ng-container>
                      <ng-container *ngIf="getMedalLevel(credential.recognition) === 'bronze'">🥉</ng-container>
                      <ng-container *ngIf="!getMedalLevel(credential.recognition)">🏆</ng-container>
                    </span>
                    <span class="medal-text">{{ getMedalLevel(credential.recognition) ? getMedalLevel(credential.recognition).toUpperCase() : 'CERTIFICADO' }}</span>
                  </div>
                </div>
                <div class="seal-premium">
                  <div class="seal-circle">
                    <div class="seal-content">
                      <span class="seal-title">ECOSISTEMA</span>
                      <span class="seal-bold">TELLUS</span>
                      <span class="seal-year">2026</span>
                      <span class="seal-country">COLOMBIA</span>
                    </div>
                  </div>
                  <div class="seal-quote">"La tecnología transforma,<br>pero son las ideas las que cambian el mundo."</div>
                </div>
              </div>
              <div class="signatures">
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
        <div class="actions">
          <button class="btn-primary" (click)="downloadPDF()">📥 Descargar diploma (PDF)</button>
          <button class="btn-secondary" (click)="goHome()">🏠 Ir a Tellus</button>
        </div>
        <div class="footer-text">🌿 Verifica esta credencial en cualquier momento en tellus.ruralsteamlab.com/verificar</div>
      </div>
    </div>
  `,
  styles: [
    `
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
      .loading-state, .error-state { text-align: center; padding: 40px; }
      .spinner {
        width: 48px; height: 48px;
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
      .credential-found { max-width: 1200px; width: 100%; }
      .header { text-align: center; margin-bottom: 28px; }
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
      .header .subtitle { font-size: 14px; color: rgba(255,255,255,0.3); letter-spacing: 2px; text-transform: uppercase; font-weight: 300; }

      .certificate-preview { margin: 20px 0; display: flex; justify-content: center; }
      .certificate-wrapper {
        background: #FAF8F2;
        padding: 30px 30px;
        border-radius: 16px;
        box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        width: 100%;
        max-width: 1100px;
      }
      .certificate {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #FAF8F2;
        border-radius: 6px;
        overflow: hidden;
        padding: 20px 25px;
        display: flex;
        flex-direction: column;
        box-shadow: inset 0 0 0 1px rgba(200,162,74,0.08);
        font-family: 'Inter', 'Manrope', 'Plus Jakarta Sans', sans-serif;
      }

      .cert-bg {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; overflow: hidden;
      }
      .waves { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; }
      .particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
      .particles span {
        position: absolute; display: block; width: 4px; height: 4px; background: #1B5E20; border-radius: 50%; opacity: 0.04;
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
      .corner {
        position: absolute;
        width: 40px; height: 40px;
        border: 1px solid #C8A24A;
        opacity: 0.15;
      }
      .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
      .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
      .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
      .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

      .watermark {
        position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 180px; height: 180px; z-index: 1; pointer-events: none; opacity: 0.08;
      }
      .watermark svg { width: 100%; height: 100%; }

      .left-column {
        position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 130px; z-index: 2;
        display: flex; flex-direction: column; gap: 4px;
        border-right: 0.5px solid rgba(200,162,74,0.15); padding-right: 14px;
      }
      .tech-block { text-align: left; }
      .tech-label { font-size: 0.45rem; text-transform: uppercase; letter-spacing: 1.2px; color: #999; font-weight: 500; display: block; }
      .tech-value { font-size: 0.6rem; font-weight: 600; color: #1B5E20; font-family: 'Courier New', monospace; display: block; word-break: break-word; line-height: 1.2; opacity: 0.8; }
      .tech-value.status { color: #56C271; font-weight: 700; }
      .tech-value.url { font-size: 0.5rem; opacity: 0.5; font-weight: 500; }
      .tech-divider { border: none; border-top: 0.5px solid rgba(200,162,74,0.1); margin: 2px 0; }

      .center-column {
        position: absolute; left: 180px; right: 170px; top: 20px; bottom: 70px; z-index: 2;
        display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 10px;
      }
      .logo-area { margin-bottom: 2px; }
      .logo-icon { width: 40px; height: 50px; margin: 0 auto 2px; }
      .logo-icon svg { width: 100%; height: 100%; opacity: 0.7; }
      .org-name { font-family: 'Georgia', serif; font-size: 1.2rem; font-weight: 700; color: #1B5E20; letter-spacing: 0.5px; opacity: 0.6; }
      .org-name .rural { color: #1B5E20; }
      .org-name .steam { font-weight: 800; }
      .org-name .s { color: #1976d2; }
      .org-name .t { color: #00bcd4; }
      .org-name .e { color: #fdd835; }
      .org-name .a { color: #f57c00; }
      .org-name .m { color: #388e3c; }
      .org-name .lab { color: #1B5E20; }
      .org-country { font-size: 0.6rem; letter-spacing: 6px; color: #1B5E20; font-weight: 500; opacity: 0.4; margin-top: -2px; }
      .org-slogan { font-size: 0.55rem; letter-spacing: 2px; color: #1B5E20; opacity: 0.3; font-weight: 400; margin-top: -2px; }

      .certifies { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 4px; color: #1B5E20; opacity: 0.5; font-weight: 600; margin-top: 2px; text-transform: uppercase; }
      .student-name { font-family: 'Cormorant Garamond', 'Georgia', serif; font-size: 3.8rem; font-weight: 400; font-style: italic; color: #1B5E20; line-height: 1.1; margin: 2px 0 0 0; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.02); }
      .description { font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #666; font-weight: 400; letter-spacing: 0.3px; margin-top: 2px; }
      .project-name { font-family: 'Georgia', serif; font-size: 1.8rem; font-weight: 400; font-style: italic; color: #1B5E20; margin: 0 0 0 0; opacity: 0.85; }
      .project-text { font-family: 'Inter', sans-serif; font-size: 0.6rem; color: #888; max-width: 80%; line-height: 1.5; margin: 2px 0 4px 0; }
      .project-text strong { color: #1B5E20; font-weight: 600; }
      .recognition-band { display: flex; align-items: center; gap: 10px; margin: 2px 0 2px 0; }
      .recognition-band .laurel { font-size: 0.8rem; opacity: 0.3; color: #C8A24A; }
      .recognition-band .recognition-text { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; color: #1B5E20; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.7; border-top: 0.5px solid rgba(200,162,74,0.2); border-bottom: 0.5px solid rgba(200,162,74,0.2); padding: 2px 10px; }
      .date { font-family: 'Inter', sans-serif; font-size: 0.6rem; color: #999; letter-spacing: 0.5px; margin-top: 2px; }
      .date strong { color: #1B5E20; font-weight: 500; }

      .right-column {
        position: absolute; right: 15px; top: 50%; transform: translateY(-50%); width: 130px; z-index: 2;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .medal {
        width: 70px; height: 70px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle at 30% 30%, #f7e9c8, #d4af37);
        border: 2px solid #b8942a;
        box-shadow: 0 4px 15px rgba(212,175,55,0.2);
        position: relative;
      }
      .medal.gold { background: radial-gradient(circle at 30% 30%, #ffe082, #f9a825); border-color: #f57f17; }
      .medal.silver { background: radial-gradient(circle at 30% 30%, #e0e0e0, #9e9e9e); border-color: #757575; }
      .medal.bronze { background: radial-gradient(circle at 30% 30%, #ffcc80, #e65100); border-color: #bf360c; }
      .medal-inner { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0; }
      .medal-icon { font-size: 1.8rem; line-height: 1; }
      .medal-text { font-family: 'Inter', sans-serif; font-size: 0.45rem; font-weight: 700; color: #1B5E20; letter-spacing: 0.5px; text-transform: uppercase; background: rgba(255,255,255,0.3); padding: 0 4px; border-radius: 2px; }

      .seal-premium { text-align: center; margin-top: 2px; }
      .seal-circle {
        width: 80px; height: 80px; border-radius: 50%;
        border: 1.5px solid #C8A24A;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto;
        background: rgba(255,255,255,0.6);
        box-shadow: 0 2px 12px rgba(200,162,74,0.05);
        position: relative;
      }
      .seal-circle::after {
        content: '';
        position: absolute; top: 4px; left: 4px; right: 4px; bottom: 4px;
        border: 0.5px solid rgba(200,162,74,0.2); border-radius: 50%;
      }
      .seal-content { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
      .seal-title { font-size: 0.45rem; letter-spacing: 1px; color: #999; font-weight: 500; }
      .seal-bold { font-size: 0.7rem; font-weight: 800; color: #1B5E20; letter-spacing: 1.5px; }
      .seal-year { font-size: 0.5rem; font-weight: 600; color: #C8A24A; letter-spacing: 2px; }
      .seal-country { font-size: 0.4rem; letter-spacing: 2px; color: #999; font-weight: 500; }
      .seal-quote { font-family: 'Georgia', serif; font-size: 0.5rem; font-style: italic; color: #aaa; text-align: center; line-height: 1.3; margin-top: 4px; max-width: 120px; }

      .signatures {
        position: absolute; bottom: 12px; left: 180px; right: 170px; z-index: 2;
        display: flex; justify-content: space-around; align-items: flex-end;
        padding-top: 8px; border-top: 0.5px solid rgba(200,162,74,0.1);
      }
      .signature { text-align: center; flex: 1; }
      .sign-line.gold { width: 70px; height: 1.5px; background: linear-gradient(90deg, #C8A24A, #d4af37); margin: 0 auto 3px auto; opacity: 0.4; }
      .sign-name { font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 700; color: #1B5E20; letter-spacing: 0.3px; opacity: 0.8; }
      .sign-role { font-family: 'Inter', sans-serif; font-size: 0.45rem; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }

      @media (max-width: 900px) {
        .left-column { width: 100px; left: 10px; }
        .left-column .tech-label { font-size: 0.4rem; }
        .left-column .tech-value { font-size: 0.5rem; }
        .center-column { left: 130px; right: 130px; }
        .student-name { font-size: 2.8rem; }
        .project-name { font-size: 1.4rem; }
        .right-column { width: 100px; right: 8px; }
        .seal-circle { width: 60px; height: 60px; }
        .seal-bold { font-size: 0.55rem; }
        .medal { width: 55px; height: 55px; }
        .medal-icon { font-size: 1.4rem; }
        .signatures { left: 130px; right: 130px; }
        .sign-name { font-size: 0.5rem; }
        .seal-quote { font-size: 0.4rem; }
      }
      @media (max-width: 700px) {
        .certificate { padding: 10px; }
        .left-column { display: none; }
        .center-column { left: 15px; right: 15px; top: 10px; bottom: 50px; }
        .student-name { font-size: 2.2rem; }
        .project-name { font-size: 1.2rem; }
        .right-column { right: 5px; width: 80px; }
        .seal-circle { width: 50px; height: 50px; }
        .seal-bold { font-size: 0.45rem; }
        .seal-title { font-size: 0.35rem; }
        .seal-year { font-size: 0.4rem; }
        .seal-quote { display: none; }
        .medal { width: 45px; height: 45px; }
        .medal-icon { font-size: 1.2rem; }
        .medal-text { font-size: 0.35rem; }
        .signatures { left: 15px; right: 15px; bottom: 8px; flex-direction: column; gap: 4px; }
        .sign-name { font-size: 0.45rem; }
        .sign-role { font-size: 0.35rem; }
        .sign-line.gold { width: 40px; }
        .watermark { display: none; }
        .recognition-band .laurel { font-size: 0.6rem; }
        .recognition-band .recognition-text { font-size: 0.5rem; }
      }

      .actions {
        display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 20px;
      }
      .btn-primary, .btn-secondary {
        padding: 12px 28px; border: none; border-radius: 40px; font-size: 15px; font-weight: 600;
        cursor: pointer; transition: all 0.25s ease; font-family: 'Inter', system-ui, sans-serif;
      }
      .btn-primary {
        background: linear-gradient(135deg, #4cff9c 0%, #28a745 100%);
        color: #0a0a1a; box-shadow: 0 4px 20px rgba(76,255,156,0.2);
      }
      .btn-primary:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(76,255,156,0.3); }
      .btn-secondary {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.6);
      }
      .btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
      .footer-text { margin-top: 24px; font-size: 12px; color: rgba(255,255,255,0.2); text-align: center; }
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
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.error = 'No se especificó un código de verificación.';
      this.errorTitle = 'Código faltante';
      this.loading = false;
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
          return of(null);
        })
      )
      .subscribe({
        next: (cred) => {
          if (!cred) {
            this.error = '❌ Credencial no encontrada. Verifica el código.';
            this.errorTitle = 'No encontrada';
            this.loading = false;
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
        }
      });
  }

  private loadProject(projectId: string): void {
    if (!projectId) {
      this.error = 'La credencial no tiene un proyecto asociado.';
      this.errorTitle = 'Proyecto faltante';
      this.loading = false;
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
          return of(null);
        })
      )
      .subscribe({
        next: (project) => {
          if (!project) {
            this.error = 'El proyecto asociado a esta credencial ya no existe.';
            this.errorTitle = 'Proyecto eliminado';
            this.loading = false;
            return;
          }
          this.project = project;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = '⚠️ Error al cargar el proyecto asociado.';
          this.errorTitle = 'Error al cargar proyecto';
          this.loading = false;
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

  getMedalLevel(recognition: string | undefined): 'gold' | 'silver' | 'bronze' | null {
    if (!recognition) return null;
    const text = recognition.toLowerCase();
    if (text.includes('oro') || text.includes('gold') || text.includes('primero') || text.includes('ganador')) return 'gold';
    if (text.includes('plata') || text.includes('silver') || text.includes('segundo')) return 'silver';
    if (text.includes('bronce') || text.includes('bronze') || text.includes('tercero')) return 'bronze';
    return null;
  }

  getMedalClass(recognition: string | undefined): string {
    const level = this.getMedalLevel(recognition);
    return level ? level : '';
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