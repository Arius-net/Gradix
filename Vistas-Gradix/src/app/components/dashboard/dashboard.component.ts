import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CalculationsService } from '../../services/calculations.service';
import { AlumnoService } from '../../services/alumno.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private dataService = inject(DataService);
  private calculationsService = inject(CalculationsService);
  private alumnoService = inject(AlumnoService);

  apiStatus = 'Verificando API...';
  apiData: any = null;

  ngOnInit() {
    // Prueba de conexión con la API
    this.alumnoService.getAll().subscribe({
      next: (data) => {
        this.apiStatus = '✅ API conectada correctamente';
        this.apiData = data;
        console.log('✅ Datos de API:', data);
      },
      error: (err) => {
        this.apiStatus = '❌ Error conectando a API: ' + err.message;
        console.error('❌ Error de API:', err);
      }
    });
  }

  stats = computed(() => {
    const alumnos = this.dataService.alumnos();
    const materias = this.dataService.materias();
    const calificaciones = this.dataService.calificaciones();
    const criterios = this.dataService.criterios();

    const totalAlumnos = alumnos.length;
    const totalMaterias = materias.length;
    const totalCalificaciones = calificaciones.length;

    // Calcular promedio general del grupo
    const promediosAlumnos: number[] = [];
    alumnos.forEach(alumno => {
      const promedio = this.calculationsService.calcularPromedioGeneralAlumno(
        alumno.id, 
        materias, 
        calificaciones, 
        criterios
      );
      if (promedio !== null) {
        promediosAlumnos.push(promedio);
      }
    });

    const promedioGeneral = promediosAlumnos.length > 0
      ? Math.round((promediosAlumnos.reduce((a, b) => a + b, 0) / promediosAlumnos.length) * 10) / 10
      : 0;

    return {
      totalAlumnos,
      totalMaterias,
      totalCalificaciones,
      promedioGeneral,
    };
  });
}
