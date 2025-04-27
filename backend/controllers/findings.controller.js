import Finding from '../models/findings.model.js';
import Audit from '../models/audit.model.js';

// Get all findings
export const getFindings = async (req, res) => {
  try {
    const findings = await Finding.find()
      .populate('audit')
      .populate('remediation.assignedTo', '-password')
      .populate('documents');

    res.json(findings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get findings by audit
export const getFindingsByAudit = async (req, res) => {
  try {
    const findings = await Finding.find({ audit: req.params.auditId })
      .populate('audit')
      .populate('remediation.assignedTo', '-password')
      .populate('documents');

    res.json(findings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single finding
export const getFinding = async (req, res) => {
  try {
    const finding = await Finding.findById(req.params.id)
      .populate('audit')
      .populate('remediation.assignedTo', '-password')
      .populate('documents');

    if (!finding) {
      return res.status(404).json({ message: 'Finding not found' });
    }

    res.json(finding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create finding
export const createFinding = async (req, res) => {
  try {
    const { audit, title, description, severity, status, remediation } = req.body;

    const auditExists = await Audit.findById(audit);
    if (!auditExists) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    const finding = new Finding({
      audit,
      title,
      description,
      severity,
      status,
      remediation
    });

    const savedFinding = await finding.save();

    auditExists.findings.push(savedFinding._id);
    await auditExists.save();

    res.status(201).json({ message: 'Finding created successfully', finding: savedFinding });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update finding
export const updateFinding = async (req, res) => {
  try {
    const { title, description, severity, status, remediation } = req.body;

    const finding = await Finding.findById(req.params.id);
    if (!finding) {
      return res.status(404).json({ message: 'Finding not found' });
    }

    if (title) finding.title = title;
    if (description) finding.description = description;
    if (severity) finding.severity = severity;
    if (status) finding.status = status;
    if (remediation) {
      if (remediation.plan) finding.remediation.plan = remediation.plan;
      if (remediation.assignedTo) finding.remediation.assignedTo = remediation.assignedTo;
      if (remediation.dueDate) finding.remediation.dueDate = remediation.dueDate;
      if (remediation.completedDate) finding.remediation.completedDate = remediation.completedDate;
    }

    finding.updatedAt = Date.now();

    await finding.save();
    res.json({ message: 'Finding updated successfully', finding });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete finding
export const deleteFinding = async (req, res) => {
  try {
    const finding = await Finding.findById(req.params.id);
    if (!finding) {
      return res.status(404).json({ message: 'Finding not found' });
    }

    await Audit.findByIdAndUpdate(finding.audit, {
      $pull: { findings: finding._id }
    });

    await finding.remove();
    res.json({ message: 'Finding deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
