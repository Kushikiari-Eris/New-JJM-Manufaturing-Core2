// src/components/OrderPrediction/index.jsx
import React, { useState, useEffect } from 'react';
import axios from "../lib/axios";
import ModelList from './ModelList';
import ModelTrainings from './ModelTrainings';
import PredictionForm from './PredictionForm';

const OrderPrediction = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTab, setActiveTab] = useState('models');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/predictiveOrder/models');
      setModels(response.data);
    } catch (error) {
      showNotification(`Error loading models: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (modelName) => {
    if (!window.confirm(`Are you sure you want to delete model "${modelName}"?`)) return;
    
    setLoading(true);
    try {
      await axios.delete(`/predictiveOrder/models/${modelName}`);
      fetchModels();
      showNotification(`Model "${modelName}" deleted successfully`, 'success');
    } catch (error) {
      showNotification(`Error deleting model: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('/predictiveOrder/train', formData);
      fetchModels();
      setActiveTab('models');
      showNotification(`Model "${formData.modelName}" trained successfully!`, 'success');
      return response.data;
    } catch (error) {
      showNotification(`Error training model: ${error.response?.data?.message || error.message}`, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (data, type) => {
    setLoading(true);
    try {
      const endpoint = type === 'order' 
        ? '/predictiveOrder/predict/order'
        : '/predictiveOrder/predict/data';
        
      const response = await axios.post(endpoint, data);
      showNotification('Prediction generated successfully!', 'success');
      return response.data;
    } catch (error) {
      showNotification(`Error making prediction: ${error.response?.data?.message || error.message}`, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Prediction System</h1>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${
          notification.type === 'error' ? 'bg-red-100 text-red-700' :
          notification.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {notification.message}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'models' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Prediction Models
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'train' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('train')}
        >
          Train New Model
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'predict' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          Make Prediction
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Tab Content */}
      {activeTab === 'models' && (
        <ModelList 
          models={models}
          onDelete={handleDeleteModel}
          onSelect={(model) => {
            setSelectedModel(model);
            setActiveTab('predict');
          }}
          loading={loading}
        />
      )}
      
      {activeTab === 'train' && (
        <ModelTrainings onSubmit={handleTrainModel} />
      )}
      
      {activeTab === 'predict' && (
        <PredictionForm 
          models={models}
          selectedModel={selectedModel}
          onPredict={handlePredict}
        />
      )}
    </div>
  );
};

export default OrderPrediction;