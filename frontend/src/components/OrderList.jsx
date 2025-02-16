import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Eye, Pencil, Trash } from "lucide-react";
import { useOrderStore } from '../stores/useOrderStore.js';



const OrderList = ({ openModal, openSecondModal }) => {
  const { orders, loading, error } = useOrderStore();

  

  return (
    <>

		<div className="flex justify-start items-center  sm:w-auto mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-14">
			<div>
				<form className="w-96 mx-auto py-2.5">   
					<label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
					<div className="relative">
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
						<button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
					</div>
				</form>
			</div>
		</div>

        <motion.div
		className='bg-gray-800 shadow-lg rounded-lg  sm:w-auto mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-14 overflow-x-auto whitespace-nowrap'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8 }}
		>

			<table className=' min-w-full divide-y divide-gray-700 overflow-hidden w-full'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Order Id
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Customer
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Date
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Status
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Order Status
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{orders?.map((order) => (
					<tr key={order._id} className="hover:bg-gray-700">
						
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm font-medium text-white">{order._id}</div>
						</td>

					
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-300">
								{order.user?.email || "N/A"}
							</div>
						</td>

						
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-300">
								{new Date(order.createdAt).toLocaleDateString()}
							</div>
						</td>

						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-300">{order.status}</div>
						</td>
						
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-300">{order.orderStatus || "N/A"}</div>
						</td>

						<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
							<button type='button' onClick={() => openModal(order._id)} className="text-blue-400 hover:text-blue-300 mr-1">
								<Eye className='h-5 w-5'/>
							</button>
							<button type='button' onClick={() => openSecondModal(order._id)} className="text-green-400 hover:text-green-300">
								<Pencil className="h-5 w-5" />
							</button>
						</td>
					</tr>
					))}
				</tbody>
			</table>
		</motion.div>
    </>
  )
}

export default OrderList