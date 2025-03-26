import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useRawMaterialStore = create((set) => ({
  rawMaterials: [],
  loading: false,

  fetchRawMaterials: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/rawMaterial");
      set({ rawMaterials: res.data, loading: false });
      return res.data; // ✅ Return materials so it can be used in handleApprove
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      toast.error("Failed to fetch raw materials.");
      set({ loading: false });
      return []; // ✅ Return an empty array on error to prevent crashes
    }
  },

  addRawMaterial: async (newMaterial) => {
    try {
      console.log("Checking if material exists before adding:", newMaterial);

      // ✅ Fetch latest materials
      const res = await axios.get("/rawMaterial");
      const existingMaterial = res.data.find(
        (mat) =>
          mat.materialName.toLowerCase() ===
          newMaterial.materialName.toLowerCase()
      );

      if (existingMaterial) {
        // ✅ Update quantity if material exists
        console.log(
          `Material ${existingMaterial.materialName} exists. Updating quantity.`
        );
        await useRawMaterialStore
          .getState()
          .updateRawMaterial(existingMaterial._id, newMaterial.quantity);
        return existingMaterial; // ✅ Return existing material after update
      } else {
        // ✅ If material doesn't exist, add it
        const response = await axios.post("/rawMaterial", newMaterial);
        set((state) => ({
          rawMaterials: [...state.rawMaterials, response.data],
        }));
        toast.success("Raw material added successfully!");
        return response.data; // ✅ Return newly added material
      }
    } catch (error) {
      console.error(
        "Error adding raw material:",
        error.response?.data || error
      );
      toast.error("Failed to add raw material.");
      return null; // ✅ Return null on error to prevent undefined issues
    }
  },

  updateRawMaterial: async (id, quantity) => {
    try {
      console.log(`Updating material ${id} with quantity ${quantity}`);

      const response = await axios.put(`/rawMaterial/increment/${id}`, {
        quantity,
      });
      const updatedMaterial = response.data;

      set((state) => ({
        rawMaterials: state.rawMaterials.map((mat) =>
          mat._id === id ? { ...mat, quantity: updatedMaterial.quantity } : mat
        ),
      }));

      toast.success("Material quantity updated!");
      return updatedMaterial; // ✅ Return updated material
    } catch (error) {
      console.error("Error updating material quantity:", error);
      toast.error("Failed to update material.");
      return null; // ✅ Return null on error
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

      toast.success("Raw material deleted successfully!");
    } catch (error) {
      console.error("Error deleting raw material:", error);
      toast.error("Failed to delete raw material.");
    }
  },
}));

export default useRawMaterialStore;
