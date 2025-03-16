import express from "express";
import {
  createProductExecution,
  getAllProductExecutions,
  getProductExecutionById,
  updateProductExecution,
  deleteProductExecution,
  getGeneratedDataById,
  startProduction,
} from "../controllers/productExecution.controller.js";

const router = express.Router();

router.post("/", createProductExecution);
router.get("/", getAllProductExecutions);
router.put("/start", startProduction);
router.get("/:id", getProductExecutionById);
router.put("/:id", updateProductExecution);
router.delete("/:id", deleteProductExecution)
router.get("/:id", getGeneratedDataById);

export default router;
