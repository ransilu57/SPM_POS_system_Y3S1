import express from 'express';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// Routes accessible by both admin and cashier (read-only for cashier)
router.get('/', authMiddleware, getProducts); // List products - both roles
router.get('/:id', authMiddleware, getProductById); // Get single product - both roles

// Admin-only routes (create, update, delete)
router.post('/', authMiddleware, adminOnly, addProduct); // Add product - admin only
router.put('/:id', authMiddleware, adminOnly, updateProduct); // Update product - admin only
router.delete('/:id', authMiddleware, adminOnly, deleteProduct); // Delete product - admin only

export default router;

