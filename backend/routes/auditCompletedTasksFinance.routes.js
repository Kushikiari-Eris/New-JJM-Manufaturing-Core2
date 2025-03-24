import express from "express";
import {
  getCompletedTasks,
  getCompletedTaskById,
  addCompletedTask,
  deleteCompletedTask,
} from "../controllers/auditCompletedTasksFinance.controller.js";

const router = express.Router();

router.get("/", getCompletedTasks); // Fetch all completed tasks
router.get("/:taskId", getCompletedTaskById); // Fetch a single task by ID
router.post("/", addCompletedTask); // Add a new completed task
router.delete("/:id", deleteCompletedTask); // Delete a task

export default router;
