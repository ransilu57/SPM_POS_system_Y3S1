import express from 'express';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';
import {
    getSalesReport,
    getInventoryReport,
    getCashierPerformanceReport,
    getDashboardStats
} from '../controllers/reportController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/reports/dashboard-stats - Dashboard statistics (Admin & Cashier)
router.get('/dashboard-stats', getDashboardStats);

// GET /api/reports/sales - Sales report (Admin only)
router.get('/sales', adminOnly, getSalesReport);

// GET /api/reports/inventory - Inventory report (Admin only)
router.get('/inventory', adminOnly, getInventoryReport);

// GET /api/reports/cashier-performance - Cashier performance (Admin only)
router.get('/cashier-performance', adminOnly, getCashierPerformanceReport);

export default router;
