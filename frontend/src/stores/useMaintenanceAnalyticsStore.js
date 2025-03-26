import { create } from "zustand";
import axios from "../lib/axios";

export const useMaintenanceAnalyticsStore = create((set) => ({
  maintenanceAnalytics: null,
  loadingss: false,
  fetchMaintenanceAnalytics: async () => {
    set({ loadingss: true });
    try {
      const { data } = await axios.get("/maintenanceAnalytics");
      set({ maintenanceAnalytics: data, loadingss: false });
    } catch (error) {
      console.error("Error fetching analytics", error);
      set({ loadingss: false });
    }
  },
}));
