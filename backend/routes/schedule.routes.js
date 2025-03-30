import express from "express"
import {
  createSchedule,
  fetchAll,
  generateAiSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.post("/", createSchedule);
router.post("/generate", generateAiSchedule);
router.get("/", fetchAll);


export default router
