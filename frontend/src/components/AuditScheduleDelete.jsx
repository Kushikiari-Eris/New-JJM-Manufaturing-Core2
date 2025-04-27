import React from 'react';
import useAuditScheduleStore from '../stores/useAuditScheduleStore';

const AuditScheduleDelete = ({ isOpen, onClose, auditToDelete }) => {
    const { deleteAudit } = useAuditScheduleStore();
  
    const handleConfirm = async () => {
      try {
        await deleteAudit(auditToDelete._id);
        onClose();
      } catch (err) {
        console.error('Error deleting audit:', err);
      }
    };
    
    if (!isOpen) return null;
    
  return (
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditScheduleDelete;