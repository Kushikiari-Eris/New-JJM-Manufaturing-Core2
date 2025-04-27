import { DataPoint, Model } from '../models/predictive.model.js';
import mlService from '../services/mlService.js';

export const addDataPoint = async (req, res) => {
  try {
    const { features, label } = req.body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({ message: 'Features must be a non-empty array' });
    }

    const dataPoint = new DataPoint({
      features,
      label,
    });

    await dataPoint.save();
    res.status(201).json(dataPoint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trainModel = async (req, res) => {
    try {
      const { modelName, description } = req.body;
  
      // Retrieve all data points from the database
      const data = await DataPoint.find({}).sort({ timestamp: 1 });
  
      if (data.length < 10) {
        return res.status(400).json({ message: 'Need at least 10 data points for training' });
      }
  
      // Debug: Print the data retrieved from the database
      console.log("Data from database:", data);
  
      // Format the data to be a 2D array for features and labels separately
      const formattedData = data.map(item => ({
        features: item.features,  // this is an array of numbers
        label: item.label,        // this is a single number
      }));
  
      // Debug: Print the formatted data
      console.log("Formatted Data:", formattedData);
  
      // Extract features and labels into separate arrays
      const features = formattedData.map(item => item.features);  // 2D array of features
      const labels = formattedData.map(item => item.label);      // 1D array of labels
  
      // Debug: Print features and labels separately
      console.log("Features (2D array):", features);
      console.log("Labels (1D array):", labels);
  
      // Train the model with the normalized data
      const { coefficients, intercept, accuracy, featureCount } = mlService.trainModel(formattedData);
  
      // Debug: Print the model results
      console.log("Trained Model:", { coefficients, intercept, accuracy, featureCount });
  
      // Create and save the trained model
      const modelData = new Model({
        name: modelName,
        description,
        coefficients,
        intercept,
        featureCount,
        accuracy,
        updatedAt: new Date(),
      });
  
      await modelData.save();
  
      // Send response with model details
      res.status(201).json({
        message: 'Model trained successfully',
        modelInfo: {
          name: modelData.name,
          description: modelData.description,
          accuracy: modelData.accuracy,
          featureCount: modelData.featureCount,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  

export const predict = async (req, res) => {
  try {
    const { modelName, features } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ message: 'Features must be an array' });
    }

    const modelInfo = await Model.findOne({ name: modelName });
    if (!modelInfo) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (features.length !== modelInfo.featureCount) {
      return res.status(400).json({
        message: `This model expects ${modelInfo.featureCount} features, but received ${features.length}`,
      });
    }

    const prediction = mlService.predict(modelInfo, features);

    res.json({
      prediction,
      model: modelName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModels = async (req, res) => {
  try {
    const models = await Model.find({}).select('-coefficients -intercept -__v');
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDataPoints = async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const dataPoints = await DataPoint.find({})
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');
    res.json(dataPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
