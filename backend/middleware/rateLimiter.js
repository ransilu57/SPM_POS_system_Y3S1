import rateLimit from 'express-rate-limit';
import AuditLog from '../models/AuditLog.js';

/**
 * Rate Limiter for Login Endpoint
 * Prevents brute force attacks (5 attempts per 15 minutes)
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    // Log excessive login attempts
    await AuditLog.create({
      action: 'login_failed',
      entity: 'Auth',
      details: {
        username: req.body.username,
        reason: 'Rate limit exceeded'
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: false,
      errorMessage: 'Too many login attempts'
    }).catch(console.error);

    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.'
    });
  }
});

/**
 * General API Rate Limiter
 * Prevents abuse of API endpoints (100 requests per 15 minutes)
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict Rate Limiter for Sensitive Operations
 * (e.g., password reset, refunds) - 3 requests per hour
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many requests for this operation. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
