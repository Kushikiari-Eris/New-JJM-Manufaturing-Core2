import CompletedTasksAdmin from "../models/auditCompletedTasksAdmin.model.js";

// Get all completed tasks
export const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await CompletedTasksAdmin.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed tasks", error });
  }
};

// Get a specific completed task by ID
export const getCompletedTaskById = async (req, res) => {
  try {
    const task = await CompletedTasksAdmin.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

// Add a new completed task
export const addCompletedTask = async (req, res) => {
  try {
    const newTask = new CompletedTasksAdmin(req.body);
    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
};

// Delete a completed task
export const deleteCompletedTask = async (req, res) => {
  try {
    await CompletedTasksAdmin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
