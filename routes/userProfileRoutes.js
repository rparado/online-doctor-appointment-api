import express from 'express';
import { updateUserProfile } from '../controllers/userProfileController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.put('/:userId/update',  authenticateToken, upload.single('avatar'), updateUserProfile);

export default router;