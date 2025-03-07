import React, { useEffect, useState } from "react";
import { useProductExecutionStore } from "../stores/useProductExecutionStore";

const ProductExecutionTable = () => {
  const {
    executions,
    fetchExecutions,
    createExecution,
    deleteExecution,
    workOrders,
  } = useProductExecutionStore();

  const [newExecution, setNewExecution] = useState({
    workOrderId: "",
    dueDate: "",
    productName: "",
    productId: "",
    quantity: "",
    material: [{ itemName: "", quantity: "" }], // Ensure material array is included
  });

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  // 🔹 Update Execution State for Inputs
  const handleInputChange = (e) => {
    setNewExecution({ ...newExecution, [e.target.name]: e.target.value });
  };

  // 🔹 Update Material Array Inputs
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...newExecution.material];
    updatedMaterials[index][field] = value;
    setNewExecution({ ...newExecution, material: updatedMaterials });
  };

  // 🔹 Add New Material Row
  const addMaterial = () => {
    setNewExecution({
      ...newExecution,
      material: [...newExecution.material, { itemName: "", quantity: "" }],
    });
  };

  // 🔹 Remove Material Row
  const removeMaterial = (index) => {
    const updatedMaterials = newExecution.material.filter((_, i) => i !== index);
    setNewExecution({ ...newExecution, material: updatedMaterials });
  };

  // 🔹 Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert dueDate to a proper Date object if necessary
    const formattedExecution = {
      ...newExecution,
      dueDate: new Date(newExecution.dueDate).toISOString(),
    };

    createExecution(formattedExecution);

    // Reset Form After Submission
    setNewExecution({
      workOrderId: "",
      dueDate: "",
      productName: "",
      productId: "",
      quantity: "",
      material: [{ itemName: "", quantity: "" }],
    });
  };

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
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Product Execution</span>
                </div>
                </li>
            </ol>
        </nav>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-4 ">
                <div>
                    <div>
                        <h2 className="font-semibold text-xl">Product Execution</h2>
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Due Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Assigned To
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Materials
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
                    {[...executions, ...workOrders].map((execution) => (
                    <tr key={execution.id || execution._id || execution.workOrderId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        
                        <td className="px-6 py-4 text-base font-semibold text-gray-900">{execution.id || "N/A"}</td>
                        <td className="px-6 py-4">
                        {execution.deadline ? new Date(execution.deadline).toLocaleString() : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                        {execution.product?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                        {execution.product_id || execution.productId || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                        {execution.quantity || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                        {execution.assignedTo || "Unassigned"}
                        </td>
                        <td className="px-6 py-4">
                        {execution.product?.materials && execution.product.materials.length > 0
                            ? execution.product.materials.map((mat, i) => (
                                <span key={i} className="block">
                                    <ul className="list-disc list-inside">
                                        <li>{mat.material} - {mat.quantity}</li>
                                    </ul>
                                </span>
                            ))
                            : "No Materials"}
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full ${
                            execution.status === "Completed" ? "bg-green-500" :
                            execution.status === "IN_PROGRESS" ? "bg-blue-500" :
                            "bg-yellow-500"
                            } me-2`}></div>
                            {execution.status || "Pending"}
                        </div>
                        </td>
                        <td className="px-6 py-4">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
     
    </>
  );
};

export default ProductExecutionTable;
