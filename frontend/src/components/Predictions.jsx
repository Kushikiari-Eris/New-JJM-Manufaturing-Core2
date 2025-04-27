import React, { useState, useEffect } from 'react';
import { predictiveService } from '../services/predictiveService';

const Predictions = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [features, setFeatures] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load models on component mount
  useEffect(() => {
    fetchModels();
  }, []);
  
  const fetchModels = async () => {
    try {
      const modelsList = await predictiveService.getModels();
      setModels(modelsList);
      
      // Select first model by default if available
      if (modelsList.length > 0 && !selectedModel) {
        setSelectedModel(modelsList[0].name);
      }
    } catch (error) {
      setError(`Failed to fetch models: ${error.message}`);
    }
  };
  
  const handlePredict = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setPrediction(null);
      
      // Parse features
      const featuresArray = features.split(',').map(f => parseFloat(f.trim()));
      
      // Validate
      if (featuresArray.some(isNaN)) {
        throw new Error('Features must be valid numbers separated by commas');
      }
      
      // Make prediction
      const result = await predictiveService.predict(selectedModel, featuresArray);
      setPrediction(result.prediction);
      
    } catch (error) {
      setError(`Prediction failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-3">Make Predictions</h3>
      
      {models.length === 0 ? (
        <div className="text-yellow-600 mb-3">
          No trained models available. Please train a model first.
        </div>
      ) : (
        <form onSubmit={handlePredict}>
          <div className="mb-3">
            <label className="block mb-1">
              Select Model:
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                {models.map(model => (
                  <option key={model._id} value={model.name}>
                    {model.name} ({model.description || 'No description'})
                  </option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">
              Features (comma separated):
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g. 1.2, 3.4, 5.6"
                required
              />
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Predicting...' : 'Make Prediction'}
          </button>
          
          {error && (
            <div className="mt-3 p-2 rounded bg-red-100 text-red-700">
              {error}
            </div>
          )}
          
          {prediction !== null && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold">Prediction Result:</h4>
              <div className="text-xl font-bold text-blue-700 mt-1">
                {prediction.toFixed(4)}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Predictions;