import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';
import { DataService } from './services/data.service';
import { MockDataService } from './services/mock-data.service';

function initializeApp(dataService: DataService, mockDataService: MockDataService) {
  return () => {
    // NO cargar nada automáticamente al inicio
    // Los datos se cargarán después del login exitoso
    const token = localStorage.getItem('gradix_token');
    if (token) {
      // Si ya hay token (usuario previamente autenticado), cargar datos
      dataService.loadData();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [DataService, MockDataService],
      multi: true
    }
  ]
};
