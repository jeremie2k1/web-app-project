/* eslint-disable no-undef */
describe('First Test', () => {
  it('click the link Health clinics', () => {
    cy.visit('http://localhost:3000/home');

    cy.contains('Health clinics').click();
    cy.url().should('include', '/find-clinic');
  });
});

describe('Second Test', () => {
  it('click the link Medical specialty', () => {
    cy.visit('http://localhost:3000/home');

    cy.contains('Medical specialty').click();
    cy.url().should('include', '/find-specialty');
  });
});
