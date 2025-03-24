import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addResponseToTask,
} from "../controllers/auditTask.controller.js";

const router = express.Router();

router.get("/", getAllTasks); // Get all tasks
router.get("/:id", getTaskById); // Get task by ID
router.post("/", createTask); // Create new task
router.post("/:taskId/response", addResponseToTask); 
router.put("/:id", updateTask); // Update task
router.delete("/:id", deleteTask); // Delete task

export default router;
