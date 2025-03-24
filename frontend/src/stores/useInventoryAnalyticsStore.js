import { create } from "zustand";
import axios from "../lib/axios";

const useInventoryAnalyticsStore = create((set) => ({
  inventoryAnalytics: null,
  loadings: true, // Correct key
  fetchInventoryAnalytics: async () => {
    set({ loadings: true }); // Set loading state before fetching
    try {
      const response = await axios.get("/inventoryAnalytics");
      set({ inventoryAnalytics: response.data, loadings: false }); // Correct key
    } catch (error) {
      console.error("Error fetching analytics:", error);
      set({ loadings: false }); // Ensure loading state updates even on failure
    }
  },
}));

export default useInventoryAnalyticsStore;
