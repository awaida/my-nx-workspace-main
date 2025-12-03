# 🎯 Installation de Cypress E2E (À faire plus tard)

## ⚠️ État actuel

La structure des tests Cypress a été créée dans `apps/mini-crm-e2e/` mais les packages npm n'ont pas encore été installés.

## 📦 Pour installer Cypress plus tard

Lorsque vous serez prêt à installer Cypress, exécutez cette commande :

```bash
npm install --save-dev cypress@^13.6.0 @nx/cypress@21.4.0
```

## ⚙️ Configuration à réactiver

Une fois l'installation terminée, décommentez/ajoutez cette configuration dans `nx.json` :

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "plugins": [
    {
      "plugin": "@nx/cypress/plugin",
      "options": {
        "targetName": "e2e",
        "ciTargetName": "e2e-ci",
        "openTargetName": "open-cypress"
      }
    }
  ],
  // ... reste de la configuration
}
```

## 📝 Scripts à ajouter dans `package.json`

Ajoutez ces scripts dans la section `scripts` :

```json
{
  "scripts": {
    "e2e": "nx e2e mini-crm-e2e",
    "e2e:headless": "nx e2e mini-crm-e2e --headless",
    "e2e:ci": "nx e2e-ci mini-crm-e2e",
    "e2e:open": "nx open-cypress mini-crm-e2e",
    "e2e:watch": "nx e2e mini-crm-e2e --watch"
  }
}
```

## 🚀 Lancer les tests (après installation)

```bash
# Mode interactif (développement)
npm run e2e:open

# Mode headless (CI)
npm run e2e

# Watch mode
npm run e2e:watch
```

## 📁 Structure déjà créée

Tous les fichiers de configuration et tests sont déjà prêts dans :

```
apps/mini-crm-e2e/
├── src/
│   ├── e2e/
│   │   ├── app.cy.ts      # ✅ Créé
│   │   ├── auth.cy.ts     # ✅ Créé
│   │   └── orders.cy.ts   # ✅ Créé
│   ├── fixtures/
│   │   └── example.json   # ✅ Créé
│   └── support/
│       ├── commands.ts    # ✅ Créé
│       └── e2e.ts         # ✅ Créé
├── cypress.config.ts      # ✅ Créé
├── project.json          # ✅ Créé
├── tsconfig.json         # ✅ Créé
└── README.md             # ✅ Créé
```

## 💡 Note

Les tests sont prêts à être exécutés dès que vous installerez les packages npm. Tout le reste est déjà configuré ! 🎉

