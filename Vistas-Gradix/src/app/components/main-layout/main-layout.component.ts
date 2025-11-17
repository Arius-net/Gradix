import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../icon/icon.component';

interface MenuItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  
  isSidebarOpen = signal(false);
  currentUser = this.authService.currentUser;

  menuItems: MenuItem[] = [
    { route: '/dashboard', label: 'Panel de Control', icon: 'home' },
    { route: '/alumnos', label: 'Alumnos', icon: 'users' },
    { route: '/materias', label: 'Materias', icon: 'book-open' },
    { route: '/criterios', label: 'Criterios de Evaluación', icon: 'list-checks' },
    { route: '/calificaciones', label: 'Capturar Calificaciones', icon: 'clipboard-check' },
    { route: '/estadisticas', label: 'Estadísticas', icon: 'trending-up' },
    { route: '/reportes', label: 'Reportes y Boletas', icon: 'file-text' },
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isDesktop = window.innerWidth >= 1024;
    this.isSidebarOpen.set(isDesktop);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }
}
