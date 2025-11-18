import {apiWithAuth} from "../utils/api";

export const productService = {
  // CREATE
  addProduct: async (product) => {
    const res = await apiWithAuth.post("/products", product )
    return res.data;
  },

  // GET ALL PRODUCTS
  getAllProducts: async () => {
    try {
      const res = await apiWithAuth.get(
          "/products"
      );
      return res.data;
    } catch (e) {
      console.error('Error getting all products:', e);
      throw e
    }
  },

  // UPDATE - PUT
  updateProduct: async (productId, updatedData) => {
    const res = await apiWithAuth.put(`/products/${productId}`, updatedData);
    return res.data;
  },

  // GET PRODUCT
  getProduct: async (productId) => {
    const res = await apiWithAuth.get(`/products/${productId}`);
    return res.data;
  },

  // DELETE PRODUCT
  deleteProduct: async (productId) => {
    const res = await apiWithAuth.delete(`/products/${productId}`);
    return res.data;
  },
};
