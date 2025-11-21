import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalculationsService } from '../../services/calculations.service';
import { Alumno, Materia } from '../../models';

interface CalificacionMateria {
  materia: string;
  promedio: string;
  estado: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  selectedAlumno = signal<string>('');
  selectedPeriodo = signal<string>('1');

  constructor(
    public dataService: DataService,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void {
    const alumnos = this.dataService.alumnos();
    if (alumnos.length > 0 && !this.selectedAlumno()) {
      this.selectedAlumno.set(alumnos[0].id);
    }
  }

  get alumnos(): Alumno[] {
    return this.dataService.alumnos();
  }

  get materias(): Materia[] {
    return this.dataService.materias();
  }

  alumnoActual = computed(() => {
    return this.alumnos.find(a => a.id === this.selectedAlumno());
  });

  alumnosOrdenados = computed(() => {
    return [...this.alumnos].sort((a, b) => {
      const nameA = `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombre}`;
      const nameB = `${b.apellidoPaterno} ${b.apellidoMaterno} ${b.nombre}`;
      return nameA.localeCompare(nameB);
    });
  });

  calificacionesPorMateria = computed<CalificacionMateria[]>(() => {
    const materias = this.materias;
    const alumnoId = this.selectedAlumno();
    const periodo = this.selectedPeriodo();
    const calificaciones = this.dataService.calificaciones();
    const criterios = this.dataService.criterios();

    return materias.map(materia => {
      const promedio = this.calculationsService.calcularPromedioAlumnoMateria(
        alumnoId,
        materia.id,
        periodo,
        calificaciones,
        criterios
      );
      return {
        materia: materia.nombre,
        promedio: promedio !== null ? promedio.toFixed(1) : 'S/C',
        estado: promedio !== null ? (promedio >= 6 ? 'Aprobado' : 'Reprobado') : 'Sin Calificar'
      };
    });
  });

  promedioGeneral = computed(() => {
    const alumnoId = this.selectedAlumno();
    const periodo = this.selectedPeriodo();
    const materias = this.materias;
    const calificaciones = this.dataService.calificaciones();
    const criterios = this.dataService.criterios();

    return this.calculationsService.calcularPromedioGeneralAlumno(
      alumnoId,
      periodo,
      materias,
      calificaciones,
      criterios
    );
  });

  fechaEmision = computed(() => {
    return new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  getPeriodoTexto(periodo: string): string {
    switch (periodo) {
      case '1': return 'Primer Periodo';
      case '2': return 'Segundo Periodo';
      case '3': return 'Tercer Periodo';
      default: return 'Primer Periodo';
    }
  }

  onAlumnoChange(alumnoId: string): void {
    this.selectedAlumno.set(alumnoId);
  }

  onPeriodoChange(periodo: string): void {
    this.selectedPeriodo.set(periodo);
  }

  handleImprimir(): void {
    window.print();
  }

  handleDescargar(): void {
    alert('Función de descarga disponible próximamente');
  }
}
