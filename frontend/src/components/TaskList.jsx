import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import useTaskStore from '../stores/useTaskStore';
import { useEffect } from 'react';


const TaskList = ({ userId }) => {
  const { userTasks, isLoading, getTasksByUser } = useTaskStore();

  useEffect(() => {
    getTasksByUser(userId);
  }, [getTasksByUser, userId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">My Tasks</h3>
      {userTasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {userTasks.map(task => (
            <li key={task._id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <Link to={`/tasks/${task._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {task.title}
                  </Link>
                  <p className="text-sm text-gray-500">{task.description.substring(0, 50)}...</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm">
          View all tasks →
        </Link>
      </div>
    </div>
  );
};

export default TaskList;