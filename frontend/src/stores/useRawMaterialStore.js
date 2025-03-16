import { create } from "zustand";
import axios from "../lib/axios";

const useRawMaterialStore = create((set) => ({
  rawMaterials: [],
  loading: false,

  fetchRawMaterials: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/rawMaterial");
      set({ rawMaterials: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      set({ loading: false });
    }
  },

  addRawMaterial: async (newMaterial) => {
    try {
      console.log("Sending request with data:", newMaterial); // Debugging log

      const response = await axios.post("/rawMaterial", newMaterial);

      set((state) => ({
        rawMaterials: [...state.rawMaterials, response.data],
      }));

      console.log("Material added:", response.data);
    } catch (error) {
      console.error(
        "Error adding raw material:",
        error.response?.data || error
      );
    }
  },

  updateRawMaterial: async (id, updatedData) => {
    try {
      const res = await axios.put(`/rawMaterial/${id}`, updatedData);
      set((state) => ({
        rawMaterials: state.rawMaterials.map((material) =>
          material._id === id ? res.data : material
        ),
      }));
    } catch (error) {
      console.error("Error updating raw material:", error);
    }
  },

  deleteRawMaterial: async (id) => {
    try {
      await axios.delete(`/rawMaterial/${id}`);
      set((state) => ({
        rawMaterials: state.rawMaterials.filter(
          (material) => material._id !== id
        ),
      }));
    } catch (error) {
      console.error("Error deleting raw material:", error);
    }
  },
}));

export default useRawMaterialStore;
