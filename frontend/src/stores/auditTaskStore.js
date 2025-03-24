import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAuditTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/auditTask");
      set({ tasks: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const response = await axios.post("/auditTask", task);
      set((state) => ({ tasks: [...state.tasks, response.data.newTask] }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  updateTask: async (id, updatedTask) => {
    try {
      const response = await axios.put(`/auditTask/${id}`, updatedTask);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.updatedTask : task
        ),
      }));

      // Show toast based on the updated status
      if (updatedTask.status === "Completed") {
        toast.success("Task marked as Completed!");
      } else if (updatedTask.status === "In Progress") {
        toast.success("Task is now In Progress!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  },

  addResponseToTask: async (taskId, data) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(
        `/auditTask/${taskId}/response`,
        data, // Send JSON instead of FormData
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data : task
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding response:", error);
      set({
        error: error.response?.data?.message || "Error adding response",
        loading: false,
      });
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`/auditTask/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));

export default useAuditTaskStore;
