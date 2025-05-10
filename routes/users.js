import express from 'express';
import { registerUser, loginUser, getUserWithProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id/profile', getUserWithProfile);
export default router;
