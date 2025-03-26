import React, { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore"; 

const statusSteps = ["Pending", "Placed Order", "Processing", "Order Shipped", "Order Delivered"];

const OrderTrackingDetails = ({ orderId, onClose }) => {
  const { orderTracker = [], fetchOrderStatus, updateOrderStatus, orders } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus(orderId);
    }
  }, [orderId, fetchOrderStatus]);

  const order = orderTracker.find((o) => o.orderId?._id === orderId);

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow relative"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
            Order Tracking
          </h2>

          {order ? (
            <>
              {/* Order Details */}
              <div className="mb-6 text-center sm:text-left">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Order ID:</span> {order.orderId?._id}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Current Status:</span>{" "}
                  <span className="text-blue-600 font-bold">{order.orderStatus}</span>
                </p>
              </div>

              {/* Stepper UI */}
              <ol className="flex flex-wrap justify-center sm:justify-center w-full space-y-4 sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                {statusSteps.map((step, index) => (
                  <li
                    key={step}
                    className={`flex items-center space-x-2.5 rtl:space-x-reverse ${
                      index <= getStepIndex(order.orderStatus)
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${
                        index <= getStepIndex(order.orderStatus)
                          ? "border-blue-600"
                          : "border-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-center sm:text-left">
                      <h3 className="font-medium leading-tight">{step}</h3>
                      <p className="text-sm">
                        {index <= getStepIndex(order.orderStatus)
                          ? `${new Date(order.updatedAt).toLocaleDateString()}`
                          : "Pending"}
                      </p>
                    </span>
                  </li>
                ))}
              </ol>

              {/* Status Update Buttons */}
              {/* Status Update Buttons */}
{/* Status Update Buttons */}
{/* Status Update Buttons */}
<div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
  {orders.find((o) => o._id === orderId)?.status === "Canceled" ? (
    <button
      disabled
      className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
    >
      Canceled
    </button>
  ) : orders.find((o) => o._id === orderId)?.status === "Confirmed" ? (
    statusSteps
      .slice(getStepIndex(order.orderStatus) + 1, getStepIndex(order.orderStatus) + 2)
      .map((nextStatus) => (
        <button
          key={nextStatus}
          onClick={() => handleStatusChange(nextStatus)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
        >
          Mark as {nextStatus}
        </button>
      ))
  ) : (
    <button
      disabled
      className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
    >
      Awaiting Confirmation
    </button>
  )}
</div>



            </>
          ) : (
            <p className="text-gray-500 text-center">No tracking data available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderTrackingDetails;
