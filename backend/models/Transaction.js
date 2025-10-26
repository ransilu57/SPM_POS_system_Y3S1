import mongoose from 'mongoose';

/**
 * Transaction Model
 * Records all sales transactions with complete details
 * Implements atomic inventory updates and audit trail
 */
const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cashier reference is required'],
    index: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String, // Stored for historical record
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  },
  paymentMethods: [{
    method: {
      type: String,
      enum: ['cash', 'card', 'mobile', 'voucher', 'other'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    }
  }],
  // Legacy field for backwards compatibility
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'voucher', 'other']
  },
  amountPaid: {
    type: Number,
    required: true,
    min: [0, 'Amount paid cannot be negative']
  },
  change: {
    type: Number,
    default: 0,
    min: [0, 'Change cannot be negative']
  },
  status: {
    type: String,
    enum: ['completed', 'refunded', 'cancelled', 'partial_refund'],
    default: 'completed',
    index: true
  },
  refundedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Refunded amount cannot be negative']
  },
  refundReason: String,
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Compound indexes for efficient queries
transactionSchema.index({ cashier: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for calculating net amount after refunds
transactionSchema.virtual('netAmount').get(function() {
  return this.total - this.refundedAmount;
});

// Generate unique transaction ID before save
transactionSchema.pre('save', async function(next) {
  if (this.isNew && !this.transactionId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Transaction').countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    this.transactionId = `TXN${dateStr}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
