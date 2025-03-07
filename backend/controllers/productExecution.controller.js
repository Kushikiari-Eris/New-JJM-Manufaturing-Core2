import ProductExecution from "../models/productExecution.model.js";
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";

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
    // Fetch product executions from local database
    const executions = await ProductExecution.find();

    // Generate API Gateway Token
    const token = gatewayTokenGenerator();

    // Fetch work orders from the external API
    const response = await axios.get(
      `${process.env.API_GATEWAY_URL}/core1/api/workOrders`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Combine local executions with external work orders
    res.status(200).json({
      executions,
      workOrders: response.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
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
