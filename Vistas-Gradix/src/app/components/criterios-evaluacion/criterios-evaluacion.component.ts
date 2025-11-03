import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criterios-evaluacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Criterios de Evaluación</h1>
      <p class="text-gray-600 mt-2">Gestiona los criterios de evaluación (En desarrollo)</p>
    </div>
  `
})
export class CriteriosEvaluacionComponent {}
