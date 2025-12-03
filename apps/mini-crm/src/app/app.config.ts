import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  API_CONFIG,
  authInterceptor,
  errorInterceptor,
} from '@mini-crm/data-access';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),

    // HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor, // Adds JWT token to requests
        errorInterceptor, // Handles HTTP errors globally
      ])
    ),

    // Configuration API
    {
      provide: API_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl,
      },
    },

    // Note: NgRx SignalStore (OrdersStore) is automatically provided
    // via providedIn: 'root' - no configuration needed here!
  ],
};
