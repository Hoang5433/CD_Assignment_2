import {apiWithAuth} from "../utils/api"

export const productService = {
    getAllCategory: async () => {
        const res = await apiWithAuth.get('/categories')
        return res.data
    }

}
