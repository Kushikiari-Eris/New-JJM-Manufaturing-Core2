import Task from "../models/auditTask.model.js";
import cloudinary from "../config/cloudinary.js";
import CompletedTasksCore1 from "../models/auditCompletedTasksCore1.model.js";
import CompletedTasksCore2 from '../models/auditCompletedTasksCore2.model.js'
import CompletedTasksAdmin from '../models/auditCompletedTasksAdmin.model.js'
import CompletedTasksHR1 from '../models/auditCompletedTasksHr1.model.js'
import CompletedTasksHR2 from "../models/auditCompletedTasksHr2.model.js";
import CompletedTasksHR3 from "../models/auditCompletedTasksHr3.model.js";
import CompletedTasksHR4 from "../models/auditCompletedTasksHr4.model.js";
import CompletedTasksLogistic1 from "../models/auditCompletedTasksLogistic1.model.js";
import CompletedTasksLogistic2 from "../models/auditCompletedTasksLogistic2.model.js";
import CompletedTasksFinance from "../models/auditCompletedTasksFinance.model.js";


// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ scheduledDate: 1 }); // Sort by schedule
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json({ message: "Task created successfully", newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addResponseToTask = async (req, res) => {
  try {
    const { text, image } = req.body;
    let cloudinaryResponse = null;

    // Upload image to Cloudinary if provided
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "audit_reports",
      });
    }

    // Find the existing task by ID
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create response object
    const response = {
      text: text || "", // Ensure text is always a string
      image: cloudinaryResponse?.secure_url || "",
      createdAt: new Date(),
    };

    // Add response to the task's responses array
    task.responses.push(response);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error("Error adding response:", error);
    res.status(500).json({ message: "Error adding response", error });
  }
};


// Update a task
export const updateTask = async (req, res) => {
   try {
     console.log(`🟢 Received request to update Task ID: ${req.params.id}`);

     const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
     });

     if (!updatedTask) {
       console.error("🔴 Task not found!");
       return res.status(404).json({ error: "Task not found" });
     }

     console.log(
       `🟡 Task ${req.params.id} status updated to: ${updatedTask.status}`
     );

     // If task is completed, move it to the correct completed tasks collection
     if (updatedTask.status === "Completed") {
       console.log(
         `🟡 Moving Task ID ${updatedTask._id} to Completed Collection for Department: ${updatedTask.department}`
       );

       const completedTaskData = {
         department: updatedTask.department,
         description: updatedTask.description,
         task: updatedTask.task,
         responses: updatedTask.responses,
         completedAt: new Date(),
       };

       let model;
       switch (updatedTask.department) {
         case "Admin":
           model = CompletedTasksAdmin;
           break;
         case "Hr 1":
           model = CompletedTasksHR1;
           break;
         case "Hr 2":
           model = CompletedTasksHR2;
           break;
         case "Hr 3":
           model = CompletedTasksHR3;
           break;
         case "Hr 4":
           model = CompletedTasksHR4;
           break;
         case "Core 1":
           model = CompletedTasksCore1;
           break;
         case "Core 2":
           model = CompletedTasksCore2;
           break;
         case "Logistic 1":
           model = CompletedTasksLogistic1;
           break;
         case "Logistic 2":
           model = CompletedTasksLogistic2;
           break;
         case "Finance":
           model = CompletedTasksFinance;
           break;
         default:
           console.warn(
             `⚠️ No completed task model found for department: ${updatedTask.department}`
           );
           return res.status(400).json({ message: "Invalid department" });
       }

       console.log(
         `🟡 Saving completed task to ${updatedTask.department} model...`
       );
       await model.create(completedTaskData);
       console.log("✅ Task moved to completed collection!");
     }

     res
       .status(200)
       .json({ message: "Task updated successfully", updatedTask });
   } catch (error) {
     console.error("❌ Error updating task:", error);
     res.status(500).json({ error: error.message });
   }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
