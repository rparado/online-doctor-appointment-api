import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'patient',
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.log('Error in registerUser:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save token to the database
    user.token = token;
    await user.save();

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log('Error in loginUser:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
