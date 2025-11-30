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
}

export interface CampoFormativoRequest {
  nombre: string;
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
  porcentaje: number; // Cambiado de 'ponderacion' a 'porcentaje' para coincidir con backend
  materiaId: string;
}

export interface CriterioRequest {
  nombre: string;
  descripcion?: string;
  porcentaje: number;
  materiaId: number;
}

export interface Calificacion {
  id: string;
  alumnoId: string;
  criterioId: string;
  valor: number; // Cambiado de 'calificacion' a 'valor' para coincidir con backend
  fechaRegistro?: string; // Cambiado de 'fecha' a 'fechaRegistro'
}

export interface CalificacionRequest {
  alumnoId: number;
  criterioId: number;
  valor: number;
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
