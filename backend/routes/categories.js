import express from 'express';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/categories - Get all categories (Admin & Cashier)
router.get('/', getCategories);

// GET /api/categories/:id - Get single category (Admin & Cashier)
router.get('/:id', getCategoryById);

// POST /api/categories - Create category (Admin only)
router.post('/', adminOnly, createCategory);

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', adminOnly, updateCategory);

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', adminOnly, deleteCategory);

export default router;
