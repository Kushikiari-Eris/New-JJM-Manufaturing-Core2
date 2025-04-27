import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  
  // Get all documents
  getDocuments: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/document');
      set({
        documents: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch documents'
      });
      throw err;
    }
  },
  
  // Get document by ID
  getDocument: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/document/${id}`);
      set({
        currentDocument: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch document'
      });
      throw err;
    }
  },
  
  // Upload document
  uploadDocument: async (documentData) => {
    try {
      set({ isLoading: true });
      
      // In a real implementation, you would use FormData for file uploads
      const res = await axios.post('/document', documentData);
      
      set({
        documents: [...get().documents, res.data.document],
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to upload document'
      });
      throw err;
    }
  },
  
  // Update document
  updateDocument: async (id, documentData) => {
    try {
      set({ isLoading: true });
      const res = await axios.put(`/document/${id}`, documentData);
      set({
        documents: get().documents.map(doc => 
          doc._id === id ? res.data.document : doc
        ),
        currentDocument: res.data.document,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update document'
      });
      throw err;
    }
  },
  
  // Delete document
  deleteDocument: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/document/${id}`);
      set({
        documents: get().documents.filter(doc => doc._id !== id),
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete document'
      });
      throw err;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useDocumentStore;