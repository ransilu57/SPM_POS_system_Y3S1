import jwt from 'jsonwebtoken';

// Basic authentication middleware - checks if user has valid token
export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token format invalid' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
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
