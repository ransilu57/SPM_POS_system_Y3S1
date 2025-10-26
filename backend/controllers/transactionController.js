import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * Create a new transaction/sale
 * POST /api/transactions
 * Access: Cashier, Admin
 */
export const createTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, paymentMethods, amountPaid, discount, tax, notes } = req.body;
        const cashierId = req.user._id;

        if (!items || items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let subtotal = 0;
        const transactionItems = [];

        // Validate and calculate totals
        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.quantity < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
                });
            }

            const itemSubtotal = product.unitPrice * item.quantity;
            subtotal += itemSubtotal;

            // Deduct inventory
            product.quantity -= item.quantity;
            await product.save({ session });

            transactionItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.unitPrice,
                subtotal: itemSubtotal
            });
        }

        // Calculate total with discount and tax
        const discountAmount = discount || 0;
        const taxAmount = tax || 0;
        const total = subtotal - discountAmount + taxAmount;

        // Calculate change if paying with cash
        const change = amountPaid ? (amountPaid - total) : 0;

        if (amountPaid && amountPaid < total) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: `Insufficient payment. Required: $${total.toFixed(2)}, Received: $${amountPaid.toFixed(2)}` 
            });
        }

        // Create transaction
        const transaction = new Transaction({
            cashier: cashierId,
            items: transactionItems,
            subtotal,
            discount: discountAmount,
            tax: taxAmount,
            total,
            paymentMethods: paymentMethods || [{ method: 'cash', amount: total }],
            amountPaid: amountPaid || total,
            change,
            status: 'completed',
            notes
        });

        await transaction.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Transaction completed successfully',
            data: transaction,
            change: change > 0 ? change.toFixed(2) : 0
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction error:', error);
        res.status(500).json({ message: error.message || 'Transaction failed' });
    } finally {
        session.endSession();
    }
};

/**
 * Get all transactions with filters
 * GET /api/transactions
 * Access: Admin, Cashier (own transactions only)
 */
export const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, cashier, status, page = 1, limit = 50 } = req.query;
        
        const query = {};
        
        // Cashiers can only see their own transactions
        if (req.user.role === 'cashier') {
            query.cashier = req.user._id;
        } else if (cashier) {
            query.cashier = cashier;
        }
        
        if (status) query.status = status;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        
        const transactions = await Transaction.find(query)
            .populate('cashier', 'username email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch transactions' });
    }
};

/**
 * Get single transaction by ID
 * GET /api/transactions/:id
 * Access: Admin, Cashier (own transaction only)
 */
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('cashier', 'username email fullName')
            .populate('items.product', 'name description');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Cashiers can only view their own transactions
        if (req.user.role === 'cashier' && transaction.cashier._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch transaction' });
    }
};

/**
 * Process refund
 * POST /api/transactions/:id/refund
 * Access: Admin only
 */
export const processRefund = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { refundAmount, refundReason } = req.body;
        const transaction = await Transaction.findById(req.params.id).session(session);

        if (!transaction) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status === 'refunded') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Transaction already refunded' });
        }

        const maxRefund = transaction.total - transaction.refundedAmount;
        if (refundAmount > maxRefund) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: `Refund amount exceeds available amount. Max: $${maxRefund.toFixed(2)}` 
            });
        }

        // Restore inventory
        for (const item of transaction.items) {
            const product = await Product.findById(item.product).session(session);
            if (product) {
                product.quantity += item.quantity;
                await product.save({ session });
            }
        }

        // Update transaction
        transaction.refundedAmount += refundAmount;
        transaction.status = (transaction.refundedAmount >= transaction.total) ? 'refunded' : 'partial_refund';
        transaction.refundReason = refundReason;
        transaction.refundedBy = req.user._id;
        transaction.refundedAt = new Date();

        await transaction.save({ session });
        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Refund processed successfully',
            data: transaction
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message || 'Refund failed' });
    } finally {
        session.endSession();
    }
};
