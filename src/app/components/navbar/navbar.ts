import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AboutModal } from '../about-modal/about-modal';
import { Modal } from '../../services/modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AboutModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  modal = inject(Modal);

  openAbout() {

    this.modal.open('about');

  }

}