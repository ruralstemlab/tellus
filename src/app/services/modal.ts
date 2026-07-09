import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Modal {

  /**
   * Modal actualmente abierto.
   */
  private currentModal = signal<string | null>(null);

  /**
   * Signal de solo lectura para los componentes.
   */
  readonly modal = this.currentModal.asReadonly();

  /**
   * Abre un modal por nombre.
   */
  open(name: string): void {
    this.currentModal.set(name);
  }

  /**
   * Cierra cualquier modal.
   */
  close(): void {
    this.currentModal.set(null);
  }

}