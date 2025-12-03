# Mini CRM E2E Tests

Ce projet contient les tests End-to-End (E2E) pour l'application Mini CRM, utilisant Cypress.

## 📋 Prérequis

- Node.js installé
- L'application Mini CRM doit être démarrée sur `http://localhost:4200`
- Le serveur JSON doit être démarré sur `http://localhost:3000`

## 🚀 Lancer les tests

### Tests en mode headless (CI)

```bash
npm run e2e
# ou
nx e2e mini-crm-e2e
```

### Tests en mode interactif (Cypress UI)

```bash
npm run e2e:open
# ou
nx open-cypress mini-crm-e2e
```

### Tests avec watch mode

```bash
npm run e2e:watch
```

### Tests CI (optimisé pour CI/CD)

```bash
npm run e2e:ci
```

## 📁 Structure des tests

```
apps/mini-crm-e2e/
├── src/
│   ├── e2e/               # Tests E2E
│   │   ├── app.cy.ts      # Tests de l'application
│   │   ├── auth.cy.ts     # Tests d'authentification
│   │   └── orders.cy.ts   # Tests de gestion des commandes
│   ├── fixtures/          # Données de test
│   │   └── example.json
│   └── support/           # Commandes et configuration Cypress
│       ├── commands.ts    # Commandes personnalisées
│       └── e2e.ts         # Configuration globale
├── cypress.config.ts      # Configuration Cypress
└── tsconfig.json
```

## 🛠️ Commandes personnalisées

### `cy.login(email, password)`

Connexion rapide à l'application.

```typescript
cy.login('test@example.com', 'password123');
```

### `cy.getByCy(selector)`

Sélectionne un élément par son attribut `data-cy`.

```typescript
cy.getByCy('submit-button').click();
```

## 📝 Écrire un nouveau test

1. Créer un nouveau fichier dans `src/e2e/` avec l'extension `.cy.ts`
2. Utiliser la structure suivante :

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should do something', () => {
    // Your test code
  });
});
```

## 🎯 Bonnes pratiques

1. **Utiliser `data-cy` pour les sélecteurs** : Plus stables que les classes CSS ou IDs
2. **Tests indépendants** : Chaque test doit pouvoir s'exécuter seul
3. **Cleanup** : Utiliser `beforeEach` pour réinitialiser l'état
4. **Attentes explicites** : Utiliser `cy.wait()` avec parcimonie, préférer les assertions
5. **Tests atomiques** : Un test = une fonctionnalité

## 🔍 Debugging

- Utiliser `cy.debug()` pour pause dans les DevTools
- Utiliser `cy.pause()` pour arrêter l'exécution
- Consulter les screenshots dans `cypress/screenshots/`
- Consulter les vidéos dans `cypress/videos/`

## 📚 Documentation

- [Cypress Documentation](https://docs.cypress.io/)
- [Nx Cypress Documentation](https://nx.dev/docs/technologies/test-tools/cypress/introduction)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)

