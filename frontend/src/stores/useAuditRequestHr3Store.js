import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAuditRequestHr3Store = create((set) => ({
  requests: [],
  loading: false,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auditRequestHr3");
      set({ requests: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch audit requests", error);
      set({ loading: false });
    }
  },

  addRequest: async (newRequest) => {
    try {
      const response = await axios.post("/auditRequestHr3", newRequest);
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
        `/auditRequestHr3/${id}`,
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
      await axios.delete(`/auditRequestHr3/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
      toast.success("Audit request added to tasks successfully!");
    } catch (error) {
      console.error("Failed to delete audit request", error);
    }
  },
}));

export default useAuditRequestHr3Store;
