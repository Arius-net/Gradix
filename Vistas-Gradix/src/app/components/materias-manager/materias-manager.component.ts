import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-materias-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Materias</h1>
      <p class="text-gray-600 mt-2">Administra el catálogo de materias (En desarrollo)</p>
    </div>
  `
})
export class MateriasManagerComponent {}
