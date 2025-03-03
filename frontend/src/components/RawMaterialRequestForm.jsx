import React, { useEffect, useState } from "react";
import { useRawMaterialRequestStore } from "../stores/useRawMaterialRequestStore";

const RawMaterialRequestForm = () => {
    const { requests, fetchRequests, addRequest, updateRequestStatus, deleteRequest } = useRawMaterialRequestStore();
  
    const [formData, setFormData] = useState({
        rawmaterialNumber: "",
        requestedBy: "",
        department: "",
        priority: "Medium",
        notes: "",
        material: [{ materialName: "", quantity: "", unit: "" }],
    });

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

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
    return (
        <>
        {/* <div className="header my-3 h-20 px-10 flex items-center border  bg-white rounded-lg">
            <h1 className="font-bold text-2xl">Requests Raw Material</h1>
        </div>
        <div className="flex flex-col gap-2 mt-6 lg:flex-row">
            <div className="w-full lg:w-1/3">
                <form onSubmit={handleSubmit} className="w-full bg-white border shadow-lg p-6" >
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="category_name">Request Raw Material</label>
                            <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]" 
                            type="text"
                            placeholder="Requested By"
                            value={requestedBy}
                            onChange={(e) => setRequestedBy(e.target.value)}
                            required />
                        </div>
                        
                        {materials.map((material, index) => (
                        <div className="w-full md:w-full px-3 mb-6">
                            <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]"
                            type="text"
                            placeholder="Material Name"
                            value={material.rawMaterialId}
                            onChange={(e) => handleMaterialChange(index, "rawMaterialId", e.target.value)}
                            required />
                            
                            <input className="appearance-none mt-6 block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]"
                            type="number"
                            placeholder="Quantity"
                            value={material.quantity}
                            onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
                            required />
                        </div>  
                        ))}                   
                        
                        <div className="w-full md:w-full px-3">
                            <button type="button" onClick={() => handleRemoveMaterial(materials.length - 1)}  disabled={materials.length === 1} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50">
                                Remove
                            </button>
                            <button type="button" onClick={handleAddMaterial} className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blues-500 transition duration-150 ease-in-out disabled:opacity-50" >
                                Add Another Material 
                            </button>
                            <button type="submit" className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50" >
                                Send Request 
                            </button>
                        </div>
                        
                    </div>
                </form>
            </div>
            
        <div className="w-full lg:w-2/3  bg-white shadow-lg text-lg rounded-sm border border-gray-200 flex flex-col" >
                    <div className="relative overflow-x-auto flex-grow">
                        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 p-4 bg-white dark:bg-gray-900">
                            <div >
                                <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                    <span className="sr-only">Action button</span>
                                    Action
                                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>

                                <div id="dropdownAction" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                                        </li>
                                    </ul>
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
                                    </div>
                                </div>
                            </div>
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
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Requested By
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Material Name / Qty
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    
                                </tr>
                            </thead>
                            {loading ? <p>Loading...</p> : (
                            <tbody>
                                {currentProducts.length === 0 ? <p>No requests found.</p> : (
                                    currentProducts.map((request) => (
                                    <tr key={request._id}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900"> {request.requestedBy}</td>
                                        <td  className="px-6 py-4">
                                            {request.materials.map((mat) => `${mat.rawMaterialId} (${mat.quantity})`).join(", ")}
                                        </td>
                                        <td className="px-6 py-4"> {new Date(request.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4">{request.status}</td>
                                    </tr>
                                    ))
                                )}
                            </tbody>
                            )}
                        </table>
                    </div>

                    
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 py-4 mt-auto">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 text-sm font-medium rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 text-sm font-medium rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 text-sm font-medium rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
            </div>
        </div> */}


     <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Raw Material Requests</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input type="text" name="rawmaterialNumber" placeholder="Raw Material Number" value={formData.rawmaterialNumber} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="requestedBy" placeholder="Requested By" value={formData.requestedBy} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        
        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full p-2 mb-2 border rounded"></textarea>

        {/* Material Fields */}
        <h2 className="text-lg font-semibold mb-2">Materials</h2>
        {formData.material.map((mat, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" name="materialName" placeholder="Material Name" value={mat.materialName} onChange={(e) => handleChange(e, index)} className="p-2 border rounded w-1/3" required />
            <input type="number" name="quantity" placeholder="Quantity" value={mat.quantity} onChange={(e) => handleChange(e, index)} className="p-2 border rounded w-1/3" required />
            <input type="text" name="unit" placeholder="Unit" value={mat.unit} onChange={(e) => handleChange(e, index)} className="p-2 border rounded w-1/3" required />
            {index > 0 && <button type="button" onClick={() => removeMaterialField(index)} className="text-red-500">X</button>}
          </div>
        ))}
        <button type="button" onClick={addMaterialField} className="bg-gray-500 text-white px-4 py-2 rounded w-full mb-2">+ Add Material</button>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Request</button>
      </form>

      {/* Request List */}
      <ul>
        {requests.map((request) => (
          <li key={request._id} className="bg-white p-4 rounded-lg shadow-md mb-2">
            <p className="font-bold">{request.rawmaterialNumber} - {request.requestStatus}</p>
            <p>Requested by: {request.requestedBy}</p>
            <p>Priority: {request.priority}</p>
            <p>Department: {request.department}</p>
            <p>Notes: {request.notes}</p>
            
            {/* Materials */}
            <h3 className="font-semibold mt-2">Materials:</h3>
            <ul className="list-disc pl-6">
              {request.material.map((mat, idx) => (
                <li key={idx}>{mat.materialName} - {mat.quantity} {mat.unit}</li>
              ))}
            </ul>

            <button onClick={() => deleteRequest(request._id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
        </>
    );
};

export default RawMaterialRequestForm;
