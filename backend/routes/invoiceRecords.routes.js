import express from "express";
import {
  getInvoices,
  getInvoiceById,
  updateInvoice,
} from "../controllers/invoiceRecords.controller.js";

const router = express.Router();


router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);

export default router;
