import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useTransferStore = create((set) => ({
  products: [],
  transfers: [],
  loading: false,
  transferLoading: false,

  // ✅ Fetch all finished products
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/finished-product-transfer");
      set({ products: response.data });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to fetch products.");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch all transfer requests
  fetchAllTransfers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/finished-product-transfer");
      set({ transfers: response.data });
    } catch (error) {
      console.error("❌ Error fetching transfers:", error);
      toast.error("Failed to fetch transfers.");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Send transfer request to Logistic 2
  createAndSendTransfer: async (
    productId,
    productName,
    quantity,
    receiverWarehouse
  ) => {
    console.log(`🚚 Sending transfer for ${productName} (Qty: ${quantity})`);

    // ✅ Validate productId
    if (!productId || !/^[a-f\d]{24}$/i.test(productId)) {
      console.error("❌ Invalid Product ID:", productId);
      toast.error("Invalid Product ID.");
      return;
    }

    // ✅ Ensure quantity is a number
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Invalid quantity.");
      console.error("❌ Invalid quantity:", quantity);
      return;
    }

    // ✅ Log payload before sending
    const transferData = {
      productId,
      productName,
      quantity,
      transferDate: new Date().toISOString(),
      receiverWarehouse,
    };

    console.log("📤 Sending Transfer Request:", transferData);

    set({ transferLoading: true });

    try {
      // ✅ Send transfer request
      const response = await axios.post(
        "/finished-product-transfer",
        transferData
      );

      console.log("🚀 Transfer Response:", response.data);

      if (response.status === 200) {
        console.log(`✅ Transfer sent successfully for ${productName}`);
        toast.success(`Transfer request sent for ${productName}.`);

        // ✅ Decrement stock in the backend
        const stockResponse = await axios.put("/products/updateStock", {
          productId,
          quantity,
        });

        console.log(`✅ Stock updated successfully:`, stockResponse.data);
        toast.success(`Stock updated successfully.`);

        // ✅ Update frontend state
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId
              ? { ...product, stock: Math.max(0, product.stock - quantity) }
              : product
          ),
        }));
      }
    } catch (error) {
      console.error("❌ Transfer failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Transfer failed. Please try again."
      );
    } finally {
      set({ transferLoading: false });
    }
  },

  // ✅ New function to update stock in Zustand
  updateProductStock: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId
          ? { ...product, stock: Math.max(0, product.stock - quantity) }
          : product
      ),
    }));
  },
}));
