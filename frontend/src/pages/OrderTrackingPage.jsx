import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { useOrderStore } from '../stores/useOrderStore';
import { useParams } from 'react-router-dom';
import OrderTracker from '../components/OrderTracker';



const OrderTrackingPage = () => {
    const { orderId } = useParams(); // Get orderId from URL
    const { order, fetchOrderById, loading } = useOrderStore();

    useEffect(() => {
        if (orderId) {
        fetchOrderById(orderId);
        }
    }, [orderId]);

    
    
    if (!order) {
        return <div>Order not found.</div>;
    }
    
  return (
    <>
        <motion.div
            className='mx-auto w-full flex-none px-4 sm:px-6 lg:px-8 max-w-4xl xl:max-w-7xl mt-20'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <section className="py-10 relative ">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
                        <div className="w-full justify-between items-center flex sm:flex-row flex-col gap-3">
                            <div className="w-full flex-col justify-center sm:items-start items-center gap-1 inline-flex">
                                <h2 className="text-gray-500 text-2xl font-semibold font-manrope leading-9">Order:
                                    <span className="text-green-500"># {order._id}</span>
                                </h2>
                                <span className="text-gray-500 text-base font-medium leading-relaxed">Date: {new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="w-full justify-end items-start gap-8 inline-flex">
                            <div className="w-full flex-col justify-start items-start gap-8 inline-flex">
                                <OrderTracker/>
                                <div className="w-full p-8 bg-white rounded-xl flex-col justify-start items-start gap-5 border flex">
                                    <h2 className="w-full text-gray-900 text-2xl font-semibold font-manrope leading-9 pb-5 border-b border-gray-200">
                                        Order Items
                                    </h2>
                                    {order.products.map((item) => (
                                    <div key={item._id} className="w-full flex-col justify-start items-start gap-5 flex pb-5 border-b border-gray-200">
                                        <div className="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                            <div className="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                                <img className='h-20 w-20 sm:h-20 sm:w-20 object-cover rounded' src={item.product.image}
                                                alt={item.product.name} />
                                                <div
                                                    className="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                    <h4 className="text-gray-900 text-xl font-medium leading-8">{item.product.name}</h4>
                                                   <div className="flex flex-col items-center md:items-start gap-0.5">
                                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed text-center md:text-left break-words">
                                                            {item.product.description}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                                <h4 className="text-gray-500 text-xl font-semibold leading-8">Qty {item.quantity}</h4>
                                                <h4 className="text-gray-900 text-xl font-semibold leading-8">₱{item.price}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                    <div className="w-full flex-col justify-start items-start gap-5 flex">
                                        <div className="w-full pb-1.5 flex-col justify-start items-start gap-4 flex">
                                            <div className="w-full justify-between items-start gap-6 inline-flex">
                                                <h6 className="text-gray-500 text-base font-normal leading-relaxed">Subtotal</h6>
                                                <h6 className="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                    ₱{order.subTotal}
                                                </h6>
                                            </div>
                                            <div className="w-full justify-between items-start gap-6 inline-flex">
                                                <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                                    Shipping Charge
                                                </h6>
                                                <h6 className="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                    ₱{order.shippingFee}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="w-full justify-between items-start gap-6 inline-flex">
                                            <h5 className="text-gray-900 text-lg font-semibold leading-relaxed">Total</h5>
                                            <h5 className="text-right text-gray-900 text-lg font-semibold leading-relaxed">
                                                ₱{order.totalAmount}
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="border w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8">
                                    {/* Customer Title */}
                                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800 mb-4">Customer</h3>

                                    {/* Email Section */}
                                    <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-sm text-gray-800 dark:text-white">{order.user.email}</p>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Shipping Address */}
                                        <div>
                                        <p className="text-base font-semibold dark:text-white text-gray-800">Shipping Address</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-5">
                                            {order.shippingAddress.line1},<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                                        </p>
                                        <p className="text-base font-semibold dark:text-white text-gray-800">Phone Number</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-5">
                                            {order.shippingAddress.phone},<br />
                                        </p>
                                        </div>

                                        {/* Billing Address */}
                                        <div>
                                        <p className="text-base font-semibold dark:text-white text-gray-800">Billing Address</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-5">
                                            {order.shippingAddress.line1},<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                                        </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    </>
  )
}

export default OrderTrackingPage