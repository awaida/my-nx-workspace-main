// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

/**
 * Custom command to login to the application
 * @example cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/sign-in');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="submit-button"]').click();
});

/**
 * Custom command to get an element by data-cy attribute
 * @example cy.getByCy('submit-button')
 */
Cypress.Commands.add('getByCy', (selector: string, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(email: string, password: string): Chainable<void>;
      getByCy(
        selector: string,
        options?: Partial<
          Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable
        >
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

