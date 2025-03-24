import RawMaterial from "../models/rawMaterial.model.js";
import FinishProduct from "../models/finishProduct.model.js";

export const getAnalytics = async (req, res) => {
  try {
    // Get total raw materials
    const totalRawMaterials = await RawMaterial.countDocuments();

    // Get total finish products
    const totalFinishProducts = await FinishProduct.countDocuments();

    // Get material usage statistics
    const materialUsage = await RawMaterial.aggregate([
      {
        $group: {
          _id: "$materialName",
          totalQuantityUsed: { $sum: "$quantity" },
        },
      },
      { $sort: { totalQuantityUsed: -1 } },
    ]);

    // Get stock status of finished products
    const productStockStatus = await FinishProduct.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalRawMaterials,
      totalFinishProducts,
      materialUsage,
      productStockStatus,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
