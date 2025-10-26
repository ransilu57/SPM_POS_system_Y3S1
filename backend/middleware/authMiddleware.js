import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../controllers/authController.js';
import User from '../models/User.js';

// Basic authentication middleware - checks if user has valid token
export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token format invalid' });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(403).json({ message: 'Token has been invalidated. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // For admin (hardcoded), create a mock user object
        if (decoded.username === 'admin') {
            req.user = {
                _id: 'admin',
                username: 'admin',
                role: 'admin'
            };
            return next();
        }
        
        // For database users (cashiers), fetch full user object
        const user = await User.findOne({ username: decoded.username, isActive: true });
        
        if (!user) {
            return res.status(401).json({ message: 'User not found or inactive' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

// Admin-only middleware - use AFTER authMiddleware
export function adminOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    next();
}

// Cashier-only middleware - use AFTER authMiddleware
export function cashierOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'cashier') {
        return res.status(403).json({ message: 'Access denied. Cashier privileges required.' });
    }
    
    next();
}