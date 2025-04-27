// src/components/OrderPrediction/PredictionForm.jsx
import React, { useState, useEffect } from 'react';

const PredictionForm = ({ models, selectedModel, onPredict }) => {
  const [formData, setFormData] = useState({
    modelName: selectedModel?.name || '',
    orderId: '',
    orderData: '',
    predictType: 'order' // 'order' or 'data'
  });
  
  const [prediction, setPrediction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Update form when selected model changes
  useEffect(() => {
    if (selectedModel) {
      setFormData(prev => ({
        ...prev,
        modelName: selectedModel.name
      }));
    }
  }, [selectedModel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePredictTypeChange = (e) => {
    setFormData({
      ...formData,
      predictType: e.target.value,
      orderId: '',
      orderData: ''
    });
  };

  const validateOrderData = (data) => {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      setError('Invalid JSON format for order data');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    
    // Validate data if using raw JSON
    if (formData.predictType === 'data' && !validateOrderData(formData.orderData)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      let dataToSubmit;
      
      if (formData.predictType === 'order') {
        dataToSubmit = {
          modelName: formData.modelName,
          orderId: formData.orderId
        };
      } else {
        dataToSubmit = {
          modelName: formData.modelName,
          orderData: JSON.parse(formData.orderData)
        };
      }
      
      const result = await onPredict(dataToSubmit, formData.predictType);
      setPrediction(result);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the current model details
  const currentModel = models.find(m => m.name === formData.modelName);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Make a Prediction</h2>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Model <span className="text-red-500">*</span>
              </label>
              <select
                name="modelName"
                value={formData.modelName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model._id} value={model.name}>
                    {model.name} ({model.predictionType})
                  </option>
                ))}
              </select>
            </div>

            {currentModel && (
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium text-blue-800">Selected Model Details:</h3>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">Type:</span> {currentModel.predictionType}</p>
                  <p><span className="font-medium">Accuracy:</span> {(currentModel.accuracy * 100).toFixed(2)}%</p>
                  <p><span className="font-medium">Feature Count:</span> {currentModel.featureCount}</p>
                  {currentModel.description && (
                    <p><span className="font-medium">Description:</span> {currentModel.description}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Input Type <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="input-order"
                    name="inputType"
                    type="radio"
                    value="order"
                    checked={formData.predictType === 'order'}
                    onChange={handlePredictTypeChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="input-order" className="ml-3 block text-sm font-medium text-gray-700">
                    Existing Order ID
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="input-data"
                    name="inputType"
                    type="radio"
                    value="data"
                    checked={formData.predictType === 'data'}
                    onChange={handlePredictTypeChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="input-data" className="ml-3 block text-sm font-medium text-gray-700">
                    Custom Order Data (JSON)
                  </label>
                </div>
              </div>
            </div>

            {formData.predictType === 'order' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 6437f63a1234567890abcdef"
                  required={formData.predictType === 'order'}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order JSON Data <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="orderData"
                  value={formData.orderData}
                  onChange={handleInputChange}
                  rows="10"
                  className="mt-1 block w-full font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`{
  "totalAmount": 150.00,
  "products": [
    { "id": "prod123", "quantity": 2 },
    { "id": "prod456", "quantity": 1 }
  ],
  "shippingAddress": {
    "postal_code": "94103",
    "country": "US"
  },
  "shippingMethod": "standard",
  "paymentMethod": "credit"
}`}
                  required={formData.predictType === 'data'}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 p-3 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting || !formData.modelName}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (isSubmitting || !formData.modelName) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Predicting...' : 'Generate Prediction'}
            </button>
          </div>
        </form>
        
        {prediction && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Prediction Result</h3>
            <div className="bg-white border rounded p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700">Model:</span>
                  <span className="text-gray-900">{prediction.model}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">Type:</span>
                  <span className="text-gray-900">{prediction.predictionType}</span>
                </div>
                {prediction.orderId && (
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Order ID:</span>
                    <span className="text-gray-900">{prediction.orderId}</span>
                  </div>
                )}
                <div>
                  <span className="block text-sm font-medium text-gray-700">Result:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(() => {
                      // Format based on prediction type
                      if (prediction.predictionType === 'shippingFee') {
                        return `$${prediction.prediction.toFixed(2)}`;
                      } else if (prediction.predictionType === 'deliveryTime') {
                        const days = Math.round(prediction.prediction);
                        return `${days} day${days !== 1 ? 's' : ''}`;
                      } else if (prediction.predictionType === 'cancellationRisk') {
                        return `${(prediction.prediction * 100).toFixed(1)}% risk`;
                      } else {
                        return prediction.prediction.toFixed(2);
                      }
                    })()}
                  </span>
                </div>
              </div>
              
              {prediction.predictionType === 'cancellationRisk' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        prediction.prediction < 0.3 ? 'bg-green-600' : 
                        prediction.prediction < 0.7 ? 'bg-yellow-500' : 'bg-red-600'
                      }`} 
                      style={{ width: `${prediction.prediction * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Low Risk</span>
                    <span>Medium Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;