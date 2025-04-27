// src/components/OrderPrediction/ModelTraining.jsx
import React, { useState } from 'react';

const ModelTrainings = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    predictionType: 'shippingFee', // Default value
    customFeatures: null
  });
  
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customFeaturesText, setCustomFeaturesText] = useState('');
  const [trainResults, setTrainResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const predictionTypes = [
    { value: 'shippingFee', label: 'Shipping Fee Prediction' },
    { value: 'deliveryTime', label: 'Delivery Time Prediction' },
    { value: 'cancellationRisk', label: 'Cancellation Risk Prediction' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCustomFeaturesChange = (e) => {
    setCustomFeaturesText(e.target.value);
  };

  const parseCustomFeatures = (text) => {
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      setError('Invalid JSON format for custom features');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTrainResults(null);
    
    let dataToSubmit = { ...formData };
    
    if (advancedMode && customFeaturesText) {
      const parsedFeatures = parseCustomFeatures(customFeaturesText);
      if (!parsedFeatures) return;
      dataToSubmit.customFeatures = parsedFeatures;
      delete dataToSubmit.predictionType; // Don't send both
    } else {
      delete dataToSubmit.customFeatures;
    }
    
    setIsSubmitting(true);
    try {
      const result = await onSubmit(dataToSubmit);
      setTrainResults(result);
      
      // Reset form on success
      if (!advancedMode) {
        setFormData({
          modelName: '',
          description: '',
          predictionType: 'shippingFee'
        });
      }
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Train New Prediction Model</h2>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4 flex justify-end">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={advancedMode}
              onChange={() => setAdvancedMode(!advancedMode)}
            />
            <span className="ml-2 text-gray-700">Advanced Mode</span>
          </label>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., shipping-fee-predictor-v1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief description of this model"
              />
            </div>

            {!advancedMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prediction Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="predictionType"
                  value={formData.predictionType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {predictionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <div className="mt-4 bg-blue-50 p-4 rounded text-sm">
                  <h3 className="font-medium text-blue-800 mb-2">About this prediction type:</h3>
                  {formData.predictionType === 'shippingFee' && (
                    <p>This model predicts shipping fees based on order details including total amount, product count, quantity, postal code, and whether the shipping is international.</p>
                  )}
                  {formData.predictionType === 'deliveryTime' && (
                    <p>This model predicts delivery time in days based on order details including total amount, product count, quantity, shipping method, and whether the shipping is international.</p>
                  )}
                  {formData.predictionType === 'cancellationRisk' && (
                    <p>This model predicts the risk of order cancellation (0-1) based on total amount, product count, whether there's a shipping address, and payment method risk factors.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Custom Features Configuration <span className="text-red-500">*</span>
                  <span className="ml-1 text-sm text-gray-500">(JSON Format)</span>
                </label>
                <textarea
                  value={customFeaturesText}
                  onChange={handleCustomFeaturesChange}
                  rows="10"
                  className="mt-1 block w-full font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder='{"features": {...}, "targetField": "yourTarget"}'
                  required={advancedMode}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Define your custom features and target field in JSON format.
                </p>
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
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Training...' : 'Train Model'}
            </button>
          </div>
        </form>
        
        {trainResults && (
          <div className="mt-6 bg-green-50 p-4 rounded">
            <h3 className="text-lg font-medium text-green-800 mb-2">Training Successful!</h3>
            <div className="text-sm">
              <p><span className="font-medium">Model Name:</span> {trainResults.modelInfo.name}</p>
              <p><span className="font-medium">Prediction Type:</span> {trainResults.modelInfo.predictionType}</p>
              <p><span className="font-medium">Accuracy:</span> {(trainResults.modelInfo.accuracy * 100).toFixed(2)}%</p>
              <p><span className="font-medium">Feature Count:</span> {trainResults.modelInfo.featureCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTrainings;