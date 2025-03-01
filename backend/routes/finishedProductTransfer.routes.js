import express from "express";
import {
  createTransfer,
  getAllTransfers,
  getTransferById,
  markAsReceived,
} from "../controllers/finishedProductTransfer.controller.js";

const router = express.Router();

// Create a transfer request
router.post("/", createTransfer);

// Get all transfers
router.get("/", getAllTransfers);

// Get a single transfer by ID
router.get("/:id", getTransferById);

// Mark transfer as received
router.put("/:id/received", markAsReceived);

export default router;
