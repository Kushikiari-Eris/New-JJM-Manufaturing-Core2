import express from "express";
import {
  createRawMaterialRequest,
  getRawMaterialRequests,
  updateRawMaterialRequestStatus,
} from "../controllers/rawMaterialRequest.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createRawMaterialRequest); 
router.get("/", protectRoute, getRawMaterialRequests); 
router.put("/:requestId/status", protectRoute, updateRawMaterialRequestStatus); 

export default router;
