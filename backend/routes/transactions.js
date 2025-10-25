import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    processRefund
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/transactions - Create new transaction (Cashier & Admin)
router.post('/', createTransaction);

// GET /api/transactions - Get all transactions (filtered by role)
router.get('/', getTransactions);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransactionById);

// POST /api/transactions/:id/refund - Process refund (Admin only)
router.post('/:id/refund', authMiddleware, processRefund);

export default router;
