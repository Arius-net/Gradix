import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalculationsService } from '../../services/calculations.service';
import { Alumno, Materia, CriterioEvaluacion, Calificacion } from '../../models';

@Component({
  selector: 'app-capturar-calificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './capturar-calificaciones.component.html',
  styleUrls: ['./capturar-calificaciones.component.css']
})
export class CapturarCalificacionesComponent implements OnInit {
  selectedMateria = signal<string>('');
  selectedPeriodo = signal<string>('1');
  calificacionesTemp: { [key: string]: number } = {};
  hasChanges = signal(false);

  constructor(
    public dataService: DataService,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void {
    const materias = this.dataService.materias();
    if (materias.length > 0 && !this.selectedMateria()) {
      this.selectedMateria.set(materias[0].id);
    }
  }

  get alumnos(): Alumno[] {
    return this.dataService.alumnos();
  }

  get materias(): Materia[] {
    return this.dataService.materias();
  }

  get criterios(): CriterioEvaluacion[] {
    return this.dataService.criterios();
  }

  get calificaciones(): Calificacion[] {
    return this.dataService.calificaciones();
  }

  materiaActual = computed(() => {
    return this.materias.find(m => m.id === this.selectedMateria());
  });

  criteriosMateria = computed(() => {
    return this.criterios.filter(c => c.materiaId === this.selectedMateria());
  });

  esPonderacionCompleta = computed(() => {
    return this.calculationsService.validarPonderaciones(this.criterios, this.selectedMateria());
  });

  alumnosOrdenados = computed(() => {
    return [...this.alumnos].sort((a, b) => {
      const nameA = `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombre}`;
      const nameB = `${b.apellidoPaterno} ${b.apellidoMaterno} ${b.nombre}`;
      return nameA.localeCompare(nameB);
    });
  });

  getCalificacion(alumnoId: string, criterioId: string): number | undefined {
    const key = `${alumnoId}-${criterioId}`;
    if (this.calificacionesTemp[key] !== undefined) {
      return this.calificacionesTemp[key];
    }
    const cal = this.calificaciones.find(
      c => c.alumnoId === alumnoId && c.criterioId === criterioId && c.periodo === this.selectedPeriodo()
    );
    return cal?.calificacion;
  }

  handleCalificacionChange(alumnoId: string, criterioId: string, valor: string): void {
    const key = `${alumnoId}-${criterioId}`;
    const calificacion = parseFloat(valor);

    if (valor === '' || isNaN(calificacion)) {
      delete this.calificacionesTemp[key];
      this.hasChanges.set(Object.keys(this.calificacionesTemp).length > 0);
      return;
    }

    if (calificacion < 0 || calificacion > 10) {
      alert('La calificación debe estar entre 0 y 10');
      return;
    }

    this.calificacionesTemp[key] = calificacion;
    this.hasChanges.set(true);
  }

  handleGuardar(): void {
    if (!this.esPonderacionCompleta()) {
      alert('Completa primero los criterios de evaluación (deben sumar 100%)');
      return;
    }

    const nuevasCalificaciones = [...this.calificaciones];

    Object.entries(this.calificacionesTemp).forEach(([key, valor]) => {
      const [alumnoId, criterioId] = key.split('-');

      const existingIndex = nuevasCalificaciones.findIndex(
        c => c.alumnoId === alumnoId && c.criterioId === criterioId && c.periodo === this.selectedPeriodo()
      );

      const calificacion: Calificacion = {
        id: existingIndex >= 0 ? nuevasCalificaciones[existingIndex].id : `cal${Date.now()}-${key}`,
        alumnoId,
        criterioId,
        materiaId: this.selectedMateria(),
        calificacion: valor,
        periodo: this.selectedPeriodo(),
        fecha: new Date().toISOString().split('T')[0],
      };

      if (existingIndex >= 0) {
        nuevasCalificaciones[existingIndex] = calificacion;
      } else {
        nuevasCalificaciones.push(calificacion);
      }
    });

    this.dataService.updateCalificaciones(nuevasCalificaciones);
    this.calificacionesTemp = {};
    this.hasChanges.set(false);
    alert('Calificaciones guardadas exitosamente');
  }

  calcularPromedio(alumnoId: string): number | null {
    // Crear un array temporal con las calificaciones actuales + las temporales
    const calsTempArray: Calificacion[] = Object.entries(this.calificacionesTemp).map(([key, valor]) => {
      const [aId, cId] = key.split('-');
      return {
        id: `temp-${key}`,
        alumnoId: aId,
        criterioId: cId,
        materiaId: this.selectedMateria(),
        calificacion: valor,
        periodo: this.selectedPeriodo(),
        fecha: new Date().toISOString().split('T')[0],
      };
    });

    const calsCompletas = [
      ...this.calificaciones.filter(c => {
        const key = `${c.alumnoId}-${c.criterioId}`;
        return !(key in this.calificacionesTemp);
      }),
      ...calsTempArray,
    ];

    return this.calculationsService.calcularPromedioAlumnoMateria(
      alumnoId,
      this.selectedMateria(),
      this.selectedPeriodo(),
      calsCompletas,
      this.criterios
    );
  }

  onMateriaChange(materiaId: string): void {
    this.selectedMateria.set(materiaId);
    this.calificacionesTemp = {};
    this.hasChanges.set(false);
  }

  onPeriodoChange(periodo: string): void {
    this.selectedPeriodo.set(periodo);
    this.calificacionesTemp = {};
    this.hasChanges.set(false);
  }
}
