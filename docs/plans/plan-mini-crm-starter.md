# Plan Mini CRM Starter - Exécution Optimisée

**Vue d'ensemble** : Plan d'exécution pour créer le projet Mini CRM Angular 20 avec Nx monorepo. Application avec authentification préparée (mockée) et gestion de commandes 100% fonctionnelle avec json-server.

**Mode d'exécution recommandé** : Copier-coller chaque tâche dans le chat de l'agent spécialisé correspondant, vérifier le code généré, puis committer (1 tâche = 1 commit).

---

## Étape 1 : Configuration initiale et infrastructure

### Tâche 1.1 : Configuration Nx et installation dépendances

**Rôle** : Agent Architecte Nx

**Contexte** : Projet Angular 20 avec Nx monorepo nécessitant Bootstrap 5, json-server pour l'API, et configuration des generators Nx.

**Objectif** : Configurer l'environnement de développement complet (deps, scripts, styles Bootstrap).

**Specs fonctionnelles** :
- Installer bootstrap, bootstrap-icons, json-server@0.17.4, json-server-auth@2.1.0, @types/bootstrap, concurrently
- Vérifier scripts npm : server, server:auth, dev, graph:*, docs (doivent déjà exister)
- Charger Bootstrap CSS et Bootstrap Icons dans apps/mini-crm/project.json (targets > build > options > styles)
- Vérifier nx.json : SCSS par défaut, Vitest, OnPush déjà configurés

**Contraintes spécifiques** :
- Versions exactes : json-server 0.17.4 et json-server-auth 2.1.0 (stabilité)
- Bootstrap CSS only dans styles, Bootstrap JS uniquement pour modals si nécessaire

**Référence** : @STARTER-PROMPT.md sections 1, 1bis et 2

**Commit suggéré** : `feat: configure Nx and install dependencies (Task 1.1)`

---

### Tâche 1.2 : Création db.json pour json-server

**Rôle** : Agent Intégrateur API

**Contexte** : json-server simule l'API REST pendant le développement. db.json contient les données mockées.

**Objectif** : Créer le fichier db.json à la racine avec les collections initiales.

**Specs fonctionnelles** :
- Collection `users` : tableau vide (pour json-server-auth)
- Collection `orders` : 3 commandes exemples avec structure complète (id, customer, nbDays, tjm, tauxTva, totalHt, totalTtc)

**Contraintes spécifiques** :
- Structure exacte selon STARTER-PROMPT.md section 3
- Les IDs doivent être des numbers (json-server auto-increment)

**Référence** : @STARTER-PROMPT.md section 3

**Commit suggéré** : `feat: create db.json for json-server (Task 1.2)`

---

### Tâche 1.3 : Vérification contraintes ESLint Nx

**Rôle** : Agent Architecte Nx

**Contexte** : Les contraintes de dépendances entre libs sont déjà configurées dans eslint.config.mjs.

**Objectif** : Vérifier que depConstraints existe (type:app, type:feature, type:ui, type:data-access).

**Specs fonctionnelles** :
- Vérifier présence des 4 règles depConstraints dans eslint.config.mjs
- Aucune modification si déjà en place

**Contraintes spécifiques** :
- Selon STARTER-PROMPT.md, c'est déjà configuré (✅ DÉJÀ CONFIGURÉ)

**Référence** : @STARTER-PROMPT.md section 1bis

**Commit suggéré** : `chore: verify ESLint dep constraints (Task 1.3)`

---

## Étape 2 : Architecture Nx - Création des libs

### Tâche 2.1 : Génération des 5 libs Nx avec tags

**Rôle** : Agent Architecte Nx

**Contexte** : Structure monorepo Nx avec séparation claire : shared-ui (composants UI purs), data-access (services/models), features (logique métier), layout (structure app).

**Objectif** : Générer les 5 libs avec la syntaxe correcte et ajouter les tags Nx pour les contraintes de dépendances.

