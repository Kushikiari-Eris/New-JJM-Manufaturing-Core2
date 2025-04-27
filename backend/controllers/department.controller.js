import Department from '../models/department.model.js';

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('manager', '-password');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single department
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('manager', '-password');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = new Department({
      name,
      description,
      manager
    });

    await department.save();
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (name) department.name = name;
    if (description) department.description = description;
    if (manager) department.manager = manager;

    await department.save();
    res.json({ message: 'Department updated successfully', department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.remove();
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
