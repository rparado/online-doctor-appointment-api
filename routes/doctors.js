import express from 'express';
import { Doctor } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const doctors = await Doctor.findAll();
  res.json(doctors);
});

export default router;