import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useScheduleStore = create((set) => ({
  schedules: [],
  aiSuggestedSchedule: null, // Store AI suggestion separately
  isAiSaved: false, // Track if AI-generated schedule is saved

  /**
   * Generate AI schedule (but do not save yet)
   */
  generateAiSchedule: async (task) => {
    try {
      const response = await axios.post("/schedule/generate", task);
      set({ aiSuggestedSchedule: response.data, isAiSaved: false });
      toast.success("Generated successfully!");
      return response.data;
    } catch (error) {
      console.error("Error generating AI schedule:", error);
      toast.error("Failed generatinng!");
      return null;
    }
  },

  /**
   * Save the AI-generated schedule to the database
   */
  saveAiSchedule: async (userId) => {
    try {
      const { aiSuggestedSchedule } = useScheduleStore.getState();

      if (!aiSuggestedSchedule) {
        console.error("No AI-generated schedule to save.");
        return null;
      }

      const scheduleToSave = { ...aiSuggestedSchedule, userId };
      const response = await axios.post("/schedule", scheduleToSave);

      set((state) => ({
        schedules: [...state.schedules, response.data],
        isAiSaved: true,
      }));

      toast.success("Schedule saved successfully!");
      return response.data;
    } catch (error) {
      console.error("Error saving AI schedule:", error);
      toast.error("Error saving AI schedule!");
      return null;
    }
  },

  /**
   * Fetch all schedules
   */
  getAllData: async () => {
    try {
      const res = await axios.get("/schedule");
      set({ schedules: res.data.reverse() }); // Reverse the array to show the latest first
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      set({ schedules: [] });
    }
  },
}));

export default useScheduleStore;
