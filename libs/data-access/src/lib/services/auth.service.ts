import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { API_CONFIG } from '../config/api.config';
/**
 * Authentication service for user login, registration, and session management.
 *
 * **Note**: This service is currently mocked for training purposes.
 * Methods return mock data without making actual API calls.
 * Will be connected to json-server-auth in training.
 *
 * @usageNotes
 * ### Injecting the Service
 * ```typescript
 * private readonly authService = inject(AuthService);
 * ```
 *
 * ### Checking Authentication Status
 * ```typescript
 * if (this.authService.isAuthenticated()) {
 *   // User is authenticated
 * }
 * ```
 *
 * ### Signing In
 * ```typescript
 * this.authService.signIn({ email: 'user@example.com', password: 'password' })
 *   .subscribe({
 *     next: (response) => {
 *       // Token and user are automatically updated
 *       console.log('Logged in:', response.user);
 *     },
 *     error: (error) => console.error('Login failed:', error)
 *   });
 * ```
 *
 * @see User
 * @see LoginRequest
 * @see RegisterRequest
 * @see AuthResponse
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Private writable signals
  #token = signal<string | null>(null);
  #user = signal<User | null>(null);

  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly apiUrl = `${this.config.apiUrl}`;

  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  // Public readonly signals
  /**
   * Current authentication token.
   * @readonly
   */
  token = this.#token.asReadonly();

  /**
   * Current authenticated user.
   * @readonly
   */
  user = this.#user.asReadonly();

  /**
   * Authentication status computed from token presence.
   * @computed
   */
  isAuthenticated = computed(() => !!this.#token());

  constructor() {
    // Restore session from localStorage on service initialization
    this.restoreSession();
  }

  /**
   * Signs in a user with email and password.
   *
   * **Mock implementation**: Returns mock data without API call.
   * Updates token and user signals on success.
   *
   * @param credentials - Login credentials (email and password)
   * @returns Observable of authentication response with access token and user data
   *
   * @example
   * ```typescript
   * this.authService.signIn({ email: 'user@example.com', password: 'password123' })
   *   .subscribe({
   *     next: (response) => console.log('Logged in:', response.user),
   *     error: (error) => console.error('Login failed:', error)
   *   });
   * ```
   */
  signIn(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Signin error:', error);
          throw error;
        })
      );
  }

  /**
   * Registers a new user account.
   *
   * **Mock implementation**: Returns mock data without API call.
   * Updates token and user signals on success.
   *
   * @param credentials - Registration credentials (email and password)
   * @returns Observable of authentication response with access token and user data
   *
   * @example
   * ```typescript
   * this.authService.signUp({ email: 'new@example.com', password: 'password123' })
   *   .subscribe({
   *     next: (response) => console.log('Registered:', response.user),
   *     error: (error) => console.error('Registration failed:', error)
   *   });
   * ```
   */
  signUp(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Signup error:', error);
          throw error;
        })
      );
  }

  /**
   * Signs out the current user.
   *
   * Clears the authentication token and user data from memory and localStorage.
   *
   * @example
   * ```typescript
   * this.authService.logout();
   * // Token and user signals are cleared
   * ```
   */
  logout(): void {
    this.#token.set(null);
    this.#user.set(null);
    this.storageService.removeItem('auth_token');
    this.storageService.removeItem('current_user');
    this.router.navigate(['/auth/sign-in']);
  }

  /**
   * Updates authentication state from an AuthResponse.
   * Internal method used by signIn and signUp after successful authentication.
   *
   * @internal
   * @param response - Authentication response containing token and user
   */
  private updateAuthState(response: AuthResponse): void {
    this.#token.set(response.accessToken);
    this.#user.set(response.user);
  }

  /**
   * Handles successful authentication by updating state and persisting to localStorage.
   *
   * @internal
   * @param response - Authentication response containing token and user
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.#user.set(response.user);
    this.#token.set(response.accessToken);
    this.storageService.setItem('auth_token', response.accessToken);
    this.storageService.setItem('current_user', JSON.stringify(response.user));
    this.router.navigate(['/orders']);
  }

  /**
   * Restores authentication session from localStorage.
   *
   * Called automatically on service initialization to restore user session
   * after page refresh.
   *
   * @internal
   */
  private restoreSession(): void {
    const token = this.storageService.getItem('auth_token');
    const userJson = this.storageService.getItem('current_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.#token.set(token);
        this.#user.set(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        this.storageService.removeItem('auth_token');
        this.storageService.removeItem('current_user');
      }
    }
  }
}
