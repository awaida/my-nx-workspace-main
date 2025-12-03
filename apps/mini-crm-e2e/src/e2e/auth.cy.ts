/**
 * E2E tests for authentication flow
 */

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in');
  });

  it('should display the sign-in page', () => {
    cy.contains('Connexion').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should navigate to sign-up page', () => {
    cy.contains('Créer un compte').click();
    cy.url().should('include', '/auth/sign-up');
    cy.contains('Inscription').should('be.visible');
  });

  it('should show validation errors on empty form submission', () => {
    cy.get('button[type="submit"]').click();
    // Form should not submit and show validation errors
    cy.url().should('include', '/auth/sign-in');
  });

  it('should allow user to sign in with valid credentials', () => {
    // Fill in the sign-in form
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to orders page after successful login
    cy.url().should('include', '/orders', { timeout: 10000 });
  });

  it('should allow user to sign up', () => {
    cy.visit('/auth/sign-up');

    // Fill in the sign-up form
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').first().type('password123');
    cy.get('input[type="password"]').last().type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to orders page after successful registration
    cy.url().should('include', '/orders', { timeout: 10000 });
  });
});

