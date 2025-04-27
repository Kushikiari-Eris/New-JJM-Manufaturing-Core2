import React, { useEffect, useState } from 'react'
import useAuditTaskStore from '../stores/auditTaskStore';

const AuditTaskTable = () => {
    const { fetchTasks, tasks, loading  } = useAuditTaskStore();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of items per page

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks]);

    // Pagination calculations
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = tasks.slice(indexOfFirstItem, indexOfLastItem);

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
                    Audit Tasks
                </span>
                </div>
            </li>
        </ol>
    </nav>

        <div className="relative overflow-x-auto bg-white mt-10 rounded-lg"> 
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
                <h2 className="font-semibold text-xl">Audit Tasks</h2>

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
                            <th className="px-6 py-3">Tasks</th>
                            <th className="px-6 py-3">Scheduled</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.length > 0 ? (
                            currentRequests.map((req) => (
                                <tr key={req._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-bold">{req.department}</td>
                                    <td className="px-6 py-4">{req.description}</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc pl-5">
                                            {req.task.map((taskItem, index) => (
                                                <li key={index}>{taskItem}</li>
                                            ))}
                                        </ul>
                                    </td>
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

export default AuditTaskTable