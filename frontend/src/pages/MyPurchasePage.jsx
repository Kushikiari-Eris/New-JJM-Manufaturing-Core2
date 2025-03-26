import React, { useEffect } from 'react'
import { useOrderStore } from '../stores/useOrderStore';
import { Package } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from '../components/LoadingSpinner';

const MyPurchasePage = () => {
    const { orders, loading, error, updateStatus, fetchAllOrder } = useOrderStore();
    const navigate = useNavigate();


    useEffect(() => {
        fetchAllOrder();
    }, [fetchAllOrder]);

      if (loading) {
		return <div><LoadingSpinner/></div>;
	}

  return (
    <>
        <motion.div
            className='mx-auto w-full flex-none px-4 sm:px-6 lg:px-8 max-w-4xl xl:max-w-7xl mt-20'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
        {loading ? (
                 <div className="text-center text-gray-500 mt-20"><LoadingSpinner/></div>
            ) :orders.length === 0 ? (
                <EmptyOrdersUi />
            ) : (
                <div className='min-h-screen py-10'>
                    <div className='relative z-10 max-w-screen-xl mx-auto'>
                        <h2 className='font-bold text-2xl md:text-4xl tracking-tight text-green-500'>My Purchase</h2>
                        <p className='text-gray-500 text-sm md:text-md mt-1'>
                            Stay organized and never lose track—review and track all your past orders anytime.
                        </p>
                        {orders.map((order) => (
                            <div key={order._id} className='border mt-10 rounded-lg'>
                                <div className='flex flex-wrap md:flex-nowrap justify-between items-center p-4 sm:p-6'>
                                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                        <div>
                                            <h2 className='font-medium text-sm md:text-md'>Order Number</h2>
                                            <span className='text-gray-500 text-sm'>{order._id}</span>
                                        </div>
                                        <div>
                                            <h2 className='font-medium text-sm md:text-md'>Date Placed</h2>
                                            <span className='text-gray-500 text-sm'>{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 items-center mt-4 sm:mt-0'>
                                        {order.status !== "Canceled" && order.status !== "Confirmed" && (
                                            <button
                                                type='button'
                                                className='border-gray-300 border py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm'
                                                onClick={() => updateStatus(order._id, "Canceled")}
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <button
                                            type='button'
                                            className='border-gray-300 border py-2 px-3 rounded-lg hover:bg-gray-50 font-medium text-sm flex'
                                            onClick={() => navigate(`/orderTrackingPage/${order._id}`)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>

                                            Track Order
                                        </button>
                                    </div>
                                </div>
                                <hr className='h-px bg-gray-200 border-0' />
                                {order.products.map((item) => (
                                <div key={item._id} className='border-b'>
                                    <div className='flex flex-col sm:flex-row gap-4 p-4 sm:p-8'>
                                        <img
                                            className='h-20 w-20 sm:h-20 sm:w-20 object-cover rounded'
                                            src={item.product?.image || '/default-image.jpg'}  // Fallback to a default image
                                            alt={item.product?.name || 'Unknown Product'}  // Fallback alt text
                                        />
                                        <div className='w-full'>
                                            <div className='flex justify-between items-center'>
                                                <h3 className='font-medium text-sm sm:text-md'>{item.product?.name || 'No name available'}</h3>
                                                <div className='flex gap-2 sm:gap-3 text-sm sm:text-md'>
                                                    <span className='font-medium'>Qty {item.quantity}</span>
                                                    <h2 className='font-medium'>₱{item.price}</h2>
                                                </div>
                                            </div>
                                            <span className='text-gray-500 text-sm'>{item.product?.description || 'No description available'}</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                                <div className="py-4 px-8 text-sm sm:text-md flex items-center">
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    </>
  )
}

export default MyPurchasePage


const EmptyOrdersUi = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-4 py-16 mt-40'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<Package  className='h-24 w-24 text-gray-300' />
		<h3 className='text-2xl font-semibold '>You have no orders at the moment.</h3>
		<p className='text-gray-400'> Start shopping to place your first order!</p>
		<Link
			className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
			to='/'
		>
			Start Shopping
		</Link>
	</motion.div>
);