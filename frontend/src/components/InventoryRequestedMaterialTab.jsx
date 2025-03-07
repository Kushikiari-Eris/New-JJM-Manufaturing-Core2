import React, { useEffect } from 'react'
import useAuditStore from '../stores/useAuditRawMaterialStore';


const InventoryRequestedMaterialTab = () => {
    const { audits, loading, fetchAudits, deleteAudit } = useAuditStore();

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);
  return (
    <>
    
    <div className="relative overflow-x-auto  bg-white">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4 ">
                <div>
                    <div>
                        <h2 className="font-semibold text-xl">Requested Raw Materials</h2>
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

export default InventoryRequestedMaterialTab