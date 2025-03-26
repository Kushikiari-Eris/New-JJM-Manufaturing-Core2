import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

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
      toast.error("Failed to fetch raw material requests.");
    }
  },

  addRequest: async (newRequest) => {
    try {
      const response = await axios.post("/rawMaterialRequest", newRequest);
      set((state) => ({ requests: [...state.requests, response.data] }));
      toast.success("Raw material request added successfully!");
    } catch (error) {
      console.error("Error adding request:", error);
      toast.error("Failed to add raw material request.");
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
      toast.success("Request status updated successfully!");
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request status.");
    }
  },

  deleteRequest: async (id) => {
    try {
      await axios.delete(`/rawMaterialRequest/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request.");
    }
  },
}));
