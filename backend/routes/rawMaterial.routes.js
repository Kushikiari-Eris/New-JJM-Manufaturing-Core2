import express from "express";
import {
  getRawMaterials,
  createRawMaterial,
  decrementRawMaterialStock,
  deleteRawMaterial,
} from "../controllers/rawMaterial.controller.js";

const router = express.Router();

router.get("/", getRawMaterials);
router.post("/", createRawMaterial);
router.put("/decrement", decrementRawMaterialStock);
router.delete("/:id", deleteRawMaterial);

export default router;
