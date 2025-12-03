/**
 * E2E tests for orders management
 */

describe('Orders Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/auth/sign-in');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for redirect to orders page
    cy.url().should('include', '/orders', { timeout: 10000 });
  });

  it('should display the orders list', () => {
    cy.contains('Commandes').should('be.visible');
    // The orders table should be visible
    cy.get('table').should('be.visible');
  });

  it('should navigate to add order page', () => {
    cy.contains('Nouvelle commande').click();
    cy.url().should('include', '/orders/add');
    cy.contains('Ajouter une commande').should('be.visible');
  });

  it('should create a new order', () => {
    // Navigate to add order page
    cy.contains('Nouvelle commande').click();
    cy.url().should('include', '/orders/add');

    // Fill in the order form
    cy.get('input[name="customer"]').type('Test Customer');
    cy.get('input[name="nbDays"]').clear().type('5');
    cy.get('input[name="tjm"]').clear().type('500');
    cy.get('input[name="tauxTva"]').clear().type('20');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Should redirect back to orders list
    cy.url().should('include', '/orders');
    cy.url().should('not.include', '/add');

    // The new order should be visible in the list
    cy.contains('Test Customer').should('be.visible');
  });

  it('should edit an existing order', () => {
    // Click on the first edit button
    cy.get('button').contains('Éditer').first().click();
    cy.url().should('include', '/orders/edit/');

    // Modify the customer name
    cy.get('input[name="customer"]').clear().type('Updated Customer');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Should redirect back to orders list
    cy.url().should('include', '/orders');
    cy.url().should('not.include', '/edit');

    // The updated order should be visible
    cy.contains('Updated Customer').should('be.visible');
  });

  it('should delete an order', () => {
    // Get the initial count of orders
    cy.get('table tbody tr').its('length').then((initialCount) => {
      // Click on the first delete button
      cy.get('button').contains('Supprimer').first().click();

      // Confirm deletion in the modal
      cy.get('.modal').should('be.visible');
      cy.get('.modal button').contains('Supprimer').click();

      // The order should be removed from the list
      cy.get('table tbody tr').should('have.length', initialCount - 1);
    });
  });

  it('should cancel order creation', () => {
    // Navigate to add order page
    cy.contains('Nouvelle commande').click();
    cy.url().should('include', '/orders/add');

    // Click cancel button
    cy.contains('Annuler').click();

    // Should redirect back to orders list
    cy.url().should('include', '/orders');
    cy.url().should('not.include', '/add');
  });

  it('should display order totals correctly', () => {
    // Navigate to add order page
    cy.contains('Nouvelle commande').click();

    // Fill in the order form
    cy.get('input[name="nbDays"]').clear().type('10');
    cy.get('input[name="tjm"]').clear().type('600');
    cy.get('input[name="tauxTva"]').clear().type('20');

    // Check that totals are calculated correctly
    // Total HT = 10 * 600 = 6000
    // Total TTC = 6000 * 1.2 = 7200
    cy.contains('6 000').should('be.visible'); // Total HT
    cy.contains('7 200').should('be.visible'); // Total TTC
  });
});

