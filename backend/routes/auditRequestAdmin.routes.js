import express from "express";
import {
  getAuditRequests,
  createAuditRequest,
  updateAuditRequest,
  deleteAuditRequest,
} from "../controllers/auditRequestAdmin.controller.js";

const router = express.Router();

router.get("/", getAuditRequests);
router.post("/", createAuditRequest);
router.put("/:id", updateAuditRequest);
router.delete("/:id", deleteAuditRequest);

export default router;
