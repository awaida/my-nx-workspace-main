import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage.service';

/**
 * Authentication interceptor that adds JWT token to HTTP requests.
 *
 * Automatically attaches the `Authorization: Bearer <token>` header
 * to all outgoing HTTP requests when a token is present in localStorage.
 *
 * @usageNotes
 * ### Configuration in app.config.ts
 * ```typescript
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import { authInterceptor } from '@mini-crm/data-access';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptors([authInterceptor])),
 *   ],
 * };
 * ```
 *
 * @see StorageService
 * @see errorInterceptor
 * @category Interceptors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getItem('auth_token');

  // If no token, pass the request unchanged
  if (!token) {
    return next(req);
  }

  // Clone request and add Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

