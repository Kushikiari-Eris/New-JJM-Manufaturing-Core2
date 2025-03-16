import {create} from "zustand"
import {toast} from "react-hot-toast"
import axios from "../lib/axios.js"

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  transferLoading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      const products = Array.isArray(response.data.products)
        ? response.data.products
        : [];
      const sortedProducts = products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      set({ products: sortedProducts, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);

      if (!response.data || typeof response.data.isFeatured === "undefined") {
        throw new Error("Invalid response from server");
      }

      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to update product");
      console.error("Error in toggleFeaturedProduct:", error);
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  createAndSendTransfer: async (
    productId,
    productName,
    quantity,
    receiverWarehouse
  ) => {
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

      // ✅ Check if transfer was successful (use `message` instead of `status`)
      if (response.data.message.includes("Transfer request created")) {
        console.log(`✅ Transfer sent successfully for ${productName}`);
        // ✅ Decrement stock in the backend
        const stockResponse = await axios.put("/products/updateStock", {
          productId,
          quantity: -quantity, // Ensure stock is decremented
        });

        // ✅ Update frontend state in Zustand
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId
              ? { ...product, stock: Math.max(0, product.stock - quantity) }
              : product
          ),
        }));
      } else {
        console.error("❌ Transfer request failed:", response.data);
      }
    } catch (error) {
      console.error(
        "❌ Error in transfer:",
        error.response?.data || error.message
      );
    } finally {
      set({ transferLoading: false });
    }
  },
}));