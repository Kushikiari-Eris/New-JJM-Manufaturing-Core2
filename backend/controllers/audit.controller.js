import Audit from '../models/audit.model.js';

// Get all audits
export const getAudits = async (req, res) => {
  try {
    const audits = await Audit.find()
      .populate('department')
      .populate('auditor', '-password')
      .populate('findings')
      .populate('documents');

    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get audits by department
export const getAuditsByDepartment = async (req, res) => {
  try {
    const audits = await Audit.find({ department: req.params.departmentId })
      .populate('department')
      .populate('auditor', '-password')
      .populate('findings')
      .populate('documents');

    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single audit
export const getAudit = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id)
      .populate('department')
      .populate('auditor', '-password')
      .populate({
        path: 'findings',
        populate: {
          path: 'documents'
        }
      })
      .populate('documents');

    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    res.json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create audit
export const createAudit = async (req, res) => {
  try {
    const { title, description, department, auditor, startDate, endDate } = req.body;

    const audit = new Audit({
      title,
      description,
      department,
      auditor,
      startDate,
      endDate
    });

    await audit.save();
    res.status(201).json({ message: 'Audit created successfully', audit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update audit
export const updateAudit = async (req, res) => {
  try {
    const { title, description, department, auditor, status, startDate, endDate } = req.body;

    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    if (title) audit.title = title;
    if (description) audit.description = description;
    if (department) audit.department = department;
    if (auditor) audit.auditor = auditor;
    if (status) audit.status = status;
    if (startDate) audit.startDate = startDate;
    if (endDate) audit.endDate = endDate;

    audit.updatedAt = Date.now();

    await audit.save();
    res.json({ message: 'Audit updated successfully', audit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete audit
export const deleteAudit = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    await audit.remove();
    res.json({ message: 'Audit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
