import Order from '../models/order.model.js';
import { Model } from '../models/predictive.model.js'; // Using the same Model schema
import orderMLService from '../services/orderMlService.js';

// Common feature configurations for different prediction types
const predictionConfigs = {
  // Predict shipping fee based on order details
  shippingFee: {
    features: {
      totalAmount: { 
        path: 'totalAmount', 
        defaultValue: 0,
      },
      productCount: { 
        path: 'products', 
        transform: (products) => products?.length || 0,
        defaultValue: 0,
      },
      totalQuantity: { 
        path: 'products', 
        transform: (products) => products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        defaultValue: 0,
      },
      postalCode: { 
        path: 'shippingAddress.postal_code', 
        transform: (postal) => postal ? parseInt(postal.substring(0, 3)) : 0,
        defaultValue: 0,
      },
      isInternational: { 
        path: 'shippingAddress.country', 
        transform: (country) => country === 'US' ? 0 : 1,
        defaultValue: 0,
      },
    },
    targetField: 'shippingFee'
  },
  
  // Predict delivery time in days
  deliveryTime: {
    features: {
      totalAmount: { 
        path: 'totalAmount', 
        defaultValue: 0,
      },
      productCount: { 
        path: 'products', 
        transform: (products) => products?.length || 0,
        defaultValue: 0,
      },
      totalQuantity: { 
        path: 'products', 
        transform: (products) => products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        defaultValue: 0,
      },
      shippingMethod: { 
        path: 'shippingMethod', 
        transform: (method) => {
          const methods = {
            'express': 1,
            'standard': 2,
            'economy': 3
          };
          return methods[method?.toLowerCase()] || 2;
        },
        defaultValue: 2,
      },
      isInternational: { 
        path: 'shippingAddress.country', 
        transform: (country) => country === 'US' ? 0 : 1,
        defaultValue: 0,
      },
    },
    // Target is delivery date minus creation date in days
    targetField: 'deliveryTime',
    targetTransform: (order) => {
      if (!order.deliveryDate || !order.createdAt) return 3; // Default
      const deliveryDate = new Date(order.deliveryDate);
      const creationDate = new Date(order.createdAt);
      const diffTime = Math.abs(deliveryDate - creationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  },
  
  // Predict cancellation risk (0-1)
  cancellationRisk: {
    features: {
      totalAmount: { 
        path: 'totalAmount', 
        defaultValue: 0,
      },
      productCount: { 
        path: 'products', 
        transform: (products) => products?.length || 0,
        defaultValue: 0,
      },
      hasShippingAddress: { 
        path: 'shippingAddress', 
        transform: (address) => address ? 1 : 0,
        defaultValue: 0,
      },
      paymentMethodRisk: { 
        path: 'paymentMethod', 
        transform: (method) => {
          const riskScores = {
            'credit': 0.1,
            'paypal': 0.2,
            'crypto': 0.8,
            'bank_transfer': 0.5
          };
          return riskScores[method?.toLowerCase()] || 0.5;
        },
        defaultValue: 0.5,
      },
    },
    // Target is 1 for canceled, 0 for others
    targetField: 'status',
    targetTransform: (status) => status === 'Canceled' ? 1 : 0
  }
};

export const trainOrderModel = async (req, res) => {
  try {
    const { modelName, description, predictionType, customFeatures } = req.body;
    
    if (!predictionType && !customFeatures) {
      return res.status(400).json({ 
        message: 'Either predictionType or customFeatures must be provided' 
      });
    }
    
    // Get feature configuration
    let featureConfig;
    let targetField;
    let targetTransform;
    
    if (customFeatures) {
      // Use custom features if provided
      featureConfig = customFeatures.features;
      targetField = customFeatures.targetField;
      targetTransform = customFeatures.targetTransform;
    } else if (predictionConfigs[predictionType]) {
      // Use predefined configuration
      featureConfig = predictionConfigs[predictionType].features;
      targetField = predictionConfigs[predictionType].targetField;
      targetTransform = predictionConfigs[predictionType].targetTransform;
    } else {
      return res.status(400).json({ 
        message: `Unknown prediction type: ${predictionType}. Available types: ${Object.keys(predictionConfigs).join(', ')}` 
      });
    }

    // Retrieve orders from the database
    const orders = await Order.find({}).sort({ createdAt: 1 });

    if (orders.length < 10) {
      return res.status(400).json({ message: 'Need at least 10 orders for training' });
    }

    // Apply target transformation if available
    if (targetTransform) {
      orders.forEach(order => {
        order[targetField] = targetTransform(order);
      });
    }

    // Format the order data for training
    const formattedData = orderMLService.formatOrderData(orders, featureConfig, targetField);

    if (formattedData.length < 10) {
      return res.status(400).json({ 
        message: 'Need at least 10 valid orders with numerical data for training' 
      });
    }

    // Train the model
    const modelResults = await orderMLService.trainModel(formattedData, featureConfig);

    // Create and save the trained model
    const modelData = new Model({
      name: modelName,
      description,
      coefficients: modelResults.coefficients,
      intercept: modelResults.intercept,
      featureCount: modelResults.featureCount,
      accuracy: modelResults.accuracy,
      predictionType: predictionType || 'custom',
      featureConfig: featureConfig, // Save feature configuration
      updatedAt: new Date(),
    });

    await modelData.save();

    res.status(201).json({
      message: 'Order model trained successfully',
      modelInfo: {
        name: modelData.name,
        description: modelData.description,
        predictionType: predictionType || 'custom',
        accuracy: modelData.accuracy,
        featureCount: modelData.featureCount,
      },
    });
  } catch (error) {
    console.error("Error in trainOrderModel controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const predictForOrder = async (req, res) => {
  try {
    const { modelName, orderId } = req.body;
    
    if (!modelName) {
      return res.status(400).json({ message: 'Model name is required' });
    }
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const modelInfo = await Model.findOne({ name: modelName });
    if (!modelInfo) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make prediction
    const prediction = orderMLService.predict(modelInfo, order);

    res.json({
      prediction,
      model: modelName,
      orderId: orderId,
      predictionType: modelInfo.predictionType || 'custom'
    });
  } catch (error) {
    console.error("Error in predictForOrder controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const predictForOrderData = async (req, res) => {
  try {
    const { modelName, orderData } = req.body;
    
    if (!modelName) {
      return res.status(400).json({ message: 'Model name is required' });
    }
    
    if (!orderData) {
      return res.status(400).json({ message: 'Order data is required' });
    }

    const modelInfo = await Model.findOne({ name: modelName });
    if (!modelInfo) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Make prediction
    const prediction = orderMLService.predict(modelInfo, orderData);

    res.json({
      prediction,
      model: modelName,
      predictionType: modelInfo.predictionType || 'custom'
    });
  } catch (error) {
    console.error("Error in predictForOrderData controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderModels = async (req, res) => {
  try {
    const models = await Model.find({
      predictionType: { $exists: true }
    }).select('-coefficients -intercept -__v -featureConfig');
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrderModel = async (req, res) => {
  try {
    const { modelName } = req.params;
    
    const deletedModel = await Model.findOneAndDelete({ 
      name: modelName,
      predictionType: { $exists: true }
    });
    
    if (!deletedModel) {
      return res.status(404).json({ message: 'Order model not found' });
    }
    
    res.json({ message: 'Order model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};