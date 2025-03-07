import express from "express";
import {
  getAllAudits,
  createAudit,
  updateAudit,
  deleteAudit,
} from "../controllers/auditRawMaterial.controller.js";

const router = express.Router();

router.get("/", getAllAudits);
router.post("/", createAudit);
router.put("/:id", updateAudit);
router.delete("/:id", deleteAudit);

export default router;
