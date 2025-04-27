import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import useAuditStore from '../stores/useAuditStore';

const RecentAudits = () => {
  const { audits, isLoading, getAudits } = useAuditStore();

  useEffect(() => {
    getAudits();
  }, [getAudits]);

  if (isLoading) return <LoadingSpinner />;

  // Get the 5 most recent audits
  const recentAudits = [...audits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Audits</h3>
      {recentAudits.length === 0 ? (
        <p className="text-gray-500">No audits available.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {recentAudits.map(audit => (
            <li key={audit._id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <Link to={`/audits/${audit._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {audit.title}
                  </Link>
                  <p className="text-sm text-gray-500">Department: {audit.department.name}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                    audit.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {audit.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link to="/audits" className="text-blue-600 hover:text-blue-800 text-sm">
          View all audits →
        </Link>
      </div>
    </div>
  );
};

export default RecentAudits;