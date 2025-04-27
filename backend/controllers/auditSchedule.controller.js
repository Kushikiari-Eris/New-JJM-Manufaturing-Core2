import AuditSchedule from '../models/auditSchedule.model.js';

// Get all audits
export const getAudits = async (req, res) => {
  try {
    const audits = await AuditSchedule.find().sort({ startDate: 1 });
    res.json(audits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get single audit
export const getAudit = async (req, res) => {
  try {
    const audit = await AuditSchedule.findById(req.params.id);
    
    if (!audit) {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    res.json(audit);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// Create audit
export const createAudit = async (req, res) => {
  const { title, description, department, assignedTo, status, startDate, endDate } = req.body;
  
  try {
    const newAudit = new AuditSchedule({
      title,
      description,
      department,
      assignedTo,
      status,
      startDate,
      endDate
    });
    
    const audit = await newAudit.save();
    res.json(audit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update audit
export const updateAudit = async (req, res) => {
  const { title, description, department, assignedTo, status, startDate, endDate } = req.body;
  
  // Build audit object
  const auditFields = {};
  if (title) auditFields.title = title;
  if (description) auditFields.description = description;
  if (department) auditFields.department = department;
  if (assignedTo) auditFields.assignedTo = assignedTo;
  if (status) auditFields.status = status;
  if (startDate) auditFields.startDate = startDate;
  if (endDate) auditFields.endDate = endDate;
  
  try {
    let audit = await AuditSchedule.findById(req.params.id);
    
    if (!audit) {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    // Update
    audit = await AuditSchedule.findByIdAndUpdate(
      req.params.id,
      { $set: auditFields },
      { new: true }
    );
    
    res.json(audit);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// Delete audit
export const deleteAudit = async (req, res) => {
  try {
    const audit = await AuditSchedule.findById(req.params.id);
    
    if (!audit) {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    await AuditSchedule.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Audit removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audit not found' });
    }
    
    res.status(500).send('Server Error');
  }
};
