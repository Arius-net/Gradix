import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Estadísticas</h1>
      <p class="text-gray-600 mt-2">Visualiza las estadísticas del grupo (En desarrollo)</p>
    </div>
  `
})
export class EstadisticasComponent {}
