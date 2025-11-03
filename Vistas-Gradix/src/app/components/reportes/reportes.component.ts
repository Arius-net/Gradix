import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Reportes y Boletas</h1>
      <p class="text-gray-600 mt-2">Genera reportes y boletas de calificaciones (En desarrollo)</p>
    </div>
  `
})
export class ReportesComponent {}
