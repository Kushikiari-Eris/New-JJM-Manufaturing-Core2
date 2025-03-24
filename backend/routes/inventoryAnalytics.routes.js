import express from "express";
import { getAnalytics } from "../controllers/inventoryAnalytics.controller.js";

const router = express.Router();

router.get("/", getAnalytics);

export default router;
