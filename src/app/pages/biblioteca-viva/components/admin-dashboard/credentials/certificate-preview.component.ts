import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialService } from '../../../../../core/services/credential.service';
import { Credential } from '../../../../../core/models/credential.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-certificate-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="certificate-preview">
      <div *ngIf="!credentialId && !uuid" class="no-data">
        <p>🔍 No se ha seleccionado ninguna credencial.</p>
      </div>
      <div *ngIf="credentialId || uuid">
        <div *ngIf="credential$ | async as credential; else loading">
          <h2>{{ credential.title }}</h2>
          <p><strong>Número:</strong> {{ credential.credentialNumber }}</p>
          <p><strong>Usuario:</strong> {{ credential.userId }}</p>
          <p><strong>Fecha de emisión:</strong> {{ credential.issueDate | date }}</p>
          <p *ngIf="credential.description">{{ credential.description }}</p>
          <div *ngIf="credential.pdfUrl">
            <a [href]="credential.pdfUrl" target="_blank">Ver PDF</a>
          </div>
        </div>
        <ng-template #loading>
          <p>Cargando credencial...</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .certificate-preview { padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    .no-data { color: #666; font-style: italic; }
  `]
})
export class CertificatePreviewComponent implements OnInit {
  @Input() credentialId?: string;
  @Input() uuid?: string;

  credential$!: Observable<Credential | null>;

  constructor(private credentialService: CredentialService) {}

  ngOnInit(): void {
    console.log('🔍 credentialId recibido:', this.credentialId);
    console.log('🔍 uuid recibido:', this.uuid);

    if (this.credentialId) {
      this.credential$ = this.credentialService.getCredential(this.credentialId);
    } else if (this.uuid) {
      this.credential$ = this.credentialService.getCredentialByUuid(this.uuid);
    } else {
      console.warn('❌ No se proporcionó ID ni UUID para la credencial');
    }
  }
}