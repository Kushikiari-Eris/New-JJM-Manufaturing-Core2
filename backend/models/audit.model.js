// models/Audit.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AuditSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  auditor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  findings: [{
    type: Schema.Types.ObjectId,
    ref: 'Finding'
  }],
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

const Audit = model('Audit', AuditSchema);

export default Audit;
