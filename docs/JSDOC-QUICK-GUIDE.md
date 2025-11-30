# JSDoc Quick Guide - Templates

Ce guide fournit des templates rapides pour documenter votre code TypeScript/Angular avec JSDoc.

## 📋 Templates par Type

### Service

````typescript
/**
 * [Description courte du service]
 *
 * [Description longue optionnelle]
 *
 * @usageNotes
 * Inject this service:
 * ```typescript
 * private myService = inject(MyService);
 * ```
 *
 * @see [Interfaces/Classes liées]
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class MyService {
  /**
   * [Description de la méthode]
   *
   * @param [paramName] - [Description]
   * @returns [Description du retour]
   * @throws {[ErrorType]} [Condition d'erreur]
   *
   * @example
   * ```typescript
   * this.myService.myMethod(param).subscribe({
   *   next: (data) => console.log(data)
   * });
   * ```
   */
  myMethod(paramName: Type): Observable<ReturnType> {
    // Implementation
  }
}
````

### Composant UI (shared-ui)

````typescript
/**
 * [Description courte du composant]
 *
 * [Description longue optionnelle]
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-my-component />
 * ```
 *
 * ### With Inputs
 * ```html
 * <lib-my-component [prop]="value" />
 * ```
 *
 * @see [Composants similaires]
 * @category Shared UI
 */
@Component({
  selector: 'lib-my-component',
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  /**
   * [Description de l'input]
   * @default [valeur par défaut]
   */
  myInput = input<Type>('defaultValue');

  /**
   * [Description de l'output]
   * @event
   * @param data - [Description des données émises]
   */
  myOutput = output<Type>();
}
````

### Guard

````typescript
/**
 * [Description courte du guard]
 *
 * [Description du comportement]
 *
 * @usageNotes
 * Apply to routes:
 * ```typescript
 * {
 *   path: 'protected',
 *   canActivate: [myGuard]
 * }
 * ```
 *
 * @see [Services liés]
 * @category Security
 */
export const myGuard: CanActivateFn = (route, state) => {
  // Implementation
};
````

### Interceptor

````typescript
/**
 * [Description courte de l'interceptor]
 *
 * [Description de ce qu'il fait]
 *
 * @usageNotes
 * Configure in app.config.ts:
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([myInterceptor])
 * )
 * ```
 *
 * @see [Services/Guards liés]
 * @category [Security|HTTP|...]
 */
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Implementation
};
````

### Interface/Model

```typescript
/**
 * [Description de l'interface]
 *
 * [Description longue optionnelle]
 *
 * @category Models
 * @see [Services qui l'utilisent]
 */
export interface MyModel {
  /**
   * [Description de la propriété]
   * @format [uuid|date-time|email|...]
   * @minLength [min] (pour strings)
   * @maxLength [max] (pour strings)
   * @minimum [min] (pour numbers)
   * @maximum [max] (pour numbers)
   * @default [valeur par défaut]
   */
  property: Type;
}
```

### Enum

```typescript
/**
 * [Description de l'enum]
 *
 * @category Models
 */
export enum MyEnum {
  /** [Description de Value1] */
  Value1 = 'value1',
  /** [Description de Value2] */
  Value2 = 'value2',
}
```

### Signals

```typescript
/**
 * [Description du signal]
 * @internal - Not exposed in public API
 */
private myPrivateSignal = signal<Type>(initialValue);

/**
 * [Description du signal]
 * @readonly - Use methods to modify
 */
readonly myReadonlySignal = signal<Type>(initialValue);

/**
 * [Description du computed]
 * @computed - Derived from [source signals]
 */
readonly myComputed = computed(() => {
  // Computation
});

/**
 * [Description du linked signal]
 * @linkedSignal - Linked to [source signal]
 */
readonly myLinkedSignal = linkedSignal(() => {
  // Initial value computation
});
```

### Input/Output

```typescript
/**
 * [Description de l'input]
 * @required - Must be provided by parent
 */
myRequiredInput = input.required<Type>();

/**
 * [Description de l'input]
 * @default [valeur]
 */
myOptionalInput = input<Type>('defaultValue');

/**
 * [Description de l'output]
 * @event
 * @param data - [Description des données émises]
 */
myOutput = output<Type>();
```

## 🏷️ Tags Rapides

### Tags Essentiels (à utiliser toujours)

```typescript
@usageNotes    // Comment utiliser (avec exemples)
@example       // Exemples de code
@category      // Data Access, Shared UI, Feature, Security, Models
@see           // Références croisées (autres classes/interfaces)
```

### Tags pour Méthodes

```typescript
@param name - Description       // Paramètre
@returns Description            // Valeur de retour
@throws {ErrorType} Condition   // Erreur possible
```

### Tags pour Propriétés

