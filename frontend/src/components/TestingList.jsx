import React, { useEffect } from 'react'
import useTestingStore from '../stores/useTestingStore';
import { useSocket } from '../context/SocketContext';

const TestingList = () => {
    const { tasks, fetchTasks, updateTaskStatus, listenForUpdates } = useTestingStore();
    const socket = useSocket();

    useEffect(() => {
        fetchTasks();
        listenForUpdates(socket); // Start listening for real-time updates
    }, [socket]);
  return (
   <>
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="p-2 border-b">
            <div>
              <strong>{task.title}</strong> (Priority: {task.priority})
            </div>
            <div>Status: {task.status}</div>
            {task.status !== "Completed" && (
              <button
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
                onClick={() => updateTaskStatus(task._id, "Completed")}
              >
                ✅ Mark as Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
   </>
  )
}

export default TestingList