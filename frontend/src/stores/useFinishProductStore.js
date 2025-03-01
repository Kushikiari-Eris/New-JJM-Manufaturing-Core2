import { create } from "zustand";
import axios from "../lib/axios";

export const useFinishProductStore = create((set) => ({
  finishedProducts: [],
  loading: false,

  setProducts: (finishedProducts) => set({ finishedProducts }),
  fetchFinishedProducts: async () => {
    try {
      const response = await axios.get("/finishProduct");
      set({ finishedProducts: response.data });
    } catch (error) {
      console.error("Error fetching finished products:", error);
    }
  },

  createFinishedProduct: async (productData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/finishProduct", productData);
      set((state) => ({
        finishedProducts: [response.data, ...state.finishedProducts],
      }));
    } catch (error) {
      console.error("Error creating a product:", error);
      throw error;
    } finally {
      set({ loading: false }); 
    }
  },
}));

