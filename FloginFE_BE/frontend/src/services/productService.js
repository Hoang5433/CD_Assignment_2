import { api } from "../utils/api";

export const productService = {
  // CREATE
  addProduct: async (product) => {
    const res = await api.post("/products", product);
    return res.data;
  },

  // GET ALL PRODUCTS
  getAllProducts: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  // UPDATE - PUT
  updateProduct: async (productId, updatedData) => {
    const res = await api.put(`products/${productId}`, updatedData);
    return res.data;
  },

  // GET PRODUCT" DETAILS
  getProductDetails: async (productId) => {
    const res = await api.get(`products/${productId}`);
    return res.data;
  },

  // DELETE PRODUCT
  deleteProduct: async (productId) => {
    const res = await api.delete(`products/${productId}`);
    return res.data;
  },
};
