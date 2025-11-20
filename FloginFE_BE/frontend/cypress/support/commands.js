Cypress.Commands.add('login', (username, password) => {
    cy.visit("/");

    // Mock API login
    cy.intercept('POST', 'auth/login', {
        statusCode: 200,
        body: {
            accessToken: "fake_jwt_token",
            header: "Bearer"
        }
    }).as("loginRequest");

    // Điền form và submit
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();

    // Kiểm tra login thành công
    cy.get('[data-testid="login-success"]').should('contain', 'Success');
    cy.intercept('GET', 'auth/profile', {
        statusCode: 200,
        body:{
            fullName: "Hoang Quy"
        }
    }).as("getProfile")
    cy.intercept('GET', '/categories', {fixture: 'categories.json'}).as('getCategories');
    cy.intercept('GET', '/products', {fixture: 'products.json'}).as('getProducts');
    cy.url().should('include', '/admin/products');

    // Wait for products to load (2 products from fixture)
    cy.wait('@getProfile');
    cy.wait('@getCategories');
    cy.wait('@getProducts').then((interception) => {
        expect(interception.response.body).to.have.length(2);
    });
});
