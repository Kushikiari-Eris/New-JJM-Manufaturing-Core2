import ProductExecution from "../models/productExecution.model.js";
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";
import  Order  from "../models/order.model.js";
import { generateResponse } from "../middleware/geminiservice.js";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Create a new Product Execution
export const createProductExecution = async (req, res) => {
  try {
    const productExecution = new ProductExecution(req.body);
    await productExecution.save();
    res.status(201).json(productExecution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Product Executions
export const getAllProductExecutions = async (req, res) => {
  try {
    // Fetch product executions from local database only
    const executions = await ProductExecution.find();

    res.status(200).json({
      executions,
    });
  } catch (error) {
    console.error("Error fetching product executions:", error);
    res.status(500).json({ error: error.message });
  }
};



// Start Production: Set status to "In Progress" and schedule completion
export const startProduction = async (req, res) => {
  try {
    const { id, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Fetch the execution by ID
    const execution = await ProductExecution.findById(id);
    if (!execution) {
      return res.status(404).json({ message: "Execution not found" });
    }

    // 🛑 Prevent duplicate "In Progress" updates
    if (execution.status === "In Progress") {
      return res.status(400).json({ message: "Production already started for this ID" });
    }

    // ✅ Update status to "In Progress"
    execution.status = "In Progress";
    await execution.save();

    console.log(`🚀 Production started for Execution ID: ${id}`);

    // Complete production after a duration
    setTimeout(async () => {
      console.log(`⏳ Completing production for Execution ID: ${id}`);

      execution.status = "Completed";
      await execution.save()
      
    }, duration * 1000);

    res.status(200).json({ message: "Production started", execution });
  } catch (error) {
    console.error("Error starting production:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




// Get single Product Execution by ID
export const getProductExecutionById = async (req, res) => {
  try {
    const execution = await ProductExecution.findById(req.params.id);
    if (!execution) return res.status(404).json({ message: "Not found" });
    res.status(200).json(execution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product Execution
export const updateProductExecution = async (req, res) => {
  try {
    const execution = await ProductExecution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!execution) return res.status(404).json({ message: "Not found" });
    res.status(200).json(execution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product Execution
export const deleteProductExecution = async (req, res) => {
  try {
    const execution = await ProductExecution.findByIdAndDelete(req.params.id);
    if (!execution) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getGeneratedDataById = async (req, res) => {
  try {
    const workOrder = await ProductExecution.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ message: "Work Order not found" });
    res.status(200).json(workOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching work order", error: error.message });
  }
};

console.log(
  "Gemini API Key:",
  process.env.GEMINI_API_KEY ? "Loaded" : "Not Found"
);

