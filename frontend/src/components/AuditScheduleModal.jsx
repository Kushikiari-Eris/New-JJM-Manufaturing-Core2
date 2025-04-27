import React, { useState, useEffect } from 'react';
import AuditScheduleList from './AuditScheduleList';
import AuditScheduleForm from './AuditScheduleForm';
import AuditScheduleDelete from './AuditScheduleDelete';

const AuditScheduleModal = ({ isOpen, onClose }) => {
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState(null);

  const handleAddClick = () => {
    setSelectedAudit(null);
    setIsAddMode(true);
    setIsFormOpen(true);
  };

  const handleEditClick = (audit) => {
    setSelectedAudit(audit);
    setIsAddMode(false);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (audit) => {
    setAuditToDelete(audit);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
  };
  
  const handleDeleteConfirmClose = () => {
    setIsDeleteConfirmOpen(false);
    setAuditToDelete(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 my-8">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Audit Schedule Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Audit
            </button>
          </div>
          
          <AuditScheduleList 
            onEditClick={handleEditClick} 
            onDeleteClick={handleDeleteClick} 
          />
        </div>
      </div>
      
      {/* Form Modal */}
      <AuditScheduleForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        audit={selectedAudit} 
        isAdd={isAddMode} 
      />
      
      {/* Delete Confirmation Modal */}
      <AuditScheduleDelete 
        isOpen={isDeleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        auditToDelete={auditToDelete}
      />
    </div>
  );
};

export default AuditScheduleModal