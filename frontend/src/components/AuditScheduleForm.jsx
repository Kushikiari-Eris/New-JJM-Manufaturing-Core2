import React, { useState, useEffect } from 'react';
import useAuditScheduleStore from '../stores/useAuditScheduleStore';

const AuditScheduleForm = ({ isOpen, onClose, audit, isAdd }) => {
  const { createAudit, updateAudit } = useAuditScheduleStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    assignedTo: '',
    status: 'scheduled',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (audit && !isAdd) {
      const formattedStartDate = new Date(audit.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(audit.endDate).toISOString().split('T')[0];
      
      setFormData({
        title: audit.title || '',
        description: audit.description || '',
        department: audit.department || '',
        assignedTo: audit.assignedTo || '',
        status: audit.status || 'scheduled',
        startDate: formattedStartDate || '',
        endDate: formattedEndDate || ''
      });
    }
  }, [audit, isAdd]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.assignedTo.trim()) newErrors.assignedTo = 'Assigned person is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isAdd) {
        await createAudit(formData);
      } else {
        await updateAudit(audit._id, formData);
      }
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isAdd ? 'Add New Audit' : 'Edit Audit'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Audit Title"
            />
            {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Audit Description"
              rows="3"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                Department
              </label>
              <input
                className={`shadow appearance-none border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
              />
              {errors.department && <p className="text-red-500 text-xs italic mt-1">{errors.department}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
                Assigned To
              </label>
              <input
                className={`shadow appearance-none border ${errors.assignedTo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="assignedTo"
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Assigned To"
              />
              {errors.assignedTo && <p className="text-red-500 text-xs italic mt-1">{errors.assignedTo}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                className={`shadow appearance-none border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && <p className="text-red-500 text-xs italic mt-1">{errors.startDate}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                className={`shadow appearance-none border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <p className="text-red-500 text-xs italic mt-1">{errors.endDate}</p>}
            </div>
          </div>
          
          <div className="flex justify-end border-t pt-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isAdd ? 'Add Audit' : 'Update Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditScheduleForm;