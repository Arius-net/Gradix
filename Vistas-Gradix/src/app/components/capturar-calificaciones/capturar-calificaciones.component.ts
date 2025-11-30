import { Component, OnInit, signal, computed, effect } from '@angular/core';
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
  ) {
    // Effect para seleccionar la primera materia cuando se carguen
    effect(() => {
      const materias = this.dataService.materias();
      if (materias.length > 0 && !this.selectedMateria()) {
        this.selectedMateria.set(materias[0].id);
      }
    });
  }

  ngOnInit(): void {
    // El effect se encargará de seleccionar la materia cuando se carguen los datos
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
    const materiaId = this.selectedMateria();
    if (!materiaId) return [];
    return this.criterios.filter(c => String(c.materiaId) === String(materiaId));
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
      c => c.alumnoId === alumnoId && c.criterioId === criterioId
    );
    return cal?.valor;
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

    console.log('🔄 Guardando calificaciones...', this.calificacionesTemp);
    let operacionesPendientes = 0;
    
    Object.entries(this.calificacionesTemp).forEach(([key, valor]) => {
      const [alumnoId, criterioId] = key.split('-');
      operacionesPendientes++;

      const calificacion: Calificacion = {
        id: '', // El backend lo asignará o usará el existente
        alumnoId,
        criterioId,
        valor: valor,
        fechaRegistro: new Date().toISOString().split('T')[0],
      };

      console.log(`📝 Guardando calificación (upsert):`, {
        alumnoId: calificacion.alumnoId,
        criterioId: calificacion.criterioId,
        valor: calificacion.valor
      });

      // Usar upsert que maneja create o update automáticamente
      this.dataService.upsertCalificacion(calificacion);
    });

    console.log(`✅ ${operacionesPendientes} calificaciones procesadas`);
    this.calificacionesTemp = {};
    this.hasChanges.set(false);
    
    alert('Calificaciones guardadas exitosamente');
    
    // Recargar calificaciones después de guardar
    setTimeout(() => {
      console.log('🔄 Recargando calificaciones desde API...');
      this.dataService.loadCalificaciones();
    }, 1500);
  }

  calcularPromedio(alumnoId: string): number | null {
    // Solo calcular con las calificaciones guardadas, NO con las temporales
    console.log(`📊 Calculando promedio para alumno ${alumnoId}`, {
      materiaId: this.selectedMateria(),
      totalCalificaciones: this.calificaciones.length,
      totalCriterios: this.criterios.length
    });
    
    const promedio = this.calculationsService.calcularPromedioAlumnoMateria(
      alumnoId,
      this.selectedMateria(),
      this.calificaciones,
      this.criterios
    );
    
    console.log(`📊 Promedio calculado: ${promedio}`);
    return promedio;
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
