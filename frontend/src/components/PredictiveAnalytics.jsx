import React, { useState } from 'react';
import DataInput from '../components/DataInput';
import ModelTraining from '../components/ModelTraining';
import Predictions from '../components/Predictions';
import DataTable from '../components/DataTable';

const PredictiveAnalytics = () => {
    const [refreshKey, setRefreshKey] = useState(0);
  
    // Callback to refresh components when data is added
    const handleDataAdded = () => {
      setRefreshKey(prevKey => prevKey + 1);
    };
    
    // Callback to refresh components when model is trained
    const handleModelTrained = () => {
      setRefreshKey(prevKey => prevKey + 1);
    };
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Predictive Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataInput onDataAdded={handleDataAdded} />
          <DataTable key={`table-${refreshKey}`} />
        </div>
        
        <div>
          <ModelTraining onModelTrained={handleModelTrained} />
          <Predictions key={`predictions-${refreshKey}`} />
        </div>
      </div>
    </div>
  )
}

export default PredictiveAnalytics