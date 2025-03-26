import Maintenance from "../models/maintenance.model.js";

export const getMaintenanceAnalytics = async (req, res) => {
  try {
    const totalMaintenance = await Maintenance.countDocuments();
    const statusCounts = await Maintenance.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const typeCounts = await Maintenance.aggregate([
      { $group: { _id: "$maintenanceType", count: { $sum: 1 } } },
    ]);

    res.json({
      totalMaintenance,
      statusCounts,
      typeCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};
