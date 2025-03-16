import AuditRequestLogistic1 from "../models/auditRequestLogistic1.model.js";

// Get all audit requests
export const getAuditRequests = async (req, res) => {
  try {
    const requests = await AuditRequestLogistic1.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit requests" });
  }
};

// Create a new audit request
export const createAuditRequest = async (req, res) => {
  try {
    const { department, description, task } = req.body;
    const newRequest = new AuditRequestLogistic1({
      department,
      description,
      task,
    });
    await newRequest.save();
    if (req.io) {
      sendAuditNotifications(req.io);
    }
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create audit request" });
  }
};

// Update an audit request
export const updateAuditRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await AuditRequestLogistic1.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to update audit request" });
  }
};

// Delete an audit request
export const deleteAuditRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await AuditRequestLogistic1.findByIdAndDelete(id);
    res.status(200).json({ message: "Audit request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete audit request" });
  }
};

export const sendAuditNotifications = async (io) => {
  try {
    const latestRequest = await AuditRequestLogistic1.findOne().sort({
      createdAt: -1,
    });

    if (!latestRequest) return; // No audit requests found

    io.emit("auditLogistic1RequestNotification", {
      department: latestRequest.department,
      description: latestRequest.description,
      task: latestRequest.task,
    });

    console.log("Audit notification sent:", latestRequest);
  } catch (error) {
    console.error("Error sending audit notification:", error);
  }
};
