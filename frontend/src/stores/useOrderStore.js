import { create } from "zustand";
import axios from "../lib/axios";

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
      set({ orders: updatedOrders, loading: false });
    } catch (error) {
      console.error("Error fetching orders", error);
      set({ error: "Failed to fetch orders", loading: false, orders: [] });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/orders/${id}`);
      set({ order: res.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch order", loading: false });
    }
  },

  fetchOrderStatus: async (orderId) => {
    try {
      const response = await axios.get(`/orderTracker/${orderId}`);
      set((state) => ({
        orderTracker: [
          ...state.orderTracker.filter((o) => o.orderId?._id !== orderId),
          response.data,
        ],
      }));
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  },

  updateOrderStatus: async (orderId, orderStatus) => {
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
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },

  updateStatus: async (orderId, status) => {
    if (!orderId || !status) {
      console.error("Missing orderId or status", { orderId, status });
      return;
    }

    try {
      const response = await axios.put(`/orders/${orderId}/status`, { status });

      //  Update orders in state immediately
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.status }
            : order
        ),
      }));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },
}));
