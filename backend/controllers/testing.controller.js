import Testing from "../models/testing.model.js";

export const add = async (req, res) => {
  try {
    const { title, priority, assignedTo } = req.body;
    const newTask = await Testing.create({ title, priority, assignedTo });

    req.io.emit("taskAdded", newTask); // ✅ Emit event using req.io

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const get = async (req, res) => {
  try {
    const tasks = await Testing.find().sort({ priority: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const update = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await Testing.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    req.io.emit("taskUpdated", updatedTask); // ✅ Emit event using req.io

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
