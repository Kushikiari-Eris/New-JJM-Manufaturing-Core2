import React, { useEffect } from 'react'
import useAuditStore from '../stores/useAuditRawMaterialStore';

const AuditCoreTable = () => {
    const { audits, loading, fetchAudits, deleteAudit } = useAuditStore();

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);
  return (
    <>
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Audit Request</span>
            </div>
            </li>
            <li aria-current="page">
            <div className="flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Core</span>
            </div>
            </li>
        </ol>
    </nav>
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-4 ">
                <div>
                    <div>
                        <h2 className="font-semibold text-xl">Core Task</h2>
                    </div>
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users"/>
                </div>
            </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Sender
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Materials
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quality
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                {audits.length > 0 ? (
                    audits.map((audit) => (
                    <tr
                        key={audit._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <td className="px-6 py-4 text-base font-semibold text-gray-900">
                        {audit.sender}
                        </td>
                        {audit.rawMaterial.length > 0 ? (
                        audit.rawMaterial.map((mat, index) => (
                            <td className="px-6 py-4" key={index}>
                            {mat.itemName} - {mat.quantity} {mat.unit}
                            </td>
                        ))
                        ) : (
                        <td className="px-6 py-4">No Materials</td>
                        )}
                        <td className="px-6 py-4">{audit.qualityCheck}</td>
                        <td className="px-6 py-4">{audit.status}</td>
                        <td className="px-6 py-4">
                        <a
                            href="#"
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            Edit
                        </a>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                        No task available
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
      )}
    </div>
    </>
  )
}

export default AuditCoreTable