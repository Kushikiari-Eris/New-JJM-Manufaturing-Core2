import React, { useEffect, useState } from "react";
import { useProductExecutionStore } from "../stores/useProductExecutionStore";
import LoadingSpinner from "./LoadingSpinner";

const ProductExecutionTable = () => {
  const { executions, fetchExecutions, fetchWorkOrders, handleStartProduction, countdowns, loading  } = useProductExecutionStore();


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust items per page as needed
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchExecutions();
    };
    fetchData();
  }, [fetchExecutions, fetchWorkOrders]);

 // Reverse the executions array to show the latest first
  const sortedExecutions = [...executions].reverse();

  // Pagination logic
  const totalPages = Math.ceil(sortedExecutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExecutions = sortedExecutions.slice(startIndex, startIndex + itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

    if (loading) {
      return <div><LoadingSpinner/></div>;
    }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">Product Execution</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Execution Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white">
        <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 p-4">
          <h2 className="font-semibold text-xl">Product Execution</h2>
          <div className="relative">
            <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for users"/>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Assigned To</th>
              <th scope="col" className="px-6 py-3">Materials</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExecutions.map((execution) => (
              <tr key={execution._id} className="bg-white border-b  hover:bg-gray-50 ">
                <td className="px-6 py-4">{execution.dueDate ? new Date(execution.dueDate).toLocaleDateString() : "N/A"}</td>
                <td className="px-6 py-4">{execution.productName || "N/A"}</td>
                <td className="px-6 py-4">{execution.quantity || "N/A"}</td>
                <td className="px-6 py-4">{execution.assignedTo || "Unassigned"}</td>
                <td className="px-6 py-4">
                  {execution.materials?.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {execution.materials.map((mat, i) => (
                        <li key={i}>{mat.materialName} - {mat.quantity}</li>
                      ))}
                    </ul>
                  ) : "No Materials"}
                </td>
                <td className="px-6 py-4">
                            <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full ${
                                execution.status === "Completed" ? "bg-green-500" :
                                execution.status === "In Progress" ? "bg-blue-500" :
                                "bg-yellow-500"
                            } me-2`}></div>
                            {execution.status || "Pending"}
                            </div>
                        </td>
                <td className="px-6 py-4">
                <button
                  onClick={() => handleStartProduction(execution._id)}
                  className={`flex items-center gap-2 font-medium text-white px-4 py-2 rounded-md transition-all duration-300 ${
                    execution.status === "Completed"
                      ? "bg-green-400 cursor-not-allowed"
                      : execution.status === "In Progress"
                      ? "bg-indigo-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={execution.status !== "Pending"}
                >
                  {execution.status === "In Progress" ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 text-white animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"
                        ></path>
                      </svg>
                      Processing… {countdowns[execution._id] ?? 10}s
                    </>
                  ) : execution.status === "Completed" ? (
                    "Completed"
                  ) : (
                    "Start Production"
                  )}
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2 py-4 bg-white ">
          <button 
            className="px-4 py-2 rounded-md text-gray-600  transition-all duration-300"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index} className={`px-3 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button 
            className="px-4 py-2 rounded-md text-gray-600 transition-all duration-300"
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

export default ProductExecutionTable;
