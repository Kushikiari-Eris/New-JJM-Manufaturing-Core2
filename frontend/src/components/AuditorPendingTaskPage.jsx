import React, { useEffect, useState } from 'react';
import useAuditTaskStore from '../stores/auditTaskStore';
import { AnimatePresence, motion } from "framer-motion";

const AuditorPendingTaskPage = () => {
  const { fetchTasks, tasks, updateTask } = useAuditTaskStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page
  const [selectedTask, setSelectedTask] = useState(null);
  const [clickedTaskId, setClickedTaskId] = useState(null); 
  const [tasksToRemove, setTasksToRemove] = useState(new Set());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks to include only "Pending" status
  const pendingTasks = tasks.filter(task => task.status === "Pending");

  // Pagination calculations
  const totalPages = Math.ceil(pendingTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = pendingTasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStartTask = (taskId) => {
    setClickedTaskId(taskId);
    setTasksToRemove((prev) => new Set(prev).add(taskId));

    // Delay the actual update to allow animation to complete
    setTimeout(() => {
      updateTask(taskId, { status: "In Progress" });
      setTasksToRemove((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }, 400); // Delay task removal to match the animation duration
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
                Pending Tasks
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          {selectedTask ? (
            <>
              <h3 className="font-bold text-lg">{selectedTask.department}</h3>
              <p className="py-2">
                <span className="font-semibold">Tasks:</span>
              </p>
              <ul className="list-disc list-inside space-y-1">
                {Array.isArray(selectedTask.task) ? (
                  selectedTask.task.map((taskItem, index) => (
                    <li key={index}>{taskItem}</li>
                  ))
                ) : (
                  <li>{selectedTask.task}</li>
                )}
              </ul>
            </>
          ) : (
            <p>Loading task details...</p>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>

      <div className="bg-white rounded-lg mt-10">
        <h2 className="pt-4 px-4 font-bold text-2xl">Pending Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-8">
          <AnimatePresence mode="popLayout">
            {currentRequests.length > 0 && currentRequests.some((req) => !tasksToRemove.has(req._id)) ? (
              currentRequests.map((req) =>
                !tasksToRemove.has(req._id) ? (
                  <motion.div
                    layout
                    key={req._id}
                    className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      x: -100, // Slides out to the right
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="mb-2">
                      <span className="text-lg font-semibold text-gray-800 flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 me-2"></div>
                        {req.department}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{req.description}</p>
                    <div className="flex justify-between text-gray-500 text-xs mb-4">
                      <div>
                        <span className="font-semibold block">Task Added</span>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold block">Due Date</span>
                        {new Date(req.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-5">
                      <button
                        className="text-blue-500 text-sm font-semibold px-3 py-1 transition hover:bg-blue-100 rounded-lg"
                        onClick={() => handleStartTask(req._id)}
                      >
                        Start Task
                      </button>
                      <button
                        className="text-yellow-500 text-sm font-semibold px-3 py-1 transition hover:bg-yellow-100 rounded-lg"
                        onClick={() => {
                          setSelectedTask(req);
                          document.getElementById("my_modal_2").showModal();
                        }}
                      >
                        View Task
                      </button>
                    </div>
                  </motion.div>
                ) : null
              )
            ) : (
              <div className="col-span-full text-center text-gray-600 text-lg font-semibold">
                No tasks available
              </div>
            )}
          </AnimatePresence>
        </div>


        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center rounded-lg space-x-2 py-4 bg-white shadow-sm  px-4 sm:px-6">
          <button
            className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 "
            }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="flex overflow-x-auto gap-1 px-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700  hover:bg-gray-200 "
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 "
            }`}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AuditorPendingTaskPage;
