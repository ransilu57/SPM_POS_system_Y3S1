import mongoose from "mongoose";

/**
 * Product Model
 * Manages inventory items with validation and soft delete
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [2, "Product name must be at least 2 characters"],
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true,
    index: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0.01, "Unit price must be positive"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer"
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, "Low stock threshold cannot be negative"]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  image: {
    url: String, // Cloudinary URL
    publicId: String, // Cloudinary public ID for deletion
    // Keeping old structure for backward compatibility
    data: Buffer,
    contentType: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false // Soft delete flag
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ name: 1, isActive: 1, isDeleted: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ quantity: 1, lowStockThreshold: 1 });

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.lowStockThreshold;
});

// Generate SKU if not provided
productSchema.pre('save', function(next) {
  if (this.isNew && !this.sku) {
    const prefix = this.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${prefix}${timestamp}`;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;