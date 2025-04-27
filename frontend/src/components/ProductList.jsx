import { motion } from "framer-motion";
import { Trash2, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";
import { useState } from "react";
import Modal from "./CreateProductForm.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products, loading } = useProductStore();
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      document.getElementById('my_modal_2').close();
    }
  };

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    document.getElementById('my_modal_2').showModal();
  };

  if (loading) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} />

      {/* Breadcrumb Navigation */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
              <svg className="w-3 h-3 me-2.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Products</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Table */}
      <motion.div
        className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 p-4">
          <h2 className="font-semibold text-xl text-gray-800">Products</h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="text" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for users" />
            </div>

            {/* Add Product Button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm"
            >
              Add Product
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Featured</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                <td className="flex items-center px-6 py-4 text-gray-900">
                  <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                  <div className="ml-4 text-sm font-medium">{product.name}</div>
                </td>
                <td className="px-6 py-4">₱{product.price.toFixed(2)}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-1 rounded-full ${
                      product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openDeleteModal(product._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Delete Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete this Product?</h3>
          <p className="py-4 text-red-600">This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn text-gray-600" onClick={() => document.getElementById('my_modal_2').close()}>Cancel</button>
            <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ProductsList;
