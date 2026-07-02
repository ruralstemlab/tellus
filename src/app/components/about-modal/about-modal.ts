import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Modal } from '../../services/modal';

@Component({
  selector: 'app-about-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-modal.html',
  styleUrl: './about-modal.scss'
})
export class AboutModal {

  modalService = inject(Modal);

  close() {

    this.modalService.close();

  }

}