import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useTaskStore = create((set, get) => ({
  tasks: [],
  userTasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  
  // Get all tasks
  getTasks: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/task');
      set({
        tasks: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch tasks'
      });
      throw err;
    }
  },
  
  // Get tasks by user
  getTasksByUser: async (userId) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/task/user/${userId}`);
      set({
        userTasks: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch user tasks'
      });
      throw err;
    }
  },
  
  // Get task by ID
  getTask: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`/task/${id}`);
      set({
        currentTask: res.data,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch task'
      });
      throw err;
    }
  },
  
  // Create task
  createTask: async (taskData) => {
    try {
      set({ isLoading: true });
      const res = await axios.post('/task', taskData);
      set({
        tasks: [...get().tasks, res.data.task],
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to create task'
      });
      throw err;
    }
  },
  
  // Update task
  updateTask: async (id, taskData) => {
    try {
      set({ isLoading: true });
      const res = await axios.put(`/task/${id}`, taskData);
      
      // Update in both tasks and userTasks arrays
      const updatedTasks = get().tasks.map(task => 
        task._id === id ? res.data.task : task
      );
      
      const updatedUserTasks = get().userTasks.map(task => 
        task._id === id ? res.data.task : task
      );
      
      set({
        tasks: updatedTasks,
        userTasks: updatedUserTasks,
        currentTask: res.data.task,
        isLoading: false,
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update task'
      });
      throw err;
    }
  },
  
  // Delete task
  deleteTask: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/task/${id}`);
      
      // Remove from both tasks and userTasks arrays
      set({
        tasks: get().tasks.filter(task => task._id !== id),
        userTasks: get().userTasks.filter(task => task._id !== id),
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete task'
      });
      throw err;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useTaskStore;