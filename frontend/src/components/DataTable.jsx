import React, { useState, useEffect } from 'react';
import { predictiveService } from '../services/predictiveService';

const DataTable = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await predictiveService.getDataPoints(50);
      setDataPoints(data);
    } catch (error) {
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Format timestamp for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading data...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  
  if (dataPoints.length === 0) {
    return <div className="p-4 text-center">No data points available yet.</div>;
  }
  
  return (
    <div className="card p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Training Data Overview</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Features</th>
              <th className="px-4 py-2 border-b">Label</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((point, index) => (
              <tr key={point._id || index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 border-b">{formatDate(point.timestamp)}</td>
                <td className="px-4 py-2 border-b">[{point.features.join(', ')}]</td>
                <td className="px-4 py-2 border-b">{point.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        Showing most recent {dataPoints.length} data points
      </div>
    </div>
  );
};

export default DataTable;