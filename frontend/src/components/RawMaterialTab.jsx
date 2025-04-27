import React, { useEffect, useState } from 'react';
import useRawMaterialStore from '../stores/useRawMaterialStore';
import LoadingSpinner from './LoadingSpinner';

const RawMaterialTab = () => {
    const { rawMaterials, fetchRawMaterials, loading } = useRawMaterialStore();


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust as needed
    const [paginatedRequests, setPaginatedRequests] = useState([]);

    const totalPages = Math.ceil(rawMaterials.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        fetchRawMaterials();
    }, []);

    // Update paginatedRequests whenever requests or currentPage changes
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = rawMaterials.slice(indexOfFirstItem, indexOfLastItem);
        setPaginatedRequests(currentItems);
    }, [rawMaterials, currentPage]);


      if (loading) {
            return <div><LoadingSpinner/></div>;
        }
    return (
        <>
            <div className="relative overflow-x-auto bg-white">
                <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
                    <div>
                        <h2 className="font-semibold text-xl">Raw Materials</h2>
                    </div>
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
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " 
                            placeholder="Search for users" 
                        />
                    </div>
                </div>
                {loading ? (
                    <p><LoadingSpinner/></p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Materials</th>
                                    <th scope="col" className="px-6 py-3">Stocks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRequests.length > 0 ? (
                                    paginatedRequests.map((material) => (
                                        <tr key={material._id} className="bg-white border-b  hover:bg-gray-50 ">
                                            <td className="px-6 py-4">{material.materialName}</td>
                                            <td className="px-6 py-4">{material.quantity} {material.unit}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                                            No raw materials found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                    
                        </table>
                        <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white px-4 sm:px-6">
                        <button
                            className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-200 "
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
                                currentPage === totalPages
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-200 "
                                }`}
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                
            </div>
        </>
    );
};

export default RawMaterialTab;
