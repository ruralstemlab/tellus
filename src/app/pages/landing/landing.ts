import { Component } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Card } from '../../components/card/card';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    Card,
    Footer
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {}