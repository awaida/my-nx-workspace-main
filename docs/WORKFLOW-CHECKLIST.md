# Workflow de Documentation - Checklist

Ce document décrit le workflow complet pour maintenir une documentation de qualité avec Compodoc.

## 🔄 Workflow Standard

### 1. Avant de Coder

- [ ] Identifier le type d'élément à créer (service, composant, guard, etc.)
- [ ] Choisir le template JSDoc approprié (voir `JSDOC-QUICK-GUIDE.md`)
- [ ] Préparer les exemples d'utilisation

### 2. Pendant le Développement

- [ ] Écrire le JSDoc en même temps que le code
- [ ] Inclure `@usageNotes` avec exemples concrets
- [ ] Ajouter `@category` pour l'organisation Compodoc
- [ ] Documenter tous les inputs/outputs publics
- [ ] Documenter les signals publics

### 3. Avant de Commit

- [ ] Vérifier la syntaxe JSDoc (pas d'erreurs ESLint)
- [ ] S'assurer que tous les éléments publics sont documentés
- [ ] Tester les exemples d'utilisation
- [ ] Exécuter `npm run docs:coverage` et vérifier > 80%
- [ ] Pas de code commenté mort

### 4. Review (Pull Request)

- [ ] La documentation est claire et compréhensible
- [ ] Les exemples fonctionnent
- [ ] Les références croisées (`@see`) sont correctes
- [ ] La catégorie Compodoc est appropriée

## 📋 Checklist par Type d'Élément

### Service (data-access/)

**Obligatoire** :

- [ ] Description courte du service
- [ ] Description longue avec responsabilités
- [ ] `@usageNotes` avec injection via `inject()`
- [ ] `@category Data Access`
- [ ] `@see` vers les interfaces/models utilisés
- [ ] Documentation de toutes les méthodes publiques
- [ ] `@param` pour chaque paramètre
- [ ] `@returns` pour la valeur de retour
- [ ] `@throws` pour les erreurs possibles
- [ ] `@example` avec cas d'usage concrets

**Exemple de checklist remplie** :

```typescript
✅ Description courte : "Service for managing orders"
✅ Description longue : Explique CRUD et state management
✅ @usageNotes : Montre comment injecter avec inject()
✅ @category Data Access
✅ @see Order, OrderStatus
✅ getOrders() documentée avec @returns et @throws
✅ createOrder() documentée avec @param et @example
```

### Composant (shared-ui/)

**Obligatoire** :

- [ ] Description courte du composant
- [ ] Description de ce qu'il affiche
- [ ] `@usageNotes` avec exemples HTML
- [ ] `@category Shared UI`
- [ ] `@see` vers composants similaires
- [ ] Documentation de tous les inputs
- [ ] `@default` sur inputs optionnels
- [ ] `@required` sur inputs obligatoires
- [ ] Documentation de tous les outputs
- [ ] `@event` sur les outputs

**Exemple de checklist remplie** :

```typescript
✅ Description : "Spinner component for loading states"
✅ Explique : Bootstrap spinner customizable
✅ @usageNotes : Exemples <lib-spinner /> et avec inputs
✅ @category Shared UI
✅ @see SkeletonComponent
✅ size input documenté avec @default 'md'
✅ variant input documenté avec @default 'primary'
```

### Guard

**Obligatoire** :

- [ ] Description courte du guard
- [ ] Description du comportement (autorise/refuse)
- [ ] `@usageNotes` avec configuration de route
- [ ] `@category Security` (ou autre)
- [ ] `@see` vers services utilisés
- [ ] Explication des conditions d'autorisation

**Exemple de checklist remplie** :

```typescript
✅ Description : "Authentication guard"
✅ Comportement : Redirects to login if not authenticated
✅ @usageNotes : Montre { path: 'x', canActivate: [authGuard] }
✅ @category Security
✅ @see AuthService
```

### Interceptor

**Obligatoire** :

- [ ] Description courte de l'interceptor
- [ ] Description de ce qu'il intercepte
- [ ] `@usageNotes` avec configuration dans app.config
- [ ] `@category Security` (ou HTTP, etc.)
- [ ] `@see` vers services/guards liés

**Exemple de checklist remplie** :

```typescript
✅ Description : "Auth interceptor"
✅ Intercepte : All HTTP requests to add Bearer token
✅ @usageNotes : Montre provideHttpClient(withInterceptors([...]))
✅ @category Security
✅ @see AuthService
```

### Interface/Model

**Obligatoire** :

- [ ] Description de l'interface
- [ ] `@category Models`
- [ ] `@see` vers services qui l'utilisent
- [ ] Documentation de chaque propriété
- [ ] Tags de validation (`@format`, `@minLength`, etc.) si applicable
- [ ] `@default` si valeur par défaut

**Exemple de checklist remplie** :

```typescript
✅ Description : "Represents an order"
✅ @category Models
✅ @see OrdersService
✅ id : @format uuid
✅ title : @minLength 3, @maxLength 100
✅ amount : @minimum 0
✅ status : @default 'pending'
```

### Enum

**Obligatoire** :

- [ ] Description de l'enum
- [ ] `@category Models`
- [ ] Description de chaque valeur avec `/** */`

## 🔍 Vérification de la Couverture

### Commande

```bash
npm run docs:coverage
```

### Interprétation des Résultats

#### Couverture Globale

```
Documentation coverage is 85%
```

- **✅ ≥ 80%** : Objectif atteint
- **⚠️ 70-79%** : À améliorer
- **❌ < 70%** : Insuffisant

#### Couverture par Fichier

```
orders.service.ts       95%  ✅
spinner.component.ts    85%  ✅
auth.guard.ts          65%  ❌
```

- **✅ ≥ 70%** : Objectif atteint par fichier
- **❌ < 70%** : Fichier à documenter

### Résoudre les Problèmes de Couverture

#### Fichier sous 70%

1. Ouvrir le fichier concerné
2. Identifier les éléments publics sans JSDoc
3. Ajouter la documentation JSDoc
4. Re-tester avec `npm run docs:coverage`

#### Fichier ignoré par erreur

Vérifier dans `.compodocrc.json` :

```json
{
  "disablePrivate": true,    // Ignore les éléments privés
  "disableInternal": true,   // Ignore les @internal
  "disableProtected": false  // N'ignore PAS les protected
}
```

## 📊 Génération de la Documentation

### Mode Développement

```bash
npm run docs
```

**Utilisation** :

- Pendant le développement
- Recharge automatique
- Accessible sur `http://localhost:8080`

### Build de Production

```bash
npm run docs:build
```

**Utilisation** :

- Pour déploiement
- CI/CD
- Partage avec l'équipe
- Sortie dans `docs/compodoc/`

### Mode Watch

```bash
npm run docs:watch
```

**Utilisation** :

- Développement actif de documentation
- Recompile automatiquement à chaque changement
- Serveur sur `http://localhost:8080`

## 🎯 Objectifs de Qualité

### Minimums Requis

| Métrique                | Minimum | Idéal |
| ----------------------- | ------- | ----- |
| Couverture globale      | 80%     | 90%+  |
| Couverture par fichier  | 70%     | 80%+  |
| Services documentés     | 100%    | 100%  |
| Composants shared-ui    | 100%    | 100%  |
| Guards documentés       | 100%    | 100%  |
| Interceptors documentés | 100%    | 100%  |

### Qualité de la Documentation

- ✅ Chaque élément public a un JSDoc
- ✅ Descriptions claires et concises
- ✅ Exemples d'utilisation concrets
- ✅ Références croisées (`@see`)
- ✅ Tags appropriés (`@category`, `@usageNotes`)
- ✅ Pas de commentaires obsolètes

## 🚨 Problèmes Courants

### Problème : Couverture faible

**Solution** :

1. Exécuter `npm run docs:coverage`
2. Identifier les fichiers < 70%
3. Ouvrir chaque fichier
4. Ajouter JSDoc sur éléments publics
5. Re-tester

### Problème : Compodoc ne génère pas la doc

**Solutions** :

- Vérifier que `tsconfig.app.json` existe
- Vérifier la syntaxe JSDoc (pas d'erreurs)
- Essayer `npm run docs:build` au lieu de `npm run docs`
- Vérifier `.compodocrc.json`

### Problème : Exemples dans @usageNotes ne s'affichent pas

**Solution** :

Utiliser des blocs de code avec backticks :

````typescript
/**
 * @usageNotes
 * ```typescript
 * const x = 1;
 * ```
 */
````

### Problème : @category ne marche pas

**Solution** :

Vérifier l'orthographe exacte :

```typescript
/**
 * @category Data Access  // ✅ Correct
 * @Category data-access  // ❌ Incorrect
 */
```

## 📅 Maintenance

### Hebdomadaire

- [ ] Exécuter `npm run docs:coverage`
- [ ] Vérifier que la couverture est > 80%
- [ ] Corriger les fichiers < 70%

### À chaque Pull Request

- [ ] Reviewer la documentation des nouveaux fichiers
- [ ] Vérifier les exemples d'utilisation
- [ ] S'assurer que la couverture n'a pas baissé

### Mensuel

- [ ] Générer la documentation complète
- [ ] Partager avec l'équipe
- [ ] Identifier les sections à améliorer
- [ ] Mettre à jour les exemples obsolètes

## 🎓 Formation

### Pour les Nouveaux Développeurs

1. Lire `DOCUMENTATION.md`
2. Consulter `JSDOC-QUICK-GUIDE.md`
3. Parcourir la documentation générée (`npm run docs`)
4. Créer un premier fichier documenté avec supervision
5. Pratiquer sur des fichiers existants

### Best Practices à Partager

- Documenter en même temps qu'on code
- Utiliser les templates du quick guide
- Toujours inclure des exemples d'utilisation
- Penser aux futurs développeurs qui liront le code

## ✅ Checklist Finale

Avant de marquer une tâche comme terminée :

- [ ] Tous les services publics documentés
- [ ] Tous les composants shared-ui documentés
- [ ] Tous les guards/interceptors documentés
- [ ] Couverture globale > 80%
- [ ] Aucun fichier < 70%
- [ ] Exemples testés et fonctionnels
- [ ] Références croisées correctes
- [ ] Documentation déployée ou partagée

---

**Rappel** : Une bonne documentation fait gagner du temps à toute l'équipe ! 🚀

