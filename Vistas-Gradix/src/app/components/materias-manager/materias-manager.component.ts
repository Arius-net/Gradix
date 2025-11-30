import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
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
    campoId: '',
    grado: 1,
    grupo: 'A'
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    // Inicializar el campo formativo por defecto
    const campos = this.dataService.campos();
    if (campos.length > 0 && !this.formData.campoId) {
      this.formData.campoId = campos[0].id;
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
      campoId: this.camposFormativos[0]?.id || '',
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
        campoId: materia.campoId,
        grado: materia.grado || 1,
        grupo: materia.grupo || 'A'
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

    if (!this.formData.nombre || !this.formData.campoId) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    // Obtener el ID del docente autenticado
    const docenteId = this.authService.getDocenteId().toString();

    const editing = this.editingMateria();
    if (editing) {
      const updatedMateria: Materia = {
        ...editing,
        ...this.formData,
        docenteId
      };
      this.dataService.updateMateria(updatedMateria);
      this.notificationService.success('Materia actualizada exitosamente');
    } else {
      const newMateria: Materia = {
        id: `mat${Date.now()}`,
        ...this.formData,
        docenteId
      };
      this.dataService.addMateria(newMateria);
      this.notificationService.success('Materia agregada exitosamente');
    }

    this.closeDialog();
  }

  async deleteMateria(id: string): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Eliminar Materia',
      message: '¿Estás seguro de eliminar esta materia? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    
    if (confirmed) {
      this.dataService.deleteMateria(id);
      this.notificationService.success('Materia eliminada exitosamente');
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
    return this.materias.filter(m => m.campoId === campoId);
  }
}
