import { Component, ElementRef, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Alumno } from '../../models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent {
  private dataService = inject(DataService);

  // Get alumnos from the data service
  alumnos = this.dataService.alumnos;
  
  // Computed property to get sorted students for dropdown
  students = computed(() => {
    return this.alumnos().map(alumno => ({
      id: alumno.id,
      name: `${alumno.apellidoPaterno.toUpperCase()} ${alumno.apellidoMaterno.toUpperCase()} ${alumno.nombre.toUpperCase()}`,
      alumno: alumno
    })).sort((a, b) => a.name.localeCompare(b.name));
  });

  periods = [
    { id: 'primer', name: 'Primer Periodo' },
    { id: 'segundo', name: 'Segundo Periodo' },
    { id: 'tercer', name: 'Tercer Periodo' }
  ];

  currentStudent = '';
  currentPeriod = this.periods[0].id;

  constructor() {
    // Load data and set initial student
    this.dataService.loadData();
    
    // Set initial student when students are available
    setTimeout(() => {
      const studentsList = this.students();
      if (studentsList.length > 0) {
        this.currentStudent = studentsList[0].id;
      }
    }, 0);
  }

  @ViewChild('reportCard', { static: false }) reportCard?: ElementRef<HTMLElement>;

  // Called when user clicks "Imprimir Boleta"
  printBoleta(): void {
    // Use the browser print dialog for simplicity
    window.print();
  }

  // Called when user clicks "Descargar PDF"
  // For now open printable view in a new window and call print there.
  // This is a pragmatic approach that works without adding a PDF library.
  downloadPdf(): void {
    try {
      const content = this.reportCard?.nativeElement.outerHTML ?? '';
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.warn('No se pudo abrir la ventana para descargar.');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(`<!doctype html><html><head><title>Boleta</title>`);
      // Inline minimal style so printed content keeps basic look.
      printWindow.document.write('<meta charset="utf-8"/><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#222} .report-card{max-width:900px;margin:0 auto}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      // Give the new window a moment to render, then call print
      setTimeout(() => {
        printWindow.print();
        // Do not auto-close to allow user to cancel/inspect; uncomment if you prefer auto-close
        // printWindow.close();
      }, 250);
    } catch (err) {
      console.error('Error al preparar la descarga:', err);
    }
  }

  onStudentChange(newId: string): void {
    this.currentStudent = newId;
    // TODO: load student-specific data (grades, info) from a service
    console.log('Alumno seleccionado:', newId);
  }

  onPeriodChange(newId: string): void {
    this.currentPeriod = newId;
    // TODO: load period-specific data
    console.log('Periodo seleccionado:', newId);
  }

  // Helper methods for template
  getSelectedStudent() {
    return this.students().find(student => student.id === this.currentStudent);
  }

  getSelectedPeriod() {
    return this.periods.find(period => period.id === this.currentPeriod);
  }

  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('es-ES', options);
  }

  // Format student name in uppercase
  getFormattedStudentName(): string {
    const student = this.getSelectedStudent();
    if (!student) return 'Seleccione un alumno';
    
    const { nombre, apellidoPaterno, apellidoMaterno } = student.alumno;
    return `${nombre.toUpperCase()} ${apellidoPaterno.toUpperCase()} ${apellidoMaterno.toUpperCase()}`;
  }
}
