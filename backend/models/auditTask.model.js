import mongoose from "mongoose";
import CompletedTasksCore1 from "./auditCompletedTasksCore1.model.js";
import CompletedTasksCore2 from "./auditCompletedTasksCore2.model.js";
import CompletedTasksAdmin from "./auditCompletedTasksAdmin.model.js";
import CompletedTasksHR1 from './auditCompletedTasksHr1.model.js'
import CompletedTasksHR2 from './auditCompletedTasksHr2.model.js'
import CompletedTasksHR3 from './auditCompletedTasksHr3.model.js'
import CompletedTasksHR4 from './auditCompletedTasksHr4.model.js'
import CompletedTasksFinance from './auditCompletedTasksFinance.model.js'
import CompletedTasksLogistic1 from "./auditCompletedTasksLogistic1.model.js";
import CompletedTasksLogistic2 from "./auditCompletedTasksLogistic2.model.js";

const responseSchema = new mongoose.Schema({
  text: { type: String, trim: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  department: { type: String, required: true },
  description: String,
  task: { type: [String], required: true, trim: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Overdue"],
    default: "Pending",
  },
  responses: [responseSchema],
  scheduledDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.setDate(now.getDate() + 5));
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// **Static method to update task and move to the correct department model**
taskSchema.statics.updateTaskStatus = async function (taskId, newStatus) {
  try {
    const task = await this.findById(taskId);
    if (!task) {
      console.log("Task not found");
      return null;
    }

    console.log("Before updating:", task.status);

    // Update status
    task.status = newStatus;
    await task.save();

    console.log("After updating:", task.status);

    // If the status is "Completed", move it to the correct completed task model
    if (newStatus === "Completed") {
      const completedTask = {
        department: task.department,
        description: task.description,
        task: task.task,
        responses: task.responses,
        completedAt: new Date(),
      };

      let model;
      switch (task.department) {
        case "Admin":
          model = CompletedTasksAdmin;
          break;
        case "HR 1":
          model = CompletedTasksHR1;
          break;
        case "HR 2":
          model = CompletedTasksHR2;
          break;
        case "HR 3":
          model = CompletedTasksHR3;
          break;
        case "HR 4":
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
            `No completed task model found for department: ${task.department}`
          );
          return task;
      }

      console.log(`Saving completed task to ${task.department} model...`);
      await model.create(completedTask);
      console.log("Task moved successfully.");
    }

    return task;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

const Task = mongoose.model("Task", taskSchema);

export default Task;
