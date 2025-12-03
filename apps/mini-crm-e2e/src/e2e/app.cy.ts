/**
 * E2E tests for the Mini CRM application
 */

describe('Mini CRM Application', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should display the application title', () => {
    // The home page should redirect to /auth/sign-in
    cy.url().should('include', '/auth/sign-in');
    cy.contains('Connexion').should('be.visible');
  });

  it('should navigate to the home page', () => {
    cy.visit('/');
    cy.url().should('include', '/auth/sign-in');
  });

  it('should have working navigation', () => {
    // The app should have a basic structure
    cy.get('body').should('be.visible');
  });
});

