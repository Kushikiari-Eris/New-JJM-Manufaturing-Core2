import express from "express";
import { getMaintenanceAnalytics } from "../controllers/maintenanceAnalytics.controller.js";

const router = express.Router();

router.get("/", getMaintenanceAnalytics);

export default router;
