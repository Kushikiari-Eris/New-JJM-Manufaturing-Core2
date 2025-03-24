import { create } from "zustand";
import axios from "../lib/axios";

const useCompletedTasksStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auditCompletedTasksCore1");
      set({ tasks: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const response = await axios.post("/auditCompletedTasksCore1", taskData);
      set((state) => ({ tasks: [...state.tasks, response.data.task] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`/auditCompletedTasksCore1/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useCompletedTasksStore;
