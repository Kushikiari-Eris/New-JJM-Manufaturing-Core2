// controllers/documentController.js
import Document from '../models/document.model.js';
import Audit from '../models/audit.model.js';
import Finding from '../models/findings.model.js';

// Get all documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('uploadedBy', '-password');
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single document
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('uploadedBy', '-password');
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create document
export const createDocument = async (req, res) => {
  try {
    const { title, description, fileUrl, fileType, fileSize, uploadedBy, relatedTo } = req.body;
    
    const document = new Document({
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      uploadedBy,
      relatedTo
    });
    
    const savedDocument = await document.save();
    
    // Add document to related model
    if (relatedTo && relatedTo.model && relatedTo.id) {
      if (relatedTo.model === 'Audit') {
        await Audit.findByIdAndUpdate(relatedTo.id, {
          $push: { documents: savedDocument._id }
        });
      } else if (relatedTo.model === 'Finding') {
        await Finding.findByIdAndUpdate(relatedTo.id, {
          $push: { documents: savedDocument._id }
        });
      }
    }
    
    res.status(201).json({ message: 'Document created successfully', document: savedDocument });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    if (title) document.title = title;
    if (description) document.description = description;
    
    await document.save();
    res.json({ message: 'Document updated successfully', document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Remove document from related model
    if (document.relatedTo && document.relatedTo.model && document.relatedTo.id) {
      if (document.relatedTo.model === 'Audit') {
        await Audit.findByIdAndUpdate(document.relatedTo.id, {
          $pull: { documents: document._id }
        });
      } else if (document.relatedTo.model === 'Finding') {
        await Finding.findByIdAndUpdate(document.relatedTo.id, {
          $pull: { documents: document._id }
        });
      }
    }
    
    await document.remove();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
