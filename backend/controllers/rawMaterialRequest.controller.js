import RawMaterialRequest from "../models/rawMaterialRequest.model.js";

// Create a new raw material request
export const createRawMaterialRequest = async (req, res) => {
  try {
    const { requestedBy, materials } = req.body;
    if (!requestedBy || !materials || materials.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRequest = new RawMaterialRequest({ requestedBy, materials });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get all raw material requests
export const getRawMaterialRequests = async (req, res) => {
  try {
    const requests = await RawMaterialRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update request status
export const updateRawMaterialRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const updatedRequest = await RawMaterialRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
