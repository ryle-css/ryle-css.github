import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'food', 'transport', 'utilities', 'housing', 
      'entertainment', 'healthcare', 'shopping', 'other'
    ],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital', 'other'],
    default: 'card',
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'] },
  },
  location: String,
  notes: String,
}, {
  timestamps: true,
});

// Compound index for efficient spending analysis
expenseSchema.index({ user: 1, date: 1, category: 1 });

// Static method for monthly summary
expenseSchema.statics.getMonthlySummary = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('Expense', expenseSchema);
