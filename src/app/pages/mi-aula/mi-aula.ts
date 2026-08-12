import { Component } from '@angular/core';

@Component({
  selector: 'app-mi-aula',
  standalone: true,
  templateUrl: './mi-aula.html',
  styleUrl: './mi-aula.scss'
})
export class MiAula {

  // Estado inicial de la interfaz.
  // La conexión con ExperienceService y ProgressService
  // la incorporaremos en el siguiente paso.
  hasExperiences = false;

}