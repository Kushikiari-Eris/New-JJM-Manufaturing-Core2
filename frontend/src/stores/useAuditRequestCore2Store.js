import { create } from "zustand";
import axios from "../lib/axios";

const useAuditRequestCore2Store = create((set) => ({
  requests: [],
  loading: false,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auditRequestCore2");
      set({ requests: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch audit requests", error);
      set({ loading: false });
    }
  },

  addRequest: async (newRequest) => {
    try {
      const response = await axios.post("/auditRequestCore2", newRequest);
      set((state) => ({ requests: [...state.requests, response.data] }));
    } catch (error) {
      console.error("Failed to add audit request", error);
    }
  },

  updateRequest: async (id, updatedRequest) => {
    try {
      const response = await axios.put(
        `/auditRequestCore2/${id}`,
        updatedRequest
      );
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === id ? response.data : req
        ),
      }));
    } catch (error) {
      console.error("Failed to update audit request", error);
    }
  },

  deleteRequest: async (id) => {
    try {
      await axios.delete(`/auditRequestCore2/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete audit request", error);
    }
  },
}));

export default useAuditRequestCore2Store;
