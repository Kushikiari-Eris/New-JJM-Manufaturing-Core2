import React, { useEffect, useState } from "react";
import { useRawMaterialRequestStore } from "../stores/useRawMaterialRequestStore";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const RawMaterialRequestForm = () => {
    const { requests, fetchRequests, addRequest, deleteRequest, loading } = useRawMaterialRequestStore();
    const [requestToDelete, setrequestToDelete] = useState(null);
  
    const [formData, setFormData] = useState({
        rawmaterialNumber: "",
        requestedBy: "",
        department: "",
        priority: "Medium",
        notes: "",
        material: [{ materialName: "", quantity: "", unit: "" }],
    });

    const handleDelete = async () => {
        if (requestToDelete) {
          await deleteRequest(requestToDelete);
          document.getElementById('delete').close();
        }
      };
    
      const openDeleteModal = (requestId) => {
        setrequestToDelete(requestId);
        document.getElementById('delete').showModal();
      };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust as needed
    const [paginatedRequests, setPaginatedRequests] = useState([]);

    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        fetchRequests(); // Ensure this updates the 'requests' state properly
    }, [fetchRequests]);

    // Update paginatedRequests whenever requests or currentPage changes
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
        setPaginatedRequests(currentItems);
    }, [requests, currentPage]);

    // Handle input change
    const handleChange = (e, index = null) => {
        const { name, value } = e.target;

        if (index !== null) {
            // Handling material array updates
            const updatedMaterials = [...formData.material];
            updatedMaterials[index][name] = value;
            setFormData({ ...formData, material: updatedMaterials });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle adding a new request
    const handleSubmit = (e) => {
        e.preventDefault();
        addRequest(formData);
        setFormData({
            rawmaterialNumber: "",
            requestedBy: "",
            department: "",
            priority: "Medium",
            notes: "",
            material: [{ materialName: "", quantity: "", unit: "" }],
        });
    };

    // Add new material input field
    const addMaterialField = () => {
        setFormData({
            ...formData,
            material: [...formData.material, { materialName: "", quantity: "", unit: "" }],
        });
    };

    // Remove material field
    const removeMaterialField = (index) => {
        const updatedMaterials = [...formData.material];
        updatedMaterials.splice(index, 1);
        setFormData({ ...formData, material: updatedMaterials });
    };

      if (loading) {
		return <div><LoadingSpinner/></div>;
	}

    return (
        <>

        <dialog id="my_modal_2" className="modal" onClick={(e) => {
            const dialog = document.getElementById("my_modal_2");
            if (e.target === dialog) {
                dialog.close();
            }
        }}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Request Raw Material</h3>
                <div className="w-full">
                    <form className="w-full bg-white p-6" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="rawmaterialNumber"
                            placeholder="Raw Material Number"
                            value={formData.rawmaterialNumber}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="requestedBy"
                            placeholder="Requested By"
                            value={formData.requestedBy}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            required
                        />
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <textarea
                            name="notes"
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">Materials</h2>
                        {formData.material.map((mat, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    name="materialName"
                                    placeholder="Material Name"
                                    value={mat.materialName}
                                    onChange={(e) => handleChange(e, index)}
                                    className="p-2 border rounded w-1/3"
                                    required
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={mat.quantity}
                                    onChange={(e) => handleChange(e, index)}
                                    className="p-2 border rounded w-1/3"
                                    required
                                />
                                <input
                                    type="text"
                                    name="unit"
                                    placeholder="Unit"
                                    value={mat.unit}
                                    onChange={(e) => handleChange(e, index)}
                                    className="p-2 border rounded w-1/3"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMaterialField(index)}
                                        className="text-red-500"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMaterialField}
                            className="bg-gray-500 text-white px-4 py-2 rounded w-full mb-2"
                        >
                            + Add Material
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                            Add Request
                        </button>
                    </form>
                </div>
            </div>
        </dialog>




        
                <div className="relative overflow-x-auto  sm:rounded-lg  bg-white">
                        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0  p-4 bg-white ">
                            <h2 className="font-semibold text-xl">Request Raw Material</h2>
                            <div className="flex items-center gap-3">
                                <label htmlFor="table-search" className="sr-only ">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search for users"/>
                                </div>
                                <div>
                                    <button className="bg-blue-500 p-2 rounded-md text-white font-semibold text-base hover:bg-blue-600 " onClick={()=>document.getElementById('my_modal_2').showModal()}>Send Request</button>
                                </div>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                                <tr>
                                <th scope="col" className="px-6 py-3">
                                    Request Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Requested By
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Material
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Notes
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRequests.map((request) => (
                                <tr
                                    key={request._id}
                                    className="bg-white border-b   border-gray-200 hover:bg-gray-50 "
                                >
                                    <td className="px-6 py-4">{request.requestDate}</td>
                                    <td className="px-6 py-4">
                                        {request.requestedBy}
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.department}
                                    </td>
                                    {request.material.map((mat, idx) => (
                                    <td key={idx} className="px-6 py-4 flex">
                                        <ul className="list-disc list-inside">
                                            <li>{mat.materialName} - {mat.quantity} {mat.unit}</li>
                                        </ul>
                                    </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {request.priority}
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.notes}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                        onClick={() => openDeleteModal(request._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className='h-5 w-5' />
                                    </button>
                                    </td>
                                </tr>
                               ))}
                            </tbody>
                        </table>
                    
                     <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white  px-4 sm:px-6">
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

                      {/* Delete Modal */}
      <dialog id="delete" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete this Product?</h3>
          <p className="py-4 text-red-600">This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn text-gray-600" onClick={() => document.getElementById('delete').close()}>Cancel</button>
            <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
          </div>
        </div>
      </dialog>
        </>
    );
};

export default RawMaterialRequestForm;
