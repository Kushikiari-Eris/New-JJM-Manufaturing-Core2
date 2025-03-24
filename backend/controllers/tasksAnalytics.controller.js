import Task from "../models/auditTask.model.js";

export const getTaskAnalytics = async (req, res) => {
  try {
    // Group by status
    const statusAggregation = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Group by department
    const departmentAggregation = await Task.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      statusData: statusAggregation,
      departmentData: departmentAggregation,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Server error while fetching analytics" });
  }
};
