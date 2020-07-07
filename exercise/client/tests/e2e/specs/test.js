// https://docs.cypress.io/api/introduction/api.html
import { baseURL } from '../../../cypress';

describe('Testing header: title,logo', () => {
  it('Visits the app root url', () => {
    cy.visit(baseURL)
    cy.get('.header').find('#icon')
    cy.contains('h3', 'Welcome to Coin Locker System!')
    cy.get('.btn').should('be.disabled')
  })
})
describe('Testing Locking', () => {
  beforeEach(() => {
      cy.request(baseURL + 'api/lockers').as('lockings');
  });

  it('Validate the header', () => {
      cy.get('@lockings')
          .its('headers')
          .its('content-type')
          .should('include', 'application/json; charset=utf-8');
  });

  it('Validate the status code', () => {
      cy.get('@lockings')
          .its('status')
          .should('equal', 200);
  });
  it('testing with NaN, double', () => {
    cy.get(':nth-child(4) > [aria-colindex="3"]').click()
    cy.get('.btn').click()
    cy.wait(10000)
    cy.get(':nth-child(1) > #input-live').type('one hundred')
    cy.get(':nth-child(4) > p > .btn').should('be.disabled')
    cy.get(':nth-child(1) > #input-live').type(1.23)
    cy.get(':nth-child(4) > p > .btn').should('be.disabled')
    cy.get(':nth-child(1) > #input-live').clear()
    cy.get(':nth-child(1) > #input-live').type(12)
    cy.get(':nth-child(4) > p > .btn').should('be.disabled')
    cy.get(':nth-child(1) > #input-live').clear()
    cy.get(':nth-child(1) > #input-live').type(1234)
    cy.get(':nth-child(4) > p > .btn').should('be.disabled')
    cy.get(':nth-child(1) > #input-live').clear()
  });
  it('setting correct values and try locking', () => {
    cy.get(':nth-child(1) > #input-live').type(500)
    cy.get(':nth-child(2) > #input-live').type(5)
    cy.get(':nth-child(4) > p > .btn').should('be.disabled')
    cy.get(':nth-child(3) > #input-live').type(111111)
    cy.get(':nth-child(4) > p > .btn').should('not.be.disabled')
    cy.get(':nth-child(4) > p > .btn').click()
    cy.wait(10000)
    cy.get('.close').click()
  });
  it('setting correct values and try unlocking', () => {
    cy.get(':nth-child(4) > [aria-colindex="3"]').click()
    cy.get('.btn').click()
    cy.wait(10000)
    cy.get('#input-live').type(111111)
    cy.get(':nth-child(4) > p > .btn').click()
    cy.wait(10000)
    cy.get('.close').click()
  })
});