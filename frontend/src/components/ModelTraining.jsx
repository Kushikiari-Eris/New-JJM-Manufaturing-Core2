import React, { useState } from 'react';
import { predictiveService } from '../services/predictiveService';

const ModelTraining = ({ onModelTrained }) => {
  const [modelName, setModelName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');
      
      // Train model
      const result = await predictiveService.trainModel(modelName, description);
      
      setMessage(`Model "${modelName}" trained successfully with accuracy: ${(result.modelInfo.accuracy * 100).toFixed(2)}%`);
      
      // Notify parent component
      if (onModelTrained) onModelTrained();
      
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Train Predictive Model</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">
            Model Name:
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Training...' : 'Train Model'}
        </button>
        
        {message && (
          <div className={`mt-3 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ModelTraining;