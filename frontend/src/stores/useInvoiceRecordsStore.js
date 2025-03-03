import { create } from "zustand";
import axios from "../lib/axios";


const useInvoiceStore = create((set) => ({
  invoices: [],
  loading: false,
  error: null,

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/invoiceRecords");
      set({ invoices: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await axios.put(`/invoiceRecords/${id}`, invoiceData);
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv._id === id ? response.data.invoice : inv
        ),
      }));
    } catch (error) {
      console.error("Error updating invoice:", error.message);
    }
  },

}));

export default useInvoiceStore;