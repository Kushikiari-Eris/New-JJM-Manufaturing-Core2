import React from 'react'
import { ClipboardPlus } from "lucide-react";

const AuditHrRequestTable = () => {
  return (
    <>
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
                <a
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    Audit Request
                </span>
                </div>
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
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    Hr Request
                </span>
                </div>
            </li>
        </ol>
    </nav>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0  p-4 bg-white dark:bg-gray-900">
                <h2 className="font-semibold text-xl">Human Resource Audit Request</h2>
                <div className="flex items-center gap-3">
                    <label htmlFor="table-search" className="sr-only ">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users"/>
                    </div>
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th scope="col" className="px-6 py-3">
                        Department
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Task
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Actions
                    </th>
                    
                    </tr>
                </thead>
                <tbody>
                 
                    <tr
                        
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <td className="px-6 py-4 font-semibold text-base text-gray-900 whitespace-nowrap dark:text-white">Hr</td>
                        <td className="px-6 py-4">Need Audit for Recruitment & Hiring</td>
                        <td className="px-6 py-4">
                             <ul className="list-disc list-inside">
                                <li>Hiring process efficiency</li>
                                <li>Job descriptions and qualifications</li>
                                <li>Background checks & reference verification</li>
                                <li>Onboarding and orientation programs</li>
                                <li>Diversity, equity, and inclusion (DEI)</li>
                            </ul>
                        </td>
                        <td className="px-6 py-4">
                            <button className="bg-blue-500 text-white rounded-md hover:bg-blue-600 flex gap-1 border p-3">
                                <ClipboardPlus className='h-5 w-5' />
                                <span>Add Task</span>
                            </button>
                        </td>
                    </tr>
                   
                </tbody>
            </table>
        
            {/* <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white dark:bg-gray-900 px-4 sm:px-6">
            <button
                className={`px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
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
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => paginate(index + 1)}
                >
                    {index + 1}
                </button>
                ))}
            </div>

            <button
                className={`px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div> */}
    </div>
    
    </>
  )
}

export default AuditHrRequestTable