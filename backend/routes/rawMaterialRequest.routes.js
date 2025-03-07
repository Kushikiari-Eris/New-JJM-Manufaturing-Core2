import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/rawMaterialRequest.controller.js";

const router = express.Router();

router.post("/", createRequest); // Create a request
router.get("/", getAllRequests); // Get all requests
router.get("/:id", getRequestById); // Get a specific request
router.post("/update", updateRequestStatus); // Update request status
router.delete("/:id", deleteRequest); // Delete a request

export default router;