**Specs fonctionnelles** :
- Générer libs avec `--name` et `--directory` : shared-ui, data-access, feature-auth, feature-orders, layout
- Ajouter tags dans chaque project.json :
  * shared-ui → ["type:ui"]
  * data-access → ["type:data-access"]
  * feature-auth → ["type:feature", "scope:auth"]
  * feature-orders → ["type:feature", "scope:orders"]
  * layout → ["type:ui"]

**Contraintes spécifiques** :
- Syntaxe Nx : `npx nx g @nx/angular:library --name=X --directory=libs/X --unitTestRunner=vitest`
- Les tags activent les contraintes ESLint déjà configurées

**Dépendances** : eslint.config.mjs vérifié (tâche 1.3)

**Référence** : @STARTER-PROMPT.md section 4 étape 1

**Commit suggéré** : `feat: generate 5 Nx libs with appropriate tags (Task 2.1)`

---

## Étape 3 : Configuration API multi-environnement

### Tâche 3.1 : Système API_CONFIG avec InjectionToken

**Rôle** : Agent Intégrateur API

**Contexte** : L'URL de l'API doit être configurable (dev/prod). Nx utilise les InjectionTokens pour la configuration multi-environnement.

**Objectif** : Créer le système de configuration API avec token, environnements et fileReplacements.

**Specs fonctionnelles** :
- Créer interface ApiConfig et token API_CONFIG dans libs/data-access/src/lib/config/api.config.ts
- Exporter dans libs/data-access/src/index.ts
- Créer environments/environment.ts (dev) : apiUrl = 'http://localhost:3000'
- Créer environments/environment.prod.ts (prod) : apiUrl = 'http://localhost:3000'
- Provider dans app.config.ts : { provide: API_CONFIG, useValue: { apiUrl: environment.apiUrl } }
- fileReplacements dans apps/mini-crm/project.json (production config)

**Contraintes spécifiques** :
- Le token doit être exporté AVANT les services qui l'utilisent (ordre barrel export)
- Les services injecteront API_CONFIG avec inject(API_CONFIG)

**Référence** : @STARTER-PROMPT.md section 4 étape 1bis

**Commit suggéré** : `feat: setup API_CONFIG with InjectionToken for multi-env (Task 3.1)`

---

## Étape 4 : Models et interfaces (data-access)

### Tâche 4.1 : Models d'authentification

**Rôle** : Agent Développeur Angular

**Contexte** : Models pour l'authentification json-server-auth (à connecter en formation).

**Objectif** : Créer les interfaces auth dans libs/data-access/src/lib/models/auth.model.ts.

**Specs fonctionnelles** :
- Interface User : id? (number), email (string)
- Interface LoginRequest : email, password
- Interface RegisterRequest : email, password
- Interface AuthResponse : accessToken (string), user (User)

**Contraintes spécifiques** :
- id optionnel car absent à la création
- Structure compatible json-server-auth

**Référence** : @STARTER-PROMPT.md section 6

**Commit suggéré** : `feat: add auth models (User, LoginRequest, etc.) (Task 4.1)`

---

### Tâche 4.2 : Models de commandes

**Rôle** : Agent Développeur Angular

**Contexte** : Les commandes sont l'entité centrale du CRM. Les totaux sont calculés côté front avant envoi.

**Objectif** : Créer les interfaces et types order dans libs/data-access/src/lib/models/order.model.ts.

**Specs fonctionnelles** :
- Interface Order : id, customer, nbDays, tjm, tauxTva, totalHt, totalTtc (tous number sauf customer string)
- Type CreateOrder : Omit<Order, 'id' | 'totalHt' | 'totalTtc'>
- Type UpdateOrder : Omit<Order, 'totalHt' | 'totalTtc'>

**Contraintes spécifiques** :
- totalHt et totalTtc sont exclus des types Create/Update car calculés automatiquement
- id absent à la création (json-server auto-increment)

**Référence** : @STARTER-PROMPT.md section 6

**Commit suggéré** : `feat: add order models (Order, CreateOrder, UpdateOrder) (Task 4.2)`

---

## Étape 5 : Composants UI réutilisables (shared-ui)

