import Maintenance from "../models/maintenance.model.js";

// Add a new maintenance record
export const createMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    res.status(201).json({ message: "Maintenance record added", maintenance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all maintenance records
export const getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find()
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update maintenance status
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecord = await Maintenance.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Maintenance updated", updatedRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a maintenance record
export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    await Maintenance.findByIdAndDelete(id);
    res.status(200).json({ message: "Maintenance record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendNotifications = async (io) => {
  try {
    const now = new Date();

    // Get the start of the day (00:00:00)
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    // Get the end of the day (23:59:59)
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const overdueTasks = await Maintenance.find({ status: "Overdue" });

    const upcomingTasks = await Maintenance.find({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay }, // Match tasks within today
      status: { $in: ["Scheduled", "In Progress"] },
    });

    io.emit("maintenanceNotifications", {
      overdue: overdueTasks.length,
      upcoming: upcomingTasks.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error sending maintenance notifications:", error);
  }
};
