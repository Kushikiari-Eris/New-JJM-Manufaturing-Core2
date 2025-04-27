import React, { useEffect, useState } from "react";
import useAuditRequestHr3Store from "../stores/useAuditRequestHr3Store";
import useAuditTaskStore from "../stores/auditTaskStore";

const AuditRequestHr3Table = () => {
    const { requests, loading, fetchRequests, deleteRequest } = useAuditRequestHr3Store();
    const { addTask } = useAuditTaskStore()


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Pagination calculations
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleAddTask = async (req) => {
    const newTask = {
        department: req.department,
        description: req.description,
        task: req.task,
        status: "Pending",
    };

    try {
        await addTask(newTask, () => {}); // Add Task
        await deleteRequest(req._id); // Delete Request
    } catch (error) {
        console.error("Error processing request:", error);
    }
    };

    return (
        <div className="relative overflow-x-auto bg-white">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
                <h2 className="font-semibold text-xl">Human Resource 3 Requests</h2>

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
                            <th className="px-6 py-3">Actions</th>
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
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleAddTask(req)} className="bg-blue-500 text-white px-3 py-2 rounded">
                                            Add Tasks
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
    );
};

export default AuditRequestHr3Table;
