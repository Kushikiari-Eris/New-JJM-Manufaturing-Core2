import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "../stores/useOrderStore";

const statusSteps = ["Pending", "Placed Order", "Processing", "Order Shipped", "Order Delivered"];

const OrderTracker = () => {
  const { orderId } = useParams();
  const { orderTracker = [], fetchOrderStatus } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus(orderId);
    }
  }, [orderId, fetchOrderStatus]);

  const order = orderTracker.find((o) => String(o.orderId?._id) === String(orderId));

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <>
      {order ? (
        <div className="w-full p-8 bg-white rounded-xl flex-col justify-start items-start gap-5 border flex">
          <h2 className="w-full text-gray-900 text-2xl font-semibold leading-9 pb-5 border-b border-gray-200">
            Order Tracking Id: <span className="text-green-500"># {order._id}</span>
          </h2>
          <div className="w-full flex-col justify-center items-center">
            <ol className="flex flex-wrap justify-center sm:justify-center w-full space-y-4 sm:space-x-8 sm:space-y-0">
              {statusSteps.map((step, index) => (
                <li
                  key={step}
                  className={`flex items-center space-x-2.5 ${
                    index <= getStepIndex(order.orderStatus) ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${
                      index <= getStepIndex(order.orderStatus) ? "border-blue-600" : "border-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-center sm:text-left">
                    <h3 className="font-medium leading-tight">{step}</h3>
                    <p className="text-sm">
                      {index <= getStepIndex(order.orderStatus)
                        ? new Date(order.updatedAt).toLocaleDateString()
                        : "Pending"}
                    </p>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No tracking data available.</p>
      )}
    </>
  );
};

export default OrderTracker;
