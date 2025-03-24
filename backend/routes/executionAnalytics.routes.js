import express from "express";
import { getExecutionAnalytics } from "../controllers/executionAnalytics.controller.js";

const router = express.Router();

router.get("/", getExecutionAnalytics);

export default router;
