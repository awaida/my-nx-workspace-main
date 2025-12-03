import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run mini-crm:serve',
        production: 'nx run mini-crm:serve:production',
      },
      ciWebServerCommand: 'nx run mini-crm:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/e2e.ts',
  },
});

