import ProductPage from "./pages/ProductPage";


describe("Product E2E Tests", () => {
    const productPage = new ProductPage();

    beforeEach(() => {
        cy.login("admin123", "admin123");
        cy.fixture('products.json').then((data) => {
            productPage.products = [...data];
            productPage.productIdCounter = Math.max(...data.map(p => p.id)) + 1;
        });
        productPage.setupInterceptsForOperations();
    })

    it('Nen tao san pham moi thanh cong', () => {
        productPage.clickAddNew()
        productPage.fillProductForm({
            name: "Laptop Dell",
            price: '150000',
            quantity: "20",
            categoryId: "1",
            description: "Dell la laptop"
        })
        productPage.submitForm()
        productPage.getSuccessMessage().should('contain', 'Success')
        productPage.getProductInList("Laptop Dell").should('exist')
    })

    it('Nen cap nhat san pham thanh cong', () => {
        productPage.clickEditProduct("Pixel 4")

        cy.get('[data-testid="product-category"]').should('be.visible');

        cy.get('[data-testid="product-name"]').should('have.value', 'Pixel 4');
        cy.get('[data-testid="product-price"]').should('have.value', '36000');

        productPage.fillProductForm({
            price: '99000'
        }, true)

        productPage.submitEditForm()
        productPage.getProductInList("Pixel 4").should('exist')
        cy.contains('[data-testid="product-item"]', "Pixel 4").should('contain', '99.000')
    })

    it('Nen xoa san pham thanh cong', () => {
        productPage.clickDeleteProduct("Pixel 4")
        productPage.confirmDelete()
        cy.contains('[data-testid="product-item"]', "Pixel 4").should('not.exist')
    })
})