### Tâche 5.1 : SpinnerComponent

**Rôle** : Agent Styliste Frontend

**Contexte** : Composant de chargement réutilisable dans toute l'app.

**Objectif** : Créer un spinner Bootstrap simple dans libs/shared-ui/src/lib/spinner/.

**Specs fonctionnelles** :
- Selector : lib-spinner
- Spinner Bootstrap centré (spinner-border)
- Template inline acceptable (< 20 lignes)

**Contraintes spécifiques** :
- Préfixe lib- obligatoire (libs)
- Fichier SCSS séparé même pour template inline

**Référence** : @STARTER-PROMPT.md section 7

**Commit suggéré** : `feat: add SpinnerComponent in shared-ui (Task 5.1)`

---

### Tâche 5.2 : ConfirmModalComponent

**Rôle** : Agent Styliste Frontend

**Contexte** : Modal de confirmation réutilisable (ex: suppression de commande).

**Objectif** : Créer une modal Bootstrap générique dans libs/shared-ui/src/lib/confirm-modal/.

**Specs fonctionnelles** :
- Selector : lib-confirm-modal
- Inputs : modalId (required), title (défaut "Confirmation"), message
- Output : confirm (EventEmitter)
- Fermeture via API JavaScript Bootstrap (bootstrap.Modal)

**Contraintes spécifiques** :
- modalId unique nécessaire pour gérer plusieurs modals sur une page
- Utiliser @types/bootstrap pour l'API JavaScript

**Référence** : @STARTER-PROMPT.md section 7

**Commit suggéré** : `feat: add ConfirmModalComponent in shared-ui (Task 5.2)`

---

## Étape 6 : Système de Layout

### Tâche 6.1 : HeaderComponent

**Rôle** : Agent Styliste Frontend

**Contexte** : Header de l'app avec logo et titre (visible après authentification).

**Objectif** : Créer le header dans libs/layout/src/lib/header/.

**Specs fonctionnelles** :
- Selector : lib-header
- Icône bi-briefcase-fill + texte "Mini CRM"
- Fond sombre, texte blanc

**Référence** : @STARTER-PROMPT.md section 8

**Commit suggéré** : `feat: add HeaderComponent in layout (Task 6.1)`

---

### Tâche 6.2 : SidebarComponent

**Rôle** : Agent Styliste Frontend

**Contexte** : Navigation latérale de l'app (visible après authentification).

**Objectif** : Créer la sidebar dans libs/layout/src/lib/sidebar/.

**Specs fonctionnelles** :
- Selector : lib-sidebar
- Navigation verticale avec lien "Commandes" (icône bi-list-ul)
- RouterLink vers /orders
- RouterLinkActive pour l'état actif

**Contraintes spécifiques** :
- Importer RouterLink et RouterLinkActive dans le component

**Référence** : @STARTER-PROMPT.md section 8

**Commit suggéré** : `feat: add SidebarComponent in layout (Task 6.2)`

---

### Tâche 6.3 : LayoutComponent avec logique conditionnelle

**Rôle** : Agent Développeur Angular

**Contexte** : Conteneur principal qui affiche header/sidebar uniquement si utilisateur authentifié.

**Objectif** : Créer le layout avec content projection et logique d'affichage conditionnelle dans libs/layout/src/lib/.

**Specs fonctionnelles** :
- Selector : lib-layout
- Structure vh-100 flexbox vertical
- Content projection : ng-content select="[layout-header]" et select="[layout-sidebar]"
- Router-outlet dans la zone main
- Injecter AuthService pour vérifier authentification

**Contraintes spécifiques** :
- Si !authService.isAuthenticated() : masquer COMPLÈTEMENT header et sidebar (ne pas juste les cacher avec CSS), afficher main plein écran centré
- authService.isAuthenticated() est un computed signal (déjà disponible dans AuthService)
- Variables CSS : --sidebar-width, --header-height, --main-padding

**Dépendances** : AuthService créé dans tâche 7.1

**Référence** : @STARTER-PROMPT.md section 8

