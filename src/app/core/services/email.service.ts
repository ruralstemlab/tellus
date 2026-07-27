import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/email.config';

export interface CredentialEmailData {
  toEmail: string;
  toName: string;
  projectTitle: string;
  credentialNumber: string;
  verificationCode: string;
  verificationUrl: string;
  issueDate: string;
  recognition: string;
  institution: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly serviceId = EMAIL_CONFIG.serviceId;
  private readonly templateId = EMAIL_CONFIG.templateId;
  private readonly publicKey = EMAIL_CONFIG.publicKey;

  constructor() {
    emailjs.init(this.publicKey);
  }

  /**
   * Envía el correo de la credencial al desarrollador
   * ✅ Validación: no envía si toEmail está vacío
   * ✅ Fallbacks para todos los campos
   */
  async sendCredentialEmail(data: CredentialEmailData): Promise<boolean> {

    // ✅ Validación estricta: si no hay destinatario, NO enviar
    if (!data.toEmail || data.toEmail.trim() === '') {
      console.warn('⚠️ No se puede enviar correo: to_email está vacío');
      console.warn('Datos recibidos:', data);
      return false;
    }

    try {
      // ✅ Fallbacks para campos opcionales
      const templateParams = {
        to_email: data.toEmail.trim(),
        to_name: data.toName || 'Estudiante',
        project_title: data.projectTitle || 'Proyecto',
        credential_number: data.credentialNumber || 'N/A',
        verification_code: data.verificationCode || 'N/A',
        verification_url: data.verificationUrl || '#',
        issue_date: data.issueDate || new Date().toLocaleDateString('es-ES'),
        recognition: data.recognition || 'Participación',
        institution: data.institution || 'Institución'
      };

      console.log('========== EMAILJS ==========');
      console.log('Service ID:', this.serviceId);
      console.log('Template ID:', this.templateId);
      console.log('Public Key:', this.publicKey);
      console.log('Template Params:', templateParams);

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        {
          publicKey: this.publicKey
        }
      );

      console.log('✅ Email enviado correctamente');
      console.log(response);
      console.log('=============================');

      return true;

    } catch (error: any) {

      console.error('=============================');
      console.error('❌ ERROR EMAILJS');
      console.error(error);
      console.error('Status:', error?.status);
      console.error('Text:', error?.text);
      console.error('Name:', error?.name);
      console.error('Message:', error?.message);
      console.error('=============================');

      return false;
    }
  }
}