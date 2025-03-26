import FinishedProductTransfer from "../models/finishedProductTransfer.model.js";
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";


// Create a new finished product transfer

export const createTransferAndSend = async (req, res) => {
  try {
    const {
      productId,
      productName,
      quantity,
      transferDate,
      status,
      receiverWarehouse,
    } = req.body;

    // ✅ Validate required fields
    if (
      !productId ||
      !productName ||
      !quantity ||
      !transferDate ||
      !status ||
      !receiverWarehouse
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Convert productId to string BEFORE saving it in MongoDB
    const productIdString = String(productId);

    // ✅ 1. Create transfer request in the database
    const newTransfer = new FinishedProductTransfer({
      productName,
      quantity,
      transferDate,
      status,
    });

    await newTransfer.save();
    console.log("📦 Transfer request created:", newTransfer);

    // ✅ Extract string IDs
    const transferData = {
      productName: newTransfer.productName,
      quantity: newTransfer.quantity,
      transferDate: newTransfer.transferDate,
      status: newTransfer.status,
      coreId: newTransfer.coreId ? newTransfer.coreId.toString() : null, // Convert coreId if it exists
    };

    // ✅ 2. Generate authentication token for API Gateway
    const token = gatewayTokenGenerator();
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed. No token generated." });
    }

    // ✅ 3. Send transfer request to Logistic 2
    try {
      // Ensure only required fields are sent
      if (!transferData.coreId) delete transferData.coreId;

      const response = await axios.post(
        `${process.env.API_GATEWAY_URL}/logistic2/transfer-products`,
        transferData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Transfer sent to Logistic 2:", response.data);
      return res.status(201).json({
        message: "Transfer request created & sent to Logistic 2",
        newTransfer,
        logisticResponse: response.data,
      });
    } catch (apiError) {
      console.error(
        "❌ Logistic 2 API Error:",
        apiError.response?.data || apiError.message
      );
      return res.status(apiError.response?.status || 500).json({
        message: "Transfer created but failed to send to Logistic 2.",
        error: apiError.response?.data || apiError.message,
      });
    }
  } catch (error) {
    console.error("❌ Error in transfer process:", error);
    return res.status(500).json({
      message: "Failed to create transfer or send to Logistic 2.",
      error: error.message,
    });
  }
};






// Get all finished product transfers
export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await FinishedProductTransfer.find()
      .populate("productId", "name") // Populate product details
      .populate("sender", "name email") // Populate sender details
      .populate("receivedBy", "name email"); // Populate receiver details

    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single transfer by ID
export const getTransferById = async (req, res) => {
  try {
    const transfer = await FinishedProductTransfer.findById(req.params.id)
      .populate("productId", "name")
      .populate("sender", "name email")
      .populate("receivedBy", "name email");

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    res.status(200).json(transfer);
  } catch (error) {
    console.error("Error fetching transfer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, coreId, rejectionReason } = req.body;
    const updatedRequest = await FinishedProductTransfer.findByIdAndUpdate(
      req.params.id,  
      { status, coreId, rejectionReason },
      { new: true }
    );

    if (!updatedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.status(200).json(updatedRequest.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update request", error: error.message });
  }
};
