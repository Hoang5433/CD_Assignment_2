
class ProductPage {
    constructor() {
        this.currentProduct = null;
        this.products = [];
        this.productIdCounter = 3;
    }

    setupIntercepts() {
        cy.intercept('GET', /\/products\?page=.*&size=.*/,(req) => {
            // Get search parameter from query string
            const url = new URL(req.url, 'http://localhost');
            const search = url.searchParams.get('search') || '';
            
            // Filter products based on search term
            let filteredProducts = this.products;
            if (search) {
                filteredProducts = this.products.filter(p => 
                    p.productName.toLowerCase().includes(search.toLowerCase())
                );
            }
            
            req.reply({
                statusCode: 200,
                body: {
                    content: filteredProducts,
                    totalElements: filteredProducts.length,
                    totalPages: 1,
                    number: 0,
                    size: 10
                }
            });
        }).as('getProducts');
    }

    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click()
    }

    fillProductForm(product, isEdit = false) {
        this.currentProduct = product;
        if (isEdit) {
            if (product.name) {
                cy.get('[data-testid="product-name"]').clear().type(product.name);
            }
            if (product.price) {
                cy.get('[data-testid="product-price"]').clear().type(product.price);
            }
            if (product.quantity) {
                cy.get('[data-testid="product-quantity"]').clear().type(product.quantity);
            }
            if (product.categoryId) {
                cy.get('[data-testid="product-category"]').should('be.visible').then(($select) => {
                    cy.wrap($select).select(String(product.categoryId), { force: true });
                });
            }
            if (product.description) {
                cy.get('[data-testid="product-description"]').clear().type(product.description);
            }
        } else {
            if (product.name) cy.get('[data-testid="product-name"]').type(product.name);
            if (product.price) cy.get('[data-testid="product-price"]').type(product.price);
            if (product.quantity) cy.get('[data-testid="product-quantity"]').type(product.quantity);
            if (product.categoryId) {
                cy.get('[data-testid="product-category"]').should('be.visible').then(($select) => {
                    cy.wrap($select).select(String(product.categoryId), { force: true });
                });
            }
            if (product.description) cy.get('[data-testid="product-description"]').type(product.description);
        }
    }

    clickEditProduct(productName) {
        this.getProductInList(productName).within(() => {
            cy.get('[data-testid="edit-product-btn"]').click();
        });
    }

    clickDeleteProduct(productName) {
        this.getProductInList(productName).within(() => {
            cy.get('[data-testid="delete-product-btn"]').click();
        });
    }

    submitForm() {
        if (!this.currentProduct){
            throw new Error("No product data filled. Call fillProductForm first!");
        }

        const newProduct = {
            id: this.productIdCounter++,
            productName: this.currentProduct.name,
            price: parseInt(this.currentProduct.price),
            quantity: parseInt(this.currentProduct.quantity),
            description: this.currentProduct.description,
            category: { name: "Laptop" }
        };

        this.products.push(newProduct);

        cy.intercept('POST', '/products', {
            statusCode: 200,
            body: newProduct
        }).as("addProduct");

        cy.intercept('GET', /\/products\?page=.*&size=.*/, (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    content: this.products,
                    totalElements: this.products.length,
                    totalPages: 1,
                    number: 0,
                    size: 10
                }
            });
        }).as('getProductsAfterAdd');

        cy.get('[data-testid="submit-btn"]').click();
    }

    submitEditForm() {
        if (!this.currentProduct){
            throw new Error("No product data filled. Call fillProductForm first!");
        }

        cy.intercept('PUT', '/products/**', (req) => {
            const updatedProduct = {};
            if (this.currentProduct.name) updatedProduct.productName = this.currentProduct.name;
            if (this.currentProduct.price) updatedProduct.price = parseInt(this.currentProduct.price);
            if (this.currentProduct.quantity) updatedProduct.quantity = parseInt(this.currentProduct.quantity);
            if (this.currentProduct.description) updatedProduct.description = this.currentProduct.description;
            if (this.currentProduct.categoryId) updatedProduct.category = { name: "Laptop" };

            let responseBody = updatedProduct;
            const idMatch = req.url.match(/\/products\/(\d+)/);
            if (idMatch) {
                const productId = parseInt(idMatch[1]);
                const index = this.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...updatedProduct };

                    responseBody = this.products[index];
                }
            }

            req.reply({
                statusCode: 200,
                body: responseBody
            });
        }).as("updateProduct");

        // Reload products list after update with paginated response
        cy.intercept('GET', /\/products\?page=.*&size=.*/, (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    content: this.products,
                    totalElements: this.products.length,
                    totalPages: 1,
                    number: 0,
                    size: 10
                }
            });
        }).as('getProductsAfterUpdate');

        cy.get('[data-testid="submit-btn"]').click();
    }

    confirmDelete() {
        cy.intercept('DELETE', '/products/**', (req) => {
            const idMatch = req.url.match(/\/products\/(\d+)/);
            if (idMatch) {
                const productId = parseInt(idMatch[1]);
                this.products = this.products.filter(p => p.id !== productId);
            }

            req.reply({
                statusCode: 200
            });
        }).as("deleteProduct");

        cy.intercept('GET', /\/products\?page=.*&size=.*/, (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    content: this.products,
                    totalElements: this.products.length,
                    totalPages: 1,
                    number: 0,
                    size: 10
                }
            });
        }).as('getProductsAfterDelete');

        cy.get('[data-testid="confirm-delete-btn"]').click();
    }

    getSuccessMessage() {
        return cy.get('[data-testid="add-success"]')
    }

    getProductInList(name) {
        return cy.contains('[data-testid="product-item"]', name)
    }

}

export default ProductPage;