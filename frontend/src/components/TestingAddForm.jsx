import React, { useState } from 'react'
import useTestingStore from '../stores/useTestingStore';

const TestingAddForm = () => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [assignedTo, setAssignedTo] = useState("");

  const { addTask } = useTestingStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Task title is required");

    await addTask(title, priority, assignedTo);
    setTitle("");
    setAssignedTo("");
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="p-4 border">
      <h2 className="text-xl font-bold">➕ Add New Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block border p-2 w-full mt-2"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        className="block border p-2 w-full mt-2"
      >
        <option value={1}>🔥 High</option>
        <option value={2}>⚡ Medium</option>
        <option value={3}>🛠️ Low</option>
      </select>
      <input
        type="text"
        placeholder="Assigned To (optional)"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="block border p-2 w-full mt-2"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Task
      </button>
    </form>
    </>
  )
}

export default TestingAddForm