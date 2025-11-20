import { create } from "zustand";
import { productService } from "../services/productService";
import {toast} from "sonner";

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
            toast.success("Thêm mới thành công", {
                description: <span data-testid="add-success">Success</span>
            });
        } catch (error) {
            console.error("Failed to add product:", error);
            toast.error("Thêm mới thất bại", {
                description: <span data-testid="add-error">Error</span>
            });
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
            toast.success("Cập nhật thành công");
        } catch (error) {
            console.error("Failed to update product:", error);
            toast.error("Cập nhật thất bại");
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
            toast.success("Xóa thành công");
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast.error("Xóa thất bại");
        } finally {
            set({ loading: false });
        }
    }
}));
