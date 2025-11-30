import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalculationsService } from '../../services/calculations.service';
import { Alumno, Materia } from '../../models';

interface EstadisticasData {
  promedioGrupo: number;
  calificacionMasAlta: number;
  calificacionMasBaja: number;
  alumnosAprobados: number;
  alumnosReprobados: number;
  totalAlumnos: number;
  detalleAlumnos: { alumno: string; promedio: number }[];
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  selectedPeriodo = signal<string>('1');
  selectedMateria = signal<string>('all');

  constructor(
    public dataService: DataService,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void {
    // Initialization if needed
  }

  get alumnos(): Alumno[] {
    return this.dataService.alumnos();
  }

  get materias(): Materia[] {
    return this.dataService.materias();
  }

  estadisticas = computed<EstadisticasData>(() => {
    const alumnos = this.alumnos;
    const materias = this.materias;
    const calificaciones = this.dataService.calificaciones();
    const criterios = this.dataService.criterios();
    const periodo = this.selectedPeriodo();
    const materiaId = this.selectedMateria();

    if (materiaId === 'all') {
      // Estadísticas generales
      const promediosAlumnos: { alumno: string; promedio: number }[] = [];

      alumnos.forEach(alumno => {
        const promedio = this.calculationsService.calcularPromedioGeneralAlumno(
          alumno.id,
          materias,
          calificaciones,
          criterios
        );
        if (promedio !== null) {
          promediosAlumnos.push({
            alumno: `${alumno.nombre} ${alumno.apellidoPaterno}`,
            promedio
          });
        }
      });

      const promediosNumeros = promediosAlumnos.map(p => p.promedio);
      const promedioGeneral =
        promediosNumeros.length > 0
          ? promediosNumeros.reduce((a, b) => a + b, 0) / promediosNumeros.length
          : 0;

      const aprobados = promediosNumeros.filter(p => p >= 6).length;
      const reprobados = promediosNumeros.filter(p => p < 6).length;

      return {
        promedioGrupo: Math.round(promedioGeneral * 10) / 10,
        calificacionMasAlta: promediosNumeros.length > 0 ? Math.max(...promediosNumeros) : 0,
        calificacionMasBaja: promediosNumeros.length > 0 ? Math.min(...promediosNumeros) : 0,
        alumnosAprobados: aprobados,
        alumnosReprobados: reprobados,
        totalAlumnos: promediosNumeros.length,
        detalleAlumnos: promediosAlumnos.sort((a, b) => b.promedio - a.promedio)
      };
    } else {
      // Estadísticas por materia
      const stats = this.calculationsService.calcularEstadisticasMateria(
        materiaId,
        alumnos,
        calificaciones,
        criterios
      );

      const detalleAlumnos = alumnos
        .map(alumno => {
          const promedio = this.calculationsService.calcularPromedioAlumnoMateria(
            alumno.id,
            materiaId,
            calificaciones,
            criterios
          );
          return {
            alumno: `${alumno.nombre} ${alumno.apellidoPaterno}`,
            promedio: promedio || 0
          };
        })
        .filter(a => a.promedio > 0)
        .sort((a, b) => b.promedio - a.promedio);

      return {
        ...stats,
        detalleAlumnos
      };
    }
  });

  porcentajeAprobacion = computed(() => {
    const stats = this.estadisticas();
    return stats.totalAlumnos > 0
      ? (stats.alumnosAprobados / stats.totalAlumnos) * 100
      : 0;
  });

  chartData = computed(() => {
    const materias = this.materias;
    const alumnos = this.alumnos;
    const calificaciones = this.dataService.calificaciones();
    const criterios = this.dataService.criterios();
    const periodo = this.selectedPeriodo();

    return materias.map(materia => {
      const stats = this.calculationsService.calcularEstadisticasMateria(
        materia.id,
        alumnos,
        calificaciones,
        criterios
      );
      return {
        materia: materia.nombre.length > 15 ? materia.nombre.substring(0, 12) + '...' : materia.nombre,
        promedio: stats.promedioGrupo
      };
    });
  });

  onPeriodoChange(periodo: string): void {
    this.selectedPeriodo.set(periodo);
  }

  onMateriaChange(materiaId: string): void {
    this.selectedMateria.set(materiaId);
  }

  getMateriaActual(): Materia | undefined {
    const materiaId = this.selectedMateria();
    if (materiaId === 'all') return undefined;
    return this.materias.find(m => m.id === materiaId);
  }
}
