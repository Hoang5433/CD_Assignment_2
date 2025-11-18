import { create } from "zustand";
import { productService } from "../services/productService";

export const useProductStore = create((set, get) => ({
    products: [],
    quantity: 0,
    loading: false,

    getAllProducts: async () => {
        set({ loading: true });
        try {
            const data = await productService.getAllProducts(); // nếu trả về res.data
            set({ products: data, quantity: data.length });
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            set({ loading: false });
        }
    },

    addProduct: async (product) => {
        set({ loading: true });
        try {
            const newProduct = await productService.addProduct(product);
            set(state => ({
                products: [...state.products, newProduct],
                quantity: state.quantity + 1
            }));
        } catch (error) {
            console.error("Failed to add product:", error);
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id, updatedData) => {
        set({ loading: true });
        try {
            const updated = await productService.updateProduct(id, updatedData);
            set(state => ({
                products: state.products.map(p => p.id === id ? updated : p)
            }));
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await productService.deleteProduct(id);
            set(state => ({
                products: state.products.filter(p => p.id !== id),
                quantity: state.quantity - 1
            }));
        } catch (error) {
            console.error("Failed to delete product:", error);
        } finally {
            set({ loading: false });
        }
    }
}));
