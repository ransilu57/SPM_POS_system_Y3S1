import mongoose from 'mongoose';

/**
 * Shift Model
 * Tracks cashier work shifts for accountability and reporting
 */
const shiftSchema = new mongoose.Schema({
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cashier reference is required'],
    index: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    index: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
    index: true
  },
  openingCash: {
    type: Number,
    required: [true, 'Opening cash amount is required'],
    min: [0, 'Opening cash cannot be negative']
  },
  closingCash: {
    type: Number,
    min: [0, 'Closing cash cannot be negative']
  },
  expectedCash: {
    type: Number,
    default: 0
  },
  cashDifference: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: [0, 'Total sales cannot be negative']
  },
  totalTransactions: {
    type: Number,
    default: 0,
    min: [0, 'Total transactions cannot be negative']
  },
  notes: String
}, {
  timestamps: true
});

// Compound indexes
shiftSchema.index({ cashier: 1, startTime: -1 });
shiftSchema.index({ status: 1, startTime: -1 });

// Validate only one active shift per cashier
shiftSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    const activeShift = await mongoose.model('Shift').findOne({
      cashier: this.cashier,
      status: 'active'
    });
    if (activeShift) {
      throw new Error('Cashier already has an active shift');
    }
  }
  next();
});

// Calculate cash difference when closing shift
shiftSchema.pre('save', function(next) {
  if (this.closingCash !== undefined && this.expectedCash !== undefined) {
    this.cashDifference = this.closingCash - this.expectedCash;
  }
  next();
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
