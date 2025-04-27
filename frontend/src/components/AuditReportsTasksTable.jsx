import React, { useEffect, useState } from 'react'
import useAuditTaskStore from '../stores/auditTaskStore';

const AuditReportsTasksTable = () => {

    const { fetchTasks, tasks, loading  } = useAuditTaskStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of items per page

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks]);

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
                Audit Reports
              </span>
            </div>
          </li>
        </ol>
      </nav>

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

      <div className="relative overflow-x-auto bg-white mt-10 rounded-lg"> 
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
                <h2 className="font-semibold text-xl">Audit Reports</h2>

                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="table-search-users" 
                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Search for users" 
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Scheduled</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.length > 0 ? (
                            currentRequests.map((req) => (
                                <tr key={req._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-bold">{req.department}</td>
                                    <td className="px-6 py-4">{req.description}</td>
                                    <td className="px-6 py-4">  {new Date(req.scheduledDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div
                                            className={`h-2.5 w-2.5 rounded-full me-2 
                                                ${req.status === "Pending" ? "bg-yellow-500" :
                                                req.status === "Completed" ? "bg-green-500" :
                                                req.status === "Overdue" ? "bg-red-500" :
                                                req.status === "In Progress" ? "bg-blue-500" : "bg-gray-400"
                                                }`}
                                            ></div> 
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="text-blue-500 text-sm font-semibold px-3 py-1 transition hover:bg-blue-100 rounded-lg"
                                            onClick={() => {
                                                setSelectedTask(req);
                                                document.getElementById("my_modal_2").showModal();
                                            }}
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>

                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-2 text-center">No requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white  px-4 sm:px-6">
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
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700  hover:bg-gray-200 "
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
  )
}

export default AuditReportsTasksTable