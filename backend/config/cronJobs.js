import cron from "node-cron";
import Maintenance from "../models/maintenance.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const scheduleMaintenanceJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Checking for overdue maintenance tasks...");
    try {
      await mongoose.connect(process.env.DB_CONN);

      const now = new Date();
      const overdueTasks = await Maintenance.find({
        scheduledDate: { $lt: now },
        status: { $ne: "Completed" },
      });

      for (let task of overdueTasks) {
        task.status = "Overdue";
        await task.save();
      }

      console.log(
        `Updated ${overdueTasks.length} maintenance tasks to Overdue.`
      );
    } catch (error) {
      console.error("Error updating overdue tasks:", error);
    }
  });
};

export default scheduleMaintenanceJob;
