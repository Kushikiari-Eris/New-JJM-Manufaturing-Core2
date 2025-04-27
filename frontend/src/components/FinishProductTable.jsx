import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "./LoadingSpinner";

const FinishProductTable = () => {
  const { fetchAllProducts, createAndSendTransfer, products, transferLoading, loading } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState({}); // Store quantity per product

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust as needed
  const [paginatedRequests, setPaginatedRequests] = useState([]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
      }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Update paginatedRequests whenever requests or currentPage changes
  useEffect(() => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
      setPaginatedRequests(currentItems);
  }, [products, currentPage]);
  

  // ✅ Handle Transfer to Logistic 2
  const handleSendToLogistic2 = async (product) => {
    const selectedQuantity = quantity[product._id];

    if (!selectedQuantity || selectedQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (selectedQuantity > product.stock) {
      alert(`Cannot send more than available stock (${product.stock}).`);
      return;
    }

    setSelectedProduct(product._id);
    await createAndSendTransfer(product._id, product.name, selectedQuantity, "Logistic 2 Warehouse");
    setSelectedProduct(null);
    setQuantity((prev) => ({ ...prev, [product._id]: "" })); // Reset input
  };

    if (loading) {
      return <div><LoadingSpinner/></div>;
    }

  return (
    <>
          <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                Dispatch Products
              </span>
            </div>
          </li>
        </ol>
      </nav>

    <div className="relative overflow-x-auto bg-white mt-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
        <div>
            <h2 className="font-semibold text-xl">Dispatch Products</h2>
        </div>
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input 
                type="text" 
                id="table-search-users" 
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " 
                placeholder="Search for users" 
            />
        </div>
    </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Stocks</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests?.map((product) => (
            <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
              <td className="flex items-center px-6 py-4">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={product.image}
                  alt={product.name}
                />
                <span className="ml-4">{product.name}</span>
              </td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  value={quantity[product._id] || ""}
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10) || "";
                    if (value > product.stock) {
                      value = product.stock; // Restrict to max stock
                    }
                    setQuantity((prev) => ({
                      ...prev,
                      [product._id]: value,
                    }));
                  }}
                  className="w-20 px-2 py-1 border rounded text-center"
                  placeholder="Qty"
                  min="1"
                  max={product.stock}
                />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleSendToLogistic2(product)}
                  disabled={transferLoading && selectedProduct === product._id}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {transferLoading && selectedProduct === product._id
                    ? "Sending..."
                    : "Send to Logistic 2"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white  px-4 sm:px-6">
          <button
              className={`px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 transition-all duration-300 ${
              currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 "
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
          >
              Prev
          </button>

          <div className="flex overflow-x-auto gap-1 px-2">
              {[...Array(totalPages)].map((_, index) => (
              <button
                  key={index}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 "
                  }`}
                  onClick={() => paginate(index + 1)}
              >
                  {index + 1}
              </button>
              ))}
          </div>

          <button
              className={`px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 transition-all duration-300 ${
              currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 "
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
          >
              Next
          </button>
      </div>
    </div>
    </>
  );
};

export default FinishProductTable;
