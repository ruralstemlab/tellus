import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class DocumentRenderService {

  /**
   * Renderiza HTML a PDF
   */
  async renderToPDF(htmlElement: HTMLElement, fileName: string = 'diploma.pdf'): Promise<Blob> {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    return pdf.output('blob');
  }

  /**
   * Renderiza HTML a PNG (para thumbnail)
   */
  async renderToPNG(htmlElement: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(htmlElement, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(new Blob());
      }, 'image/png');
    });
  }

  /**
   * Renderiza HTML a Thumbnail (imagen pequeña)
   */
  async renderToThumbnail(htmlElement: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(htmlElement, {
      scale: 0.3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(new Blob());
      }, 'image/png');
    });
  }

  /**
   * Genera el HTML del diploma a partir de una plantilla y datos
   */
  generateDiplomaHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Georgia', serif; background: #f5f0eb; }
          .diploma-container {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            box-sizing: border-box;
          }
          .diploma {
            width: 100%;
            max-width: 900px;
            background: #fff;
            border: 8px solid #2d5a27;
            border-radius: 16px;
            padding: 48px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.1);
            text-align: center;
          }
          .diploma .header {
            font-size: 2.2rem;
            font-weight: 700;
            color: #2d5a27;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 0.2rem;
          }
          .diploma .subheader {
            font-size: 1rem;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
            border-bottom: 2px solid #2d5a27;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }
          .diploma .title {
            font-size: 2.8rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0.5rem 0 0.2rem;
          }
          .diploma .student-name {
            font-size: 3.2rem;
            font-weight: 700;
            color: #2d5a27;
            margin: 0.5rem 0;
            font-family: 'Times New Roman', serif;
            letter-spacing: 2px;
          }
          .diploma .description {
            font-size: 1.2rem;
            color: #444;
            margin: 0.8rem 0 0.4rem;
            line-height: 1.6;
          }
          .diploma .recognition {
            font-size: 1.1rem;
            color: #2d5a27;
            font-weight: 600;
            margin: 0.4rem 0 1rem;
            padding: 0.4rem 1.2rem;
            background: #f0f7ee;
            border-radius: 30px;
            display: inline-block;
          }
          .diploma .meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 0.9rem;
            color: #666;
            margin: 1rem 0 1.5rem;
            flex-wrap: wrap;
          }
          .diploma .footer {
            border-top: 2px solid #2d5a27;
            padding-top: 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: #888;
          }
          .diploma .footer .org {
            font-weight: 700;
            color: #2d5a27;
            letter-spacing: 1px;
          }
          .diploma .footer .date {
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="diploma-container">
          <div class="diploma">
            <div class="header">Rural STEAM Lab</div>
            <div class="subheader">Tellus · Biblioteca Viva</div>

            <div class="title">${data.title || 'Diploma de Participación'}</div>
            <div class="description">otorgado a</div>
            <div class="student-name">${data.studentName || 'Estudiante'}</div>
            <div class="description">por su participación en el proyecto</div>
            <div class="description" style="font-weight: 600; color: #1a1a1a;">${data.projectTitle || 'Proyecto'}</div>

            <div class="meta">
              <span>📂 ${data.category || 'Categoría'}</span>
              <span>🏫 ${data.institution || 'Institución'}</span>
            </div>

            ${data.recognition ? `<div class="recognition">🏆 ${data.recognition}</div>` : ''}

            <div class="footer">
              <span class="org">Rural STEAM Lab Colombia</span>
              <span class="date">${new Date(data.issueDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}