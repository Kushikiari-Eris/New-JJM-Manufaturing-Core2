import { MultivariateLinearRegression as MLR } from 'ml-regression';
import { Matrix } from 'ml-matrix';

class OrderMLService {
  /**
   * Extracts numerical features from order objects based on specified feature mappings
   * @param {Array} orders - Array of order objects
   * @param {Object} featureConfig - Configuration defining which fields to use as features
   * @param {String} targetField - Field to use as prediction target
   * @returns {Array} - Formatted data for ML training
   */
  formatOrderData(orders, featureConfig, targetField) {
    return orders.map(order => {
      // Extract features based on configuration
      const features = [];
      
      // Process each feature config
      for (const featureKey in featureConfig) {
        const config = featureConfig[featureKey];
        let value = null;
        
        // Handle nested paths (e.g., 'shippingAddress.country')
        if (config.path.includes('.')) {
          const parts = config.path.split('.');
          let current = order;
          for (const part of parts) {
            if (current && current[part] !== undefined) {
              current = current[part];
            } else {
              current = null;
              break;
            }
          }
          value = current;
        } else {
          // Direct path
          value = order[config.path];
        }
        
        // Apply transformation function if provided
        if (config.transform && typeof config.transform === 'function') {
          value = config.transform(value, order);
        }
        
        // Apply default value if null/undefined
        if (value === null || value === undefined) {
          value = config.defaultValue !== undefined ? config.defaultValue : 0;
        }
        
        // Convert to number if needed
        if (typeof value !== 'number') {
          value = parseFloat(value) || config.defaultValue || 0;
        }
        
        features.push(value);
      }
      
      // Extract the target value
      let targetValue = null;
      
      // Handle nested target paths
      if (targetField.includes('.')) {
        const parts = targetField.split('.');
        let current = order;
        for (const part of parts) {
          if (current && current[part] !== undefined) {
            current = current[part];
          } else {
            current = null;
            break;
          }
        }
        targetValue = current;
      } else {
        targetValue = order[targetField];
      }
      
      // Convert target to number if needed
      if (typeof targetValue !== 'number') {
        targetValue = parseFloat(targetValue) || 0;
      }
      
      return {
        features,
        label: targetValue,
        orderId: order._id // Include order ID for reference
      };
    }).filter(item => {
      // Filter out items with NaN values
      return !isNaN(item.label) && item.features.every(f => !isNaN(f));
    });
  }
  
  // Normalize data to improve training
  normalizeData(data) {
    const features = data.map(item => item.features);
    const labels = data.map(item => item.label);
    
    // Find min and max for each feature dimension
    const numFeatures = features[0].length;
    const mins = new Array(numFeatures).fill(Infinity);
    const maxs = new Array(numFeatures).fill(-Infinity);
    
    for (const featureSet of features) {
      for (let i = 0; i < numFeatures; i++) {
        mins[i] = Math.min(mins[i], featureSet[i]);
        maxs[i] = Math.max(maxs[i], featureSet[i]);
      }
    }
    
    // Normalize features to [0,1] range
    const normalizedFeatures = features.map(featureSet => {
      return featureSet.map((val, i) => {
        return (maxs[i] === mins[i]) ? 0 : (val - mins[i]) / (maxs[i] - mins[i]);
      });
    });
    
    return {
      features: normalizedFeatures,
      labels,
      mins,
      maxs,
    };
  }
  
