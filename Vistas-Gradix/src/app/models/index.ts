// Types para el sistema Gradix

export interface Docente {
  id: string;
  nombre: string;
  correo: string;
  password_hash: string;
}

export interface CampoFormativo {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Materia {
  id: string;
  nombre: string;
  campoId: string;  // Cambiado de campoFormativoId a campoId para coincidir con backend
  docenteId: string;
  // Campos opcionales para compatibilidad con código existente
  grado?: number;
  grupo?: string;
}

export interface MateriaRequest {
  nombre: string;
  campoId: number;
  docenteId: number;
}

export interface Alumno {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: number;
  grupo: string;
  docenteId: string;
}

export interface CriterioEvaluacion {
  id: string;
  nombre: string;
  descripcion?: string;
  ponderacion: number; // Porcentaje de 0 a 100
  materiaId: string;
}

export interface CriterioRequest {
  nombre: string;
  descripcion?: string;
  ponderacion: number;
  materiaId: number;
}

export interface Calificacion {
  id: string;
  alumnoId: string;
  criterioId: string;
  materiaId: string;
  calificacion: number; // 0 a 10
  periodo: string; // "1", "2", "3" para los trimestres
  fecha: string;
}

export interface PromedioAlumno {
  alumnoId: string;
  materiaId: string;
  periodo: string;
  promedio: number;
}

export interface EstadisticaMateria {
  materiaId: string;
  periodo: string;
  promedioGrupo: number;
  calificacionMasAlta: number;
  calificacionMasBaja: number;
  alumnosAprobados: number;
  alumnosReprobados: number;
}

export type View = 'dashboard' | 'alumnos' | 'materias' | 'criterios' | 'calificaciones' | 'estadisticas' | 'reportes';
