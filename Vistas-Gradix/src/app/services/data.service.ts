import { Injectable, signal, inject } from '@angular/core';
import { Alumno, Materia, CriterioEvaluacion, Calificacion, CampoFormativo } from '../models';
import { AlumnoService } from './alumno.service';
import { MateriaService } from './materia.service';
import { CriterioService } from './criterio.service';
import { CalificacionService } from './calificacion.service';
import { CampoFormativoService } from './campo-formativo.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private alumnoService = inject(AlumnoService);
  private materiaService = inject(MateriaService);
  private criterioService = inject(CriterioService);
  private calificacionService = inject(CalificacionService);
  private campoFormativoService = inject(CampoFormativoService);

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
    this.alumnoService.getAll().subscribe({
      next: (data) => {
        this.alumnos.set(data);
      },
      error: (err) => {
        const stored = localStorage.getItem('gradix_alumnos');
        if (stored) {
          this.alumnos.set(JSON.parse(stored));
        }
      }
    });
  }

  updateAlumnos(alumnos: Alumno[]): void {
    this.alumnos.set(alumnos);
    localStorage.setItem('gradix_alumnos', JSON.stringify(alumnos));
  }

  addAlumno(alumno: Alumno): void {
    const alumnoRequest = {
      nombre: alumno.nombre,
      apellidoPaterno: alumno.apellidoPaterno,
      apellidoMaterno: alumno.apellidoMaterno,
      grado: alumno.grado,
      grupo: alumno.grupo,
      docenteId: Number(alumno.docenteId)
    };
    
    this.alumnoService.create(alumnoRequest).subscribe({
      next: (newAlumno) => {
        const current = this.alumnos();
        this.updateAlumnos([...current, newAlumno]);
      },
      error: (err) => {}
    });
  }

  deleteAlumno(id: string): void {
    this.alumnoService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.alumnos();
        this.updateAlumnos(current.filter(a => a.id !== id));
      },
      error: (err) => {}
    });
  }

  updateAlumno(updatedAlumno: Alumno): void {
    const alumnoRequest = {
      nombre: updatedAlumno.nombre,
      apellidoPaterno: updatedAlumno.apellidoPaterno,
      apellidoMaterno: updatedAlumno.apellidoMaterno,
      grado: updatedAlumno.grado,
      grupo: updatedAlumno.grupo,
      docenteId: Number(updatedAlumno.docenteId)
    };
    
    this.alumnoService.update(Number(updatedAlumno.id), alumnoRequest).subscribe({
      next: () => {
        const current = this.alumnos();
        this.updateAlumnos(current.map(a => a.id === updatedAlumno.id ? updatedAlumno : a));
      },
      error: (err) => {}
    });
  }

  // Materias
  loadMaterias(): void {
    this.materiaService.getAll().subscribe({
      next: (data) => {
        this.materias.set(data);
      },
      error: (err) => {
        const stored = localStorage.getItem('gradix_materias');
        if (stored) {
          this.materias.set(JSON.parse(stored));
        }
      }
    });
  }

  updateMaterias(materias: Materia[]): void {
    this.materias.set(materias);
    localStorage.setItem('gradix_materias', JSON.stringify(materias));
  }

  addMateria(materia: Materia): void {
    // Validar que campoId y docenteId sean válidos
    const campoId = Number(materia.campoId);
    const docenteId = Number(materia.docenteId);
    
    if (isNaN(campoId) || isNaN(docenteId)) {
      return;
    }
    
    const materiaRequest = {
      nombre: materia.nombre,
      campoId: campoId,
      docenteId: docenteId,
      grado: materia.grado,
      grupo: materia.grupo
    };
    
    this.materiaService.create(materiaRequest).subscribe({
      next: (newMateria) => {
        const current = this.materias();
        this.updateMaterias([...current, newMateria]);
      },
      error: (err) => {}
    });
  }

  deleteMateria(id: string): void {
    this.materiaService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.materias();
        this.updateMaterias(current.filter(m => m.id !== id));
      },
      error: (err) => {}
    });
  }

  updateMateria(updatedMateria: Materia): void {
    const materiaRequest = {
      nombre: updatedMateria.nombre,
      campoId: Number(updatedMateria.campoId),
      docenteId: Number(updatedMateria.docenteId),
      grado: updatedMateria.grado,
      grupo: updatedMateria.grupo
    };
    
    this.materiaService.update(Number(updatedMateria.id), materiaRequest).subscribe({
      next: () => {
        const current = this.materias();
        this.updateMaterias(current.map(m => m.id === updatedMateria.id ? updatedMateria : m));
      },
      error: (err) => {}
    });
  }

  // Criterios
  loadCriterios(): void {
    this.criterioService.getAll().subscribe({
      next: (data) => {
        this.criterios.set(data);
      },
      error: (err) => {
        const stored = localStorage.getItem('gradix_criterios');
        if (stored) {
          this.criterios.set(JSON.parse(stored));
        }
      }
    });
  }

  updateCriterios(criterios: CriterioEvaluacion[]): void {
    this.criterios.set(criterios);
    localStorage.setItem('gradix_criterios', JSON.stringify(criterios));
  }

  addCriterio(criterio: CriterioEvaluacion): void {
    const criterioRequest = {
      nombre: criterio.nombre,
      descripcion: criterio.descripcion,
      porcentaje: criterio.porcentaje,
      materiaId: Number(criterio.materiaId)
    };
    
    this.criterioService.create(criterioRequest).subscribe({
      next: (newCriterio) => {
        const current = this.criterios();
        this.updateCriterios([...current, newCriterio]);
      },
      error: (err) => {}
    });
  }

  deleteCriterio(id: string): void {
    this.criterioService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.criterios();
        this.updateCriterios(current.filter(c => c.id !== id));
      },
      error: (err) => {}
    });
  }

  updateCriterio(updatedCriterio: CriterioEvaluacion): void {
    const criterioRequest = {
      nombre: updatedCriterio.nombre,
      descripcion: updatedCriterio.descripcion,
      porcentaje: updatedCriterio.porcentaje,
      materiaId: Number(updatedCriterio.materiaId)
    };
    
    this.criterioService.update(Number(updatedCriterio.id), criterioRequest).subscribe({
      next: () => {
        const current = this.criterios();
        this.updateCriterios(current.map(c => c.id === updatedCriterio.id ? updatedCriterio : c));
      },
      error: (err) => {}
    });
  }

  // Calificaciones
  loadCalificaciones(): void {
    this.calificacionService.getAll().subscribe({
      next: (data) => {
        this.calificaciones.set(data);
      },
      error: (err) => {
        const stored = localStorage.getItem('gradix_calificaciones');
        if (stored) {
          this.calificaciones.set(JSON.parse(stored));
        }
      }
    });
  }

  updateCalificaciones(calificaciones: Calificacion[]): void {
    this.calificaciones.set(calificaciones);
    localStorage.setItem('gradix_calificaciones', JSON.stringify(calificaciones));
  }

  addCalificacion(calificacion: Calificacion): void {
    const calificacionRequest = {
      alumnoId: Number(calificacion.alumnoId),
      criterioId: Number(calificacion.criterioId),
      valor: calificacion.valor
    };
    
    this.calificacionService.create(calificacionRequest).subscribe({
      next: (newCalificacion) => {
        const current = this.calificaciones();
        this.updateCalificaciones([...current, newCalificacion]);
      },
      error: (err) => {
      }
    });
  }

  deleteCalificacion(id: string): void {
    this.calificacionService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.calificaciones();
        this.updateCalificaciones(current.filter(c => c.id !== id));
      },
      error: (err) => {}
    });
  }

  updateCalificacion(updatedCalificacion: Calificacion): void {
    const calificacionRequest = {
      alumnoId: Number(updatedCalificacion.alumnoId),
      criterioId: Number(updatedCalificacion.criterioId),
      valor: updatedCalificacion.valor
    };
    
    this.calificacionService.update(Number(updatedCalificacion.id), calificacionRequest).subscribe({
      next: () => {
        const current = this.calificaciones();
        this.updateCalificaciones(current.map(c => c.id === updatedCalificacion.id ? updatedCalificacion : c));
      },
      error: (err) => {
      }
    });
  }

  upsertCalificacion(calificacion: Calificacion): void {
    const calificacionRequest = {
      alumnoId: Number(calificacion.alumnoId),
      criterioId: Number(calificacion.criterioId),
      valor: calificacion.valor
    };
    
    this.calificacionService.upsert(calificacionRequest).subscribe({
      next: (savedCalificacion) => {
        const current = this.calificaciones();
        // Buscar si ya existe en el estado local
        const existingIndex = current.findIndex(
          c => String(c.alumnoId) === String(savedCalificacion.alumnoId) && 
               String(c.criterioId) === String(savedCalificacion.criterioId)
        );
        
        if (existingIndex >= 0) {
          // Actualizar existente
          const updated = [...current];
          updated[existingIndex] = savedCalificacion;
          this.updateCalificaciones(updated);
        } else {
          // Agregar nueva
          this.updateCalificaciones([...current, savedCalificacion]);
        }
      },
      error: (err) => {
      }
    });
  }

  // Campos Formativos
  loadCampos(): void {
    this.campoFormativoService.getAll().subscribe({
      next: (data) => {
        this.campos.set(data);
      },
      error: (err) => {
        const stored = localStorage.getItem('gradix_campos');
        if (stored) {
          this.campos.set(JSON.parse(stored));
        }
      }
    });
  }

  updateCampos(campos: CampoFormativo[]): void {
    this.campos.set(campos);
    localStorage.setItem('gradix_campos', JSON.stringify(campos));
  }
}
