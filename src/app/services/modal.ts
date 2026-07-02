import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Modal {

  private currentModal = signal<string | null>(null);

  modal = this.currentModal.asReadonly();

  open(name: string) {
    this.currentModal.set(name);
  }

  close() {
    this.currentModal.set(null);
  }

}