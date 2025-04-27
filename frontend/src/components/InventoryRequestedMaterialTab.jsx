import React, { useEffect, useState } from "react";
import useAuditStore from "../stores/useAuditRawMaterialStore";
import useRawMaterialStore from "../stores/useRawMaterialStore";
import LoadingSpinner from "./LoadingSpinner";

const InventoryRequestedMaterialTab = () => {
  const { audits, loading, fetchAudits, updateAuditStatus } = useAuditStore();
  const { addRawMaterial, fetchRawMaterials, updateRawMaterial } = useRawMaterialStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust as needed
    const [paginatedRequests, setPaginatedRequests] = useState([]);

    const totalPages = Math.ceil(audits.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

  useEffect(() => {
    fetchAudits();
    fetchRawMaterials()
  }, [fetchAudits, fetchRawMaterials]);

    // Update paginatedRequests whenever requests or currentPage changes
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = audits.slice(indexOfFirstItem, indexOfLastItem);
        setPaginatedRequests(currentItems);
    }, [audits, currentPage]);



const handleApprove = async (audit) => {
  if (!audit.rawMaterial || audit.rawMaterial.length === 0) {
    alert("No materials to approve.");
    return;
  }

  // ✅ Fetch the latest raw materials
  let existingMaterials = await fetchRawMaterials();

  for (const mat of audit.rawMaterial) {
    // ✅ Ensure case-insensitive comparison to prevent duplicates
    const existingMaterial = existingMaterials.find(
      (m) => m.materialName.toLowerCase() === mat.itemName.toLowerCase()
    );

    if (existingMaterial) {
      // ✅ Update quantity if material exists
      console.log(`Updating material: ${existingMaterial.materialName} by adding quantity: ${mat.quantity}`);
      const updatedMaterial = await updateRawMaterial(existingMaterial._id, mat.quantity);

      if (updatedMaterial) {
        // ✅ Update local materials list to prevent duplicate API calls
        existingMaterial.quantity = updatedMaterial.quantity;
      }
    } else {
      // ✅ Add new material if it doesn't exist
      console.log(`Adding new material: ${mat.itemName}`);
      const newMaterial = await addRawMaterial({
        materialName: mat.itemName,
        quantity: mat.quantity,
        unit: mat.unit,
      });

      if (newMaterial) {
        existingMaterials.push(newMaterial); // ✅ Prevent adding duplicate material in the loop
      }
    }
  }

  // ✅ Fetch updated materials again to ensure frontend reflects the changes
  await fetchRawMaterials();

  // ✅ Update audit status
  await updateAuditStatus(audit._id, "Approved");
  console.log("Audit updated:", audit._id);
};


      if (loading) {
            return <div><LoadingSpinner/></div>;
        }
  return (
    <>
      <div className="relative overflow-x-auto bg-white">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
          <h2 className="font-semibold text-xl">Requested Raw Materials</h2>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block p-2 ps-10 text-sm border border-gray-300 rounded-lg w-80 bg-gray-50"
              placeholder="Search for users"
            />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Materials</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((audit) => (
                    <tr
                      key={audit._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold">{audit.sender}</td>
                      <td className="px-6 py-4">
                        {audit.rawMaterial.length > 0 ? (
                          audit.rawMaterial.map((mat, index) => (
                            <div key={index}>
                              {mat.itemName} - {mat.quantity} {mat.unit}
                            </div>
                          ))
                        ) : (
                          <span>No Materials</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{audit.status}</td>
                      <td className="px-6 py-4">
                        {audit.status !== "Approved" ? (
                          <button
                            onClick={() => handleApprove(audit)}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-green-500">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No Raw Materials Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
             <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white px-4 sm:px-6">
                <button
                    className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
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
                            : "text-gray-700  hover:bg-gray-200 "
                        }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                    ))}
                </div>

                <button
                    className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
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
        )}
      </div>
    </>
  );
};

export default InventoryRequestedMaterialTab;
