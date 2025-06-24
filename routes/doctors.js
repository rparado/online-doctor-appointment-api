import express from 'express';
import { getAllDoctors, getDoctorDetailById, getDoctorPatients } from '../controllers/doctorsController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorDetailById);
router.get('/doctor/patients', authenticateToken, getDoctorPatients);

export default router;