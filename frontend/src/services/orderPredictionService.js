// src/services/orderPredictionService.js
import axios from "../lib/axios";

const API_BASE_URL = '/predictiveOrder';

class OrderPredictionService {
  // Get all models
  async getModels() {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Train a new model
  async trainModel(modelData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/train`, modelData);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Make prediction using an existing order ID
  async predictForOrder(modelName, orderId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/predict/order`, {
        modelName,
        orderId
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Make prediction using custom order data
  async predictForOrderData(modelName, orderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/predict/data`, {
        modelName,
        orderData
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Delete a model
  async deleteModel(modelName) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/models/${modelName}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Helper to handle errors consistently
  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with an error status
      return new Error(error.response.data.message || 'Server error');
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new OrderPredictionService();