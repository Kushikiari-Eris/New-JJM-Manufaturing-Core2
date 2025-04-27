import React, { useEffect, useState } from "react";
import useScheduleStore from "../stores/useScheduleStore";

const SchedulerComponent = ({ userId }) => {
  const {
    generateAiSchedule,
    saveAiSchedule,
    aiSuggestedSchedule,
    isAiSaved,
    getAllData,
    schedules,
  } = useScheduleStore();

  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust as needed
  const [paginatedRequests, setPaginatedRequests] = useState([]);

  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch data immediately when the component mounts
  useEffect(() => {
    getAllData();
  }, []);

  // Update paginatedRequests whenever schedules or currentPage changes
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);
    setPaginatedRequests(currentItems);
  }, [schedules, currentPage]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const task = { taskName, deadline, priority };
    const response = await generateAiSchedule(task);

    if (!response) {
      setError("Failed to generate schedule.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!aiSuggestedSchedule) return;
    setLoading(true);

    const savedSchedule = await saveAiSchedule(userId);
    if (!savedSchedule) {
      setError("Failed to save schedule.");
    } else {
      getAllData(); // Fetch latest data immediately after saving
    }

    setLoading(false);
  };

  return (
    <>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">
                Smart Scheduling
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap justify-center items-start min-h-screen p-6 mt-5 gap-6">  
        {/* Form Container */}
        <div className="w-full sm:w-1/2 max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleGenerate} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 text-center">AI Task Scheduler</h2>

            {/* Task Name Input */}
            {/* Task Name Input */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Task Name</label>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Deadline Input */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate AI Schedule"}
            </button>

            {/* AI Suggested Schedule Section */}
            {aiSuggestedSchedule && (
              <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
                <h3 className="text-lg font-semibold text-gray-700">AI Suggested Schedule:</h3>
                <p className="text-gray-600">
                  <strong>Scheduled Time:</strong> {new Date(aiSuggestedSchedule.scheduledTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Reasoning:</strong> {aiSuggestedSchedule.reasoning}
                </p>

                {!isAiSaved ? (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-3 bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400"
                  >
                    {loading ? "Saving..." : "Save AI Schedule"}
                  </button>
                ) : (
                  <p className="text-green-600 font-semibold mt-2">Schedule Saved!</p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        </div>

        {/* Additional Section (Side by Side) */}
        <div className="w-full sm:w-2/3 max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between p-4 space-y-2 md:space-y-0">
            <h2 className="font-semibold text-xl">Scheduled</h2>

            {/* Search Bar */}
            <div className="relative">
              <label htmlFor="table-search" className="sr-only">Search</label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="table-search" 
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-64 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Search tasks..." 
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Task Name</th>
                  <th className="px-6 py-3">Scheduled Date</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((record) => (
                  <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{record.taskName}</td>
                    <td className="px-6 py-4">{new Date(record.scheduledTime).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{record.priority}</td>
                    <td className="px-6 py-4">{new Date(record.deadline).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 py-4 bg-white">
            {/* Prev Button */}
            <button
              className={`px-4 py-2 rounded-md text-gray-600 transition-all duration-300 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1 overflow-x-auto px-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              className={`px-4 py-2 rounded-md text-gray-600 transition-all duration-300 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </>
  );
};

export default SchedulerComponent;
