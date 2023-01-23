/* eslint-disable no-undef */
describe('The Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should fill login form and redirect to homepage', () => {
    // Fill the username
    cy.get('[type="text"]')
      .type('vietngaitmo@gmail.com')
      .should('have.value', 'vietngaitmo@gmail.com');

    // Fill the password
    cy.get('[type="password"]').type('jeremie20112001.').should('have.value', 'jeremie20112001.');

    // Locate and submit the form
    cy.get('button').click();

    // Verify the app redirected you to the homepage
    cy.location('pathname', { timeout: 10000 }).should('include', '/system');
  });
});
