import React, { useEffect, useState } from 'react'
import { useProductStore } from '../stores/useProductStore';


const FinishProductTable = () => {
    const { fetchAllProducts, products, loading } = useProductStore();

        
        useEffect(() => {
            fetchAllProducts();
        }, [fetchAllProducts]);
        
        
        
  return (
    <>
       <div
		className='"relative overflow-x-auto    bg-white'
		>
		<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 p-4">
			{/* Title */}
			<h2 className="font-semibold text-xl text-gray-800 dark:text-white">
				Products
			</h2>

			{/* Search & Button Container */}
			<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
				<div className="relative">
					<div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
						</svg>
					</div>
					<input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users"/>
				</div>
			</div>
		</div>


        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Stocks
              </th>
              
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
					<div className='flex-shrink-0 h-10'>
						<img
							className='h-10 w-10 rounded-full object-cover'
							src={product.image}
							alt={product.name}
						/>
					</div>
					<div className='ml-4'>
						<div className='text-sm font-medium'>{product.name}</div>
					</div>	
                </th>
                <td className="px-6 py-4">₱{product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {product.category}
                </td>
                <td className="px-6 py-4">
                  {product.stock}
                </td>
              </tr>
           ))}
          </tbody>
        </table>
		</div>

    </>
  )
}

export default FinishProductTable