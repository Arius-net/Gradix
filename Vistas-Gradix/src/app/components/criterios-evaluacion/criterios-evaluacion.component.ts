import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Materia {
  id: number;
  nombre: string;
  criteriosCount: number;
  criterios: Criterio[];
}

interface Criterio {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje: number;
}

@Component({
  selector: 'app-criterios-evaluacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './criterios-evaluacion.html',
  styleUrls: ['./criterios-evaluacion.css']
})
export class CriteriosEvaluacionComponent {
  // Estado de los modales
  mostrarModalCriterio = false;
  mostrarModalMateria = false;
  mostrarModalEditarMateria = false;
  
  nuevoCriterio = {
    nombre: '',
    descripcion: '',
    porcentaje: 0
  };

  nuevaMateria = {
    nombre: '',
    descripcion: ''
  };

  materiaEditando: Materia | null = null;

  materias: Materia[] = [
    {
      id: 1,
      nombre: 'Español',
      criteriosCount: 4,
      criterios: [
        { id: 1, nombre: 'Lectura y Comprensión', descripcion: 'Evaluación de lectura', porcentaje: 30 },
        { id: 2, nombre: 'Producción de Textos', descripcion: 'Escritura y redacción', porcentaje: 30 },
        { id: 3, nombre: 'Ortografía y Gramática', descripcion: 'Evaluación de ortografía', porcentaje: 20 },
        { id: 4, nombre: 'Participación y Exposiciones', descripcion: 'Expresión oral', porcentaje: 20 }
      ]
    },
    {
      id: 2,
      nombre: 'Matemáticas',
      criteriosCount: 4,
      criterios: [
        { id: 5, nombre: 'Álgebra', descripcion: 'Operaciones algebraicas', porcentaje: 25 },
        { id: 6, nombre: 'Geometría', descripcion: 'Figuras y medidas', porcentaje: 25 },
        { id: 7, nombre: 'Aritmética', descripcion: 'Operaciones básicas', porcentaje: 25 },
        { id: 8, nombre: 'Problemas', descripcion: 'Resolución de problemas', porcentaje: 25 }
      ]
    },
    {
      id: 3,
      nombre: 'Ciencias (Biología)',
      criteriosCount: 0,
      criterios: []
    },
    {
      id: 4,
      nombre: 'Historia',
      criteriosCount: 0,
      criterios: []
    },
    {
      id: 5,
      nombre: 'Formación Cívica y Ética',
      criteriosCount: 0,
      criterios: []
    },
    {
      id: 6,
      nombre: 'Inglés',
      criteriosCount: 0,
      criterios: []
    }
  ];

  materiaSeleccionada: Materia = this.materias[0]; // Español por defecto

