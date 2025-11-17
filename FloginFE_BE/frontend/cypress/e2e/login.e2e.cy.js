describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })
  it('Nen hien thi form login', () => {
    cy.get('[data-testid="username-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })
  it('Nen login thanh cong voi credentials hop le', () => {
    cy.get('[data-testid="username-input"]').type('admin123')
    cy.get('[data-testid="password-input"]').type('admin123')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="login-success"]').should('contain', 'Success')
    cy.url().should('include', '/admin/products')
  })
  it('Nen hien thi loi voi credentials khong hop le', () => {
    cy.get('[data-testid="username-input"]').type('ab')
    cy.get('[data-testid="password-input"]').type('1234')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="username-error"]').should('be.visible')
  })
})