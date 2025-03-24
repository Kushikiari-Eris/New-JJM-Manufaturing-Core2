import { create } from "zustand";
import axios from "../lib/axios";

const useTasksAnalyticsStore = create((set) => ({
  statusData: [],
  departmentData: [],
  fetchAnalytics: async () => {
    try {
      const response = await axios.get("/tasksAnalytics");
      set({
        statusData: response.data.statusData || [],
        departmentData: response.data.departmentData || [],
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  },
}));

export default useTasksAnalyticsStore;
