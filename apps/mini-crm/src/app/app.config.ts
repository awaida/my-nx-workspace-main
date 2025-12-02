import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { API_CONFIG, ordersReducer, orderEffects } from '@mini-crm/data-access';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),

    // NgRx Store
    provideStore({
      orders: ordersReducer,
    }),

    // NgRx Effects
    provideEffects(orderEffects),

    // NgRx DevTools (development only)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),

    // Configuration API
    {
      provide: API_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl,
      },
    },
    // TODO Formation : provideHttpClient(withInterceptors([authInterceptor]))
  ],
};
