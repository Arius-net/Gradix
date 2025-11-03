import { Injectable } from '@angular/core';
import { Calificacion, CriterioEvaluacion, Alumno, Materia } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {
  calcularPromedioAlumnoMateria(
    alumnoId: string,
    materiaId: string,
    periodo: string,
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ): number | null {
    // Filtrar calificaciones del alumno para esa materia y periodo
    const calsAlumno = calificaciones.filter(
      cal => cal.alumnoId === alumnoId && cal.materiaId === materiaId && cal.periodo === periodo
    );

    if (calsAlumno.length === 0) return null;

    // Calcular promedio ponderado
    let sumaCalificaciones = 0;
    let sumaPonderaciones = 0;

    calsAlumno.forEach(cal => {
      const criterio = criterios.find(c => c.id === cal.criterioId);
      if (criterio) {
        sumaCalificaciones += cal.calificacion * (criterio.ponderacion / 100);
        sumaPonderaciones += criterio.ponderacion;
      }
    });

    // Si no se han capturado todas las ponderaciones, ajustar
    if (sumaPonderaciones === 0) return null;

    // Normalizar si no suma 100%
    const promedio = (sumaCalificaciones / sumaPonderaciones) * 100;

    return Math.round(promedio * 10) / 10; // Redondear a 1 decimal
  }

  calcularPromedioGeneralAlumno(
    alumnoId: string,
    periodo: string,
    materias: Materia[],
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ): number | null {
    const promedios: number[] = [];

    materias.forEach(materia => {
      const promedio = this.calcularPromedioAlumnoMateria(alumnoId, materia.id, periodo, calificaciones, criterios);
      if (promedio !== null) {
        promedios.push(promedio);
      }
    });

    if (promedios.length === 0) return null;

    const suma = promedios.reduce((acc, val) => acc + val, 0);
    return Math.round((suma / promedios.length) * 10) / 10;
  }

  calcularEstadisticasMateria(
    materiaId: string,
    periodo: string,
    alumnos: Alumno[],
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ) {
    const promedios: number[] = [];
    let aprobados = 0;
    let reprobados = 0;

    alumnos.forEach(alumno => {
      const promedio = this.calcularPromedioAlumnoMateria(alumno.id, materiaId, periodo, calificaciones, criterios);
      if (promedio !== null) {
        promedios.push(promedio);
        if (promedio >= 6) {
          aprobados++;
        } else {
          reprobados++;
        }
      }
    });

    if (promedios.length === 0) {
      return {
        promedioGrupo: 0,
        calificacionMasAlta: 0,
        calificacionMasBaja: 0,
        alumnosAprobados: 0,
        alumnosReprobados: 0,
        totalAlumnos: 0,
      };
    }

    const suma = promedios.reduce((acc, val) => acc + val, 0);
    const promedioGrupo = Math.round((suma / promedios.length) * 10) / 10;

    return {
      promedioGrupo,
      calificacionMasAlta: Math.max(...promedios),
      calificacionMasBaja: Math.min(...promedios),
      alumnosAprobados: aprobados,
      alumnosReprobados: reprobados,
      totalAlumnos: promedios.length,
    };
  }

  validarPonderaciones(criterios: CriterioEvaluacion[], materiaId: string): boolean {
    const criteriosMateria = criterios.filter(c => c.materiaId === materiaId);
    const suma = criteriosMateria.reduce((acc, c) => acc + c.ponderacion, 0);
    return suma === 100;
  }
}
