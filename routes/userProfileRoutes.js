import express from 'express';
import { updateUserProfile } from '../controllers/userProfileController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/update', authenticateToken, updateUserProfile);

export default router;