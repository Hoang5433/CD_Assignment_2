import { create } from "zustand";
import { productService } from "../services/productService";
import { toast } from "sonner";

export const useProductStore = create((set, get) => ({
  products: [],
  quantity: 0,
  loading: false,
  totalPages: 0,
  currentPage: 0,

  getAllProducts: async (page = 0) => {
    set({ loading: true });
    try {
      const data = await productService.getAllProducts(page, 10); // nếu trả về res.data
      set({
        products: data.content,
        quantity: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.number,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Có lỗi khi lấy danh sách sản phẩm");
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true });
    try {
      const newProduct = await productService.addProduct(product);
      set((state) => ({
        products: [...state.products, newProduct],
        quantity: state.quantity + 1,
      }));
      toast.success("Thêm mới thành công", {
        description: <span data-testid="add-success">Success</span>,
      });
      await get().getAllProducts(0);
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Thêm mới thất bại", {
        description: <span data-testid="add-error">Error</span>,
      });
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, updatedData) => {
    set({ loading: true });
    try {
      const updated = await productService.updateProduct(id, updatedData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
      toast.success("Cập nhật thành công", {
        description: <span data-testid="update-success">Success</span>,
      });
      await get().getAllProducts(get().currentPage);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Cập nhật thất bại", {
        description: <span data-testid="update-error">Error</span>,
      });
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        quantity: state.quantity - 1,
      }));
      toast.success("Xóa thành công");
      await get().getAllProducts(get().currentPage);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Xóa thất bại");
    } finally {
      set({ loading: false });
    }
  },
}));
