import { Injectable } from '@angular/core';
import { Docente, CampoFormativo, Materia, Alumno, CriterioEvaluacion, Calificacion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Campos formativos según el plan de estudios de telesecundaria
  readonly camposFormativos: CampoFormativo[] = [
    { id: 'cf1', nombre: 'Lenguajes' },
    { id: 'cf2', nombre: 'Saberes y Pensamiento Científico' },
    { id: 'cf3', nombre: 'Ética, Naturaleza y Sociedades' },
    { id: 'cf4', nombre: 'De lo Humano y lo Comunitario' },
  ];

  // Docente de ejemplo
  readonly docenteDemo: Docente = {
    id: 'doc1',
    nombre: 'María García López',
    correo: 'maria.garcia@telesecundaria.edu.mx',
    password_hash: 'demo123',
  };

  // Materias de ejemplo
  readonly materiasDemo: Materia[] = [
    { id: 'mat1', nombre: 'Español', campoId: 'cf1', docenteId: 'doc1', grado: 1, grupo: 'A' },
    { id: 'mat2', nombre: 'Matemáticas', campoId: 'cf2', docenteId: 'doc1', grado: 1, grupo: 'A' },
    { id: 'mat3', nombre: 'Ciencias (Biología)', campoId: 'cf2', docenteId: 'doc1', grado: 1, grupo: 'A' },
    { id: 'mat4', nombre: 'Historia', campoId: 'cf3', docenteId: 'doc1', grado: 1, grupo: 'A' },
    { id: 'mat5', nombre: 'Formación Cívica y Ética', campoId: 'cf3', docenteId: 'doc1', grado: 1, grupo: 'A' },
    { id: 'mat6', nombre: 'Inglés', campoId: 'cf1', docenteId: 'doc1', grado: 1, grupo: 'A' },
  ];

  // Alumnos de ejemplo
  readonly alumnosDemo: Alumno[] = [
    { id: 'alu1', nombre: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'Martínez', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu2', nombre: 'Ana', apellidoPaterno: 'González', apellidoMaterno: 'López', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu3', nombre: 'Carlos', apellidoPaterno: 'Rodríguez', apellidoMaterno: 'Sánchez', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu4', nombre: 'María', apellidoPaterno: 'Hernández', apellidoMaterno: 'García', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu5', nombre: 'Luis', apellidoPaterno: 'Martínez', apellidoMaterno: 'Flores', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu6', nombre: 'Patricia', apellidoPaterno: 'López', apellidoMaterno: 'Ramírez', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu7', nombre: 'Roberto', apellidoPaterno: 'Jiménez', apellidoMaterno: 'Torres', grado: 1, grupo: 'A', docenteId: 'doc1' },
    { id: 'alu8', nombre: 'Laura', apellidoPaterno: 'Díaz', apellidoMaterno: 'Cruz', grado: 1, grupo: 'A', docenteId: 'doc1' },
  ];

  // Criterios de evaluación de ejemplo
  readonly criteriosDemo: CriterioEvaluacion[] = [
    { id: 'crit1', nombre: 'Exámenes', porcentaje: 40, materiaId: 'mat2' },
    { id: 'crit2', nombre: 'Tareas', porcentaje: 20, materiaId: 'mat2' },
    { id: 'crit3', nombre: 'Participación', porcentaje: 15, materiaId: 'mat2' },
    { id: 'crit4', nombre: 'Proyecto Final', porcentaje: 25, materiaId: 'mat2' },
    // Para Español
    { id: 'crit5', nombre: 'Lectura y Comprensión', porcentaje: 30, materiaId: 'mat1' },
    { id: 'crit6', nombre: 'Producción de Textos', porcentaje: 30, materiaId: 'mat1' },
    { id: 'crit7', nombre: 'Ortografía y Gramática', porcentaje: 20, materiaId: 'mat1' },
    { id: 'crit8', nombre: 'Participación y Exposiciones', porcentaje: 20, materiaId: 'mat1' },
  ];

  // Calificaciones de ejemplo
  readonly calificacionesDemo: Calificacion[] = [
    // Matemáticas - Alumno 1
    { id: 'cal1', alumnoId: 'alu1', criterioId: 'crit1', valor: 8.5, fechaRegistro: '2025-10-15' },
    { id: 'cal2', alumnoId: 'alu1', criterioId: 'crit2', valor: 9.0, fechaRegistro: '2025-10-20' },
    { id: 'cal3', alumnoId: 'alu1', criterioId: 'crit3', valor: 8.0, fechaRegistro: '2025-10-25' },
    { id: 'cal4', alumnoId: 'alu1', criterioId: 'crit4', valor: 9.5, fechaRegistro: '2025-10-30' },
    // Matemáticas - Alumno 2
    { id: 'cal5', alumnoId: 'alu2', criterioId: 'crit1', valor: 7.5, fechaRegistro: '2025-10-15' },
    { id: 'cal6', alumnoId: 'alu2', criterioId: 'crit2', valor: 8.5, fechaRegistro: '2025-10-20' },
    { id: 'cal7', alumnoId: 'alu2', criterioId: 'crit3', valor: 9.0, fechaRegistro: '2025-10-25' },
    { id: 'cal8', alumnoId: 'alu2', criterioId: 'crit4', valor: 8.0, fechaRegistro: '2025-10-30' },
    // Español - Alumno 1
    { id: 'cal9', alumnoId: 'alu1', criterioId: 'crit5', valor: 9.0, fechaRegistro: '2025-10-15' },
    { id: 'cal10', alumnoId: 'alu1', criterioId: 'crit6', valor: 8.5, fechaRegistro: '2025-10-20' },
    { id: 'cal11', alumnoId: 'alu1', criterioId: 'crit7', valor: 9.5, fechaRegistro: '2025-10-25' },
    { id: 'cal12', alumnoId: 'alu1', criterioId: 'crit8', valor: 8.0, fechaRegistro: '2025-10-30' },
    // Español - Alumno 2
    { id: 'cal13', alumnoId: 'alu2', criterioId: 'crit5', valor: 8.0, fechaRegistro: '2025-10-15' },
    { id: 'cal14', alumnoId: 'alu2', criterioId: 'crit6', valor: 7.5, fechaRegistro: '2025-10-20' },
    { id: 'cal15', alumnoId: 'alu2', criterioId: 'crit7', valor: 8.5, fechaRegistro: '2025-10-25' },
    { id: 'cal16', alumnoId: 'alu2', criterioId: 'crit8', valor: 9.0, fechaRegistro: '2025-10-30' },
  ];

  initializeMockData(): void {
    if (!localStorage.getItem('gradix_docente')) {
      localStorage.setItem('gradix_docente', JSON.stringify(this.docenteDemo));
    }
    if (!localStorage.getItem('gradix_campos')) {
      localStorage.setItem('gradix_campos', JSON.stringify(this.camposFormativos));
    }
    if (!localStorage.getItem('gradix_materias')) {
      localStorage.setItem('gradix_materias', JSON.stringify(this.materiasDemo));
    }
    if (!localStorage.getItem('gradix_alumnos')) {
      localStorage.setItem('gradix_alumnos', JSON.stringify(this.alumnosDemo));
    }
    if (!localStorage.getItem('gradix_criterios')) {
      localStorage.setItem('gradix_criterios', JSON.stringify(this.criteriosDemo));
    }
    if (!localStorage.getItem('gradix_calificaciones')) {
      localStorage.setItem('gradix_calificaciones', JSON.stringify(this.calificacionesDemo));
    }
  }
}
