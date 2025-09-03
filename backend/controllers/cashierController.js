import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get all cashiers
export async function getAllCashiers(req, res) {
    try {
        const cashiers = await User.find({ role: 'cashier' }).select('-password');
        res.json({
            success: true,
            data: cashiers,
            message: `Found ${cashiers.length} cashiers`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cashiers',
            error: error.message
        });
    }
}

// Get single cashier by ID
export async function getCashierById(req, res) {
    try {
        const { id } = req.params;
        const cashier = await User.findOne({ _id: id, role: 'cashier' }).select('-password');
        
        if (!cashier) {
            return res.status(404).json({
                success: false,
                message: 'Cashier not found'
            });
        }
        
        res.json({
            success: true,
            data: cashier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cashier',
            error: error.message
        });
    }
}

// Create new cashier
export async function createCashier(req, res) {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Hash password and create cashier
        const hashedPassword = await bcrypt.hash(password, 10);
        const cashier = new User({
            username,
            password: hashedPassword,
            role: 'cashier'
        });
        
        await cashier.save();
        
        // Return cashier without password
        const cashierResponse = {
            _id: cashier._id,
            username: cashier.username,
            role: cashier.role
        };
        
        res.status(201).json({
            success: true,
            data: cashierResponse,
            message: 'Cashier created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating cashier',
            error: error.message
        });
    }
}

// Update cashier
export async function updateCashier(req, res) {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        
        // Find the cashier
        const cashier = await User.findOne({ _id: id, role: 'cashier' });
        if (!cashier) {
            return res.status(404).json({
                success: false,
                message: 'Cashier not found'
            });
        }
        
        // Prepare update data
        const updateData = {};
        
        // Update username if provided
        if (username) {
            // Check if new username already exists (but not for the current user)
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: id } 
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
            updateData.username = username;
        }
        
        // Update password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        // Update the cashier
        const updatedCashier = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json({
            success: true,
            data: updatedCashier,
            message: 'Cashier updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating cashier',
            error: error.message
        });
    }
}

// Delete cashier
export async function deleteCashier(req, res) {
    try {
        const { id } = req.params;
        
        // Find and delete the cashier
        const cashier = await User.findOneAndDelete({ _id: id, role: 'cashier' });
        
        if (!cashier) {
            return res.status(404).json({
                success: false,
                message: 'Cashier not found'
            });
        }
        
        res.json({
            success: true,
            message: `Cashier '${cashier.username}' deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting cashier',
            error: error.message
        });
    }
}
