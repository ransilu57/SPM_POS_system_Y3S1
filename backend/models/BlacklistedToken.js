import mongoose from 'mongoose';

/**
 * BlacklistedToken Model
 * Stores invalidated JWT tokens to prevent reuse after logout
 * Uses TTL index for automatic cleanup of expired tokens
 */
const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: { expires: 0 } // TTL index - documents auto-delete when expiresAt is reached
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['logout', 'security', 'password_change'],
    default: 'logout'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
blacklistedTokenSchema.index({ token: 1, expiresAt: 1 });

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

export default BlacklistedToken;
