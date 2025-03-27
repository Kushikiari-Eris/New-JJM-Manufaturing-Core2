import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  orderTracker: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  fetchAllOrder: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/orders");
      const orders = Array.isArray(res.data) ? res.data : [];

      // Fetch order statuses for each order
      const orderStatusPromises = orders.map(async (order) => {
        try {
          const statusRes = await axios.get(`/orderTracker/${order._id}`);
          return { ...order, orderStatus: statusRes.data.orderStatus || "N/A" };
        } catch (error) {
          console.error(`Error fetching order status for ${order._id}`, error);
          return { ...order, orderStatus: "N/A" };
        }
      });

      const updatedOrders = await Promise.all(orderStatusPromises);

      // ✅ Sort orders by `createdAt` (newest first)
      const sortedOrders = updatedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      set({ orders: sortedOrders, loading: false });
    } catch (error) {
      console.error("Error fetching orders", error);
      set({ error: "Failed to fetch orders", loading: false, orders: [] });
      toast.error("Failed to fetch orders.");
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/orders/${id}`);

      // Check if user exists in the response
      const populatedOrder = {
        ...res.data,
        userEmail: res.data.user?.email || "No email found",
      };

      set({ order: populatedOrder, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch order", loading: false });
      toast.error("Failed to fetch order details.");
    }
  },

  fetchOrderStatus: async (orderId) => {
    set({ loading: true, error: null });
    try {
      if (!orderId || typeof orderId !== "string") {
        console.error("Invalid orderId:", orderId);
        set({ loading: false });
        return;
      }
      const response = await axios.get(`/orderTracker/${orderId}`);
      set({ orderTracker: [response.data], loading: false });
    } catch (error) {
      console.error("Error fetching order status:", error);
      toast.error("Failed to fetch order status.");
    }
  },

  updateOrderStatus: async (orderId, orderStatus) => {
    set({ loading: true, error: null });
    try {
      await axios.put("/orderTracker/update", { orderId, orderStatus });

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus } : order
        ),
        orderTracker: state.orderTracker.map((order) =>
          order.orderId?._id === orderId ? { ...order, orderStatus } : order
        ),
      }));

      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  },

  updateStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    if (!orderId || !status) {
      console.error("Missing orderId or status", { orderId, status });
      toast.error("Invalid order update request.");
      return;
    }

    try {
      const response = await axios.put(`/orders/${orderId}/status`, { status });

      // Update orders in state immediately
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.status }
            : order
        ),
      }));

      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  },
}));
