import RawMaterialRequest from "../models/rawMaterialRequest.model.js";
import  {gatewayTokenGenerator}  from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";
import bcrypt from 'bcryptjs'

// Create a new raw material request
export const createRequest = async (req, res) => {
  try {
 
    const newRequest = new RawMaterialRequest(req.body);
    await newRequest.save();


    try {
      const token = gatewayTokenGenerator(); 
      const logisticData = {
        requestedBy: newRequest.requestedBy,
        department: newRequest.department,
        customerName: newRequest.requestedBy,
        material: newRequest.material.map((material) => ({
          materialName: material.materialName,
          quantity: material.quantity,
          unit: material.unit,
        })),
        notes: newRequest.notes,
        priority: newRequest.priority,
        approvalId: newRequest._id,
        coreId: newRequest.coreId,
      };

     
      const logisticResponse = await axios.post(
        `${process.env.API_GATEWAY_URL}/logistic1/request-raw-material`,
        logisticData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Data sent to Logistic1:", logisticResponse.data);
    } catch (logisticsError) {
      console.error(
        " Error sending data to Logistic1:",
        logisticsError.message
      );
    }
   

    
    res.status(201).json(newRequest);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create request", error: error.message });
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
    const { requestStatus, coreId } = req.body;
    const updatedRequest = await RawMaterialRequest.findByIdAndUpdate(
      req.params.id,
      { requestStatus, coreId }, 
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
