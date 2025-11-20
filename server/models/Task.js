import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'shopping', 'other'],
    default: 'personal',
  },
  dueDate: Date,
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  recurring: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none',
  },
  tags: [String],
}, {
  timestamps: true,
});

// Index for efficient queries
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, completed: 1 });

export default mongoose.model('Task', taskSchema);
