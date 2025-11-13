import { api } from "../utils/api"

export const productService = {
    addCategory: async(category) => {
        const res = await api.post('/categories', category)
        return res.data
    },

    deleteCategory: async(categoryId) => {
        const res = await api.delete(`/categories/${categoryId}`)
    }

}
