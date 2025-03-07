import { create } from "zustand";
import axios from "../lib/axios";

export const useProductExecutionStore = create((set) => ({
  executions: [],
  workOrders: [], // Added to store external API data
  loading: false,
  error: null,

  fetchExecutions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/execution"); // Fetch from local API
      set({
        executions: res.data.executions,
        workOrders: res.data.workOrders,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createExecution: async (executionData) => {
    try {
      const res = await axios.post("/execution", executionData);
      set((state) => ({ executions: [...state.executions, res.data] }));
    } catch (error) {
      console.error(error);
    }
  },

  updateExecution: async (id, updatedData) => {
    try {
      const res = await axios.put(`/execution/${id}`, updatedData);
      set((state) => ({
        executions: state.executions.map((exec) =>
          exec._id === id ? res.data : exec
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteExecution: async (id) => {
    try {
      await axios.delete(`/execution/${id}`);
      set((state) => ({
        executions: state.executions.filter((exec) => exec._id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
