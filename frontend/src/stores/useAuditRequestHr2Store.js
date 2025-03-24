import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAuditRequestHr2Store = create((set) => ({
  requests: [],
  loading: false,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auditRequestHr2");
      set({ requests: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch audit requests", error);
      toast.error("Failed to fetch audit requests");
      set({ loading: false });
    }
  },

  addRequest: async (newRequest) => {
    try {
      const response = await axios.post("/auditRequestHr2", newRequest);
      set((state) => ({ requests: [...state.requests, response.data] }));
      toast.success("Audit request added to task successfully!");
    } catch (error) {
      console.error("Failed to add audit request", error);
      toast.error("Failed to add audit request");
    }
  },

  updateRequest: async (id, updatedRequest) => {
    try {
      const response = await axios.put(
        `/auditRequestHr2/${id}`,
        updatedRequest
      );
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === id ? response.data : req
        ),
      }));
      toast.success("Audit request updated successfully!");
    } catch (error) {
      console.error("Failed to update audit request", error);
      toast.error("Failed to update audit request");
    }
  },

  deleteRequest: async (id) => {
    try {
      await axios.delete(`/auditRequestHr2/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
      toast.success("Audit request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete audit request", error);
      toast.error("Failed to delete audit request");
    }
  },
}));

export default useAuditRequestHr2Store;
