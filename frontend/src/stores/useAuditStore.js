import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


const useAuditStore = create((set, get) => ({
  audits: [],
  currentAudit: null,
  filteredAudits: [],
  isLoading: false,
  error: null,
  
  // Get all audits
  getAudits: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/audit');
      set({
        audits: res.data,
        filteredAudits: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch audits'
      });
      throw err;
    }
  },
  
  // Get audits by department
  getAuditsByDepartment: async (departmentId) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/audit/department/${departmentId}`);
      set({
        filteredAudits: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch department audits'
      });
      throw err;
    }
  },
  
  // Get audit by ID
  getAudit: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/audit/${id}`);
      set({
        currentAudit: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch audit'
      });
      throw err;
    }
  },
  
  // Create audit
  createAudit: async (auditData) => {
    try {
      set({ isLoading: true });
      const res = await axios.post('/audit', auditData);
      set({
        audits: [...get().audits, res.data.audit],
        filteredAudits: [...get().filteredAudits, res.data.audit],
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to create audit'
      });
      throw err;
    }
  },
  
  // Update audit
  updateAudit: async (id, auditData) => {
    try {
      set({ isLoading: true });
      const res = await axios.put(`/audit/${id}`, auditData);
      set({
        audits: get().audits.map(audit => 
          audit._id === id ? res.data.audit : audit
        ),
        filteredAudits: get().filteredAudits.map(audit => 
          audit._id === id ? res.data.audit : audit
        ),
        currentAudit: res.data.audit,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update audit'
      });
      throw err;
    }
  },
  
  // Delete audit
  deleteAudit: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/audit/${id}`);
      set({
        audits: get().audits.filter(audit => audit._id !== id),
        filteredAudits: get().filteredAudits.filter(audit => audit._id !== id),
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete audit'
      });
      throw err;
    }
  },
  
  // Filter audits by status
  filterByStatus: (status) => {
    if (!status || status === 'all') {
      set({ filteredAudits: get().audits });
    } else {
      set({
        filteredAudits: get().audits.filter(audit => audit.status === status)
      });
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useAuditStore;