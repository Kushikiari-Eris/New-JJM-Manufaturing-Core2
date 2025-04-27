// models/Finding.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const FindingSchema = new Schema({
  audit: {
    type: Schema.Types.ObjectId,
    ref: 'Audit',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  remediation: {
    plan: String,
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date,
    completedDate: Date
  },
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Finding = model('Finding', FindingSchema);

export default Finding;
