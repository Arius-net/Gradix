import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DataService } from './services/data.service';
import { MockDataService } from './services/mock-data.service';

function initializeApp(dataService: DataService, mockDataService: MockDataService) {
  return () => {
    mockDataService.initializeMockData();
    dataService.loadData();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [DataService, MockDataService],
      multi: true
    }
  ]
};
