import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss'
})
export class InputComponent {

  @Input() type: string = 'text';

  @Input() placeholder: string = '';

  @Input() value: string = '';

}