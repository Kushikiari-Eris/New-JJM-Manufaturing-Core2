import FinishedProductTransfer from "../models/finishedProductTransfer.model.js";

// Create a new finished product transfer
export const createTransfer = async (req, res) => {
  try {
    const { productId, productName, quantity, sender } = req.body;

    const newTransfer = new FinishedProductTransfer({
      productId,
      productName,
      quantity,
      sender,
    });

    await newTransfer.save();
    res.status(201).json({ message: "Transfer request created", newTransfer });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

// Update transfer status to "Received"
export const markAsReceived = async (req, res) => {
  try {
    const { receivedBy } = req.body;

    const transfer = await FinishedProductTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    transfer.status = "Received";
    transfer.receivedBy = receivedBy;
    transfer.receivedDate = new Date();

    await transfer.save();
    res.status(200).json({ message: "Transfer marked as received", transfer });
  } catch (error) {
    console.error("Error updating transfer status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
