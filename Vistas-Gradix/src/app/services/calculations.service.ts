import { Injectable } from '@angular/core';
import { Calificacion, CriterioEvaluacion, Alumno, Materia } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {
  calcularPromedioAlumnoMateria(
    alumnoId: string,
    materiaId: string,
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ): number | null {
    const criteriosMateria = criterios.filter(c => String(c.materiaId) === String(materiaId));
    
    const criteriosIds = new Set(criteriosMateria.map(c => String(c.id)));
    
    const calsAlumno = calificaciones.filter(
      cal => {
        const matchAlumno = String(cal.alumnoId) === String(alumnoId);
        const matchCriterio = criteriosIds.has(String(cal.criterioId));
        return matchAlumno && matchCriterio;
      }
    );

    if (calsAlumno.length === 0) return null;

    let sumaCalificaciones = 0;

    calsAlumno.forEach(cal => {
      const criterio = criterios.find(c => String(c.id) === String(cal.criterioId));
      if (criterio) {
        const contribucion = cal.valor * (criterio.porcentaje / 100);
        sumaCalificaciones += contribucion;
      }
    });
    
    return Math.round(sumaCalificaciones * 10) / 10;
  }

  calcularPromedioGeneralAlumno(
    alumnoId: string,
    materias: Materia[],
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ): number | null {
    const promedios: number[] = [];

    materias.forEach(materia => {
      const promedio = this.calcularPromedioAlumnoMateria(alumnoId, materia.id, calificaciones, criterios);
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
    alumnos: Alumno[],
    calificaciones: Calificacion[],
    criterios: CriterioEvaluacion[]
  ) {
    const promedios: number[] = [];
    let aprobados = 0;
    let reprobados = 0;

    alumnos.forEach(alumno => {
      const promedio = this.calcularPromedioAlumnoMateria(alumno.id, materiaId, calificaciones, criterios);
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
    const suma = criteriosMateria.reduce((acc, c) => acc + c.porcentaje, 0);
    return suma === 100;
  }
}
