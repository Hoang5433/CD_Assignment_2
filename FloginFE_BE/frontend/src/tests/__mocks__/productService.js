import "@testing-library/jest-dom";

export const mockAddProduct = jest.fn();
export const mockGetAllProducts = jest.fn();
export const mockUpdateProduct = jest.fn();
export const mockGetProduct = jest.fn();
export const mockDeleteProduct = jest.fn();

export const productService = {
  addProduct: mockAddProduct,
  getAllProducts: mockGetAllProducts,
  updateProduct: mockUpdateProduct,
  getProduct: mockGetProduct,
  deleteProduct: mockDeleteProduct,
};