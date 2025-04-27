import React, { useState, useEffect } from "react";
import useAuditTaskStore from "../stores/auditTaskStore";

const AuditCompletedTasks = () => {
  const { fetchTasks, tasks } = useAuditTaskStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks to include only "Completed" status
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  // Pagination calculations
  const totalPages = Math.ceil(completedTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = completedTasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">Completed Tasks</span>
            </div>
          </li>
        </ol>
      </nav>

{/* Modal for Viewing Task Details */}
<dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    {selectedTask ? (
      <>
        <h3 className="font-bold text-lg">{selectedTask.department}</h3>
        <p className="py-2">
          <span className="font-semibold">Description:</span> {selectedTask.description}
        </p>

        <hr className="my-4" />

        {/* Task & Response Mapping */}
        <h4 className="font-bold text-lg">Tasks & Reports</h4>
        <div className="space-y-4 mt-2">
          {selectedTask.task && selectedTask.task.length > 0 ? (
            selectedTask.task.map((taskItem, index) => (
              <div key={index} className="border p-3 rounded-lg shadow-md bg-gray-100">
                <p className="font-semibold">Task {index + 1}:</p>
                <p className="text-gray-900">{taskItem}</p>

                {/* Check if a response exists for this task */}
                {selectedTask.responses && selectedTask.responses[index] ? (
                  <div className="mt-3 border-t pt-2">
                    <p className="font-semibold">Reports:</p>
                    <p className="text-gray-700">{selectedTask.responses[index].text}</p>

                    {/* Clickable Image Preview */}
                    {selectedTask.responses[index].image && (
                      <img
                        src={selectedTask.responses[index].image}
                        alt={`Response ${index + 1}`}
                        className="mt-2 w-full h-40 object-cover rounded-md shadow-md cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setSelectedImage(selectedTask.responses[index].image);
                          document.getElementById("my_modal_3").showModal(); // Open image modal
                        }}
                      />
                    )}

                    <p className="text-sm text-gray-500 mt-1">
                      Submitted on: {new Date(selectedTask.responses[index].createdAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No response available for this task.</p>
                )}
              </div>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </>
    ) : (
      <p>Loading task details...</p>
    )}
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>Close</button>
  </form>
</dialog>

{/* Image Preview Modal (my_modal_3) */}
<dialog id="my_modal_3" className="modal bg-black/50 backdrop-blur-sm">
  <div className="max-w-4xl p-6  rounded-lg shadow-lg relative">
    {selectedImage ? (
      <div className="flex flex-col items-center">
        {/* Image Preview */}
        <img
          src={selectedImage}
          alt="Image Preview"
          className="w-full max-h-[80vh] object-contain rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        />

        {/* Close Button */}
        <button
          className="mt-4 px-5 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          Close
        </button>
      </div>
    ) : (
      <p className="text-center text-gray-500">No image selected.</p>
    )}
  </div>
</dialog>



      {/* Completed Tasks Section */}
      <div className="bg-white rounded-lg mt-10">
        <h2 className="pt-4 px-4 font-bold text-2xl">Completed Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-8">
          {currentRequests.map((task) => (
            <div key={task._id} className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 me-2"></div>
                  {task.department}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              <div className="flex justify-between text-gray-500 text-xs mb-4">
                <div>
                  <span className="font-semibold block">Task Added</span>
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold block">Due Date</span>
                  {new Date(task.scheduledDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center mt-5">
                <button
                  className="text-green-500 text-sm font-semibold px-3 py-1 transition hover:bg-green-100 rounded-lg"
                  onClick={() => {
                    setSelectedTask(task);
                    document.getElementById("my_modal_2").showModal();
                  }}
                >
                  View Task
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center rounded-lg space-x-2 py-4 bg-white shadow-sm ">
          <button
            className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 "}`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="flex overflow-x-auto gap-1 px-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700  hover:bg-gray-200 "}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 "}`}
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

export default AuditCompletedTasks;
