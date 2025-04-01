import express from 'express';
import { Availability } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const availability = await Availability.findAll();
  res.json(availability);
});

export default router;