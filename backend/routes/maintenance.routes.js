import express from 'express'
import { createMaintenance, getAllMaintenance, updateMaintenance, deleteMaintenance } from "../controllers/maintenance.controller.js";
const router = express.Router()


router.post("/", createMaintenance);
router.get("/", getAllMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

export default router
