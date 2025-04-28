import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';


const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'failed', message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ status: 'failed', message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      role: role || 'patient',
      isProfileUpdated: 0
    });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    await user.update({ token });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isProfileUpdated: 0
      },
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'failed', message: 'Email and password required' });
    }

    // Trim input
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    const user = await User.findOne({ where: { email: emailTrimmed } });

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(passwordTrimmed, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 'failed', message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    await user.update({ token });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isProfileUpdated: user.isProfileUpdated
      },
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
};