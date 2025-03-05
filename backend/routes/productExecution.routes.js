import express from "express";
import {
  createProductExecution,
  getAllProductExecutions,
  getProductExecutionById,
  updateProductExecution,
  deleteProductExecution,
} from "../controllers/productExecution.controller.js";

const router = express.Router();

router.post("/", createProductExecution);
router.get("/", getAllProductExecutions);
router.get("/:id", getProductExecutionById);
router.put("/:id", updateProductExecution);
router.delete("/:id", deleteProductExecution);

export default router;
