import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// In-memory blacklist for tokens
export const tokenBlacklist = new Set();

export async function login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET , { expiresIn: '1h' });
    console.log(process.env.JWT_SECRET);
    res.json({ token, role: user.role });
}

export async function register(req, res) {
    const { username, password, role } = req.body;
    if (!['admin', 'cashier'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
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