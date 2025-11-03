import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-capturar-calificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Capturar Calificaciones</h1>
      <p class="text-gray-600 mt-2">Registra las calificaciones de los alumnos (En desarrollo)</p>
    </div>
  `
})
export class CapturarCalificacionesComponent {}
