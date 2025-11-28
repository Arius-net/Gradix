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
        console.log('✅ Alumnos cargados desde API:', data);
        this.alumnos.set(data);
      },
      error: (err) => {
        console.error('❌ Error cargando alumnos desde API:', err);
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
    this.alumnoService.create(alumno).subscribe({
      next: (newAlumno) => {
        const current = this.alumnos();
        this.updateAlumnos([...current, newAlumno]);
      },
      error: (err) => console.error('Error creando alumno:', err)
    });
  }

  deleteAlumno(id: string): void {
    this.alumnoService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.alumnos();
        this.updateAlumnos(current.filter(a => a.id !== id));
      },
      error: (err) => console.error('Error eliminando alumno:', err)
    });
  }

  updateAlumno(updatedAlumno: Alumno): void {
    this.alumnoService.update(Number(updatedAlumno.id), updatedAlumno).subscribe({
      next: () => {
        const current = this.alumnos();
        this.updateAlumnos(current.map(a => a.id === updatedAlumno.id ? updatedAlumno : a));
      },
      error: (err) => console.error('Error actualizando alumno:', err)
    });
  }

  // Materias
  loadMaterias(): void {
    this.materiaService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Materias cargadas desde API:', data);
        this.materias.set(data);
      },
      error: (err) => {
        console.error('❌ Error cargando materias desde API:', err);
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
      console.error('Error: campoId o docenteId no son números válidos', {
        campoId: materia.campoId,
        docenteId: materia.docenteId
      });
      return;
    }
    
    const materiaRequest = {
      nombre: materia.nombre,
      campoId: campoId,
      docenteId: docenteId
    };
    
    console.log('Enviando materia request:', materiaRequest);
    
    this.materiaService.create(materiaRequest).subscribe({
      next: (newMateria) => {
        const current = this.materias();
        this.updateMaterias([...current, newMateria]);
      },
      error: (err) => console.error('Error creando materia:', err)
    });
  }

  deleteMateria(id: string): void {
    this.materiaService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.materias();
        this.updateMaterias(current.filter(m => m.id !== id));
      },
      error: (err) => console.error('Error eliminando materia:', err)
    });
  }

  updateMateria(updatedMateria: Materia): void {
    const materiaRequest = {
      nombre: updatedMateria.nombre,
      campoId: Number(updatedMateria.campoId),
      docenteId: Number(updatedMateria.docenteId)
    };
    
    this.materiaService.update(Number(updatedMateria.id), materiaRequest).subscribe({
      next: () => {
        const current = this.materias();
        this.updateMaterias(current.map(m => m.id === updatedMateria.id ? updatedMateria : m));
      },
      error: (err) => console.error('Error actualizando materia:', err)
    });
  }

  // Criterios
  loadCriterios(): void {
    this.criterioService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Criterios cargados desde API:', data);
        this.criterios.set(data);
      },
      error: (err) => {
        console.error('❌ Error cargando criterios desde API:', err);
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
      ponderacion: criterio.ponderacion,
      materiaId: Number(criterio.materiaId)
    };
    
    this.criterioService.create(criterioRequest).subscribe({
      next: (newCriterio) => {
        const current = this.criterios();
        this.updateCriterios([...current, newCriterio]);
      },
      error: (err) => console.error('Error creando criterio:', err)
    });
  }

  deleteCriterio(id: string): void {
    this.criterioService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.criterios();
        this.updateCriterios(current.filter(c => c.id !== id));
      },
      error: (err) => console.error('Error eliminando criterio:', err)
    });
  }

  updateCriterio(updatedCriterio: CriterioEvaluacion): void {
    const criterioRequest = {
      nombre: updatedCriterio.nombre,
      descripcion: updatedCriterio.descripcion,
      ponderacion: updatedCriterio.ponderacion,
      materiaId: Number(updatedCriterio.materiaId)
    };
    
    this.criterioService.update(Number(updatedCriterio.id), criterioRequest).subscribe({
      next: () => {
        const current = this.criterios();
        this.updateCriterios(current.map(c => c.id === updatedCriterio.id ? updatedCriterio : c));
      },
      error: (err) => console.error('Error actualizando criterio:', err)
    });
  }

  // Calificaciones
  loadCalificaciones(): void {
    this.calificacionService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Calificaciones cargadas desde API:', data);
        this.calificaciones.set(data);
      },
      error: (err) => {
        console.error('❌ Error cargando calificaciones desde API:', err);
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
    this.calificacionService.create(calificacion).subscribe({
      next: (newCalificacion) => {
        const current = this.calificaciones();
        this.updateCalificaciones([...current, newCalificacion]);
      },
      error: (err) => console.error('Error creando calificación:', err)
    });
  }

  deleteCalificacion(id: string): void {
    this.calificacionService.delete(Number(id)).subscribe({
      next: () => {
        const current = this.calificaciones();
        this.updateCalificaciones(current.filter(c => c.id !== id));
      },
      error: (err) => console.error('Error eliminando calificación:', err)
    });
  }

  updateCalificacion(updatedCalificacion: Calificacion): void {
    this.calificacionService.update(Number(updatedCalificacion.id), updatedCalificacion).subscribe({
      next: () => {
        const current = this.calificaciones();
        this.updateCalificaciones(current.map(c => c.id === updatedCalificacion.id ? updatedCalificacion : c));
      },
      error: (err) => console.error('Error actualizando calificación:', err)
    });
  }

  // Campos Formativos
  loadCampos(): void {
    this.campoFormativoService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Campos formativos cargados desde API:', data);
        this.campos.set(data);
      },
      error: (err) => {
        console.error('❌ Error cargando campos formativos desde API:', err);
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
