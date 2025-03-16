import { create } from "zustand";
import axios from "../lib/axios";

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

    if (!productId || productId.length !== 24) {
      console.error("❌ Invalid Product ID format:", productId);
      return;
    }

    set({ transferLoading: true });

    try {
      // ✅ Send transfer request
      const response = await axios.post("/finished-product-transfer", {
        productId,
        productName,
        quantity,
        transferDate: new Date().toISOString(),
        status: "Pending",
        receiverWarehouse,
      });

      if (response.status === 200) {
        console.log(`✅ Transfer sent successfully for ${productName}`);

        // ✅ Decrement stock in the backend
        await axios.put("/products/updateStock", { productId, quantity });

        console.log(`✅ Stock updated successfully for Product ${productId}`);

        // ✅ Update frontend state in Zustand
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId
              ? { ...product, stock: Math.max(0, product.stock - quantity) }
              : product
          ),
        }));
      }
    } catch (error) {
      console.error("❌ Error in transfer:", error);
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
