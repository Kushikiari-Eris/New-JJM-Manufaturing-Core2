import { motion } from "framer-motion";
import { Trash, Star, Trash2 } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";
import { useState } from "react";
import Modal from "./CreateProductForm.jsx";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, loading } = useProductStore();
	const [open, setOpen] = useState(false)

	if (loading) {
		return <div>Loading...</div>;
	}
	
	return (
	<>
		<Modal open={open} onClose={() => setOpen(false)}/>

				
		<nav className="flex" aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				<li className="inline-flex items-center">
					<a
					href="/dashboard"
					className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
					<span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
						Products
					</span>
					</div>
				</li>
			</ol>
		</nav>

			
		
		<motion.div
		className='"relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8 }}
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

				{/* Add Product Button */}
				<button
				type="button"
				onClick={() => setOpen(true)}
				className="w-full sm:w-auto px-5 py-2.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
				Add Product
				</button>
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
                Featured
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
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
                  <button
					onClick={() => toggleFeaturedProduct(product._id)}
					className={`p-1 rounded-full ${
						product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
					} hover:bg-yellow-500 transition-colors duration-200`}
				>
					<Star className='h-5 w-5' />
				</button>
                </td>
				<td className="px-6 py-4">
                  	<button
						onClick={() => deleteProduct(product._id)}
						className='text-red-400 hover:text-red-300'
					>
						<Trash2 className='h-5 w-5' />
					</button>
                </td>
              </tr>
           ))}
          </tbody>
        </table>

			{/* <table className=' min-w-full divide-y divide-gray-700 overflow-hidden w-full'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Featured
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
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.image}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>₱{product.price.toFixed(2)}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table> */}
		</motion.div>

    </>
	);
};
export default ProductsList;