import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useFindingStore = create((set, get) => ({
  findings: [],
  currentFinding: null,
  filteredFindings: [],
  isLoading: false,
  error: null,
  
  // Get all findings
  getFindings: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/findings');
      set({
        findings: res.data,
        filteredFindings: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch findings'
      });
      throw err;
    }
  },
  
  // Get findings by audit
  getFindingsByAudit: async (auditId) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/findings/audit/${auditId}`);
      set({
        filteredFindings: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch audit findings'
      });
      throw err;
    }
  },
  
  // Get finding by ID
  getFinding: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/findings/${id}`);
      set({
        currentFinding: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch finding'
      });
      throw err;
    }
  },
  
  // Create finding
  createFinding: async (findingData) => {
    try {
      set({ isLoading: true });
      const res = await axios.post('/findings', findingData);
      set({
        findings: [...get().findings, res.data.finding],
        filteredFindings: [...get().filteredFindings, res.data.finding],
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to create finding'
      });
      throw err;
    }
  },
  
  // Update finding
  updateFinding: async (id, findingData) => {
    try {
      set({ isLoading: true });
      const res = await axios.put(`/findings/${id}`, findingData);
      set({
        findings: get().findings.map(finding => 
          finding._id === id ? res.data.finding : finding
        ),
        filteredFindings: get().filteredFindings.map(finding => 
          finding._id === id ? res.data.finding : finding
        ),
        currentFinding: res.data.finding,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update finding'
      });
      throw err;
    }
  },
  
  // Delete finding
  deleteFinding: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/findings/${id}`);
      set({
        findings: get().findings.filter(finding => finding._id !== id),
        filteredFindings: get().filteredFindings.filter(finding => finding._id !== id),
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete finding'
      });
      throw err;
    }
  },
  
  // Filter findings by status
  filterByStatus: (status) => {
    if (!status || status === 'all') {
      set({ filteredFindings: get().findings });
    } else {
      set({
        filteredFindings: get().findings.filter(finding => finding.status === status)
      });
    }
  },
  
  // Filter findings by severity
  filterBySeverity: (severity) => {
    if (!severity || severity === 'all') {
      set({ filteredFindings: get().findings });
    } else {
      set({
        filteredFindings: get().findings.filter(finding => finding.severity === severity)
      });
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useFindingStore;