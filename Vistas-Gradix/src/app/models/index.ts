// Types para el sistema Gradix

export interface Docente {
  id: string;
  nombre: string;
  email: string;
  password: string;
}

export interface CampoFormativo {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Materia {
  id: string;
  nombre: string;
  campoFormativoId: string;
  docenteId: string;
  grado: number;
  grupo: string;
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
