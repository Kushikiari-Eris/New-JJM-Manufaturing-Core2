
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import TaskList from '../components/TaskList';
import RecentAudits from '../components/RecentAudits';
import FindingsChart from '../components/FindingsChart';
import LoadingSpinner from './LoadingSpinner';
import { useUserStore } from '../stores/useUserStore';
import { useEffect } from 'react';

const AuditDashboard = () => {
    const { user, checkAuth, loading } = useUserStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!loading && !checkAuth) {
        navigate('/login');
      }
    }, [checkAuth, loading, navigate]);
  
    if (loading) return <LoadingSpinner />;


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600">
          Here's an overview of your audit management system.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Open Audits" 
          value="12" 
          icon={<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>}
          color="border-blue-500"
          />
        <StatCard 
          title="Open Findings" 
          value="24" 
          icon={<svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
          color="border-red-500"
        />
        <StatCard 
          title="Pending Tasks" 
          value="8" 
          icon={<svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
          color="border-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAudits />
        </div>
        <div>
          <TaskList userId={user?._id} />
        </div>
      </div>
      
      <div className="mt-8">
        <FindingsChart />
      </div>
    </div>
  );
};

export default AuditDashboard;
