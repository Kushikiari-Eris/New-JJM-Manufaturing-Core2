import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Pencil } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore.js";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "./LoadingSpinner.jsx";

const OrderList = ({ openModal, openSecondModal }) => {
  const { orders, loading } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

 

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders?.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders?.length / ordersPerPage);

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
                Orders
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <motion.div
        className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-4">
          <h2 className="font-semibold text-xl">Customer Orders</h2>
          <label htmlFor="table-search" className="sr-only ">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search for users"/>
            </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Payment
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Order Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr
                key={order._id}
                className="bg-white border-b   border-gray-200 hover:bg-gray-50 "
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">{order._id}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{order.user?.email || "N/A"}</td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {order.paymentMethod}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full me-2 
                        ${order.status === "Pending" ? "bg-yellow-500" :
                          order.status === "Confirmed" ? "bg-green-500" :
                          order.status === "Canceled" ? "bg-red-500" :
                          order.status === "Refunded" ? "bg-blue-500" : "bg-gray-400"
                        }`}
                    ></div> 
                    {order.status}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full me-2 
                        ${order.orderStatus === "Pending" ? "bg-yellow-500" :
                          order.orderStatus === "Placed Order" ? "bg-blue-500" :
                          order.orderStatus === "Processing" ? "bg-orange-500" :
                          order.orderStatus === "Order Shipped" ? "bg-purple-500" :
                          order.orderStatus === "Order Delivered" ? "bg-green-500" : 
                          "bg-gray-400"
                        }`}
                    ></div> 
                    {order.orderStatus || "N/A"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => openModal(order._id)}
                    className="text-blue-400 hover:text-blue-300 mr-1"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openSecondModal(order._id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
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
				className={`px-4 py-2 rounded-md text-gray-600 d transition-all duration-300 ${
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
      </motion.div>
    </>
  );
};

export default OrderList;
