import { create } from "zustand";

const useProductStore = create((set, get) => ({
    products: [],
    quantity: 0,

    getAllProducts: async() => {
        try{
            set({loading: true})
            
        } catch(error) {
            console.error(error)
        } finally{
            set({loading: false})
        }
    }
}))

