import { create } from "zustand";
import axios from "../lib/axios";

const useTestingStore = create((set) => ({
  tasks: [],

  // Fetch Tasks from API
  fetchTasks: async () => {
    try {
      const { data } = await axios.get("/testing");
      set({ tasks: data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  // Add Task
  addTask: async (title, priority, assignedTo) => {
    try {
      const { data } = await axios.post("/testing", {
        title,
        priority,
        assignedTo,
      });
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  // Update Task Status
  updateTaskStatus: async (taskId, status) => {
    try {
      const { data } = await axios.put(`/testing/${taskId}`, { status });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? { ...task, status: data.status } : task
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },

  // Listen for WebSocket Updates
  listenForUpdates: (socket) => {
    if (!socket) return;

    socket.on("taskUpdated", (updatedTask) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        ),
      }));
    });

    socket.on("taskAdded", (newTask) => {
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    });

    console.log("✅ Listening for task updates...");
  },
}));


export default useTestingStore;
