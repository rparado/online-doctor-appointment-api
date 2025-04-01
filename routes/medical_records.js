import express from 'express';
import { MedicalRecord } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const records = await MedicalRecord.findAll();
  res.json(records);
});

export default router;