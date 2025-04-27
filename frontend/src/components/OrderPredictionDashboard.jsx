// src/components/OrderPrediction/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModelPerformanceChart from './ModelPerformanceChart';
import orderPredictionService from '../services/orderPredictionService';

const OrderPredictionDashboard = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelData = await orderPredictionService.getModels();
        setModels(modelData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded text-red-700">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  // Calculate stats from models
  const stats = {
    totalModels: models.length,
    averageAccuracy: models.length > 0 
      ? models.reduce((sum, model) => sum + model.accuracy, 0) / models.length
      : 0,
    modelsByType: models.reduce((acc, model) => {
      const type = model.predictionType || 'custom';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Models</h3>
          <div className="text-3xl font-bold">{stats.totalModels}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Average Accuracy</h3>
          <div className="text-3xl font-bold">
            {(stats.averageAccuracy * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Model Types</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(stats.modelsByType).map(([type, count]) => (
              <div 
                key={type}
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  type === 'shippingFee' ? 'bg-blue-100 text-blue-800' :
                  type === 'deliveryTime' ? 'bg-green-100 text-green-800' :
                  type === 'cancellationRisk' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}
              >
                {type} ({count})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ModelPerformanceChart models={models} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Models</h3>
          
          {models.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No models available. Train your first model!
            </p>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 5)
                    .map((model) => (
                    <tr key={model._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {model.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          model.predictionType === 'shippingFee' ? 'bg-blue-100 text-blue-800' :
                          model.predictionType === 'deliveryTime' ? 'bg-green-100 text-green-800' :
                          model.predictionType === 'cancellationRisk' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {model.predictionType || "custom"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(model.updatedAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                        <Link
                          to={`/prediction?model=${model.name}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Use
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {models.length > 5 && (
                <div className="px-4 py-3 bg-gray-50 text-right">
                  <Link to="/prediction/models" className="text-sm text-blue-600 hover:text-blue-900">
                    View all models →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPredictionDashboard;