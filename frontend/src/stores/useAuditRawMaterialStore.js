import { create } from "zustand";
import axios from "../lib/axios";

const useAuditStore = create((set) => ({
  audits: [],
  loading: false,
  error: null,

  fetchAudits: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/auditLogistic1");
      set({ audits: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addAudit: async (audit) => {
    try {
      const res = await axios.post("/auditLogistic1", audit);
      set((state) => ({ audits: [...state.audits, res.data] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateAudit: async (id, updatedData) => {
    try {
      const res = await axios.put(`/auditLogistic1/${id}`, updatedData);
      set((state) => ({
        audits: state.audits.map((audit) =>
          audit._id === id ? res.data : audit
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteAudit: async (id) => {
    try {
      await axios.delete(`/auditLogistic1/${id}`);
      set((state) => ({
        audits: state.audits.filter((audit) => audit._id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useAuditStore;
