import { Injectable, signal } from '@angular/core';
import { Alumno, Materia, CriterioEvaluacion, Calificacion, CampoFormativo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  alumnos = signal<Alumno[]>([]);
  materias = signal<Materia[]>([]);
  criterios = signal<CriterioEvaluacion[]>([]);
  calificaciones = signal<Calificacion[]>([]);
  campos = signal<CampoFormativo[]>([]);

  loadData(): void {
    this.loadAlumnos();
    this.loadMaterias();
    this.loadCriterios();
    this.loadCalificaciones();
    this.loadCampos();
  }

  // Alumnos
  loadAlumnos(): void {
    const stored = localStorage.getItem('gradix_alumnos');
    if (stored) {
      this.alumnos.set(JSON.parse(stored));
    }
  }

  updateAlumnos(alumnos: Alumno[]): void {
    this.alumnos.set(alumnos);
    localStorage.setItem('gradix_alumnos', JSON.stringify(alumnos));
  }

  addAlumno(alumno: Alumno): void {
    const current = this.alumnos();
    this.updateAlumnos([...current, alumno]);
  }

  deleteAlumno(id: string): void {
    const current = this.alumnos();
    this.updateAlumnos(current.filter(a => a.id !== id));
  }

  updateAlumno(updatedAlumno: Alumno): void {
    const current = this.alumnos();
    this.updateAlumnos(current.map(a => a.id === updatedAlumno.id ? updatedAlumno : a));
  }

  // Materias
  loadMaterias(): void {
    const stored = localStorage.getItem('gradix_materias');
    if (stored) {
      this.materias.set(JSON.parse(stored));
    }
  }

  updateMaterias(materias: Materia[]): void {
    this.materias.set(materias);
    localStorage.setItem('gradix_materias', JSON.stringify(materias));
  }

  addMateria(materia: Materia): void {
    const current = this.materias();
    this.updateMaterias([...current, materia]);
  }

  deleteMateria(id: string): void {
    const current = this.materias();
    this.updateMaterias(current.filter(m => m.id !== id));
  }

  updateMateria(updatedMateria: Materia): void {
    const current = this.materias();
    this.updateMaterias(current.map(m => m.id === updatedMateria.id ? updatedMateria : m));
  }

  // Criterios
  loadCriterios(): void {
    const stored = localStorage.getItem('gradix_criterios');
    if (stored) {
      this.criterios.set(JSON.parse(stored));
    }
  }

  updateCriterios(criterios: CriterioEvaluacion[]): void {
    this.criterios.set(criterios);
    localStorage.setItem('gradix_criterios', JSON.stringify(criterios));
  }

  addCriterio(criterio: CriterioEvaluacion): void {
    const current = this.criterios();
    this.updateCriterios([...current, criterio]);
  }

  deleteCriterio(id: string): void {
    const current = this.criterios();
    this.updateCriterios(current.filter(c => c.id !== id));
  }

  updateCriterio(updatedCriterio: CriterioEvaluacion): void {
    const current = this.criterios();
    this.updateCriterios(current.map(c => c.id === updatedCriterio.id ? updatedCriterio : c));
  }

  // Calificaciones
  loadCalificaciones(): void {
    const stored = localStorage.getItem('gradix_calificaciones');
    if (stored) {
      this.calificaciones.set(JSON.parse(stored));
    }
  }

  updateCalificaciones(calificaciones: Calificacion[]): void {
    this.calificaciones.set(calificaciones);
    localStorage.setItem('gradix_calificaciones', JSON.stringify(calificaciones));
  }

  addCalificacion(calificacion: Calificacion): void {
    const current = this.calificaciones();
    this.updateCalificaciones([...current, calificacion]);
  }

  deleteCalificacion(id: string): void {
    const current = this.calificaciones();
    this.updateCalificaciones(current.filter(c => c.id !== id));
  }

  updateCalificacion(updatedCalificacion: Calificacion): void {
    const current = this.calificaciones();
    this.updateCalificaciones(current.map(c => c.id === updatedCalificacion.id ? updatedCalificacion : c));
  }

  // Campos Formativos
  loadCampos(): void {
    const stored = localStorage.getItem('gradix_campos');
    if (stored) {
      this.campos.set(JSON.parse(stored));
    }
  }

  updateCampos(campos: CampoFormativo[]): void {
    this.campos.set(campos);
    localStorage.setItem('gradix_campos', JSON.stringify(campos));
  }
}
