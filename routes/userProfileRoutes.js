import express from 'express';
import { updateUserProfile } from '../controllers/userProfileController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/update', verifyToken, updateUserProfile);

export default router;