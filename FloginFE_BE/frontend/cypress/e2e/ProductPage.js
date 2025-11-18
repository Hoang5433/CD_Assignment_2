class ProductPage {

  visit() {
    cy.visit('/admin/products');
  }

  clickAddNew(){
      cy.get('[data-testid="add-product-btn"]').click()
  }
  fillProductForm(product){
      cy.get('[data-testid="product-name]').type(product.name)
      cy.get('[data-testid="product-price]').type(product.price)
      cy.get('[data-testid="product-description]').type(product.description)
  }
}