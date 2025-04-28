import jwt from 'jsonwebtoken';

import { User } from '../models/index.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next()
  } catch (error) {
    return res.status(403).json({ status: 'failed', message: 'Invalid or expired token.' });
  }
};

export { authenticateToken };