**Commit suggéré** : `feat: add LayoutComponent with conditional display (Task 6.3)`

---

## Étape 7 : Feature Auth (préparée, non connectée)

### Tâche 7.1 : AuthService mocké

**Rôle** : Agent Développeur Angular

**Contexte** : Service d'authentification préparé pour la formation. Les méthodes retournent des données mockées (pas d'appel API réel).

**Objectif** : Créer AuthService dans libs/data-access/src/lib/services/auth.service.ts.

**Specs fonctionnelles** :
- Signals : token (string | null), user (User | null), isAuthenticated (computed(() => !!this.token()))
- Méthodes : signIn(credentials: LoginRequest): Observable<AuthResponse>, signUp(credentials: RegisterRequest): Observable<AuthResponse>, logout(): void
- Les méthodes retournent des observables avec données mockées

**Contraintes spécifiques** :
- NE PAS appeler l'API json-server-auth (à connecter en formation)
- Les méthodes doivent mettre à jour les signals token et user lors de la "connexion mockée"

**Référence** : @STARTER-PROMPT.md section 10

**Commit suggéré** : `feat: add mocked AuthService in data-access (Task 7.1)`

---

### Tâche 7.2 : SignInComponent

**Rôle** : Agent Développeur Angular

**Contexte** : Formulaire de connexion plein écran (point d'entrée de l'app).

**Objectif** : Créer le composant dans libs/feature-auth/src/lib/components/sign-in/.

**Specs fonctionnelles** :
- Selector : lib-sign-in
- Formulaire réactif : email (required, email), password (required, minLength 8)
- Validation Bootstrap (is-invalid, invalid-feedback)
- Lien vers /auth/sign-up : "Pas encore de compte ? S'inscrire"
- Card Bootstrap centré plein écran

**Contraintes spécifiques** :
- Importer RouterLink pour le lien de navigation

**Référence** : @STARTER-PROMPT.md section 10

**Commit suggéré** : `feat: add SignInComponent in feature-auth (Task 7.2)`

---

### Tâche 7.3 : SignUpComponent

**Rôle** : Agent Développeur Angular

**Contexte** : Formulaire d'inscription avec confirmation de mot de passe.

**Objectif** : Créer le composant dans libs/feature-auth/src/lib/components/sign-up/.

**Specs fonctionnelles** :
- Selector : lib-sign-up
- Formulaire réactif : email, password, confirmPassword
- Validator custom pour vérifier que password === confirmPassword
- Lien vers /auth/sign-in : "Déjà un compte ? Se connecter"

**Contraintes spécifiques** :
- Le validator custom doit être au niveau du FormGroup, pas des controls individuels

**Référence** : @STARTER-PROMPT.md section 10

**Commit suggéré** : `feat: add SignUpComponent in feature-auth (Task 7.3)`

---

### Tâche 7.4 : AuthGuard et AuthInterceptor préparés

**Rôle** : Agent Intégrateur API

**Contexte** : Guard et interceptor préparés pour la formation. Le guard laisse passer (retourne true), l'interceptor est fonctionnel mais non enregistré.

**Objectif** : Créer guard et interceptor dans libs/feature-auth/src/lib/.

**Specs fonctionnelles** :
- AuthGuard (guards/auth.guard.ts) : guard fonctionnel qui retourne true pour l'instant + code commenté pour vérification auth (formation)
- AuthInterceptor (interceptors/auth.interceptor.ts) : interceptor fonctionnel qui ajoute Bearer token si présent + commentaire TODO pour enregistrement dans app.config.ts (formation)

**Contraintes spécifiques** :
- Le guard doit être fonctionnel (retourne true) pour ne pas bloquer le dev
- L'interceptor est fonctionnel mais ne sera enregistré qu'en formation

**Référence** : @STARTER-PROMPT.md section 10

**Commit suggéré** : `feat: add AuthGuard and AuthInterceptor (prepared) (Task 7.4)`

---

### Tâche 7.5 : Routes auth

**Rôle** : Agent Développeur Angular

