import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// In-memory blacklist for tokens
export const tokenBlacklist = new Set();

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        
        // Hardcoded admin credentials
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, role: 'admin' });
        }

        // For other users (cashiers), check database
        const user = await User.findOne({ username, isActive: true });
        
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (!user.password) {
            console.log('User has no password:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check if account is locked
        if (user.isLocked) {
            const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ 
                message: `Account is locked. Try again in ${lockTimeRemaining} minutes.` 
            });
        }
        
        // Compare password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            // Increment login attempts
            await user.incLoginAttempts();
            console.log('Password mismatch for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Reset login attempts on successful login
        await user.resetLoginAttempts();
        
        // Generate token
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

export async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;
        
        console.log('Registration attempt:', { username, email, role });
        
        if (!['admin', 'cashier'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('User already exists:', username);
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        
        // Create user - password will be hashed automatically by the pre-save hook
        const user = new User({ 
            username, 
            email, 
            password, 
            role,
            isActive: true
        });
        
        await user.save();
        console.log('User registered successfully:', username);
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { id: user._id, username: user.username, role: user.role, email: user.email } 
        });
        
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
}

export async function logout(req, res) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            tokenBlacklist.add(token);
        }
    }
    res.status(200).json({ message: 'Logout successful' });
}