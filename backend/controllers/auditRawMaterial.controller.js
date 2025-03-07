import AuditRawMaterial from "../models/auditRawMaterial.model.js";

export const getAllAudits = async (req, res) => {
  try {
    const audits = await AuditRawMaterial.find();
    res.status(200).json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new audit
export const createAudit = async (req, res) => {
  try {
    const audit = new AuditRawMaterial(req.body);
    await audit.save();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an audit
export const updateAudit = async (req, res) => {
  try {
    const audit = await AuditRawMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!audit) return res.status(404).json({ message: "Audit not found" });
    res.status(200).json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an audit
export const deleteAudit = async (req, res) => {
  try {
    const audit = await AuditRawMaterial.findByIdAndDelete(req.params.id);
    if (!audit) return res.status(404).json({ message: "Audit not found" });
    res.status(200).json({ message: "Audit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};