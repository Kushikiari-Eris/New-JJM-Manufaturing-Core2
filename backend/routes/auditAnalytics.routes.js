import express from "express";
import { getAnalytics } from "../controllers/auditAnalytics.controller.js";

const router = express.Router();

router.get("/", getAnalytics);

export default router;
