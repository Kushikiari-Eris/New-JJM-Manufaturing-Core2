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
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all transform ${
          open ? "scale-100 opacity-100" : "scale-105 opacity-0"
        }`}
      >
        <div className="relative w-full max-w-6xl p-6">
          {/* Modal Container */}
          <div className="bg-white  rounded-lg shadow-lg p-6 min-h-[75vh]">
            {/* Header */}
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 ">
                  Order #{orderId}
                </h1>
                <p className="text-sm text-gray-500 ">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-600  hover:text-gray-900  transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="xl:col-span-2 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 ">
                  Items
                </h3>
                <div className="divide-y divide-gray-200 ">
                  {order.products.map((item) => (
                    <div key={item._id} className="flex items-center py-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="text-gray-800  font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500 ">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 ">
                        ₱{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-2 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 ">
                  Order Summary
                </h3>
                <div className="mt-4 space-y-3 text-gray-700 ">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₱{order.subTotal}</span>
                  </div>
                  {order.discount && (
                    <div className="flex justify-between text-red-500">
                      <span>
                        Discount{" "}
                        <span className="bg-gray-200  px-2 py-1 text-xs font-medium rounded">
                          COUPON
                        </span>
                      </span>
                      <span>-₱{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">₱{order.shippingFee}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₱{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details & Actions */}
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-1 gap-6">
              {/* Customer Details */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 ">
                  Customer Information
                </h3>
                <div className="mt-4 text-gray-700 ">
                  <div className="flex items-center space-x-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gray-600 "
                    >
                      <path
                        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M3 7L12 13L21 7"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>{order.userEmail}</span>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-sm">
                      {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} {order.shippingAddress.postal_code}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Billing Address</p>
                    <p className="text-sm">
                      {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} {order.shippingAddress.postal_code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="flex justify-center items-center">
                <button
                    onClick={handleConfirm}
                    disabled={order?.status === "Confirmed" || order?.status === "Canceled"}
                    className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition
                      ${order?.status === "Confirmed" || order?.status === "Canceled" 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-green-500 hover:bg-green-600"}
                    `}
                  >
                    Confirm Order
                  </button>

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