import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Modal } from '../../services/modal';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  year = new Date().getFullYear();

  version = 'v0.3.6';

  modal = inject(Modal);

  openAbout(){

    this.modal.open('about');

  }

}