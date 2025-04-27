import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAuditScheduleStore = create((set) => ({
  audits: [],
  loading: false,
  error: null,
  currentAudit: null,
  
  // Fetch all audits
  fetchAudits: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/auditSchedule');
      set({ audits: res.data, loading: false });
    } catch (err) {
      set({ error: err.response.data.msg, loading: false });
      toast.error(err.response.data.msg || "Failed to fetch audits");
    }
  },
  
  // Get single audit
  getAudit: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/auditSchedule/${id}`);
      set({ currentAudit: res.data, loading: false });
    } catch (err) {
      set({ error: err.response.data.msg, loading: false });
      toast.error(err.response.data.msg || "Failed to fetch audit");
    }
  },
  
  // Create new audit
  createAudit: async (auditData) => {
    set({ loading: true });
    try {
      const res = await axios.post('/auditSchedule', auditData);
      set((state) => ({ 
        audits: [...state.audits, res.data], 
        loading: false 
      }));
      toast.success("Audit created successfully!");
      return res.data;
    } catch (err) {
      set({ error: err.response.data.msg, loading: false });
      toast.error(err.response.data.msg || "Failed to create audit");
      throw err;
    }
  },
  
  // Update audit
  updateAudit: async (id, auditData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/auditSchedule/${id}`, auditData);
      set((state) => ({
        audits: state.audits.map(audit => 
          audit._id === id ? res.data : audit
        ),
        loading: false
      }));
      toast.success("Audit updated successfully!");
      return res.data;
    } catch (err) {
      set({ error: err.response.data.msg, loading: false });
      toast.error(err.response.data.msg || "Failed to update audit");
      throw err;
    }
  },
  
  // Delete audit
  deleteAudit: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/auditSchedule/${id}`);
      set((state) => ({
        audits: state.audits.filter(audit => audit._id !== id),
        loading: false
      }));
      toast.success("Audit deleted successfully!");
    } catch (err) {
      set({ error: err.response.data.msg, loading: false });
      toast.error(err.response.data.msg || "Failed to delete audit");
      throw err;
    }
  },
  
  // Clear current audit
  clearCurrentAudit: () => set({ currentAudit: null }),
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useAuditScheduleStore;
