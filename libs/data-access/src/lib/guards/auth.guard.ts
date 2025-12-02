import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Authentication guard to protect routes.
 *
 * Redirects to login page if user is not authenticated.
 * Checks the `isAuthenticated` signal from `AuthService`.
 *
 * @usageNotes
 * Apply to routes in routing configuration:
 * ```typescript
 * {
 *   path: 'orders',
 *   canActivate: [authGuard],
 *   loadChildren: () => import('./orders/orders.routes')
 * }
 * ```
 *
 * @see AuthService
 * @category Security
 *
 * @returns `true` if user is authenticated, otherwise redirects to `/auth/sign-in`
 *
 * @example
 * ```typescript
 * // In app.routes.ts
 * import { authGuard } from '@mini-crm/data-access';
 *
 * export const appRoutes: Route[] = [
 *   {
 *     path: 'orders',
 *     canActivate: [authGuard],
 *     loadChildren: () => import('@mini-crm/feature-orders').then(m => m.ORDERS_ROUTES)
 *   }
 * ];
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated using the computed signal
  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login (optional)
  // You could store this in a service or localStorage if needed
  console.warn('Access denied. Redirecting to login page.');

  // Redirect to login page
  return router.createUrlTree(['/auth/sign-in']);
};
