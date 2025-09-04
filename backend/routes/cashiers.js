import express from 'express';
import {
    getAllCashiers,
    getCashierById,
    createCashier,
    updateCashier,
    deleteCashier
} from '../controllers/cashierController.js';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication first, then admin privileges
router.use(authMiddleware);  // Check if user is logged in
router.use(adminOnly);       // Check if user is admin

// GET /api/cashiers - Get all cashiers
router.get('/', getAllCashiers);

// GET /api/cashiers/:id - Get single cashier
router.get('/:id', getCashierById);

// POST /api/cashiers - Create new cashier
router.post('/', createCashier);

// PUT /api/cashiers/:id - Update cashier
router.put('/:id', updateCashier);

// DELETE /api/cashiers/:id - Delete cashier
router.delete('/:id', deleteCashier);

export default router;
