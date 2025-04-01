import express from 'express';
import { UserProfile } from '../models/index.js';

const router = express.Router();

// Get User Profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or Update User Profile
router.post('/update', async (req, res) => {
  try {
    const { userId, full_name, phone, address } = req.body;

    // Check if profile exists
    let profile = await UserProfile.findOne({ where: { userId } });

    if (profile) {
      // Update existing profile
      await profile.update({ full_name, phone, address, isProfileUpdated: true });
    } else {
      // Create a new profile
      profile = await UserProfile.create({ userId, full_name, phone, address, isProfileUpdated: true });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
