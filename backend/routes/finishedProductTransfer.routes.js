import express from "express";
import {
  createTransferAndSend,
  getAllTransfers,
  getTransferById,
  updateRequestStatus,
} from "../controllers/finishedProductTransfer.controller.js";

const router = express.Router();

// Create a transfer request
router.post("/", createTransferAndSend);

// Get all transfers
router.get("/", getAllTransfers);

// Get a single transfer by ID
router.get("/:id", getTransferById);

// Mark transfer as received
router.post("/updateStatus", updateRequestStatus);

export default router;