  // Split data into training and test sets
  splitData(features, labels, testRatio = 0.2) {
    const numSamples = features.length;
    const testSize = Math.round(numSamples * testRatio);
    const trainSize = numSamples - testSize;
    
    // Shuffle the data
    const indices = Array.from({ length: numSamples }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    
    const trainFeatures = [];
    const trainLabels = [];
    const testFeatures = [];
    const testLabels = [];
    
    indices.forEach((index, i) => {
      if (i < trainSize) {
        trainFeatures.push(features[index]);
        trainLabels.push(labels[index]);
      } else {
        testFeatures.push(features[index]);
        testLabels.push(labels[index]);
      }
    });
    
    return {
      trainFeatures,
      trainLabels,
      testFeatures,
      testLabels
    };
  }
  
  // Train a multivariate linear regression model
  trainModel(data, featureConfig) {
    console.log("Starting order model training with data points:", data.length);
    
    // Process data
    const { features, labels } = this.normalizeData(data);
    const { trainFeatures, trainLabels, testFeatures, testLabels } = 
      this.splitData(features, labels);
    
    try {
      // First attempt: Use Matrix objects and manual training
      console.log("Attempting training with Matrix objects...");
      
      const X = new Matrix(trainFeatures);
      const y = Matrix.columnVector(trainLabels);
      
      // Create and train the model
      const regression = MLR.load({
        name: 'MultivariateLinearRegression',
        weights: Matrix.zeros(trainFeatures[0].length, 1),
        intercept: 0,
        statistics: {}
      });
      
      regression.train(X, y);
      
      // Calculate model metrics
      const coefficients = regression.weights.to1DArray();
      const intercept = regression.intercept;
      
      // Calculate accuracy using test data
      let accuracy = 0;
      if (testFeatures.length > 0) {
        const predictions = testFeatures.map(f => this._predictSingle(coefficients, intercept, f));
        
        // Calculate accuracy (1 - normalized mean squared error)
        let mse = 0;
        for (let i = 0; i < predictions.length; i++) {
          mse += Math.pow(predictions[i] - testLabels[i], 2);
        }
        mse /= predictions.length;
        
        // Calculate range of labels for normalization
        const minLabel = Math.min(...labels);
        const maxLabel = Math.max(...labels);
        const range = maxLabel - minLabel || 1; // Avoid division by zero
        
        // Normalize MSE to get accuracy
        const normalizedMSE = mse / (range * range);
        accuracy = 1 - Math.min(1, normalizedMSE);
      }
      
      console.log("Training successful. Order model metrics:", {
        coefficients: coefficients.slice(0, 3) + (coefficients.length > 3 ? '...' : ''),
        intercept,
        accuracy,
        featureCount: trainFeatures[0].length
      });
      
      return { 
        coefficients, 
        intercept, 
        accuracy,
        featureCount: trainFeatures[0].length,
        featureConfig: featureConfig // Save feature configuration
      };
    } catch (err) {
      console.error("Error in primary training approach:", err);
      
      // Fallback approach if the above method fails
      try {
        console.log("Trying alternative approach with direct MLR constructor...");
        
        // Try direct constructor approach
        const regression = new MLR(trainFeatures, trainLabels);
        
        // Get model coefficients
        const coefficients = Array.isArray(regression.weights) ? 
          regression.weights : 
          regression.weights.to1DArray ? 
            regression.weights.to1DArray() : 
            regression.weights;
            
        const intercept = regression.intercept;
        
        // Calculate accuracy
        let accuracy = 0;
        if (testFeatures.length > 0) {
          const predictions = testFeatures.map(f => this._predictSingle(coefficients, intercept, f));
          
          // Calculate mean squared error
          let mse = 0;
          for (let i = 0; i < predictions.length; i++) {
            mse += Math.pow(predictions[i] - testLabels[i], 2);
          }
          mse /= predictions.length;
          
          // Calculate range of labels for normalization
          const minLabel = Math.min(...labels);
          const maxLabel = Math.max(...labels);
          const range = maxLabel - minLabel || 1; // Avoid division by zero
          
          // Normalize MSE to get accuracy
          const normalizedMSE = mse / (range * range);
          accuracy = 1 - Math.min(1, normalizedMSE);
        }
        
        console.log("Alternative approach successful. Order model metrics:", {
          intercept,
          accuracy,
          featureCount: trainFeatures[0].length
        });
        
        return { 
          coefficients, 
          intercept, 
          accuracy,
          featureCount: trainFeatures[0].length,
          featureConfig: featureConfig // Save feature configuration
        };
      } catch (fallbackErr) {
        console.error("Fallback approach also failed:", fallbackErr);
        
        // Last resort: implement a simple linear regression manually
        console.log("Implementing manual regression as last resort");
        
        // Calculate means
        const xMeans = [];
        for (let i = 0; i < trainFeatures[0].length; i++) {
          xMeans[i] = trainFeatures.reduce((sum, x) => sum + x[i], 0) / trainFeatures.length;
        }
        const yMean = trainLabels.reduce((sum, y) => sum + y, 0) / trainLabels.length;
        
        // Calculate coefficients
        const coefficients = new Array(trainFeatures[0].length).fill(0);
        
        for (let i = 0; i < coefficients.length; i++) {
          let numerator = 0;
          let denominator = 0;
          
          for (let j = 0; j < trainFeatures.length; j++) {
            numerator += (trainFeatures[j][i] - xMeans[i]) * (trainLabels[j] - yMean);
            denominator += Math.pow(trainFeatures[j][i] - xMeans[i], 2);
          }
          
          coefficients[i] = denominator !== 0 ? numerator / denominator : 0;
        }
        
        // Calculate intercept
        const intercept = yMean - coefficients.reduce((sum, coef, i) => sum + coef * xMeans[i], 0);
        
        // Calculate accuracy on test data
        let accuracy = 0;
        if (testFeatures.length > 0) {
          const predictions = testFeatures.map(f => this._predictSingle(coefficients, intercept, f));
          
          // Calculate mean squared error
          let mse = 0;
          for (let i = 0; i < predictions.length; i++) {
            mse += Math.pow(predictions[i] - testLabels[i], 2);
          }
          mse /= predictions.length;
          
          // Calculate range of labels for normalization
          const minLabel = Math.min(...labels);
          const maxLabel = Math.max(...labels);
          const range = maxLabel - minLabel || 1; // Avoid division by zero
          
          // Normalize MSE to get accuracy
          const normalizedMSE = mse / (range * range);
          accuracy = 1 - Math.min(1, normalizedMSE);
        }
        
        console.log("Manual regression successful. Order model metrics:", {
          intercept,
          accuracy,
          featureCount: trainFeatures[0].length
        });
        
        return {
          coefficients,
          intercept,
          accuracy,
          featureCount: trainFeatures[0].length,
          featureConfig: featureConfig // Save feature configuration
        };
      }
    }
  }
  
  // Helper method for prediction
  _predictSingle(coefficients, intercept, features) {
    let prediction = intercept;
    for (let i = 0; i < features.length; i++) {
      prediction += features[i] * coefficients[i];
    }
    return prediction;
  }
  
  // Make prediction with a trained model
  predict(modelData, orderData) {
    try {
      // Extract features from the order using the model's feature config
      const featureConfig = modelData.featureConfig;
      const features = [];
      
      // Process each feature config
      for (const featureKey in featureConfig) {
        const config = featureConfig[featureKey];
        let value = null;
        
        // Handle nested paths (e.g., 'shippingAddress.country')
        if (config.path.includes('.')) {
          const parts = config.path.split('.');
          let current = orderData;
          for (const part of parts) {
            if (current && current[part] !== undefined) {
              current = current[part];
            } else {
              current = null;
              break;
            }
          }
          value = current;
        } else {
          // Direct path
          value = orderData[config.path];
        }
        
        // Apply transformation function if provided
        if (config.transform && typeof config.transform === 'function') {
          value = config.transform(value, orderData);
        }
        
        // Apply default value if null/undefined
        if (value === null || value === undefined) {
          value = config.defaultValue !== undefined ? config.defaultValue : 0;
        }
        
        // Convert to number if needed
        if (typeof value !== 'number') {
          value = parseFloat(value) || config.defaultValue || 0;
        }
        
        features.push(value);
      }
      
      return this._predictSingle(modelData.coefficients, modelData.intercept, features);
    } catch (err) {
      console.error("Error in order prediction:", err);
      throw new Error(`Failed to make order prediction: ${err.message}`);
    }
  }
}

export default new OrderMLService();