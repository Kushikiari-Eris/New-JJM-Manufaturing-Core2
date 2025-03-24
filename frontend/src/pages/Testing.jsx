import { useState, useEffect } from "react";
import { create } from "zustand";

// Zustand store for managing product execution tasks
const useExecutionStore = create((set) => ({
  tasks: [
    { id: 1, name: "Raw Material Processing", priority: "High", status: "Pending" },
    { id: 2, name: "Assembly", priority: "Medium", status: "Pending" },
    { id: 3, name: "Quality Inspection", priority: "Low", status: "Pending" },
    { id: 4, name: "Packaging", priority: "Low", status: "Pending" },
  ],
  updateTaskPriority: (id, newPriority) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, priority: newPriority } : task
      ),
    })),
  updateTaskStatus: (id, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      ),
    })),
  autoPrioritize: () =>
    set((state) => ({
      tasks: state.tasks
        .map((task) => {
          // If assembly is not started, raw material processing becomes high priority
          if (task.name === "Raw Material Processing" && task.status === "Pending") {
            return { ...task, priority: "High" };
          }
          // Inspection becomes high priority if assembly is completed
          if (task.name === "Quality Inspection" && state.tasks.some(t => t.name === "Assembly" && t.status === "Completed")) {
            return { ...task, priority: "High" };
          }
          return task;
        })
        .sort((a, b) => (a.priority === "High" ? -1 : b.priority === "High" ? 1 : 0)),
    })),
}));

const ExecutionDashboard = () => {
  const { tasks, updateTaskPriority, updateTaskStatus, autoPrioritize } = useExecutionStore();
  const [selectedWorker, setSelectedWorker] = useState({});

  useEffect(() => {
    // Auto-prioritize tasks every 5 seconds
    const interval = setInterval(() => autoPrioritize(), 5000);
    return () => clearInterval(interval);
  }, [autoPrioritize]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ Product Execution Dashboard</h1>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-3 my-2 border rounded-lg ${
              task.priority === "High" ? "bg-red-200" : task.priority === "Medium" ? "bg-yellow-200" : "bg-green-200"
            }`}
          >
            <p className="font-semibold">{task.name}</p>
            <p>Priority: <span className="font-bold">{task.priority}</span></p>
            <p>Status: <span className="font-bold">{task.status}</span></p>

            {/* Assign Worker */}
            <select
              className="mt-2 p-1 border rounded"
              value={selectedWorker[task.id] || ""}
              onChange={(e) => setSelectedWorker({ ...selectedWorker, [task.id]: e.target.value })}
            >
              <option value="">Assign Worker</option>
              <option value="John">John</option>
              <option value="Maria">Maria</option>
              <option value="Steve">Steve</option>
            </select>

            {/* Task Status Update */}
            <button
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => updateTaskStatus(task.id, "In Progress")}
            >
              Start
            </button>
            <button
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => updateTaskStatus(task.id, "Completed")}
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExecutionDashboard;