**Contexte** : Routes pour le module d'authentification.

**Objectif** : Créer libs/feature-auth/src/lib/auth.routes.ts.

**Specs fonctionnelles** :
- Route '' redirect vers 'sign-in'
- Route 'sign-in' → SignInComponent
- Route 'sign-up' → SignUpComponent
- Exporter comme AUTH_ROUTES

**Référence** : @STARTER-PROMPT.md section 10

**Commit suggéré** : `feat: add auth routes (Task 7.5)`

---

## Étape 8 : Feature Orders (100% fonctionnelle)

### Tâche 8.1 : OrdersService avec json-server

**Rôle** : Agent Intégrateur API

**Contexte** : Service de gestion des commandes 100% fonctionnel avec json-server (contrairement à auth qui est mocké). Les calculs totalHt/totalTtc se font côté front.

**Objectif** : Créer OrdersService dans libs/data-access/src/lib/services/orders.service.ts.

**Specs fonctionnelles** :
- CRUD complet : getAll(), getById(id), create(orderData: CreateOrder), update(orderData: UpdateOrder), delete(id)
- Calculs automatiques avant POST/PUT :
  * totalHt = nbDays × tjm
  * totalTtc = totalHt × (1 + tauxTva / 100)
- Signals : orders (Order[]), loading (boolean), error (string | null)

**Contraintes spécifiques** :
- Utiliser API_CONFIG token (inject(API_CONFIG)) pour l'URL, pas de hardcode
- Appeler getAll() après create/update/delete pour rafraîchir automatiquement
- Les calculs se font côté front avant envoi, pas délégués au serveur

**Dépendances** : API_CONFIG configuré (tâche 3.1), models Order créés (tâche 4.2)

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add OrdersService with json-server integration (Task 8.1)`

---

### Tâche 8.2 : OrderFormComponent réutilisable

**Rôle** : Agent Développeur Angular

**Contexte** : Formulaire réutilisable pour création ET édition de commandes. Les totaux sont affichés en temps réel.

**Objectif** : Créer le composant dans libs/feature-orders/src/lib/components/order-form/.

**Specs fonctionnelles** :
- Selector : lib-order-form
- Input : order (Order | null) - null pour création, Order pour édition
- Outputs : save, cancel
- Formulaire réactif : customer, nbDays, tjm, tauxTva avec validation
- Computed signals pour afficher totalHt et totalTtc en temps réel
- effect() pour patcher le form en mode édition quand order() change

**Contraintes spécifiques** :
- effect() avec allowSignalWrites pour patcher le form sans erreur
- Les totaux sont affichés mais pas éditables (lecture seule)

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add reusable OrderFormComponent (Task 8.2)`

---

### Tâche 8.3 : OrderListComponent

**Rôle** : Agent Styliste Frontend

