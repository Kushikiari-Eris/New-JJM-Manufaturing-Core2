// models/Task.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Tasks = model('Tasks', TaskSchema);

export default Tasks;
