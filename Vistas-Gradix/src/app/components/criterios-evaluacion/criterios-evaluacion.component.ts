import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalculationsService } from '../../services/calculations.service';
import { CriterioEvaluacion, Materia } from '../../models';

@Component({
  selector: 'app-criterios-evaluacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './criterios-evaluacion.component.html',
  styleUrls: ['./criterios-evaluacion.component.css']
})
export class CriteriosEvaluacionComponent implements OnInit {
  isDialogOpen = signal(false);
  editingCriterio = signal<CriterioEvaluacion | null>(null);
  selectedMateria = signal<string>('');

  formData = {
    nombre: '',
    descripcion: '',
    ponderacion: 0,
    materiaId: ''
  };

  constructor(
    public dataService: DataService,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void {
    const materias = this.dataService.materias();
    if (materias.length > 0 && !this.selectedMateria()) {
      this.selectedMateria.set(materias[0].id);
      this.formData.materiaId = materias[0].id;
    }
  }

  get criterios(): CriterioEvaluacion[] {
    return this.dataService.criterios();
  }

  get materias(): Materia[] {
    return this.dataService.materias();
  }

  materiaActual = computed(() => {
    return this.materias.find(m => m.id === this.selectedMateria());
  });

  criteriosMateria = computed(() => {
    return this.criterios.filter(c => c.materiaId === this.selectedMateria());
  });

  sumaPonderaciones = computed(() => {
    return this.criteriosMateria().reduce((sum, c) => sum + c.ponderacion, 0);
  });

  esPonderacionCompleta = computed(() => {
    return this.calculationsService.validarPonderaciones(this.criterios, this.selectedMateria());
  });

  selectMateria(materiaId: string): void {
    this.selectedMateria.set(materiaId);
  }

  getCriteriosCount(materiaId: string): number {
    return this.criterios.filter(c => c.materiaId === materiaId).length;
  }

  isValidMateria(materiaId: string): boolean {
    return this.calculationsService.validarPonderaciones(this.criterios, materiaId);
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      descripcion: '',
      ponderacion: 0,
      materiaId: this.selectedMateria()
    };
    this.editingCriterio.set(null);
  }

  openDialog(criterio?: CriterioEvaluacion): void {
    if (criterio) {
      this.editingCriterio.set(criterio);
      this.formData = {
        nombre: criterio.nombre,
        descripcion: criterio.descripcion || '',
        ponderacion: criterio.ponderacion,
        materiaId: criterio.materiaId
      };
    } else {
      this.resetForm();
    }
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.resetForm();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.formData.nombre || this.formData.ponderacion <= 0 || this.formData.ponderacion > 100) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    let updatedCriterios: CriterioEvaluacion[];
    const editing = this.editingCriterio();

    if (editing) {
      updatedCriterios = this.criterios.map(c =>
        c.id === editing.id ? { ...c, ...this.formData } : c
      );
    } else {
      const newCriterio: CriterioEvaluacion = {
        id: `crit${Date.now()}`,
        nombre: this.formData.nombre,
        descripcion: this.formData.descripcion,
        ponderacion: this.formData.ponderacion,
        materiaId: this.formData.materiaId
      };
      updatedCriterios = [...this.criterios, newCriterio];
    }

    // Validar que la suma de ponderaciones no exceda 100%
    const sumaPonderaciones = updatedCriterios
      .filter(c => c.materiaId === this.formData.materiaId)
      .reduce((sum, c) => sum + c.ponderacion, 0);

    if (sumaPonderaciones > 100) {
      alert('La suma de ponderaciones excede el 100%');
      return;
    }

    this.dataService.updateCriterios(updatedCriterios);
    alert(editing ? 'Criterio actualizado exitosamente' : 'Criterio agregado exitosamente');
    this.closeDialog();
  }

  deleteCriterio(id: string): void {
    if (confirm('¿Estás seguro de eliminar este criterio?')) {
      this.dataService.deleteCriterio(id);
      alert('Criterio eliminado exitosamente');
    }
  }
}
