import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const ModelPerformanceChart = ({ models }) => {
  // Skip if no models
  if (!models || models.length === 0) {
    return (
      <div className="bg-gray-50 border rounded p-8 text-center text-gray-500">
        No models available to display performance metrics.
      </div>
    );
  }

  // Format data for chart
  const chartData = models.map(model => ({
    name: model.name.length > 15 ? model.name.substring(0, 15) + '...' : model.name,
    accuracy: parseFloat((model.accuracy * 100).toFixed(2)),
    type: model.predictionType,
    features: model.featureCount
  }));

  // Create color mapping for different prediction types
  const getBarColor = (type) => {
    switch(type) {
      case 'shippingFee': return '#3B82F6';
      case 'deliveryTime': return '#10B981';
      case 'cancellationRisk': return '#F59E0B';
      default: return '#6366F1';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Model Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'accuracy' ? `${value}%` : value, 
              name === 'accuracy' ? 'Accuracy' : name
            ]}
          />
          <Legend />
          <Bar 
            dataKey="accuracy" 
            name="Accuracy" 
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Model Types</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(models.map(m => m.predictionType))).map(type => (
            <div 
              key={type} 
              className="flex items-center px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${getBarColor(type)}20`, color: getBarColor(type) }}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: getBarColor(type) }}
              ></div>
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelPerformanceChart;