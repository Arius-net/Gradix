import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { Alumno } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-alumnos-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './alumnos-manager.component.html',
  styleUrls: ['./alumnos-manager.component.css']
})
export class AlumnosManagerComponent {

  private dataService = inject(DataService);
  private notificationService = inject(NotificationService);
  
  alumnos = this.dataService.alumnos;
  isDialogOpen = signal(false);
  editingAlumno = signal<Alumno | null>(null);
  
  formData = signal({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    grado: 1,
    grupo: 'A',
  });

  getSortedAlumnos() {
    return [...this.alumnos()].sort((a, b) => {
      const nameA = `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombre}`;
      const nameB = `${b.apellidoPaterno} ${b.apellidoMaterno} ${b.nombre}`;
      return nameA.localeCompare(nameB);
    });
  }

  openDialog(alumno?: Alumno): void {
    if (alumno) {
      this.editingAlumno.set(alumno);
      this.formData.set({
        nombre: alumno.nombre,
        apellidoPaterno: alumno.apellidoPaterno,
        apellidoMaterno: alumno.apellidoMaterno,
        grado: alumno.grado,
        grupo: alumno.grupo,
      });
    } else {
      this.resetForm();
    }
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      grado: 1,
      grupo: 'A',
    });
    this.editingAlumno.set(null);
  }

  onSubmit(): void {
    const data = this.formData();
    
    if (!data.nombre || !data.apellidoPaterno || !data.apellidoMaterno) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    const editing = this.editingAlumno();
    
    if (editing) {
      // Editar
      const updatedAlumno: Alumno = {
        ...editing,
        ...data
      };
      this.dataService.updateAlumno(updatedAlumno);
      this.notificationService.success('Alumno actualizado exitosamente');
    } else {
      // Agregar
      const newAlumno: Alumno = {
        id: `alu${Date.now()}`,
        ...data,
        docenteId: 'doc1',
      };
      this.dataService.addAlumno(newAlumno);
      this.notificationService.success('Alumno agregado exitosamente');
    }

    this.closeDialog();
  }

  deleteAlumno(id: string): void {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      this.dataService.deleteAlumno(id);
      this.notificationService.success('Alumno eliminado exitosamente');
    }
  }

  updateNombre(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(data => ({ ...data, nombre: value }));
  }

  updateApellidoPaterno(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(data => ({ ...data, apellidoPaterno: value }));
  }

  updateApellidoMaterno(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(data => ({ ...data, apellidoMaterno: value }));
  }

  updateGrado(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.formData.update(data => ({ ...data, grado: value }));
  }

  updateGrupo(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.formData.update(data => ({ ...data, grupo: value }));
  }
}
