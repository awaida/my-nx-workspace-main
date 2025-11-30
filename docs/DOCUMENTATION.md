# Guide de Documentation - Mini CRM

Ce guide explique comment documenter le code du projet Mini CRM avec JSDoc/TSDoc et Compodoc.

## 📋 Table des Matières

- [Philosophie](#philosophie)
- [Outils](#outils)
- [Standards de Documentation](#standards-de-documentation)
- [Tags Compodoc](#tags-compodoc)
- [Exemples Pratiques](#exemples-pratiques)
- [Génération de la Documentation](#génération-de-la-documentation)
- [Vérification de la Couverture](#vérification-de-la-couverture)

## 🎯 Philosophie

### Principes de base

1. **Code auto-documenté** : Privilégier des noms explicites et des types clairs
2. **Documenter le pourquoi, pas le quoi** : Expliquer les décisions, pas les évidences
3. **API publique** : Documenter tout ce qui est exposé aux autres parties du code
4. **Exemples d'utilisation** : Toujours inclure des exemples concrets

### Quand documenter ?

✅ **OBLIGATOIRE** :

- Services dans `data-access/`
- Composants réutilisables dans `shared-ui/`
- Guards, interceptors, validators
- Models et interfaces publiques
- Méthodes publiques complexes

❌ **NE PAS documenter** :

- Code trivial évident
- Tests simples
- Variables privées simples
- Méthodes privées basiques

## 🛠️ Outils

### Compodoc

**Compodoc** est l'outil de documentation automatique pour Angular. Il analyse le code TypeScript et génère une documentation HTML interactive.

#### Installation

```bash
npm install @compodoc/compodoc --save-dev
```

#### Configuration

Le fichier `.compodocrc.json` à la racine du projet configure Compodoc :

```json
{
  "port": 8080,
  "theme": "material",
  "tsconfig": "apps/mini-crm/tsconfig.app.json",
  "output": "docs/compodoc",
  "coverageTest": 80,
  "coverageMinimumPerFile": 70
}
```

#### Scripts disponibles

```bash
# Générer et servir la doc en mode dev
npm run docs

# Build statique dans docs/compodoc/
npm run docs:build

# Vérifier la couverture (doit être > 80%)
npm run docs:coverage

# Watch mode (recompile à chaque changement)
npm run docs:watch
```

### TypeDoc

**TypeDoc** est l'outil générique de documentation TypeScript. Il est utilisé comme base par Compodoc mais peut aussi être utilisé indépendamment.

### ESLint JSDoc Plugin

Le plugin ESLint `jsdoc/*` valide les commentaires JSDoc et signale les erreurs de format.

## 📝 Standards de Documentation

### Format JSDoc/TSDoc

```typescript
/**
 * Description courte sur une ligne (obligatoire).
 *
 * Description longue optionnelle avec plus de détails.
 * Peut être sur plusieurs lignes et inclure des exemples.
 *
 * @param paramName - Description du paramètre
 * @returns Description de la valeur retournée
 * @throws Description des erreurs possibles
 *
 * @example
 * ```typescript
 * const result = myFunction('test');
 * console.log(result);
 * ```
 */
```

### Services

````typescript
/**
 * Service for managing orders data and operations.
 *
 * Handles all HTTP requests related to orders including CRUD operations.
 * Manages loading states and error handling with signals.
 *
 * @usageNotes
 * Inject this service in components or other services:
 * ```typescript
 * private ordersService = inject(OrdersService);
 * ```
 *
 * @see Order
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class OrdersService {
  /**
   * Retrieves all orders from the API.
   *
   * @returns Observable of orders array
   * @throws {HttpErrorResponse} When API request fails
   *
   * @example
   * ```typescript
   * this.ordersService.getOrders().subscribe({
   *   next: (orders) => console.log('Orders:', orders),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }
}
````

### Composants

````typescript
/**
 * Spinner component for displaying loading states.
 *
 * Displays a Bootstrap spinner with customizable size and color variant.
 * Uses Bootstrap spinner classes for consistent styling.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-spinner />
 * ```
 *
 * ### Custom Size and Color
 * ```html
 * <lib-spinner [size]="'lg'" [variant]="'success'" />
 * ```
 *
 * @see SkeletonComponent
 * @category Shared UI
 */
@Component({
  selector: 'lib-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * Bootstrap color variant
   * @default 'primary'
   */
  variant = input<'primary' | 'secondary' | 'success' | 'danger'>('primary');
}
````

### Guards

````typescript
/**
 * Authentication guard to protect routes requiring authentication.
 *
 * Checks if user is authenticated and redirects to login page if not.
 * Uses AuthService to verify authentication state.
 *
 * @usageNotes
 * Apply to routes in routing configuration:
 * ```typescript
 * {
 *   path: 'orders',
 *   component: OrdersComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 *
 * @see AuthService
 * @category Security
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/sign-in']);
};
````

### Interceptors

````typescript
/**
 * HTTP interceptor for adding authentication token to requests.
 *
 * Automatically adds Bearer token to all outgoing HTTP requests
 * if user is authenticated. Token is retrieved from AuthService.
 *
 * @usageNotes
 * Configure in app.config.ts:
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([authInterceptor])
 *     )
 *   ]
 * };
 * ```
 *
 * @see AuthService
 * @category Security
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
````

### Models et Interfaces

```typescript
/**
 * Represents an order in the system.
 *
 * Contains all information about a customer order including
 * identification, description, amount, and status.
 *
 * @category Models
 * @see OrdersService
 */
export interface Order {
  /**
   * Unique identifier
   * @format uuid
   */
  id: string;

  /**
   * Order title or name
   * @minLength 3
   * @maxLength 100
   */
  title: string;

  /**
   * Order amount in euros
   * @minimum 0
   */
  amount: number;

  /**
   * Current order status
   * @default 'pending'
   */
  status: OrderStatus;

  /**
   * Order creation date
   * @format date-time
   */
  createdAt: Date;
}

/**
 * Order status enumeration
 *
 * @category Models
 */
export enum OrderStatus {
  /** Order is awaiting processing */
  Pending = 'pending',
  /** Order has been confirmed */
  Confirmed = 'confirmed',
  /** Order is being delivered */
  Delivered = 'delivered',
  /** Order has been cancelled */
  Cancelled = 'cancelled',
}
```

### Signals

```typescript
/**
 * Current loading state
 * @internal - Not exposed in public API
 */
private loading = signal(false);

/**
 * List of orders
 * @readonly - Use methods to modify
 */
readonly orders = signal<Order[]>([]);

/**
 * Total number of orders
 * @computed - Derived from orders array
 */
readonly totalOrders = computed(() => this.orders().length);

/**
 * Selected order, linked to orders list
 * @linkedSignal - Automatically updates when orders change
 */
readonly selectedOrder = linkedSignal(() => this.orders()[0]);
```

### Inputs/Outputs

```typescript
/**
 * User data to display in the card
 * @required - Must be provided by parent component
 */
user = input.required<User>();

/**
 * Optional CSS classes to apply to the card
 * @default ''
 */
customClass = input<string>('');

/**
 * Emitted when user clicks the edit button
 * @event
 * @param user - The edited user data
 */
userEdited = output<User>();
```

## 🏷️ Tags Compodoc

### Tags Essentiels

| Tag           | Usage                        | Exemple                        |
| ------------- | ---------------------------- | ------------------------------ |
| `@usageNotes` | Comment utiliser l'élément   | Exemples d'usage concrets      |
| `@example`    | Exemples de code             | Blocs de code illustratifs     |
| `@see`        | Références croisées          | `@see OrdersService`           |
| `@category`   | Catégorie Compodoc           | Data Access, UI, Feature       |
| `@throws`     | Erreurs possibles            | `@throws {HttpErrorResponse}`  |
| `@param`      | Description d'un paramètre   | `@param user - User data`      |
| `@returns`    | Valeur de retour             | `@returns Observable<Order[]>` |
| `@default`    | Valeur par défaut            | `@default 'primary'`           |
| `@deprecated` | Code obsolète                | Migration vers nouvelle API    |
| `@internal`   | API interne (non publique)   | Ne pas utiliser                |
| `@readonly`   | Lecture seule                | Signal readonly                |
| `@computed`   | Signal computed              | Valeur dérivée                 |
| `@event`      | Output/EventEmitter          | Événement émis                 |
| `@required`   | Input obligatoire            | Doit être fourni               |
| `@linkedSignal` | Signal lié à un autre      | Mise à jour automatique        |

### Tags Avancés

| Tag          | Usage                  | Exemple             |
| ------------ | ---------------------- | ------------------- |
| `@since`     | Version d'introduction | `@since 2.0.0`      |
| `@version`   | Version actuelle       | `@version 2.1.0`    |
| `@alpha`     | Fonctionnalité alpha   | API instable        |
| `@beta`      | Fonctionnalité beta    | API en test         |
| `@experimental` | Expérimental        | Peut changer        |
| `@public`    | API publique           | Exposé (défaut)     |
| `@protected` | Héritage uniquement    | Classes dérivées    |
| `@private`   | Usage interne          | Ne pas utiliser     |
| `@format`    | Format attendu         | `@format uuid`      |
| `@minLength` | Longueur minimum       | `@minLength 3`      |
| `@maxLength` | Longueur maximum       | `@maxLength 100`    |
| `@minimum`   | Valeur minimum         | `@minimum 0`        |
| `@maximum`   | Valeur maximum         | `@maximum 100`      |

## 📊 Génération de la Documentation

### Commandes disponibles

#### Mode développement (avec serveur)

```bash
npm run docs
```

- Génère la documentation
- Lance un serveur sur `http://localhost:8080`
- Ouvre automatiquement le navigateur
- Recharge automatiquement en cas de changement

#### Build statique

```bash
npm run docs:build
```

- Génère la documentation dans `docs/compodoc/`
- Pas de serveur (fichiers HTML statiques)
- À utiliser pour déploiement ou CI/CD

#### Vérification de couverture

```bash
npm run docs:coverage
```

- Analyse la couverture de la documentation
- Affiche le pourcentage global
- Affiche le pourcentage par fichier
- Échoue si < 80% global ou < 70% par fichier

#### Mode watch

```bash
npm run docs:watch
```

- Comme `npm run docs` mais recompile automatiquement
- Utile pendant le développement

### Seuils de couverture

**Configuration actuelle** :

- **Global** : 80% minimum (configuré dans `.compodocrc.json`)
- **Par fichier** : 70% minimum

**Fichiers ignorés** :

- Fichiers privés (`disablePrivate: true`)
- Éléments internes (`disableInternal: true`)

## ✅ Checklist Documentation

Avant de commit du code :

- [ ] Services publics documentés avec JSDoc complet
- [ ] Composants shared-ui avec `@usageNotes` et exemples
- [ ] Tous les inputs/outputs publics documentés
- [ ] Signals publics avec `@readonly` ou `@computed`
- [ ] Guards/Interceptors avec `@usageNotes`
- [ ] Models/Interfaces avec descriptions des propriétés
- [ ] Tags `@category` pour organisation Compodoc
- [ ] Tags `@see` pour références croisées
- [ ] Pas de code commenté mort
- [ ] Coverage Compodoc > 80% (vérifier avec `npm run docs:coverage`)

## 📚 Ressources

- [Compodoc Official Documentation](https://compodoc.app/)
- [TypeDoc Documentation](https://typedoc.org/)
- [TSDoc Specification](https://tsdoc.org/)
- [JSDoc Reference](https://jsdoc.app/)

