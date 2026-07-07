import { Component } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Card } from '../../components/card/card';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    Card,
    Footer
  ],
  templateUrl: './laboratorios.html',
  styleUrl: './laboratorios.scss'
})
export class Laboratorios {}