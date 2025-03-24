import express from "express";
import { getTaskAnalytics } from "../controllers/tasksAnalytics.controller.js";

const router = express.Router();

router.get("/", getTaskAnalytics);

export default router;
