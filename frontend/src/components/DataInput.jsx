import React, { useState } from 'react';
import { predictiveService } from '../services/predictiveService';

const DataInput = ({ onDataAdded }) => {
  const [features, setFeatures] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');
      
      // Parse features from comma-separated string to array of numbers
      const featuresArray = features.split(',').map(f => parseFloat(f.trim()));
      
      // Validate
      if (featuresArray.some(isNaN)) {
        throw new Error('Features must be valid numbers separated by commas');
      }
      
      const labelValue = parseFloat(label);
      if (isNaN(labelValue)) {
        throw new Error('Label must be a valid number');
      }
      
      // Submit data point
      await predictiveService.addDataPoint(featuresArray, labelValue);
      
      // Clear form and show success message
      setFeatures('');
      setLabel('');
      setMessage('Data point added successfully!');
      
      // Notify parent component
      if (onDataAdded) onDataAdded();
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Add Training Data</h3>
      <form onSubmit={handleSubmit}>
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
        
        <div className="mb-3">
          <label className="block mb-1">
            Label (target value):
            <input
              type="number"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border rounded"
              step="any"
              required
            />
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Data Point'}
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

export default DataInput;