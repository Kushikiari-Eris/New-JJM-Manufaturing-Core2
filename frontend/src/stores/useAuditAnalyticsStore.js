import { create } from "zustand";
import axios from "../lib/axios";

const useAuditAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auditAnalytics");
      set({ analytics: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      set({ loading: false });
    }
  },
}));

export default useAuditAnalyticsStore;