**Contexte** : Liste des commandes avec actions CRUD (point d'entrée de la feature).

**Objectif** : Créer le composant dans libs/feature-orders/src/lib/components/order-list/.

**Specs fonctionnelles** :
- Selector : lib-order-list
- Table Bootstrap responsive avec @for et track
- Colonnes : customer, nbDays, tjm, totalHt, totalTtc, actions
- Boutons actions : Éditer (bi-pencil), Supprimer (bi-trash), Ajouter (bi-plus-lg)
- ConfirmModalComponent pour confirmation suppression
- Appeler ordersService.getAll() au chargement (ngOnInit)

**Contraintes spécifiques** :
- track obligatoire dans @for : track order.id

**Dépendances** : OrdersService (tâche 8.1), ConfirmModalComponent (tâche 5.2)

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add OrderListComponent with CRUD actions (Task 8.3)`

---

### Tâche 8.4 : OrderAddComponent

**Rôle** : Agent Développeur Angular

**Contexte** : Page d'ajout de commande.

**Objectif** : Créer le composant dans libs/feature-orders/src/lib/components/order-add/.

**Specs fonctionnelles** :
- Selector : lib-order-add
- Utilise OrderFormComponent avec order = null
- Appeler ordersService.create() sur event save
- Navigation vers /orders après succès ou annulation

**Dépendances** : OrderFormComponent (tâche 8.2)

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add OrderAddComponent (Task 8.4)`

---

### Tâche 8.5 : OrderEditComponent

**Rôle** : Agent Développeur Angular

**Contexte** : Page d'édition de commande.

**Objectif** : Créer le composant dans libs/feature-orders/src/lib/components/order-edit/.

**Specs fonctionnelles** :
- Selector : lib-order-edit
- Récupérer l'ID depuis ActivatedRoute
- Signal order récupéré via ordersService.getById(id)
- Utilise OrderFormComponent avec order
- Appeler ordersService.update() sur event save
- Navigation vers /orders après succès ou annulation

**Contraintes spécifiques** :
- Gérer le cas où l'ID n'existe pas (redirect vers liste)

**Dépendances** : OrderFormComponent (tâche 8.2)

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add OrderEditComponent (Task 8.5)`

---

### Tâche 8.6 : Routes orders

**Rôle** : Agent Développeur Angular

**Contexte** : Routes pour la feature orders.

**Objectif** : Créer libs/feature-orders/src/lib/orders.routes.ts.

**Specs fonctionnelles** :
- Route '' → OrderListComponent
- Route 'add' → OrderAddComponent
- Route 'edit/:id' → OrderEditComponent
- Exporter comme ORDERS_ROUTES

**Référence** : @STARTER-PROMPT.md section 11

**Commit suggéré** : `feat: add orders routes (Task 8.6)`

---

## Étape 9 : Configuration App et Routing principal

### Tâche 9.1 : Intégration LayoutComponent dans app.component

**Rôle** : Agent Développeur Angular

**Contexte** : app.component est le point d'entrée, il doit utiliser le LayoutComponent avec content projection.

**Objectif** : Remplacer le contenu généré par Angular CLI dans apps/mini-crm/src/app/app.component.*.

**Specs fonctionnelles** :
- Supprimer tout le HTML généré par Angular CLI dans app.component.html
- Utiliser LayoutComponent avec :
  * HeaderComponent avec attribut layout-header
  * SidebarComponent avec attribut layout-sidebar
- Mettre à jour app.component.ts : imports LayoutComponent, HeaderComponent, SidebarComponent

**Contraintes spécifiques** :
- Le router-outlet est DANS LayoutComponent, pas dans app.component.html

**Dépendances** : LayoutComponent (tâche 6.3), HeaderComponent (tâche 6.1), SidebarComponent (tâche 6.2)

**Référence** : @STARTER-PROMPT.md section 9

**Commit suggéré** : `feat: integrate LayoutComponent in app.component (Task 9.1)`

---

### Tâche 9.2 : Configuration app.config.ts

**Rôle** : Agent Intégrateur API

**Contexte** : Configuration centrale des providers Angular (routing, HTTP, API config).

**Objectif** : Configurer app.config.ts avec tous les providers nécessaires.

**Specs fonctionnelles** :
- provideZonelessChangeDetection()
- provideRouter(routes)
- provideHttpClient()
- Provider API_CONFIG déjà ajouté (tâche 3.1)
- Commentaire TODO : provideHttpClient(withInterceptors([authInterceptor])) pour la formation

**Contraintes spécifiques** :
- L'interceptor n'est PAS enregistré maintenant (formation)

**Dépendances** : API_CONFIG (tâche 3.1)

**Référence** : @STARTER-PROMPT.md section 12

**Commit suggéré** : `feat: configure app.config.ts with providers (Task 9.2)`

---

### Tâche 9.3 : Configuration app.routes.ts

**Rôle** : Agent Architecte Nx

**Contexte** : Routing principal de l'app avec lazy loading des features.

**Objectif** : Configurer les routes dans apps/mini-crm/src/app/app.routes.ts.

**Specs fonctionnelles** :
- Route '' redirect vers 'auth/sign-in' (pathMatch: 'full')
- Route 'auth' avec loadChildren vers @mini-crm/feature-auth (AUTH_ROUTES)
- Route 'orders' avec canActivate: [authGuard] et loadChildren vers @mini-crm/feature-orders (ORDERS_ROUTES)

**Contraintes spécifiques** :
- Utiliser les alias Nx (@mini-crm/...) pour lazy loading
- authGuard appliqué uniquement sur /orders (pas sur /auth)

**Dépendances** : AUTH_ROUTES (tâche 7.5), ORDERS_ROUTES (tâche 8.6), authGuard (tâche 7.4)

**Référence** : @STARTER-PROMPT.md section 12

**Commit suggéré** : `feat: configure app.routes.ts with lazy loading (Task 9.3)`

---

## Étape 10 : Vérifications finales

### Tâche 10.1 : Build et lint

**Rôle** : Agent Architecte Nx

**Contexte** : Vérifier que le projet compile et respecte les contraintes de dépendances Nx.

**Objectif** : Exécuter build et lint pour validation finale.

**Specs fonctionnelles** :
- Exécuter `nx build mini-crm`
- Exécuter `nx lint mini-crm`
- Corriger les erreurs de contraintes de dépendances si détectées

**Contraintes spécifiques** :
- Les contraintes ESLint doivent être respectées (pas de violations depConstraints)

**Référence** : @STARTER-PROMPT.md section 14

**Commit suggéré** : `chore: verify build and lint pass (Task 10.1)`

---

### Tâche 10.2 : Test end-to-end fonctionnel

**Rôle** : Agent Intégrateur API

**Contexte** : Vérifier que le flux complet fonctionne (auth mockée + orders avec json-server).

**Objectif** : Lancer l'app et l'API, tester le flux complet.

**Specs fonctionnelles** :
- Lancer `npm run dev` (app + json-server en parallèle)
- Vérifier json-server démarre sur http://localhost:3000
- Tester le flux :
  * Redirection automatique vers /auth/sign-in
  * Connexion mockée fonctionnelle
  * Accès à /orders après connexion
  * Liste des 3 commandes du db.json affichée
  * CRUD complet : création, édition, suppression

**Contraintes spécifiques** :
- Les 3 commandes du db.json doivent s'afficher immédiatement
- Les calculs totalHt/totalTtc doivent être corrects

**Référence** : @STARTER-PROMPT.md section 14

**Commit suggéré** : `test: verify complete E2E flow works (Task 10.2)`

---

### Tâche 10.3 : Vérification documentation Compodoc

**Rôle** : Agent Architecte Nx

**Contexte** : Vérifier que la documentation API est suffisante (objectif > 80% de couverture).

**Objectif** : Générer et vérifier la couverture de documentation.

**Specs fonctionnelles** :
- Exécuter `npm run docs:coverage`
- Vérifier couverture > 80%
- Identifier les éléments non documentés si < 80%

**Contraintes spécifiques** :
- Seuls services publics, composants shared-ui, guards, interceptors doivent être documentés
- Les composants feature internes peuvent avoir une doc minimale

**Référence** : @STARTER-PROMPT.md, project.mdc section Documentation

**Commit suggéré** : `docs: verify Compodoc coverage > 80% (Task 10.3)`

---

## Résumé des agents et de leurs responsabilités

- **Agent Architecte Nx** : Structure monorepo, génération libs, configuration Nx, vérifications finales
- **Agent Développeur Angular** : Composants Angular, services métier, formulaires, routing
- **Agent Intégrateur API** : Services HTTP, json-server, guards, interceptors, configuration API
- **Agent Styliste Frontend** : Composants UI, layout, styles SCSS, Bootstrap, accessibilité

---

## Notes d'exécution

- **1 tâche = 1 commit** : Chaque tâche correspond à un commit atomique
- **Validation intermédiaire** : Vérifier le code généré avant de passer à la tâche suivante
- **Tests locaux** : Tester localement quand possible (ex: après tâche 8.1, tester les appels API)
- **Rollback facile** : En cas d'erreur, `git reset --hard HEAD~1` pour revenir à la tâche précédente

