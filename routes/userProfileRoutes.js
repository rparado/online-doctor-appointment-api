import express from 'express';
import { updateUserProfile } from '../controllers/userProfileController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.put('/user/profile', upload.single('avatar'), authenticateToken, updateUserProfile);

export default router;