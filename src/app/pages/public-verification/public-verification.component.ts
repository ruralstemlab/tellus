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
        <h2>Credencial no encontrada</h2>
        <p>{{ error }}</p>
        <button class="btn-secondary" (click)="goHome()">Volver al inicio</button>
      </div>

      <!-- Diploma (se muestra cuando credential y project existen) -->
      <div *ngIf="!loading && credential && project" class="credential-found">
        <div class="header">
          <span class="verified-badge">✅ Credencial verificada</span>
          <h1>🌿 Tellus</h1>
          <p class="subtitle">Rural STEAM Lab</p>
        </div>

        <div class="diploma-preview" id="diploma-container">
          <div class="diploma">
            <div class="diploma-border">
              <div class="diploma-inner">
                <div class="diploma-header">
                  <span class="diploma-org">Rural STEAM Lab</span>
                  <span class="diploma-badge">🏆 {{ project.category }}</span>
                </div>
                <h1 class="diploma-title">Diploma de Participación</h1>
                <p class="diploma-recognition">
                  {{ credential.recognition || 'Sin reconocimientos' }}
                </p>
                <div class="diploma-recipient">
                  <span class="label">Otorgado a</span>
                  <span class="name">{{ project.studentName }}</span>
                </div>
                <div class="diploma-details">
                  <div class="detail-item">
                    <span class="label">Proyecto</span>
                    <span class="value">{{ project.title }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Institución</span>
                    <span class="value">{{ project.institution }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Fecha</span>
                    <span class="value">{{ credential.issueDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
                <div class="diploma-footer">
                  <div class="signature">
                    <div class="sign-line"></div>
                    <span class="sign-label">Firma del Director</span>
                  </div>
                  <div class="seal">
                    <span class="seal-icon">📜</span>
                    <span class="seal-label">Sello</span>
                  </div>
                </div>
                <div class="verification-code">
                  <span class="code-label">Código de verificación</span>
                  <div class="code-value">{{ credential.verificationCode?.substring(0, 8) || 'N/A' }}</div>
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
          <span>🌿 Tellus · {{ credential.issueDate | date:'yyyy' }}</span>
        </div>
      </div>

      <!-- Mensaje de depuración (si no hay credencial o proyecto) -->
      <div *ngIf="!loading && !credential && !error" class="error-state">
        <p>No se pudieron cargar los datos. Por favor, intenta de nuevo.</p>
        <button class="btn-secondary" (click)="goHome()">Volver al inicio</button>
      </div>
    </div>
  `,
  styles: [`
    .verification-container {
      min-height: 100vh;
      background: linear-gradient(145deg, #0a0a1a 0%, #1a1a3e 100%);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', system-ui, sans-serif;
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
    .credential-found { max-width: 700px; width: 100%; }
    .header { text-align: center; margin-bottom: 24px; }
    .verified-badge {
      display: inline-block;
      background: rgba(76,255,156,0.12);
      border: 1px solid rgba(76,255,156,0.2);
      padding: 4px 16px;
      border-radius: 40px;
      font-size: 13px;
      color: #4cff9c;
      margin-bottom: 8px;
    }
    .header h1 { font-size: 32px; margin: 4px 0; background: linear-gradient(135deg, #4cff9c 0%, #28a745 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .header .subtitle { font-size: 14px; color: rgba(255,255,255,0.3); letter-spacing: 2px; text-transform: uppercase; }
    .diploma-preview { margin: 20px 0; }
    .diploma {
      background: #fdf8f0;
      padding: 16px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      max-width: 560px;
      margin: 0 auto;
    }
    .diploma-border {
      border: 3px double #b8944a;
      border-radius: 12px;
      padding: 20px;
      background: #fffcf5;
    }
    .diploma-inner { text-align: center; }
    .diploma-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0d5c0;
      padding-bottom: 8px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      color: #5a4a30;
    }
    .diploma-org { font-weight: 600; letter-spacing: 1px; }
    .diploma-badge { background: #f0e6d0; padding: 2px 12px; border-radius: 20px; font-weight: 500; }
    .diploma-title { font-size: 1.8rem; font-weight: 700; color: #2a1f0c; margin: 4px 0 8px; font-family: 'Georgia', serif; }
    .diploma-recognition { font-size: 1.1rem; color: #5a4a30; font-style: italic; padding: 8px 0; border-top: 1px solid #e0d5c0; border-bottom: 1px solid #e0d5c0; margin-bottom: 16px; }
    .diploma-recipient { margin: 16px 0; }
    .diploma-recipient .label { display: block; font-size: 0.8rem; color: #8a7a60; text-transform: uppercase; letter-spacing: 2px; }
    .diploma-recipient .name { display: block; font-size: 2rem; font-weight: 700; color: #1a1005; font-family: 'Georgia', serif; }
    .diploma-details { display: flex; justify-content: space-around; gap: 12px; margin: 16px 0; font-size: 0.85rem; color: #5a4a30; }
    .diploma-details .detail-item { display: flex; flex-direction: column; align-items: center; }
    .diploma-details .label { font-size: 0.65rem; text-transform: uppercase; color: #8a7a60; letter-spacing: 1px; }
    .diploma-details .value { font-weight: 500; color: #2a1f0c; margin-top: 2px; }
    .diploma-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; border-top: 1px solid #e0d5c0; padding-top: 16px; }
    .signature { text-align: center; }
    .sign-line { width: 120px; height: 1px; border-bottom: 2px solid #2a1f0c; margin: 0 auto 4px; }
    .sign-label { font-size: 0.7rem; color: #8a7a60; letter-spacing: 1px; }
    .seal { text-align: center; }
    .seal-icon { display: block; font-size: 2.2rem; }
    .seal-label { font-size: 0.7rem; color: #8a7a60; letter-spacing: 1px; }
    .verification-code { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e0d5c0; }
    .code-label { font-size: 0.75rem; color: #8a7a60; letter-spacing: 1px; text-transform: uppercase; }
    .code-value { font-size: 1.2rem; font-family: monospace; color: #2a1f0c; font-weight: 600; letter-spacing: 2px; margin-top: 4px; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
    .btn-primary, .btn-secondary {
      padding: 12px 28px;
      border: none;
      border-radius: 40px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4cff9c 0%, #28a745 100%);
      color: #0a0a1a;
      box-shadow: 0 4px 20px rgba(76,255,156,0.2);
    }
    .btn-primary:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(76,255,156,0.3); }
    .btn-secondary {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.6);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
    .footer-text { margin-top: 24px; font-size: 12px; color: rgba(255,255,255,0.2); }
    @media (max-width: 480px) {
      .verification-container { padding: 20px 12px; }
      .diploma { padding: 12px; }
      .diploma-border { padding: 16px; }
      .diploma-title { font-size: 1.4rem; }
      .diploma-details { flex-direction: column; gap: 6px; }
      .actions { flex-direction: column; }
      .btn-primary, .btn-secondary { width: 100%; text-align: center; }
    }
  `]
})
export class PublicVerificationComponent implements OnInit {
  credential: Credential | null = null;
  project: Project | null = null;
  loading = true;
  error = '';
  private timeoutId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private credentialService: CredentialService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef  // ✅ Para forzar detección de cambios
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    console.log('🔍 [PublicVerification] UUID recibido:', uuid);
    if (!uuid) {
      this.error = 'No se especificó un código de verificación.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    this.timeoutId = setTimeout(() => {
      if (this.loading) {
        this.error = '⏳ La verificación está tomando demasiado tiempo. Por favor, intenta de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
        console.warn('⏳ [PublicVerification] Timeout alcanzado');
      }
    }, 10000);

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
          this.loading = false;
          if (this.timeoutId) clearTimeout(this.timeoutId);
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (cred) => {
          if (this.timeoutId) clearTimeout(this.timeoutId);
          console.log('📄 [PublicVerification] Credencial obtenida:', cred);
          if (!cred) {
            this.error = '❌ Credencial no encontrada. Verifica el código.';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }
          this.credential = cred;
          console.log('✅ [PublicVerification] Credencial cargada, projectId:', cred.projectId);
          this.loadProject(cred.projectId);
        },
        error: (err) => {
          if (this.timeoutId) clearTimeout(this.timeoutId);
          console.error('❌ [PublicVerification] Error al verificar:', err);
          this.error = '⚠️ Error al verificar la credencial. Intenta de nuevo.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private loadProject(projectId: string): void {
    if (!projectId) {
      this.project = null;
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
          this.project = null;
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (project) => {
          console.log('📄 [PublicVerification] Proyecto obtenido:', project);
          this.project = project || null;
          this.loading = false;
          console.log('✅ [PublicVerification] Carga completada');
          this.cdr.detectChanges();  // ✅ Forzar actualización de la vista
        },
        error: (err) => {
          console.error('❌ [PublicVerification] Error al cargar proyecto:', err);
          this.project = null;
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
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false });
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