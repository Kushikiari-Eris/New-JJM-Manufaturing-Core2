import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


const useDepartmentStore = create((set, get) => ({
  departments: [],
  currentDepartment: null,
  isLoading: false,
  error: null,
  
  // Get all departments
  getDepartments: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/departments');
      set({
        departments: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch departments'
      });
      throw err;
    }
  },
  
  // Get department by ID
  getDepartment: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/departments/${id}`);
      set({
        currentDepartment: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch department'
      });
      throw err;
    }
  },
  
  // Create department
  createDepartment: async (departmentData) => {
    try {
      set({ isLoading: true });
      const res = await axios.post('/departments', departmentData);
      set({
        departments: [...get().departments, res.data.department],
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to create department'
      });
      throw err;
    }
  },
  
  // Update department
  updateDepartment: async (id, departmentData) => {
    try {
      set({ isLoading: true });
      const res = await axios.put(`/departments/${id}`, departmentData);
      set({
        departments: get().departments.map(dept => 
          dept._id === id ? res.data.department : dept
        ),
        currentDepartment: res.data.department,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update department'
      });
      throw err;
    }
  },
  
  // Delete department
  deleteDepartment: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/departments/${id}`);
      set({
        departments: get().departments.filter(dept => dept._id !== id),
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete department'
      });
      throw err;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useDepartmentStore;