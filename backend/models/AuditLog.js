import mongoose from 'mongoose';

/**
 * AuditLog Model
 * Comprehensive activity logging for security and compliance
 * Tracks all critical operations in the system
 */
const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'login', 'logout', 'login_failed',
      'user_created', 'user_updated', 'user_deleted',
      'product_created', 'product_updated', 'product_deleted',
      'transaction_created', 'transaction_refunded',
      'password_changed', 'password_reset',
      'shift_started', 'shift_ended',
      'unauthorized_access'
    ],
    index: true
  },
  entity: {
    type: String,
    enum: ['User', 'Product', 'Transaction', 'Shift', 'Auth', 'System'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: String
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Compound indexes for queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

// TTL index to auto-delete old logs after 90 days (configurable)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
