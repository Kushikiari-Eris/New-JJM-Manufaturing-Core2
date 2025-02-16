import React, { useEffect } from 'react'
import { useOrderStore } from '../stores/useOrderStore';
import { Package } from 'lucide-react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyPurchasePage = () => {
    const { orders, loading, error, fetchAllOrder } = useOrderStore();

    useEffect(() => {
        fetchAllOrder();
    }, [fetchAllOrder]);

  return (
    <>
        <motion.div
            className='mx-auto w-full flex-none px-4 sm:px-6 lg:px-8 max-w-4xl xl:max-w-7xl mt-20'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
        {loading ? (
                <p className="text-center text-gray-500 mt-10">Loading orders...</p>
            ) :orders.length === 0 ? (
                <EmptyOrdersUi />
            ) : (
                <div className='min-h-screen py-10'>
                    <div className='relative z-10 max-w-screen-xl mx-auto'>
                        <h2 className='font-bold text-2xl md:text-4xl tracking-tight'>My Purchase</h2>
                        <p className='text-gray-500 text-sm md:text-md mt-1'>
                            Review and track all your past orders.
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
                                        <div>
                                            <h2 className='font-medium text-sm md:text-md'>Total Amount</h2>
                                            <span className='font-medium text-sm md:text-md'>
                                                ${order.totalAmount + order.shippingFee - order.discount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 items-center mt-4 sm:mt-0'>
                                        <button
                                            type='button'
                                            className='border-gray-300 border py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm'
                                        >
                                            Cancel Order
                                        </button>
                                        <button
                                            type='button'
                                            className='border-gray-300 border py-2 px-3 rounded-lg hover:bg-gray-50 font-medium text-sm'
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                </div>
                                <hr className='h-px bg-gray-200 border-0' />
                                {order.products.map((item) => (
                                    <div key={item._id} className='flex flex-col sm:flex-row gap-4 p-4 sm:p-8'>
                                        <img
                                            className='h-28 w-28 sm:h-40 sm:w-36 object-cover rounded'
                                            src={item.product.image}
                                            alt={item.product.name}
                                        />
                                        <div className='w-full'>
                                            <div className='flex justify-between items-center'>
                                                <h3 className='font-medium text-sm sm:text-md'>{item.product.name}</h3>
                                                <div className='flex gap-2 sm:gap-3 text-sm sm:text-md'>
                                                    <span className='font-medium'>Qty {item.quantity}</span>
                                                    <h2 className='font-medium'>${item.price}</h2>
                                                </div>
                                            </div>
                                            <span className='text-gray-500 text-sm'>{item.description}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className='py-4 px-8 text-sm sm:text-md'>
                                    <h2>{order.status}</h2>
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