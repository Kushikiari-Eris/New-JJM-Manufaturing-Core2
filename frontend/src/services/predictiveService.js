import axios from "../lib/axios";

const API_URL = '/predictiveOrder';

export const predictiveService = {
  // Add a new data point
  addDataPoint: async (features, label) => {
    const response = await axios.post(`${API_URL}/data`, { features, label });
    return response.data;
  },
  
  // Train a new model
  trainModel: async (modelName, description) => {
    console.log("Training model with", { modelName, description });
    const response = await axios.post(`${API_URL}/train`, { modelName, description });
    return response.data;
  },
  
  
  // Make a prediction using a model
  predict: async (modelName, features) => {
    const response = await axios.post(`${API_URL}/predict`, { modelName, features });
    return response.data;
  },
  
  // Get list of available models
  getModels: async () => {
    const response = await axios.get(`${API_URL}/models`);
    return response.data;
  },
  
  // Get recent data points
  getDataPoints: async (limit = 100) => {
    const response = await axios.get(`${API_URL}/data`, { params: { limit } });
    return response.data;
  }
};