import { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useSocket } from "../context/SocketContext";


const MaintenanceTable = () => {
    const socket = useSocket();
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [formData, setFormData] = useState({
        equipmentId: "",
        equipmentName: "",
        maintenanceType: "Preventive",
        scheduledDate: "",
        technician: "",
        notes: "",
    });

      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(5); // Adjust as needed
      const [paginatedRequests, setPaginatedRequests] = useState([]);
  
      const totalPages = Math.ceil(maintenanceRecords.length / itemsPerPage);
  
      const paginate = (pageNumber) => {
          if (pageNumber >= 1 && pageNumber <= totalPages) {
              setCurrentPage(pageNumber);
          }
      };
  
        useEffect(() => {
        fetchMaintenanceRecords();
      }, []);
  
      // Update paginatedRequests whenever requests or currentPage changes
      useEffect(() => {
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = maintenanceRecords.slice(indexOfFirstItem, indexOfLastItem);
          setPaginatedRequests(currentItems);
      }, [maintenanceRecords, currentPage]);

const fetchMaintenanceRecords = async () => {
    try {
        const res = await axios.get("/maintenance");

        console.log("Before sorting:", res.data);

        const sortedRecords = [...res.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        console.log("After sorting:", sortedRecords);

        setMaintenanceRecords(sortedRecords);
    } catch (error) {
        console.error("Error fetching maintenance records:", error);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/maintenance", formData);
        fetchMaintenanceRecords();
    };

    const handleUpdate = async (id, status) => {
        await axios.put(`/maintenance/${id}`, { status });
        fetchMaintenanceRecords();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/maintenance/${id}`);
        fetchMaintenanceRecords();
    };
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">
                Maintenance
              </span>
            </div>
          </li>
        </ol>
      </nav>
    


    {/* Open the modal using document.getElementById('ID').showModal() method */}
<dialog id="my_modal_2" className="modal">
  <div className="modal-box rounded-lg shadow-lg p-6 bg-white">
    <h3 className="font-semibold text-xl text-gray-800 mb-4">Add Maintenance Schedule</h3>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Equipment Name */}
      <div>
        <label className="block text-gray-700 font-medium">Equipment Name</label>
        <input 
          type="text" 
          placeholder="Enter equipment name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
        />
      </div>

      {/* Maintenance Type */}
      <div>
        <label className="block text-gray-700 font-medium">Maintenance Type</label>
        <select 
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
        >
          <option value="Preventive">Preventive</option>
          <option value="Corrective">Corrective</option>
          <option value="Predictive">Predictive</option>
          <option value="Routine">Routine</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      {/* Scheduled Date */}
      <div>
        <label className="block text-gray-700 font-medium">Scheduled Date</label>
        <input 
          type="date" 
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
        />
      </div>

      {/* Technician */}
      <div>
        <label className="block text-gray-700 font-medium">Technician</label>
        <input 
          type="text" 
          placeholder="Enter technician name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
        >
          Add
        </button>  
        <button 
            type="button" 
            onClick={() => document.getElementById('my_modal_2').close()} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-lg transition"
        >
            Close
        </button>
      </div>
    </form>
  </div>
</dialog>



    <div className="relative overflow-x-auto bg-white rounded-md mt-10">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row p-4">
        <div>
            <h2 className="font-semibold text-xl">Maintenance</h2>
        </div>
        <div className="flex items-center gap-x-3">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
            <div>
                <button className="bg-blue-500 py-2 px-4 rounded text-white font-semibold text-base hover:bg-blue-600 " onClick={()=>document.getElementById('my_modal_2').showModal()}>Add</button>
            </div>
        </div>
        </div>


      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Equipment</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Scheduled</th>
            <th className="px-6 py-3">Technician</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((record) => (
            <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
              <td className="flex items-center px-6 py-4">
                
                <span className="ml-4">{record.equipmentName}</span>
              </td>
              <td className="px-6 py-4">{record.maintenanceType}</td>
              <td className="px-6 py-4">{new Date(record.scheduledDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">{record.technician}</td>
              <td>
                <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full me-2 
                        ${record.status === "Scheduled" ? "bg-yellow-500" :
                          record.status === "Completed" ? "bg-green-500" :
                          record.status === "Overdue" ? "bg-red-500" :
                          record.status === "In Progress" ? "bg-blue-500" : "bg-gray-400"
                        }`}
                    ></div> 
                    {record.status}
                  </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleUpdate(record._id, "Completed")}
                  className={`rounded text-white px-2 py-1 mr-2 
                    ${record.status === "Completed" || record.status === "Overdue" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"}`}
                  disabled={record.status === "Completed" || record.status === "Overdue"}
                >
                  Complete
                </button>
                <button onClick={() => handleDelete(record._id)} className="bg-red-500 text-white rounded px-2 py-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <div className="flex flex-wrap justify-center items-center space-x-2 py-4 bg-white  px-4 sm:px-6">
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
                className={`px-4 py-2 rounded-md text-gray-600 transition-all duration-300 ${
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
  )
}

export default MaintenanceTable