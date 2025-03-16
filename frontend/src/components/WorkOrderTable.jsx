import React, { useEffect } from 'react';
import { useProductExecutionStore } from '../stores/useProductExecutionStore';
import LoadingSpinner from "./LoadingSpinner" 

const WorkOrderTable = () => {
  const { fetchExecutions, workOrders, loading, error } = useProductExecutionStore();

  useEffect(() => {
    fetchExecutions(); // Fetch data when component mounts
  }, []);

  if (loading) {
		return <div><LoadingSpinner/></div>;
	}
  if (error) return <p>Error: {error}</p>;

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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Work Orders</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white">
        <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 p-4">
          <h2 className="font-semibold text-xl">Work Orders</h2>
          <div className="relative">
            <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for work orders"/>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th className="px-6 py-3">Id</th>
      <th className="px-6 py-3">Due Date</th>
      <th className="px-6 py-3">Product Name</th>
      <th className="px-6 py-3">Product Id</th>
      <th className="px-6 py-3">Quantity</th>
      <th className="px-6 py-3">Assigned To</th>
      <th className="px-6 py-3">Materials</th>
      <th className="px-6 py-3">Status</th>
    </tr>
  </thead>
  <tbody>
    {workOrders && workOrders.length > 0 ? (
      workOrders.map((order) => (
        <tr
          key={order.id}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td className="px-6 py-4 font-semibold text-gray-900">{order.id}</td>
          <td className="px-6 py-4">
            {new Date(order.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </td>
          <td className="px-6 py-4">{order.product.name}</td>
          <td className="px-6 py-4">{order.product.id}</td>
          <td className="px-6 py-4">{order.product.quantity}</td>
          <td className="px-6 py-4">{order.assignedTo}</td>
          <td className="px-6 py-4">
            <ul className="list-disc list-inside">
              {order.product.materials?.map((material, index) => (
                <li key={index}>
                  {material.material} - {material.quantity} {material.unit}
                </li>
              ))}
            </ul>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  order.status === "Completed"
                    ? "bg-green-500"
                    : order.status === "In Progress"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                } me-2`}
              ></div>
              {order.status}
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
          No work orders found
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </>
  );
};

export default WorkOrderTable;
