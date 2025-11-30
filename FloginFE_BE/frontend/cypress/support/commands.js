Cypress.Commands.add('login', (username, password) => {
    cy.visit("/");

    cy.intercept('POST', '/auth/login', {
        statusCode: 200,
        body: {
            accessToken: "fake_jwt_token",
            header: "Bearer"
        }
    }).as("loginRequest");

    cy.intercept('GET', '/auth/profile', {
        statusCode: 200,
        body:{
            fullName: "Hoang Quy"
        }
    });

    cy.intercept('GET', '/categories', {fixture: 'categories.json'}).as('getCategories');
    cy.intercept('GET', /\/products\?page=.*&size=.*/, {fixture: 'products.json'}).as('getProducts');

    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-success"]').should('contain', 'Success');
    cy.url().should('include', '/admin/products');

    cy.wait('@loginRequest');
    cy.wait('@getCategories');
    cy.wait('@getProducts').then((interception) => {
        expect(interception.response.body.content).to.have.length(2);
    });
});
