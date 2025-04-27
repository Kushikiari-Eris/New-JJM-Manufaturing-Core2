// models/Document.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DocumentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  fileType: String,
  fileSize: Number,
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Audit', 'Finding']
    },
    id: {
      type: Schema.Types.ObjectId
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Document = model('Document', DocumentSchema);

export default Document;
