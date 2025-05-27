import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserProfile, Doctor } from '../models/index.js';


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

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    const user = await User.findOne({
      where: { email: emailTrimmed },
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: Doctor, as: 'Doctor' } // optional if patient may not have Doctor profile
      ]
    });

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(passwordTrimmed, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'failed', message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    user.token = token;
    await user.save();

    // Prepare response data
    const responseData = {
      id: user.id,
      email: user.email,
      role: user.role,
      isProfileUpdated: user.isProfileUpdated,
      userProfile: user.UserProfile || null,
    };

    if (user.role === 'doctor') {
      responseData.doctorProfile = user.Doctor || null;
    }

    return res.status(200).json({
      status: 'success',
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
      token,
      user: responseData
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
};

export const getUserWithProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserProfile,

        }
      ]
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      data: user
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};