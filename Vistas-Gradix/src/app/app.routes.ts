import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlumnosManagerComponent } from './components/alumnos-manager/alumnos-manager.component';
import { MateriasManagerComponent } from './components/materias-manager/materias-manager.component';
import { CriteriosEvaluacionComponent } from './components/criterios-evaluacion/criterios-evaluacion.component';
import { CapturarCalificacionesComponent } from './components/capturar-calificaciones/capturar-calificaciones.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Ruta pública de login
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alumnos', component: AlumnosManagerComponent },
      { path: 'materias', component: MateriasManagerComponent },
      { path: 'criterios', component: CriteriosEvaluacionComponent },
      { path: 'calificaciones', component: CapturarCalificacionesComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'reportes', component: ReportesComponent },
    ]
  },
  
  // Redirección por defecto
  { path: '**', redirectTo: 'login' }
];
