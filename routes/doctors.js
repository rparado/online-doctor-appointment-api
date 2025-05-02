import express from 'express';
import { getAllDoctors, getDoctorDetailById } from '../controllers/doctorsController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorDetailById);

export default router;