  // Método para seleccionar materia
  seleccionarMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    console.log('Materia seleccionada:', materia.nombre);
  }

  // Métodos para modal de criterio
  agregarCriterio(): void {
    this.nuevoCriterio = {
      nombre: '',
      descripcion: '',
      porcentaje: 0
    };
    this.mostrarModalCriterio = true;
  }

  cerrarModalCriterio(): void {
    this.mostrarModalCriterio = false;
    this.nuevoCriterio = {
      nombre: '',
      descripcion: '',
      porcentaje: 0
    };
  }

  // Métodos para modal de materia
  agregarMateria(): void {
    this.nuevaMateria = {
      nombre: '',
      descripcion: ''
    };
    this.mostrarModalMateria = true;
  }

  cerrarModalMateria(): void {
    this.mostrarModalMateria = false;
    this.nuevaMateria = {
      nombre: '',
      descripcion: ''
    };
  }

  // Método para confirmar y agregar criterio
  confirmarAgregarCriterio(): void {
    if (!this.nuevoCriterio.nombre.trim()) {
      alert('El nombre del criterio es obligatorio');
      return;
    }

    if (this.nuevoCriterio.porcentaje < 0 || this.nuevoCriterio.porcentaje > 100) {
      alert('El porcentaje debe estar entre 0 y 100');
      return;
    }

    const nuevoId = Math.max(...this.materiaSeleccionada.criterios.map(c => c.id), 0) + 1;
    const criterio: Criterio = {
      id: nuevoId,
      nombre: this.nuevoCriterio.nombre.trim(),
      descripcion: this.nuevoCriterio.descripcion.trim() || 'Sin descripción',
      porcentaje: this.nuevoCriterio.porcentaje
    };
    
    this.materiaSeleccionada.criterios.push(criterio);
    this.materiaSeleccionada.criteriosCount = this.materiaSeleccionada.criterios.length;
    
    console.log('Criterio agregado:', criterio);
    this.cerrarModalCriterio();
  }

  // Método para confirmar y agregar materia
  confirmarAgregarMateria(): void {
    if (!this.nuevaMateria.nombre.trim()) {
      alert('El nombre de la materia es obligatorio');
      return;
    }

    // Verificar que no exista una materia con el mismo nombre
    const materiaExiste = this.materias.some(m => 
      m.nombre.toLowerCase() === this.nuevaMateria.nombre.trim().toLowerCase()
    );

    if (materiaExiste) {
      alert('Ya existe una materia con ese nombre');
      return;
    }

    const nuevoId = Math.max(...this.materias.map(m => m.id), 0) + 1;
    const materia: Materia = {
      id: nuevoId,
      nombre: this.nuevaMateria.nombre.trim(),
      criteriosCount: 0,
      criterios: []
    };
    
    this.materias.push(materia);
    console.log('Materia agregada:', materia);
    this.cerrarModalMateria();
    
    // Seleccionar automáticamente la nueva materia
    this.seleccionarMateria(materia);
  }

  // Método para editar criterio
  editarCriterio(criterio: Criterio): void {
    console.log('Editando criterio:', criterio);
    // Aquí puedes implementar un modal o formulario inline para editar
    const nuevoNombre = prompt('Nuevo nombre del criterio:', criterio.nombre);
    if (nuevoNombre && nuevoNombre.trim()) {
      criterio.nombre = nuevoNombre.trim();
    }
    
    const nuevaDescripcion = prompt('Nueva descripción:', criterio.descripcion);
    if (nuevaDescripcion && nuevaDescripcion.trim()) {
      criterio.descripcion = nuevaDescripcion.trim();
    }
    
    const nuevoPorcentaje = prompt('Nuevo porcentaje (sin %):', criterio.porcentaje.toString());
    if (nuevoPorcentaje && !isNaN(Number(nuevoPorcentaje))) {
      criterio.porcentaje = Number(nuevoPorcentaje);
    }
  }

  // Método para eliminar criterio
  eliminarCriterio(criterio: Criterio): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el criterio "${criterio.nombre}"?`);
    if (confirmacion) {
      const index = this.materiaSeleccionada.criterios.indexOf(criterio);
      if (index > -1) {
        this.materiaSeleccionada.criterios.splice(index, 1);
        this.materiaSeleccionada.criteriosCount = this.materiaSeleccionada.criterios.length;
        console.log('Criterio eliminado:', criterio);
      }
    }
  }

  // Método para calcular el porcentaje total
  getPorcentajeTotal(): number {
    return this.materiaSeleccionada.criterios.reduce((total, criterio) => total + criterio.porcentaje, 0);
  }

  // Método para verificar si la materia está seleccionada
  esMateriaSeleccionada(materia: Materia): boolean {
    return this.materiaSeleccionada.id === materia.id;
  }

  // Métodos para editar materia
  editarMateria(materia: Materia): void {
    this.materiaEditando = { ...materia }; // Crear copia para editar
    this.mostrarModalEditarMateria = true;
  }

  cerrarModalEditarMateria(): void {
    this.mostrarModalEditarMateria = false;
    this.materiaEditando = null;
  }

  confirmarEditarMateria(): void {
    if (!this.materiaEditando || !this.materiaEditando.nombre.trim()) {
      alert('El nombre de la materia es obligatorio');
      return;
    }

    // Verificar que no exista otra materia con el mismo nombre
    const materiaExiste = this.materias.some(m => 
      m.id !== this.materiaEditando!.id && 
      m.nombre.toLowerCase() === this.materiaEditando!.nombre.trim().toLowerCase()
    );

    if (materiaExiste) {
      alert('Ya existe otra materia con ese nombre');
      return;
    }

    // Encontrar y actualizar la materia
    const index = this.materias.findIndex(m => m.id === this.materiaEditando!.id);
    if (index > -1) {
      this.materias[index].nombre = this.materiaEditando.nombre.trim();
      
      // Actualizar la materia seleccionada si es la que se está editando
      if (this.materiaSeleccionada.id === this.materiaEditando.id) {
        this.materiaSeleccionada.nombre = this.materiaEditando.nombre.trim();
      }
      
      console.log('Materia actualizada:', this.materias[index]);
    }

    this.cerrarModalEditarMateria();
  }

  // Método para eliminar materia
  eliminarMateria(materia: Materia): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar la materia "${materia.nombre}"? Se eliminarán también todos sus criterios.`);
    
    if (confirmacion) {
      const index = this.materias.findIndex(m => m.id === materia.id);
      
      if (index > -1) {
        this.materias.splice(index, 1);
        
        // Si la materia eliminada era la seleccionada, seleccionar la primera disponible
        if (this.materiaSeleccionada.id === materia.id) {
          this.materiaSeleccionada = this.materias.length > 0 ? this.materias[0] : {
            id: 0,
            nombre: 'Sin materias',
            criteriosCount: 0,
            criterios: []
          };
        }
        
        console.log('Materia eliminada:', materia);
      }
    }
  }
}
