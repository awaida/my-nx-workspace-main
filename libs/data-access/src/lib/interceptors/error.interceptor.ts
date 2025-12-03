import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

/**
 * Error interceptor for handling HTTP errors globally.
 *
 * Handles common HTTP error scenarios:
 * - **401 Unauthorized**: Clears auth data and redirects to login page
 * - **403 Forbidden**: Logs access denied message
 * - **404 Not Found**: Logs resource not found
 * - **500+ Server Errors**: Logs server error
 *
 * @usageNotes
 * ### Configuration in app.config.ts
 * ```typescript
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import { authInterceptor, errorInterceptor } from '@mini-crm/data-access';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
 *   ],
 * };
 * ```
 *
 * @see authInterceptor
 * @see StorageService
 * @category Interceptors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      switch (error.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          console.error('Session expirée ou non authentifié');
          storageService.removeItem('auth_token');
          storageService.removeItem('current_user');
          router.navigate(['/auth/sign-in']);
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Accès refusé');
          errorMessage = "Vous n'avez pas les permissions nécessaires.";
          break;

        case 404:
          // Not Found
          console.error('Ressource non trouvée:', req.url);
          errorMessage = "La ressource demandée n'existe pas.";
          break;

        case 422:
          // Unprocessable Entity - validation errors
          console.error('Erreur de validation:', error.error);
          errorMessage = error.error?.message || 'Données invalides.';
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Erreur serveur:', error.status, error.message);
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;

        case 0:
          // Network error (server unreachable)
          console.error('Erreur réseau: serveur injoignable');
          errorMessage =
            'Impossible de contacter le serveur. Vérifiez votre connexion.';
          break;

        default:
          // Other errors
          console.error('Erreur HTTP:', error.status, error.message);
          errorMessage = error.error?.message || `Erreur ${error.status}`;
      }

      // Re-throw the error with a user-friendly message
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};
