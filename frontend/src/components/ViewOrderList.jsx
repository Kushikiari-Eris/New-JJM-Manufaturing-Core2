import React, { useEffect, useState } from 'react'
import { useOrderStore } from '../stores/useOrderStore'
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const ViewOrderList = ({ orderId, onClose }) => {

  const { order, fetchOrderById, loading, updateStatus } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  if (!order) return null; 

  const handleConfirm = async () => {
    await updateStatus(orderId, 'Confirmed'); 
    onClose(); 
  };

    if (loading) {
      return <div><LoadingSpinner/></div>;
    }
 
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div onClick={(e) => e.stopPropagation()} className={`transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
          <div className="relative p-4 w-full max-w-7xl">
            <div className="relative bg-white min-h-[80vh] rounded-lg shadow-sm dark:bg-gray-700">
              <div className="py-7 px-4 md:px-6">
                <div className="flex justify-start item-start space-y-2 flex-col">
                  <h1 className="text-2xl dark:text-white lg:text-2 xl font-semibold leading-7 lg:leading-9 text-gray-800">Order #{orderId}</h1>
                  <p className=" dark:text-gray-300 font-medium leading-6 text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                  <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex flex-col justify-start items-start border px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                      <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Items</p>
                      {order.products.map((item) => (
                        <div
                          key={item._id}
                          className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                        >
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.product.image} alt={item.product.name} />
                          </div>
                          <div className="md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                            <div className="w-full flex flex-col justify-start items-start space-y-8">
                              <h3 className="text-lg dark:text-white xl:text-1xl  leading-6 text-gray-600">{item.product.name}</h3>
                            </div>
                            <div className="flex justify-between space-x-8 items-start w-full">
                              <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">{item.quantity}</p>
                              <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">₱{item.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full border space-y-6">
                        <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
                        
                        {order.discount? 
                        <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                          <div className="flex justify-between w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
                            <p className="text-base dark:text-gray-300 font-semibold leading-4 ">₱{order.totalAmount}</p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">
                              Discount{" "}
                              <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">
                                COUPON
                              </span>
                            </p>
                            <p className="text-base dark:text-gray-300 font-semibold leading-4 text-red-500">-₱{order.discount}</p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
                            <p className="text-base dark:text-gray-300 font-semibold leading-4 ">₱{order.shippingFee}</p>
                          </div>
                        </div>
                        :
                        <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                          <div className="flex justify-between w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
                            <p className="text-base dark:text-gray-300 font-semibold leading-4 ">₱{order.subTotal}</p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
                            <p className="text-base dark:text-gray-300 font-semibold leading-4 ">₱{order.shippingFee}</p>
                          </div>
                        </div> 
                        }
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
                          <p className="text-base dark:text-white font-semibold leading-4 ">₱{order.totalAmount - order.discount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Customer</h3>
                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                      <div className="flex flex-col justify-start items-start flex-shrink-0">
                        <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm leading-5">{order.user.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                        <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                          <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                            </p>
                          </div>
                          <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Billing Address</p>
                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                          <button onClick={handleConfirm} className="mt-6 md:mt-6 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">
                            Confirm Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewOrderList