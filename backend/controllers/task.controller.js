// controllers/taskController.js
import Tasks from '../models/task.model.js';

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find()
      .populate('assignedTo', '-password')
      .populate('createdBy', '-password');
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks by user
export const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Tasks.find({ assignedTo: req.params.userId })
      .populate('assignedTo', '-password')
      .populate('createdBy', '-password');
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single task
export const getTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id)
      .populate('assignedTo', '-password')
      .populate('createdBy', '-password');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, relatedTo, createdBy } = req.body;
    
    const task = new Tasks({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      relatedTo,
      createdBy
    });
    
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, status, priority } = req.body;
    
    const task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    
    task.updatedAt = Date.now();
    
    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
