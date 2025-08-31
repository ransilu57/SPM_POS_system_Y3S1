import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import {} from '../controllers/adminProductController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getDashboard);
router.post('/addproduct', authMiddleware, adminAddProdcut);

export default router;
