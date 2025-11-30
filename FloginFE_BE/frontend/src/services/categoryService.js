import {apiWithAuth} from "../utils/api"

export const categoryService = {
    getAllCategory: async () => {
        const res = await apiWithAuth.get('/categories')
        return res.data
    }

}
