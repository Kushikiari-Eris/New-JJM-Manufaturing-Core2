import { useEffect, useState } from 'react';
import useFindingStore from '../stores/useFindingStore';
import LoadingSpinner from './LoadingSpinner';

const FindingsChart = () => {
  const { findings, isLoading, getFindings } = useFindingStore();
  const [stats, setStats] = useState({
    high: 0,
    medium: 0,
    low: 0,
    open: 0,
    closed: 0
  });

  useEffect(() => {
    getFindings();
  }, [getFindings]);

  useEffect(() => {
    if (findings.length > 0) {
      const newStats = {
        high: findings.filter(f => f.severity === 'high').length,
        medium: findings.filter(f => f.severity === 'medium').length,
        low: findings.filter(f => f.severity === 'low').length,
        open: findings.filter(f => f.status === 'open').length,
        closed: findings.filter(f => f.status === 'closed').length
      };
      setStats(newStats);
    }
  }, [findings]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Findings Summary</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">By Severity</h4>
        <div className="flex h-4 mb-1">
          <div 
            className="bg-red-500" 
            style={{ width: `${(stats.high / findings.length) * 100}%` }}
          ></div>
          <div 
            className="bg-yellow-500" 
            style={{ width: `${(stats.medium / findings.length) * 100}%` }}
          ></div>
          <div 
            className="bg-blue-500" 
            style={{ width: `${(stats.low / findings.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex text-xs justify-between mt-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1"></div>
            <span>High: {stats.high}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
            <span>Medium: {stats.medium}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span>Low: {stats.low}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">By Status</h4>
        <div className="flex h-4 mb-1">
          <div 
            className="bg-red-400" 
            style={{ width: `${(stats.open / findings.length) * 100}%` }}
          ></div>
          <div 
            className="bg-green-400" 
            style={{ width: `${(stats.closed / findings.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex text-xs justify-between mt-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 mr-1"></div>
            <span>Open: {stats.open}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 mr-1"></div>
            <span>Closed: {stats.closed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindingsChart;