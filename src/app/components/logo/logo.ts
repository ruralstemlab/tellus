import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {

  @Input() width: number = 320;

  @Input() alt: string = 'Tellus - Rural STEAM Lab';

}