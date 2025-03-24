import ProductExecution from "../models/productExecution.model.js";


export const getExecutionAnalytics = async (req, res) => {
  try {
    const totalExecutions = await ProductExecution.countDocuments();

    const statusCounts = await ProductExecution.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const assignedMachineCounts = await ProductExecution.aggregate([
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
    ]);

    const materialUsage = await ProductExecution.aggregate([
      { $unwind: "$materials" },
      {
        $group: {
          _id: "$materials.materialName",
          totalQuantityUsed: { $sum: "$materials.quantity" },
        },
      },
    ]);

    res.json({
      totalExecutions,
      statusCounts,
      assignedMachineCounts,
      materialUsage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};