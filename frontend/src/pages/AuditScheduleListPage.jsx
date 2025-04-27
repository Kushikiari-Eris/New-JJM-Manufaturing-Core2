import { useState } from "react";
import AuditScheduleList from "../components/AuditScheduleList";
import AuditScheduleForm from "../components/AuditScheduleForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider, useSidebar } from "../components/SidebarContext";
import useAuditScheduleStore from "../stores/useAuditScheduleStore";

const AuditScheduleListPage = () => {
  return (
    <>
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    </>
  );
};

const DashboardLayout = () => {
  const { isCollapsed } = useSidebar();
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState(null);
  const { deleteAudit } = useAuditScheduleStore();

  // Handler for adding a new audit
  const handleAddClick = () => {
    setSelectedAudit(null);
    setIsAddMode(true);
    setIsFormOpen(true);
  };

  // Handler for editing an existing audit
  const handleEditClick = (audit) => {
    setSelectedAudit(audit);
    setIsAddMode(false);
    setIsFormOpen(true);
  };
  
  // Handler for deleting an audit
  const handleDeleteClick = (audit) => {
    setAuditToDelete(audit);
    setIsDeleteConfirmOpen(true);
  };
  
  // Handler for closing the form modal
  const handleFormClose = () => {
    setIsFormOpen(false);
  };
  
  // Handler for confirming audit deletion
  const handleDeleteConfirm = async () => {
    try {
      await deleteAudit(auditToDelete._id);
      setIsDeleteConfirmOpen(false);
      setAuditToDelete(null);
    } catch (err) {
      console.error('Error deleting audit:', err);
    }
  };
  
  // Handler for canceling audit deletion
  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setAuditToDelete(null);
  };

  return (
    <div className="flex transition-all duration-300">
      {/* Sidebar */}
      <div
        className={`fixed h-screen z-20 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className={`transition-all duration-300 flex-1 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 w-full shadow-md z-10">
          <Navbar />
        </div>

        {/* Main content with padding */}
        <main className="mt-20 overflow-y-auto bg-gray-100 min-h-screen transition-all duration-300">
            <div className="p-4">
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
                            Audit Schedule
                        </span>
                        </div>
                    </li>
                </ol>
            </nav>
            </div>
          <div className="p-4 ">
            {/* Page header with Add button */}
            

            <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4 ">
                <h1 className="text-2xl font-bold text-gray-800">Audit Schedule</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Schedule
                </button>
                </div>
                
                {/* Audit schedule list with edit and delete actions */}
                <AuditScheduleList
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                />
            </div>
          </div>
        </main>
      </div>

      {/* Form Modal for adding/editing audits */}
      <AuditScheduleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        audit={selectedAudit}
        isAdd={isAddMode}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the audit "{auditToDelete?.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditScheduleListPage;