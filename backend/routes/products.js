import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post('/', addProduct); // Add product
router.get('/', getProducts); // List products
router.put('/:id', updateProduct); // Update product by productId
router.delete('/:id', deleteProduct); // Delete product by productId

export default router;
