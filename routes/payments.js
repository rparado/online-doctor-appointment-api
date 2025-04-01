import express from 'express';
import { createPayment, getPayments } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create Payment (Protected)
router.post('/create', authenticateToken, createPayment);

// Get All Payments (Protected)
router.get('/', authenticateToken, getPayments);

export default router;
