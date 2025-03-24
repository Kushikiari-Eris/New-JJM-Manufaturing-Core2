import AuditRequestAdmin from "../models/auditRequestAdmin.model.js";

// Get all audit requests
export const getAuditRequests = async (req, res) => {
  try {
    const requests = await AuditRequestAdmin.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit requests" });
  }
};

// Create a new audit request
export const createAuditRequest = async (req, res) => {
  try {
    const { department, description, task } = req.body;
    const newRequest = new AuditRequestAdmin({ department, description, task });
    await newRequest.save();

        if (req.io) {
          sendAuditNotifications(req.io);
        }
        
    res.status(201).json({ message: "Request recieved successfully!"});
  } catch (error) {
    res.status(500).json({ error: "Failed to create audit request" });
  }
};

// Update an audit request
export const updateAuditRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await AuditRequestAdmin.findByIdAndUpdate(
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
    await AuditRequestAdmin.findByIdAndDelete(id);
    res.status(200).json({ message: "Audit request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete audit request" });
  }
};

export const sendAuditNotifications = async (io) => {
  try {
    const latestRequest = await AuditRequestAdmin.findOne().sort({
      createdAt: -1,
    });

    if (!latestRequest) return; // No audit requests found

    io.emit("auditAdminRequestNotification", {
      department: latestRequest.department,
      description: latestRequest.description,
      task: latestRequest.task,
    });

    console.log("Audit notification sent:", latestRequest);
  } catch (error) {
    console.error("Error sending audit notification:", error);
  }
};