import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Materia, CampoFormativo } from '../../models';

@Component({
  selector: 'app-materias-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materias-manager.component.html',
  styleUrls: ['./materias-manager.component.css']
})
export class MateriasManagerComponent implements OnInit {
  isDialogOpen = signal(false);
  editingMateria = signal<Materia | null>(null);
  
  formData = {
    nombre: '',
    campoFormativoId: '',
    grado: 1,
    grupo: 'A'
  };

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    // Inicializar el campo formativo por defecto
    const campos = this.dataService.campos();
    if (campos.length > 0 && !this.formData.campoFormativoId) {
      this.formData.campoFormativoId = campos[0].id;
    }
  }

  get materias(): Materia[] {
    return this.dataService.materias();
  }

  get camposFormativos(): CampoFormativo[] {
    return this.dataService.campos();
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      campoFormativoId: this.camposFormativos[0]?.id || '',
      grado: 1,
      grupo: 'A'
    };
    this.editingMateria.set(null);
  }

  openDialog(materia?: Materia): void {
    if (materia) {
      this.editingMateria.set(materia);
      this.formData = {
        nombre: materia.nombre,
        campoFormativoId: materia.campoFormativoId,
        grado: materia.grado,
        grupo: materia.grupo
      };
    } else {
      this.resetForm();
    }
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.resetForm();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.formData.nombre || !this.formData.campoFormativoId) {
      alert('Por favor completa todos los campos');
      return;
    }

    const docenteId = 'doc1'; // ID del docente actual

    const editing = this.editingMateria();
    if (editing) {
      const updatedMateria: Materia = {
        ...editing,
        ...this.formData
      };
      this.dataService.updateMateria(updatedMateria);
      alert('Materia actualizada exitosamente');
    } else {
      const newMateria: Materia = {
        id: `mat${Date.now()}`,
        ...this.formData,
        docenteId
      };
      this.dataService.addMateria(newMateria);
      alert('Materia agregada exitosamente');
    }

    this.closeDialog();
  }

  deleteMateria(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta materia?')) {
      this.dataService.deleteMateria(id);
      alert('Materia eliminada exitosamente');
    }
  }

  getCampoFormativoNombre(campoId: string): string {
    return this.camposFormativos.find(c => c.id === campoId)?.nombre || '';
  }

  getCampoColor(campoId: string): string {
    const colors: { [key: string]: string } = {
      'cf1': 'bg-blue-100 text-blue-800',
      'cf2': 'bg-green-100 text-green-800',
      'cf3': 'bg-purple-100 text-purple-800',
      'cf4': 'bg-orange-100 text-orange-800',
    };
    return colors[campoId] || 'bg-gray-100 text-gray-800';
  }

  getMateriasDelCampo(campoId: string): Materia[] {
    return this.materias.filter(m => m.campoFormativoId === campoId);
  }
}
