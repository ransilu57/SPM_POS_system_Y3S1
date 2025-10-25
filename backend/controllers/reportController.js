import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Get sales report
 * GET /api/reports/sales
 * Access: Admin only
 */
export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, cashier, groupBy = 'day' } = req.query;

        const matchStage = { status: 'completed' };

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        if (cashier) {
            matchStage.cashier = cashier;
        }

        // Group by period
        let groupByFormat;
        switch (groupBy) {
            case 'hour':
                groupByFormat = { 
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                    hour: { $hour: '$createdAt' }
                };
                break;
            case 'day':
                groupByFormat = { 
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case 'month':
                groupByFormat = { 
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
                break;
            case 'year':
                groupByFormat = { year: { $year: '$createdAt' } };
                break;
            default:
                groupByFormat = { 
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
        }

        const salesData = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupByFormat,
                    totalSales: { $sum: '$total' },
                    totalTransactions: { $sum: 1 },
                    averageTransaction: { $avg: '$total' },
                    totalDiscount: { $sum: '$discount' },
                    totalTax: { $sum: '$tax' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.hour': -1 } }
        ]);

        // Overall summary
        const summary = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    totalTransactions: { $sum: 1 },
                    averageTransaction: { $avg: '$total' },
                    totalDiscount: { $sum: '$discount' },
                    totalTax: { $sum: '$tax' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                summary: summary[0] || {},
                breakdown: salesData
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to generate sales report' });
    }
};

/**
 * Get inventory report
 * GET /api/reports/inventory
 * Access: Admin only
 */
export const getInventoryReport = async (req, res) => {
    try {
        const { lowStockOnly, category } = req.query;

        const query = {};
        
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ quantity: 1 });

        const lowStockProducts = products.filter(p => p.quantity <= (p.lowStockThreshold || 10));
        const outOfStock = products.filter(p => p.quantity === 0);

        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
        const lowStockValue = lowStockProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);

        const result = {
            summary: {
                totalProducts: products.length,
                totalValue: totalValue.toFixed(2),
                lowStockCount: lowStockProducts.length,
                lowStockValue: lowStockValue.toFixed(2),
                outOfStockCount: outOfStock.length
            },
            products: lowStockOnly === 'true' ? lowStockProducts : products,
            lowStockAlerts: lowStockProducts.map(p => ({
                _id: p._id,
                name: p.name,
                quantity: p.quantity,
                lowStockThreshold: p.lowStockThreshold || 10,
                unitPrice: p.unitPrice,
                category: p.category?.name || 'Uncategorized'
            }))
        };

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to generate inventory report' });
    }
};

/**
 * Get cashier performance report
 * GET /api/reports/cashier-performance
 * Access: Admin only
 */
export const getCashierPerformanceReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = { status: 'completed' };

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const cashierStats = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$cashier',
                    totalSales: { $sum: '$total' },
                    totalTransactions: { $sum: 1 },
                    averageTransaction: { $avg: '$total' },
                    totalItems: { $sum: { $size: '$items' } }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        // Populate cashier details
        const cashierIds = cashierStats.map(stat => stat._id);
        const cashiers = await User.find({ _id: { $in: cashierIds } }).select('username email fullName');

        const cashierMap = {};
        cashiers.forEach(c => {
            cashierMap[c._id.toString()] = c;
        });

        const report = cashierStats.map(stat => ({
            cashier: cashierMap[stat._id.toString()] || { username: 'Unknown' },
            totalSales: stat.totalSales.toFixed(2),
            totalTransactions: stat.totalTransactions,
            averageTransaction: stat.averageTransaction.toFixed(2),
            totalItems: stat.totalItems,
            averageItemsPerTransaction: (stat.totalItems / stat.totalTransactions).toFixed(2)
        }));

        res.json({
            success: true,
            data: {
                period: {
                    start: startDate || 'All time',
                    end: endDate || 'Present'
                },
                cashiers: report
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to generate cashier performance report' });
    }
};

/**
 * Get dashboard statistics
 * GET /api/reports/dashboard-stats
 * Access: Admin, Cashier (limited)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const matchStage = { 
            status: 'completed',
            createdAt: { $gte: today }
        };

        // Cashiers can only see their own stats
        if (req.user.role === 'cashier') {
            matchStage.cashier = req.user._id;
        }

        const [todayStats] = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$total' },
                    totalTransactions: { $sum: 1 },
                    averageTransaction: { $avg: '$total' }
                }
            }
        ]);

        const lowStockCount = await Product.countDocuments({
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
        });

        const outOfStockCount = await Product.countDocuments({ quantity: 0 });

        let cashierCount = 0;
        if (req.user.role === 'admin') {
            cashierCount = await User.countDocuments({ role: 'cashier', isActive: true });
        }

        res.json({
            success: true,
            data: {
                today: {
                    sales: todayStats?.totalSales?.toFixed(2) || '0.00',
                    transactions: todayStats?.totalTransactions || 0,
                    averageTransaction: todayStats?.averageTransaction?.toFixed(2) || '0.00'
                },
                inventory: {
                    lowStock: lowStockCount,
                    outOfStock: outOfStockCount
                },
                cashiers: req.user.role === 'admin' ? { active: cashierCount } : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch dashboard statistics' });
    }
};
