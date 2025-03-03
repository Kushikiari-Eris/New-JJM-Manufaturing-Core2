import RawMaterialRequest from "../models/rawMaterialRequest.model.js";
import  {gatewayTokenGenerator}  from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";

// Create a new raw material request
export const createRequest = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    // Generate token for API Gateway
    const token = gatewayTokenGenerator();
    console.log("Generated Token:", token);

    // Create a new request in the local database
    const newRequest = new RawMaterialRequest(req.body);
    await newRequest.save();
    console.log("Saved Request in DB:", newRequest);

    // Forward the request to the API Gateway
    const response = await axios.post(
      `${process.env.API_GATEWAY_URL}/logistic1/request-raw-material`,
      req.body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("API Gateway Response:", response.data);

    res.status(201).json({
      message: "Request created successfully",
      data: newRequest,
      gatewayResponse: response.data,
    });
  } catch (error) {
    // Log full error details
    console.error(
      "Error in createRequest:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to create request",
      error: error.response?.data || error.message,
    });
  }
};


// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await RawMaterialRequest.find().populate(
      "approvedBy",
      "name"
    );
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await RawMaterialRequest.findById(req.params.id).populate(
      "approvedBy",
      "name"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch request", error: error.message });
  }
};

// Update request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestStatus, approvedBy, approvalDate } = req.body;
    const updatedRequest = await RawMaterialRequest.findByIdAndUpdate(
      req.params.id,
      { requestStatus, approvedBy, approvalDate },
      { new: true }
    );

    if (!updatedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.status(200).json(updatedRequest);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update request", error: error.message });
  }
};

// Delete a request
export const deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await RawMaterialRequest.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete request", error: error.message });
  }
};
