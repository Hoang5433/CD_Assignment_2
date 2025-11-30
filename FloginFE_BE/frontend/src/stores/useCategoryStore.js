import {create} from "zustand/index";
import {categoryService} from "../services/categoryService";


export const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,

    getAllCategory: async () => {
        set({loading: true})
        try {
            const data = await categoryService.getAllCategory()
            set({categories: data})
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        } finally {
            set({loading: false})
        }
    }
}))
