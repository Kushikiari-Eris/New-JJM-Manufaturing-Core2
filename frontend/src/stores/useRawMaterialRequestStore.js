import { create } from "zustand";
import axios from "../lib/axios";

export const useRawMaterialRequestStore = create((set) => ({
  requests: [],
  loading: false,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/rawMaterialRequest");
      set({ requests: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching raw material requests:", error);
      set({ loading: false });
    }
  },

  createRequest: async (requestData) => {
    try {
      const response = await axios.post("/rawMaterialRequest", requestData);
      set((state) => ({
        requests: [response.data, ...state.requests],
      }));
    } catch (error) {
      console.error("Error creating request:", error);
    }
  },

  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await axios.put(
        `/rawMaterialRequest/${requestId}/status`,
        { status }
      );
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === requestId ? response.data : req
        ),
      }));
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  },

}));
