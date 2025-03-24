import { create } from "zustand";
import axios from "../lib/axios";

const useExecutionAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/executionAnlytics");
      set({ analytics: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useExecutionAnalyticsStore;