```typescript
@default valeur        // Valeur par défaut
@required             // Input obligatoire
@readonly             // Signal readonly
@computed             // Signal computed
@linkedSignal         // Linked signal
@event                // Output
@internal             // API interne
```

### Tags de Validation

```typescript
@format uuid|date-time|email|url  // Format attendu
@minLength 3                      // Longueur minimum (string)
@maxLength 100                    // Longueur maximum (string)
@minimum 0                        // Valeur minimum (number)
@maximum 100                      // Valeur maximum (number)
```

### Tags de Versioning

```typescript
@since 2.0.0           // Introduit dans la version
@deprecated Use X instead  // Obsolète, utiliser X
@alpha                 // Fonctionnalité alpha
@beta                  // Fonctionnalité beta
@experimental          // Expérimental
```

## ⚡ Workflow Rapide

### 1. Nouveau Service

```typescript
/**
 * [Description]
 * @usageNotes
 * ```typescript
 * private service = inject(MyService);
 * ```
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class MyService {}
```

### 2. Nouveau Composant Shared UI

```typescript
/**
 * [Description]
 * @usageNotes
 * ```html
 * <lib-component />
 * ```
 * @category Shared UI
 */
@Component({...})
export class MyComponent {}
```

### 3. Nouvelle Interface

```typescript
/**
 * [Description]
 * @category Models
 * @see MyService
 */
export interface MyModel {
  /** [Description] */
  id: string;
}
```

### 4. Nouveau Guard

```typescript
/**
 * [Description]
 * @usageNotes
 * ```typescript
 * { path: 'x', canActivate: [myGuard] }
 * ```
 * @category Security
 */
export const myGuard: CanActivateFn = () => {};
```

## ✅ Checklist Rapide

Avant de commit :

- [ ] JSDoc sur tous les services publics
- [ ] JSDoc sur tous les composants shared-ui
- [ ] `@usageNotes` avec exemple d'utilisation
- [ ] `@category` pour organisation Compodoc
- [ ] `@see` pour références croisées
- [ ] `@param` et `@returns` sur les méthodes publiques
- [ ] `@default` sur les inputs optionnels
- [ ] `@required` sur les inputs obligatoires
- [ ] `@event` sur les outputs
- [ ] Coverage > 80% : `npm run docs:coverage`

## 🚫 À Éviter

❌ **Ne PAS documenter** :

- Code trivial évident
- Tests unitaires simples
- Variables privées basiques
- Méthodes privées simples
- Getters/setters simples

❌ **Ne PAS utiliser** :

- Commentaires redondants avec le code
- Descriptions vagues ("Fait quelque chose")
- Documentation obsolète/incorrecte

## 📚 Exemple Complet

````typescript
/**
 * Service for managing user authentication.
 *
 * Handles login, logout, token management, and authentication state.
 * Uses signals for reactive state management.
 *
 * @usageNotes
 * Inject this service in components:
 * ```typescript
 * private authService = inject(AuthService);
 *
 * // Check if authenticated
 * if (this.authService.isAuthenticated()) {
 *   console.log('User is logged in');
 * }
 *
 * // Login
 * this.authService.login(credentials).subscribe({
 *   next: () => this.router.navigate(['/dashboard']),
 *   error: (err) => console.error('Login failed', err)
 * });
 * ```
 *
 * @see User
 * @see authGuard
 * @category Security
 * @since 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /**
   * Current user data
   * @readonly - Use login/logout methods to modify
   */
  readonly currentUser = signal<User | null>(null);

  /**
   * Loading state during authentication operations
   * @internal
   */
  private readonly loading = signal(false);

  /**
   * Checks if user is authenticated
   * @computed - Derived from currentUser signal
   */
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /**
   * Authenticates a user with credentials.
   *
   * Sends credentials to the API and stores the returned token.
   * Updates the currentUser signal on success.
   *
   * @param credentials - User credentials (email and password)
   * @returns Observable that completes on success
   * @throws {HttpErrorResponse} When credentials are invalid (401)
   * @throws {HttpErrorResponse} When server is unreachable (0)
   *
   * @example
   * ```typescript
   * this.authService.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * }).subscribe({
   *   next: () => console.log('Logged in'),
   *   error: (err) => console.error('Login failed', err)
   * });
   * ```
   */
  login(credentials: LoginCredentials): Observable<void> {
    this.loading.set(true);
    
    return this.http.post<AuthResponse>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.user);
      }),
      map(() => void 0),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Logs out the current user.
   *
   * Clears the stored token and resets the currentUser signal.
   * Redirects to the login page.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/sign-in']);
  }

  /**
   * Retrieves the stored authentication token.
   *
   * @returns Token string or null if not authenticated
   * @internal - Used by authInterceptor, not part of public API
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
````

Ce service est maintenant parfaitement documenté pour Compodoc ! 🎉

