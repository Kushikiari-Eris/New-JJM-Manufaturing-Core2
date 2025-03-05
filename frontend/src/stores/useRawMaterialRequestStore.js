import { create } from "zustand";
import axios from "../lib/axios";

export const useRawMaterialRequestStore = create((set) => ({
  requests: [],
  loading: false,
  error: null,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/rawMaterialRequest");

      // Sort requests by createdAt (newest first)
      const sortedRequests = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      set({ requests: sortedRequests, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addRequest: async (newRequest) => {
    try {
      const response = await axios.post("/rawMaterialRequest", newRequest);
      set((state) => ({ requests: [...state.requests, response.data] }));
    } catch (error) {
      console.error("Error adding request:", error);
    }
  },

  updateRequestStatus: async (id, updatedData) => {
    try {
      const response = await axios.put(
        `/rawMaterialRequest/${id}`,
        updatedData
      );
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === id ? response.data : req
        ),
      }));
    } catch (error) {
      console.error("Error updating request:", error);
    }
  },

  deleteRequest: async (id) => {
    try {
      await axios.delete(`/rawMaterialRequest/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  },
}));
