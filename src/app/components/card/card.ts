import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {

  @Input() icon = '🌱';

  @Input() title = 'Título';

  @Input() description = 'Descripción';

}